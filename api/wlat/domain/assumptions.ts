import { LICENCE_AMOUNT_MINOR, PRODUCT_TYPE, RULES_VERSION } from "./constants";

export const WLAT_ASSUMPTIONS = {
  productType: PRODUCT_TYPE,
  rulesVersion: RULES_VERSION,
  licenceAmountMinor: LICENCE_AMOUNT_MINOR,
  stack:
    "Existing WEC Vite + React + Hono/tRPC + Drizzle/MySQL stack (not Next.js/Supabase). Domain rules live in api/wlat/domain.",
  realtime:
    "Authoritative timer and heat state are stored on the server. Clients poll / subscribe via tRPC; optional SSE at /api/wlat/stream. Browser intervals are never the source of truth.",
  storage:
    "S3-compatible object storage when configured; otherwise private local disk with signed download tokens. Originals stay private.",
  auth:
    "Authentication adapter supports Kimi OAuth (current WEC), email magic link, a local dev provider, and reserved WEC OIDC fields (identity_provider, external_subject, external_member_id, last_identity_sync_at).",
  authorization:
    "MySQL has no Postgres RLS. Event-scoped authorization is enforced in domain services on every mutation. Blind mappings are never returned on public or judge procedures.",
  voteSplitPublic: true,
  defaultPanelSize: 3,
  v1Stations: 1,
} as const;
