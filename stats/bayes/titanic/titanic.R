## 2026-02-20
## titanic

# preparation
pacman::p_load(tidyverse, cmdstanr, posterior)
options(mc.cores = parallel::detectCores())
my_font <- 'HiraginoSans-W3'
theme_set(theme_gray(base_size = 9,
                     base_family = my_font))

# processing
myd_train <- read_csv('titanic/data/train.csv')
myd_test <- read_csv('titanic/data/test.csv')

myd_test$Survived <- NA
myd <- rbind(myd_train, myd_test)
myd <- myd |>
  select(-c(Name, Ticket, Cabin, Embarked))

myd_NAomit <- na.omit(myd) |>
  select(Pclass, Age, Fare)
emp <- rep(NA, times = 2)
emp[1] <- mean(myd_NAomit$Age)
emp[2] <- myd_NAomit |>
  filter(Pclass == 3) |>
  select(Fare) |>
  unlist() |>
  mean()
myd <- myd |>
  mutate(Age  = ifelse(!is.na(Age),  Age,  emp[1]),
         Fare = ifelse(!is.na(Fare), Fare, emp[2]))

myd_train <- myd |>
  filter(!is.na(Survived) == TRUE)
myd_test <- myd |>
  filter(!is.na(Survived) == FALSE)

# design matrix
formula_titanic <- formula(Survived ~ Pclass + Sex + Age
                              + SibSp + Parch + Fare)
design_train <- model.matrix(formula_titanic, data = myd_train)

design_test <- myd_test[, -c(1, 2)] |>
  mutate(Intercept = rep(1, times = n()),
         Sex       = ifelse(Sex == 'male', 1, 0))
design_test <- design_test[, c(7, 1:6)]

# data list
list_titanic <- list(
  N = nrow(myd_train),
  K = 7,
  Y = myd_train$Survived,
  X = design_train,
  N_pred = nrow(myd_test),
  X_pred = design_test
)

# compile
stan_titanic <- cmdstan_model('titanic/titanic.stan')

# mcmc
fit_titanic <- stan_titanic$sample(
  data = list_titanic,
  seed = 1912-04-14,
  chains = 4,
  refresh = 1000,
  iter_warmup = 1000,
  iter_sampling = 3000
)

# result
all(fit_titanic$summary()[, 'rhat'] < 1.1, na.rm = TRUE)
