# World Espresso Championship

This repository is the WEC website plus **Espresso Throwdown**, a separate café/roaster product mounted at `/throwdown`.

## Espresso Throwdown

See [docs/throwdown/README.md](docs/throwdown/README.md) for setup, Stripe, identity, and what is deferred.

```bash
npm install
npm test
npm run dev
```

Open http://localhost:3000/throwdown

## Stack

Vite, React, TypeScript, tRPC, Hono, Drizzle, MySQL, Stripe, Tailwind. Throwdown follows this stack rather than introducing Next.js or Supabase, so it can later connect to WEC identity and the championship site without a rewrite.

Official WEC logos in `public/assets/logo-*.png` are used without distortion. Throwdown-specific reference screenshots were not present as a `/reference-assets` folder; visual language follows the existing WEC dark espresso palette.
