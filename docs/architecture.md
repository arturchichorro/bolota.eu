# Architecture

## Overview

The site is a static-first Vite and React application. MDX is compiled during development and at build time; there is no content database, runtime CMS, application server, or client-side router.

## Content flow

1. `vite.config.ts` scans `content/posts/*.mdx`, validates its YAML frontmatter with the shared Zod schema, and exposes a lightweight post index.
2. Vite compiles each MDX body into its own JavaScript chunk.
3. The post index extracts Markdown headings at build time and supplies the article's static table of contents.
4. `src/posts.ts` supplies sorted published metadata and lazy post loaders.
5. Vite creates the client and server bundles.
6. `scripts/prerender.mjs` renders every route into `dist`, then generates the sitemap, RSS feed, and robots file.

The homepage receives only metadata, not every post body. The React bundle is retained only for posts marked `interactive: true`. Other article pages receive a tiny standalone script for table-of-contents section highlighting, while index pages remain JavaScript-free.

## Important locations

- `content/posts` — source MDX posts
- `src/App.tsx` — site shell, homepage, and post layout
- `src/components/mdx-components.tsx` — MDX compatibility surface
- `src/content.ts` — build-time post parsing, validation, metadata computation, and Vite plugins
- `src/posts.ts` — client/server post loading and published-post access
- `src/tailwind.css` — Tailwind entry point, Typography plugin, content sources, and theme tokens
- `@fontsource-variable/inter` — build-time source for the self-hosted Inter variable font
- `scripts/prerender.mjs` — static output and SEO artifacts
- `dist` — generated deployment output

## Build properties

- Every published route has complete static HTML.
- Post bodies are split by route.
- The homepage has no production JavaScript.
- Static article pages use a small inline, animation-frame-throttled script for table-of-contents section highlighting instead of loading and hydrating React.
- Images embedded as JSX receive lazy-loading attributes during MDX compilation.
- Drafts are excluded from routes and discovery files.
- Invalid or unknown frontmatter fields fail the build, and `interactive: true` is the single source of truth for post hydration.
- Tailwind scans the React and MDX sources at build time and emits only the utilities the site uses.
- Inter is bundled with the static assets, so rendering does not depend on Google Fonts or another third-party font server.
