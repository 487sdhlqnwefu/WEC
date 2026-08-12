#!/usr/bin/env bash
# Deploy the static site to Netlify production.
# Requires secrets (do NOT commit tokens):
#   NETLIFY_AUTH_TOKEN  — Personal access token from Netlify
#   NETLIFY_SITE_ID     — Project ID from Project configuration → General
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "Missing NETLIFY_AUTH_TOKEN"
  echo "Create one: Netlify → User settings → Applications → Personal access tokens"
  exit 1
fi

if [[ -z "${NETLIFY_SITE_ID:-}" ]]; then
  echo "Missing NETLIFY_SITE_ID"
  echo "Find it: Netlify → Project configuration → General → Project information → Project ID"
  exit 1
fi

echo "Building static client..."
npx vite build

echo "Deploying to Netlify site $NETLIFY_SITE_ID ..."
npx --yes netlify-cli deploy \
  --auth "$NETLIFY_AUTH_TOKEN" \
  --site "$NETLIFY_SITE_ID" \
  --dir dist/public \
  --prod \
  --message "WEC site update from Cursor agent"

echo "Done."
