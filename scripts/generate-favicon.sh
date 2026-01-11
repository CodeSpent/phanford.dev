#!/bin/bash
set -e

# Script to download GitHub profile picture and generate favicons
# Usage: ./scripts/generate-favicon.sh
#
# Skips generation locally if favicons already exist. Always runs in CI.
# Force regeneration with: FORCE_FAVICON=1 npm run build:favicon

GITHUB_USERNAME="codespent"
PUBLIC_DIR="public"
PROFILE_URL="https://github.com/${GITHUB_USERNAME}.png"
PROFILE_IMG="${PUBLIC_DIR}/profile.png"

# Skip generation locally if favicons already exist (unless forced or in CI)
if [ -z "$CI" ] && [ -z "$FORCE_FAVICON" ] && [ -f "${PUBLIC_DIR}/favicon.ico" ] && [ -f "${PUBLIC_DIR}/apple-touch-icon.png" ]; then
  echo "✓ Favicons already exist. Skipping generation (use FORCE_FAVICON=1 to regenerate)"
  exit 0
fi

echo "🖼️  Downloading profile picture from GitHub..."
curl -L -o "${PROFILE_IMG}" "${PROFILE_URL}"

if [ ! -f "${PROFILE_IMG}" ]; then
  echo "❌ Failed to download profile picture"
  exit 1
fi

echo "✅ Profile picture downloaded successfully"

# Check if ImageMagick is available (prefer 'magick' over 'convert')
if command -v magick &> /dev/null; then
  CONVERT_CMD="magick"
elif command -v convert &> /dev/null; then
  CONVERT_CMD="convert"
else
  echo "❌ ImageMagick not found. Please install ImageMagick to generate favicons."
  exit 1
fi

echo "🎨 Generating circular favicon files..."

# Function to create circular crop at specific size
create_circular_favicon() {
  local size=$1
  local output=$2

  ${CONVERT_CMD} "${PROFILE_IMG}" -resize ${size}x${size} \
    \( +clone -threshold -1 -negate -fill white -draw "circle $((size/2)),$((size/2)) $((size/2)),0" \) \
    -alpha off -compose copy_opacity -composite \
    "${output}"
}

# Generate PNG favicons with circular crop
create_circular_favicon 16 "${PUBLIC_DIR}/favicon-16x16.png"
create_circular_favicon 32 "${PUBLIC_DIR}/favicon-32x32.png"
create_circular_favicon 180 "${PUBLIC_DIR}/apple-touch-icon.png"
create_circular_favicon 192 "${PUBLIC_DIR}/android-chrome-192x192.png"
create_circular_favicon 512 "${PUBLIC_DIR}/android-chrome-512x512.png"

# Generate multi-resolution ICO file with circular crops
create_circular_favicon 16 "${PUBLIC_DIR}/favicon-16.png"
create_circular_favicon 32 "${PUBLIC_DIR}/favicon-32.png"
create_circular_favicon 48 "${PUBLIC_DIR}/favicon-48.png"
${CONVERT_CMD} "${PUBLIC_DIR}/favicon-16.png" "${PUBLIC_DIR}/favicon-32.png" "${PUBLIC_DIR}/favicon-48.png" "${PUBLIC_DIR}/favicon.ico"

# Clean up temporary files
rm -f "${PUBLIC_DIR}/favicon-16.png" "${PUBLIC_DIR}/favicon-32.png" "${PUBLIC_DIR}/favicon-48.png"

echo "✅ Circular favicon files generated successfully:"
echo "   - favicon.ico (16x16, 32x32, 48x48 - circular)"
echo "   - favicon-16x16.png (circular)"
echo "   - favicon-32x32.png (circular)"
echo "   - apple-touch-icon.png (180x180 - circular)"
echo "   - android-chrome-192x192.png (circular)"
echo "   - android-chrome-512x512.png (circular)"
echo ""
echo "🎉 Done! Your circular favicon is ready to use."
