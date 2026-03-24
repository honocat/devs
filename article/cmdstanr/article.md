# `{cmdstanr}`でStanをRから使う：インストールから（実践）Kaggle Titanicまで

Stanは「モデルを書いて、データを渡して、MCMCで事後分布をサンプルする」ための言語・ツールチェーンです。`{cmdstanr}`は、そのStan（CmdStan）を**Rから呼び出すための公式寄りのインターフェース**で、`{rstan}`よりも「Stan本体に近い形」で動かせます。

この記事では、`{cmdstanr}`でStanを回す最短ルートを押さえたあと、実践としてKaggle Titanicの生存予測（ベイズ版ロジスティック回帰）を一通り動かします。

このディレクトリには、最小例（線形回帰）とTitanic例のスクリプト・Stanファイルが置いてあります。

- 最小例：`cmdstan.R`, `cmdstan.stan`, `data.csv`
- Titanic例：`titanic/titanic.R`, `titanic/titanic.stan`

---

## 0. この記事でやること / やらないこと

### やること

- `{cmdstanr}`の基本：インストール → コンパイル → MCMC → 診断（最低限）
- 実践：Kaggle Titanicの生存予測（ロジスティック回帰）を動かす

### やらないこと

- Stan言語の網羅的な解説（必要箇所だけ）
- ベイズ統計の理論を丁寧に説明（必要最小限の直感のみ）

---

## 1. 前提（環境・読者・使用パッケージ）

### 想定読者

- Rは触れる
- Stanは初めて、または`{rstan}`から移行したい

### 動作環境の前提

- R / RStudio
- C++のビルド環境（CmdStanのコンパイルに必要）
  - macOS：Xcode Command Line Tools
  - Windows：Rtools（＋必要に応じて追加設定）
  - Linux：`g++`等のビルドツール

### 使うパッケージ

- `{cmdstanr}`：Stan（CmdStan）をRから実行
- `{posterior}`：MCMC出力（draws）の扱い
- `{tidyverse}`：データ処理・可視化
- （任意）`{pacman}`：`p_load()`でまとめてロード

---

## 2. `{cmdstanr}` / CmdStan のインストール

### 2.1 Rパッケージのインストール

まずはR側のパッケージを入れます。

```r
install.packages(c("cmdstanr", "posterior", "tidyverse"))
```

`pacman`を使う場合は、スクリプト内で次のようにまとめてロードできます（このリポジトリの例もこの書き方です）。

```r
pacman::p_load(tidyverse, cmdstanr, posterior)
```

### 2.2 CmdStanのインストール

`{cmdstanr}`は、背後で**CmdStan（Stanのコマンドライン版）**を使って動きます。CmdStan自体が入っていないと、Stanコードのコンパイル・実行ができません。

```r
cmdstanr::install_cmdstan()
cmdstanr::cmdstan_version()
```

ポイントは次の通りです。

- `install_cmdstan()`は、CmdStanのダウンロードとビルドを行う（時間がかかることがあります）
- 失敗する場合の典型原因は「C++コンパイラが無い / 使えない」
- 既にインストール済みのCmdStanを使いたい場合は`cmdstanr::set_cmdstan_path()`でパスを指定できます

---

## 3. まずは最小構成で動かす（線形回帰の例）

Titanicに入る前に、まずは最小のループを通します。

1. データをStanに渡す形（`list`）にする
2. Stanファイルをコンパイルする
3. MCMCでサンプリングする
4. 収束をざっと確認する

このディレクトリ直下に、最小例のファイルがあります。

- R：`cmdstan.R`
- Stan：`cmdstan.stan`
- データ：`data.csv`

手元でこの例をそのまま実行するだけなら、Rで次を走らせればOKです。

```r
source("cmdstan.R")
```

### 3.1 データ読み込みとリスト化

Stanには「配列・行列・スカラー」中心のデータを渡します。R側でデータフレームを作っても、最後は`list(...)`にまとめるのが基本です。

このリポジトリの最小例（`cmdstan.R`）では次の形にしています。

```r
myd <- readr::read_csv("data.csv")

myd_list <- list(
  N = nrow(myd),
  Y = myd$sales,
  X = myd$temperature,
  Z = myd$people
)
```

ここで大事なのは、Stan側の`data { ... }`ブロックで宣言する変数名と、R側の`list`のキーが一致することです。

### 3.2 Stanファイルの構造（ざっくり）

`cmdstan.stan`は正規線形回帰の最小例です。Stanの基本構造は次の4つが頻出です。

- `data`：外から渡されるデータ
- `parameters`：推定したいパラメータ（事前分布を置く対象）
- `transformed parameters`：計算で作る中間量（例：線形予測子）
- `model`：尤度と事前分布（＝モデルの定義）

たとえば`cmdstan.stan`では、`mu[n] = beta1 + beta2 * X[n] + beta3 * Z[n]`のような形で平均を作り、`Y ~ normal(mu, sigma)`で尤度を置いています。

### 3.3 コンパイルとMCMC実行（CmdStanR）

`{cmdstanr}`では次の2段階が基本です。

1. `cmdstan_model()`でStanファイルをコンパイル（C++に変換してビルド）
2. `$sample()`でMCMC

```r
options(mc.cores = parallel::detectCores())

stan <- cmdstanr::cmdstan_model("cmdstan.stan")

fit <- stan$sample(
  data = myd_list,
  seed = 123,
  chains = 4,
  iter_warmup = 1000,
  iter_sampling = 3000,
  refresh = 1000
)
```

最低限見るべき引数は以下です。

- `chains`：チェイン数（まずは4でOK）
- `iter_warmup`：ウォームアップ（バーンイン）
- `iter_sampling`：サンプリング数
- `seed`：再現性のため固定推奨

### 3.4 結果の確認（`{posterior}`）

まずはサマリを出します。

```r
fit$summary()
```

収束診断として最低限は`rhat`を見ます（雑に言うと、1.0に近いほど良い）。

```r
all(fit$summary()[, "rhat"] < 1.1)
```

次に、トレースプロット（チェインが混ざっているか）を一つだけ確認します。`{cmdstanr}`の`fit$draws()`は`{posterior}`の`draws`オブジェクトとして扱えます。

```r
post <- fit$draws() |>
  posterior::as_draws_df() |>
  dplyr::mutate(chains = as.factor(.chain))

ggplot2::ggplot(post) +
  ggplot2::geom_line(ggplot2::aes(x = .iteration, y = beta2, color = chains)) +
  ggplot2::labs(x = "iteration", y = expression(beta[2])) +
  ggplot2::theme_minimal() +
  ggplot2::theme(legend.position = "none")
```

ここまでで、「StanをRから回して、結果を確認する」最小ループは完成です。

---

## 4. 実践：Kaggle Titanicの生存率を予測する

ここからが本題です。READMEの流れに合わせて、

1. データの前処理・可視化
2. デザイン行列
3. Stanファイル記述
4. MCMC
5. 結果

を進めます。

このリポジトリにはTitanic用のスクリプトが入っています。

- R：`titanic/titanic.R`
- Stan：`titanic/titanic.stan`

データ配置ができたら、（作業ディレクトリに注意して）次で一通り実行できます。

```r
source("titanic/titanic.R")
```

### 4.1 Titanic問題の概要（何を予測するか）

Kaggle Titanicは、乗客ごとに「生存したかどうか」を当てる2値分類です。

- 目的変数：`Survived`（0/1）
- 説明変数の例：`Pclass`, `Sex`, `Age`, `SibSp`, `Parch`, `Fare`

注意点として、Titanicは「前処理・特徴量設計・欠損」がスコアに直結します。今回は`{cmdstanr}`の練習が主目的なので、モデルはシンプルなロジスティック回帰にします。

### 4.2 データの前処理・可視化

#### データ配置

Kaggleから`train.csv`と`test.csv`を取得して、`titanic/`ディレクトリに置いてください（`titanic/titanic.R`がその前提で読みに行きます）。

#### 読み込みと結合

`titanic/titanic.R`では次の流れで前処理しています。

- `train.csv`と`test.csv`を読み込み
- `test`側に`Survived`列を追加して結合（同じ処理で整形できるようにする）
- 使わない列（例：`Name`, `Ticket`, `Cabin`, `Embarked`）を落とす

#### 欠損の補完（簡易）

この例では、欠損を次のように埋めています。

- `Age`：全体平均
- `Fare`：`Pclass == 3`の平均

「なぜその補完なのか」は本来検討余地がありますが、ここでは手順の分かりやすさを優先します。

#### 可視化（最低限）

まずは生存×性別の分布、年齢・運賃の分布をざっと見ます（`titanic/titanic.R`に例があります）。

- 生存×性別の棒グラフ
- 年齢のヒストグラム
- 運賃のヒストグラム（クラス別）

この段階で「性別が強そう」「クラスと運賃も効きそう」「年齢は非線形かも」などの当たりを付けておくと、次のモデル解釈がやりやすくなります。

### 4.3 デザイン行列（model matrix）の作成

Stanに渡すときは、回帰であれば**行列`X`**にしてしまうのが扱いやすいです。

#### 推定用（train）のデザイン行列

`model.matrix()`で作ります。

```r
formula_titanic <- stats::formula(Survived ~ Pclass + Sex + Age + SibSp + Parch + Fare)
design_train <- stats::model.matrix(formula_titanic, data = myd_train)
```

`Sex`のようなカテゴリ変数は、ここでダミー化された列になります（列名はR側が決めます）。

#### 予測用（test）のデザイン行列

予測用は「列構成が推定用と一致」している必要があります。`titanic/titanic.R`では、次の方針で作っています。

- `PassengerId`と`Survived`を落とす
- 切片列（`Intercept`）を追加
- `Sex`は手動で`male = 1, female = 0`に変換
- 列の順番を並べ替えて`X_pred`にする

「手動で作るとズレやすい」ので、本格的にやるならtrain/testをまとめて同じ変換を通す（または`model.matrix()`で統一）方が安全です。今回はスクリプトが動くことを優先します。

#### Stanへ渡すデータリスト

最終的にStanへ渡すのは次の`list`です（`titanic/titanic.R`と同じ）。

```r
myd_list <- list(
  N = nrow(myd_train),
  K = ncol(design_train),
  Y = myd_train$Survived,
  X = design_train,
  N_pred = nrow(myd_test),
  X_pred = design_test
)
```

ここでも、Stan側の`data { ... }`と変数名・形が一致していることが最重要です。

### 4.4 Stanファイル記述（ロジスティック回帰）

TitanicのStanモデルは`/titanic/titanic.stan`です。構造は次の通りです。

- `data`：`N`, `K`, `Y`, `X`, `N_pred`, `X_pred`
- `parameters`：係数ベクトル`beta`（長さ`K`）
- `transformed parameters`：`theta = inv_logit(X * beta)`（各乗客の生存確率）
- `model`：`Y ~ bernoulli(theta)`（尤度）と`beta`の事前分布
- `generated quantities`：`theta_pred`と`Y_pred`（予測の生成）

2値分類の基本形はこの1行です。

- `theta = inv_logit(X * beta)`
- `Y ~ bernoulli(theta)`

事前分布は例として`beta ~ cauchy(0, 50)`を置いています。実務ではもう少し情報的な事前分布（スケールを絞るなど）を検討することが多いですが、ここではまず動かします。

### 4.5 MCMC（サンプリング）の実行

あとは最小例と同じ流れで実行できます。

```r
options(mc.cores = parallel::detectCores())

stan_titanic <- cmdstanr::cmdstan_model("titanic.stan")
fit_titanic <- stan_titanic$sample(
  data = myd_list,
  seed = 19120414,
  chains = 4,
  iter_warmup = 1000,
  iter_sampling = 3000,
  refresh = 1000
)
```

Titanic例のスクリプトは`setwd("titanic")`相当の場所で動かす前提です。RStudioなら「プロジェクトの作業ディレクトリ」と、Stanファイルの相対パスが合っているかを確認してください。

### 4.6 結果の確認（診断と解釈）

#### 収束（最低限）

```r
all(fit_titanic$summary()[, "rhat"] < 1.1)
```

`rhat`が大きいパラメータがあれば、まずは以下を疑います。

- 反復数が足りない（`iter_warmup`, `iter_sampling`を増やす）
- 事前分布が弱すぎる / スケールが合っていない
- デザイン行列のスケールが極端（標準化を検討）

#### 係数の解釈

ロジスティック回帰の係数`beta`は「対数オッズ（log-odds）の変化量」です。

- 符号が正：生存しやすい方向
- 符号が負：生存しにくい方向
- 大きさ：影響の強さ（ただしスケールに依存）

この段階では、まずは「`Sex`の係数が強い」「`Pclass`が効く」など、直感と合うかを確認するのが良いです。

### 4.7 予測と提出（Kaggle submit）

`titanic/titanic.stan`では、`generated quantities`で`Y_pred`（0/1の予測）を生成しています。スクリプト側では、`fit_titanic$summary("Y_pred")`から平均を取り、0.5を閾値にして生存/死亡を決めています。

```r
res <- fit_titanic$summary("Y_pred")[, "mean"] |> unlist()
myd_test$Survived <- ifelse(res < 0.5, 0, 1)
```

Kaggle提出用には、`PassengerId`と`Survived`の2列CSVを作ります（ファイル名は`submission.csv`など）。

```r
readr::write_csv(
  dplyr::select(myd_test, PassengerId, Survived),
  "submission.csv"
)
```

ここまで動けば、`{cmdstanr}`で「データ→Stan→MCMC→予測」の一連の流れが通ったことになります。

---

## 5. まとめ

- `{cmdstanr}`は「Stan（CmdStan）に近い形」でRから実行でき、ワークフローが明快です
- 最小例で、コンパイル→サンプリング→診断のループを確認しました
- Titanic例で、前処理→デザイン行列→Stan→MCMC→予測までを一通り実装しました

Titanicは練習にちょうど良い一方で、精度を上げるなら改善余地が大きいです（特徴量追加、階層モデル化、事前分布の調整、欠損処理の見直し、標準化など）。

---

## 付録：トラブルシューティング

### CmdStanが入らない / コンパイルできない

- C++コンパイラが入っているか確認（OS別）
- 会社PCなどでビルドが制限される場合は、別環境（WSL, Docker, 手元PC）を検討

### `cmdstan_path()` / `set_cmdstan_path()`まわりで詰まる

- `cmdstanr::cmdstan_path()`で現在の設定を確認
- 既存のCmdStanを使うなら`cmdstanr::set_cmdstan_path("...")`で明示

### Stanファイルが見つからない（相対パス問題）

- Rの作業ディレクトリ（`getwd()`）と、Stanファイルの相対パスが一致しているか確認
- Titanic例は`"titanic.stan"`を読むため、`titanic/`で実行するか、パスを`"titanic/titanic.stan"`にする
