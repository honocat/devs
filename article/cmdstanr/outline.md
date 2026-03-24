# `{cmdstanr}`でStanをRから使う：インストールから（実践）Kaggle Titanicまで

> この記事は骨組み（アウトライン）です。本文・図・数式・出力例はあとで埋める前提で、必要な流れと見出しだけ先に固めます。

## 0. この記事でやること / やらないこと

- やること
  - Rから`{cmdstanr}`でStanを実行する最短ルート（インストール→コンパイル→MCMC→診断）
  - 実践例としてKaggle Titanicの生存予測（ロジスティック回帰）を一通り動かす
- やらないこと
  - Stan言語そのものの網羅的解説（必要箇所だけ）
  - ベイズ統計の理論解説（必要な直感だけ）

## 1. 前提（環境・読者・使用パッケージ）

- 想定読者
  - Rは触れるがStanは初めて、または`{rstan}`から移行したい人
- 動作環境（例）
  - R / RStudio
  - C++ツールチェーン（OS別に注意点）
- 使うパッケージ
  - `{cmdstanr}`, `{tidyverse}`, `{posterior}`（必要なら`{pacman}`）

## 2. `{cmdstanr}` / CmdStan のインストール

### 2.1 Rパッケージのインストール

- `install.packages()`で入れる手順
- （任意）`pacman::p_load()`で読み込み

### 2.2 CmdStanのインストール

- `cmdstanr::install_cmdstan()`の実行
- `cmdstanr::cmdstan_version()`で確認
- よくある詰まりどころ（コンパイラ、PATH、権限）

## 3. まずは最小構成で動かす（線形回帰の例）

> 目的：Titanicに入る前に「Stanファイル→コンパイル→サンプリング→結果確認」の最小ループを確認する。

- 参照ファイル
  - Rスクリプト：`cmdstan.R`
  - Stanモデル：`cmdstan.stan`
  - データ：`data.csv`

### 3.1 データ読み込みとリスト化

- `readr::read_csv()`で読み込み
- Stanに渡す`list(...)`の作り方（`N`, `Y`, `X`, `Z`など）

### 3.2 Stanファイルの構造（ざっくり）

- `data / parameters / transformed parameters / model`の役割
- 事前分布と尤度（この例では正規回帰）

### 3.3 コンパイルとMCMC実行（CmdStanR）

- `cmdstanr::cmdstan_model()`でコンパイル
- `$sample()`でサンプリング（`chains`, `iter_warmup`, `iter_sampling`, `seed`）
- 並列化（`options(mc.cores = parallel::detectCores())`）

### 3.4 結果の確認（`{posterior}`）

- `fit$summary()`
- 収束診断の最低限（`rhat`）
- トレースプロット / 事後分布の可視化（必要最小限）

## 4. 実践：Kaggle Titanicの生存率を予測する

> ここからが本題。READMEの流れ（前処理→デザイン行列→Stan→MCMC→結果）に沿って進める。

- 参照ファイル
  - Rスクリプト：`titanic/titanic.R`
  - Stanモデル：`titanic/titanic.stan`
  - データ：Kaggleの`train.csv`, `test.csv`（配置場所を明記）

### 4.1 Titanic問題の概要（何を予測するか）

- 目的変数：`Survived`（0/1）
- 使う説明変数（例：`Pclass`, `Sex`, `Age`, `SibSp`, `Parch`, `Fare`）
- 評価（Kaggleのスコア）と注意点（リーク、過学習、欠損など）

### 4.2 データの前処理・可視化

- `tidyverse`で読み込み→結合→必要列の抽出
- 欠損処理（`Age`, `Fare`の補完方針）
- 可視化（例）
  - 生存×性別の棒グラフ
  - 年齢分布 / 運賃分布（クラス別）

### 4.3 デザイン行列（model matrix）の作成

- 目的：Stanに渡しやすい`X`（行列）にする
- `model.matrix()`で推定用`X`を作る
- 予測用`X_pred`を作る（切片、ダミー変数、列順の一致）
- Stanへ渡すデータリスト（`N`, `K`, `Y`, `X`, `N_pred`, `X_pred`）

### 4.4 Stanファイル記述（ロジスティック回帰）

- `bernoulli(inv_logit(X * beta))`の形
- 事前分布（例：`beta ~ cauchy(0, 50)`）をどう置くか
- `generated quantities`で予測値（`theta_pred`, `Y_pred`）を生成

### 4.5 MCMC（サンプリング）の実行

- `cmdstan_model('titanic.stan')`→`$sample(data = myd_list, ...)`
- サンプリング設定の目安（チェイン数、ウォームアップ、反復数）

### 4.6 結果の確認（診断と解釈）

- `rhat < 1.1`の確認
- トレースプロット（`beta`の一部を例に）
- 係数の解釈（符号・大きさ・不確実性）

### 4.7 予測と提出（Kaggle submit）

- `Y_pred`（または`theta_pred`）から生存/死亡を決める閾値
- `PassengerId`と`Survived`のCSVを作る
- （任意）予測結果の可視化（性別別など）

## 5. まとめ

- `{cmdstanr}`で「Stan→MCMC→診断」の流れが回ったか
- Titanicは“最小の実践例”として良いが、モデル改善余地が大きい（特徴量、階層化、事前分布など）

## 付録：トラブルシューティング

- CmdStanが入らない / コンパイルできない（C++ツールチェーン）
- `cmdstan_path()` / `set_cmdstan_path()`関連
- Windows / macOS / Linuxの差分（必要なら追記）

