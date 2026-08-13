# WEC authentication adapter

Stable internal member id: `members.id`.

```
identity_provider: kimi | magic_link | wec_oidc | dev
external_subject
external_member_id
last_identity_sync_at
```

Today:
- Kimi OAuth (existing WEC website) upserts a member from `unionId`.
- Magic link emails a signed token (Resend if configured; otherwise logged).
- Dev login when `NODE_ENV !== production` or `WLAT_DEV_AUTH=true`.

Future WEC SSO (not invented here):
1. WEC website authenticates the member.
2. WEC issues a short-lived OIDC authorization code or signed JWT with `sub` = WEC member id.
3. WLAT exchanges/verifies against WEC JWKS (`iss`, `aud` = WLAT).
4. Adapter maps `sub` → `external_subject`, sets `identity_provider=wec_oidc`, `external_member_id`, `last_identity_sync_at`.
5. Do not mint production WEC credentials in this repository.
