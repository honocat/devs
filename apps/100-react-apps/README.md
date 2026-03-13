# 100 React Apps on GitHub Pages

`devs/apps/100-react-apps/`配下のVite + ReactアプリをGitHub Pagesに公開する手順。

## 公開先 URL

`https://honocat.github.io/works/100-react-apps/<app-name>/`

## 1) Viteの`base`を設定する

公開したいアプリの`vite.config.ts`に`base`を設定します。

```ts
export default defineConfig({
  // ...
  base: "/works/100-react-apps/<app-name>/",
});
```

## 2) ビルドする

```bash
cd apps/100-react-apps/<app-name>/
npm ci
npm run build
```

## 3) `docs`配下に配置する

`dist`の中身を、GitHub Pagesで公開しているディレクトリに配置します。

```bash
mkdir -p ../docs/<app-name>
cp -r ./dist/* ../docs/<app-name>/
```

## 4) GitHub Pagesの設定

このリポジトリをPages公開元にしている場合、Settings > Pagesで次を確認します。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/apps/100-react-apps/docs`

## 5) 反映

`main`にpushすると数分で反映される。

```bash
git add apps/100-react-apps/docs/<app-name> apps/100-react-apps/<app-name>/vite.config.ts
git commit -m 'Deploy <app-name> to GitHub Pages under /works/100-react-apps/<app-name>'
git push origin main
```
