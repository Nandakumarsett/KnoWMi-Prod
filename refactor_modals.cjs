const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/profile/personas/CreatorProfile.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Extract the modals block
const modalStartMarker = '{/* ═══ SELECTED WORK MODAL ═══ */}';
const modalEndMarker = '<GateModal />\n    </div>\n  );\n}';
const modalStartIndex = content.indexOf(modalStartMarker);
if (modalStartIndex === -1) throw new Error("Could not find start marker");
const modalEndIndex = content.lastIndexOf('<GateModal />');
if (modalEndIndex === -1) throw new Error("Could not find end marker");

// The extracted text contains the GateModal too.
const modalsText = content.substring(modalStartIndex, modalEndIndex + '<GateModal />'.length);

const renderModalsFunction = `  const renderModals = () => (
    <>
      ${modalsText.replace(/\n/g, '\n    ')}
    </>
  );\n\n`;

// Insert renderModals before LAYOUT 0
const layout0Marker = '  // ----------------------------------------------------\n  // LAYOUT 0: ORIGINAL CLASSIC STYLE (Classic Theme)';
content = content.replace(layout0Marker, renderModalsFunction + layout0Marker);

// Replace GateModal with {renderModals()} everywhere
content = content.replace(/<GateModal \/>/g, '{renderModals()}');

// Wait! In the extraction, the original modalsText is still at the bottom.
// We need to replace it there too. But we already replaced `<GateModal />` with `{renderModals()}`.
// So the bottom will look like:
// {/* ═══ SELECTED WORK MODAL ═══ */}
// ...
// {renderModals()}
// </div>
// );

// Actually, the easiest way to remove the bottom modals block is to replace it before replacing GateModal.
content = fs.readFileSync(filePath, 'utf8');
content = content.replace(modalsText, '{renderModals()}');

content = content.replace(layout0Marker, renderModalsFunction + layout0Marker);

// Now replace remaining GateModal calls in the classic, minimal, neon themes
content = content.replace(/<GateModal \/>/g, '{renderModals()}');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Modals refactored successfully.");
