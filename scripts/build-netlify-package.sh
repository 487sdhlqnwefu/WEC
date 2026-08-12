#!/usr/bin/env bash
# Build a complete Netlify drag-and-drop package (~2 MB lite).
# Verifies index.html JS/CSS hashes exist in the output — prevents white-screen deploys.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Building site..."
npx vite build

STAGE="/tmp/wec-netlify-deploy"
rm -rf "$STAGE"
mkdir -p "$STAGE/assets"

cp dist/public/index.html dist/public/forms.html dist/public/_redirects "$STAGE/"
# Crawler / PWA assets (optional if missing during partial builds)
for f in robots.txt sitemap.xml favicon.svg site.webmanifest; do
  [[ -f "dist/public/$f" ]] && cp "dist/public/$f" "$STAGE/"
done

cp dist/public/assets/index-*.js dist/public/assets/index-*.css "$STAGE/assets/"
cp dist/public/assets/logo-*.png "$STAGE/assets/"
cp dist/public/assets/founder-tristan.jpg "$STAGE/assets/"
cp -r dist/public/assets/champions "$STAGE/assets/"
cp -r dist/public/assets/marketing "$STAGE/assets/"

for img in event-2 event-25 event-28 event-35 event-36 event-37 hero-team; do
  lite="/tmp/wec-mac-deploy/assets/${img}.jpg"
  if [[ -f "$lite" ]]; then
    cp "$lite" "$STAGE/assets/${img}.jpg"
  elif [[ -f "dist/public/assets/${img}.jpg" ]]; then
    cp "dist/public/assets/${img}.jpg" "$STAGE/assets/"
    ffmpeg -y -loglevel error -i "$STAGE/assets/${img}.jpg" \
      -vf "scale='min(1920,iw)':-2" -q:v 4 \
      "$STAGE/assets/${img}-compressed.jpg" \
      && mv "$STAGE/assets/${img}-compressed.jpg" "$STAGE/assets/${img}.jpg"
  fi
done

JS=$(grep -oE 'assets/index-[^"]+\.js' "$STAGE/index.html" | head -1)
CSS=$(grep -oE 'assets/index-[^"]+\.css' "$STAGE/index.html" | head -1)

if [[ ! -f "$STAGE/$JS" ]]; then
  echo "ERROR: index.html references missing $JS"
  exit 1
fi
if [[ ! -f "$STAGE/$CSS" ]]; then
  echo "ERROR: index.html references missing $CSS"
  exit 1
fi

mkdir -p "$ROOT/public/downloads" /opt/cursor/artifacts
(
  cd "$STAGE"
  tar -czf "$ROOT/public/downloads/wec-netlify-FOR-MAC.tar.gz" .
  zip -rq "$ROOT/public/downloads/wec-netlify-FOR-MAC.zip" .
)

cp "$ROOT/public/downloads/wec-netlify-FOR-MAC.tar.gz" /opt/cursor/artifacts/
cp "$ROOT/public/downloads/wec-netlify-FOR-MAC.zip" /opt/cursor/artifacts/

echo "Deploy package ready:"
ls -lh "$ROOT/public/downloads/wec-netlify-FOR-MAC.tar.gz" "$ROOT/public/downloads/wec-netlify-FOR-MAC.zip"
echo "Verified: $JS + $CSS"
