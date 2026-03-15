# iTerm2から一瞬でNotion DBにメモを追加する: Notion API + TypeScript製CLI

## 概要

この記事では、Notion API（公式SDKの`@notionhq/client`）を使って、ターミナルからNotionのデータベース（データソース）へメモ（ページ）を追加する最小のCLIを作ります。iTerm2で`life memo`のようなコマンドを叩いて1行入力すると、Notion側にページが追加されるところまでをゴールにします（サンプル実装ではコマンド名を`sample-cli`にしています）。

[画像の説明: iTerm2で`life memo`を実行し、Notionにメモが追加されるまでの流れが分かるスクリーンショット(ターミナルとNotion画面の2枚、または並べた1枚)]

### 想定読者

- Notionを使ってメモを管理している
- Node.js/TypeScriptでCLIを作ったことがある、または抵抗がない
- 最小の手順でサクッと記録したい
- 未来の自分（備忘）

### 準備するもの

- [Node.js](https://nodejs.org/ja)
  - 著者はHomebrewでインストール（`brew install node`）
- [iTerm2](https://iterm2.com/) (macOS)
- [Notion](https://www.notion.com/ja)アカウント
- [Notionインテグレーション](https://developers.notion.com/)（Notion API Key）

Node.js / iTerm2 / Notionアカウントは各自で用意してください。Notionインテグレーション（APIトークン）の作成〜取得は、このあとStep 1で扱います。

## Step 1: Notion側の準備(データベースとインテグレーション)

### データベースを作る

まずは、メモを追加する「受け皿」のデータベースを作ります。今回は、新しく作ったページにインラインのデータベースを作成しました（フルページのデータベースでも構いません）。

[fast-notion-01-db]

後ほどCLIから指定するので、Notionが表示するデータソースIDを控えておきます。

[fast-notion-02-data-source-id]
[fast-notion-03-copy]

データソースIDの形式は以下の通りです。

```txt
323cb855-xxxx-xxxx-xxxx-000bb1ba03b7
```

この記事では、この「データソースID」を`.env`の`DATA_SOURCE_ID`に設定します。同じようなUUIDで「データベースID」もあり、間違えやすいため注意が必要です。

また、今回は以下のプロパティを用意します。

- `名前` (Title)
- `タグ` (Multi-select)

`名前`（Title）はすでに作られているので、`タグ`（Multi-select）を新規に作成します。

この2つだけで「本文 + タグ」付きのメモを追加できます。`作成日時`や`ステータス`なども付けたい場合は、同じ要領でプロパティを追加して`properties`に渡します。

[fast-notion-04-multi-select]
[fast-notion-05-tag]

これでデータベースの作成は完了です。

### Integrationを作ってAPIキーを取得する

続いて、Notionのインテグレーション（内部インテグレーション）を作り、APIトークンを発行します。ここで取得するトークンは、以降の手順でCLIからNotionにアクセスするために使います。

まず、[Notion APIのページ](https://developers.notion.com/)にアクセスします。その後、`my integration`のページへ移動します。

[fast-notion-06-view-my-integration]

最下部にある「内部インテグレーション」から新しいインテグレーションを作成します。

[fast-notion-07-internal-integration]

インテグレーション名は自由です（ただし`Notion`という文字列は使えません）。今回は`sample`としました。そして、このインテグレーションの接続先ワークスペースを選択し、作成します。

[fast-notion-08-new-integration]

その後、インテグレーション設定へ行き、「内部インテグレーションシークレット」を取得します。あとで`.env`に書くので、この時点で控えておきます。

[fast-notion-09-secret]

内部インテグレーションシークレットの形式は以下の通りです。

```txt
ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### データベースをインテグレーションに共有する

インテグレーションを作っただけでは、作成したデータベースにアクセスできません。対象データベースの「接続」からインテグレーションを追加して共有します。ここを忘れると、CLIを実行したときに「権限がない」系のエラーになって止まります。

[fast-notion-10-connect]

以上で、Notion側の設定は終了です。

## Step 2: CLIの設計(最小構成)

今回のゴールは、ターミナル上で`sample-cli memo`コマンドを実行し、入力した内容がNotionに新しいページとして追加される状態を作ることです。最小構成に絞るため、入力は「本文（タイトル相当）」のみ、タグは固定値（例: `メモ`）として扱います。

TypeScriptを使って開発し、使用するライブラリは以下の通りとします。

- `@notionhq/client` (Notion公式SDK)
- `commander` (コマンド定義)
- `inquirer` (対話入力)
- `dotenv` (環境変数)
- `chalk` (表示の見やすさ)

また、最終的なディレクトリ構成は以下の通りです。

```txt
.
├─ package.json
├─ tsconfig.json
├─ .env
└─ src/
   ├─ cli.ts
   ├─ commands/
   │  └─ memo.ts
   ├─ prompts/
   │  └─ memoPrompt.ts
   └─ services/
      ├─ notionClient.ts
      └─ notionMemo.ts
```

### プロジェクトを作る

任意のディレクトリを作成します。以降のコマンドは、特に断りがない限りこのプロジェクトディレクトリ内で実行します。

```sh
$ mkdir fast-notion-sample
$ cd fast-notion-sample
```

#### `./package.json`

`npm init -y`を実行すると`package.json`が作成されます。

```sh
$ npm init -y
```

```json
{
  "name": "fast-notion-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```

ライブラリをインストールします。

```sh
$ npm install @notionhq/client commander inquirer dotenv chalk
$ npm install --save-dev typescript @types/node
```

さらに、`"type": "module"`への変更と、`"bin": {}`を追加します。ここで`"type": "module"`にしておくと、TypeScript→JavaScriptに変換したあともNode.jsのES Modulesとして実行しやすくなります。また`"bin"`は、`npm link`したときにどのコマンド名で実行できるかを決めます。最終的な`./package.json`は次の通りです。

依存関係のバージョンは執筆時点の例です（手元の環境では異なる場合があります）。

```diff
{
  "name": "fast-notion-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
+   "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
- "type": "commonjs",
+ "type": "module",
+ "bin": {
+   "sample-cli": "./dist/cli.js"
+ },
+ "dependencies": {
+   "@notionhq/client": "^5.12.0",
+   "chalk": "^5.6.2",
+   "commander": "^14.0.3",
+   "dotenv": "^17.3.1",
+   "inquirer": "^13.3.0"
+ },
+ "devDependencies": {
+   "@types/node": "^24.0.0",
+   "typescript": "^5.9.3"
+ }
}
```

#### `./tsconfig.json`

```
$ npx tsc --init
```

`npx tsc --init`を実行すると`tsconfig.json`が生成されます。この記事では、TypeScript内のimportを`.js`拡張子で書き、`tsc`で出力されたJavaScriptがそのままNode.jsで動く状態に寄せます（ES Modulesでよく使う方針です）。

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

`./tsconfig.json`は以下の通り変更します。

補足: `tsconfig.json`はコメントを含められる形式（JSONC）として扱われるため、サンプルのようにコメントや末尾カンマがあってもTypeScriptは読み取れます。

```diff
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
-   // "rootDir": "./src",
+   "rootDir": "./src",
-   // "outDir": "./dist",
+   "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
-   "types": [""],
+   // "types": [""],
    // For nodejs:
    // "lib": ["esnext"],
-   // "types": ["node"],
+   // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

#### `./.env`

`./.env`ファイルに、先ほど取得した「データソースID」と「内部インテグレーションシークレット」を記述します。トークンは漏洩すると第三者に操作されうるため、`.env`はgit管理しない前提で扱います。

```dotenv
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATA_SOURCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Step 3: Notionクライアントを作る（`notionClient.ts`）

```sh
$ mkdir src
$ mkdir src/services
$ touch src/services/notionClient.ts
```

CLIで大事なのは「どこから実行しても環境変数を確実に読める」ことです。`dotenv.config()`を素朴に呼ぶだけだと、カレントディレクトリによって`.env`が見つかったり見つからなかったりして、環境依存のハマり方をしやすくなります。

この`notionClient.ts`では、実行中のファイル位置（`import.meta.url`）から`__dirname`を組み立て、そこを基準に`.env`の場所を解決しています。ビルド後に`dist/`へ出力し、プロジェクトルートに`.env`を置く構成であれば、`dist/services/notionClient.js`から見て`../../.env`を読めるため、実行時のカレントディレクトリに依存しません。

また、`requiredEnv()`で`NOTION_API_KEY`の未設定を早めに検出し、分かりやすいエラーで止められるようにしています。

```ts
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

export const notion = new Client({
  auth: requiredEnv("NOTION_API_KEY"),
});

export { requiredEnv };
```

## Step 4: memoコマンドの作成（`memoPrompt.ts`, `notionMemo.ts`）

### 対話入力(メモ本文)

```sh
$ mkdir src/prompts
$ touch src/prompts/memoPrompt.ts
```

入力は1項目（メモ本文）だけにします。ここで入力した文字列を、Notion側ではページの`名前`（Title）プロパティに入れます。

```ts
import inquirer from "inquirer";
import chalk from "chalk";

export async function memoPrompt(): Promise<{ title: string }> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: chalk.cyan("メモを入力してください"),
    },
  ]);
  return answers;
}
```

### Notionにページを作成する（`notionMemo.ts`）

Notion側で作ったプロパティ名と、APIに渡す`properties`のキーは一致している必要があります。例えばNotion側のプロパティ名が`タグ`なら、`properties`にも`タグ`というキーで値を渡します。

```ts
import { notion, requiredEnv } from "./notionClient.js";

export async function addMemo(title: string) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: requiredEnv("DATA_SOURCE_ID"),
    },
    properties: {
      名前: {
        title: [
          {
            text: { content: title },
          },
        ],
      },
      タグ: {
        multi_select: [{ name: "メモ" }],
      },
    },
  });
}
```

このサンプルでは`parent`に`"type": "data_source_id"`を指定しています（`database_id`を前提にした情報も多いので、混乱したらNotion公式のアップグレードガイドを確認してください）。

プロパティを増やすときも考え方は同じで、Notion側のプロパティ型（Date/Statusなど）に合わせて`properties`を組み立てます。

### コマンドを定義する（`memo.ts`, `cli.ts`）

```sh
$ mkdir src/commands
$ touch src/commands/memo.ts
```

`memoPrompt()`で入力し、`addMemo()`で投稿します。成功時は緑で1行だけ表示します。

```ts
import chalk from "chalk";
import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";

export async function runMemo() {
  const { title } = await memoPrompt();
  await addMemo(title);
  console.log(chalk.green("✔ memo added"));
}
```

最後にCLIエントリです。`dist/cli.js`を直接実行できるように、先頭に`#!/usr/bin/env node`を書いておきます。ここまでで用意した`memo`コマンドを`commander`で登録し、`sample-cli memo`（または`sample-cli m`）で起動できるようにします。

```sh
$ touch src/cli.ts
```

```ts
#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { runMemo } from "./commands/memo.js";

const program = new Command();

program.name("sample-cli");

program.command("memo").alias("m").description("add memo").action(runMemo);

program.parseAsync().catch((error: unknown) => {
  const isPromptCancel =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ExitPromptError";
  if (isPromptCancel) {
    console.log();
    console.log(chalk.yellow("入力をキャンセルしました"));
    process.exit(0);
  }
  throw error;
});
```

補足: 入力中にキャンセル（例: `Ctrl+C`）すると、`inquirer`は`ExitPromptError`を投げます。このサンプルでは、そのケースだけは「入力をキャンセルしました」と表示して正常終了するようにしています。

## Step 5: ビルドと実行（iTerm2から叩く）

ここまでできたら、TypeScriptをビルドしてCLIとして実行できる状態にします。`npm run build`は`tsconfig.json`の設定に従って`src/`配下のTypeScriptをコンパイルし、`dist/`にJavaScriptを出力します。

```sh
npm run build
```

次に、ローカル環境でコマンドとして実行できるようにします。開発中は`npm link`を使うと、`package.json`の`bin`設定（この例では`sample-cli`）を手元のNode.js環境にリンクできます。リンク後は、`sample-cli memo`で実行できます。

```sh
npm link
sample-cli memo
```

[実行中のGif]

### iTerm2運用(よく使う形に寄せる)

毎回`sample-cli memo`と打つのが面倒なら、シェルのエイリアスを用意して短いコマンドで起動できるようにします。例えば`m`という名前で呼び出したい場合は、`.zshrc`に次の1行を追加します。

```sh
alias m='sample-cli memo'
```

設定を反映するには、ターミナルを開き直すか`.zshrc`を再読み込みします（例: `source ~/.zshrc`）。以降は`m`と打つだけでメモ入力に入れます。

運用していると、タグを固定（この例では`メモ`）にせず切り替えたくなったり、送信先のデータソースを用途別に分けたくなったりします。その場合、設計としては「コマンド引数で受け取る（例: `life memo --tag タスク`）」か、「プロンプトで追加の質問をする（例: タグを選ばせる）」のどちらかに寄せると破綻しにくいです。前者は自動化やエイリアスと相性がよく、後者は覚えることが少なくて済みます。

## ハマりポイント(先回り)

ここまでの手順で詰まりやすいのは、Notion側の共有設定とID/プロパティの不一致です。まず、インテグレーションを対象データベースに共有していないと、APIは権限エラーになります。次に、`DATA_SOURCE_ID`は似た見た目のIDと取り違えやすいので、コピー元が「データソースID」になっているかを確認してください。さらに、`properties`のキー（例: `名前`、`タグ`）はNotionのデータベース上のプロパティ名と完全一致する必要があり、日本語名は特にタイプミスに気づきにくいです。最後に、`.env`が読み込めていないと`NOTION_API_KEY`や`DATA_SOURCE_ID`が空になり、どの処理も動きません。このサンプルは実行ファイルの場所（`dist/services/notionClient.js`）から相対パスで`.env`を探すため、ビルド後に`dist/`の配置や実行ファイルの場所を変えた場合は、`.env`との相対位置を見直してください。

## セキュリティと運用

Notionのトークンはパスワード相当なので、扱いを決めておくと安心です。`.env`はgit管理しないようにして、公開リポジトリに混ざらない状態を保ちます。また、ターミナルのログやスクリーンショットにトークンが映り込まないように注意してください。権限スコープについても、必要以上に広げず、今回の用途であれば「対象データベースにだけ共有する」を基本にすると事故を減らせます。

## 発展: 日記/家計簿に広げる

`memo`が動いたら、同じパターンでコマンドを増やせます。増やすときに悩みがちなのが「データベースを分けるか、統合するか」です。用途ごとに必要なプロパティが大きく違うならデータベースを分けたほうが運用しやすく、検索や集計を横断して行いたいなら1つに統合したほうが扱いやすくなります。

著者は、メモ・タスク・日記を同じデータベースに統合しタグで管理している他、家計簿は`DATA_SOURCE_ID_BALANCE`、日々のニュース収集・分析は`DATA_SOURCE_ID_NEWS`のように用途別のデータベースを別で用意しています。

## まとめ

Notionのデータベース（データソース）とインテグレーション、そして最小のCLIを組み合わせると、「書く場所はNotion、入力はターミナル」という流れをすぐに作れます。iTerm2からの1発記録は、記録を続けるための摩擦を減らすのに効果的です。
