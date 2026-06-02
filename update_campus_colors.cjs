const fs = require('fs');

const FILE = 'src/components/profile/personas/StudentProfile.tsx';
let content = fs.readFileSync(FILE, 'utf8');

// The replacement mapping
const colorMap = {
    // Solid/Lined Paper background (was #fdfbf7, making it a richer warm ivory)
    '#fdfbf7': '#FDF9F1',
    
    // Yellow sticky notes (was #FDE68A, making it classic post-it yellow)
    '#FDE68A': '#FCEB9C',
    
    // Green sticky notes (was #d4e0b5, making it a fresh post-it green)
    '#d4e0b5': '#C3E7AD',
    
    // Blue sticky notes (was #c0d6e4, making it a cleaner post-it cyan/blue)
    '#c0d6e4': '#BCE2EE',
    
    // Pink sticky notes (was #f2c7ce, making it a cleaner post-it rose)
    '#f2c7ce': '#F6C1D6',
    
    // Red Ink (was #cc0000, making it a richer crimson ink)
    '#cc0000': '#B91C1C'
};

// Apply replacements ONLY in the Campus theme section
const startIdx = content.indexOf('if (activeTheme === \\\'campus\\\')');
const endIdx = content.indexOf('// LAYOUT 2');

if (startIdx !== -1 && endIdx !== -1) {
    let campusCode = content.substring(startIdx, endIdx);
    
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
        // Regex with global flag and case-insensitivity to replace all occurrences
        const regex = new RegExp(oldColor, 'gi');
        campusCode = campusCode.replace(regex, newColor);
    }
    
    // Specifically fix the Spotify sticky note (currently bg-[#1DB954] and text-[#1DB954])
    // Make the background a matching green post-it, and the text a very dark green ink
    campusCode = campusCode.replace(/bg-\[#1DB954\]/g, 'bg-[#C3E7AD]');
    campusCode = campusCode.replace(/text-\[#1DB954\]/g, 'text-[#14532D]');

    content = content.substring(0, startIdx) + campusCode + content.substring(endIdx);
    fs.writeFileSync(FILE, content);
    console.log("Colors successfully updated to premium stationery palette.");
} else {
    console.log("Could not find Campus theme boundaries.");
}
