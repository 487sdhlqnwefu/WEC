import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://127.0.0.1:4173';
const OUT = '/opt/cursor/artifacts/screenshots';
const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 },
];
const routes = [
  { slug: 'home', path: '/' },
  { slug: 'panama', path: '/panama-2026' },
  { slug: 'judging', path: '/judging' },
  { slug: 'innovation', path: '/innovation' },
  { slug: 'live', path: '/live/wec-2026-panama' },
  { slug: 'dalla-corte', path: '/partners/dalla-corte-2022-2025' },
  { slug: 'privacy', path: '/privacy' },
  { slug: 'store', path: '/store' },
  { slug: 'rules', path: '/rules-and-integrity' },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  for (const route of routes) {
    const url = `${BASE}${route.path}`;
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(500);
    const file = path.join(OUT, `${route.slug}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const mainText = await page.locator('main').innerText().catch(() => '');
    results.push({
      route: route.path,
      viewport: vp.name,
      status: res?.status() ?? null,
      title: await page.title(),
      h1: h1?.trim() ?? null,
      mainEmpty: !mainText || mainText.trim().length < 20,
      file,
    });
  }
  await context.close();
}

// Internal link / status crawl at desktop
const crawlCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const crawl = await crawlCtx.newPage();
const toVisit = new Set([
  '/', '/panama-2026', '/judging', '/champions', '/innovation', '/about', '/news',
  '/news/cafe-unido-confirmed-wec-2026', '/partners/dalla-corte-2022-2025', '/faq',
  '/contact', '/privacy', '/terms', '/rules-and-integrity', '/history', '/vision',
  '/live/wec-2026-panama', '/store', '/truth', '/participate', '/login', '/does-not-exist-404',
]);
const crawlResults = [];
for (const p of toVisit) {
  const res = await crawl.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await crawl.waitForTimeout(300);
  const mainText = await crawl.locator('main').innerText().catch(() => '');
  crawlResults.push({
    path: p,
    http: res?.status() ?? null,
    title: await crawl.title(),
    finalUrl: crawl.url(),
    mainChars: mainText.trim().length,
  });
}
await crawlCtx.close();
await browser.close();

fs.writeFileSync('/opt/cursor/artifacts/qa-route-audit.json', JSON.stringify({ screenshots: results, crawl: crawlResults }, null, 2));
console.log(JSON.stringify({ screenshotCount: results.length, crawlCount: crawlResults.length }, null, 2));
console.log('Sample crawl:', crawlResults.filter(r => ['/store','/truth','/participate','/does-not-exist-404','/privacy'].includes(r.path)));
