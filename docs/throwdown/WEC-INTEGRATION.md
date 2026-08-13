# Future WEC integration

## Website linking

Throwdown is mounted at `/throwdown`. Production can use:

- `https://worldespressochampionship.com/throwdown`
- `https://throwdown.worldespressochampionship.com` (same app, different host)

Set `THROWDOWN_PUBLIC_URL` to the public origin used in invites, Stripe redirects, and QR codes.

## Member identity

`profiles` already has:

- `externalIdentityProvider`
- `externalSubjectId`
- `kimiUnionId`

Implement `IdentityAdapter` in `api/throwdown/identity-adapter.ts` for WEC OIDC. When a championship account is linked, update those fields on the existing profile. Keep `profiles.id` stable so event history, ballots, and recipes remain attached.

Local one-time codes can remain as a fallback for cafés that are not championship members.

## Championship tournament software

Throwdown events are stored in `throwdown_*` tables, separate from the marketing `events` table. A later championship integration should treat Throwdown as a bounded context and sync through explicit APIs, not by writing into heat mapping tables from the championship controller.
