import type { ComponentType } from "react";
import { mdxComponents } from "./components/mdx-components";
import { PostIcon } from "./components/post-icon";
import { SeriesNavigation } from "./components/series-navigation";
import { postFromPath, posts, type PostMeta } from "./posts";

const SITE = "https://achichorro.com";

function Header({ meta }: { meta?: PostMeta }) {
  return (
    <header className="flex min-h-21 flex-wrap items-center gap-x-6 gap-y-2 py-6 sm:flex-nowrap">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-lg">
        <a className="shrink-0 font-bold tracking-tight no-underline underline-offset-4 hover:underline" href="/" aria-label="achichorro.com home">
          Artur Chichorro
        </a>
        {meta && (
          <>
            <span className="hidden text-muted sm:inline" aria-hidden="true">&gt;</span>
            <h1 className="m-0 w-full min-w-0 text-lg font-medium text-accent sm:w-auto">{meta.title}</h1>
          </>
        )}
      </div>
      {meta && <time className="w-full shrink-0 text-left text-sm text-muted sm:ml-auto sm:w-auto sm:text-right" dateTime={meta.date}>{formatDate(meta.date)}</time>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-6 text-sm text-muted">
      <a className="no-underline underline-offset-4 hover:underline" href="/rss.xml">Subscribe via RSS</a>
    </footer>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function formatArchiveDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
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
            <h1 className="m-0 pt-4 pb-2 text-base font-medium text-foreground sm:text-lg">{year}</h1>
            <ol className="m-0 list-none p-0">
              {yearPosts?.map((post) => (
                <li key={post.slug}>
                  <article className="grid grid-cols-[minmax(0,1fr)_auto] py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <PostIcon name={post.icon} />
                      <h2 className="m-0 min-w-0 text-base font-normal tracking-widest sm:text-lg">
                        <a className="link" href={`/posts/${post.slug}/`}>
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
      <article data-article className="mx-auto w-full max-w-180 min-w-0">
        <SeriesNavigation post={meta} />
        <div className="prose prose-invert max-w-none pt-8 prose-headings:scroll-mt-8 prose-blockquote:border-accent prose-blockquote:text-muted prose-code:text-accent-soft prose-pre:border prose-pre:border-border prose-pre:bg-[#08090a] prose-img:rounded-md prose-img:border prose-img:border-border prose-video:rounded-md prose-video:border prose-video:border-border prose-hr:border-border prose-strong:text-foreground prose-li:marker:text-accent">
          <Content components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-[65vh] flex-1 place-content-center text-center">
      <h1 className="text-2xl">404: Not found</h1>
    </main>
  );
}

export function App({ pathname, Content }: { pathname: string; Content?: ComponentType<any> }) {
  const meta = postFromPath(pathname);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6 md:px-10 lg:px-12">
      <a className="fixed top-2 left-2 z-20 translate-y-[-150%] bg-accent px-4 py-2 text-background focus:translate-y-0" href="#main">Skip to content</a>
      <Header meta={meta && Content ? meta : undefined} />
      {meta && Content ? <Post meta={meta} Content={Content} /> : pathname === "/" || pathname === "/posts" || pathname === "/posts/" ? <Home /> : <NotFound />}
      <Footer />
    </div>
  );
}

export function seoFor(pathname: string) {
  const post = postFromPath(pathname);
  return post
    ? { title: `${post.title} · achichorro.com`, description: post.description || "A post by Artur Chichorro.", canonical: `${SITE}/posts/${post.slug}`, type: "article", date: post.date }
    : { title: "achichorro.com", description: "Whatever is in my head, mostly software and the world", canonical: SITE, type: "website" };
}
