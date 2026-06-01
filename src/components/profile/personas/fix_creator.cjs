const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'CreatorProfile.tsx');
const newThemesFile = path.join(__dirname, 'temp_creator_fix.tsx');

const targetContent = fs.readFileSync(targetFile, 'utf8');
const newThemesContent = fs.readFileSync(newThemesFile, 'utf8');

const splitMarker = '  // ----------------------------------------------------\n  // LAYOUT 2: SYNTHWAVE / CYBERPUNK CONSOLE (Neon Theme)';
const index = targetContent.indexOf(splitMarker);

if (index === -1) {
  console.error("Could not find the split marker in CreatorProfile.tsx");
  process.exit(1);
}

const originalPrefix = targetContent.substring(0, index);
const finalContent = originalPrefix + newThemesContent;

fs.writeFileSync(targetFile, finalContent, 'utf8');
console.log("Successfully fixed CreatorProfile.tsx");
