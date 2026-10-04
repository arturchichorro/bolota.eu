import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";
import { defineConfig } from "vite";
import { frontmatterPlugin, postIndexPlugin } from "./src/content.ts";
import rehypeMath from "./src/rehype-math.ts";

type MdxNode = { type?: string; name?: string; children?: MdxNode[] };

function remarkBaseUiDetails() {
  return (tree: MdxNode) => {
    const visit = (node: MdxNode) => {
      if (node.type === "mdxJsxFlowElement" && node.name === "details") node.name = "MdxDetails";
      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

export default defineConfig({
  plugins: [
    postIndexPlugin(),
    frontmatterPlugin(),
    mdx({
      remarkPlugins: [remarkMath, remarkBaseUiDetails],
      rehypePlugins: [rehypeMath, [rehypePrettyCode, { theme: "ayu-dark", keepBackground: false }]],
    }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: [
      "@base-ui/react/button",
      "@base-ui/react/collapsible",
      "@base-ui/react/dialog",
      "@base-ui/react/slider",
      "@base-ui/react/switch",
    ],
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { target: "es2022" },
});
