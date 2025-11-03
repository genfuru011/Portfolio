from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pathlib import Path


app = FastAPI(title="Portfolio API", version="0.1.0")

# 許可するオリジン（Viteのデフォルトポート）
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/hello")
def hello(name: str = "World") -> dict:
    return {"message": f"Hello, {name}!"}


# ---- SPA static distribution (for Render/Docker) ----
# ビルド済みフロントエンド(dist)を同コンテナから配信
DIST_DIR = Path(__file__).resolve().parents[2] / "dist"

if DIST_DIR.exists():
    # /assets や /images を個別にマウント
    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    images_dir = DIST_DIR / "images"
    if images_dir.exists():
        app.mount("/images", StaticFiles(directory=str(images_dir)), name="images")

    index_html = DIST_DIR / "index.html"

    @app.get("/favicon.ico", include_in_schema=False)
    def favicon() -> FileResponse | dict:
        fav = DIST_DIR / "favicon.ico"
        if fav.exists():
            return FileResponse(str(fav))
        raise HTTPException(status_code=404, detail="Not Found")

    @app.get("/", include_in_schema=False)
    def spa_root() -> HTMLResponse:
        if index_html.exists():
            return HTMLResponse(index_html.read_text(encoding="utf-8"))
        raise HTTPException(status_code=404, detail="Not Found")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_fallback(full_path: str) -> HTMLResponse:
        # API/health等は既に上でマッチする想定。その他はSPAにフォールバック
        if index_html.exists():
            return HTMLResponse(index_html.read_text(encoding="utf-8"))
        raise HTTPException(status_code=404, detail="Not Found")
