import React from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { 
  Plus, Trash2, Camera, Film, Upload, 
  CheckCircle2, TrendingUp, Share2, 
  Globe, Layout, Sparkles, BarChart3, MessageCircle
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'

interface CreatorFormProps {
  data: any
  onChange: (newData: any) => void
  onUpload?: (file: File, type: string) => Promise<void>
  uploading?: boolean
}

export function CreatorForm({ data = {}, onChange, onUpload, uploading }: CreatorFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  const handleWorkUpload = async (file: File, index: number) => {
    if (!onUpload) return;
    const isVideo = file.type.startsWith('video');
    const uploadedUrl = await onUpload(file, `work_media_${index}`);
    
    if (uploadedUrl) {
      const wCopy = [...(data.works || [])];
      wCopy[index] = { 
        ...wCopy[index], 
        url: uploadedUrl, 
        type: isVideo ? 'video' : 'image' 
      };
      updateField('works', wCopy);
    }
  }

  return (
    <div className="space-y-24 py-10 animate-fadeIn">
      
      {/* SECTION: BRANDING & SPECIALTY */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Core Branding</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Define your specialty and key stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Specialty Formats */}
          <div className="p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100">
            <label className="block text-xs font-black uppercase tracking-widest text-[#5C5246] mb-4">Specialty Content Formats</label>
            <TagInput
              value={data.content_formats || []}
              onChange={formats => updateField('content_formats', formats)}
              suggestions={['Short-form Video', 'Commercial Photography', 'Digital Art', 'Podcasting', 'Creative Direction']}
              placeholder="Add format (e.g. Travel Cinematography)"
            />
          </div>

          {/* Creator Metrics Dashboard */}
          <div className="p-10 bg-white border border-[#E5D5C4] rounded-[40px] shadow-xl shadow-orange-500/5 space-y-10">
             <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                  <BarChart3 size={20} />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Performance Metrics</h4>
                   <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Manually verified creator stats</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Reach</label>
                  <input
                    type="text"
                    value={data.total_reach || ''}
                    onChange={e => updateField('total_reach', e.target.value)}
                    placeholder="e.g. 120K+"
                    className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Engagement Rate</label>
                  <input
                    type="text"
                    value={data.engagement_rate || ''}
                    onChange={e => updateField('engagement_rate', e.target.value)}
                    placeholder="e.g. 4.8%"
                    className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">Avg. Monthly Views</label>
                  <input
                    type="text"
                    value={data.avg_views || ''}
                    onChange={e => updateField('avg_views', e.target.value)}
                    placeholder="e.g. 50K+"
                    className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none"
                  />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: PLATFORMS Presence */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Network Presence</h3>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Connect your digital ecosystems (Max 6)</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-neutral-100 rounded-full text-[10px] font-black uppercase text-neutral-400 tracking-widest">
            {data.platforms?.length || 0} / 6 Slots
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {(data.platforms || []).map((p: any, i: number) => (
            <div key={i} className="group p-10 bg-white border border-neutral-100 rounded-[40px] shadow-sm hover:shadow-xl hover:border-orange-200 transition-all relative">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.platforms || [])]
                  pCopy.splice(i, 1)
                  updateField('platforms', pCopy)
                }}
                className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Primary Platform</label>
                    <select
                      value={p.platform || ''}
                      onChange={e => {
                        const pCopy = [...(data.platforms || [])]
                        pCopy[i] = { ...p, platform: e.target.value }
                        updateField('platforms', pCopy)
                      }}
                      className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all appearance-none"
                    >
                      <option value="">Select Platform</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Threads">Threads</option>
                      <option value="Twitter / X">Twitter / X</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Behance">Behance</option>
                      <option value="Dribbble">Dribbble</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Follower Count</label>
                    <input
                      type="text"
                      value={p.followers || ''}
                      onChange={e => {
                        const pCopy = [...(data.platforms || [])]
                        pCopy[i] = { ...p, followers: e.target.value }
                        updateField('platforms', pCopy)
                      }}
                      placeholder="e.g. 128K"
                      className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400">Profile URL</label>
                  <input
                    type="url"
                    value={p.url || ''}
                    onChange={e => {
                      const pCopy = [...(data.platforms || [])]
                      pCopy[i] = { ...p, url: e.target.value }
                      updateField('platforms', pCopy)
                    }}
                    placeholder={(() => {
                      const platform = p.platform?.toLowerCase();
                      if (platform === 'instagram') return 'https://instagram.com/username';
                      if (platform === 'youtube') return 'https://youtube.com/@username';
                      if (platform === 'threads') return 'https://threads.net/@username';
                      if (platform === 'twitter / x' || platform === 'twitter') return 'https://x.com/username';
                      if (platform === 'linkedin') return 'https://linkedin.com/in/username';
                      if (platform === 'facebook') return 'https://facebook.com/username';
                      if (platform === 'behance') return 'https://behance.net/username';
                      if (platform === 'dribbble') return 'https://dribbble.com/username';
                      if (platform === 'medium') return 'https://medium.com/@username';
                      return 'https://social.com/username';
                    })()}
                    className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          {(data.platforms || []).length < 6 && (
            <button
              type="button"
              onClick={() => {
                updateField('platforms', [
                  ...(data.platforms || []),
                  { platform: '', url: '', followers: '' }
                ])
              }}
              className="w-full py-10 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[40px] hover:bg-orange-50 hover:border-orange-200 transition-all text-xs font-black uppercase text-orange-600 flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <Plus size={24} />
              </div>
              Add New Platform Card
            </button>
          )}
        </div>
      </section>

      {/* SECTION: SELECTED WORKS Showcase */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
              <Layout size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Curated Portfolio</h3>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Showcase your top 2 masterpieces</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-neutral-100 rounded-full text-[10px] font-black uppercase text-neutral-400 tracking-widest">
            {data.works?.length || 0} / 2 Slots
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {(data.works || []).map((work: any, i: number) => {
            const hasExternalUrl = !!work.external_url;
            return (
              <div key={i} className="group p-10 bg-white border border-neutral-100 rounded-[48px] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    const wCopy = [...(data.works || [])]
                    wCopy.splice(i, 1)
                    updateField('works', wCopy)
                  }}
                  className="absolute top-10 right-10 w-10 h-10 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex items-center justify-center z-50"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Media Selector Container */}
                  <div className="relative">
                    {!hasExternalUrl ? (
                      <div className="relative h-64 rounded-[32px] overflow-hidden bg-neutral-50 border-4 border-dashed border-neutral-100 hover:border-orange-500 transition-all flex flex-col items-center justify-center group/media">
                        {work.url ? (
                          <>
                            {work.type === 'video' ? (
                              <video src={getAssetUrl(work.url)} className="absolute inset-0 w-full h-full object-cover" muted />
                            ) : (
                              <img src={getAssetUrl(work.url)} className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                               <div className="w-12 h-12 rounded-full bg-green-500/20 backdrop-blur-md flex items-center justify-center border border-green-500/50 mb-4 scale-75 group-hover/media:scale-100 transition-transform">
                                  <CheckCircle2 size={24} className="text-green-500" />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 mb-2">Masterpiece Uploaded</span>
                               <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{work.type === 'video' ? 'Motion Video' : 'Still Image'}</span>
                               <div className="mt-6 px-6 py-2 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-900">Replace File</div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                              <Upload size={28} className="text-orange-500" />
                            </div>
                            <span className="text-xs font-black uppercase text-neutral-900 tracking-widest">Click to Upload Media</span>
                            <p className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-widest">Image or Video • Max 50MB</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleWorkUpload(file, i);
                          }}
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 rounded-[32px] bg-orange-50 flex flex-col items-center justify-center border-4 border-orange-100 p-10 text-center animate-pulse-subtle">
                         <div className="w-20 h-20 rounded-[24px] bg-white shadow-xl flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} className="text-orange-500" />
                         </div>
                         <h5 className="text-sm font-black uppercase text-orange-600 mb-2">External Link Active</h5>
                         <p className="text-[10px] text-orange-400 uppercase font-bold tracking-widest">File upload disabled for this slot</p>
                      </div>
                    )}
                  </div>

                  {/* Details Container */}
                  <div className="flex flex-col justify-center space-y-8">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Work Title / Caption</label>
                      <input
                        type="text"
                        value={work.title || ''}
                        onChange={e => {
                          const wCopy = [...(data.works || [])]
                          wCopy[i] = { ...work, title: e.target.value }
                          updateField('works', wCopy)
                        }}
                        placeholder="e.g. Cinematic Lifestyle Reel 2024"
                        className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Media Source</label>
                        <select
                          value={work.type || 'image'}
                          onChange={e => {
                            const wCopy = [...(data.works || [])]
                            wCopy[i] = { ...work, type: e.target.value }
                            updateField('works', wCopy)
                          }}
                          className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all appearance-none"
                        >
                          <option value="image">Still Graphic / Photo</option>
                          <option value="video">Motion / Video</option>
                        </select>
                      </div>
                        <div className="flex flex-col justify-end">
                          <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">External Link (Optional)</label>
                          <input
                            type="url"
                            value={work.external_url && !work.external_url.includes('supabase.co') && !work.external_url.startsWith('/content/') ? work.external_url : ''}
                            onChange={e => {
                              const wCopy = [...(data.works || [])]
                              wCopy[i] = { 
                                ...work, 
                                external_url: e.target.value, 
                                url: e.target.value ? '' : work.url 
                              }
                              updateField('works', wCopy)
                            }}
                            placeholder="Paste YouTube/Vimeo Link"
                            className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] outline-none focus:bg-white focus:border-[#C1440E] transition-all"
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {(data.works || []).length < 2 && (
            <button
              type="button"
              onClick={() => {
                updateField('works', [
                  ...(data.works || []),
                  { title: '', type: 'image', url: '', thumbnail_url: '', external_url: '' }
                ])
              }}
              className="w-full py-16 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[48px] hover:bg-orange-50 hover:border-orange-200 transition-all text-xs font-black uppercase text-orange-600 flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Plus size={32} />
              </div>
              Feature Another Masterpiece
            </button>
          )}
        </div>
      </section>

      {/* SECTION: ENGAGEMENT & COLLABS */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#1A1A1A]">Engagement & Collabs</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Direct contact gateways for brands</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400">Professional Email</label>
              <input
                type="email"
                value={data.contact_email || ''}
                onChange={e => updateField('contact_email', e.target.value)}
                placeholder="hello@yourbrand.com"
                className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400">WhatsApp Number</label>
              <input
                type="text"
                value={data.contact_whatsapp || ''}
                onChange={e => updateField('contact_whatsapp', e.target.value)}
                placeholder="+91 00000 00000"
                className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400">Collaboration Interest</label>
            <textarea
              rows={2}
              value={data.collab_types || ''}
              onChange={e => updateField('collab_types', e.target.value)}
              placeholder="e.g. Open to UGC, Brand Ambassadorships, and Event Appearances."
              className="w-full bg-[#FDF6EC] border-2 border-transparent rounded-[24px] px-6 py-4 text-sm font-bold text-[#1A1A1A] focus:bg-white focus:border-[#C1440E] transition-all outline-none resize-none"
            />
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
        .animate-pulse-subtle {
          animation: pulseSubtle 3s ease-in-out infinite;
        }
        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
