import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const computedFields = <T extends { slug: string }>(data: T) => ({
    ...data,
    slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
    name: "Post",
    pattern: "posts/**/*.mdx",
    schema: s.object({
        slug: s.path(),
        title: s.string().max(99),
        description: s.string().max(999).optional(),
        date: s.isodate(),
        published: s.boolean().default(true),
        icon: s.string().max(99),
        body: s.mdx()
    }).transform(computedFields),
});

export default defineConfig({
    root: "content",
    output: {
        data: ".velite",
        assets: "public/static",
        base: "/static/",
        name: "[name]-[hash:6].[ext]",
        clean: true
    },
    collections: { posts },
    mdx: {
        rehypePlugins: [rehypeSlug,
            [rehypePrettyCode, { theme: "github-dark" }],
            [
                rehypeAutoLinkHeadings, {
                    behavior: "wrap",
                    properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section"
                    },
                }],
            [rehypeKatex]
        ],
        remarkPlugins: [
            remarkMath
        ],
    }
})