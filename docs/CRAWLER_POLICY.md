# Crawler policy

Policies are kept separate so search discovery and model-training access can change independently.

| Crawler | Policy | Intent |
|---------|--------|--------|
| `*` (default) | Allow | Normal web discovery |
| `Googlebot`, `Bingbot`, `DuckDuckBot` | Allow | Classic search indexing |
| `OAI-SearchBot` | Allow | Discoverable / citable in AI-assisted search |
| `GPTBot` | **Disallow** | Block model-training crawl access for now |

Source of truth for bots: [`public/robots.txt`](../public/robots.txt).

## Changing later

1. Edit `public/robots.txt` (and this table).
2. Redeploy the Netlify frontend.
3. Note the change date in the PR / release notes.

Do not conflate `OAI-SearchBot` with `GPTBot` — they serve different purposes.
