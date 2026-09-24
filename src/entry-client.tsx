import { createRoot, hydrateRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./tailwind.css";
import { App } from "./App";
import { loadPost, postFromPath } from "./posts";

async function start() {
  const root = document.getElementById("root")!;
  const pathname = window.location.pathname;
  const post = postFromPath(pathname);
  const module = post ? await loadPost(post.slug) : undefined;
  const app = <App pathname={pathname} Content={module?.default} />;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

start();
