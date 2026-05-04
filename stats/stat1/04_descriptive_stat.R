# 4. 記述統計
## 4.1 1変数の記述統計とデータの可視化
library(tidyverse)

theme_set(theme_gray(base_size = 9,
                     base_family = 'HiraginoSans-W3'))

dir.create('data')
myd <- read_csv('data/fake_data_01.csv')

### 4.1.3 基本的な統計量の計算

View(myd)
head(myd)
tail(myd)
names(myd)
glimpse(myd)
summary(myd)

mean(myd$height)
median(myd$height)
var(myd$height)
sd(myd$height)
max(myd$height) - min(myd$height)
range(myd$height)
IQR(myd$height)

(q1 <- quantile(myd$height, prob = 0.25))
(q3 <- quantile(myd$height, prob = 0.75))
quantile(myd$height, prob = c(0.22, 0.77, 0.87))
quantile(myd$height, prob = c(0, 0.25, 0.5, 0.75, 1))
fivenum(myd$height)

### 4.1.4 変数の可視化

hist_h <- ggplot(myd, aes(x = height)) +
  geom_histogram(color = 'black')
plot(hist_h)

hist_h2 <- hist_h +
  labs(x = '身長（cm）',
       y = '度数')
plot(hist_h2)

hist_h3 <- ggplot(myd, aes(x = height)) +
  geom_histogram(color = 'black',
                 fill  = 'dodgerblue') +
  labs(x = '身長（cm）',
       y = '度数')
plot(hist_h3)

hist_h4 <- ggplot(myd, aes(x = height)) +
  geom_histogram(color = 'black',
                 fill  = 'dodgerblue',
                 binwidth = 5) +
  labs(x = '身長（cm）',
       y = '度数')
plot(hist_h4)

hist_h5 <- ggplot(myd,
                  aes(x = height,
                      y = after_stat(density))) +
  geom_histogram(color = 'black',
                 fill  = 'dodgerblue',
                 binwidth = 5) +
  labs(x = '身長（cm）',
       y = '確率密度')
plot(hist_h5)

## 4.2 2変数の記述統計とデータの可視化
### 4.2.1 2つの量的変数の関係を図示する

scat <- ggplot(myd,
               aes(x = height,
                   y = weight)) +
  geom_point() +
  labs(x = '身長（cm）',
       y = '体重（kg）')
plot(scat)

### 4.2.2 2つの量的変数の関係を統計量で表す

cor(myd$height, myd$weight)

### 4.2.3 散布図と相関係数

x <- -10:10
y <- x^2
cor(x, y)

newd <- tibble(x = x, y = y)
scat2 <- ggplot(newd, aes(x = x, y = y)) +
  geom_point()
plot(scat2)
