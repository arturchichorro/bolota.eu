import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { defineConfig } from "vite";
import { frontmatterPlugin, postIndexPlugin } from "./src/content";

export default defineConfig({
  plugins: [
    postIndexPlugin(),
    frontmatterPlugin(),
    mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { target: "es2022" },
});
