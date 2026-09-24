# Technical decisions

## Vite and React

Vite replaces Next.js because the blog does not need a server framework. React remains for MDX compatibility and the interactive posts.

## Build-time MDX instead of Velite

A small Vite plugin parses frontmatter and the official MDX compiler handles content. This removes the generated content layer while keeping existing files compatible.

## Custom prerenderer instead of a framework

The site has one index and a small set of post routes, so a short Node script is enough to produce static HTML and SEO files. This avoids adding a router or another site-generation framework.

## Tailwind CSS

The interface uses stable Tailwind CSS v4 through its official Vite plugin. Component and layout styling lives beside the React markup as utility classes. `src/tailwind.css` contains only the Tailwind import, official Typography plugin, MDX source declaration, and shared theme tokens. The historical MDX already contains many Tailwind utilities, so moving back to Tailwind removes the handwritten compatibility stylesheet and makes new utility classes work naturally.

## Dark-only theme

A neutral charcoal is the permanent background and green remains the accent. Removing a theme switch reduces interface and runtime complexity.

## Inter typography

The site uses the same Inter variable font as the previous application for interface text, article titles, and MDX headings. The font is self-hosted through a build-only Fontsource package so visitors do not make a request to Google Fonts.

## Progressive enhancement

Reading never requires JavaScript. Only posts with interactive demonstrations hydrate in the browser. This keeps the common path fast while preserving the old content.

## pnpm

pnpm is the repository package manager. `packageManager` pins the expected major/minor version and `pnpm-lock.yaml` is the only dependency lockfile.
