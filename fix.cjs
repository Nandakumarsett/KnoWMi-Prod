const fs = require('fs');
const file = 'src/components/profile/personas/CreatorProfile.tsx';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

const startLine = 743;
const endLine = 757;

const replacementLines = [
'                        ) : (() => {',
'                          if (isUploadedVideo) {',
'                            return (',
'                              <video ',
'                                src={getAssetUrl(w.url)} ',
'                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-10 pointer-events-none"',
'                                muted',
'                                playsInline',
'                              />',
'                            );',
'                          }',
'                          return null;',
'                        })()}',
'',
'                        {w.type === "video" && (thumb || isUploadedVideo) && (',
'                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">',
'                            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-neutral-800 group-hover:scale-110 transition-transform">',
'                              <Play size={22} className="ml-0.5" fill="currentColor" />'
];

lines.splice(startLine, endLine - startLine + 1, ...replacementLines);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed syntax error successfully.');
