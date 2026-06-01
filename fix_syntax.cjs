const fs = require('fs');
const files = [
  'src/components/profile/personas/CreatorProfile.tsx',
  'src/components/profile/personas/DeveloperProfile.tsx',
  'src/components/profile/personas/StudentProfile.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // replace literal backslash followed by backtick with just backtick
  content = content.replace(/\\`/g, '`');
  // replace literal backslash followed by dollar sign with just dollar sign
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed ' + f);
});
