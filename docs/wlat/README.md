# World Latte Art Throwdown

Sibling product of the World Espresso Championship site. Organisers pay **USD 300** once to run a blind, head-to-head latte art tournament for 8–128 entries on a single station.

Entry point: `/throwdown`

## Stack (repository convention)

This repo is Vite + React + Hono/tRPC + Drizzle/MySQL + Stripe + Kimi auth, not Next.js/Supabase. WLAT is a distinct domain module (`api/wlat`, `src/pages/wlat`) and does **not** reuse espresso sensory scoring.

| Concern | v1 implementation |
| --- | --- |
| Auth | Adapter: Kimi OAuth, email magic link, local/dev sign-in. Reserved WEC OIDC fields on members. |
| Data | Authoritative in-memory store for local/demo; relational MySQL schema in `db/wlat/migrations`. |
| Realtime | Server timestamps + 1s polling / SSE `/api/wlat/stream`. Browser intervals are never the source of truth. |
| Storage | S3-ready keys; local disk / memory blobs when S3 is unset. |
| Payments | Stripe Checkout USD 300. Webhook is authoritative. Mock checkout when Stripe keys are absent. |
| Authorization | Event-scoped checks in domain services (MySQL has no Postgres RLS). |

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000/throwdown

Seed three demo events from the dashboard (**Load demo events**) or:

```bash
npx tsx -e "import { seedWlatDemos } from './api/wlat/seed.ts'; seedWlatDemos(true).then(console.log)"
```

Demo sign-in (non-production): `/throwdown/login` → Local / demo sign-in.

| Email | Role |
| --- | --- |
| demo-a-organiser@wlat.demo | Demo A organiser |
| demo-a-steward@wlat.demo | Blind Steward |
| demo-a-judge-0@wlat.demo | Judge |
| platform@wlat.demo | Platform Admin |

## Tests

```bash
npm test                 # Vitest domain + engine
npx playwright test      # Critical public/operator routes
npm run check            # Typecheck
npm run lint
```

## Documentation

- `docs/wlat/CHECKLIST.md` — implementation checklist
- `docs/wlat/STATE-MACHINES.md`
- `docs/wlat/ROLES.md`
- `docs/wlat/BLIND-THREAT-MODEL.md`
- `docs/wlat/PHOTO-LIFECYCLE.md`
- `docs/wlat/STRIPE.md`
- `docs/wlat/WEC-AUTH-ADAPTER.md`
- `docs/wlat/RUNBOOK.md`
- `docs/wlat/MULTI-STATION-V2.md`
- `docs/wlat/ASSUMPTIONS.md`
