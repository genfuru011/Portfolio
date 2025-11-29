---
title: Cloudflare Workers での CSS 配信問題と解決策
date: 2025-01-07
description: Cloudflare Workers 環境で静的ファイル（CSS）を配信する際に遭遇した問題と、その解決方法を詳しく解説します。
---

![CSS配信問題](/images/IMG_3275.jpeg)

# Cloudflare WorkersでのCSS配信問題：詳細解説

## 問題の概要

Cloudflare Workersにデプロイする際、従来のWebサーバーとは異なり、静的ファイル（CSS、JS、画像など）の配信方法に制限があります。この記事では、実際に遭遇したCSS配信の問題と解決策について詳しく解説します。

## 従来のWebサーバーとの違い

### 一般的なWebサーバー（Express.js、Next.js等）
```
project/
├── public/
│   ├── styles.css
│   └── images/
├── src/
│   └── index.js
└── package.json
```

一般的なWebサーバーでは、`public`フォルダ内のファイルは自動的に静的ファイルとして配信されます：

```javascript
// Express.jsの例
app.use(express.static('public'));
// http://localhost:3000/styles.css でアクセス可能
```

### Cloudflare Workersの制約

Cloudflare Workersは**エッジコンピューティング環境**で動作するため：

1. **ファイルシステムへのアクセス不可**
2. **静的ファイルの自動配信なし**
3. **すべてのリクエストがWorkerコードを通る**

## 実際に遭遇した問題

### 初期設定（動作しなかった例）

最初は`vite-ssr-components`を使用してCSS配信を試みました：

```tsx
// renderer.tsx
import { jsxRenderer } from "hono/jsx-renderer";
import { ViteClient } from "vite-ssr-components/hono";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <link rel="stylesheet" href="src/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
});
```

**問題点**:
- `ViteClient`がCloudflare Workers環境で正常に動作しない
- `src/style.css`へのリンクが404エラーを返す
- 静的ファイルが配信されない

### デプロイ時の状況

```bash
npm run deploy
```

デプロイ後、ブラウザの開発者ツールで確認すると：

```
GET https://portfolio-hono.workers.dev/src/style.css
Status: 404 Not Found
```

**なぜ404になるのか？**

Cloudflare Workersでは：
1. `src/style.css`ファイルはWorkerのバンドルに含まれない
2. 静的ファイルを配信するルートが設定されていない
3. Honoアプリケーションが該当パスのハンドラーを持たない

## 解決策の検討

### 1. Cloudflare Workers Static Assets（試行）

```toml
# wrangler.toml
[assets]
directory = "./public"
binding = "ASSETS"
```

```typescript
// Honoでの静的ファイル配信
app.get("/assets/*", async (c) => {
  const url = new URL(c.req.url);
  const assetPath = url.pathname.replace("/assets/", "");
  
  // ASSETS binding を使用してファイルを取得
  const asset = await c.env.ASSETS.fetch(c.req.url);
  return asset;
});
```

**問題**: 設定が複雑で、CSS配信のためだけには過度な設定

### 2. R2 Object Storage（試行）

```typescript
// R2を使用したCSS配信
app.get("/styles/*", async (c) => {
  const key = c.req.param("*");
  const object = await c.env.R2_BUCKET.get(key);
  
  if (!object) {
    return c.notFound();
  }
  
  return new Response(object.body, {
    headers: {
      "Content-Type": "text/css",
    },
  });
});
```

**問題**: 
- R2バインディングの設定エラー
- CSS配信のためにオブジェクトストレージを使うのは過度

### 3. Wrangler `[assets]` + ローカルビルド（採用した解決策）

最終的に採用した解決策は、Tailwind CSS v4 をローカルでビルドし、Wrangler の `[assets]` 機能で配信する方法です：

```toml
# wrangler.toml
[assets]
directory = "./public"
binding = "ASSETS"
```

```bash
# Tailwind CSS をローカルビルド
tailwindcss -i ./src/style.css -o ./public/tailwind.css --minify
```

```tsx
// renderer.tsx
export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hiroto Furugen - Portfolio</title>
        {/* ローカルビルドしたTailwind CSSを読み込み */}
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
      <body class="min-h-screen py-8">{children}</body>
    </html>
  );
});
```

```typescript
// index.tsx - 静的アセットのルーティング
app.get('/tailwind.css', (c) => c.env.ASSETS.fetch(c.req.raw))
app.get('/images/*', (c) => c.env.ASSETS.fetch(c.req.raw))
```

## なぜこの解決策が最適なのか？

### 1. **確実性**
- 外部CDNに依存しない
- ビルド時にCSSが生成されるため、必ず配信される

### 2. **パフォーマンス**
- 未使用CSSが削除される（Tree-shaking）
- Cloudflareエッジから高速配信

### 3. **シンプルさ**
- Wrangler標準機能で実現
- 追加のサービス（R2等）不要

### 4. **保守性**
- ビルドプロセスが明確
- オフライン環境でも開発可能

## パフォーマンスへの影響

### Before（CSS配信なし）
```
- 初回表示: スタイルなし（FOUC発生）
- ファイルサイズ: 110KB
- リクエスト数: 1
```

### After（ローカルビルド + ASSETS配信）
```
- 初回表示: 200ms以下（スタイル適用済み）
- CSSファイル: 最適化済み（未使用CSS削除）
- リクエスト数: 2（HTML + CSS、並列取得）
```

CDN依存を排除しつつ、高速なスタイル配信を実現しました。

## 他の解決策との比較

| 方法 | 設定複雑度 | パフォーマンス | 確実性 | 保守性 |
|------|------------|----------------|--------|--------|
| R2 Object Storage | 高 | 良い | 中 | 低 |
| CDN + インライン化 | 低 | 良い | 中 | 中 |
| 外部CSS（CDN） | 低 | 中 | 低 | 中 |
| **Wrangler [assets]** | **低** | **優秀** | **高** | **高** |

## 学んだこと

### Cloudflare Workersの特徴を理解する

1. **エッジコンピューティング環境**: 従来のサーバーとは異なる制約
2. **ファイルシステムなし**: 静的ファイルの概念が異なる
3. **すべてがコード**: リクエスト処理はすべてJavaScriptコードで制御

### 解決策の選択基準

1. **要件に対する適切性**: 過度に複雑な解決策は避ける
2. **保守性**: 長期的に維持しやすい方法を選ぶ
3. **パフォーマンス**: ユーザー体験を最優先に考える

## まとめ

Cloudflare WorkersでのCSS配信問題は、プラットフォームの特性を理解することで適切に解決できます。今回の経験から、**シンプルで確実な解決策（インライン化）** が最も実用的であることが分かりました。

エッジコンピューティング環境では、従来のWebサーバーの常識を一度忘れ、プラットフォーム固有の制約と利点を理解することが重要です。

---

**関連資料**:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [プロジェクトリポジトリ](https://github.com/genfuru011/Portfolio-hono)