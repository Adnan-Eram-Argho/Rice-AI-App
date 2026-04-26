#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * This script generates PNG icons from SVG for PWA support
 * 
 * Usage: node generate-icons.js
 */

/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

console.log('🌾 Rice AI Doctor - PWA Icon Generator\n');

// Check if sharp is installed (optional, faster method)
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Using sharp library for fast icon generation\n');
} catch {
  console.log('⚠️  Sharp not found. Using alternative method.\n');
  console.log('For better results, install sharp:');
  console.log('npm install --save-dev sharp\n');
}

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#10b981" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="50" cy="50" r="48" fill="url(#leafGradient)" filter="url(#shadow)"/>
  
  <!-- Rice Grain/Stalk Icon -->
  <g transform="translate(50, 50)">
    <!-- Main stalk -->
    <path d="M 0,-25 Q -2,-10 0,5 Q 2,15 0,25" 
          stroke="white" 
          stroke-width="3" 
          fill="none" 
          stroke-linecap="round"/>
    
    <!-- Left grain cluster -->
    <ellipse cx="-8" cy="-15" rx="4" ry="7" fill="white" opacity="0.95" transform="rotate(-20, -8, -15)"/>
    <ellipse cx="-10" cy="-5" rx="3.5" ry="6" fill="white" opacity="0.9" transform="rotate(-15, -10, -5)"/>
    <ellipse cx="-9" cy="5" rx="3" ry="5" fill="white" opacity="0.85" transform="rotate(-10, -9, 5)"/>
    
    <!-- Right grain cluster -->
    <ellipse cx="8" cy="-12" rx="4" ry="7" fill="white" opacity="0.95" transform="rotate(20, 8, -12)"/>
    <ellipse cx="10" cy="-2" rx="3.5" ry="6" fill="white" opacity="0.9" transform="rotate(15, 10, -2)"/>
    <ellipse cx="9" cy="8" rx="3" ry="5" fill="white" opacity="0.85" transform="rotate(10, 9, 8)"/>
    
    <!-- Small top grains -->
    <ellipse cx="-3" cy="-20" rx="2.5" ry="4" fill="white" opacity="0.8" transform="rotate(-5, -3, -20)"/>
    <ellipse cx="3" cy="-18" rx="2.5" ry="4" fill="white" opacity="0.8" transform="rotate(5, 3, -18)"/>
  </g>
</svg>`;

async function generateWithSharp() {
  const sizes = [
    { size: 192, name: 'pwa-192x192.png' },
    { size: 512, name: 'pwa-512x512.png' }
  ];

  const publicDir = path.join(__dirname, 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const { size, name } of sizes) {
    try {
      console.log(`Generating ${name} (${size}x${size})...`);
      
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      
      console.log(`✅ Created: public/${name}\n`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
      return false;
    }
  }
  
  return true;
}

function generateInstructions() {
  console.log('📝 Manual Instructions:\n');
  console.log('Since sharp is not available, please use one of these methods:\n');
  console.log('Option 1: Use the HTML Generator (Easiest)');
  console.log('  1. Open generate-pwa-icons.html in your browser');
  console.log('  2. Click the Download buttons for both sizes');
  console.log('  3. Move files to public/ folder\n');
  
  console.log('Option 2: Install sharp and run this script again');
  console.log('  npm install --save-dev sharp');
  console.log('  node generate-icons.js\n');
  
  console.log('Option 3: Use online tools');
  console.log('  - favicon.io');
  console.log('  - realfavicongenerator.net');
  console.log('  - appicon.co\n');
}

// Main execution
if (sharp) {
  generateWithSharp().then(success => {
    if (success) {
      console.log('✨ All icons generated successfully!\n');
      console.log('Next steps:');
      console.log('1. Commit the new icon files');
      console.log('2. Run: npm run build');
      console.log('3. Deploy your app');
      console.log('4. Clear cache on your mobile device\n');
    }
  });
} else {
  generateInstructions();
}