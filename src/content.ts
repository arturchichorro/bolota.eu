import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import type { Plugin } from "vite";
import { parse } from "yaml";
import { z } from "zod";

export const postFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  date: z.iso.date(),
  published: z.boolean().optional(),
  interactive: z.boolean().optional(),
  icon: z.string().trim().min(1).optional(),
  saga: z.array(z.object({
    title: z.string().trim().min(1),
    url: z.string().trim().min(1),
  }).strict()).optional(),
}).strict();

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type PostMeta = PostFrontmatter & {
  slug: string;
};

const contentDirectory = fileURLToPath(new URL("../content/posts", import.meta.url));

export function validatePostFrontmatter(value: unknown, source: string): PostFrontmatter {
  const result = postFrontmatterSchema.safeParse(value);
  if (result.success) return result.data;

  const details = result.error.issues
    .map((issue) => `  ${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid frontmatter in ${source}:\n${details}`);
}

export function parsePost(source: string, sourceName: string) {
  if (!source.startsWith("---")) throw new Error(`Missing frontmatter in ${sourceName}`);

  const end = source.indexOf("\n---", 3);
  if (end < 0) throw new Error(`Unclosed frontmatter in ${sourceName}`);

  return {
    frontmatter: validatePostFrontmatter(parse(source.slice(4, end)), sourceName),
    body: source.slice(end + 4),
  };
}

export function computePostMetadata(source: string, filename: string): PostMeta {
  const { frontmatter } = parsePost(source, filename);
  return {
    ...frontmatter,
    slug: filename.replace(/\.mdx$/, ""),
  };
}

export function loadPosts(directory = contentDirectory): PostMeta[] {
  return readdirSync(directory)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => computePostMetadata(readFileSync(join(directory, name), "utf8"), name));
}

export function frontmatterPlugin(): Plugin {
  return {
    name: "bolota-mdx-frontmatter",
    enforce: "pre",
    transform(source, id) {
      if (!id.endsWith(".mdx")) return;
      const { frontmatter, body: rawBody } = parsePost(source, id);
      const body = rawBody
        .replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"')
        .replace(/<video(?![^>]*\bpreload=)/g, '<video preload="metadata"')
        .replace(/\bmdx-hidden-flex\b/g, "hidden sm:flex")
        .replace(/\bmdx-hidden-block\b/g, "hidden sm:block");
      return `export const frontmatter = ${JSON.stringify(frontmatter)};\n${body}`;
    },
  };
}

export function postIndexPlugin(): Plugin {
  const virtualId = "virtual:bolota-posts";
  const resolvedId = `\0${virtualId}`;

  return {
    name: "bolota-post-index",
    resolveId(id) {
      return id === virtualId ? resolvedId : undefined;
    },
    load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(loadPosts())}`;
    },
  };
}
