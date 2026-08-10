# OCC / WEC Competition Software — AI Continuity Notes

**Internal only.** Last updated with Phase 0 + Phase 1 tournament MVP.

## Locked facts (founder confirmed)
- Panama date: **26 October 2026**
- Venue + roaster sponsor: **Café Unido**
- Public brand for this event: **WEC** (World Espresso Championship)
- Schema is **WBT-ready** (`family: sensory`, `drinkFormat: espresso`, `brand: wec`)
- Scoring: **v3** — Tactile 15 / Taste 10 / Flavour 8 × 3 judges = 99; **50+ wins**; no visual
- WLAT is deferred (stub later); do not invent WLAT rules in code yet

## Where things live
- Scoring constants: `contracts/scoring.ts`
- Bracket + scoring math: `contracts/tournamentMath.ts` (+ tests)
- Tables: `db/schema.ts` (`tournaments`, `tournament_competitors`, `tournament_judges`, `tournament_matches`, `tournament_ballots`)
- API: `api/tournament-router.ts` (mounted at `tournament.*`)
- Admin UI: Admin → Tournament tab (`TournamentAdminPanel`)
- Public live board: `/live/wec-2026-panama`

## Day-of admin flow
1. Initialize tournament (`ensurePanama2026`)
2. Seed competitors (demo 32 or real)
3. Generate bracket (31 matches)
4. Start match → blind cup assignment
5. Submit 3 complete ballots (reject incomplete)
6. Finalize → winner advances; loser eliminated
7. Void/reset available for day-of errors

## Brand
Official palette: Cinnamon `#994D27`, Sand `#DECCA7`, Olive `#3E3F24`, Gold `#C48D49`, Navy `#214966`. Typeface: Lexend. Logos in `/public/assets/logo-*.png`.
