// Run after pnpm build: node --test scripts/prerender.test.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { fromHtml } from "hast-util-from-html";

const dist = resolve(import.meta.dirname, "../dist");
const site = "https://achichorro.com";
const pages = readdirSync(dist, { recursive: true }).filter((file) => file.endsWith(".html"));

function nodes(tree, predicate) {
  const found = [];
  function visit(node) {
    if (predicate(node)) found.push(node);
    for (const child of node.children || []) visit(child);
  }
  visit(tree);
  return found;
}

function assertServedUrl(value, label) {
  const url = new URL(value);
  assert.equal(url.origin, site, label);
  assert(url.pathname.endsWith("/"), `${label}: missing trailing slash in ${value}`);
  assert(existsSync(resolve(dist, `.${url.pathname}`, "index.html")), `${label}: missing page for ${value}`);
}

test("canonical, Open Graph, and article JSON-LD URLs use served trailing-slash routes", () => {
  assert(pages.length > 2);
  for (const file of pages) {
    const tree = fromHtml(readFileSync(resolve(dist, file), "utf8"));
    const canonical = nodes(tree, (node) => node.tagName === "link" && node.properties?.rel?.includes("canonical"));
    assert.equal(canonical.length, 1, file);
    const url = canonical[0].properties.href;
    assertServedUrl(url, file);
    const og = nodes(tree, (node) => node.tagName === "meta" && node.properties?.property === "og:url");
    assert.equal(og[0]?.properties.content, url, file);
    for (const script of nodes(tree, (node) => node.tagName === "script" && node.properties?.type === "application/ld+json")) {
      const data = JSON.parse(script.children.map((child) => child.value || "").join(""));
      if (data["@type"] === "BlogPosting") assert.equal(data.mainEntityOfPage, url, file);
    }
  }
});

test("sitemap and RSS URLs use existing trailing-slash routes", () => {
  for (const file of ["sitemap.xml", "rss.xml"]) {
    const xml = readFileSync(resolve(dist, file), "utf8");
    const urls = [...xml.matchAll(/<(?:loc|link|guid)>(https:\/\/achichorro\.com[^<]*)<\//g)];
    assert(urls.length > 0, file);
    for (const [, url] of urls) assertServedUrl(url, file);
  }
});

test("all generated internal links resolve and none links to the removed About page", () => {
  for (const file of pages) {
    const pathname = `/${file.replace(/index\.html$/, "")}`;
    const tree = fromHtml(readFileSync(resolve(dist, file), "utf8"));
    for (const anchor of nodes(tree, (node) => node.tagName === "a" && node.properties?.href)) {
      const href = anchor.properties.href;
      const url = new URL(href, `${site}${pathname}`);
      if (url.origin !== site) continue;
      assert(!/^\/about\/?$/.test(url.pathname), `${file}: About link ${href}`);
      assert(existsSync(resolve(dist, `.${decodeURIComponent(url.pathname)}`)), `${file}: broken link ${href} resolves to ${url.pathname}`);
      if (url.pathname.startsWith("/posts/")) assert(url.pathname.endsWith("/"), `${file}: article link needs trailing slash: ${href}`);
    }
  }
});
