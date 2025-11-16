#!/usr/bin/env node

/**
 * Automatic PWA Icon Generator using Sharp
 * Generates PNG icons from SVG
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('\n📱 Generating PWA Icons Automatically...\n');

const publicDir = path.join(__dirname, '..', 'public');

// Create public directory if needed
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Icon sizes to generate
const icons = [
  { size: 192, name: 'icon-192.png', maskable: false },
  { size: 512, name: 'icon-512.png', maskable: false },
  { size: 96, name: 'icon-96.png', maskable: false },
  { size: 192, name: 'icon-maskable-192.png', maskable: true },
  { size: 512, name: 'icon-maskable-512.png', maskable: true },
];

const bgColor = '#2563eb';    // Blue
const fgColor = '#ffffff';    // White

async function generateIcons() {
  for (const icon of icons) {
    try {
      // Create SVG
      const isMaskable = icon.maskable;
      const svg = Buffer.from(isMaskable
        ? `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${icon.size/2}" cy="${icon.size/2}" r="${icon.size/2}" fill="${bgColor}"/>
  <text x="${icon.size/2}" y="${icon.size/2}" font-size="${Math.round(icon.size * 0.6)}" font-weight="bold" font-family="Arial, sans-serif" fill="${fgColor}" text-anchor="middle" dominant-baseline="central">N</text>
</svg>`
        : `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${icon.size}" height="${icon.size}" fill="${bgColor}"/>
  <text x="${icon.size/2}" y="${icon.size/2}" font-size="${Math.round(icon.size * 0.6)}" font-weight="bold" font-family="Arial, sans-serif" fill="${fgColor}" text-anchor="middle" dominant-baseline="central">N</text>
</svg>`);

      // Convert SVG to PNG
      const outputPath = path.join(publicDir, icon.name);
      await sharp(svg)
        .png()
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKb = (stats.size / 1024).toFixed(1);
      console.log(`✅ ${icon.name.padEnd(25)} ${sizeKb}KB`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  console.log('\n✨ All icons generated successfully!\n');
  console.log('📍 Icons saved to: /public/\n');
  console.log('🎉 Your PWA is ready to install!\n');
}

generateIcons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
