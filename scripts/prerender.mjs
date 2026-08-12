#!/usr/bin/env node
/**
 * Post-Vite static prerender for public routes.
 * Writes path/index.html with title, meta, canonical, H1, core copy, JSON-LD
 * so crawlers and no-JS clients get real content. Also writes 404.html + sitemap.
 *
 * Netlify then serves known paths as HTTP 200 and unknown paths via 404.html
 * as a true HTTP 404 (no soft SPA rewrite).
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PUBLIC_ROUTES,
  OG_IMAGE_FILES,
  SITE_ORIGIN,
  SITE_NAME,
} from "./seo-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function absoluteUrl(path) {
  if (path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.replace(/\/$/, "")}`;
}

function injectHead(html, route) {
  const url = absoluteUrl(route.path);
  const ogImage = absoluteUrl(OG_IMAGE_FILES[route.ogImage]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": route.schemaType,
    name: route.h1,
    description: route.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };

  const headTags = `
    <meta name="description" content="${escapeHtml(route.description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;

  // Replace default title / description; inject SEO tags before </head>
  let out = html.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(route.title)}</title>`,
  );
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    "",
  );
  out = out.replace(/<\/head>/i, `${headTags}\n  </head>`);
  return out;
}

function shellHtml(route) {
  const paragraphs = route.coreCopy
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("\n");
  return `
<div id="wec-prerender" data-wec-prerender="true" style="font-family:Lexend,system-ui,sans-serif;background:#1a1410;color:#DECCA7;min-height:100vh;padding:3rem 1.25rem;">
  <header style="max-width:48rem;margin:0 auto 2rem;">
    <p style="color:#C48D49;letter-spacing:0.12em;text-transform:uppercase;font-size:0.75rem;margin:0 0 0.75rem;">World Espresso Championship</p>
    <h1 style="font-size:clamp(1.75rem,4vw,3rem);line-height:1.1;margin:0 0 1rem;color:#F7F1E5;">${escapeHtml(route.h1)}</h1>
  </header>
  <main style="max-width:48rem;margin:0 auto;font-size:1.05rem;line-height:1.65;color:#C9B48A;">
    ${paragraphs}
    <p style="margin-top:2rem;"><a href="/" style="color:#994D27;">Home</a> · <a href="/panama-2026" style="color:#994D27;">WEC 2026 Panama</a> · <a href="/how-it-works" style="color:#994D27;">How It Works</a></p>
  </main>
</div>
<script>
  // Remove static shell once the React app mounts (createRoot replaces #root).
  // Kept for no-JS / pre-hydration crawlers.
</script>`.trim();
}

function writeRoute(template, route) {
  let html = injectHead(template, route);
  const shell = shellHtml(route);
  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${shell}</div>`,
  );

  const outPath = route.outDir
    ? join(DIST, route.outDir, "index.html")
    : join(DIST, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`prerender ${route.path} -> ${outPath.replace(ROOT + "/", "")}`);
}

function write404(template) {
  const route = {
    path: "/404",
    title: `Page Not Found | ${SITE_NAME}`,
    description: "This page does not exist on the World Espresso Championship site.",
    h1: "404 — Page not found",
    coreCopy: [
      "This page does not exist. The shot never made it to the cup.",
      "Return home or explore WEC 2026 Panama.",
    ],
    ogImage: "home",
    schemaType: "WebPage",
  };
  let html = injectHead(template, route);
  html = html.replace(
    /<meta name="description"[^>]*>/i,
    `<meta name="description" content="${escapeHtml(route.description)}" />\n    <meta name="robots" content="noindex, nofollow" />`,
  );
  if (!html.includes('name="robots"')) {
    html = html.replace(
      /<\/head>/i,
      `    <meta name="robots" content="noindex, nofollow" />\n  </head>`,
    );
  }
  const shell = `
<div style="font-family:Lexend,system-ui,sans-serif;background:#1a1410;color:#DECCA7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center;">
  <div>
    <img src="/assets/logo-white.png" alt="${escapeHtml(SITE_NAME)}" width="64" height="64" style="margin-bottom:1.25rem;" />
    <p style="color:#C48D49;letter-spacing:0.2em;text-transform:uppercase;font-size:0.75rem;">World Espresso Championship</p>
    <h1 style="font-size:3rem;margin:0.5rem 0 1rem;color:#F7F1E5;">404</h1>
    <p style="color:#C9B48A;max-width:28rem;margin:0 auto 1.5rem;">This page does not exist. The shot never made it to the cup.</p>
    <p><a href="/" style="color:#994D27;">Back to Home</a> · <a href="/panama-2026" style="color:#994D27;">WEC 2026 Panama</a></p>
  </div>
</div>`;
  html = html.replace(/<div id="root"><\/div>/i, `<div id="root">${shell}</div>`);
  // Prefer static 404 without waiting on the SPA bundle for status pages
  writeFileSync(join(DIST, "404.html"), html, "utf8");
  console.log("prerender 404 -> dist/public/404.html");
}

function writeSitemap() {
  const urls = PUBLIC_ROUTES.map((r) => {
    const loc = absoluteUrl(r.path);
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(DIST, "sitemap.xml"), xml, "utf8");
  console.log("wrote dist/public/sitemap.xml");
}

function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.error("Missing dist/public/index.html — run vite build first.");
    process.exit(1);
  }
  const template = readFileSync(indexPath, "utf8");

  for (const route of PUBLIC_ROUTES) {
    writeRoute(template, route);
  }
  write404(template);
  writeSitemap();

  // Ensure robots.txt reached dist (Vite copies public/)
  const robotsSrc = join(ROOT, "public", "robots.txt");
  if (existsSync(robotsSrc)) {
    copyFileSync(robotsSrc, join(DIST, "robots.txt"));
  }

  console.log(`Prerendered ${PUBLIC_ROUTES.length} public routes + 404.html`);
}

main();
