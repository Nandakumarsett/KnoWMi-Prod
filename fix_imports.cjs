const fs = require('fs');

const creatorFile = 'src/components/profile/personas/CreatorProfile.tsx';
let creatorContent = fs.readFileSync(creatorFile, 'utf8');

// Fix QrCode import
if (!creatorContent.includes('QrCode,')) {
  creatorContent = creatorContent.replace(
    /Globe, Activity, X, Lock/,
    'Globe, Activity, X, Lock, QrCode'
  );
  fs.writeFileSync(creatorFile, creatorContent, 'utf8');
  console.log('Fixed QrCode import in CreatorProfile');
} else {
  console.log('QrCode already imported in CreatorProfile');
}

// DeveloperProfile Terminal layout fix?
// Let's check what might be "offly setted". 
// Maybe the padding in the root div: `p-4 sm:p-8 flex flex-col justify-start items-center`
// If it's in a preview container, padding makes it smaller. Let's change the root div of terminal theme:
const devFile = 'src/components/profile/personas/DeveloperProfile.tsx';
let devContent = fs.readFileSync(devFile, 'utf8');

// I will remove the padding from the root wrapper of Terminal theme and give it bg-[#1C1E21] instead so the whole page looks like a terminal, rather than a terminal window inside a light gray page.
// The MacOS terminal wrapper doesn't look like a real theme if it's just a floating window. Wait, a floating MacOS window IS a popular developer aesthetic!
// But if the user says it's offly setted, maybe the padding or min-h-screen makes it cut off?
