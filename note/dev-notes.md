# 開発ノート

- 作成日: 2025-11-03
- 対象: Portfolio-hono（Cloudflare Workers + Hono）

## 現状サマリ
- Hono + Cloudflare Workers で SSR（`hono/jsx-renderer`）を使用。
- 静的アセットは Wrangler `[assets]` で `public/` から配信（`ASSETS` バインディング）。
- Tailwind CSS v4 はローカルビルド（`src/style.css` → `public/tailwind.css`）。
- Lint/Format は Biome。ビルド生成物は `biome.json` で除外。
- README / アーキテクチャノートの一部が現行構成（ローカルCSS/ローカル画像）と不整合。

## 主要ファイル
- wrangler.toml: エントリ `main = "src/index.tsx"`、`[assets]`、`[build] command = "npm run build:css"`。
- src/index.tsx: Hono アプリ、`/`, `/images/*`, `/tailwind.css` など ASSETS 委譲。
- src/renderer.tsx: `<link rel="stylesheet" href="/tailwind.css" />`。
- src/style.css: `@import "tailwindcss";`。
- public/: `tailwind.css`, 画像、`favicon.ico`。
- package.json: `wrangler dev` / `deploy` 等のスクリプト、Biome スクリプト。

## よく使うコマンド
- 開発: `npm run dev`（Wrangler dev）
- ローカルプレビュー: `npm run preview`
- デプロイ: `npm run deploy`
- CSS ビルド: `npm run build:css`
- Lint: `npm run lint` / 自動修正: `npm run lint:fix` / フォーマット: `npm run format`

## ドキュメントの不整合（要修正）
- README.md の記述が「Tailwind CDN / GitHub Raw 画像」前提になっている箇所あり。現状はローカル配信。
- note/architecture.md も同様に CDN/外部画像前提の図解・説明が残存。
- 開発ポートの案内（README は `5173` を記載）が Wrangler dev の実ポート（例: `8787`）と不一致の可能性。

## 技術的メモ / 改善候補
- 依存整理: `unocss`, `@unocss/cli` は現状未使用の可能性が高い。削除検討。
- `vite-ssr-components` は使用実態の再確認（不要なら削除）。
- `package.json` に `engines` で Node バージョン明記検討（開発ツール用）。
- SEO 強化: OG/Twitter メタ、JSON-LD、`robots.txt`/`sitemap.xml` 追加検討。
- アクセシビリティ: 主要セクションの見出し構造の妥当性再確認、画像の代替テキスト最適化。

## 次アクション（提案）
1) README.md と note/architecture.md を現行構成へ更新。
2) 未使用依存（UnoCSS など）を削除し、スクリプトも整理。
3) SEO/アクセシビリティの基本メタを追加（タイトル/ディスクリプション/OG/Twitter）。
4) CI で Biome Lint/Format/Typecheck を実行するワークフローを追加（要 GitHub Actions）。
5) 変更が軽微なうちに `src/index.tsx` の文面・日付（経験の期間など）を棚卸し。

## 決定・ログ（随時追記）
- 2025-11-03: リポジトリ現状レビューとノート初版作成。
- 2025-11-03: 未使用依存 `unocss`, `@unocss/cli` を `package.json` から削除。
- 2025-11-03: 未使用 `vite-ssr-components`, `@tailwindcss/vite` を削除。`vite.config.ts` からプラグイン除去。
- 2025-11-03: `pnpm-lock.yaml` を削除（パッケージマネージャは npm を前提）。
