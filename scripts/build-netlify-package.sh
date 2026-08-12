#!/usr/bin/env bash
# Build Netlify drag-and-drop package from prerendered dist/public.
# Full package → /opt/cursor/artifacts (may exceed GitHub 100MB).
# Lite package → public/downloads for repo-sized distribution.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Building site (OG + vite + prerender)..."
npm run build:web

STAGE_FULL="/tmp/wec-netlify-full"
rm -rf "$STAGE_FULL"
mkdir -p "$STAGE_FULL"
cp -a dist/public/. "$STAGE_FULL/"
rm -rf "$STAGE_FULL/downloads"

JS=$(grep -oE 'assets/index-[^"]+\.js' "$STAGE_FULL/index.html" | head -1)
CSS=$(grep -oE 'assets/index-[^"]+\.css' "$STAGE_FULL/index.html" | head -1)
test -f "$STAGE_FULL/$JS"
test -f "$STAGE_FULL/$CSS"
test -f "$STAGE_FULL/404.html"
test -d "$STAGE_FULL/panama-2026"
test -d "$STAGE_FULL/assets/og"

ART="/opt/cursor/artifacts"
mkdir -p "$ART" "$ROOT/public/downloads"
(cd "$STAGE_FULL" && zip -rq "$ART/wec-netlify-FOR-MAC.zip" .)
cp "$ART/wec-netlify-FOR-MAC.zip" "$ART/wec-netlify-FOR-MAC-FULL.zip"

# Lite package for git (selected assets + all prerender HTML shells)
STAGE_LITE="/tmp/wec-netlify-lite"
rm -rf "$STAGE_LITE"
mkdir -p "$STAGE_LITE"
# Copy structure except heavy unused event photos
cp -a "$STAGE_FULL"/. "$STAGE_LITE/"
# Drop oversized unused event photos not referenced by key pages
find "$STAGE_LITE/assets" -maxdepth 1 -name 'event-*.jpg' ! -name 'event-2.jpg' \
  ! -name 'event-25.jpg' ! -name 'event-28.jpg' ! -name 'event-35.jpg' \
  ! -name 'event-36.jpg' ! -name 'event-37.jpg' -delete 2>/dev/null || true
[[ -f "$STAGE_LITE/assets/hero-team.jpg" ]] || true
(cd "$STAGE_LITE" && zip -rq "$ROOT/public/downloads/wec-netlify-FOR-MAC.zip" .)
(cd "$STAGE_LITE" && tar -czf "$ROOT/public/downloads/wec-netlify-FOR-MAC.tar.gz" .)

cat > "$ROOT/public/downloads/README.txt" << EOF
WEC Netlify package
===================

Full deploy (all photos + prerendered routes + true 404):
  Download from cloud agent Artifacts: wec-netlify-FOR-MAC.zip

This repo copy may be a lite subset under GitHub size limits.

Verified for this build:
  $JS
  $CSS
  404.html (HTTP 404 fallback via _redirects)
EOF

echo "Full artifact:"
ls -lh "$ART/wec-netlify-FOR-MAC.zip"
echo "Lite repo package:"
ls -lh "$ROOT/public/downloads/wec-netlify-FOR-MAC.zip"
echo "Verified: $JS + $CSS + prerender + 404.html"
