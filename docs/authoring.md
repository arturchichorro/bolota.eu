# Writing posts

## Create a post

Create a top-level `.mdx` file in `content/posts`. No registry or route file needs editing. During development Vite picks it up; `pnpm build` creates the production HTML page and adds it to the homepage, sitemap, and RSS feed.

The filename is the URL slug:

```text
content/posts/my-new-post.mdx → /posts/my-new-post
```

Use lowercase, URL-safe filenames. Nested folders are not currently discovered.

## Frontmatter

Every post should begin with:

```mdx
---
title: My new post
description: A concise summary for the homepage and search results.
date: 2026-08-12
published: true
interactive: false
icon: react
---

Start writing here.
```

- `title` is required.
- `description` is strongly recommended for SEO and the post list.
- `date` is required and should use `YYYY-MM-DD`.
- `published: false` keeps a post out of the site, sitemap, and RSS feed. Omit it or use `true` to publish it.
- `interactive: true` retains and hydrates the React application on that post. Omit it for static posts so they ship without the application bundle.
- `icon` chooses the icon displayed beside the post on the blog index.
- `saga` is optional and creates links between related posts.

Frontmatter is validated during development and production builds. Unknown fields, invalid dates, and values of the wrong type fail the build with the post name and field that needs correction.

Example series metadata:

```yaml
saga:
  - title: Part 1
    url: first-post
  - title: Part 2
    url: second-post
```

## Supported content

Regular Markdown, inline HTML/JSX, fenced code blocks, KaTeX math, and Tailwind utility classes are supported. Tailwind scans `content/posts`, so utilities written directly in an MDX `className` are included in the production stylesheet.

Headings from `##` through `######` automatically receive anchor links and appear after “Start” in the desktop “On this page” navigation. No frontmatter or component registration is needed. The post title is already the page's `#`/H1, so prefer `##` for major sections, `###` for subsections, and progressively deeper levels below those. Existing posts that begin their sections at `###` remain fully supported.

`src/components/mdx-components.tsx` globally maps only Markdown-generated elements: links, images, videos, and headings. Specialized named components are deliberately not registered globally. Import each one only in the article that uses it:

- `Callout` from `src/components/callout.tsx`
- `ThreeMedias` from `src/components/three-medias.tsx`
- `ConnectFour` from `src/components/connect-four/connect-four.tsx`
- Sudoku components from `src/components/sudoku/`
- `ProjectItem` from `src/components/project-item.tsx`

New custom React components do not need to be added to `mdxComponents`. Import them directly in the relevant post so their code stays out of other post bundles. For example:

```mdx
import { MyDiagram } from "../../src/components/my-diagram"

<MyDiagram />
```

`StaticBlogFlowDiagram` in `src/components/static-flow-diagram.tsx` is the blog's diagram renderer. Only `id` and `title` are required, so `{ id: "source", title: "Source" }` produces a simple title-only node. Add `image`, `eyebrow`, `detail`, or `content` only when a node needs more information. Optional `position`, `tone`, `align`, `dashed`, `className`, and `shape` fields control its placement and appearance. Available shapes are `card`, `pill`, and `database`; tones include `green`, `orange`, `amber`, `blue`, `rose`, `violet`, `neutral`, and `light`.

A node can provide `render`, `width`, and `height` for completely custom React markup and geometry. These sizes are authored in code rather than changed by the reader. Nodes without positions receive a simple horizontal or vertical linear layout; branching diagrams should provide explicit positions.

Rendered diagrams are intentionally static SVG: there is no dragging, selecting, panning, zooming, hook, or browser measurement. React renders the complete `<svg>` during prerendering, and its `viewBox` handles proportional sizing.

Wide diagrams stop shrinking at a readable canvas width (up to `1000px`). On a narrower screen, the surrounding figure becomes horizontally scrollable instead. The figure is keyboard-focusable as well, so it can be scrolled horizontally without a pointer.

The SVG bounds are calculated from the nodes' positions, widths, and heights, plus a small safety margin. This makes its rendered height follow the available article width and avoids a large fixed-height empty area.

Diagrams do not have to be linear. Give nodes arbitrary `{ x, y }` positions and use an edge's optional `fromSide` and `toSide` fields to connect from `top`, `right`, `bottom`, or `left`. `bidirectional: true` puts an arrow at both ends.

For an article-specific diagram, import the renderer and define its data in that MDX file:

```mdx
import { StaticBlogFlowDiagram } from "../../src/components/static-flow-diagram"

export const nodes = [
  { id: "source", title: "Source", position: { x: 0, y: 0 } },
  { id: "store", title: "Store", shape: "database", position: { x: 260, y: 120 } },
]

export const edges = [
  { from: "source", to: "store" },
]

<StaticBlogFlowDiagram label="Data flow" nodes={nodes} edges={edges} />
```

## Preview and publish

```bash
pnpm dev
pnpm check
pnpm build
pnpm preview
```

The production host should publish the generated `dist` directory.
