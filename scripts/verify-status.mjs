#!/usr/bin/env node
/**
 * Mimics Netlify static hosting: directory indexes → 200, missing → 404.html with 404.
 * Verifies every public route returns 200 and a random path returns true HTTP 404.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES } from "./seo-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "dist", "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let rel = clean === "/" ? "index.html" : clean.replace(/^\//, "");
  let abs = join(ROOT, rel);
  if (existsSync(abs) && statSync(abs).isDirectory()) {
    abs = join(abs, "index.html");
  } else if (!existsSync(abs) && !extname(abs)) {
    const asIndex = join(ROOT, rel, "index.html");
    if (existsSync(asIndex)) abs = asIndex;
  }
  return abs;
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const abs = resolvePath(req.url || "/");
      if (existsSync(abs) && statSync(abs).isFile()) {
        const body = readFileSync(abs);
        res.writeHead(200, {
          "Content-Type": MIME[extname(abs)] || "application/octet-stream",
        });
        res.end(body);
        return;
      }
      const notFound = join(ROOT, "404.html");
      const body = existsSync(notFound)
        ? readFileSync(notFound)
        : Buffer.from("Not Found");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(body);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function check(port, path, expectStatus) {
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    redirect: "manual",
  });
  const text = await res.text();
  const ok = res.status === expectStatus;
  const mark = ok ? "OK" : "FAIL";
  console.log(`[${mark}] ${path} → ${res.status} (expected ${expectStatus})`);
  return { ok, status: res.status, text };
}

async function main() {
  if (!existsSync(join(ROOT, "index.html")) || !existsSync(join(ROOT, "404.html"))) {
    console.error("Run npm run build:client first (needs prerendered dist/public).");
    process.exit(1);
  }

  const { server, port } = await startServer();
  let failed = 0;

  try {
    for (const route of PUBLIC_ROUTES) {
      const { ok, text } = await check(port, route.path, 200);
      if (!ok) failed++;
      else {
        if (!text.includes(route.h1) && !text.includes(escapeLess(route.h1))) {
          // H1 may be HTML-escaped the same; check title at least
          if (!text.includes(`<title>${route.title}</title>`)) {
            console.log(`  WARN: missing title/h1 markers for ${route.path}`);
            failed++;
          }
        }
        if (!text.includes('rel="canonical"')) {
          console.log(`  WARN: missing canonical for ${route.path}`);
          failed++;
        }
        if (!text.includes("application/ld+json")) {
          console.log(`  WARN: missing JSON-LD for ${route.path}`);
          failed++;
        }
      }
    }

    const nonsense = `/does-not-exist-${Date.now()}-wec-test`;
    const missing = await check(port, nonsense, 404);
    if (!missing.ok) failed++;
    if (missing.ok && !missing.text.includes("404")) {
      console.log("  WARN: 404 body missing 404 marker");
      failed++;
    }

    // Soft-404 regression: must NOT be a 200 SPA shell for unknown paths
    if (missing.status === 200) {
      console.log("FAIL: unknown path returned soft 200");
      failed++;
    }
  } finally {
    server.close();
  }

  if (failed > 0) {
    console.error(`\nStatus verification failed (${failed} issue(s)).`);
    process.exit(1);
  }
  console.log("\nAll public routes 200; unknown path true HTTP 404.");
}

function escapeLess(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
