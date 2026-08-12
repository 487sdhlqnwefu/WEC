# Open Graph images

Route-specific 1200×630 cards live in `public/og/` and are referenced from `src/seo/routeMeta.ts`.

| File | Route(s) | Source photo |
|------|----------|--------------|
| `home.jpg` | `/`, store, news, contact, decisions, privacy, terms | `event-2.jpg` |
| `panama-2026.jpg` | `/panama-2026` | `event-8.jpg` |
| `how-it-works.jpg` | `/how-it-works`, `/about`, `/faq` | `event-29.jpg` |
| `champions.jpg` | `/champions`, `/history` | `event-28.jpg` |
| `innovation-lab.jpg` | `/innovation-lab`, `/vision` | `event-36.jpg` |
| `live.jpg` | `/live` | `event-31.jpg` |
| `dalla-corte.jpg` | `/thanks/dalla-corte` | `hero-team.jpg` |

Regenerate after photo changes:

```bash
npm run og:generate
```

Design rules: cover-crop (no stretch), face-safe focal points, official WEC logo + palette, concise thumbnail text, no credit watermarks on the card.

Photographer credits should be retained in on-site captions/metadata where licensing requires them. Source asset EXIF in this repo does not currently carry photographer bylines for automatic embedding.
