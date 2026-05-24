import fs from 'fs';

const content = fs.readFileSync('dist/assets/index-CJAqn7fM.js', 'utf8');

// Find Supabase URL
const urlMatch = content.match(/https:\/\/[a-z0-9]+\.supabase\.co/);
console.log('SUPABASE URL:', urlMatch ? urlMatch[0] : 'Not found');

// Find Anon Key (a long eyJ... string)
const anonMatches = content.match(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g);
if (anonMatches) {
  console.log('ANON KEYS FOUND:', anonMatches.length);
  anonMatches.forEach((key, idx) => {
    console.log(`Key ${idx + 1}:`, key.substring(0, 30) + '...');
  });
} else {
  console.log('Anon Key not found');
}
