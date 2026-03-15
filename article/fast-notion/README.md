# fast-notion

Notion APIとTypeScript製の自作CLIで、Notionのデータベース(データソース)にメモ(ページ)を追加する方法を解説するための作業ディレクトリです。

## Files

- `article.md`: 記事本文
- `outline.md`: 記事アウトライン
  - 記事中の画像は`[画像の説明: ...]`として差し込み箇所を明記しています

## この記事で扱うもの

- Notion Integrationの作成とトークン(`NOTION_API_KEY`)の取得
- Notionデータベース(データソース)の準備と共有
- iTerm2から`life memo`で1ページ追加する最小CLI実装(TypeScript)

## 参考実装

このリポジトリ内の既存CLI実装として`../../apps/life-cli/`があります。記事では、そこで使っている`memo`相当の最小パターンに絞って解説します。
