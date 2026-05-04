# iTerm2から一瞬でNotion DBにメモを追加する: Notion API + TypeScript製CLI

## 想定読者

- Notionにメモ/日記/家計簿を集約したい
- Node.js/TypeScriptでCLIを作ったことがある、または抵抗がない
- iTerm2からサクッと記録したい

## この記事でやること

- Notionのデータベース(データソース)に「メモ」ページを追加する最小構成を作る
- iTerm2から`memo`コマンド1発で入力し、Notionに反映されるところまで通す

## 完成イメージ

- 実行例: `life memo` (または短縮エイリアス)
- 対話入力: 1行のメモを入力
- Notion DBに新規ページが作られ、`タグ/作成日時/ステータス`も自動で入る

## 前提・準備

- Node.js (LTS想定)
- iTerm2 (macOS)
- Notionアカウント
- Notion Integration (Internal integration)

## Step 1: Notion側の準備(データベースとIntegration)

### データベース(データソース)を作る

- 目的: CLIが追加するページの「受け皿」を用意する
- 必要なプロパティ(例):
- `名前` (Title)
- `タグ` (Multi-select)
- `作成日時` (Date)
- `ステータス` (Status)

### プロパティ値の前提を決める

- `タグ`: 例として`タスク`を入れられるようにしておく
- `ステータス`: 例として`未着手`というステータスを用意しておく

### Integrationを作ってAPIキーを取得する

- 目的: Notion APIを叩くためのトークンを発行する
- 注意: トークンは`.env`で管理し、記事中に値を貼らない

### データベースをIntegrationに共有する

- ここを忘れると「権限がない」系のエラーになりがち

### データソースIDを取得する

- CLIは`DATA_SOURCE_ID`を使う
- 注意: Notionの「database id」と「data source id」の取り違えが起きやすい
- この章で「どこから何を取るか」を明確にする(スクショ/手順)

## Step 2: CLIの設計(最小構成)

- ゴール: `life memo`でNotionに1ページ追加
- 採用ライブラリ:
- `@notionhq/client` (Notion公式SDK)
- `commander` (コマンド定義)
- `inquirer` (対話入力)
- `dotenv` (環境変数)
- `chalk` (表示の見やすさ)

### コマンド体系

- `life memo` (aliasは任意で`life m`)
- 今回は`memo`のみ解説し、日記/家計簿は発展として扱う

### 設定値(.env)

- `NOTION_API_KEY`
- `DATA_SOURCE_ID`
- 注意: `.env`はgit管理しない

## Step 3: Notionクライアントを作る

- `dotenv`で`.env`を読み込む
- `new Client({ auth: process.env.NOTION_API_KEY })`で初期化する
- 設計ポイント:
- 「CLI起動時に確実に`.env`がロードされる」場所/タイミングに置く

## Step 4: memoコマンド(入力→投稿)

### 対話入力(メモ本文)

- `inquirer`で`title`を受け取る
- iTerm2での入力体験を意識してプロンプト文言を整える

### Notionにページを作成する

- `pages.create`でデータソース配下にページを作る
- `parent.type = data_source_id`を使う
- `properties`にDBのプロパティ名と型を正確に合わせる
- 例の自動設定:
- `タグ`: `タスク`
- `作成日時`: `new Date().toISOString()`
- `ステータス`: `未着手`

## Step 5: ビルドと実行(iTerm2から叩く)

- `tsc`でビルドして`dist`に出す
- `bin`設定で`life`コマンドとして実行できるようにする
- iTerm2運用:
- シェルのエイリアス例: `alias m='life memo'`
- よく使うDB/タグが増えた時の運用方針(引数化、プロンプト追加)

## ハマりポイント(先回り)

- IntegrationをDBに共有していない
- `DATA_SOURCE_ID`が違う(似たIDを入れてしまう)
- プロパティ名が一致していない(日本語名は特に)
- Status/Multi-selectの選択肢名が一致していない
- 環境変数未設定なのに`!`で握りつぶして実行時に落ちる

## セキュリティと運用

- `.env`/APIキーの取り扱い
- Notion Integrationの権限スコープ
- 端末紛失やログ出力にトークンが混ざらない設計

## 発展: 日記/家計簿に広げる

- `memo`と同じパターンで増やせる設計にする
- DBを分ける/統合する判断軸
- `DATA_SOURCE_ID_BALANCE`や用途別データソースの扱い

## まとめ

- Notion DB(データソース) + Integration + CLIの最小セットで「入力体験」を作れる
- iTerm2からの1発記録は、継続しやすさに直結する

## 付録

- 参考実装: `../../apps/life-cli/` (本記事では`memo`相当のみ扱う)
- この記事の最小コード(抜粋)と全量コードの置き場所
