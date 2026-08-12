# Deploy to Netlify from Cursor (skip the Mac zip)

Yes — you can give the agent direct Netlify access. That is the most reliable path.

## One-time setup (2 minutes)

1. **Create a personal access token**
   - Netlify → avatar → **User settings** → **Applications** → **Personal access tokens** → **New access token**
   - Name it e.g. `cursor-wec-deploy`
   - Copy the token (shown once)

2. **Copy your Project ID**
   - Open your WEC site in Netlify
   - **Project configuration** → **General** → **Project information**
   - Copy **Project ID** (also called Site ID)

3. **Add both as Cursor Cloud Agent secrets** for this environment
   - `NETLIFY_AUTH_TOKEN` = the token
   - `NETLIFY_SITE_ID` = the Project ID
   - Do **not** paste the token into chat or commit it to git

4. Tell the agent: **“secrets are set — deploy to Netlify”**

The agent will run:

```bash
bash scripts/deploy-netlify.sh
```

That builds the site and pushes production with the Netlify CLI.

## If you still want a manual Mac upload

Prefer **`wec-netlify-FOR-MAC.tar.gz`** (double-click in Finder) over `.zip` if Archive Utility fails.

Or download from GitHub (more reliable than some artifact links):

`https://github.com/487sdhlqnwefu/WEC/raw/cursor/wec-tournament-mvp-784e/public/downloads/wec-netlify-FOR-MAC.tar.gz`

Check the downloaded file size is about **1.4 MB**. If it is ~700 KB, the download was cut off — delete and try again.
