---
title: Hono + Cloudflare Workers で作るモダンなポートフォリオサイト
date: 2025-01-12
description: 次世代Webフレームワーク Hono と Cloudflare Workers を使ったポートフォリオサイト構築の全記録。
---

![Hono + Cloudflare Workers](/images/AdobeStock_264415324.jpeg)

# Hono + Cloudflare Workersで作るモダンなポートフォリオサイト

## はじめに

今回、次世代のWebフレームワーク「Hono」とCloudflare Workersを使用して、シンプルでモダンなポートフォリオサイトを構築しました。

**完成サイト**: https://portfolio-hono.hiro-genfuru0119.workers.dev
**GitHub**: https://github.com/genfuru011/Portfolio-hono

## なぜHono + Cloudflare Workersなのか？

### Honoの魅力

- **超高速**: エッジコンピューティングに最適化
- **軽量**: 最小限のバンドルサイズ
- **型安全**: TypeScript完全対応
- **シンプル**: Express.jsライクな直感的API

### Cloudflare Workersの利点

- **グローバル配信**: 世界中のエッジサーバーから配信
- **コスト効率**: 無料枠で十分な運用が可能
- **コールドスタート**: ほぼゼロの起動時間
- **セキュリティ**: 強固なセキュリティ機能

## 技術構成

```json
{
  "framework": "Hono 4.8.12",
  "styling": "Tailwind CSS (CDN)",
  "language": "TypeScript",
  "buildTool": "Vite",
  "deployment": "Cloudflare Workers",
  "imageHosting": "GitHub (raw URL)"
}
```

## 開発プロセス

### 1. プロジェクトセットアップ

まず、Honoプロジェクトの初期設定を行いました。

```bash
npm create hono@latest portfolio-hono
cd portfolio-hono
npm install
```

package.jsonの設定：

```json
{
  "name": "hono-learning",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "build": "wrangler deploy --dry-run",
    "preview": "wrangler dev --local",
    "deploy": "wrangler deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareBindings"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.11",
    "basecoat-css": "^0.3.1",
    "hono": "^4.8.12",
    "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.2.3",
    "vite": "^6.3.5",
    "wrangler": "^4.17.0"
  }
}
```

### 2. UI/UXデザインの実装

ミニマルでプロフェッショナルなデザインを心がけました。メインコンポーネントの構造：

```tsx
const App = () => {
  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <header class="text-center mb-16">
          <div class="mb-8">
            <img
              src="https://raw.githubusercontent.com/genfuru011/Portfolio-hono/main/public/images/profile.jpg"
              alt="Hiroto Furugen"
              class="w-40 h-40 rounded-full mx-auto mb-8 object-cover shadow-lg"
            />
          </div>
          <h1 class="text-5xl font-normal text-gray-900 mb-8">
            Hiroto Furugen
          </h1>
          {/* Social Media Icons */}
          <div class="flex justify-center space-x-6 mb-12">
            {/* アイコン群 */}
          </div>
        </header>
        
        <main class="max-w-3xl mx-auto">
          {/* Education & Experience Sections */}
        </main>
      </div>
    </div>
  );
};
```

### 3. Cloudflare Workers対応

Cloudflare Workers環境に最適化するため、vite.config.tsを設定：

```typescript
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [cloudflare(), tailwindcss()],
});
```

wrangler.tomlの設定：

```toml
name = "portfolio-hono"
main = "dist/index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[build]
command = "npm run build"

[vars]
NODE_ENV = "production"

[env.production]
name = "portfolio-hono"

[env.development]
name = "portfolio-hono-dev"
```

### 4. レンダラーの設定

HTMLレンダリングとスタイリングを統合：

```tsx
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hiroto Furugen - Portfolio</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body {
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
            min-height: 100vh;
            color: #1f2937;
            line-height: 1.6;
          }
          /* カスタムスタイル */
        `}</style>
      </head>
      <body class="min-h-screen py-8">{children}</body>
    </html>
  );
});
```

## 躓いたポイントと解決策

### CSS配信の問題

最初、vite-ssr-componentsを使用していましたが、Cloudflare Workers環境で正常に動作しませんでした。

**問題**:
```tsx
// 動作しなかった設定
import { ViteClient } from "vite-ssr-components/hono";
<link rel="stylesheet" href="src/style.css" />
```

**解決策**:
```tsx
// CDNとインラインスタイルで解決
<script src="https://cdn.tailwindcss.com"></script>
<style>{`/* カスタムCSS */`}</style>
```

### R2統合の課題

当初、プロフィール画像をCloudflare R2に保存する予定でしたが、バインディング設定で躓きました。

**試行したR2設定**:
```toml
[[r2_buckets]]
binding = "PORTFOLIO_ASSETS"
bucket_name = "portfolio-assets"
```

```typescript
type Bindings = {
  PORTFOLIO_ASSETS: R2Bucket;
};

app.get("/images/*", async (c) => {
  const object = await c.env.PORTFOLIO_ASSETS.get(key);
  // エラー: R2 bucket not configured
});
```

**最終解決策**:
GitHubのraw URLを使用することで、シンプルかつ安定した画像配信を実現：

```tsx
<img
  src="https://raw.githubusercontent.com/genfuru011/Portfolio-hono/main/public/images/profile.jpg"
  alt="Profile"
  class="w-40 h-40 rounded-full mx-auto mb-8 object-cover shadow-lg"
/>
```

## デプロイメント

デプロイは非常にシンプルです：

```bash
# 開発環境
npm run dev

# ビルド確認
npm run build

# 本番デプロイ
npm run deploy
```

デプロイ結果：
```
Total Upload: 116.57 KiB / gzip: 27.48 KiB
Worker Startup Time: 1 ms
Deployed: https://portfolio-hono.hiro-genfuru0119.workers.dev
```

## パフォーマンス結果

- **初回表示**: 200ms以下
- **バンドルサイズ**: 116KB (gzip: 27KB)
- **Worker起動時間**: 1ms
- **グローバル配信**: 世界中のエッジサーバーから高速配信

## プロジェクト構造

```
Portfolio-hono/
├── public/
│   └── images/
│       └── profile.jpg
├── src/
│   ├── index.tsx          # メインアプリケーション
│   └── renderer.tsx       # HTMLレンダラー
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml          # Cloudflare Workers設定
```

## 今後の改善点

1. **コンテンツ管理**: HeadlessCMSとの統合を検討
2. **SEO最適化**: メタタグとstructured dataの追加
3. **アナリティクス**: Cloudflare Analytics統合
4. **多言語対応**: 国際化機能の実装
5. **PWA対応**: Service Workerとマニフェストの追加

## 学んだこと

### Honoの印象

Honoは本当に軽量で高速なフレームワークです。Express.jsに慣れた開発者なら、学習コストはほとんどありません。特にCloudflare Workersとの親和性は抜群で、エッジコンピューティングの恩恵を最大限に受けられます。

### Cloudflare Workersの魅力

従来のサーバーレス環境と比べて、コールドスタートがほぼゼロなのは驚きです。グローバル配信も自動的に行われるため、世界中のユーザーに高速なサイトを提供できます。

### 開発体験

TypeScriptの型安全性とHonoのシンプルなAPIにより、開発効率は非常に高いです。また、Wranglerによるローカル開発環境も本番環境に近い状態でテストできるため、デプロイ時の不安がありません。

## まとめ

Hono + Cloudflare Workersの組み合わせは、モダンで高性能なWebアプリケーション構築に最適な選択肢です。特にポートフォリオサイトのような軽量なサイトには、そのメリットを十分に活かせます。

無料枠でも十分な性能を発揮するため、個人プロジェクトや小規模なWebサイトに最適です。興味のある方は、ぜひリポジトリをforkして、自分だけのポートフォリオサイトを作ってみてください。

**リポジトリ**: https://github.com/genfuru011/Portfolio-hono
**デモサイト**: https://portfolio-hono.hiro-genfuru0119.workers.dev

---

*この記事が参考になりましたら、GitHubでスターを付けていただけると嬉しいです！*