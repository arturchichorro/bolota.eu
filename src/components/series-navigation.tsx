import type { PostMeta } from "../posts";
import { posts } from "../posts";
import { seriesForPost } from "../series";

function SeriesArrow({ post, direction }: { post?: PostMeta; direction: "previous" | "next" }) {
  const arrow = (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "previous" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );

  if (!post) {
    return <button type="button" disabled className="grid h-9 w-9 place-items-center text-faint opacity-40" aria-label={`No ${direction} post`}>{arrow}</button>;
  }

  const tooltipId = `series-${direction}-${post.slug}`;
  return (
    <span className="group relative inline-flex">
      <a
        href={`/posts/${post.slug}/`}
        className="grid h-9 w-9 place-items-center text-muted no-underline hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`${direction === "previous" ? "Previous" : "Next"} post: ${post.title}`}
        aria-describedby={tooltipId}
      >
        {arrow}
      </a>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-max max-w-[min(16rem,50vw)] rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {post.title}
      </span>
    </span>
  );
}

export function SeriesNavigation({ post }: { post: PostMeta }) {
  const series = seriesForPost(post.slug, posts);
  if (!series) return null;

  return (
    <nav className="flex flex-wrap items-center gap-x-2 pt-4 text-sm" aria-label={`${series.title} series`}>
      <span className="mr-1 font-medium text-accent">{series.title}</span>
      <SeriesArrow post={series.previous} direction="previous" />
      <span className="tabular-nums text-foreground" aria-label={`Post ${series.position} of ${series.total}`}>{series.position}/{series.total}</span>
      <SeriesArrow post={series.next} direction="next" />
    </nav>
  );
}
