# ADR: Confidentiality and scoring

## Status

Accepted for Espresso Throwdown v1.

## Context

The product's value is blindness. If an organiser, judge, competitor, or public viewer can learn which coded cup belongs to which barista before the heat is finished, the event is compromised. Scoring must also be independent of the user interface so a future native app cannot invent a winner.

This repository uses MySQL, not Postgres, so PostgreSQL row-level security is unavailable. Authorization is enforced in the Throwdown engine and by omitting confidential columns from non-steward payloads.

## Decision

1. Cup-code mappings live in `cup_code_mappings`. Only `ThrowdownEngine.getStewardView` returns them, after `canViewCupMappings` succeeds.
2. Platform administrators do not receive mappings in the UI.
3. Judge ballot payloads contain event name, heat label, instructions, and two codes. They do not contain names, seeds, photos, or bracket sides.
4. Recipe rows are returned to the owning competitor, as completion flags to the organiser, and as full payloads to the public only after `event_publications.recipesReleasedAt` is set at formal completion.
5. Official WEC Scoring v3 and Simple Blind A/B are pure functions in `domain/throwdown/scoring.ts`. The engine writes the winner from those functions. Organisers cannot pick a winner.
6. Voiding a heat creates a new attempt. Historical ballots, mappings, and recipes stay on the voided attempt.
7. Premium entitlement changes only from a verified Stripe webhook, complimentary admin grant, or an explicit refund event. Checkout query parameters never unlock an event.
8. Audit rows record sensitive actions without cup codes.

## Consequences

- Engine tests in `api/throwdown/engine.test.ts` prove organiser/public/judge denial paths.
- A future Postgres/Supabase deployment can add RLS on top of the same table layout without changing the event model.
- Any new API that lists heats must reuse sanitised views rather than spreading table rows to the client.
