# Backend (FastAPI)

このディレクトリはFastAPIベースのバックエンドです。依存管理と実行には `uv` を利用します。

## 前提

- Python 3.10+
- `uv` がインストール済み（未導入の場合は https://docs.astral.sh/uv/ を参照）

## セットアップ

```bash
cd backend
uv sync
```

## 開発サーバー起動

```bash
uv run uvicorn app.main:app --reload --port 8000
```

`http://127.0.0.1:8000/docs` でOpenAPI UIが確認できます。

## API 例

- `GET /health` => `{ "status": "ok" }`
- `GET /api/hello?name=Hiroto` => `{ "message": "Hello, Hiroto!" }`

## CORS

Vite(フロント)のデフォルトポート `5173` を許可しています。必要に応じて `app/main.py` の `origins` を調整してください。

