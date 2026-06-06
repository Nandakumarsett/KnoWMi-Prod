const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = path.join(__dirname, 'src/components/profile/personas/CreatorProfile.tsx');
let currentContent = fs.readFileSync(filePath, 'utf8');

if (currentContent.includes('const renderModals = () =>')) {
    console.log('renderModals already exists');
    process.exit(0);
}

// Get the previous version of the file
const prevContent = execSync('git show HEAD~1:src/components/profile/personas/CreatorProfile.tsx').toString();

// Extract the modals block from the previous version
const modalStartMarker = '{/* ═══ SELECTED WORK MODAL ═══ */}';
const modalEndMarker = '<GateModal />';
const modalStartIndex = prevContent.indexOf(modalStartMarker);
if (modalStartIndex === -1) throw new Error("Could not find start marker in prev file");
const modalEndIndex = prevContent.lastIndexOf(modalEndMarker);
if (modalEndIndex === -1) throw new Error("Could not find end marker in prev file");

const modalsText = prevContent.substring(modalStartIndex, modalEndIndex + modalEndMarker.length);

const renderModalsFunction = `  const renderModals = () => (
    <>
      ${modalsText.replace(/\n/g, '\n    ')}
    </>
  );\n\n`;

// Insert renderModals before LAYOUT 0
const layout0Index = currentContent.indexOf('// LAYOUT 0: ORIGINAL CLASSIC STYLE');
if (layout0Index === -1) {
    throw new Error("Could not find LAYOUT 0 marker in current file");
}
// Find the preceding line comment dashes
const insertIndex = currentContent.lastIndexOf('// ------', layout0Index);

currentContent = currentContent.substring(0, insertIndex) + renderModalsFunction + currentContent.substring(insertIndex);

fs.writeFileSync(filePath, currentContent, 'utf8');
console.log("renderModals injected successfully.");
