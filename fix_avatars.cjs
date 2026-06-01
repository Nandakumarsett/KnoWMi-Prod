const fs = require('fs');

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (!code.includes('const [avatarError, setAvatarError]')) {
    code = code.replace(
      /(export function [A-Za-z]+\([^)]+\) \{)/,
      "$1\n  const [avatarError, setAvatarError] = React.useState(false);"
    );
  }

  // Find all <img /> tags that use profile.avatar_url
  // Since JSX can span multiple lines, we need a robust replace or we can just replace manually.
  // Actually, let's use a simpler string replacement for each known theme's img tag, since there are only 12 total.

  const imgRegex = /<img[^>]*src=\{[^}]*profile\.avatar_url[^}]*\}[^>]*\/>/gs;
  
  code = code.replace(imgRegex, (match) => {
    // extract className
    const classMatch = match.match(/className=(["'])(.*?)\1/);
    const className = classMatch ? classMatch[2] : '';
    
    const roundedClass = className.includes('rounded-full') ? 'rounded-full' : (className.includes('rounded') ? 'rounded-lg' : '');
    const injectedError = match.replace('/>', 'onError={() => setAvatarError(true)} />');

    return `{!avatarError && profile.avatar_url ? (
                    ${injectedError}
                  ) : (
                    <div className="${className} flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl ${roundedClass}" style={{ fontFamily: 'sans-serif' }}>
                      {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}`;
  });

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Processed', filePath);
}

processFile('src/components/profile/personas/StudentProfile.tsx');
processFile('src/components/profile/personas/CreatorProfile.tsx');
processFile('src/components/profile/personas/DeveloperProfile.tsx');
