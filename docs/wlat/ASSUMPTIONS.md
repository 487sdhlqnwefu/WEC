# Assumptions and future decisions

See also `api/wlat/domain/assumptions.ts`.

- Established WEC stack kept (Vite/tRPC/MySQL), not Next.js/Supabase.
- Official panel default: 3 judges. Vote-split counts may be public after finalisation; individual ballots never are.
- Open Member Judging default target 21, minimum 11, 15-minute window, preapproved voters.
- Timing presets differ for central shot service vs competitor-complete; organisers can edit.
- Pattern default: no repeats until the pool is exhausted; contributor identity hidden from judges.
- Local/demo uses the in-memory engine plus optional JSON/SQL schema. Production should run MySQL migrations in `db/wlat/migrations` and configure Stripe, S3, and Resend.
- `WLAT_ADMIN_EMAIL` (default `platform@wlat.demo`) is Platform Admin for the adapter session.
