# Portfolio Website (FastAPI + Vue SPA)

本プロジェクトは FastAPI(Backend) と Vue 3 + Vite(Frontend, SPA) で構成されたポートフォリオサイトです。従来の Hono(Cloudflare Workers, SSR) 構成から移行済みです。

## Tech Stack

- Backend: FastAPI, Uvicorn
- Frontend: Vue 3, Vite, CSS Modules + PostCSS
- Language: Python 3.10+, JavaScript (ESM)

## Project Structure

```
Portfolio/
├── backend/
│   ├── app/main.py            # FastAPI エントリ（/health, /api/hello）
│   └── pyproject.toml         # 依存（uv 管理）
├── frontend/
│   ├── src/App.vue            # メインUI（SPA）
│   ├── src/components/HeroSection.vue
│   ├── src/components/EducationSection.vue
│   ├── src/components/ExperienceSection.vue
│   ├── vitest.config.ts       # フロントテスト設定
│   └── package.json
└── public/
    ├── favicon.ico
    └── images/
        ├── profile.jpg
        └── layerx.png
```

## Development

- Backend
  - 前提: Python 3.10+, uv
  - 起動: `cd backend && uv sync && uv run uvicorn app.main:app --reload --port 8000`
  - Docs: `http://127.0.0.1:8000/docs`
- Frontend
  - 前提: Node.js 18+
  - 起動: `cd frontend && npm i && npm run dev`
  - ブラウザ: `http://127.0.0.1:5173`
  - 開発中は `/api` が `http://127.0.0.1:8000` にプロキシされます

## Frontend Test

```
cd frontend
npm run test
```

## Deployment (Render / Docker)

Render の無料プランで簡単デプロイが可能です。`Dockerfile` と `render.yaml` を用意しています。

手順（初回）
- GitHubにプッシュ後、Renderダッシュボードで「New +」→「Blueprints」→ リポジトリを選択
- `render.yaml` を検出して作成・デプロイ
- 自動デプロイ: 有効（デフォルト）

概要
- Dockerマルチステージでフロント(Vue)をビルド→ `dist/` をFastAPIコンテナへ同梱
- ランタイムは `uvicorn backend.app.main:app --port $PORT`
- ヘルスチェック: `/health`

## Styling

- 各 `.vue` ファイルで `<style module>` によりローカルCSSを定義（PostCSS対応）
- グローバル最小限のベース（CSS変数/フォント等）は `frontend/src/App.vue` の `<style>` で管理

## Notes

- 画像などの静的ファイルはリポジトリ直下の `public/` を `frontend` 側の `publicDir` として参照しています。
- 詳細なロードマップやメモは `docs/開発ノート.md` を参照してください。
