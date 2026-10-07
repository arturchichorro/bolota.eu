import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { fromHtml } from "hast-util-from-html";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";
import rehypeMath from "../src/rehype-math.ts";

const require = createRequire(import.meta.url);
const mdxRequire = createRequire(require.resolve("@mdx-js/rollup"));
const { compile } = await import(pathToFileURL(mdxRequire.resolve("@mdx-js/mdx")));

function transform(html) {
  const tree = fromHtml(html, { fragment: true });
  rehypeMath()(tree, { path: "example.mdx" });
  return tree;
}

function nodes(tree, predicate) {
  const found = [];
  function visit(node) {
    if (predicate(node)) found.push(node);
    for (const child of node.children || []) visit(child);
  }
  visit(tree);
  return found;
}

const hasClass = (name) => (node) => node.properties?.className?.includes(name);

test("inline fractions use the latest KaTeX markup and accessible MathML", () => {
  const tree = transform(String.raw`<p><code class="math-inline">\frac{a_1}{b}</code></p>`);
  assert.equal(nodes(tree, hasClass("katex")).length, 1);
  assert.equal(nodes(tree, hasClass("katex-base")).length, 1);
  assert(nodes(tree, hasClass("katex-sizing")).length > 0);
  assert.equal(nodes(tree, (node) => node.tagName === "math").length, 1);
  assert.equal(nodes(tree, hasClass("katex-display")).length, 0);
});

test("display math and fenced math both become display formulas", () => {
  for (const html of [
    String.raw`<code class="math-display">\det(A)</code>`,
    String.raw`<pre><code class="language-math">\det(A)</code></pre>`,
  ]) {
    const tree = transform(html);
    assert.equal(nodes(tree, hasClass("katex-display")).length, 1);
    assert.equal(nodes(tree, (node) => node.tagName === "pre").length, 0);
  }
});

test("math is transformed inside MDX JSX containers", () => {
  const inner = fromHtml('<code class="math-inline">x</code>', { fragment: true });
  const tree = { type: "root", children: [{ type: "mdxJsxFlowElement", name: "div", children: inner.children }] };
  rehypeMath()(tree, { path: "example.mdx" });
  assert.equal(nodes(tree, hasClass("katex")).length, 1);
});

test("ordinary code is left untouched", () => {
  const tree = fromHtml('<pre><code class="language-python">x = 1</code></pre>', { fragment: true });
  const original = structuredClone(tree);
  rehypeMath()(tree, { path: "example.mdx" });
  assert.deepEqual(tree, original);
});

test("invalid math fails with the source location instead of error markup", () => {
  assert.throws(() => transform(String.raw`<code class="math-inline">\unknowncommand</code>`), /Invalid math in example\.mdx:1:1/);
});

test("untrusted TeX cannot inject links", () => {
  const tree = transform(String.raw`<code class="math-inline">\href{https://example.com}{x}</code>`);
  assert.equal(nodes(tree, (node) => node.tagName === "a" || node.properties?.href !== undefined).length, 0);
});

test("all post formulas compile through the production adapter", async () => {
  let formulaCount = 0;
  for (const name of readdirSync(new URL("../content/posts/", import.meta.url)).filter((name) => name.endsWith(".mdx"))) {
    const source = readFileSync(new URL(`../content/posts/${name}`, import.meta.url), "utf8")
      .replace(/^---\n[\s\S]*?\n---/, (frontmatter) => frontmatter.replace(/[^\n]/g, ""));
    const count = () => (tree) => {
      formulaCount += nodes(tree, (node) => node.type === "math" || node.type === "inlineMath").length;
    };
    await compile({ path: name, value: source }, { remarkPlugins: [remarkMath, count], rehypePlugins: [rehypeMath] });
  }
  assert(formulaCount > 0);
  console.log(`Validated ${formulaCount} post formulas.`);
});

test("syntax colors and highlighted lines are generated at build time", async () => {
  let highlighted;
  const capture = () => (tree) => { highlighted = tree; };
  await compile("```python {2}\nx = 1\nprint(x)\n```", {
    rehypePlugins: [[rehypePrettyCode, { theme: "github-dark", keepBackground: false }], capture],
  });
  assert.equal(nodes(highlighted, (node) => node.properties?.["data-rehype-pretty-code-figure"] !== undefined).length, 1);
  assert.equal(nodes(highlighted, (node) => node.properties?.["data-highlighted-line"] !== undefined).length, 1);
  assert(nodes(highlighted, (node) => /color:#[0-9a-f]+/i.test(node.properties?.style || "")).length > 0);
});
