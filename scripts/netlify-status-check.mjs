#!/usr/bin/env node
/**
 * Local static server that mirrors Netlify behaviour for prerendered routes:
 * - Serve existing files / directory indexes with 200
 * - Apply known 301 redirects from _redirects
 * - Unknown paths → 404.html with HTTP 404
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../dist/public");
const PORT = Number(process.env.PORT || 4180);

function loadRedirects() {
  const file = path.join(ROOT, "_redirects");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const rules = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const parts = t.split(/\s+/);
    if (parts.length >= 3) {
      rules.push({ from: parts[0], to: parts[1], status: Number(parts[2]) });
    }
  }
  return rules;
}

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const candidates = [];
  if (clean === "/" || clean === "") {
    candidates.push(path.join(ROOT, "index.html"));
  } else {
    const noSlash = clean.replace(/\/$/, "");
    candidates.push(path.join(ROOT, noSlash));
    candidates.push(path.join(ROOT, noSlash + ".html"));
    candidates.push(path.join(ROOT, noSlash, "index.html"));
  }
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const redirects = loadRedirects();
const server = http.createServer((req, res) => {
  let urlPath = req.url || "/";
  for (const rule of redirects) {
    if (rule.from === "/*") continue;
    if (urlPath === rule.from || urlPath === rule.from + "/") {
      res.writeHead(rule.status, { Location: rule.to });
      res.end();
      return;
    }
  }
  const file = resolveFile(urlPath);
  if (file) {
    const ext = path.extname(file);
    const type =
      ext === ".html"
        ? "text/html; charset=utf-8"
        : ext === ".js"
          ? "text/javascript"
          : ext === ".css"
            ? "text/css"
            : ext === ".svg"
              ? "image/svg+xml"
              : ext === ".json" || ext === ".webmanifest"
                ? "application/json"
                : ext === ".xml"
                  ? "application/xml"
                  : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    fs.createReadStream(file).pipe(res);
    return;
  }
  const notFound = path.join(ROOT, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream(notFound).pipe(res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Netlify-status mock on http://127.0.0.1:${PORT}`);
});
