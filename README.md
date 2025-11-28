# Portfolio Website

A clean and modern portfolio website built with [Hono](https://hono.dev/) and Tailwind CSS, featuring a card-based blog layout inspired by [devas.life](https://www.devas.life/).

## Live Demo

Deployed URL is issued by Cloudflare Workers when you run `wrangler deploy`.
Example: `https://portfolio-hono.<your-account>.workers.dev`

## Features

- Clean, minimalist design with card-based blog layout
- Fully responsive design
- Markdown-based blog system with automatic thumbnail extraction
- Syntax highlighting for code blocks (highlight.js)
- Built with Hono for fast performance
- Deployed on Cloudflare Workers
- TypeScript support
- Tailwind CSS v4 built locally and served via Workers assets

## Site Structure

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Card-based blog post list with thumbnails |
| `/about` | About | Profile, education, and experience |
| `/blog` | Blog List | Traditional list view of posts |
| `/blog/:slug` | Post Detail | Individual blog post with syntax highlighting |

## Tech Stack

- **Framework**: Hono (Web framework for Cloudflare Workers)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Cloudflare Workers
- **Syntax Highlighting**: highlight.js (github-dark theme)
- **Lint/Format**: Biome

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Portfolio-hono
```

2. Install dependencies:
```bash
npm install
```

3. Build posts and CSS:
```bash
npm run build:posts
npm run build:css
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:8787`

## Development

### Available Scripts

- `npm run dev` - Start development server with Wrangler
- `npm run build:posts` - Generate posts.ts from Markdown files
- `npm run build:css` - Build Tailwind CSS
- `npm run build` - Full build (posts + css + dry-run)
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run lint` - Run Biome lint
- `npm run format` - Format code with Biome

### Project Structure

```
Portfolio/
├── content/
│   └── posts/           # Markdown blog posts
│       ├── dev-notes.md
│       └── hello-world.md
├── public/
│   ├── images/          # Static images (thumbnails, etc.)
│   └── tailwind.css     # Built CSS (generated)
├── scripts/
│   └── build-posts.ts   # Markdown → TypeScript converter
├── src/
│   ├── blog/
│   │   └── posts.ts     # Auto-generated post data
│   ├── components/
│   │   ├── Home.tsx     # Home page (card layout)
│   │   ├── App.tsx      # About page
│   │   ├── BlogList.tsx # Blog list page
│   │   └── BlogPost.tsx # Blog post detail
│   ├── index.tsx        # Hono app and routes
│   └── renderer.tsx     # HTML shell (CDN scripts)
├── biome.json           # Lint/Format config
├── wrangler.toml        # Cloudflare Workers config
└── package.json
```

## Blog System

### Adding a New Post

1. Create a Markdown file in `content/posts/`:

```markdown
---
title: Post Title
date: 2025-01-01
description: Brief description of the post
---

![Thumbnail](/images/example.jpg)

## Post Content

Your content here...
```

2. The first image in the content is automatically used as the thumbnail
3. Run `npm run build:posts` to regenerate `posts.ts`

### Syntax Highlighting

Code blocks are automatically highlighted using highlight.js with the github-dark theme. Supported languages include JavaScript, TypeScript, Python, and many more.

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

Requirements:
1. A Cloudflare account
2. Wrangler CLI configured (`wrangler login`)

## Customization

### Profile Information

Edit `src/components/App.tsx` to update:
- Name and title
- Education and experience
- Social media links

### Styling

- Modify Tailwind classes in JSX components
- Add custom styles in `src/style.css`
- Run `npm run build:css` after changes

### Images

Place images in `public/images/` and reference them with `/images/filename.jpg`.

## License

This project is open source and available under the [MIT License](LICENSE).
