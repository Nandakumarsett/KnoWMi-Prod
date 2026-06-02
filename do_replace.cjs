const fs = require('fs');

const content = fs.readFileSync('src/components/profile/personas/StudentProfile.tsx', 'utf8');
const lines = content.split('\n');

let start = -1;
let end = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes("if (activeTheme === 'campus') {")) {
    start = i;
  }
  if (lines[i].includes("LAYOUT 2: COZY LATE-NIGHT STUDY DESK")) {
    end = i - 2; 
    break;
  }
}

const newCampusLayout = fs.readFileSync('new_campus.tsx', 'utf8').split('\n');

if (start !== -1 && end !== -1) {
  const newLines = [...lines.slice(0, start), ...newCampusLayout, ...lines.slice(end + 1)];
  fs.writeFileSync('src/components/profile/personas/StudentProfile.tsx', newLines.join('\n'));
  console.log('Successfully updated Campus Theme layout!');
} else {
  console.error('Could not find boundaries!', {start, end});
  process.exit(1);
}
