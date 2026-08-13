# Espresso Throwdown

Espresso Throwdown is a WEC product for cafés and roasters. It lives at `/throwdown` on this website so the championship site can link to it without a rewrite.

> Find the recipe your coffee prefers.
> Two espressos. Blind cups. Independent judges.

This repository already had a production WEC stack (Vite, React, TypeScript, tRPC, Hono, Drizzle, MySQL, Stripe, Tailwind). Throwdown uses that stack instead of introducing Next.js or Supabase.

## What is implemented

- Free Espresso Throwdown for 2–4 competitors
- Premium Espresso Tournament for 8–64 competitors, USD 300 once per event
- Official WEC Scoring v3 and Simple Blind A/B
- Member profiles with email one-time codes (no passwords)
- Invitations, Cup Steward mappings, immutable ballots, recipe gating
- Public live board, organiser desk, audit log, administrator complimentary licences
- Stripe Checkout + verified webhook entitlement
- Domain tests for scoring, brackets, payments, privacy, and a full 4-person engine flow

## What needs external credentials

- `DATABASE_URL` — MySQL
- `APP_SECRET` — session signing
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` — premium licences
- `RESEND_API_KEY` — email delivery for OTP and invites (otherwise logged to the console)
- `THROWDOWN_PUBLIC_URL` — public origin, e.g. `https://worldespressochampionship.com/throwdown`

## Intentionally deferred

- Latte Art Throwdown
- Native WEC SSO (adapter boundary is in `api/throwdown/identity-adapter.ts`)
- WEC championship tournament integration
- Subscriptions
- Multi-language UI (copy is localisation-ready)
- Native mobile applications

## Local setup

```bash
cp .env.example .env
# set DATABASE_URL, APP_SECRET, optional Stripe/Resend
npm install
npx drizzle-kit push
npx tsx db/throwdown-seed.ts
THROWDOWN_DEV_LOGIN=true npm run dev
```

Open http://localhost:3000/throwdown

In development, request a one-time code then enter `000000` when `THROWDOWN_DEV_LOGIN=true`. Never set that flag in production.

Demo members are fictional (`@demo.throwdown.test`).

## Stripe test mode

1. Use `sk_test_...` and a test webhook endpoint pointing at `/api/stripe/throwdown-webhook`
2. Create a Premium Tournament draft, pay with Stripe test card `4242 4242 4242 4242`
3. The organiser desk stays locked until the webhook marks the licence `paid`
4. Returning from Checkout without a webhook does **not** unlock the event

## Website linking

Set `THROWDOWN_PUBLIC_URL` to the public Throwdown origin.

Recommended:

- `https://worldespressochampionship.com/throwdown` (this app already serves that path)
- or `https://throwdown.worldespressochampionship.com` with the same app and a reverse proxy

The championship homepage already links to `/throwdown`.

## Tests

```bash
npm test
```

Critical privacy, scoring, bracket, and payment rules are covered in `domain/throwdown/*.test.ts` and `api/throwdown/engine.test.ts`.

## Docs

- `docs/throwdown/OPERATOR.md` — running a live event
- `docs/throwdown/ADR-confidentiality-scoring.md` — why mappings and scoring are server-side
- `docs/throwdown/WEC-INTEGRATION.md` — future SSO and platform linking
