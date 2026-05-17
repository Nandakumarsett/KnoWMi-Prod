import React, { useState } from 'react'
import { TagInput } from '../TagInput'
import { URLInput } from '../URLInput'
import { 
  Plus, Trash2, RefreshCw, FileText, Eye, 
  Terminal, Code2, BarChart3, Github, 
  Layout, ExternalLink, Globe, Target,
  Camera, Upload, Briefcase, Mail
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'

const TECH_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML/CSS',
  'Node.js', 'Django', 'FastAPI', 'Laravel', 'Spring', 'Express',
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Firebase',
  'Docker', 'AWS', 'GCP', 'Azure', 'Kubernetes', 'GitHub Actions',
  'Git', 'VS Code', 'Figma', 'Postman', 'Linux', 'GraphQL'
]

interface DeveloperFormProps {
  data: any
  onChange: (newData: any) => void
  isOwner?: boolean
  onUpload?: (file: File, type: string) => Promise<string | null>
  uploading?: boolean
}

export function DeveloperForm({ data = {}, onChange, isOwner, onUpload, uploading }: DeveloperFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  const updateAbout = (field: string, value: any) => {
    onChange({
      ...data,
      about: { ...(data.about || {}), [field]: value }
    })
  }

  return (
    <div className="space-y-24 py-10 animate-fadeIn">
      
      {/* SECTION: CURRENT ENDEAVORS */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Current Endeavors</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">What are you working on right now?</p>
          </div>
        </div>

        <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-blue-500/5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Current Status</label>
              <select
                value={data.about?.status || ''}
                onChange={e => updateAbout('status', e.target.value)}
                className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
              >
                <option value="">Select Status</option>
                <option value="Freelancing">Freelancing / Self-Employed</option>
                <option value="Working at Company">Working at Company</option>
                <option value="Seeking Opportunities">Seeking Opportunities (Open to Work)</option>
                <option value="Student">Student / Learning</option>
                <option value="Founder">Founder / Building startup</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Company / Organization Name</label>
              <input
                type="text"
                value={data.about?.company || ''}
                onChange={e => updateAbout('company', e.target.value)}
                placeholder="e.g. Google, Stripe, Freelance"
                className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Professional Role</label>
              <input
                type="text"
                value={data.about?.role || ''}
                onChange={e => updateAbout('role', e.target.value)}
                placeholder="e.g. Full-Stack Developer"
                className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
              <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-1">This title appears under your name</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Mission Statement</label>
              <textarea
                rows={2}
                value={data.about?.mission || ''}
                onChange={e => updateAbout('mission', e.target.value)}
                placeholder="e.g. Engineering the future of decentralized identity."
                className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: BRAND IDENTITY (BANNER) */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <Camera size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Brand Identity</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Customize your profile backdrop</p>
          </div>
        </div>

        <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-blue-500/5">
          {/* Banner Upload */}
          <div className="flex flex-col space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Profile Banner</label>
            <div className="relative group min-h-[200px]">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#F0F7FF] border-2 border-dashed border-blue-200 hover:border-blue-500 transition-all flex flex-col items-center justify-center cursor-pointer relative py-8">
                {data.featured_work_url ? (
                  <>
                    <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Banner Preview" />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Replace Banner Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-blue-400 p-4 text-center">
                    <Camera size={28} className="text-blue-500" />
                    <div>
                      <span className="text-xs font-bold text-neutral-700">Upload Banner</span>
                      <p className="text-[10px] mt-0.5 text-neutral-400">1200x400 JPG/PNG</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onUpload) {
                      onUpload(file, 'featured_work_url').then(url => {
                        if (url) updateField('featured_work_url', url);
                      });
                    }
                  }}
                />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COLLABORATION & CONTACT */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Contact & Collaboration</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Define your professional gateways</p>
          </div>
        </div>

        <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-blue-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Professional Email</label>
               <input type="email" value={data.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} placeholder="hello@yourbrand.com" className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none" />
             </div>
             <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">WhatsApp Number</label>
               <input type="text" value={data.contact_whatsapp || ''} onChange={e => updateField('contact_whatsapp', e.target.value)} placeholder="+91 00000 00000" className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none" />
             </div>
             <div className="space-y-2 md:col-span-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Quick Talk URL (Calendly, etc)</label>
               <input type="url" value={data.quick_talk_url || ''} onChange={e => updateField('quick_talk_url', e.target.value)} placeholder="https://calendly.com/yourusername" className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none" />
             </div>
             <div className="space-y-2 md:col-span-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Collaboration Interest</label>
               <textarea rows={2} value={data.collab_types || ''} onChange={e => updateField('collab_types', e.target.value)} placeholder="e.g. Open to Freelance, Mentorship..." className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none resize-none" />
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: NETWORK PRESENCE */}
      <section className="space-y-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Network Presence</h3>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Connect up to 6 platforms</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-neutral-100 rounded-full text-[10px] font-black uppercase text-neutral-400 tracking-widest">
            {(data.platforms || []).length}/6 Active
          </span>
        </div>

        <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-blue-500/5 space-y-4">
          {(data.platforms || []).map((p: any, i: number) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 p-6 bg-neutral-50 border border-neutral-200 rounded-[24px] relative group">
              <button type="button" onClick={() => {
                const pCopy = [...(data.platforms || [])]; pCopy.splice(i, 1); updateField('platforms', pCopy);
              }} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                <Trash2 size={14} />
              </button>
              <div className="w-full sm:w-1/3">
                <select value={p.platform || ''} onChange={e => {
                  const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, platform: e.target.value }; updateField('platforms', pCopy);
                }} className="w-full bg-white border-2 border-transparent rounded-xl px-4 py-3 text-sm font-black text-[#1A1A1A] focus:border-blue-500 transition-all outline-none appearance-none">
                  <option value="">Platform</option>
                  <option value="GitHub">GitHub</option>
                  <option value="StackOverflow">StackOverflow</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Medium">Medium</option>
                  <option value="Dev.to">Dev.to</option>
                  <option value="Hashnode">Hashnode</option>
                  <option value="Dribbble">Dribbble</option>
                  <option value="Behance">Behance</option>
                </select>
              </div>
              <div className="w-full sm:flex-1 grid grid-cols-2 gap-4">
                <input type="text" value={p.followers || ''} onChange={e => {
                  const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, followers: e.target.value }; updateField('platforms', pCopy);
                }} placeholder="Stats/Followers (e.g. 1.2K)" className="w-full bg-white border-2 border-transparent rounded-xl px-4 py-3 text-sm font-black text-[#1A1A1A] focus:border-blue-500 transition-all outline-none" />
                <input type="url" value={p.url || ''} onChange={e => {
                  const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, url: e.target.value }; updateField('platforms', pCopy);
                }} placeholder="https://..." className="w-full bg-white border-2 border-transparent rounded-xl px-4 py-3 text-sm font-black text-[#1A1A1A] focus:border-blue-500 transition-all outline-none" />
              </div>
            </div>
          ))}
          
          {(data.platforms || []).length < 6 && (
            <button type="button" onClick={() => updateField('platforms', [...(data.platforms || []), { platform: '', url: '', followers: '' }])} className="w-full py-6 border-2 border-dashed border-blue-200 rounded-[24px] text-xs font-black uppercase text-blue-500 tracking-widest hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 mt-4">
              <Plus size={18} /> Add Social Profile
            </button>
          )}
        </div>
      </section>

      {/* SECTION: TECH ARSENAL */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <Code2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Tech Arsenal</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Mastered languages and frameworks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100">
            <label className="block text-xs font-black uppercase tracking-widest text-[#5C5246] mb-4">Core Programming Languages</label>
            <TagInput
              value={data.about?.languages || []}
              onChange={tags => updateAbout('languages', tags)}
              suggestions={['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++']}
              placeholder="Add language..."
            />
          </div>

          <div className="p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100">
            <label className="block text-xs font-black uppercase tracking-widest text-[#5C5246] mb-4">Full Tech Stack</label>
            <TagInput
              value={data.tech_stack || []}
              onChange={tags => updateField('tech_stack', tags)}
              suggestions={TECH_SUGGESTIONS}
              placeholder="Search tools & frameworks..."
            />
          </div>
        </div>
      </section>

      {/* SECTION: BUILT MASTERPIECES */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <Layout size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Built Masterpieces</h3>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Showcase your top repositories</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-neutral-100 rounded-full text-[10px] font-black uppercase text-neutral-400 tracking-widest">
            {data.projects?.length || 0} Slots Active
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {(data.projects || []).map((p: any, i: number) => (
            <div key={i} className="group p-10 bg-white border border-neutral-100 rounded-[48px] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.projects || [])]
                  pCopy.splice(i, 1)
                  updateField('projects', pCopy)
                }}
                className="absolute top-10 right-10 w-10 h-10 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex items-center justify-center z-50"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Media Selector */}
                <div className="relative h-64 rounded-[32px] overflow-hidden bg-neutral-50 border-4 border-dashed border-neutral-100 hover:border-blue-500 transition-all flex flex-col items-center justify-center group/media">
                  {p.url ? (
                    <>
                      <img src={getAssetUrl(p.url)} className="absolute inset-0 w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Plus size={32} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Replace Screenshot</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Layout size={28} className="text-blue-500" />
                      </div>
                      <span className="text-xs font-black uppercase text-neutral-900 tracking-widest">Project Screenshot</span>
                      <p className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-widest">Recommended: 1200x800</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onUpload) onUpload(file, `developer_project_media_${i}`).then(url => {
                        if (url) {
                          const pCopy = [...(data.projects || [])];
                          pCopy[i] = { ...p, url };
                          updateField('projects', pCopy);
                        }
                      });
                    }}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Project Name</label>
                      <input
                        type="text"
                        value={p.name || ''}
                        onChange={e => {
                          const pCopy = [...(data.projects || [])]
                          pCopy[i] = { ...p, name: e.target.value }
                          updateField('projects', pCopy)
                        }}
                        className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">GitHub Stars</label>
                      <input
                        type="number"
                        value={p.stars || 0}
                        onChange={e => {
                          const pCopy = [...(data.projects || [])]
                          pCopy[i] = { ...p, stars: Number(e.target.value) }
                          updateField('projects', pCopy)
                        }}
                        className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Description</label>
                    <textarea
                      rows={2}
                      value={p.description || ''}
                      onChange={e => {
                        const pCopy = [...(data.projects || [])]
                        pCopy[i] = { ...p, description: e.target.value }
                        updateField('projects', pCopy)
                      }}
                      className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Project Link</label>
                    <input
                      type="url"
                      value={p.live_url || p.github_url || ''}
                      onChange={e => {
                        const pCopy = [...(data.projects || [])]
                        pCopy[i] = { ...p, live_url: e.target.value, github_url: '' }
                        updateField('projects', pCopy)
                      }}
                      placeholder="https://github.com/... or https://yourproject.com"
                      className="w-full bg-[#F0F7FF] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              updateField('projects', [
                ...(data.projects || []),
                { name: 'New Project', description: '', stars: 0, github_url: '', live_url: '', tech: [] }
              ])
            }}
            className="w-full py-16 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[48px] hover:bg-blue-50 hover:border-blue-200 transition-all text-xs font-black uppercase text-blue-600 flex flex-col items-center justify-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
               <Plus size={32} />
            </div>
            Feature Another Masterpiece
          </button>
        </div>
      </section>

      {/* SECTION: COMMAND CENTER */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Command Center</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Upload your developer CV or Resume</p>
          </div>
        </div>

        <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-blue-500/5">
          <div className="flex items-center gap-8 p-10 border-4 border-dashed border-neutral-50 rounded-[32px] hover:border-blue-500 hover:bg-blue-50/50 transition-all group relative">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-neutral-400 group-hover:text-blue-500 shadow-xl transition-all">
              <FileText size={40} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black text-neutral-900 mb-1 tracking-tighter">
                {data.resume_url ? 'CV Deployed ✓' : 'Upload Resume / CV'}
              </h4>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                {data.resume_url ? 'Click to replace active document' : 'PDF Only • Max 5MB'}
              </p>
              {data.resume_url && (
                <a 
                  href={data.resume_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 tracking-widest"
                >
                  <Eye size={12} /> Live Preview Active
                </a>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onUpload) onUpload(file, 'resume');
              }}
              disabled={uploading}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-[32px] z-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
