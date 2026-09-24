interface ProjectProps {
  title: string;
  description?: string;
  years: string;
  gh?: string;
  posts?: { post_title: string; external: boolean; url: string }[];
}

export function ProjectItem({ title, description, years, gh, posts }: ProjectProps) {
  return (
    <article className="flex min-h-44 flex-col rounded-md border border-border bg-surface p-4">
      <small className="font-mono text-accent">{years}</small>
      <h3 className="mt-2 mb-0 font-sans text-lg">{title}</h3>
      {description && <p className="mt-2 mb-4 text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-auto flex flex-wrap gap-2 text-xs">
        {gh && <a href={gh} target="_blank" rel="noreferrer">GitHub ↗</a>}
        {posts?.map((post) => <a key={post.url} href={post.url} target={post.external ? "_blank" : undefined}>{post.post_title}{post.external ? " ↗" : ""}</a>)}
      </div>
    </article>
  );
}
