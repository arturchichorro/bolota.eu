# Tasks

## Before deployment

- [ ] Create and add a permanent 1200×630 social preview image.
- [ ] Add `og:image` and `twitter:image` metadata in `scripts/prerender.mjs`.
- [ ] Confirm the production host serves directory-style routes and custom 404 pages correctly.
- [ ] Configure redirects for `www`, HTTPS, and any changed historical URLs.
- [ ] Set immutable caching for hashed assets and Brotli compression.
- [ ] Run the final Lighthouse and accessibility checks against production.

## After deployment

- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- [ ] Validate BlogPosting structured data and social previews.
- [ ] Monitor indexing, Core Web Vitals, broken links, and remote media.

## Possible improvements

- [ ] Add explicit `dateModified` frontmatter support.
- [ ] Generate per-post social cards during the build.
- [ ] Add a frontmatter schema with clearer author-facing error messages.
