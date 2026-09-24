import postIndex from "virtual:bolota-posts";
import type { ComponentType } from "react";
import type { PostFrontmatter, PostHeading, PostMeta } from "./content";

export type { PostHeading, PostMeta } from "./content";

export interface PostModule {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  frontmatter: PostFrontmatter;
}

const modules = import.meta.glob<PostModule>("../content/posts/*.mdx");

export const posts = (postIndex as PostMeta[])
  .filter((post) => post.published !== false)
  .sort((a, b) => b.date.localeCompare(a.date));

export async function loadPost(slug: string): Promise<PostModule | undefined> {
  const key = `../content/posts/${slug}.mdx`;
  return modules[key]?.();
}

export function postFromPath(pathname: string) {
  const match = pathname.replace(/\/+$/, "").match(/^\/posts\/([^/]+)$/);
  return match ? posts.find((post) => post.slug === match[1]) : undefined;
}
