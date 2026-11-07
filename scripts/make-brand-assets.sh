#!/usr/bin/env bash
# Regenerate the social card and app icons from the site identity.
#
# Requires ImageMagick with fontconfig, and the three fonts installed from
# src/app/fonts (see the README). Outputs:
#   public/opengraph-image.png   1200x630 social card
#   public/apple-icon.png        512x512 touch icon
#
# Usage: bash scripts/make-brand-assets.sh

set -euo pipefail
cd "$(dirname "$0")/.."

W=1200
H=630
INK="#08090c"
BONE="#f4f4f5"
ASH="#a1a1aa"
FOG="#71717a"
ACCENT="#668cff"
LIME="#c6f36a"

NAME="${SITE_NAME:-RIHA BEGUM}"
ROLE="${SITE_ROLE:-FULL-STACK DEVELOPER}"
MONOGRAM="${SITE_MONOGRAM:-RB}"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# --- soft accent bloom, oversized then blurred so no edge shows ---
convert -size 1600x1000 xc:black -fill white -draw "circle 1150,140 1150,560" -blur 0x190 "$work/mask.png"
convert -size 1600x1000 xc:"$ACCENT" "$work/accent.png"
convert "$work/accent.png" "$work/mask.png" -alpha off -compose CopyOpacity -composite \
  -gravity center -crop ${W}x${H}+0+0 +repage "$work/glow.png"

# --- base + grid ---
convert -size ${W}x${H} gradient:'#0c0e13-#08090c' "$work/base.png"
GRID=""
for x in $(seq 0 60 $W); do GRID="$GRID line $x,0 $x,$H"; done
for y in $(seq 0 60 $H); do GRID="$GRID line 0,$y $W,$y"; done
convert "$work/base.png" -stroke 'rgba(255,255,255,0.05)' -strokewidth 1 -fill none -draw "$GRID" "$work/grid.png"
convert "$work/grid.png" \( "$work/glow.png" -channel A -evaluate multiply 0.40 +channel \) \
  -compose screen -composite "$work/bg.png"

# --- card ---
convert "$work/bg.png" -stroke 'rgba(255,255,255,0.2)' -strokewidth 1 -fill none \
  -draw "line 40,76 40,40 line 40,40 76,40" \
  -draw "line 1124,40 1160,40 line 1160,40 1160,76" \
  -draw "line 1160,554 1160,590 line 1160,590 1124,590" \
  -draw "line 76,590 40,590 line 40,590 40,554" \
  -font JetBrains-Mono -pointsize 15 -fill "$ASH" -annotate +72+86 'PORTFOLIO / 2026' \
  -fill "$ACCENT" -annotate +1078+86 'OPEN TO WORK' \
  -fill "$LIME" -draw "circle 1042,80 1046,80" \
  -fill 'rgba(255,255,255,0.13)' -draw "rectangle 72,108 1128,109" \
  -font Space-Grotesk-Light -pointsize 70 -fill "$BONE" -annotate +68+246 "$NAME" \
  -font Space-Grotesk-Light -kerning -3 -pointsize 92 -fill "$BONE" -annotate +66+348 'BUILDING BEYOND' \
  -font Space-Grotesk-Light -kerning -3 -pointsize 92 -fill none -stroke '#8ba8ff' -strokewidth 1.5 \
  -annotate +66+436 'THE ORDINARY.' \
  -stroke none -fill 'rgba(255,255,255,0.13)' -draw "rectangle 72,486 1128,487" \
  -font JetBrains-Mono -pointsize 16 -fill "$BONE" -annotate +72+530 "$ROLE" \
  -font JetBrains-Mono -pointsize 16 -fill "$FOG" -annotate +334+530 '/' \
  -font JetBrains-Mono -pointsize 16 -fill "$ASH" -annotate +356+530 'DESIGN × ENGINEERING' \
  -font JetBrains-Mono -pointsize 13 -fill "$FOG" -annotate +822+530 'REACT / NEXT.JS / POSTGRES' \
  -fill "$ACCENT" -draw "rectangle 72,548 128,551" \
  -fill 'rgba(255,255,255,0.1)' -draw "rectangle 140,549 1128,550" \
  -depth 8 -strip -define png:compression-level=9 public/opengraph-image.png

# --- touch icon ---
convert -size 512x512 xc:"$INK" -fill '#12151a' -draw "roundrectangle 0,0 511,511 96,96" "$work/ico.png"
convert "$work/ico.png" -fill "$ACCENT" -draw "circle 460,10 460,240" -blur 0x70 "$work/icoglow.png"
convert "$work/ico.png" "$work/icoglow.png" -compose screen -composite \
  -stroke '#ffffff' -strokewidth 6 -fill none -draw "rectangle 56,120 456,392" \
  -stroke none -fill 'rgba(255,255,255,0.06)' -draw "rectangle 56,120 112,392" \
  -font Space-Grotesk-Light -pointsize 150 -fill "$BONE" -annotate +118+300 "$MONOGRAM" \
  -fill "$ACCENT" -draw "rectangle 392,120 456,140" \
  -fill "$ACCENT" -draw "rectangle 56,392 206,400" \
  -depth 8 -strip public/apple-icon.png

echo "✓ public/opengraph-image.png"
echo "✓ public/apple-icon.png"
