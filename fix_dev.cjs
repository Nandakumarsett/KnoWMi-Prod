const fs = require('fs');
const path = require('path');

const devPath = path.join(__dirname, 'src/components/profile/personas/DeveloperProfile.tsx');
let text = fs.readFileSync(devPath, 'utf-8');

text = text.replace(/\{false \?/g, "{data.featured_work_url ?");
text = text.replace(/\{false &&/g, "{data.featured_work_url &&");
text = text.replace(/false === 'Working at Company'/g, "data.about?.status === 'Working at Company'");
text = text.replace(/\{false && \(/g, "{data.about?.status && (");
text = text.replace(/\{false &&/g, "{data.about?.status &&");
text = text.replace(/\{false\}/g, "{data.about?.status}");

// Also restore data.about.company in Blueprint theme
text = text.replace(/false && \(\n                  <div className="flex justify-between items-center py-2 border-b border-\[#64FFDA\]\/10\">\n                    <span className="text-\[#64FFDA\]\/60">DEPLOYMENT:<\/span>\n                    <span className="text-white">{false}<\/span>\n                  <\/div>\n                \)/g, 
  "data.about.company && (\n                  <div className=\"flex justify-between items-center py-2 border-b border-[#64FFDA]/10\">\n                    <span className=\"text-[#64FFDA]/60\">DEPLOYMENT:</span>\n                    <span className=\"text-white\">{data.about.company}</span>\n                  </div>\n                )");

// Also restore data.about.company in Hacker theme
text = text.replace(/false && \(\n                  <p className="flex items-center gap-3\">\n                    <span className="text-\[#00FF41\]\/60 w-24\">HOST:<\/span> \n                    <span className="text-white">{false}<\/span>\n                  <\/p>\n                \)/g,
  "data.about.company && (\n                  <p className=\"flex items-center gap-3\">\n                    <span className=\"text-[#00FF41]/60 w-24\">HOST:</span> \n                    <span className=\"text-white\">{data.about.company}</span>\n                  </p>\n                )");

// Restore platforms
text = text.replace(/profile\.social_links/g, "data.platforms");

fs.writeFileSync(devPath, text);
console.log('Fixed dev profile');
