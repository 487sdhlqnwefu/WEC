# Netlify Forms — one-time setup

Registration, sponsor, contact, and organiser forms submit to **Netlify Forms** (not the API). After you deploy, do this once:

1. Open **Netlify** → your WEC site → **Forms**
2. You should see: `wec-registration`, `wec-sponsor`, `wec-contact`, `wec-organiser`
3. Click **Form notifications** → **Add notification** → **Email notification**
4. Send to: `tristan@worldespressochampionship.com`
5. Repeat for each form (or use one notification rule for all)

Submissions also appear in the Netlify Forms dashboard even before email is configured.

**Fallback:** Every form page shows `tristan@worldespressochampionship.com` if submission fails.
