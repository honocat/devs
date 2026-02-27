## cmdstan.R
## CmdStanの解説のためのRスクリプトファイルです．
## https://qiita.com/Honoka-Nakano/items/b26222aec402b9ecabf9

# 事前準備
## パッケージの読み込み．
pacman::p_load(tidyverse,
               cmdstanr,
               posterior)
## 処理の高速化．
options(mc.cores = parallel::detectCores())

# 2. Rでデータリストの作成
## データの読み込み
myd <- read_csv('data.csv')

## データの確認
glimpse(myd)

## データのリスト化
myd_list <- list(
  N = nrow(myd),       # サンプルサイズ(N = 100)
  Y = myd$sales,       # ビールの売数(結果変数Y)
  X = myd$temperature, # 気温(説明変数X)
  Z = myd$people       # 来客数(説明変数Z)
)

# 4. MCMCの実行
## Stanファイルのコンパイル
stan <- cmdstan_model('cmdstan.stan')

## MCMC!
fit <- stan$sample(
  data = myd_list,     # 分析に用いるデータのリスト
  seed = 123,          # 乱数の種
  chains = 4,          # チェイン数(規定値は4)
  refresh = 1000,      # コンソールに表示される結果の間隔
  iter_warmup = 1000,  # バーンイン期間
  iter_sampling = 3000 # サンプリング
)

# 5. 結果の確認
fit$summary()

## 収束の確認
### rhat
all(fit$summary()[, 'rhat'] < 1.1)

### トレースプロット
post <- fit$draws() |>
  as_draws_df() |>
  mutate(chains = as.factor(.chain))
post |>
  ggplot() +
  geom_line(aes(x = .iteration,    # 繰り返し数
                y = beta2,         # トレースプロットを確認したいパラメタ
                color = chains)) + # チェインによって色を変える
  labs(x = 'iteration' , y = expression(beta[2])) +
  theme_minimal() +
  theme(legend.position = 'none')  # 凡例を消す（必須ではない）

## 結果の可視化
post |>
  ggplot() +
  geom_histogram(aes(x = beta2,
                     y = after_stat(density)),
                 color = 'black') +
  labs(x = expression(beta[2]), y = '密度') +
  theme_minimal()
### beta2が1.17より大きくなる確率
mean(post$beta2 > 1.17)

# 付録
## 分析前の可視化．
### 売上の分布．
myd |>
  ggplot() +
  geom_histogram(aes(x = sales,
                     y = after_stat(density)),
                 color = 'black') +
  labs(x = 'ビールの売上（個数）', y = '密度') +
  theme_minimal()

### 気温と売上の関係（散布図）．
myd |>
  ggplot(aes(x = temperature,
             y = sales)) +
  geom_point() +
  geom_smooth(method = 'lm') +
  labs(x = '気温（度）', y = 'ビールの売上（個数）') +
  theme_minimal()

## 事前分布の可視化．
### beta_k
tibble(x = seq(-30, 30, length.out = 100)) |>
  mutate(y = dnorm(x, mean = 0, sd = 10)) |>
  ggplot() +
  geom_line(aes(x = x, y = y)) +
  labs(x = expression(beta[k]), y = '密度') +
  theme_minimal()

### sigma
tibble(x = seq(0, 30, length.out = 100)) |>
  mutate(y = dnorm(x, mean = 0, sd = 10)) |>
  ggplot() +
  geom_line(aes(x = x, y = y)) +
  labs(x = expression(sigma), y = '密度') +
  theme_minimal()

## postdens_onesideplot()を使った可視化
postdens_onesideplot(post$beta2,                 # 可視化したいパラメタ
                     cutpoint = 1.17,            # カットポイント
                     xlab = expression(beta[2]), # x軸のラベル
                     ylab = '密度') +            # y軸のラベル
  theme_minimal()
