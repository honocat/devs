# [100 Raect Apps](https://honocat.github.io/works)

## memo

1. `vite.config.ts`に`base`を追加

```
export default defineConfig({
    base: "/100-react-apps/<appname>",
})
```

2. `npm run build`を実行

生成された`./<app>/dist`を`./docs`に移動。
