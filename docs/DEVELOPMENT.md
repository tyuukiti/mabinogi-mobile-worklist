# 開発メモ

ビルド不要の静的サイトです。`index.html` を開くか、フォルダごと任意の静的ホスティングに置けば動きます。

## ファイル構成

```
index.html      画面
css/style.css   スタイル（Catppuccin 4 フレーバー、ライト / ダーク）
js/tasks.js     既定のタスク一覧（ここを編集すると全員の既定項目が変わる）
js/app.js       アプリ本体（依存ライブラリなし）
.nojekyll       Jekyll 変換を止める空ファイル（消さない）
assets/         アイコン（icon.svg と PNG 各サイズ）、OGP 画像（og-image.png）とその生成元 og-image.html
robots.txt / sitemap.xml / manifest.webmanifest   検索エンジンとホーム画面追加用
```

## アナリティクス（Google Analytics 4）

`index.html` の head にある `window.GA_MEASUREMENT_ID = ""` に測定 ID（`G-XXXXXXXXXX`）を入れると gtag.js を読み込みます。空のとき、`file://` で開いたとき、`localhost` / `127.0.0.1` のときは何も読み込みません。

## OGP 画像の作り直し

`assets/og-image.html` を 1200×630 でスクリーンショットすると `assets/og-image.png` になります。例:

```
chrome --headless=new --window-size=1200,630 --screenshot=assets/og-image.png assets/og-image.html
```

アイコンは `assets/icon.svg` が元で、PNG（192 / 512 / apple-touch-icon 180）は同じ要領で各サイズに描画したものです。

## 既定タスク（`js/tasks.js`）

```js
{ id: "w_barrier", type: "weekly", category: "戦闘", name: "不吉な召喚の結界",
  count: 7, note: "戦利品は週 7 回まで", default: true },
```

| フィールド | 意味 |
|---|---|
| `id` | 保存データとの紐付けに使う。一度公開したら変更しない |
| `type` | `daily` / `weekly` |
| `category` | 見出しの分類。`物々交換: 町名` のように「物々交換」で始まるものは同じ色になる |
| `name` / `sub` / `note` | カードの 1 行目 / 2 行目（「→」の前後で折り返し）/ 3 行目 |
| `place` | 名前の横に出す小さなラベル（任意） |
| `count` | 1 周期あたりの回数（省略時 1 = チェックボックス） |
| `days` | 表示する曜日の配列（0=日 〜 6=土、省略時は毎日） |
| `byDay` | 曜日ごとの表示差し替え `{ 曜日: { name, sub, note } }`（曜日ダンジョンで使用） |
| `default` | `true` なら初期状態で表示 ON |

新しい `id` を追加すると、既存ユーザーの画面でも `tasks.js` 上の位置に差し込まれます。ユーザーが ↑↓ で動かした項目だけが元の位置に固定されます。

## 保存データ

localStorage のキー `mabimoba_worklist_v1` に 1 つの JSON として保存します。

```json
{
  "settings":    { "dailyResetHour": 6, "weeklyResetDay": 1, "weeklyResetHour": 6, "hideCompleted": false, "flavor": "auto" },
  "visible":     { "<タスクid>": true },
  "order":       ["<タスクid>", "..."],
  "orderMoved":  ["<ユーザーが並べ替えたタスクid>"],
  "overrides":   { "<既定タスクid>": { "name": "...", "count": 3 } },
  "customTasks": [ { "id": "c_...", "type": "weekly", "name": "...", "category": "...", "count": 1, "sub": "", "note": "", "place": "", "days": [] } ],
  "progress":    { "daily": { "period": "2026-10-15", "done": { "<タスクid>": 1 } },
                   "weekly": { "period": "2026-10-12", "done": { "<タスクid>": 3 } } }
}
```

## リセットの判定

- 「リセット時刻を 0 時とみなした日付」を期間キーとして進捗と一緒に保存し、ページ表示時・タブ復帰時・30 秒ごとに現在の期間キーと比較して、違っていればその種別の進捗を空にします。
- 例: 月曜 5:59 はまだ「日曜のデイリー」「先週のウィークリー」、6:00 で両方が切り替わります。ブラウザを閉じている間に期限を跨いでも、次に開いたときにリセットされます。
- 曜日限定項目と `byDay` の曜日判定も同じ期間キー（デイリーの区切り）を基準にします。

## 配色

色はすべて `css/style.css` 先頭の CSS 変数で定義しています。

- `--ctp-*`: Catppuccin 公式 palette.json の値（フレーバーごと）。`data-flavor` 属性で切り替え、`auto` は OS 設定に追従
- `--bg` / `--panel` / `--card` / `--border` など: 背景・パネル・カードの役割色（ライト用とダーク用の 2 セット）
- `--daily` / `--weekly` / `--primary` / `--cat-*`: アクセントとカテゴリ色。別の色にしたいときはここだけ書き換える

パレット色をそのまま使い、混色で中間色を作らない方針です。
