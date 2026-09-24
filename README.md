# achichorro.com

A small, static-first personal site and blog built with Vite, React, MDX and Tailwind CSS. It is the successor to bolota.eu.

## See the app locally

Install the dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open the local URL shown in the terminal—normally [http://localhost:5173](http://localhost:5173). Changes to the source files and MDX posts appear automatically while the server is running.

To inspect the production build locally instead:

```bash
pnpm build
pnpm preview
```

## Commands

- `pnpm dev` — local development
- `pnpm check` — TypeScript checks
- `pnpm build` — build and prerender every page, plus RSS, sitemap and robots.txt
- `pnpm preview` — preview the production build

## Writing

Yes: add an `.mdx` file to `content/posts` and it is discovered automatically. The filename becomes the post URL: `content/posts/my-post.mdx` → `/posts/my-post`. See [the authoring guide](docs/authoring.md) for the required frontmatter and examples.

## Architecture

See [Architecture](docs/architecture.md) and [Decisions](docs/decisions.md).

## SEO

See the [SEO plan](docs/SEO.md). Project follow-ups live in [Tasks](docs/tasks.md).
