# Legal identity (production deploy blocker)

Privacy Policy and Terms of Service read from one object:

`src/config/legalIdentity.ts`

Until every required field is filled, **Netlify production deploys fail** (`scripts/assert-legal-ready.mjs`). Deploy previews may build with `WEC_ALLOW_INCOMPLETE_LEGAL=1`. Published legal pages stay on a holding state with **no fake address and no TODO placeholders**.

## Fields Tristan must supply

| Field | Config key | Notes |
|-------|------------|--------|
| Legal controller / entity name | `controllerName` | Registered company or trading entity name |
| Registration applicable? | `registrationApplicable` | `true` or `false` (not `null`) |
| Registration / company number | `registrationNumber` | Required only when `registrationApplicable` is `true` |
| Country of establishment | `countryOfEstablishment` | e.g. `Australia` |
| Official business / service address | `businessAddress` | **Not** a residential address unless Tristan expressly authorises it |
| Privacy contact email | `privacyEmail` | Dedicated inbox for privacy requests |

## After details are confirmed

1. Edit `src/config/legalIdentity.ts` with the real values.
2. Remove `WEC_ALLOW_INCOMPLETE_LEGAL` from preview contexts if desired.
3. Redeploy — production assert should pass and Privacy/Terms will render full controller copy.
