const fs = require('fs');

const f = 'src/components/profile/personas/StudentProfile.tsx';
let content = fs.readFileSync(f, 'utf8');

// Fix avatar image fallback
const avatarFind = `src={getAssetUrl(profile.avatar_url) || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(profile.display_name)}&background=f3f4f6&color=374151\`} 
              alt={profile.display_name} 
              className="w-full h-full object-cover filter contrast-110 sepia-[0.2]"`;
const avatarReplace = `src={getAssetUrl(profile.avatar_url) || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(profile.display_name)}&background=f3f4f6&color=374151\`} 
              alt={profile.display_name} 
              className="w-full h-full object-cover filter contrast-110 sepia-[0.2]"
              onError={(e) => { e.currentTarget.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(profile.display_name)}&background=f3f4f6&color=374151\`; }}`;

content = content.replace(avatarFind, avatarReplace);

// Fix platforms rendering
const platformsFind = `{data.platforms.map((p: any, i: number) => {
                const pData = getPlatformData(p.platform)
                return (
                  <a 
                    key={i}
                    href={ensureAbsoluteUrl(p.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="w-16 h-16 bg-white border-2 border-neutral-300 rounded-full flex items-center justify-center hover:scale-110 hover:border-blue-500 transition-all shadow-sm relative group"
                  >
                    {pData.logo ? (
                      <img 
                        src={\`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/\${pData.logo}.svg\`}
                        className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity"
                        alt={p.platform}
                      />
                    ) : (
                      <div className="opacity-60 group-hover:opacity-100 text-neutral-800 transition-opacity">
                        {pData.icon}
                      </div>
                    )}
                    {isGated && (
                      <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                        <Lock size={16} className="text-neutral-500" />
                      </div>
                    )}
                  </a>
                )
              })}`;

const platformsReplace = `{data.platforms.map((p: any, i: number) => {
                const platform = p.platform?.toLowerCase()
                const Icon = PLATFORM_ICONS[platform] || Share2
                return (
                  <a 
                    key={i}
                    href={ensureAbsoluteUrl(p.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="w-16 h-16 bg-white border-2 border-neutral-300 rounded-full flex items-center justify-center hover:scale-110 hover:border-blue-500 transition-all shadow-sm relative group"
                  >
                    <Icon className="w-6 h-6 opacity-60 group-hover:opacity-100 text-neutral-800 transition-opacity" />
                    {isGated && (
                      <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                        <Lock size={16} className="text-neutral-500" />
                      </div>
                    )}
                  </a>
                )
              })}`;

content = content.replace(platformsFind, platformsReplace);

fs.writeFileSync(f, content, 'utf8');
console.log('Fixed StudentProfile');
