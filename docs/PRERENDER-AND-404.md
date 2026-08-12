# Prerender + true HTTP 404

## Build
`npm run build:web` runs:
1. `scripts/generate-og-images.py` — 1200×630 OG cards
2. `vite build`
3. `scripts/prerender.mjs` — static HTML shells for public routes + `404.html`

## Netlify
`public/_redirects` ends with `/* /404.html 404` (no SPA soft-404).
Known routes are physical `path/index.html` files.

## Crawler policy
- Allow normal crawlers + OAI-SearchBot
- Disallow GPTBot (model-training kept separate)

## Legal identity
`src/data/legalIdentity.ts` — community project statement; formal entity fields null until adopted.
