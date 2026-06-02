const fs = require('fs');

const FILE = 'src/components/profile/personas/StudentProfile.tsx';
let content = fs.readFileSync(FILE, 'utf8');

// 1. Fix Stats Sticky Notes Row ONLY
// Find the exact block for Row 2
const row2Start = content.indexOf('{/* Row 2: Stats Sticky Notes */}');
const row3Start = content.indexOf('{/* Row 3: About Me, Clubs, Skills */}');
const row4Start = content.indexOf('{/* Row 4: Achievements, Focus */}');

if (row2Start !== -1 && row3Start !== -1 && row4Start !== -1) {
    let row2Block = content.substring(row2Start, row3Start);
    let row3Block = content.substring(row3Start, row4Start);

    // Make stats sticky notes flexible so 5 can fit perfectly on one row without awkward wrapping
    row2Block = row2Block.replace(/w-28 sm:w-32 aspect-square/g, 'flex-1 min-w-[90px] max-w-[125px] aspect-square');

    // Make About, Clubs, and Skills flexible so they don't leave huge gaps if one is missing
    row3Block = row3Block.replace(/w-full md:w-\[28%\]/g, 'w-full flex-1 min-w-[280px] max-w-[400px]');

    // Put them back
    content = content.substring(0, row2Start) + row2Block + row3Block + content.substring(row4Start);
    fs.writeFileSync(FILE, content);
    console.log("Successfully targeted modifications to Row 2 and Row 3 only.");
} else {
    console.log("Could not find the row markers.");
}
