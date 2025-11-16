#!/usr/bin/env node

/**
 * PWA Setup Verification Script
 * Checks if all required PWA files and configurations are in place
 * 
 * Usage: node scripts/verify-pwa.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n📱 PWA Setup Verification\n');
console.log('=' .repeat(50));

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  const status = condition ? '✅' : '❌';
  checks.push({ name, condition, details });
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);
  if (condition) passed++; else failed++;
}

// Root directory
const root = path.join(__dirname, '..');

// Check manifest.json
const manifestPath = path.join(root, 'public', 'manifest.json');
const manifestExists = fs.existsSync(manifestPath);
check('Manifest File', manifestExists, manifestPath);

if (manifestExists) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    check('  Valid JSON', true, 'Manifest is valid JSON');
    check('  Has name', !!manifest.name, manifest.name || 'Missing');
    check('  Has icons', Array.isArray(manifest.icons) && manifest.icons.length > 0, `${manifest.icons?.length || 0} icons defined`);
    check('  Has theme_color', !!manifest.theme_color, manifest.theme_color || 'Not set');
  } catch (e) {
    check('  Valid JSON', false, e.message);
  }
}

// Check Service Worker
const swPath = path.join(root, 'public', 'sw.js');
const swExists = fs.existsSync(swPath);
check('Service Worker', swExists, swPath);

if (swExists) {
  const sw = fs.readFileSync(swPath, 'utf8');
  check('  Has install handler', sw.includes("addEventListener('install'"), 'Service worker lifecycle implemented');
  check('  Has fetch handler', sw.includes("addEventListener('fetch'"), 'Network request handling implemented');
}

// Check offline page
const offlinePath = path.join(root, 'app', 'offline.tsx');
const offlineExists = fs.existsSync(offlinePath);
check('Offline Page', offlineExists, offlinePath);

// Check layout.tsx
const layoutPath = path.join(root, 'app', 'layout.tsx');
const layoutExists = fs.existsSync(layoutPath);
check('Root Layout', layoutExists, layoutPath);

if (layoutExists) {
  const layout = fs.readFileSync(layoutPath, 'utf8');
  check('  Manifest link', layout.includes("manifest: '/manifest.json'"), 'Manifest linked in metadata');
  check('  SW registration', layout.includes("navigator.serviceWorker.register"), 'Service worker registered');
  check('  PWA meta tags', layout.includes("mobile-web-app-capable"), 'PWA meta tags present');
}

// Check next.config.js
const nextConfigPath = path.join(root, 'next.config.js');
const nextConfigExists = fs.existsSync(nextConfigPath);
check('Next Config', nextConfigExists, nextConfigPath);

if (nextConfigExists) {
  const config = fs.readFileSync(nextConfigPath, 'utf8');
  check('  Headers config', config.includes('headers:'), 'Cache headers configured');
  check('  SW headers', config.includes('/sw.js'), 'Service worker headers configured');
}

// Check app icons
const requiredIcons = [
  'icon-192.png',
  'icon-512.png',
  'icon-96.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png'
];

console.log('\n📦 App Icons in /public/:');
let iconsFound = 0;
requiredIcons.forEach(icon => {
  const iconPath = path.join(root, 'public', icon);
  const exists = fs.existsSync(iconPath);
  const size = exists ? `(${(fs.statSync(iconPath).size / 1024).toFixed(1)}KB)` : '';
  check(`  ${icon}`, exists, size);
  if (exists) iconsFound++;
});

// Documentation
console.log('\n📚 Documentation Files:');
const docFiles = [
  'PWA_SETUP.md',
  'QUICK_PWA_GUIDE.md',
  'PWA_CONFIG.md',
  'PWA_COMPLETE.md',
  'icon-generator.html'
];

docFiles.forEach(doc => {
  const docPath = path.join(root, doc);
  check(`  ${doc}`, fs.existsSync(docPath));
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:\n');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (iconsFound === 0) {
  console.log('\n⚠️  ACTION REQUIRED: No app icons found!');
  console.log('   Please generate icons using one of these methods:');
  console.log('   1. Open icon-generator.html in your browser');
  console.log('   2. Run: node scripts/generate-pwa-icons.js');
  console.log('   3. Create icons manually and save to /public/\n');
} else if (iconsFound < 5) {
  console.log(`\n⚠️  INCOMPLETE: Found ${iconsFound}/5 icons`);
  console.log('   Missing icons should be added to /public/\n');
} else {
  console.log('\n✅ All required icons found!\n');
}

if (failed === 0 && iconsFound === 5) {
  console.log('🎉 PWA setup is complete and ready to deploy!\n');
  process.exit(0);
} else if (failed === 0 && iconsFound > 0) {
  console.log('⚠️  PWA setup is mostly complete. Add missing icons to /public/\n');
  process.exit(0);
} else {
  console.log('❌ PWA setup has issues that need to be fixed.\n');
  process.exit(1);
}
