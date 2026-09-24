import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const template = await readFile(resolve(dist, "index.html"), "utf8");
const server = await import(pathToFileURL(resolve(root, ".ssr/entry-server.js")));

const interactiveRoutes = new Set(server.posts.filter((post) => post.interactive).map((post) => `/posts/${post.slug}/`));
const articleRoutes = new Set(server.posts.map((post) => `/posts/${post.slug}/`));
const tocScrollSpyScript = `<script>(()=>{const t=[...document.querySelectorAll('[data-toc-link]')].map(l=>({l,s:document.getElementById(l.dataset.tocLink)})).filter(x=>x.s);if(!t.length)return;let f;const u=()=>{f=undefined;const y=Math.min(innerHeight*.3,240);let c=t[0];for(const x of t){if(x.s.getBoundingClientRect().top<=y)c=x;else break}for(const x of t){const n=x===c;x.l.dataset.active=String(n);n?x.l.setAttribute('aria-current','location'):x.l.removeAttribute('aria-current')}};const q=()=>{if(f===undefined)f=requestAnimationFrame(u)};u();addEventListener('scroll',q,{passive:true});addEventListener('resize',q)})()</script>`;

const escape = (value = "") => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function headFor(pathname) {
  const seo = server.seoFor(pathname);
  const jsonLd = seo.type === "article" ? {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: seo.title.replace(" · achichorro.com", ""),
    datePublished: seo.date, dateModified: seo.date, description: seo.description, mainEntityOfPage: seo.canonical,
    author: { "@type": "Person", name: "Artur Chichorro", url: "https://achichorro.com" },
  } : { "@context": "https://schema.org", "@type": "Blog", name: "achichorro.com", url: "https://achichorro.com", author: { "@type": "Person", name: "Artur Chichorro" } };
  return `<title>${escape(seo.title)}</title>
    <meta name="description" content="${escape(seo.description)}" />
    <link rel="canonical" href="${seo.canonical}" />
    <link rel="alternate" type="application/rss+xml" title="achichorro.com" href="https://achichorro.com/rss.xml" />
    <meta property="og:type" content="${seo.type}" />
    <meta property="og:site_name" content="achichorro.com" />
    <meta property="og:title" content="${escape(seo.title)}" />
    <meta property="og:description" content="${escape(seo.description)}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>`;
}

for (const route of server.routes) {
  const needsJavaScript = interactiveRoutes.has(route);
  const needsStandaloneToc = articleRoutes.has(route) && !needsJavaScript;
  const staticTemplate = template.replace(/\s*<script type="module"[^>]+><\/script>/, "");
  const routeTemplate = needsJavaScript ? template : needsStandaloneToc ? staticTemplate.replace("</body>", `${tocScrollSpyScript}</body>`) : staticTemplate;
  const html = routeTemplate.replace("<!--seo-head-->", headFor(route)).replace("<!--app-html-->", await server.render(route));
  const target = route === "/" ? resolve(dist, "index.html") : resolve(dist, `.${route}`, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${server.posts.map((post) => `  <url><loc>https://achichorro.com/posts/${post.slug}</loc><lastmod>${post.date}</lastmod></url>`).join("\n")}
</urlset>`;
await writeFile(resolve(dist, "sitemap.xml"), siteMap);
await writeFile(resolve(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://achichorro.com/sitemap.xml\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>achichorro.com</title><link>https://achichorro.com</link><description>Artur Chichorro's blog.</description>${server.posts.map((post) => `<item><title>${escape(post.title)}</title><link>https://achichorro.com/posts/${post.slug}</link><guid>https://achichorro.com/posts/${post.slug}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(post.description || "")}</description></item>`).join("")}</channel></rss>`;
await writeFile(resolve(dist, "rss.xml"), rss);
await rm(resolve(root, ".ssr"), { recursive: true, force: true });

console.log(`Prerendered ${server.routes.length} pages, sitemap and RSS feed.`);
