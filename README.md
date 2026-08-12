# World Espresso Championship

Official WEC website — championship info, Panama 2026 registration surfaces, store, news, and Tiny Decisions tools.

## Publish on Netlify

1. Push this branch to GitHub
2. In [Netlify](https://app.netlify.com): **Add new site** → **Import an existing project** → select this repo
3. Deploy settings come from `netlify.toml` (`npm run build:netlify` → `dist/public`)
4. Public routes are statically prerendered (true HTTP 200). Unknown paths use `404.html` (true HTTP 404).
5. **Production deploy is blocked** until legal controller fields in `src/config/legalIdentity.ts` are filled — see [docs/LEGAL_IDENTITY.md](./docs/LEGAL_IDENTITY.md).

Full steps (custom domain, API, env vars): see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

Crawler policy (GPTBot blocked, OAI-SearchBot allowed): [docs/CRAWLER_POLICY.md](./docs/CRAWLER_POLICY.md).

## Local development

```bash
npm install
npm run dev             # http://localhost:3000
npm run check           # TypeScript
npm test                # Vitest
npm run build:client    # Vite + prerender public routes
npm run verify:status   # curl-style 200/404 checks against dist/
npm run build           # Frontend + API bundle (Railway / Node host)
```

Node **20.x** is required in production (`engines` / Netlify `NODE_VERSION`).

## Stack

- React + TypeScript + Vite + Tailwind
- tRPC + Hono API
- MySQL via Drizzle ORM
