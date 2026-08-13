# World Latte Art Throwdown — Implementation Checklist

Product: **World Latte Art Throwdown** (WLAT). Sibling of the World Espresso Championship site.
Stack (repository convention): Vite + React + TypeScript, Hono + tRPC, Drizzle/MySQL, Stripe, Kimi auth adapter, shadcn/ui, Vitest, Playwright.

## Phase 1 — Foundation
- [x] Repository inspection; reuse WEC auth, Stripe, design tokens; keep WLAT domain separate
- [x] Domain types, constants, state machines, invariants
- [x] Members + auth adapter (Kimi + magic link + reserved WEC SSO fields)
- [x] Event creation, roles, invitations
- [x] Payments (USD 300, webhook-authoritative, idempotent)
- [x] Audit log (append-only)
- [x] Schema / migrations / RLS-equivalent service authorization

## Phase 2 — Setup and bracket
- [x] Organiser wizard (11 steps, resumable)
- [x] Roster, invitations, conflicts, check-in
- [x] Pattern pool
- [x] Bracket generation, byes (8–128), lock, sequential schedule
- [x] One-station domain enforcement

## Phase 3 — Live heat
- [x] Heat state machine
- [x] Server-authoritative timer
- [x] Blind mapping + Blind Steward console
- [x] Competitor and staff live screens
- [x] Photography upload and processing

## Phase 4 — Judging and result
- [x] Official panel ballots
- [x] Feedback quality flags and privacy
- [x] Open Member Judging + three-judge tiebreak
- [x] Transactional result finalisation + bracket advance
- [x] Restart and incident workflows

## Phase 5 — Public and archive
- [x] Public event + large-screen board
- [x] Champion and completed gallery
- [x] Permanent member latte art archive
- [x] Private post-event feedback

## Phase 6 — Hardening
- [x] Unit tests for critical domain
- [x] Integration-style repository tests
- [x] Playwright critical flows
- [x] Documentation and live-event runbook
- [x] Accessibility and responsive polish
