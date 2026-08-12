# WEC production hardening — implementation report

**Branch:** `cursor/wec-tournament-mvp-784e`  
**Date:** 12 August 2026  
**Site:** https://worldespressochampionship.com/

---

## 1. Summary by phase

### Phase A — baseline and facts
- Stack: Vite 7 + React Router SPA, Netlify static hosting, Netlify Forms for submissions, optional Express/tRPC API (not on production Netlify).
- Centralised mutable facts in `src/data/wecFacts.ts` (event, scoring, packages, eligibility, feature flags, Champion’s Product status, nav).
- Baseline: `npm test` 14/14 pass; `npm run build` succeeds; `tsc -b` only baseUrl deprecation noise; eslint has pre-existing hook/UI errors.

### Phase B — journeys and truth
- `/panama-2026#competitor-registration` — open registration via Netlify Form `wec-registration` (lean fields + rules/privacy consent + honeypot).
- `/panama-2026#sponsors` — public packages from `WEC_FACTS.sponsorship.packages` with approved prices; sponsor enquiry via `wec-sponsor`.
- Live board four states driven by `liveBoardState` (currently `pre_event`).
- Redirects: `/truth` → Café Unido news; `/participate` → registration hash; Privacy/Terms pages; Store gated (`storeEnabled: false`); Login noindex/admin-only; Vision/claims scrubbed of prohibited comparisons and travel copy.
- Production `code-path` stripped (inspectAttr dev-only).

### Phase C — permanent authority
- `/rules-and-integrity` with defined vs outstanding rules.
- `/partners/dalla-corte-2022-2025` thank-you page + History/footer links.
- News article routes; Champion’s Product module status-driven; Judging worked scoring example.

### Phase D — discoverability and accessibility
- Per-route `Seo` (title, description, canonical, OG/Twitter, robots, optional JSON-LD).
- `robots.txt`, `sitemap.xml`, favicon.svg, site.webmanifest.
- Skip link; accessible sponsor/register tabs on Panama; focus/scroll-margin for hash targets.
- Nested Link/Button repaired on Home hero CTAs and Vision CTAs.

### Phase E — visual/perf (partial)
- Hero preserved; Vision rewritten as WEC-positive; logo SVG favicon; package includes key assets.
- Full AVIF/WebP pipeline and tailored 1200×630 social cards not completed (blocker: no design assets pipeline in this pass).

### Phase F — proof
- Production build OK; Vitest 14 pass; Playwright viewport screenshots (4×6 core pages) + route crawl audit saved under `/opt/cursor/artifacts/`.
- Lighthouse not run in this environment (no CI Lighthouse harness); soft-404 HTTP status remains SPA limitation.

---

## 2. Exact files changed (primary)

New: `src/data/wecFacts.ts`, `src/components/Seo.tsx`, `src/components/ChampionsProductModule.tsx`, `src/pages/Privacy.tsx`, `Terms.tsx`, `RulesAndIntegrity.tsx`, `DallaCorteThanks.tsx`, `NewsArticle.tsx`, `StoreUnavailable.tsx`, `public/robots.txt`, `sitemap.xml`, `favicon.svg`, `site.webmanifest`, `scripts/wec-qa-screens.mjs`

Updated: `App.tsx`, Navbar/Footer/Layout/RegistrationTicker, Home, Panama2026, LiveTournament, Judging, Vision, Contact, History, FAQ, About, News, Login, NotFound, staticContent, vite.config, `_redirects`, `forms.html`, `index.html`, `build-netlify-package.sh`, and related pages.

---

## 3. Route / redirect map

| Path | Behaviour | Index |
|------|-----------|-------|
| `/` | Home | index |
| `/panama-2026` | Event + registration + sponsors | index |
| `/judging` | How it works + worked example | index |
| `/rules-and-integrity` | Canonical rules | index |
| `/champions`, `/history`, `/about`, `/vision`, `/innovation` | Content | index |
| `/news`, `/news/:slug` | Newest-first articles | index |
| `/partners/dalla-corte-2022-2025` | Thank-you | index |
| `/live/wec-2026-panama` | Pre-event (configurable) | index (fault → noindex) |
| `/faq`, `/contact`, `/privacy`, `/terms` | Secondary | index |
| `/store` | StoreUnavailable | **noindex** |
| `/login`, `/admin` | Admin | **noindex** / Disallow |
| `/truth` | Client + Netlify 301 → Café Unido news | — |
| `/participate` | Client navigate → `#competitor-registration`; Netlify 301 → `/panama-2026` | — |
| unknown | NotFound UI | noindex |
| HTTP 404 | **Not true** on Netlify SPA (`/* → index.html 200`) | soft-404 blocker |

---

## 4. Registration data flow

**UI** (`Panama2026` competitor panel) → validate consent → **`submitNetlifyForm("wec-registration")`** POST `/` with `form-name` → **Netlify Forms** storage → email notification if configured for `tristan@worldespressochampionship.com`.

Success only after Netlify accepts the POST. Honeypot `bot-field`. No passport/travel fields.

**Safe test:** Requires Tristan to submit a labelled test on the **deployed** Netlify site (Forms only work on Netlify production/deploy preview, not local preview). Local preview cannot prove Forms delivery.

---

## 5. Sponsor packages / prices

Source: `WEC_FACTS.sponsorship.packages`  
Confirmed unchanged approved prices: **€150,000+ / €70,000+ / €15,000+ / €5,000+** (Presenting / Official / Supporting / Community).

---

## 6. Metadata / structured data

- Home: Organization JSON-LD via Seo  
- Panama: Event JSON-LD + registration URL  
- News articles: NewsArticle JSON-LD  
- BreadcrumbList: not yet on all non-home pages (partial gap)  
- No Product/Offer while Store disabled  

---

## 7. Claims removed / qualified

| Removed / old | Replacement |
|---------------|-------------|
| “no bias possible” | biasNote from wecFacts |
| ISO 5495-compliant / “is ISO 5495” | methodologyNote (informed by / principles) |
| Legacy org attack lists / same winners / trophy+photo / survival | WEC-positive Vision commitments |
| Manufacturer home territory / turning point / outgrown | Neutral Dalla Corte history language |
| Champion’s Product guarantees / career/revenue promises | Conditional ambition module |
| Contact gatekeeper / 2-business-day SLA | Founder-direct blurb; no response-time promise |
| Register interest | Register → `#competitor-registration` |
| Competitor travel FAQ | Removed / not present in FAQ |

---

## 8. Accessibility repairs

Skip link; hash focus + `scroll-mt-36`; Panama tabs with roles; form labels/consent; Store unavailable page; Login accessible name “Continue”; icon links named in footer; nested interactive controls fixed on Home hero + Vision.

Remaining: full axe suite / keyboard matrix not fully automated beyond crawl; eslint still flags setState-in-effect on hash routing.

---

## 9. Performance / image

Favicon SVG; build package verifies JS+CSS hash pairing; large JS chunk (~743 kB) remains. LCP preload / AVIF derivatives / 48×48 PNG→SVG for navbar logo not fully completed (navbar still uses PNG).

---

## 10. Commands and results

| Command | Result |
|---------|--------|
| `npm test` | **14 passed** |
| `npm run check` | baseUrl deprecation only (TS5101) |
| `npm run build` | **success** |
| `npm run lint` | **17 errors** (mostly pre-existing UI hooks + Panama hash setState) |
| `bash scripts/build-netlify-package.sh` | **OK** → `public/downloads/wec-netlify-FOR-MAC.{tar.gz,zip}` |
| Playwright QA | 36 screenshots; crawl JSON at `/opt/cursor/artifacts/qa-route-audit.json` |
| Lighthouse | **Not run** |

---

## 11. Screenshots

Under `/opt/cursor/artifacts/screenshots/`:  
`{home,panama,judging,innovation,live,dalla-corte}-{1440x900,1024x768,390x844,360x800}.png`

---

## 12. Lighthouse

Before/after Lighthouse: **not available** in this agent run. Recommend Tristan run Lighthouse on the Netlify deploy after uploading the FOR-MAC package.

---

## 13. Blockers requiring Tristan’s input

1. **True HTTP 404 / soft-404** — Netlify SPA always returns 200 for unknown paths.  
   **Question:** May we add a Netlify Edge Function or `_redirects` exception pattern that returns HTTP 404 for unknown URLs while keeping client routing for known paths?  
   **Affects:** `public/_redirects` (`/* /index.html 200`), `NotFound`.

2. **SSR/prerender for SEO without JS** — titles/H1s are client-injected via `Seo` `useEffect`.  
   **Question:** Approve adding Vite SSG/prerender for public marketing routes (no architecture rewrite beyond prerender), or keep SPA until after Panama marketing push?  
   **Affects:** crawlability acceptance criteria.

3. **Netlify Forms notification confirmation** —  
   **Question:** Confirm Netlify Forms notifications for `wec-registration`, `wec-sponsor`, and `wec-contact` are delivered to `tristan@worldespressochampionship.com` on production.  
   **Affects:** registration/sponsor/contact success path.

4. **Legal placeholders** — Privacy/Terms use founder email as controller contact; no registered business address or retention period in days.  
   **Question:** What legal entity name and postal address should appear as controller on `/privacy` and `/terms`?  
   **Affects:** `Privacy.tsx`, `Terms.tsx`.

5. **GPTBot policy** — currently `Disallow: /` for GPTBot; OAI-SearchBot allowed.  
   **Question:** Keep GPTBot blocked, or allow it for model training discovery?  
   **Affects:** `public/robots.txt`.

6. **Social card images** — tailored 1200×630 assets not generated.  
   **Question:** Provide approved photography crops for Home, Panama, Judging, Innovation, Champions, Dalla Corte, Live, or authorise generating from existing event photos?  
   **Affects:** Open Graph images in `Seo` defaults.
