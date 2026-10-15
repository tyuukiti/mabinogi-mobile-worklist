/* マビモバ 日課・週課リスト - アプリ本体（依存ライブラリなし） */
(function () {
  "use strict";

  var STORAGE_KEY = "mabimoba_worklist_v1";
  var DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
  var FLAVORS = ["auto", "latte", "frappe", "macchiato", "mocha"]; // Catppuccin
  var DEFAULTS = Array.isArray(window.DEFAULT_TASKS) ? window.DEFAULT_TASKS : [];

  // ------------------------------------------------------------
  // ストレージ
  // ------------------------------------------------------------
  var storageOK = (function () {
    try {
      var k = "__mm_test__";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function defaultState() {
    return {
      version: 1,
      settings: {
        dailyResetHour: 6,
        weeklyResetDay: 1,
        weeklyResetHour: 6,
        hideCompleted: false,
        flavor: "auto"
      },
      visible: {},      // id -> boolean（未設定なら既定値）
      order: [],        // 表示順（id の配列）
      orderMoved: [],   // ユーザーが ↑↓ で動かした id（これ以外の既定項目は tasks.js の並びに揃える）
      overrides: {},    // 既定項目の上書き id -> {name, category, count, note, days}
      customTasks: [],  // ユーザー追加項目
      progress: {
        daily: { period: null, done: {} },
        weekly: { period: null, done: {} }
      }
    };
  }

  function loadState() {
    var base = defaultState();
    if (!storageOK) return base;
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return base; }
    if (!raw) return base;
    try {
      var parsed = JSON.parse(raw);
      return mergeState(base, parsed);
    } catch (e) {
      console.warn("保存データの読み込みに失敗したため初期状態で開始します", e);
      return base;
    }
  }

  // 保存データを既定構造に安全に合成する（インポート時にも使う）
  function mergeState(base, src) {
    if (!src || typeof src !== "object") return base;
    var s = base;
    if (src.settings && typeof src.settings === "object") {
      var st = src.settings;
      if (isInt(st.dailyResetHour, 0, 23)) s.settings.dailyResetHour = st.dailyResetHour;
      if (isInt(st.weeklyResetDay, 0, 6)) s.settings.weeklyResetDay = st.weeklyResetDay;
      if (isInt(st.weeklyResetHour, 0, 23)) s.settings.weeklyResetHour = st.weeklyResetHour;
      s.settings.hideCompleted = !!st.hideCompleted;
      if (FLAVORS.indexOf(st.flavor) >= 0) s.settings.flavor = st.flavor;
      else if (st.theme === "light") s.settings.flavor = "latte"; // 旧設定からの移行
      else if (st.theme === "dark") s.settings.flavor = "mocha";
    }
    if (src.visible && typeof src.visible === "object") {
      Object.keys(src.visible).forEach(function (id) { s.visible[id] = !!src.visible[id]; });
    }
    if (Array.isArray(src.order)) {
      s.order = src.order.filter(function (id) { return typeof id === "string"; });
    }
    if (Array.isArray(src.orderMoved)) {
      s.orderMoved = src.orderMoved.filter(function (id) { return typeof id === "string"; });
    }
    if (src.overrides && typeof src.overrides === "object") {
      Object.keys(src.overrides).forEach(function (id) {
        var o = sanitizeTaskFields(src.overrides[id]);
        if (o && Object.keys(o).length) s.overrides[id] = o;
      });
    }
    if (Array.isArray(src.customTasks)) {
      src.customTasks.forEach(function (t) {
        if (!t || typeof t.id !== "string") return;
        var f = sanitizeTaskFields(t);
        if (!f || !f.name) return;
        f.id = t.id;
        f.type = t.type === "weekly" ? "weekly" : "daily";
        s.customTasks.push(f);
      });
    }
    if (src.progress && typeof src.progress === "object") {
      ["daily", "weekly"].forEach(function (type) {
        var p = src.progress[type];
        if (!p || typeof p !== "object") return;
        s.progress[type].period = typeof p.period === "string" ? p.period : null;
        if (p.done && typeof p.done === "object") {
          Object.keys(p.done).forEach(function (id) {
            var n = Number(p.done[id]);
            if (isFinite(n) && n > 0) s.progress[type].done[id] = Math.floor(n);
          });
        }
      });
    }
    return s;
  }

  function sanitizeTaskFields(t) {
    if (!t || typeof t !== "object") return null;
    var out = {};
    if (typeof t.name === "string") out.name = t.name.trim().slice(0, 80);
    if (typeof t.category === "string") out.category = t.category.trim().slice(0, 20);
    if (typeof t.note === "string") out.note = t.note.trim().slice(0, 120);
    if (typeof t.sub === "string") out.sub = t.sub.trim().slice(0, 120);
    if (typeof t.place === "string") out.place = t.place.trim().slice(0, 20);
    if (t.count !== undefined && t.count !== "") {
      var c = Number(t.count);
      if (isFinite(c) && c >= 1) out.count = Math.min(999, Math.floor(c));
    }
    if (Array.isArray(t.days)) {
      var days = t.days.map(Number).filter(function (d) { return isInt(d, 0, 6); });
      out.days = uniq(days);
    }
    return out;
  }

  function saveState() {
    if (!storageOK) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("保存に失敗しました: " + e.message);
    }
  }

  // ------------------------------------------------------------
  // ユーティリティ
  // ------------------------------------------------------------
  function isInt(v, min, max) {
    return typeof v === "number" && isFinite(v) && Math.floor(v) === v && v >= min && v <= max;
  }
  function uniq(arr) {
    var seen = {}; var out = [];
    arr.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(id) { return document.getElementById(id); }
  function genId() {
    return "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }
  function fmtDateTime(d) {
    return (d.getMonth() + 1) + "/" + d.getDate() + "（" + DAY_NAMES[d.getDay()] + "）" + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }
  function fmtRemain(ms) {
    if (ms < 0) ms = 0;
    var totalMin = Math.floor(ms / 60000);
    var days = Math.floor(totalMin / 1440);
    var hours = Math.floor((totalMin % 1440) / 60);
    var mins = totalMin % 60;
    if (days > 0) return "あと " + days + "日" + hours + "時間";
    if (hours > 0) return "あと " + hours + "時間" + mins + "分";
    return "あと " + mins + "分";
  }
  // 曜日配列を 月→日 の順に並べて表示用文字列にする
  function fmtDays(days) {
    return days.slice().sort(function (a, b) { return ((a + 6) % 7) - ((b + 6) % 7); })
      .map(function (d) { return DAY_NAMES[d]; }).join("・");
  }

  // カテゴリ名 → 色スラッグ。未知のカテゴリは名前のハッシュで 6 色から固定で割り当てる
  var CAT_SLUGS = {
    "ログイン": "login", "ミッション": "mission", "ギルド": "guild", "ショップ": "shop", "戦闘": "battle",
    "クエスト": "quest", "リソース": "resource", "生活": "life", "物々交換": "barter", "その他": "other"
  };
  var EXTRA_SLUGS = ["x1", "x2", "x3", "x4", "x5", "x6"];
  function catSlug(name) {
    name = String(name || "");
    if (CAT_SLUGS[name]) return CAT_SLUGS[name];
    if (name.indexOf("物々交換") === 0) return "barter"; // 「物々交換: 町名」も同じ色

    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return EXTRA_SLUGS[h % EXTRA_SLUGS.length];
  }

  // 「A → B」の形は矢印の前後でだけ折り返せるようにする
  function fmtSub(sub) {
    var parts = String(sub).split("→");
    if (parts.length !== 2) return esc(sub);
    return '<span class="give">' + esc(parts[0].trim()) + '</span><span class="arrow">→</span><span class="get">' + esc(parts[1].trim()) + "</span>";
  }

  var toastTimer = null;
  function toast(msg, action) {
    var el = $("toast");
    el.textContent = msg;
    if (action) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "toast-action";
      b.textContent = action.label;
      b.addEventListener("click", function () { el.hidden = true; action.fn(); });
      el.appendChild(b);
    }
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, action ? 6000 : 2600);
  }

  // ------------------------------------------------------------
  // 期間（リセット）計算
  // ------------------------------------------------------------
  function shifted(now, hour) {
    return new Date(now.getTime() - hour * 3600 * 1000);
  }
  // デイリー期間キー: リセット時刻を 0 時とみなした日付
  function dailyPeriodKey(now) {
    return ymd(shifted(now, state.settings.dailyResetHour));
  }
  // ウィークリー期間キー: 直近のリセット曜日の日付
  function weeklyPeriodKey(now) {
    var s = shifted(now, state.settings.weeklyResetHour);
    var diff = (s.getDay() - state.settings.weeklyResetDay + 7) % 7;
    var start = new Date(s.getFullYear(), s.getMonth(), s.getDate() - diff);
    return ymd(start);
  }
  // デイリー期間の「論理的な日付」（曜日判定に使う）
  function dailyPeriodDate(now) {
    var s = shifted(now, state.settings.dailyResetHour);
    return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  }
  function nextDailyReset(now) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), state.settings.dailyResetHour, 0, 0, 0);
    if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
    return d;
  }
  function nextWeeklyReset(now) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), state.settings.weeklyResetHour, 0, 0, 0);
    var diff = (state.settings.weeklyResetDay - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + diff);
    if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
    return d;
  }

  // 期限を過ぎていたら進捗をリセットする。変更があれば true
  function checkResets() {
    var now = new Date();
    var changed = false;
    var dk = dailyPeriodKey(now);
    var wk = weeklyPeriodKey(now);
    if (state.progress.daily.period !== dk) {
      var hadDaily = Object.keys(state.progress.daily.done).length > 0;
      state.progress.daily = { period: dk, done: {} };
      changed = true;
      if (hadDaily) toast("デイリーの達成状況をリセットしました");
    }
    if (state.progress.weekly.period !== wk) {
      var hadWeekly = Object.keys(state.progress.weekly.done).length > 0;
      state.progress.weekly = { period: wk, done: {} };
      changed = true;
      if (hadWeekly) toast("ウィークリーの達成状況をリセットしました");
    }
    if (changed) saveState();
    return changed;
  }

  // ------------------------------------------------------------
  // タスク一覧の合成
  // ------------------------------------------------------------
  function allTasks() {
    var list = DEFAULTS.map(function (t) {
      var o = state.overrides[t.id] || {};
      var m = {};
      Object.keys(t).forEach(function (k) { m[k] = t[k]; });
      Object.keys(o).forEach(function (k) { m[k] = o[k]; });
      m.builtin = true;
      m.overridden = Object.keys(o).length > 0;
      return m;
    }).concat(state.customTasks.map(function (t) {
      var m = {};
      Object.keys(t).forEach(function (k) { m[k] = t[k]; });
      m.builtin = false;
      m.overridden = false;
      return m;
    }));
    list.forEach(function (t, i) {
      if (!t.count || t.count < 1) t.count = 1;
      if (!t.category) t.category = "その他";
      t._i = i;
    });
    var idx = {};
    state.order.forEach(function (id, i) { idx[id] = i; });
    list.sort(function (a, b) {
      var ia = idx[a.id] !== undefined ? idx[a.id] : 1e9 + a._i;
      var ib = idx[b.id] !== undefined ? idx[b.id] : 1e9 + b._i;
      return ia - ib;
    });
    return list;
  }

  // order 配列を実在する id で正規化し、新規項目は同種別の末尾へ入れる
  // order 配列を実在する id で正規化する。
  //  - 独自項目や新規項目は、まず同種別の末尾に入れる
  //  - そのうえで「ユーザーが動かしていない既定項目」同士の並びを tasks.js の順に揃える
  //    （動かした項目と独自項目は今の位置のまま）。後から追加された既定項目が末尾に取り残されない
  function syncOrder() {
    var tasks = allTasks();
    var exists = {};
    tasks.forEach(function (t) { exists[t.id] = t; });
    var order = state.order.filter(function (id) { return exists[id]; });
    var inOrder = {};
    order.forEach(function (id) { inOrder[id] = 1; });
    tasks.forEach(function (t) {
      if (inOrder[t.id]) return;
      var lastIdx = -1;
      for (var i = 0; i < order.length; i++) {
        if (exists[order[i]].type === t.type) lastIdx = i;
      }
      if (lastIdx < 0) order.push(t.id);
      else order.splice(lastIdx + 1, 0, t.id);
      inOrder[t.id] = 1;
    });

    var moved = {};
    state.orderMoved = state.orderMoved.filter(function (id) { return exists[id]; });
    state.orderMoved.forEach(function (id) { moved[id] = 1; });
    var defIndex = {};
    DEFAULTS.forEach(function (d, i) { defIndex[d.id] = i; });
    ["daily", "weekly"].forEach(function (type) {
      // 動かしていない既定項目が占めている位置（スロット）を集め、tasks.js の順で詰め直す
      var slots = [];
      for (var i = 0; i < order.length; i++) {
        var t = exists[order[i]];
        if (t.type === type && t.builtin && !moved[t.id]) slots.push(i);
      }
      var ids = slots.map(function (i) { return order[i]; })
        .sort(function (x, y) { return defIndex[x] - defIndex[y]; });
      slots.forEach(function (pos, k) { order[pos] = ids[k]; });
    });
    state.order = order;
  }

  function isVisible(t) {
    if (state.visible[t.id] !== undefined) return state.visible[t.id];
    return t.builtin ? !!t.default : true;
  }
  function matchesDay(t, dow) {
    if (!t.days || t.days.length === 0) return true;
    return t.days.indexOf(dow) >= 0;
  }
  function doneCount(t) {
    var n = state.progress[t.type].done[t.id];
    return n ? Math.min(n, t.count) : 0;
  }
  function setDone(t, n) {
    n = Math.max(0, Math.min(t.count, n));
    if (n === 0) delete state.progress[t.type].done[t.id];
    else state.progress[t.type].done[t.id] = n;
    saveState();
  }
  function tasksForView(type) {
    var dow = dailyPeriodDate(new Date()).getDay();
    return allTasks().filter(function (t) {
      return t.type === type && isVisible(t) && (type !== "daily" || matchesDay(t, dow));
    });
  }
  function findTask(id) {
    var list = allTasks();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // ------------------------------------------------------------
  // メイン画面の描画
  // ------------------------------------------------------------
  function render() {
    renderList("daily");
    renderList("weekly");
    renderHeader();
    renderCountdown();
    $("opt-hide-completed").checked = !!state.settings.hideCompleted;
  }

  function renderHeader() {
    var now = new Date();
    var d = dailyPeriodDate(now);
    var wk = weeklyPeriodKey(now).split("-");
    $("period-label").textContent =
      (d.getMonth() + 1) + "/" + d.getDate() + "（" + DAY_NAMES[d.getDay()] + "）のデイリー ／ " +
      Number(wk[1]) + "/" + Number(wk[2]) + "（" + DAY_NAMES[state.settings.weeklyResetDay] + "）開始の週";
  }

  function renderCountdown() {
    var now = new Date();
    var nd = nextDailyReset(now);
    var nw = nextWeeklyReset(now);
    $("daily-next").textContent = fmtDateTime(nd);
    $("daily-countdown").textContent = fmtRemain(nd - now);
    $("weekly-next").textContent = fmtDateTime(nw);
    $("weekly-countdown").textContent = fmtRemain(nw - now);
  }

  // byDay を持つ項目は、デイリー期間の曜日に応じた name / sub / note を返す
  function dayVariant(t, dow) {
    var v = t.byDay && t.byDay[dow];
    if (!v) return t;
    var m = {};
    Object.keys(t).forEach(function (k) { m[k] = t[k]; });
    if (v.name) m.name = v.name;
    if (v.sub !== undefined) m.sub = v.sub;
    if (v.note !== undefined) m.note = v.note;
    return m;
  }

  function renderList(type) {
    var dow = dailyPeriodDate(new Date()).getDay();
    var tasks = tasksForView(type).map(function (t) { return type === "daily" ? dayVariant(t, dow) : t; });
    var container = $(type + "-list");
    var total = tasks.length;
    var doneN = 0;
    var hidden = 0;
    var rows = [];

    tasks.forEach(function (t) {
      var n = doneCount(t);
      var complete = n >= t.count;
      if (complete) doneN++;
      if (complete && state.settings.hideCompleted) { hidden++; return; }
      rows.push({ t: t, n: n, complete: complete });
    });

    var html = "";
    if (total === 0) {
      html = '<div class="empty">表示する項目がありません。<br>見出し右の「表示項目」から選んでください。</div>';
    } else {
      // 表示順はユーザーの並び順そのまま。カテゴリが切り替わる箇所に見出しを入れる
      var lastCat = null;
      rows.forEach(function (it) {
        var t = it.t;
        if (t.category !== lastCat) {
          html += '<div class="group-title" data-cat="' + catSlug(t.category) + '"><span class="cat-dot"></span>' + esc(t.category) + "</div>";
          lastCat = t.category;
        }
        var cls = "task" + (it.complete ? " done" : (it.n > 0 ? " partial" : ""));
        html += '<div class="' + cls + '" data-id="' + esc(t.id) + '" data-cat="' + catSlug(t.category) + '" role="button" tabindex="0" aria-pressed="' + (it.complete ? "true" : "false") + '">';
        html += '<button type="button" class="task-hide" data-act="hide" aria-label="「' + esc(t.name) + '」を表示項目から外す" title="表示項目から外す">×</button>';
        html += '<span class="task-check" aria-hidden="true"><svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="check-path" d="M4 12L10 18L20 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
        html += '<div class="task-body"><div class="task-name">' + esc(t.name);
        if (t.place) html += '<span class="chip muted">' + esc(t.place) + "</span>";
        if (t.days && t.days.length) html += '<span class="chip muted">' + fmtDays(t.days) + "</span>";
        html += "</div>";
        if (t.sub) html += '<div class="task-sub">' + fmtSub(t.sub) + "</div>";
        if (t.note) html += '<div class="task-note">' + esc(t.note) + "</div>";
        html += "</div>";
        if (t.count > 1) {
          html += '<div class="task-counter">' +
            '<button type="button" class="btn small" data-act="dec" aria-label="1 回減らす"' + (it.n <= 0 ? " disabled" : "") + ">−</button>" +
            '<span class="num">' + it.n + " / " + t.count + "</span>" +
            '<button type="button" class="btn small" data-act="inc" aria-label="1 回増やす"' + (it.complete ? " disabled" : "") + ">＋</button>" +
            "</div>";
        }
        html += "</div>";
      });
      if (hidden > 0) {
        html += '<div class="empty">完了した ' + hidden + " 件を非表示中</div>";
      }
    }
    container.innerHTML = html;

    $(type + "-progress-text").textContent = doneN + " / " + total;
    var fill = $(type + "-progress-fill");
    fill.style.width = total ? Math.round(doneN / total * 100) + "%" : "0%";
    fill.classList.toggle("complete", total > 0 && doneN === total);
  }

  // カード右上の × : 表示項目から外す（トーストから元に戻せる）
  function hideTask(t) {
    state.visible[t.id] = false;
    saveState();
    render();
    toast("「" + t.name + "」を表示項目から外しました", {
      label: "元に戻す",
      fn: function () {
        state.visible[t.id] = true;
        saveState();
        render();
      }
    });
  }

  // 完了になった直後のカードにだけ弾むアニメーションを付ける
  function popTask(t, wasComplete) {
    if (wasComplete || doneCount(t) < t.count) return;
    var el = $(t.type + "-list").querySelector('.task[data-id="' + t.id.replace(/"/g, '\\"') + '"]');
    if (el) el.classList.add("pop");
  }

  function onListClick(e) {
    var row = e.target.closest(".task");
    if (!row) return;
    var t = findTask(row.getAttribute("data-id"));
    if (!t) return;
    var btn = e.target.closest("button[data-act]");
    var n = doneCount(t);
    var wasComplete = n >= t.count;
    if (btn && btn.getAttribute("data-act") === "hide") {
      hideTask(t);
      return;
    }
    if (btn) {
      if (btn.disabled) return;
      var act = btn.getAttribute("data-act");
      setDone(t, act === "inc" ? n + 1 : n - 1);
    } else {
      // 行クリック: 未完了なら完了に、完了なら 0 に
      setDone(t, n >= t.count ? 0 : t.count);
    }
    renderList(t.type);
    popTask(t, wasComplete);
  }

  function onListKey(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    var row = e.target.closest(".task");
    if (!row || e.target !== row) return;
    e.preventDefault();
    var t = findTask(row.getAttribute("data-id"));
    if (!t) return;
    var n = doneCount(t);
    var wasComplete = n >= t.count;
    setDone(t, n >= t.count ? 0 : t.count);
    renderList(t.type);
    popTask(t, wasComplete);
    var again = $(t.type + "-list").querySelector('.task[data-id="' + t.id.replace(/"/g, '\\"') + '"]');
    if (again) again.focus();
  }

  // ------------------------------------------------------------
  // 表示項目のカスタマイズ
  // ------------------------------------------------------------
  var customizeTab = "daily";

  // 列ごとの専用ダイアログとして開く（デイリーの「表示項目」ならデイリーの項目だけ）
  function openCustomize() {
    var dlg = $("dlg-customize");
    dlg.setAttribute("data-type", customizeTab);
    $("customize-title").textContent = (customizeTab === "weekly" ? "ウィークリー" : "デイリー") + "の表示項目";
    $("customize-search").value = "";
    renderCustomize();
    dlg.showModal();
  }

  function matchesQuery(t, q) {
    if (!q) return true;
    return (t.name + " " + (t.place || "") + " " + (t.sub || "") + " " + t.category + " " + (t.note || "")).toLowerCase().indexOf(q) >= 0;
  }

  function renderCustomize() {
    var q = $("customize-search").value.trim().toLowerCase();
    var tasks = allTasks().filter(function (t) { return t.type === customizeTab; });
    var filtered = tasks.filter(function (t) { return matchesQuery(t, q); });
    var html = "";
    if (filtered.length === 0) {
      html = '<div class="empty">該当する項目がありません</div>';
    }
    var lastCat = null;
    filtered.forEach(function (t) {
      var pos = tasks.indexOf(t);
      var vis = isVisible(t);
      if (!q && t.category !== lastCat) {
        html += '<div class="c-group" data-cat="' + catSlug(t.category) + '"><span class="cat-dot"></span>' + esc(t.category) + "</div>";
        lastCat = t.category;
      }
      html += '<div class="c-row' + (vis ? "" : " hidden-task") + '" data-id="' + esc(t.id) + '" data-cat="' + catSlug(t.category) +
        '" role="checkbox" aria-checked="' + (vis ? "true" : "false") + '" tabindex="0">';
      // チェックは見た目だけ。切り替えは行全体のクリックで行う
      html += '<span class="vis-check" aria-hidden="true"><span class="checkbox-wrapper"><span class="checkbox-bg"></span><svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="check-path" d="M4 12L10 18L20 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></span>';
      html += '<div class="c-body"><div class="c-name">' + esc(t.name);
      if (t.place) html += '<span class="chip muted">' + esc(t.place) + "</span>";
      if (t.count > 1) html += '<span class="chip">' + t.count + " 回</span>";
      if (!t.builtin) html += '<span class="chip muted">独自</span>';
      else if (t.overridden) html += '<span class="chip muted">編集済</span>';
      if (t.days && t.days.length) html += '<span class="chip muted">' + fmtDays(t.days) + "</span>";
      html += "</div>";
      if (t.sub) html += '<div class="c-sub">' + fmtSub(t.sub) + "</div>";
      if (t.note) html += '<div class="c-note">' + esc(t.note) + "</div>";
      html += "</div>";
      html += '<div class="c-actions">';
      html += '<button type="button" class="btn" data-act="up" aria-label="上へ"' + (pos <= 0 || q ? " disabled" : "") + ">↑</button>";
      html += '<button type="button" class="btn" data-act="down" aria-label="下へ"' + (pos >= tasks.length - 1 || q ? " disabled" : "") + ">↓</button>";
      html += '<button type="button" class="btn" data-act="edit">編集</button>';
      if (!t.builtin) html += '<button type="button" class="btn danger" data-act="del">削除</button>';
      else if (t.overridden) html += '<button type="button" class="btn" data-act="revert">既定に戻す</button>';
      html += "</div></div>";
    });
    $("customize-list").innerHTML = html;
  }

  function moveTask(id, dir) {
    var sameType = allTasks().filter(function (t) { return t.type === customizeTab; }).map(function (t) { return t.id; });
    var i = sameType.indexOf(id);
    var j = i + dir;
    if (i < 0 || j < 0 || j >= sameType.length) return;
    // state.order 内でこの 2 つの id を入れ替える（他種別の並びは触らない）
    var a = state.order.indexOf(sameType[i]);
    var b = state.order.indexOf(sameType[j]);
    if (a < 0 || b < 0) return;
    state.order[a] = sameType[j];
    state.order[b] = sameType[i];
    if (state.orderMoved.indexOf(id) < 0) state.orderMoved.push(id); // 動かした項目は位置を固定する
    saveState();
  }

  // 行全体のクリックで表示／非表示を反転する（行は作り直さず、状態だけ更新してアニメーションを走らせる）
  function toggleVisibleRow(row, t) {
    var on = !isVisible(t);
    state.visible[t.id] = on;
    saveState();
    row.classList.toggle("hidden-task", !on);
    row.setAttribute("aria-checked", on ? "true" : "false");
    var wrap = row.querySelector(".checkbox-wrapper");
    if (wrap) { wrap.classList.remove("bounce"); void wrap.offsetWidth; wrap.classList.add("bounce"); }
    render();
  }

  function onCustomizeKey(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    var row = e.target.closest(".c-row");
    if (!row || e.target !== row) return;
    e.preventDefault();
    var t = findTask(row.getAttribute("data-id"));
    if (t) toggleVisibleRow(row, t);
  }

  function onCustomizeClick(e) {
    var row = e.target.closest(".c-row");
    if (!row) return;
    var id = row.getAttribute("data-id");
    var t = findTask(id);
    if (!t) return;
    var el = e.target.closest("[data-act]");
    if (!el) { toggleVisibleRow(row, t); return; }
    var act = el.getAttribute("data-act");
    if (act === "up" || act === "down") {
      moveTask(id, act === "up" ? -1 : 1);
      renderCustomize();
      render();
    } else if (act === "edit") {
      openEdit(t);
    } else if (act === "del") {
      if (!confirm("「" + t.name + "」を削除しますか？")) return;
      state.customTasks = state.customTasks.filter(function (c) { return c.id !== id; });
      state.orderMoved = state.orderMoved.filter(function (x) { return x !== id; });
      delete state.visible[id];
      delete state.progress.daily.done[id];
      delete state.progress.weekly.done[id];
      syncOrder();
      saveState();
      renderCustomize();
      render();
    } else if (act === "revert") {
      delete state.overrides[id];
      saveState();
      renderCustomize();
      render();
    }
  }

  function setAllVisible(flag) {
    var q = $("customize-search").value.trim().toLowerCase();
    allTasks().forEach(function (t) {
      if (t.type !== customizeTab) return;
      if (!matchesQuery(t, q)) return;
      state.visible[t.id] = flag;
    });
    saveState();
    renderCustomize();
    render();
  }

  // ------------------------------------------------------------
  // 項目の追加・編集
  // ------------------------------------------------------------
  function openEdit(t) {
    var form = $("form-edit");
    form.reset();
    $("edit-title").textContent = t ? "項目を編集" : "項目を追加";
    form.elements.id.value = t ? t.id : "";
    form.elements.type.value = t ? t.type : customizeTab; // 種別は開いている列で決まる
    form.elements.name.value = t ? t.name : "";
    form.elements.category.value = t ? t.category : "";
    form.elements.count.value = t ? t.count : 1;
    form.elements.note.value = t ? (t.note || "") : "";
    form.elements.sub.value = t ? (t.sub || "") : "";
    form.elements.place.value = t ? (t.place || "") : "";
    var days = t && t.days ? t.days : [];
    Array.prototype.forEach.call(form.querySelectorAll('input[name="days"]'), function (cb) {
      cb.checked = days.indexOf(Number(cb.value)) >= 0;
    });
    // カテゴリ候補
    var cats = uniq(allTasks().map(function (x) { return x.category; }));
    $("category-list").innerHTML = cats.map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
    $("dlg-edit").showModal();
    form.elements.name.focus();
  }

  function findDefault(id) {
    for (var i = 0; i < DEFAULTS.length; i++) if (DEFAULTS[i].id === id) return DEFAULTS[i];
    return null;
  }

  function onEditSubmit(e) {
    e.preventDefault();
    var form = $("form-edit");
    var id = form.elements.id.value;
    var fields = sanitizeTaskFields({
      name: form.elements.name.value,
      category: form.elements.category.value || "その他",
      count: form.elements.count.value,
      note: form.elements.note.value,
      sub: form.elements.sub.value,
      place: form.elements.place.value,
      days: Array.prototype.filter.call(form.querySelectorAll('input[name="days"]'), function (cb) { return cb.checked; })
        .map(function (cb) { return Number(cb.value); })
    });
    if (!fields.name) { toast("名前を入力してください"); return; }
    if (!fields.count) fields.count = 1;
    if (!fields.category) fields.category = "その他";

    if (!id) {
      var task = {
        id: genId(),
        type: form.elements.type.value === "weekly" ? "weekly" : "daily",
        name: fields.name, category: fields.category, count: fields.count, note: fields.note || "",
        sub: fields.sub || "", place: fields.place || "", days: fields.days || []
      };
      state.customTasks.push(task);
      state.visible[task.id] = true;
      syncOrder();
      toast("項目を追加しました");
    } else {
      var existing = findTask(id);
      if (!existing) return;
      if (existing.builtin) {
        // 既定値と異なる部分だけを上書きとして保存する
        var def = findDefault(id);
        var ov = {};
        if (fields.name !== def.name) ov.name = fields.name;
        if (fields.category !== (def.category || "その他")) ov.category = fields.category;
        if (fields.count !== (def.count || 1)) ov.count = fields.count;
        if ((fields.note || "") !== (def.note || "")) ov.note = fields.note || "";
        if ((fields.sub || "") !== (def.sub || "")) ov.sub = fields.sub || "";
        if ((fields.place || "") !== (def.place || "")) ov.place = fields.place || "";
        var defDays = (def.days || []).slice().sort().join(",");
        var newDays = (fields.days || []).slice().sort().join(",");
        if (defDays !== newDays) ov.days = fields.days || [];
        if (Object.keys(ov).length) state.overrides[id] = ov; else delete state.overrides[id];
      } else {
        state.customTasks.forEach(function (c) {
          if (c.id !== id) return;
          c.name = fields.name; c.category = fields.category; c.count = fields.count;
          c.note = fields.note || ""; c.days = fields.days || [];
          c.sub = fields.sub || ""; c.place = fields.place || "";
        });
      }
      // 回数が減った場合に進捗が上限を超えないよう丸める
      var cur = state.progress[existing.type].done[id];
      if (cur && cur > fields.count) state.progress[existing.type].done[id] = fields.count;
      toast("保存しました");
    }
    saveState();
    $("dlg-edit").close();
    renderCustomize();
    render();
  }

  // ------------------------------------------------------------
  // 設定
  // ------------------------------------------------------------
  function fillSelect(sel, items) {
    sel.innerHTML = items.map(function (it) { return '<option value="' + it.v + '">' + esc(it.label) + "</option>"; }).join("");
  }
  function initSettingsUI() {
    var hours = [];
    for (var h = 0; h < 24; h++) hours.push({ v: h, label: h + ":00" });
    fillSelect($("set-daily-hour"), hours);
    fillSelect($("set-weekly-hour"), hours);
    fillSelect($("set-weekly-day"), DAY_NAMES.map(function (n, i) { return { v: i, label: n + "曜日" }; }));
  }
  function openSettings() {
    $("set-daily-hour").value = state.settings.dailyResetHour;
    $("set-weekly-day").value = state.settings.weeklyResetDay;
    $("set-weekly-hour").value = state.settings.weeklyResetHour;
    $("set-flavor").value = state.settings.flavor;
    renderDebug();
    $("dlg-settings").showModal();
  }
  function renderDebug() {
    var now = new Date();
    $("debug-info").textContent =
      "デイリー期間: " + dailyPeriodKey(now) + " ／ ウィークリー期間: " + weeklyPeriodKey(now) + " 開始\n" +
      "保存先: localStorage[" + STORAGE_KEY + "]" + (storageOK ? "" : "（利用不可）");
  }
  function onSettingsChange() {
    state.settings.dailyResetHour = Number($("set-daily-hour").value);
    state.settings.weeklyResetDay = Number($("set-weekly-day").value);
    state.settings.weeklyResetHour = Number($("set-weekly-hour").value);
    state.settings.flavor = $("set-flavor").value;
    applyTheme();
    // リセット時刻を変えると期間キーも変わるので、現在の進捗を新しい期間に引き継ぐ
    state.progress.daily.period = dailyPeriodKey(new Date());
    state.progress.weekly.period = weeklyPeriodKey(new Date());
    saveState();
    renderDebug();
    render();
  }
  function applyTheme() {
    var fl = FLAVORS.indexOf(state.settings.flavor) >= 0 ? state.settings.flavor : "auto";
    document.documentElement.setAttribute("data-flavor", fl);
  }

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "mabimoba_worklist_" + ymd(new Date()).replace(/-/g, "") + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || !parsed.progress) throw new Error("形式が違います");
        if (!confirm("現在の設定・進捗をインポート内容で置き換えます。よろしいですか？")) return;
        state = mergeState(defaultState(), parsed);
        syncOrder();
        applyTheme();
        checkResets();
        saveState();
        render();
        toast("インポートしました");
        $("dlg-settings").close();
      } catch (err) {
        toast("インポートに失敗しました: " + err.message);
      }
    };
    reader.readAsText(file);
  }
  function wipeAll() {
    if (!confirm("保存されているすべてのデータ（設定・表示項目・独自項目・進捗）を削除します。よろしいですか？")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    state = defaultState();
    syncOrder();
    applyTheme();
    checkResets();
    saveState();
    render();
    $("dlg-settings").close();
    toast("初期化しました");
  }
  function clearProgress(type) {
    var label = type === "daily" ? "デイリー" : "ウィークリー";
    if (!confirm(label + "の達成状況をすべて未完了に戻しますか？")) return;
    state.progress[type].done = {};
    saveState();
    renderList(type);
  }

  // ------------------------------------------------------------
  // 初期化
  // ------------------------------------------------------------
  var state = loadState();

  function init() {
    if (!storageOK) $("storage-warning").hidden = false;
    syncOrder();
    applyTheme();
    initSettingsUI();
    checkResets();
    saveState();
    render();

    $("daily-list").addEventListener("click", onListClick);
    $("weekly-list").addEventListener("click", onListClick);
    $("daily-list").addEventListener("keydown", onListKey);
    $("weekly-list").addEventListener("keydown", onListKey);

    document.querySelectorAll("[data-customize]").forEach(function (b) {
      b.addEventListener("click", function () {
        customizeTab = b.getAttribute("data-customize") === "weekly" ? "weekly" : "daily";
        openCustomize();
      });
    });
    $("btn-settings").addEventListener("click", openSettings);
    $("opt-hide-completed").addEventListener("change", function (e) {
      state.settings.hideCompleted = e.target.checked;
      saveState();
      render();
    });
    $("btn-reset-daily").addEventListener("click", function () { clearProgress("daily"); });
    $("btn-reset-weekly").addEventListener("click", function () { clearProgress("weekly"); });

    // カスタマイズ
    $("customize-search").addEventListener("input", renderCustomize);
    $("customize-list").addEventListener("click", onCustomizeClick);
    $("customize-list").addEventListener("keydown", onCustomizeKey);
    $("btn-show-all").addEventListener("click", function () { setAllVisible(true); });
    $("btn-hide-all").addEventListener("click", function () { setAllVisible(false); });
    $("btn-add-task").addEventListener("click", function () { openEdit(null); });

    // 編集ダイアログ
    $("form-edit").addEventListener("submit", onEditSubmit);
    document.querySelectorAll("#dlg-edit [data-close]").forEach(function (b) {
      b.addEventListener("click", function () { $("dlg-edit").close(); });
    });

    // 設定
    ["set-daily-hour", "set-weekly-day", "set-weekly-hour", "set-flavor"].forEach(function (id) {
      $(id).addEventListener("change", onSettingsChange);
    });
    $("btn-export").addEventListener("click", exportData);
    $("input-import").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) importData(f);
      e.target.value = "";
    });
    $("btn-wipe").addEventListener("click", wipeAll);

    // ダイアログの背景クリックで閉じる
    document.querySelectorAll("dialog.dialog").forEach(function (dlg) {
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.close();
      });
    });

    // 期限チェック: 定期・タブ復帰時・他タブからの更新
    setInterval(function () {
      if (checkResets()) render(); else renderCountdown();
    }, 30 * 1000);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") { checkResets(); render(); }
    });
    window.addEventListener("storage", function (e) {
      if (e.key !== STORAGE_KEY) return;
      state = loadState();
      syncOrder();
      applyTheme();
      render();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
