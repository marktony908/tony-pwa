#!/usr/bin/env node

/**
 * Simple icon generator using SVG-to-PNG conversion
 * Install required packages: npm install sharp
 * 
 * Usage: node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

console.log('📱 PWA Icon Generator\n');
console.log('Note: To generate actual PNG icons, you need to install sharp:');
console.log('  npm install sharp\n');

// Define icon sizes and their properties
const icons = [
  {
    size: 192,
    filename: 'icon-192.png',
    maskable: false,
    description: 'Standard icon 192x192'
  },
  {
    size: 512,
    filename: 'icon-512.png',
    maskable: false,
    description: 'Standard icon 512x512'
  },
  {
    size: 96,
    filename: 'icon-96.png',
    maskable: false,
    description: 'Shortcut icon 96x96'
  },
  {
    size: 192,
    filename: 'icon-maskable-192.png',
    maskable: true,
    description: 'Maskable icon 192x192'
  },
  {
    size: 512,
    filename: 'icon-maskable-512.png',
    maskable: true,
    description: 'Maskable icon 512x512'
  }
];

// SVG template for icons
function createIconSVG(size, maskable = false) {
  const padding = maskable ? size * 0.25 : 0;
  const innerSize = size - padding * 2;
  
  if (maskable) {
    // Maskable icon - circle with "N" letter
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #2563eb; }
      .text { fill: #ffffff; font-family: Arial, sans-serif; font-weight: bold; font-size: ${size * 0.6}px; text-anchor: middle; dominant-baseline: central; }
    </style>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" class="bg"/>
  <text x="${size/2}" y="${size/2}" class="text">N</text>
</svg>`;
  } else {
    // Standard icon
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #2563eb; }
      .text { fill: #ffffff; font-family: Arial, sans-serif; font-weight: bold; font-size: ${size * 0.6}px; text-anchor: middle; dominant-baseline: central; }
    </style>
  </defs>
  <rect width="${size}" height="${size}" class="bg"/>
  <text x="${size/2}" y="${size/2}" class="text">N</text>
</svg>`;
  }
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('✨ Generating icon SVGs...\n');

// Generate SVG files for each icon
icons.forEach(icon => {
  const svg = createIconSVG(icon.size, icon.maskable);
  const svgFilename = icon.filename.replace('.png', '.svg');
  const svgPath = path.join(publicDir, svgFilename);
  
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ ${icon.description} → ${svgFilename}`);
});

console.log('\n✅ SVG icons generated successfully!\n');
console.log('Next steps:');
console.log('1. Convert SVGs to PNG (you can use an online tool or install sharp)');
console.log('2. Place PNG files in /public/ with these names:');
icons.forEach(icon => {
  console.log(`   - ${icon.filename}`);
});
console.log('\n📝 Or use an online converter:');
console.log('   - https://convertio.co/svg-png/');
console.log('   - https://online-convert.com/');
console.log('\n💡 Tip: You can also design custom icons in Figma or Adobe XD!');
