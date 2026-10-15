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
 * 物々交換の交換内容・回数は攻略記事ベース。ゲーム内表示と違う場合は画面の「編集」で直せる
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
  { id: "d_craft",           type: "daily",  category: "生活",      name: "クラフト・生活コンテンツ",      note: "長時間かかる製作は先に仕込む", default: false },
  { id: "d_gathering",       type: "daily",  category: "生活",      name: "採集・料理などの生活スキル",    default: false },

  // ---- 物々交換: ティルコネイル ----
  { id: "b_fergus_alloy",        type: "daily", category: "物々交換", name: "ファーガス: スチールインゴット×2 → 合金インゴット×1", count: 4, note: "ティルコネイル・鍛冶屋。特殊インゴットの前段", default: true },
  { id: "b_fergus_iron",         type: "daily", category: "物々交換", name: "ファーガス: 分解された装備の部品×1 → 鉄鉱×1（または石炭×3）", count: 10, note: "ティルコネイル・鍛冶屋", default: false },
  { id: "b_fergus_parts",        type: "daily", category: "物々交換", name: "ファーガス: 鉄鉱石×100 → 分解された装備部品×10", count: 1, note: "ティルコネイル・鍛冶屋", default: false },
  { id: "b_lassar_juice",        type: "daily", category: "物々交換", name: "ラサ: リンゴジュース×1 → 高級錬金術再燃触媒×1", count: 1, note: "ティルコネイル・魔法学校。リンゴジュースはグリニスで週 7 個購入可", default: true },
  { id: "b_lassar_residue",      type: "daily", category: "物々交換", name: "ラサ: 錬金術の残滓×3 → 高級錬金術再燃触媒×1", count: 1, note: "ティルコネイル・魔法学校", default: false },
  { id: "b_lassar_rare",         type: "daily", category: "物々交換", name: "ラサ: 高級錬金術再燃触媒×15 → レア錬金術再燃触媒×1", count: 1, note: "ティルコネイル・魔法学校", default: false },
  { id: "b_caitin_bread",        type: "daily", category: "物々交換", name: "ケイティン: 牛乳×10 → 特製全粒粉パン×3", count: 1, note: "ティルコネイル。パンはエンデリオン / メイフンで聖水に", default: false },
  { id: "b_caitin_blueprint",    type: "daily", category: "物々交換", name: "ケイティン: 小麦粉×10 → 食品加工施設設計図(Lv.3)×1", count: 1, note: "ティルコネイル。生活力 3000 以上", default: false },
  { id: "b_alissa_residue",      type: "daily", category: "物々交換", name: "アリサ: 卵×10 または ラベンダー×1 → 錬金術の残滓×1", count: 1, note: "ティルコネイル・風車付近", default: false },
  { id: "b_alissa_flour",        type: "daily", category: "物々交換", name: "アリサ: 卵×3 または ラベンダー×1 → 小麦粉×1", count: 1, note: "ティルコネイル・風車付近", default: false },
  { id: "b_malcolm_score",       type: "daily", category: "物々交換", name: "マルコム: 羊毛×50 → 空の楽譜×1", count: 1, note: "ティルコネイル・雑貨屋", default: false },
  { id: "b_malcolm_pillow",      type: "daily", category: "物々交換", name: "マルコム: クモの糸×5 → マルコムのふわふわ羊毛枕×1", count: 1, note: "ティルコネイル・雑貨屋", default: false },
  { id: "b_malcolm_blueprint",   type: "daily", category: "物々交換", name: "マルコム: 専門家向けキャンプファイアキット×1 → 多目的製作台設計図(Lv.3)×1", count: 1, note: "ティルコネイル・雑貨屋。生活力 3000 以上", default: false },
  { id: "b_ranald_potion",       type: "daily", category: "物々交換", name: "レイナルド: 肉のマヨネーズ炒め×2 → クリティカル秘薬×1", count: 1, note: "ティルコネイル・学校", default: false },
  { id: "b_endelyon_holywater",  type: "daily", category: "物々交換", name: "エンデリオン: 特製全粒粉パン×10 → 聖水×10", count: 1, note: "ティルコネイル・教会", default: false },
  { id: "b_meven_holywater",     type: "daily", category: "物々交換", name: "メイフン: 特製全粒粉パン×1 → 聖水×1", count: 1, note: "ティルコネイル・教会", default: false },
  { id: "b_dilys_clover",        type: "daily", category: "物々交換", name: "ディリス: ノビノビキノコ×3 → 4 つ葉のクローバー×1", count: 1, note: "ティルコネイル・ヒーラーの家", default: false },
  { id: "b_deian_wool",          type: "daily", category: "物々交換", name: "デイアン: ペットのエサ×1 → 上級羊毛×4", count: 10, note: "ティルコネイル・牧場", default: false },

  // ---- 物々交換: ダンバートン ----
  { id: "b_nerys_special",       type: "daily", category: "物々交換", name: "ネリス: 合金インゴット×2 → 特殊インゴット×1", count: 4, note: "ダンバートン・武器屋。最優先", default: true },
  { id: "b_nerys_hide",          type: "daily", category: "物々交換", name: "ネリス: 銅鉱石×1 → 上級生皮×1", count: 10, note: "ダンバートン・武器屋", default: true },
  { id: "b_stewart_crystal",     type: "daily", category: "物々交換", name: "スチュワート: 錬金術の残滓×1 → 各種結晶×1", count: 5, note: "ダンバートン・学校", default: false },
  { id: "b_stewart_gold1",       type: "daily", category: "物々交換", name: "スチュワート: 強化再燃触媒×5 → 未加工のゴールド原石×7", count: 1, note: "ダンバートン・学校", default: false },
  { id: "b_stewart_gold2",       type: "daily", category: "物々交換", name: "スチュワート: レア錬金術再燃触媒×50 → 未加工のゴールド原石×7", count: 1, note: "ダンバートン・学校", default: false },
  { id: "b_simon_dye",           type: "daily", category: "物々交換", name: "サイモン: 高級シルク×10 → 染色ベース×3", count: 1, note: "ダンバートン・服屋", default: false },
  { id: "b_simon_design",        type: "daily", category: "物々交換", name: "サイモン: 幽霊ホタル×2 → デザイン(Lv.3)×1", count: 1, note: "ダンバートン・服屋", default: false },
  { id: "b_jamie_cloth",         type: "daily", category: "物々交換", name: "ジェイミー: リンゴスフレ×1 → 上級布地×4", count: 2, note: "ダンバートン", default: false },
  { id: "b_jamie_cloth_plus",    type: "daily", category: "物々交換", name: "ジェイミー: リンゴショートケーキ×1 → 上級布地+×4", count: 1, note: "ダンバートン", default: false },
  { id: "b_glenis_cake",         type: "daily", category: "物々交換", name: "グリニス: ポークインミルク×1 → グリニスの手作りケーキ×1", count: 1, note: "ダンバートン・食堂", default: false },
  { id: "b_glenis_tea",          type: "daily", category: "物々交換", name: "グリニス: 生クリーム×4 → グリニスのアップルミルクティー×1", count: 1, note: "ダンバートン・食堂", default: false },
  { id: "b_glenis_blueprint",    type: "daily", category: "物々交換", name: "グリニス: リンゴスフレ×1 → 調理台設計図(Lv.3)×1", count: 1, note: "ダンバートン・食堂。生活力 3000 以上", default: false },
  { id: "b_walter_grenade",      type: "daily", category: "物々交換", name: "ウォルター: ダークゴーストミート×5 など → 魔法手榴弾×1", count: 3, note: "ダンバートン・雑貨屋。火炎・風など属性別", default: false },
  { id: "b_jerome_silk",         type: "daily", category: "物々交換", name: "ジェロム: リコッタチーズサラダ×1 → シルク×4", count: 2, note: "ダンバートン", default: false },
  { id: "b_jerome_silk_plus",    type: "daily", category: "物々交換", name: "ジェロム: クリームソースステーキ×1 → 上級シルク×4", count: 1, note: "ダンバートン", default: false },
  { id: "b_manus_manastone",     type: "daily", category: "物々交換", name: "マヌス: ペットのエサ×10 → 生命のマナストーン×1", count: 2, note: "ダンバートン・ヒーラーの家", default: false },
  { id: "b_aila_paper",          type: "daily", category: "物々交換", name: "アイラ: 持ち主のいない小説×1 → 紙×10", count: 1, note: "ダンバートン・書店", default: false },
  { id: "b_aranwen_potion",      type: "daily", category: "物々交換", name: "アランウェン: ポテトサラダ×2 → 究極技の秘薬×1", count: 1, note: "ダンバートン・学校", default: false },
  { id: "b_aranwen_spirit",      type: "daily", category: "物々交換", name: "アランウェン: クラスマスターメダル×1 → 精霊の痕跡×1", count: 1, note: "ダンバートン・学校。回数は要確認", default: false },
  { id: "b_calix_leather",       type: "daily", category: "物々交換", name: "カリックス: グリニスのアップルミルクティー×2 → 革+×10", count: 1, note: "ダンバートン", default: false },
  { id: "b_calix_lemon",         type: "daily", category: "物々交換", name: "カリックス: 不死の粉×5 → レモン×3", count: 1, note: "ダンバートン", default: false },
  { id: "b_calix_pepper",        type: "daily", category: "物々交換", name: "カリックス: 不死の粉×5 → コショウ×2", count: 1, note: "ダンバートン", default: false },
  { id: "b_flora_novel",         type: "daily", category: "物々交換", name: "フローラ: グリニスの手作りケーキ×2 → 持ち主のいない小説×1", count: 1, note: "ダンバートン", default: false },

  // ---- 物々交換: ドゥガルドアイル ----
  { id: "b_tracy_hide",          type: "daily", category: "物々交換", name: "トレイシー: 丸太×1 → 生皮×1", count: 10, note: "ドゥガルドアイル・伐採キャンプ", default: true },
  { id: "b_tracy_hide_plus",     type: "daily", category: "物々交換", name: "トレイシー: 丸太×10 → 上級生皮×1", count: 10, note: "ドゥガルドアイル・伐採キャンプ。記事により上限 5 回とも", default: true },
  { id: "b_tracy_sap",           type: "daily", category: "物々交換", name: "トレイシー: 上級丸太×1 → 樹液×4", count: 5, note: "ドゥガルドアイル・伐採キャンプ", default: false },
  { id: "b_tracy_musicbox",      type: "daily", category: "物々交換", name: "トレイシー: 蒸した貝×2 → トレイシーの原木オルゴール×1", count: 1, note: "ドゥガルドアイル・伐採キャンプ", default: false },
  { id: "b_tracy_blueprint",     type: "daily", category: "物々交換", name: "トレイシー: 幼虫×5 → 木材加工施設設計図(Lv.3)×1", count: 1, note: "ドゥガルドアイル・伐採キャンプ。生活力 3000 以上", default: false },
  { id: "b_alvin_wood",          type: "daily", category: "物々交換", name: "アルヴィン: 野菜炒め×1 → 上級木材×4", count: 2, note: "ドゥガルドアイル・三叉路付近", default: true },
  { id: "b_alvin_tannin",        type: "daily", category: "物々交換", name: "アルヴィン: 生皮×5 → タンニンパウダー×5", count: 10, note: "ドゥガルドアイル・三叉路付近", default: false },
  { id: "b_alvin_log",           type: "daily", category: "物々交換", name: "アルヴィン: 上級革×1 → 上級丸太×10", count: 10, note: "ドゥガルドアイル・三叉路付近", default: false },
  { id: "b_alvin_blueprint",     type: "daily", category: "物々交換", name: "アルヴィン: 生地+×5 → 革加工施設設計図(Lv.3)×1", count: 1, note: "ドゥガルドアイル・三叉路付近。生活力 3000 以上", default: false },
  { id: "b_alvin_leather",       type: "daily", category: "物々交換", name: "アルヴィン: 上級丸太×1 → 高級レザー×1", count: 1, note: "ドゥガルドアイル・三叉路付近。回数は要確認", default: false },

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
  { id: "w_glenis_juice",    type: "weekly", category: "物々交換",  name: "グリニス: リンゴジュース購入（ゴールド）", count: 7, note: "ダンバートン・食堂。週 7 個まで、月曜更新。ラサの触媒交換用", default: true },
  { id: "w_guild_mission",   type: "weekly", category: "ギルド",    name: "ギルドミッション",              note: "ギルド加入者対象", default: true },
  { id: "w_coop_mission",    type: "weekly", category: "ギルド",    name: "協力ミッション",                note: "Lv.26 以上で解放。開始後は次のリセットまで変更不可", default: false },
  { id: "w_weekly_shop",     type: "weekly", category: "ショップ",  name: "週間交換ショップの購入",        default: false }
];
