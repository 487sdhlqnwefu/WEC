# World Espresso Championship

Official WEC website — championship info, Panama 2026 registration surfaces, store, news, and Tiny Decisions tools.

## Publish on Netlify

1. Push this branch to GitHub
2. In [Netlify](https://app.netlify.com): **Add new site** → **Import an existing project** → select this repo
3. Deploy settings come from `netlify.toml` (`npm run build:client` → `dist/public`)
4. Open the deploy URL Netlify gives you

Full steps (custom domain, API, env vars): see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # TypeScript
npm test           # Vitest
npm run build:client   # Frontend only (what Netlify runs)
npm run build      # Frontend + API bundle (Railway / Node host)
```

Node **20.x** is required in production (`engines` / Netlify `NODE_VERSION`).

## Stack

- React + TypeScript + Vite + Tailwind
- tRPC + Hono API
- MySQL via Drizzle ORM
