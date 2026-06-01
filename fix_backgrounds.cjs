const fs = require('fs');

const files = [
  'src/components/profile/personas/CreatorProfile.tsx',
  'src/components/profile/personas/DeveloperProfile.tsx',
  'src/components/profile/personas/StudentProfile.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace fixed backgrounds with absolute
  // General rule: change fixed to absolute if it has pointer-events-none
  // or if it's a background element (inset-0, top-, bottom-)
  
  // Specifically for StudentProfile notebook paper lines and margin:
  content = content.replace(/className="fixed inset-0 pointer-events-none/g, 'className="absolute inset-0 pointer-events-none');
  content = content.replace(/className="fixed top-0 bottom-0/g, 'className="absolute top-0 bottom-0');
  content = content.replace(/className="fixed top-\[-/g, 'className="absolute top-[-');
  content = content.replace(/className="fixed bottom-\[-/g, 'className="absolute bottom-[-');
  
  // Fix DeveloperProfile specific fixed backgrounds
  content = content.replace(/className="fixed inset-0 pointer-events-none z-50 crt-overlay/g, 'className="absolute inset-0 pointer-events-none z-50 crt-overlay');
  content = content.replace(/className="fixed inset-0 pointer-events-none z-40 bg-gradient-to-b/g, 'className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-b');
  content = content.replace(/className="fixed inset-0 varsity-bg/g, 'className="absolute inset-0 varsity-bg');

  // Let's replace the simple-icons image in StudentProfile.tsx with PLATFORM_ICONS
  // The Notebook theme has:
  /*
  const pData = getPlatformData(p.platform)
  return (
    ...
      {pData.logo ? (
        <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`} ... />
      ) : ( ... )}
  */
  // I will replace that whole block using regex or string replacement.
  
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Fixed absolute/fixed backgrounds.');
