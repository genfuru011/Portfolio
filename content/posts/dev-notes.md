---
title: 開発ノート
date: 2025-01-05
description: ポートフォリオサイト開発時のメモ。技術選定、コマンド、改善候補などをまとめています。
---

![開発ノート](/images/_R000177.JPG)

# 開発ノート

- 作成日: 2025-11-03
- 最終更新: 2025-11-29
- 対象: Portfolio-hono（Cloudflare Workers + Hono）

## 現状サマリ

- Hono + Cloudflare Workers で SSR（`hono/jsx-renderer`）を使用。
- 静的アセットは Wrangler `[assets]` で `public/` から配信（`ASSETS` バインディング）。
- Tailwind CSS v4 はローカルビルド（`src/style.css` → `public/tailwind.css`）。
- Lint/Format は Biome。ビルド生成物は `biome.json` で除外。
- ブログ機能は Markdown ベース（`content/posts/` → `src/blog/posts.ts` に自動生成）。
- シンタックスハイライトは highlight.js（github-dark テーマ）。

## サイト構成

| URL | ページ | コンポーネント |
|-----|--------|---------------|
| `/` | Home | `Home.tsx` - devas.life 風カード型ブログ一覧 |
| `/about` | About Me | `App.tsx` - プロフィール・経歴 |
| `/blog` | Blog一覧 | `BlogList.tsx` - 従来のリスト表示 |
| `/blog/:slug` | 記事詳細 | `BlogPost.tsx` - Markdown レンダリング |

## 主要ファイル

### ルーティング・レンダラー
- `src/index.tsx`: Hono アプリ、ルーティング定義
- `src/renderer.tsx`: HTML シェル、CDN 読み込み（HTMX, Alpine.js, highlight.js）

### コンポーネント
- `src/components/Home.tsx`: トップページ（カード型ブログプレビュー）
- `src/components/App.tsx`: About ページ
- `src/components/BlogList.tsx`: ブログ一覧
- `src/components/BlogPost.tsx`: 記事詳細

### ブログシステム
- `content/posts/*.md`: Markdown 記事ファイル
- `scripts/build-posts.ts`: Markdown → TypeScript 変換スクリプト
- `src/blog/posts.ts`: 自動生成される記事データ

### 設定
- `wrangler.toml`: Cloudflare Workers 設定
- `biome.json`: Lint/Format 設定
- `tsconfig.json`: TypeScript 設定

## よく使うコマンド

```bash
# 開発
npm run dev          # Wrangler dev サーバー起動

# ビルド
npm run build:posts  # Markdown → posts.ts 生成
npm run build:css    # Tailwind CSS ビルド
npm run build        # 全ビルド（posts + css + dry-run）

# デプロイ
npm run deploy       # Cloudflare Workers にデプロイ

# Lint/Format
npm run lint         # Biome lint
npm run lint:fix     # 自動修正
npm run format       # フォーマット
```

## ブログ記事の追加方法

1. `content/posts/` に Markdown ファイルを作成
2. frontmatter に `title`, `date`, `description` を記載
3. 本文の最初に画像を入れるとサムネイルとして自動抽出

```markdown
---
title: 記事タイトル
date: 2025-01-01
description: 記事の概要
---

![サムネイル](/images/example.jpeg)

## 本文
```

4. `npm run build:posts` で `posts.ts` を再生成

## 技術的メモ

### サムネイル画像の自動抽出
- `build-posts.ts` で Markdown 本文から最初の `![...](...)` を正規表現で抽出
- frontmatter での指定は不要（本文抽出方式を採用）

### シンタックスハイライト
- highlight.js を CDN から読み込み
- テーマ: `github-dark`（ダーク背景で視認性良好）
- `DOMContentLoaded` で `hljs.highlightAll()` を実行

### ナビゲーション構造
- 全ページ共通ヘッダー: 名前リンク + About リンク
- Home: GitHub, X アイコンも表示
- 記事詳細: 「← Back to Home」リンク

## 今後の改善候補

- [ ] `/blog` を削除して Home に完全統合
- [ ] ダークモード対応
- [ ] RSS/Atom フィード生成
- [ ] OGP 画像の動的生成
- [ ] タグ/カテゴリー機能
- [ ] 検索機能
- [ ] SEO 強化（OG/Twitter メタ、JSON-LD）

## 決定・ログ

- 2025-11-03: リポジトリ現状レビューとノート初版作成。
- 2025-11-03: 未使用依存削除（UnoCSS, vite-ssr-components 等）。
- 2025-11-03: `pnpm-lock.yaml` を削除（npm を前提）。
- 2025-11-29: Home ページを devas.life 風カード型レイアウトに変更。
- 2025-11-29: About ページを `/about` に移動。
- 2025-11-29: サムネイル画像の自動抽出機能を追加（本文から最初の画像を取得）。
- 2025-11-29: 各記事に画像を追加。
- 2025-11-29: highlight.js によるシンタックスハイライトを追加（github-dark テーマ）。
