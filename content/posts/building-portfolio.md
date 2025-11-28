---
title: ポートフォリオサイトを作った話
date: 2025-01-10
description: Cloudflare Workers + Hono でポートフォリオサイトを構築しました。技術選定の理由から実装のポイントまで解説します。
---

![ポートフォリオサイト](/images/IMG_3142.jpeg)

## なぜ作ったのか

エンジニアとして活動していく上で、自分の経歴やスキルをまとめた場所が欲しいと思っていました。

既存のサービス（Wantedly、LinkedIn など）も便利ですが、**自分でゼロから作る**ことで：

- 技術力をアピールできる
- 自由にカスタマイズできる
- 新しい技術を試す実験場になる

という利点があります。せっかくなら、作る過程も楽しみたいですよね。

## 技術選定

### アーキテクチャ概要

```
┌─────────────────────────────────────────┐
│           Cloudflare Edge               │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │      Hono Application           │    │
│  │   (SSR with JSX Renderer)       │    │
│  └─────────────────────────────────┘    │
│                  │                       │
│  ┌───────────────┴───────────────┐      │
│  │         Static Assets         │      │
│  │    (CSS, Images, Favicon)     │      │
│  └───────────────────────────────┘      │
└─────────────────────────────────────────┘
```

### Cloudflare Workers を選んだ理由

| 特徴 | 説明 |
|------|------|
| **無料枠が充実** | 1日10万リクエストまで無料 |
| **エッジコンピューティング** | ユーザーに近い場所で実行 |
| **コールドスタートなし** | ほぼゼロの起動時間 |
| **簡単デプロイ** | `wrangler deploy` 一発 |

従来のサーバーレス（AWS Lambda など）と比べて、コールドスタートがほぼないのは大きなメリットです。

### Hono を選んだ理由

> Honoは「炎」を意味する日本語で、日本発のWebフレームワークです。

```typescript
// シンプルなAPI
app.get('/api/posts', (c) => {
  return c.json({ posts: getAllPosts() })
})

// JSXでUIを描画
app.get('/', (c) => {
  return c.render(<App />)
})
```

**選定理由：**

1. **TypeScript完全対応** - 型安全な開発ができる
2. **JSXサポート** - Reactライクな書き方でUIを構築
3. **超軽量** - バンドルサイズが小さい
4. **Cloudflare最適化** - Workers向けに設計されている

## 実装のポイント

### 静的アセットの配信

Cloudflare Workersでは、`wrangler.toml` の `[assets]` 設定で静的ファイルを配信できます。

```toml
[assets]
directory = "./public"
binding = "ASSETS"
```

```typescript
// Honoで静的アセットをルーティング
app.get('/images/*', (c) => c.env.ASSETS.fetch(c.req.raw))
app.get('/tailwind.css', (c) => c.env.ASSETS.fetch(c.req.raw))
```

### CSSの配信

最初はTailwind CDNを使っていましたが、本番では**ローカルビルド**に切り替えました。

```bash
# ビルドコマンド
tailwindcss -i ./src/style.css -o ./public/tailwind.css --minify
```

理由：
- CDN依存を減らせる
- 未使用CSSを削除できる（ファイルサイズ削減）
- オフライン環境でも開発できる

### JSXレンダラー

HonoのJSXレンダラーを使って、サーバーサイドでHTMLを生成しています。

```tsx
// renderer.tsx
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <title>Portfolio</title>
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

クライアントサイドのJavaScriptは最小限に抑え、ほとんどの処理をサーバー側で行っています。

## 躓いたポイント

### 1. CSS配信の問題

Workers環境では、従来のWebサーバーのように `public/` フォルダを自動配信しません。明示的にルーティングを設定する必要がありました。

### 2. 環境変数の扱い

ローカル開発と本番で環境変数の取得方法が微妙に異なり、最初は戸惑いました。`wrangler.toml` の `[vars]` セクションで統一的に管理するのがおすすめです。

### 3. 画像の最適化

現状は単純に画像を配信していますが、将来的にはCloudflare Imagesを使った最適化も検討しています。

## パフォーマンス

デプロイ後の結果：

- **バンドルサイズ**: 約230KB（gzip: 56KB）
- **Worker起動時間**: 1ms
- **初回表示**: 200ms以下（東京リージョン）

Lighthouseスコアもほぼ満点に近い数値が出ています。

## 今後の展望

- [ ] ブログ機能の拡充（タグ、検索）
- [ ] ダークモード対応
- [ ] RSS/Atomフィード
- [ ] OGP画像の動的生成
- [ ] アクセス解析（Cloudflare Analytics）

---

ポートフォリオサイトを作るのは、技術の勉強にもなりますし、何より楽しいです。興味のある方は、ぜひ自分だけのサイトを作ってみてください。
