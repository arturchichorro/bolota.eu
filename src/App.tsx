import type { ComponentType } from "react";
import { mdxComponents } from "./components/mdx-components";
import { PostIcon } from "./components/post-icon";
import { TocScrollSpy } from "./components/toc-scroll-spy";
import { postFromPath, posts, type PostMeta } from "./posts";

const SITE = "https://achichorro.com";

function Header() {
  return (
    <header className="flex h-21 items-center justify-between border-b border-border">
      <a className="flex items-center gap-2 text-base font-bold tracking-tight no-underline" href="/" aria-label="achichorro.com home">
        <span className="text-xs text-accent drop-shadow-[0_0_7px_rgba(110,231,162,.45)]" aria-hidden="true">●</span>
        achichorro.com
      </a>
      <nav className="flex gap-6 font-mono text-xs font-medium uppercase tracking-[.12em] text-muted" aria-label="Main navigation">
        <a className="no-underline hover:text-accent" href="/">blog</a>
        <a className="no-underline hover:text-accent" href="/rss.xml">rss</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex justify-between border-t border-border py-8 font-mono text-xs text-faint max-sm:flex-col max-sm:gap-4">
      <span>© {new Date().getFullYear()} Artur Chichorro</span>
      <span>
        <a className="no-underline hover:text-accent" href="https://github.com/arturchichorro">GitHub</a>
        {" · "}
        <a className="no-underline hover:text-accent" href="https://x.com/achichorroc">X</a>
      </span>
    </footer>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function formatArchiveDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function tocIndent(depth: number) {
  if (depth >= 6) return "pl-8";
  if (depth === 5) return "pl-6";
  if (depth === 4) return "pl-4";
  if (depth === 3) return "pl-2";
  return "";
}

function Home() {
  const postsByYear = posts.reduce<Record<string, PostMeta[]>>((groups, post) => {
    const year = post.date.slice(0, 4);
    (groups[year] ??= []).push(post);
    return groups;
  }, {});

  return (
    <main id="main" className="w-full flex-1 py-2">
      <section aria-label="Articles">
        {Object.entries(postsByYear).sort(([a], [b]) => b.localeCompare(a)).map(([year, yearPosts]) => (
          <div className="mb-2" key={year}>
            <h1 className="m-0 pt-4 pb-2 text-xl font-black text-foreground">{year}</h1>
            <ol className="m-0 list-none p-0">
              {yearPosts?.map((post) => (
                <li key={post.slug}>
                  <article className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-border py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <PostIcon name={post.icon} />
                      <h2 className="m-0 min-w-0 text-base font-normal tracking-widest sm:text-lg">
                        <a className="text-accent underline decoration-2 decoration-accent/50 underline-offset-4 hover:bg-accent hover:text-background hover:no-underline" href={`/posts/${post.slug}/`}>
                          {post.title}
                        </a>
                      </h2>
                    </div>
                    <time className="hidden self-center pl-4 text-right text-sm text-foreground sm:block" dateTime={post.date}>
                      {formatArchiveDate(post.date)}
                    </time>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </main>
  );
}

function Post({ meta, Content }: { meta: PostMeta; Content: ComponentType<any> }) {
  return (
    <main id="main" className="flex-1">
      <TocScrollSpy />
      <div className="w-full xl:grid xl:grid-cols-[minmax(0,45rem)_10rem] xl:gap-8">
        <article id="article-start" data-article className="mx-auto w-full max-w-180 min-w-0 scroll-mt-8 py-10 max-sm:py-8 xl:mx-0">
          <header>
            <h1 className="m-0 text-[clamp(2rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-.035em] text-accent">{meta.title}</h1>
            <p className="mt-4 mb-0 text-lg text-muted">Posted on <time dateTime={meta.date}>{formatDate(meta.date)}</time></p>
          </header>
          {meta.saga?.length ? (
            <nav className="flex flex-wrap gap-2 border-b border-border py-4" aria-label="Related series">
              {meta.saga.map((item) => (
                <a className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted no-underline hover:border-accent hover:text-accent" href={`/posts/${item.url.replace(/^\/?posts\//, "").replace(/\/$/, "")}/`} key={item.url}>{item.title}</a>
              ))}
            </nav>
          ) : null}
          <div className="prose prose-invert max-w-none pt-8 prose-headings:scroll-mt-8 prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-accent-soft prose-a:decoration-accent/40 prose-a:underline-offset-4 hover:prose-a:text-accent prose-blockquote:border-accent prose-blockquote:text-muted prose-code:text-accent-soft prose-pre:border prose-pre:border-border prose-pre:bg-[#08090a] prose-img:rounded-md prose-img:border prose-img:border-border prose-video:rounded-md prose-video:border prose-video:border-border prose-hr:border-border prose-strong:text-foreground prose-li:marker:text-accent">
            <Content components={mdxComponents} />
          </div>
        </article>
        <aside className="hidden py-10 xl:block" aria-label="Article sections">
          <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-border pl-4">
            <p className="mb-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[.14em] text-faint">On this page</p>
            <ol className="m-0 list-none space-y-2 p-0 text-xs leading-snug">
              <li>
                <a className="block text-muted no-underline transition-colors hover:text-accent data-[active=true]:font-semibold data-[active=true]:text-accent" data-toc-link="article-start" data-active="true" aria-current="location" href="#article-start">Start</a>
              </li>
              {meta.headings.map((heading, index) => (
                <li className={tocIndent(heading.depth)} key={`${heading.id}-${index}`}>
                  <a className="block text-muted no-underline transition-colors hover:text-accent data-[active=true]:font-semibold data-[active=true]:text-accent" data-toc-link={heading.id} data-active="false" href={`#${heading.id}`}>{heading.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-[65vh] flex-1 place-content-center text-center">
      <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[.14em] text-accent">404</p>
      <h1 className="mb-6 text-[clamp(2.5rem,8vw,5rem)] font-normal">Nothing planted here.</h1>
      <a className="text-accent" href="/">Return to the blog →</a>
    </main>
  );
}

export function App({ pathname, Content }: { pathname: string; Content?: ComponentType<any> }) {
  const meta = postFromPath(pathname);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[64rem] flex-col px-4 sm:px-6 md:px-10 lg:px-12">
      <a className="fixed top-2 left-2 z-20 -translate-y-[150%] bg-accent px-4 py-2 text-background focus:translate-y-0" href="#main">Skip to content</a>
      <Header />
      {meta && Content ? <Post meta={meta} Content={Content} /> : pathname === "/" || pathname === "/posts" || pathname === "/posts/" ? <Home /> : <NotFound />}
      <Footer />
    </div>
  );
}

export function seoFor(pathname: string) {
  const post = postFromPath(pathname);
  return post
    ? { title: `${post.title} · achichorro.com`, description: post.description || "A post by Artur Chichorro.", canonical: `${SITE}/posts/${post.slug}`, type: "article", date: post.date }
    : { title: "achichorro.com — Artur Chichorro's blog", description: "Experiments in software, games, hardware and everything in between, by Artur Chichorro.", canonical: SITE, type: "website" };
}
