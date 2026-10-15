/*
 * 既定のタスクマスタ（デイリー / ウィークリー）
 *
 * フィールド:
 *   id       : 一意なID（変更するとユーザーの表示設定・進捗と紐付かなくなるので変えない）
 *   type     : "daily" | "weekly"
 *   category : 表示上の分類
 *   name     : 1 行目（通常はタスク名。物々交換では NPC 名）
 *   place    : 名前の横に小さく出す場所（任意。物々交換では町）
 *   sub      : 2 行目（任意。物々交換では「渡す素材×数 → 入手素材×数」。矢印の前後でだけ折り返す）
 *   note     : 3 行目（任意。物々交換では渡す素材の入手方法）
 *   count    : 1 周期あたりの回数（省略時は 1 = チェックボックス）
 *   days     : 表示する曜日の配列（0=日 1=月 ... 6=土）。省略時は毎日
 *   byDay    : 曜日ごとの表示差し替え { 曜日: { name, sub, note } }（既定項目専用）
 *   default  : true なら初期状態で表示 ON
 *
 * 回数・素材名がゲーム内表示と違えば画面の「編集」で直せる。入手方法は一般的な手段の要約。
 */
window.DEFAULT_TASKS = [
  // ---------------- デイリー（毎日 6:00 リセット） ----------------
  { id: "d_checkin_board",   type: "daily",  category: "ログイン",  name: "チェックインボード",            note: "ログインで進行。報酬はサーバー郵便へ", default: true },
  { id: "d_daily_event",     type: "daily",  category: "ログイン",  name: "デイリーイベント",              note: "チェックインボーナス・集中プレイイベント等", default: true },
  { id: "d_stella_pick",     type: "daily",  category: "ログイン",  name: "ステラピック",                  note: "アカウントにつき 1 日 1 回（代表キャラのみ）", default: true },
  { id: "d_daily_mission",   type: "daily",  category: "ミッション", name: "デイリーミッション",            note: "冒険者ポイントで宝箱を開ける（受け取り操作を忘れずに）", default: true },
  { id: "d_pass_check",      type: "daily",  category: "ミッション", name: "冒険者パスの達成状況確認",      default: false },
  { id: "d_guild_checkin",   type: "daily",  category: "ギルド",    name: "ギルドチェックイン",            note: "貢献度・ギルドトークン獲得", default: true },
  { id: "d_shop_free",       type: "daily",  category: "ショップ",  name: "ショップの無料アイテム受け取り", note: "衣装アイテム・染色アンプル等を各 1 つ", default: true },
  { id: "d_shop_gem_box",    type: "daily",  category: "ショップ",  name: "砕けた宝石ボックス購入（ゴールド）", count: 10, note: "1 日 10 個まで", default: false },
  { id: "d_black_hole",      type: "daily",  category: "戦闘",      name: "黒穴の浄化",                    note: "6:00 に利用状況更新。未消化分は週 12 回までストック可", default: true },
  // 曜日ダンジョン: 1 項目で、曜日（デイリー期間の曜日）によって表示する内容が切り替わる（byDay）
  { id: "d_weekday_dungeon", type: "daily", category: "戦闘", name: "曜日ダンジョン",
    sub: "月木: 輝く洞窟 ／ 火金: 眩い邸宅 ／ 水土: 煌めく遺跡 ／ 日: 1 つ選択",
    note: "曜日アルバイトに志願して入場。1 日 1 回",
    byDay: {
      1: { name: "曜日ダンジョン: 輝く洞窟",  sub: "ゴールド（黄金インゴット）", note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.32/45/58" },
      4: { name: "曜日ダンジョン: 輝く洞窟",  sub: "ゴールド（黄金インゴット）", note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.32/45/58" },
      2: { name: "曜日ダンジョン: 眩い邸宅",  sub: "宝石",                      note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.32/45/58" },
      5: { name: "曜日ダンジョン: 眩い邸宅",  sub: "宝石",                      note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.32/45/58" },
      3: { name: "曜日ダンジョン: 煌めく遺跡", sub: "錬金術再燃触媒",            note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.45/55/65" },
      6: { name: "曜日ダンジョン: 煌めく遺跡", sub: "錬金術再燃触媒",            note: "曜日アルバイトに志願して入場。難易度 I/II/III は Lv.45/55/65" },
      0: { name: "曜日ダンジョン（日曜は 1 つ選択）", sub: "洞窟 / 邸宅 / 遺跡から 1 つ", note: "曜日アルバイトに志願して入場。選んだダンジョンの解放条件に従う" }
    }, default: true },
  { id: "d_deep_dungeon",    type: "daily",  category: "戦闘",      name: "デイリークエスト（深部ダンジョン）", note: "1 日 1 回。精霊の翼・不死の粉", default: true },
  { id: "d_repeat_quest",    type: "daily",  category: "クエスト",  name: "デイリー反復クエスト（法皇庁からの特別な依頼）", note: "「深部に向かって」クリア後に解放", default: true },
  { id: "d_npc_quest",       type: "daily",  category: "クエスト",  name: "NPC デイリークエスト（地域評判）", note: "地域限定アイテムの購入権が開放されることも", default: false },
  { id: "d_silver_coin",     type: "daily",  category: "リソース",  name: "シルバーコインの消費",          note: "30 分に 1 個回復・上限 100。溢れる前に使う", default: true },
  { id: "d_demon_offering",  type: "daily",  category: "リソース",  name: "魔族の供物の消費",              note: "12 時間に 1 個回復・上限 10。深部ダンジョン用", default: true },
  { id: "d_parttime",        type: "daily",  category: "生活",      name: "アルバイトの確認・消化",        note: "基本アルバイトは 6:00 / 18:00 に 1 件ずつ追加", default: true },
  { id: "d_craft",           type: "daily",  category: "生活",      name: "クラフト・生活コンテンツ",      note: "長時間かかる製作は先に仕込む", default: false },
  { id: "d_gathering",       type: "daily",  category: "生活",      name: "採集・料理などの生活スキル",    default: false },

  // ---- 物々交換: ティルコネイル（11 NPC）: カテゴリ「物々交換: ティルコネイル」 ----
  { id: "b_fergus_alloy",       type: "daily", category: "物々交換: ティルコネイル", name: "ファーガス", sub: "スチールインゴット×2 → 合金インゴット×1", count: 4,  note: "製錬で製作（鉄インゴット＋石炭）", default: true },
  { id: "b_fergus_iron",        type: "daily", category: "物々交換: ティルコネイル", name: "ファーガス", sub: "分解された装備の部品×1 → 鉄鉱×1", count: 10, note: "不要な装備を分解して入手。ファーガスで鉄鉱石×100 とも交換可", default: false },
  { id: "b_fergus_coal",        type: "daily", category: "物々交換: ティルコネイル", name: "ファーガス", sub: "分解された装備の部品×1 → 石炭×3", count: 10, note: "不要な装備を分解して入手。ファーガスで鉄鉱石×100 とも交換可", default: false },
  { id: "b_fergus_parts",       type: "daily", category: "物々交換: ティルコネイル", name: "ファーガス", sub: "鉄鉱石×100 → 分解された装備の部品×10", count: 1, note: "採掘で入手（鉱脈）", default: false },
  { id: "b_lassar_juice",       type: "daily", category: "物々交換: ティルコネイル", name: "ラサ", sub: "リンゴジュース×1 → 高級錬金術再燃触媒×1", count: 1, note: "グリニス（ダンバートン）でゴールド購入・週 7 個。宿屋でハートトークン購入、料理でも製作可", default: true },
  { id: "b_lassar_residue",     type: "daily", category: "物々交換: ティルコネイル", name: "ラサ", sub: "錬金術の残滓×3 → 高級錬金術再燃触媒×1", count: 1, note: "アリサで交換（卵×10 または ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_lassar_rare",        type: "daily", category: "物々交換: ティルコネイル", name: "ラサ", sub: "高級錬金術再燃触媒×15 → レア錬金術再燃触媒×1", count: 1, note: "ラサで交換（リンゴジュース×1 / 残滓×3）。曜日クエスト報酬", default: false },
  { id: "b_caitin_bread",       type: "daily", category: "物々交換: ティルコネイル", name: "ケイティン", sub: "牛乳×10 → ケイティンの特製全粒粉パン×3", count: 1, note: "牧場の牛から搾乳", default: false },
  { id: "b_caitin_blueprint",   type: "daily", category: "物々交換: ティルコネイル", name: "ケイティン", sub: "小麦粉×10 → 食材加工施設の設計図(Lv.3)×1", count: 1, note: "アリサで交換（卵×3 / ラベンダー×1）、風車で製粉。要 生活力 3000", default: false },
  { id: "b_alissa_residue",     type: "daily", category: "物々交換: ティルコネイル", name: "アリサ", sub: "卵×10 → 錬金術の残滓×1", count: 1, note: "牧場の鶏から採集", default: false },
  { id: "b_alissa_residue_lav", type: "daily", category: "物々交換: ティルコネイル", name: "アリサ", sub: "ラベンダー×1 → 錬金術の残滓×1", count: 1, note: "花の採集。卵×10 より手軽", default: true },
  { id: "b_alissa_flour",       type: "daily", category: "物々交換: ティルコネイル", name: "アリサ", sub: "卵×3 → 小麦粉×1", count: 1, note: "牧場の鶏から採集", default: false },
  { id: "b_alissa_flour_lav",   type: "daily", category: "物々交換: ティルコネイル", name: "アリサ", sub: "ラベンダー×1 → 小麦粉×1", count: 1, note: "花の採集", default: false },
  { id: "b_malcolm_score",      type: "daily", category: "物々交換: ティルコネイル", name: "マルコム", sub: "羊毛×50 → 空の楽譜×1", count: 1, note: "羊の毛刈りで採集", default: false },
  { id: "b_malcolm_pillow",     type: "daily", category: "物々交換: ティルコネイル", name: "マルコム", sub: "クモの糸×5 → マルコムのふわふわ羊毛枕×1", count: 1, note: "クモ系モンスターのドロップ", default: false },
  { id: "b_malcolm_blueprint",  type: "daily", category: "物々交換: ティルコネイル", name: "マルコム", sub: "専門家向けキャンプファイアキット×1 → 多目的製作台設計図(Lv.3)×1", count: 1, note: "木工で製作、またはショップ購入。要 生活力 3000", default: false },
  { id: "b_nora_snack",         type: "daily", category: "物々交換: ティルコネイル", name: "ノラ", sub: "マルコムのふわふわ羊毛枕×1 → 旅人のおやつ×1", count: 3, note: "マルコムで交換（クモの糸×5）", default: false },
  { id: "b_ranald_potion",      type: "daily", category: "物々交換: ティルコネイル", name: "レイナルド", sub: "肉のマヨネーズ炒め×2 → クリティカルの秘薬×1", count: 1, note: "料理で製作", default: false },
  { id: "b_endelyon_holywater", type: "daily", category: "物々交換: ティルコネイル", name: "エンデリオン", sub: "ケイティンの特製全粒粉パン×10 → 聖水×10", count: 1, note: "ケイティンで交換（牛乳×10 → パン×3）", default: false },
  { id: "b_meven_holywater",    type: "daily", category: "物々交換: ティルコネイル", name: "メイブン", sub: "ケイティンの特製全粒粉パン×1 → 聖水×1", count: 1, note: "ケイティンで交換（牛乳×10 → パン×3）", default: false },
  { id: "b_dilys_clover",       type: "daily", category: "物々交換: ティルコネイル", name: "ディリス", sub: "ノビノビキノコ×3 → 4 つ葉のクローバー×1", count: 1, note: "森でキノコを採集", default: false },
  { id: "b_deian_wool",         type: "daily", category: "物々交換: ティルコネイル", name: "デイアン", sub: "ペットのエサ×1 → 上級羊毛×4", count: 10, note: "ショップ購入、または料理で製作", default: false },

  // ---- 物々交換: ダンバートン（12 NPC） ----
  { id: "b_nerys_special",      type: "daily", category: "物々交換: ダンバートン", name: "ネリス", sub: "合金インゴット×2 → 特殊インゴット×1", count: 4,  note: "ファーガスで交換（スチールインゴット×2）、または製錬で製作", default: true },
  { id: "b_nerys_hide",         type: "daily", category: "物々交換: ダンバートン", name: "ネリス", sub: "銅鉱石×1 → 上級生皮×1", count: 10, note: "採掘で入手（鉱脈）", default: true },
  { id: "b_glenis_cake",        type: "daily", category: "物々交換: ダンバートン", name: "グリニス", sub: "ポークインミルク×1 → グリニスの手作りケーキ×1", count: 1, note: "料理で製作", default: false },
  { id: "b_glenis_tea",         type: "daily", category: "物々交換: ダンバートン", name: "グリニス", sub: "生クリーム×4 → グリニスのアップルミルクティー×1", count: 1, note: "料理で製作（牛乳から）", default: false },
  { id: "b_glenis_blueprint",   type: "daily", category: "物々交換: ダンバートン", name: "グリニス", sub: "リンゴスフレ×1 → 調理台設計図(Lv.3)×1", count: 1, note: "料理で製作。要 生活力 3000", default: false },
  { id: "b_flora_novel",        type: "daily", category: "物々交換: ダンバートン", name: "フローラ", sub: "グリニスの手作りケーキ×2 → 持ち主のいない小説×1", count: 1, note: "グリニスで交換（ポークインミルク×1）", default: false },
  { id: "b_aila_paper",         type: "daily", category: "物々交換: ダンバートン", name: "アイラ", sub: "持ち主のいない小説×1 → 紙×10", count: 1, note: "フローラで交換（グリニスの手作りケーキ×2）", default: false },
  { id: "b_calix_herb",         type: "daily", category: "物々交換: ダンバートン", name: "カリックス", sub: "グリニスのアップルミルクティー×2 → 草+×10", count: 1, note: "グリニスで交換（生クリーム×4）", default: false },
  { id: "b_calix_lemon",        type: "daily", category: "物々交換: ダンバートン", name: "カリックス", sub: "不死の粉×5 → レモン×3", count: 1, note: "深部ダンジョン（デイリークエスト）報酬", default: false },
  { id: "b_calix_pepper",       type: "daily", category: "物々交換: ダンバートン", name: "カリックス", sub: "不死の粉×5 → コショウ×2", count: 1, note: "深部ダンジョン（デイリークエスト）報酬", default: false },
  { id: "b_jerome_silk",        type: "daily", category: "物々交換: ダンバートン", name: "ジェロム", sub: "リコッタチーズサラダ×1 → シルク×4", count: 2, note: "料理で製作", default: false },
  { id: "b_jerome_silk_plus",   type: "daily", category: "物々交換: ダンバートン", name: "ジェロム", sub: "クリームソースステーキ×1 → 上級シルク×4", count: 1, note: "料理で製作", default: false },
  { id: "b_jamie_cloth",        type: "daily", category: "物々交換: ダンバートン", name: "ジェイミー", sub: "リンゴスフレ×1 → 上級生地×4", count: 2, note: "料理で製作", default: false },
  { id: "b_jamie_cloth_plus",   type: "daily", category: "物々交換: ダンバートン", name: "ジェイミー", sub: "リンゴショートケーキ×1 → 上級生地+×4", count: 1, note: "料理で製作", default: false },
  { id: "b_simon_dye",          type: "daily", category: "物々交換: ダンバートン", name: "シモン", sub: "上級シルク×10 → 染色アンプルのベース×1", count: 1, note: "ジェロムで交換（クリームソースステーキ×1）、または生地加工で製作", default: false },
  { id: "b_simon_cloth_bp",     type: "daily", category: "物々交換: ダンバートン", name: "シモン", sub: "幽霊ホタル×2 → 生地加工施設の設計図(Lv.3)×1", count: 1, note: "夜間に虫取りで採集", default: false },
  { id: "b_simon_armor_bp",     type: "daily", category: "物々交換: ダンバートン", name: "シモン", sub: "細工されたペリドットS×1 → 防具製作台設計図(Lv.3)×1", count: 1, note: "宝石細工で製作", default: false },
  { id: "b_simon_cloth",        type: "daily", category: "物々交換: ダンバートン", name: "シモン", sub: "完璧な包帯×100 → 生地+×10", count: 1, note: "救急（裁縫）で製作", default: false },
  { id: "b_walter_leather",     type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "トレイシーの原木オルゴール×1 → 革×6", count: 2, note: "トレイシーで交換（蒸した貝×2）", default: false },
  { id: "b_walter_heart",       type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "真愛魚×5 → ハートトークン×1", count: 2, note: "釣りで入手", default: false },
  { id: "b_walter_bomb_fire",   type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "闇の幽霊魚×5 → ファイアマジックボム×1", count: 3, note: "釣りで入手", default: false },
  { id: "b_walter_bomb_light",  type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "闇の幽霊魚×5 → ライトニングマジックボム×1", count: 3, note: "釣りで入手", default: false },
  { id: "b_walter_bomb_wind",   type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "闇の幽霊魚×5 → ウィンドマジックボム×1", count: 3, note: "釣りで入手", default: false },
  { id: "b_walter_bomb_acid",   type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "闇の幽霊魚×5 → アシッドマジックボム×1", count: 3, note: "釣りで入手", default: false },
  { id: "b_walter_saw",         type: "daily", category: "物々交換: ダンバートン", name: "バルター", sub: "ハートトークン×2 → 作業用弓鋸×2", count: 1, note: "アルバイト報酬。バルターで交換（真愛魚×5）", default: false },
  { id: "b_aranwen_potion",     type: "daily", category: "物々交換: ダンバートン", name: "アランウェン", sub: "ポテトサラダ×2 → 究極技の秘薬×1", count: 1, note: "料理で製作", default: false },
  { id: "b_aranwen_spirit",     type: "daily", category: "物々交換: ダンバートン", name: "アランウェン", sub: "クラスマスターメダル×1 → 精霊の痕跡×20", count: 1, note: "クラス熟練度の達成報酬", default: false },
  { id: "b_stewart_fire",       type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "錬金術の残滓×1 → 炎の結晶×1", count: 5, note: "アリサで交換（卵×10 / ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_stewart_ice",        type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "錬金術の残滓×1 → 氷の結晶×1", count: 5, note: "アリサで交換（卵×10 / ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_stewart_lightning",  type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "錬金術の残滓×1 → 電気の結晶×1", count: 5, note: "アリサで交換（卵×10 / ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_stewart_light",      type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "錬金術の残滓×1 → 光輝の結晶×1", count: 5, note: "アリサで交換（卵×10 / ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_stewart_seal",       type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "錬金術の残滓×1 → 封印の結晶×1", count: 5, note: "アリサで交換（卵×10 / ラベンダー×1）。錬金術の分解でも入手", default: false },
  { id: "b_stewart_gold1",      type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "強化再燃触媒×5 → 未加工のゴールド原石×7", count: 1, note: "ダンジョン・ミッション報酬", default: false },
  { id: "b_stewart_gold2",      type: "daily", category: "物々交換: ダンバートン", name: "スチュアート", sub: "レア錬金術再燃触媒×50 → 未加工のゴールド原石×7", count: 1, note: "ラサで交換（高級触媒×15）、ウィークリーミッション報酬", default: false },
  { id: "b_manus_manastone",    type: "daily", category: "物々交換: ダンバートン", name: "マヌス", sub: "ペットのエサ×10 → 生命のマナストーン×1", count: 2, note: "ショップ購入、または料理で製作", default: false },

  // ---- 物々交換: ドゥガルドアイル（2 NPC） ----
  { id: "b_tracy_hide",         type: "daily", category: "物々交換: ドゥガルドアイル", name: "トレイシー", sub: "丸太×1 → 生皮×1", count: 10, note: "伐採で入手（放置採集可）", default: true },
  { id: "b_tracy_hide_plus",    type: "daily", category: "物々交換: ドゥガルドアイル", name: "トレイシー", sub: "丸太×10 → 上級生皮×1", count: 10, note: "伐採で入手（放置採集可）", default: true },
  { id: "b_tracy_sap",          type: "daily", category: "物々交換: ドゥガルドアイル", name: "トレイシー", sub: "上級丸太×1 → 樹液×4", count: 5, note: "上級の木を伐採。アルヴィンで交換（上級革×1）", default: false },
  { id: "b_tracy_musicbox",     type: "daily", category: "物々交換: ドゥガルドアイル", name: "トレイシー", sub: "蒸した貝×2 → トレイシーの原木オルゴール×1", count: 1, note: "料理で製作（貝は釣り・採集）", default: false },
  { id: "b_tracy_blueprint",    type: "daily", category: "物々交換: ドゥガルドアイル", name: "トレイシー", sub: "幼虫×5 → 木工加工施設の設計図(Lv.3)×1", count: 1, note: "採集（木・土）で入手。要 生活力 3000", default: false },
  { id: "b_alvin_wood",         type: "daily", category: "物々交換: ドゥガルドアイル", name: "アルヴィン", sub: "野菜炒め×1 → 上級木材×4", count: 2, note: "料理で製作", default: true },
  { id: "b_alvin_tannin",       type: "daily", category: "物々交換: ドゥガルドアイル", name: "アルヴィン", sub: "生皮×5 → タンニンパウダー×5", count: 10, note: "トレイシーで交換（丸太×1）。動物系モンスターのドロップ", default: false },
  { id: "b_alvin_log",          type: "daily", category: "物々交換: ドゥガルドアイル", name: "アルヴィン", sub: "上級革×1 → 上級丸太×1", count: 10, note: "革加工で製作（上級生皮＋タンニンパウダー）", default: false },
  { id: "b_alvin_blueprint",    type: "daily", category: "物々交換: ドゥガルドアイル", name: "アルヴィン", sub: "生地+×5 → 革加工施設の設計図(Lv.3)×1", count: 1, note: "生地加工で製作。要 生活力 3000", default: false },

  // ---- 物々交換: コレン（4 NPC） ----
  { id: "b_armis_copper",       type: "daily", category: "物々交換: コレン", name: "アルミス", sub: "白銅鉱×1 → 銅鉱×10", count: 1, note: "採掘で入手（上位の鉱脈）", default: false },
  { id: "b_armis_metal_bp",     type: "daily", category: "物々交換: コレン", name: "アルミス", sub: "石炭×20 → 金属加工施設の設計図(Lv.3)×1", count: 1, note: "採掘で入手。ファーガスで交換（装備の部品×1 → 3）", default: false },
  { id: "b_armis_weapon_bp",    type: "daily", category: "物々交換: コレン", name: "アルミス", sub: "耐熱包帯×5 → 武器製作台設計図(Lv.3)×1", count: 1, note: "救急（裁縫）で製作", default: false },
  { id: "b_armis_holywater",    type: "daily", category: "物々交換: コレン", name: "アルミス", sub: "呪い解除ポーション×100 → 聖水×10", count: 1, note: "ポーション製作、またはショップ購入", default: false },
  { id: "b_connor_clover",      type: "daily", category: "物々交換: コレン", name: "コナー", sub: "健康ドリンク×1 → 4 つ葉のクローバー×3", count: 3, note: "キリアンで交換（スッキリキノコの胞子×5）", default: false },
  { id: "b_connor_ruin_stone",  type: "daily", category: "物々交換: コレン", name: "コナー", sub: "生命のマナストーン×1 → 廃墟のマナストーン×1", count: 5, note: "マヌスで交換（ペットのエサ×10）", default: false },
  { id: "b_connor_canyon_stone",type: "daily", category: "物々交換: コレン", name: "コナー", sub: "生命のマナストーン×1 → 峡谷のマナストーン×1", count: 10, note: "マヌスで交換（ペットのエサ×10）", default: false },
  { id: "b_connor_heart",       type: "daily", category: "物々交換: コレン", name: "コナー", sub: "チョウチンアンコウ×5 → ハートトークン×1", count: 3, note: "釣りで入手", default: false },
  { id: "b_killian_drink",      type: "daily", category: "物々交換: コレン", name: "キリアン", sub: "スッキリキノコの胞子×5 → 健康ドリンク×1", count: 5, note: "キノコの採集", default: false },
  { id: "b_killian_clover",     type: "daily", category: "物々交換: コレン", name: "キリアン", sub: "ペペロンチーノ×1 → 4 つ葉のクローバー×8", count: 1, note: "料理で製作", default: false },
  { id: "b_killian_potion_bp",  type: "daily", category: "物々交換: コレン", name: "キリアン", sub: "毒袋×3 → ポーション加工施設の設計図(Lv.3)×1", count: 1, note: "毒系モンスターのドロップ。ケアラで交換（上級木材+×10）", default: false },
  { id: "b_killian_table_bp",   type: "daily", category: "物々交換: コレン", name: "キリアン", sub: "夕陽チョウ×2 → ポーション製作台設計図(Lv.3)×1", count: 1, note: "夕方に虫取りで採集", default: false },
  { id: "b_keara_wind",         type: "daily", category: "物々交換: コレン", name: "ケアラ", sub: "上級木材+×10 → 凝縮された風×3", count: 3, note: "木材加工で製作", default: false },
  { id: "b_keara_poison",       type: "daily", category: "物々交換: コレン", name: "ケアラ", sub: "上級木材+×10 → 毒袋×3", count: 3, note: "木材加工で製作", default: false },
  { id: "b_keara_crit",         type: "daily", category: "物々交換: コレン", name: "ケアラ", sub: "フローズンイチゴジュース×2 → 上級クリティカルの秘薬×1", count: 1, note: "料理で製作", default: false },
  { id: "b_keara_water",        type: "daily", category: "物々交換: コレン", name: "ケアラ", sub: "聖水×10 → 水が入った瓶×50", count: 1, note: "エンデリオン / メイブンで交換（パン）、アルミスで交換（呪い解除ポーション×100）", default: false },

  // ---------------- ウィークリー（毎週月曜 6:00 リセット） ----------------
  { id: "w_weekly_mission",  type: "weekly", category: "ミッション", name: "ウィークリーミッション",        note: "14 項目。デイリーをこなせば自然に達成", default: true },
  { id: "w_mission_reward",  type: "weekly", category: "ミッション", name: "ウィークリー報酬の受け取り確認", note: "日曜中に達成状況を確認", default: true },
  { id: "w_field_boss",      type: "weekly", category: "戦闘",      name: "フィールドボス討伐",            note: "報酬は種類ごとに週 1 回。出現時間帯あり", default: true },
  { id: "w_barrier",         type: "weekly", category: "戦闘",      name: "不吉な召喚の結界",              count: 7, note: "戦利品は週 7 回まで。6:00 から 1 時間ごとに出現", default: true },
  { id: "w_black_hole_stock",type: "weekly", category: "戦闘",      name: "黒穴ストック消化",              count: 12, note: "週 12 回分までストック。週末にまとめて消化する人向け", default: false },
  { id: "w_vanguard_breach", type: "weekly", category: "戦闘",      name: "ヴァンガード ブリーチ",         count: 3, note: "週 3 回。戦力強化素材", default: true },
  { id: "w_raid",            type: "weekly", category: "戦闘",      name: "レイド（各ボス週 1 回）",       note: "ボスごとに 1 回。月曜 6:00 前までに参加", default: true },
  { id: "w_abyss",           type: "weekly", category: "戦闘",      name: "アビス（各アビス週 1 回）",     note: "アビスごとの回数制限を確認", default: true },
  { id: "w_weekly_dungeon",  type: "weekly", category: "戦闘",      name: "週制限ダンジョン（報酬回数）",  note: "回数を残してリセットすると損", default: false },
  { id: "w_arena",           type: "weekly", category: "戦闘",      name: "アリーナ / PvP の週間報酬",     default: false },
  { id: "w_repeat_quest",    type: "weekly", category: "クエスト",  name: "ウィークリー反復クエスト（冒険者ギルドの定期依頼）", note: "「深部に向かって」クリア後に解放", default: true },
  { id: "w_weekly_quest",    type: "weekly", category: "クエスト",  name: "ウィークリークエスト（拠点）",  note: "名声・拠点貢献ポイント", default: false },
  { id: "w_parttime_base",   type: "weekly", category: "生活",      name: "基本アルバイト（月曜 6 件発生）", count: 6, default: false },
  { id: "w_glenis_juice",    type: "weekly", category: "物々交換: ダンバートン", name: "グリニス", sub: "ゴールド → リンゴジュース×1（週 7 個まで）", count: 7, note: "ラサの高級錬金術再燃触媒交換に使う。月曜 6:00 更新", default: true },
  { id: "w_guild_mission",   type: "weekly", category: "ギルド",    name: "ギルドミッション",              note: "ギルド加入者対象", default: true },
  { id: "w_coop_mission",    type: "weekly", category: "ギルド",    name: "協力ミッション",                note: "Lv.26 以上で解放。開始後は次のリセットまで変更不可", default: false },
  { id: "w_weekly_shop",     type: "weekly", category: "ショップ",  name: "週間交換ショップの購入",        default: false }
];
