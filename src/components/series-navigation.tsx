import { useId } from "react";
import type { PostMeta } from "../posts";
import { posts } from "../posts";
import { seriesForPost } from "../series";

function SeriesArrow({ post, direction, tooltipSide }: { post?: PostMeta; direction: "previous" | "next"; tooltipSide: "top" | "bottom" }) {
  const id = useId();
  const arrow = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "previous" ? "M19 12H5m7 7-7-7 7-7" : "M5 12h14m-7-7 7 7-7 7"} />
    </svg>
  );

  if (!post) {
    return <button type="button" disabled className="grid h-9 w-6 shrink-0 place-items-center text-faint opacity-40" aria-label={`No ${direction} post`}>{arrow}</button>;
  }

  const tooltipId = `${id}-series-${direction}-${post.slug}`;
  return (
    <span className="group relative inline-flex shrink-0">
      <a
        href={`/posts/${post.slug}/`}
        className="grid h-9 w-6 place-items-center text-muted no-underline hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`${direction === "previous" ? "Previous" : "Next"} post: ${post.title}`}
        aria-describedby={tooltipId}
      >
        {arrow}
      </a>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none invisible absolute left-0 z-50 w-max max-w-[min(16rem,50vw)] rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${tooltipSide === "bottom" ? "top-full mt-2" : "bottom-full mb-2"}`}
      >
        {post.title}
      </span>
    </span>
  );
}

function SeriesControls({ series, tooltipSide }: { series: NonNullable<ReturnType<typeof seriesForPost>>; tooltipSide: "top" | "bottom" }) {
  return (
    <span className="flex shrink-0 items-center text-sm">
      <SeriesArrow post={series.previous} direction="previous" tooltipSide={tooltipSide} />
      <span className="min-w-[3ch] text-center tabular-nums text-foreground" aria-label={`Post ${series.position} of ${series.total}`}>{series.position}/{series.total}</span>
      <SeriesArrow post={series.next} direction="next" tooltipSide={tooltipSide} />
    </span>
  );
}

export function SeriesPostTitle({ post }: { post: PostMeta }) {
  const series = seriesForPost(post.slug, posts);
  const title = (
    <h1 className="m-0 min-w-0 text-lg font-medium text-accent">
      {post.title}
    </h1>
  );
  if (!series) return title;

  return (
    <nav className="flex min-w-0 items-center gap-x-1" aria-label={`${series.title} series`}>
      {title}
      <SeriesControls series={series} tooltipSide="bottom" />
    </nav>
  );
}

export function SeriesNavigation({ post, className = "", tooltipSide = "top" }: { post: PostMeta; className?: string; tooltipSide?: "top" | "bottom" }) {
  const series = seriesForPost(post.slug, posts);
  if (!series) return null;

  return (
    <nav className={`flex items-center gap-x-1 text-lg ${className}`} aria-label={`${series.title} series`}>
      <span className="font-medium text-accent">{series.title}</span>
      <SeriesControls series={series} tooltipSide={tooltipSide} />
    </nav>
  );
}
