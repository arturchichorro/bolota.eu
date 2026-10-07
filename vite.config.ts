import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";
import { defineConfig } from "vite";
import { frontmatterPlugin, postIndexPlugin } from "./src/content.ts";
import rehypeMath from "./src/rehype-math.ts";

export default defineConfig({
  plugins: [
    postIndexPlugin(),
    frontmatterPlugin(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeMath, [rehypePrettyCode, { theme: "vitesse-black", keepBackground: false }]],
    }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: [
      "@base-ui/react/button",
      "@base-ui/react/dialog",
      "@base-ui/react/slider",
      "@base-ui/react/switch",
    ],
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { proxy: { "/api/subscribe": "http://127.0.0.1:8787" } },
  preview: { proxy: { "/api/subscribe": "http://127.0.0.1:8787" } },
  build: { target: "es2022" },
});
