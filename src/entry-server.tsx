import { renderToString } from "react-dom/server";
import "katex/dist/katex.min.css";
import "./tailwind.css";
import { App, seoFor } from "./App";
import { loadPost, posts, postFromPath } from "./posts";

export async function render(pathname: string) {
  const post = postFromPath(pathname);
  const module = post ? await loadPost(post.slug) : undefined;
  return renderToString(<App pathname={pathname} Content={module?.default} />);
}

export const routes = ["/", "/posts/", ...posts.map((post) => `/posts/${post.slug}/`)];
export { posts, seoFor };
