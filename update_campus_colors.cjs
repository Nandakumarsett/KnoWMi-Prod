const fs = require('fs');
const FILE = 'src/components/profile/personas/StudentProfile.tsx';
let content = fs.readFileSync(FILE, 'utf8');

// Global replacement of specific hex codes that we know are only in the Campus theme
content = content.replace(/#fdfbf7/gi, '#FDF9F1'); // Warm ivory
content = content.replace(/#FDE68A/gi, '#FCEB9C'); // Soft classic yellow
content = content.replace(/#d4e0b5/gi, '#C3E7AD'); // Fresh mint
content = content.replace(/#c0d6e4/gi, '#BCE2EE'); // Cyan blue
content = content.replace(/#f2c7ce/gi, '#F6C1D6'); // Soft rose
content = content.replace(/#cc0000/gi, '#B91C1C'); // Crimson red

// The Spotify one we replace fully globally too
content = content.replace(/bg-\[#1DB954\]/g, 'bg-[#C3E7AD]');
content = content.replace(/text-\[#1DB954\]/g, 'text-[#14532D]');

fs.writeFileSync(FILE, content);
console.log('Colors replaced globally in StudentProfile.tsx!');
