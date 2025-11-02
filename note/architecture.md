# ポートフォリオサイト アーキテクチャ概要

このドキュメントは、HonoとCloudflare Workersを基盤としたポートフォリオサイトのアーキテクチャについて説明します。

## 1. アーキテクチャ図

```mermaid
graph TD
    subgraph "User Client"
        A[User's Browser]
    end

    subgraph "Cloudflare Network"
        B[Cloudflare Edge] --> C{Hono Application on Worker}
        H[Static Assets (Wrangler [assets])]:::assets
    end

    subgraph "Application Logic (on Worker)"
        C --> D[Renderer Middleware]
        C --> E[App Component (JSX)]
    end

    A -- "1. HTTPS Request" --> B
    D -- "2. Renders HTML Shell" --> C
    E -- "3. Renders Page Content" --> C
    C -- "4. Returns HTML Response" --> A
    A -- "5. Fetches /tailwind.css" --> H
    A -- "6. Fetches /images/*" --> H

    classDef assets fill:#eef,stroke:#66f,stroke-width:1px
```

## 2. 主要コンポーネント

このプロジェクトは、シンプルさ、パフォーマンス、保守性を重視したコンポーネントで構成されています。

### フレームワーク: Hono
- **役割**: リクエストのルーティングとレスポンスの生成を担当するWebフレームワーク。
- **採用理由**: 超高速かつ軽量で、Cloudflare Workersのようなエッジコンピューティング環境に最適化されています。Express.jsに似たAPIは学習コストが低く、開発効率を高めます。

### 実行環境: Cloudflare Workers
- **役割**: アプリケーションコードを実行するサーバーレスプラットフォーム。
- **採用理由**: 世界中のエッジロケーションでコードを実行するため、ユーザーに最も近い場所からコンテンツを配信でき、非常に低遅延です。コールドスタートがほぼゼロである点も大きな利点です。

### ビルドツール: Vite
- **役割**: TypeScriptとJSXで書かれたソースコードを、Cloudflare Workersで実行可能な単一のJavaScriptファイルにバンドルします。
- **採用理由**: `@cloudflare/vite-plugin` を利用することで、Cloudflare Workersへのデプロイプロセスを簡素化できます。高速なビルドとHMR（ホットリロード）により、快適な開発体験を提供します。

### スタイリング: Tailwind CSS（ローカルビルド）
- **役割**: サイトの見た目を定義します。
- **採用理由**: Tailwind v4 を `@tailwindcss/cli` でローカルビルドし、生成された `public/tailwind.css` を Wrangler `[assets]` 経由で配信します。CDN 依存やインライン CSS は不要で、再現性とパフォーマンスを両立します。

### アセット管理: Wrangler `[assets]`
- **役割**: `public/` 配下の静的アセット（画像、`tailwind.css` など）を配信します。
- **採用理由**: Worker から `c.env.ASSETS.fetch(c.req.raw)` で委譲することで、構成をシンプルに保ちながら高性能な静的配信を実現します。

## 3. リクエストのライフサイクル

ユーザーがサイトにアクセスしてからページが表示されるまでの流れは以下の通りです。

1.  **リクエスト**: ユーザーのブラウザがポートフォリオサイトのURLにHTTPSリクエストを送信します。
2.  **エッジでの実行**: リクエストは最も近いCloudflareのエッジサーバーに到達し、デプロイされたHonoアプリケーション（Worker）を起動します。
3.  **ミドルウェア処理**: Hono の `renderer` ミドルウェアが実行され、HTML の基本構造（`<html>`, `<head>`, `<body>`）、およびローカル CSS（`/tailwind.css`）の `<link>` を含む骨格を準備します。
4.  **コンテンツレンダリング**: ルートハンドラ（`/`）が `App` コンポーネント（JSX）をSSRし、コンテンツ（プロフィール、経歴など）を生成します。
5.  **レスポンス**: レンダリング結果を含む HTML を返却します。
6.  **ブラウザでの処理**: ブラウザは受け取ったHTMLを解釈し、`/tailwind.css` と `/images/*` を ASSETS（`public/`）から取得してページを完成させます。
