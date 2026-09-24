# SEO launch plan

The technical baseline is built into `pnpm build`: every public post is real static HTML with a unique title and description, canonical URL, article schema, Open Graph/Twitter metadata, RSS entry, and sitemap entry. Draft posts are excluded.

## Before launch

1. Keep the current post URLs or add permanent redirects from every old URL. The current `/posts/<filename>` structure is intentionally preserved.
2. Create a 1200×630 branded social image (or one image per post), export it as PNG/WebP, and add `og:image` and `twitter:image` in `scripts/prerender.mjs`.
3. Deploy behind a CDN with Brotli compression, immutable caching for `/assets/*`, and short revalidation for HTML.
4. Verify the production domain and HTTPS canonical behavior, including redirects from `www` and trailing-slash variants.

## On launch day

1. Submit `https://achichorro.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
2. Validate a representative post with Google Rich Results Test, Schema.org Validator, and the social-card debuggers used by LinkedIn/Facebook.
3. Run Lighthouse on the homepage, a text-only post, and the Sudoku post. Targets: Performance ≥95, SEO ≥100, Accessibility ≥95, and Core Web Vitals in the green.

## Ongoing

- Write a unique, useful description for every post and use one descriptive H1 followed by a logical heading hierarchy.
- Add descriptive alt text to every new image and explicit dimensions when known to prevent layout shift.
- Link related posts through the existing `saga` frontmatter and contextual links.
- Watch indexing, queries, 404s, and Core Web Vitals monthly. Fix broken external media and links during the same review.
- Update `dateModified` separately from `datePublished` if older posts receive substantial changes.

Analytics is intentionally absent from the initial bundle. If measurement is needed, prefer server/CDN logs or a tiny privacy-focused script loaded after the page becomes interactive.
