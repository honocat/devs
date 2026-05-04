// tatnic.stan
// 2026-02-20

data {
  int<lower=0> N;
  int<lower=0> K;
  array[N] int Y;
  matrix[N, K] X;
  int<lower=0> N_pred;
  matrix[N_pred, K] X_pred;
}

parameters {
  vector[K] beta;
}

transformed parameters {
  vector[N] theta = inv_logit(X * beta);
}

model {
  Y ~ bernoulli(theta);
  beta ~ cauchy(0, 50);
}

generated quantities {
  vector[N_pred] theta_pred;
  vector[N_pred] Y_pred;
  for (n in 1:N_pred) {
    theta_pred[n] = inv_logit(X_pred[n,] * beta);
    Y_pred[n] = bernoulli_rng(theta_pred[n]);
  }
}
