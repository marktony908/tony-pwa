#!/bin/bash

# Generate placeholder app icons using ImageMagick
# Make sure you have ImageMagick installed: apt-get install imagemagick

echo "Generating placeholder PWA icons..."

# Colors for the app (blue theme)
BACKGROUND="#2563eb"
FOREGROUND="#ffffff"

# Create 192x192 icon
convert -size 192x192 xc:"$BACKGROUND" \
  -gravity center \
  -pointsize 80 \
  -fill "$FOREGROUND" \
  -font Arial-Bold \
  -annotate +0+0 "N" \
  ./public/icon-192.png

echo "✓ Created icon-192.png"

# Create 512x512 icon
convert -size 512x512 xc:"$BACKGROUND" \
  -gravity center \
  -pointsize 200 \
  -fill "$FOREGROUND" \
  -font Arial-Bold \
  -annotate +0+0 "N" \
  ./public/icon-512.png

echo "✓ Created icon-512.png"

# Create 96x96 icon
convert -size 96x96 xc:"$BACKGROUND" \
  -gravity center \
  -pointsize 40 \
  -fill "$FOREGROUND" \
  -font Arial-Bold \
  -annotate +0+0 "N" \
  ./public/icon-96.png

echo "✓ Created icon-96.png"

# Create maskable icons (with padding for adaptive icons)
convert -size 192x192 xc:transparent \
  -fill "$BACKGROUND" \
  -draw "circle 96,96 60,96" \
  -gravity center \
  -pointsize 60 \
  -fill "$FOREGROUND" \
  -font Arial-Bold \
  -annotate +0+0 "N" \
  ./public/icon-maskable-192.png

echo "✓ Created icon-maskable-192.png"

convert -size 512x512 xc:transparent \
  -fill "$BACKGROUND" \
  -draw "circle 256,256 156,256" \
  -gravity center \
  -pointsize 160 \
  -fill "$FOREGROUND" \
  -font Arial-Bold \
  -annotate +0+0 "N" \
  ./public/icon-maskable-512.png

echo "✓ Created icon-maskable-512.png"

echo ""
echo "All icons generated successfully! 🎉"
echo "Icons created in ./public/"
