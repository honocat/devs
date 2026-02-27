// intro/exercise/stan/ex1.stan
// 2026-02-17

data {
  int<lower=0> N;
  vector[N] H;
}

parameters {
  real<lower=0> theta;
  real<lower=0> sigma;
  real<lower=0> mu;
  real<lower=0> tau;
}

model {
  H ~ normal(theta, sigma);
  theta ~ normal(mu, tau);
  sigma ~ cauchy(0, 1);
  mu ~ normal(170, 2);
  tau ~ cauchy(0, 1);
}
