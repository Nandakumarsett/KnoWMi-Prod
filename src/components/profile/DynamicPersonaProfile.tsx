import React from 'react'
import { personaConfigs } from '../../config/personaConfig'
import { ProfileData } from '../../types/profile'
import { Calendar, Globe, Award, Sparkles } from 'lucide-react'

interface DynamicPersonaProfileProps {
  profile: ProfileData;
}

export function DynamicPersonaProfile({ profile }: DynamicPersonaProfileProps) {
  // 1. Get correct persona from the profile
  const pId = (profile.persona || 'developer').toLowerCase()
  const config = personaConfigs[pId] || personaConfigs.developer
  const data = profile.persona_data || {}

  return (
    <div 
      className="min-h-[500px] rounded-[40px] p-8 sm:p-12 text-white flex flex-col justify-between backdrop-blur-md relative overflow-hidden transition-all duration-500 border border-white/10"
      style={{ background: config.theme.bg }}
    >
      {/* Dynamic Visual Gradient Flare behind content */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{ background: config.theme.accent }}
      />
      <div 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{ background: config.theme.accent }}
      />

      <div className="space-y-12 relative z-10">
        {/* Dynamic Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <span 
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config.theme.badgeStyle}`}
            >
              <Sparkles size={12} /> {config.name} Persona
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
              {profile.display_name}
            </h2>
            <p className="text-sm font-medium opacity-80" style={{ color: config.theme.textSecondary }}>
              {data.tagline || profile.bio || `Welcome to ${profile.first_name}'s professional phygital identity space.`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60">
            <Calendar size={14} />
            <span>Joined {new Date(typeof profile.joined_at === 'string' ? profile.joined_at.replace(' ', 'T') : (profile.joined_at || Date.now())).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Dynamically Rendered Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {config.fields.map(field => {
            const val = data[field.key]
            if (!val || (Array.isArray(val) && val.length === 0)) return null

            switch (field.type) {
              case 'text':
              case 'number':
                return (
                  <div 
                    key={field.key} 
                    className="p-6 rounded-[28px] border border-white/5 space-y-2.5 transition-all duration-300 hover:scale-[1.02] hover:border-white/10"
                    style={{ background: config.theme.cardBg }}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-40">
                      {field.label}
                    </span>
                    <p className="text-xl font-bold tracking-tight">
                      {val}
                    </p>
                  </div>
                )

              case 'url':
                return (
                  <div 
                    key={field.key} 
                    className="p-6 rounded-[28px] border border-white/5 space-y-2.5 transition-all duration-300 hover:scale-[1.02] hover:border-white/10"
                    style={{ background: config.theme.cardBg }}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-40">
                      {field.label}
                    </span>
                    <a 
                      href={val} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-lg font-bold tracking-tight flex items-center gap-2 hover:underline select-all transition-all break-all"
                      style={{ color: config.theme.accent }}
                    >
                      <Globe size={18} /> Visit Link
                    </a>
                  </div>
                )

              case 'select':
                return (
                  <div 
                    key={field.key} 
                    className="p-6 rounded-[28px] border border-white/5 space-y-2.5 transition-all duration-300 hover:scale-[1.02] hover:border-white/10"
                    style={{ background: config.theme.cardBg }}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-40">
                      {field.label}
                    </span>
                    <p className="text-lg font-bold tracking-tight">
                      {val}
                    </p>
                  </div>
                )

              case 'tags':
                return (
                  <div 
                    key={field.key} 
                    className="p-6 rounded-[28px] border border-white/5 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:border-white/10 sm:col-span-2"
                    style={{ background: config.theme.cardBg }}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-40">
                      {field.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(val || []).map((t: string) => (
                        <span 
                          key={t}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all hover:bg-white/10"
                          style={{ color: config.theme.accent, background: `${config.theme.accent}15` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )

              case 'array':
                return (
                  <div 
                    key={field.key} 
                    className="p-6 rounded-[28px] border border-white/5 space-y-4 sm:col-span-2"
                    style={{ background: config.theme.cardBg }}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-40">
                      {field.label}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {val.map((item: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="p-5 rounded-[22px] border border-white/5 space-y-3 bg-white/5 hover:border-white/10 transition-all"
                        >
                          {Object.keys(item).map(subKey => {
                            const subSchema = field.itemSchema?.find(s => s.key === subKey)
                            if (!subSchema || !item[subKey]) return null

                            return (
                              <div key={subKey}>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                                  {subSchema.label}
                                </span>
                                {subSchema.type === 'url' ? (
                                  <a 
                                    href={item[subKey]} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-sm font-bold tracking-tight hover:underline select-all flex items-center gap-1.5 break-all"
                                    style={{ color: config.theme.accent }}
                                  >
                                    <Globe size={14} /> Visit Link
                                  </a>
                                ) : (
                                  <span className="text-sm font-semibold tracking-normal text-white">
                                    {item[subKey]}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )

              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

