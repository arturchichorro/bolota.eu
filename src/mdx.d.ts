declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: import("./content").PostFrontmatter;
  const Component: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  export default Component;
}

declare module "virtual:bolota-posts" {
  import type { PostMeta } from "@/posts";
  const posts: PostMeta[];
  export default posts;
}
