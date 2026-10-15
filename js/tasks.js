/*
 * 既定のタスクマスタ（デイリー / ウィークリー）
 *
 * フィールド:
 *   id       : 一意なID（変更するとユーザーの表示設定・進捗と紐付かなくなるので変えない）
 *   type     : "daily" | "weekly"
 *   category : 表示上の分類
 *   name     : 表示名
 *   count    : 1 周期あたりの回数（省略時は 1 = チェックボックス）
 *   note     : 補足（任意）
 *   days     : 表示する曜日の配列（0=日 1=月 ... 6=土）。省略時は毎日
 *   default  : true なら初期状態で表示 ON
 *
 * 出典: 公式ガイド「日次/週次コンテンツのリセットタイミング」、各攻略サイト（2026-10 時点）
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
  { id: "d_weekday_quest",   type: "daily",  category: "戦闘",      name: "曜日クエスト（曜日ダンジョン）",  note: "曜日ごとに素材・ゴールド・宝石など", default: true },
  { id: "d_shining_cave",    type: "daily",  category: "戦闘",      name: "輝く洞窟（黄金インゴット）",     note: "月・木・日のみ挑戦可", days: [1, 4, 0], default: false },
  { id: "d_deep_dungeon",    type: "daily",  category: "戦闘",      name: "デイリークエスト（深部ダンジョン）", note: "1 日 1 回。精霊の翼・不死の粉", default: true },
  { id: "d_repeat_quest",    type: "daily",  category: "クエスト",  name: "デイリー反復クエスト（法皇庁からの特別な依頼）", note: "「深部に向かって」クリア後に解放", default: true },
  { id: "d_npc_quest",       type: "daily",  category: "クエスト",  name: "NPC デイリークエスト（地域評判）", note: "地域限定アイテムの購入権が開放されることも", default: false },
  { id: "d_silver_coin",     type: "daily",  category: "リソース",  name: "シルバーコインの消費",          note: "30 分に 1 個回復・上限 100。溢れる前に使う", default: true },
  { id: "d_demon_offering",  type: "daily",  category: "リソース",  name: "魔族の供物の消費",              note: "12 時間に 1 個回復・上限 10。深部ダンジョン用", default: true },
  { id: "d_parttime",        type: "daily",  category: "生活",      name: "アルバイトの確認・消化",        note: "基本アルバイトは 6:00 / 18:00 に 1 件ずつ追加", default: true },
  { id: "d_barter",          type: "daily",  category: "生活",      name: "物々交換（1 日の回数分）",      note: "例: ファーガス（スチール→合金）、ネリス（合金→特殊）", default: false },
  { id: "d_craft",           type: "daily",  category: "生活",      name: "クラフト・生活コンテンツ",      note: "長時間かかる製作は先に仕込む", default: false },
  { id: "d_gathering",       type: "daily",  category: "生活",      name: "採集・料理などの生活スキル",    default: false },

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
  { id: "w_guild_mission",   type: "weekly", category: "ギルド",    name: "ギルドミッション",              note: "ギルド加入者対象", default: true },
  { id: "w_coop_mission",    type: "weekly", category: "ギルド",    name: "協力ミッション",                note: "Lv.26 以上で解放。開始後は次のリセットまで変更不可", default: false },
  { id: "w_weekly_shop",     type: "weekly", category: "ショップ",  name: "週間交換ショップの購入",        default: false }
];
