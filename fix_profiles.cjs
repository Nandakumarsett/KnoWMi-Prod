const fs = require('fs');
const path = require('path');

const devPath = path.join(__dirname, 'src/components/profile/personas/DeveloperProfile.tsx');
const creatorPath = path.join(__dirname, 'src/components/profile/personas/CreatorProfile.tsx');
const studentPath = path.join(__dirname, 'src/components/profile/personas/StudentProfile.tsx');

function replaceFile(p, replacer) {
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf-8');
  const newContent = replacer(content);
  fs.writeFileSync(p, newContent);
  console.log(`Updated ${path.basename(p)}`);
}

// Fix DeveloperProfile
replaceFile(devPath, (c) => {
  let text = c;
  // Fallbacks
  text = text.replace(/\|\|\s*'NEW USER'/g, "");
  text = text.replace(/\|\|\s*'SYSTEM ENGINEER'/g, "");
  text = text.replace(/\|\|\s*'SYSTEM ARCHITECT'/g, "");
  text = text.replace(/\|\|\s*'UNKNOWN_USER'/g, "");
  text = text.replace(/\|\|\s*'ROOT_ACCESS'/g, "");
  text = text.replace(/\|\|\s*'Software Engineer'/g, "");
  text = text.replace(/\|\|\s*'developer'/g, "");
  text = text.replace(/\|\|\s*'U'/g, "|| ''");

  // Disable missing schema fields safely
  text = text.replace(/data\.featured_work_url/g, "false");
  text = text.replace(/data\.about\?\.status/g, "false");
  text = text.replace(/data\.about\.status/g, "false");
  text = text.replace(/data\.about\?\.company/g, "false");
  text = text.replace(/data\.about\.company/g, "false");

  // Replace platforms with social_links
  text = text.replace(/data\.platforms/g, "profile.social_links");

  return text;
});

// Fix CreatorProfile
replaceFile(creatorPath, (c) => {
  let text = c;
  text = text.replace(/\|\|\s*"CREATIVE PROFESSIONAL"/g, '');
  text = text.replace(/\|\|\s*"DIGITAL CREATOR"/g, '');
  text = text.replace(/\|\|\s*"Open to Opportunities"/g, '');
  text = text.replace(/\|\|\s*'U'/g, "|| ''");
  text = text.replace(/\|\|\s*"Showcase Item"/g, '');
  text = text.replace(/\|\|\s*"Showcase"/g, '');
  text = text.replace(/\|\|\s*"Media"/g, '');
  text = text.replace(/\|\|\s*"Global"/g, '');
  text = text.replace(/\|\|\s*"Available for strategic creative partnerships\."/g, '');

  // Fix fake data for free profiles
  text = text.replace(/isFreeProfile \? "8,204" : /g, "");
  text = text.replace(/isFreeProfile \? "4\.2K" : /g, "");
  text = text.replace(/isFreeProfile \? "New York" : /g, "");

  // Fix invalid schema references
  text = text.replace(/data\.equipment/g, "(data as any).equipment");
  text = text.replace(/data\.audience_top_location/g, "data.location");
  text = text.replace(/data\.about \|\| /g, "");

  return text;
});

// Fix StudentProfile
replaceFile(studentPath, (c) => {
  let text = c;
  text = text.replace(/\|\|\s*'U'/g, "|| ''");
  text = text.replace(/\? data\.course : 'Student'/g, "|| ''");
  text = text.replace(/\|\|\s*'Student'/g, "");
  text = text.replace(/\? data\.university : 'Stanford University'/g, "|| ''");
  text = text.replace(/\? data\.course : 'Computer Science'/g, "|| ''");
  text = text.replace(/\? `Top \$\{data\.campus_rank_pct\}%` : 'N\/A'/g, "? `Top ${data.campus_rank_pct}%` : ''");
  text = text.replace(/\|\|\s*'My Playlist'/g, "|| ''");
  text = text.replace(/\|\|\s*'🚀'/g, "|| ''");

  // Fix fake data
  text = text.replace(/isFreeProfile \? '8,204' : /g, "");
  text = text.replace(/isFreeProfile \? '146' : /g, "");
  text = text.replace(/isFreeProfile \? '9\.2k' : /g, "");
  text = text.replace(/isFreeProfile \? '9k' : /g, "");

  // Fix stale properties
  text = text.replace(/data\.about_me/g, "profile.bio");
  text = text.replace(/data\.featured_work_url/g, "false");
  text = text.replace(/profile\.cover_url/g, "false");

  return text;
});
