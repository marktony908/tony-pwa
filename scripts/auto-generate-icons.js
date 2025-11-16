#!/usr/bin/env node

/**
 * Automatic PWA Icon Generator
 * Creates PNG icons using canvas-based generation
 * No external dependencies needed beyond Node.js built-ins
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

console.log('📱 Generating PWA Icons Automatically...\n');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Icon configurations
const icons = [
  { size: 192, name: 'icon-192.png', maskable: false },
  { size: 512, name: 'icon-512.png', maskable: false },
  { size: 96, name: 'icon-96.png', maskable: false },
  { size: 192, name: 'icon-maskable-192.png', maskable: true },
  { size: 512, name: 'icon-maskable-512.png', maskable: true },
];

// Colors matching your theme
const bgColor = '#2563eb';    // Blue
const fgColor = '#ffffff';    // White

try {
  // Check if canvas is available
  let canvas;
  try {
    canvas = createCanvas(100, 100);
  } catch (e) {
    console.log('⚠️  Canvas module not available. Installing...\n');
    const { execSync } = require('child_process');
    try {
      execSync('npm install canvas', { stdio: 'inherit' });
      const { createCanvas: cc } = require('canvas');
      canvas = cc(100, 100);
    } catch (err) {
      console.log('❌ Canvas installation failed. Using SVG fallback instead.\n');
      generateSVGIcons();
      process.exit(0);
    }
  }

  generatePNGIcons();
} catch (error) {
  console.log('ℹ️  Canvas not available, generating SVG icons instead...\n');
  generateSVGIcons();
}

function generatePNGIcons() {
  console.log('🎨 Generating PNG Icons...\n');

  icons.forEach(icon => {
    try {
      const canvas = createCanvas(icon.size, icon.size);
      const ctx = canvas.getContext('2d');

      // Draw background
      ctx.fillStyle = bgColor;
      if (icon.maskable) {
        // Circle for maskable icons
        ctx.beginPath();
        ctx.arc(icon.size / 2, icon.size / 2, icon.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Square for standard icons
        ctx.fillRect(0, 0, icon.size, icon.size);
      }

      // Draw letter "N"
      ctx.fillStyle = fgColor;
      ctx.font = `bold ${Math.round(icon.size * 0.6)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', icon.size / 2, icon.size / 2);

      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      const filePath = path.join(publicDir, icon.name);
      fs.writeFileSync(filePath, buffer);

      const sizeKb = (buffer.length / 1024).toFixed(1);
      console.log(`✅ ${icon.name} (${sizeKb}KB)`);
    } catch (err) {
      console.log(`❌ Error creating ${icon.name}: ${err.message}`);
    }
  });

  console.log('\n✨ All PNG icons generated successfully!\n');
}

function generateSVGIcons() {
  console.log('🎨 Generating SVG Icons (fallback)...\n');

  icons.forEach(icon => {
    const isMaskable = icon.maskable;
    const svg = isMaskable
      ? `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${icon.size/2}" cy="${icon.size/2}" r="${icon.size/2}" fill="${bgColor}"/>
  <text x="${icon.size/2}" y="${icon.size/2}" font-size="${Math.round(icon.size * 0.6)}" font-weight="bold" font-family="Arial" fill="${fgColor}" text-anchor="middle" dominant-baseline="central">N</text>
</svg>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${icon.size}" height="${icon.size}" fill="${bgColor}"/>
  <text x="${icon.size/2}" y="${icon.size/2}" font-size="${Math.round(icon.size * 0.6)}" font-weight="bold" font-family="Arial" fill="${fgColor}" text-anchor="middle" dominant-baseline="central">N</text>
</svg>`;

    const filePath = path.join(publicDir, icon.name.replace('.png', '.svg'));
    fs.writeFileSync(filePath, svg);
    console.log(`✅ ${icon.name.replace('.png', '.svg')}`);
  });

  console.log('\n📝 SVG icons generated. Convert to PNG using:');
  console.log('   https://convertio.co/svg-png/ or similar tools\n');
}
