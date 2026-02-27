// cmdstan.stan
// CmdStanの解説のためのStanファイルです．
// https://qiita.com/Honoka-Nakano/items/b26222aec402b9ecabf9

// 分析に用いるデータを定義する．
data {
  int<lower=0> N;  // サンプルサイズ
  array[N] int Y;  // ビールの売上
  array[N] real X; // 気温
  array[N] int Z;  // 来客数
}

// 推定したいパラメタを定義する．
parameters {
  real beta1;          // 切片
  real beta2;          // 説明変数Xの係数
  real beta3;          // 説明変数Zの係数
  real<lower=0> sigma; // 結果変数が従う正規分布の標準偏差
}

// リンク関数を参考にパラメタを変換する．
transformed parameters {
  array[N] real mu;
  for (n in 1:N) {
    mu[n] = beta1 + beta2 * X[n] + beta3 * Z[n];
  }
}

// 分析に用いるモデルを定義する．
model {
  Y ~ normal(mu, sigma);
  beta1 ~ normal(0, 10);
  beta2 ~ normal(0, 10);
  beta3 ~ normal(0, 10);
  sigma ~ normal(0, 10);
}
