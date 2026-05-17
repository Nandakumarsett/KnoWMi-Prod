import React from 'react'
import { TagInput } from '../TagInput'
import { 
  Plus, Trash2, Camera, Upload, 
  CheckCircle2, Globe, Layout, Sparkles, 
  BarChart3, MessageCircle, Info
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'

interface CreatorFormProps {
  data: any
  onChange: (newData: any) => void
  onUpload?: (file: File, type: string) => Promise<string | null>
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

  // Helper for consistent input styling (Orange themed for Creator)
  const inputBaseClasses = "w-full bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none placeholder:text-neutral-400";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  return (
    <div className="space-y-8 sm:space-y-12 py-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* SECTION: BRANDING & CONTACT */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles size={100} />
        </div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-900">Brand Identity & Contact</h3>
            <p className="text-xs font-medium text-neutral-500">Your profile banner and collaboration gateways</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Banner Upload */}
          <div className="flex flex-col">
            <label className={labelClasses}>Profile Banner</label>
            <div className="relative group flex-1 min-h-[160px]">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-200 hover:border-orange-400 transition-all flex flex-col items-center justify-center cursor-pointer relative">
                {data.featured_work_url ? (
                  <>
                    <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Banner Preview" />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Replace Banner Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-400 p-4 text-center">
                    <Camera size={28} className="text-orange-400" />
                    <div>
                      <span className="text-xs font-bold text-neutral-700">Upload Banner</span>
                      <p className="text-[10px] mt-0.5">1200x400 JPG/PNG</p>
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
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
             <div>
               <label className={labelClasses}>Professional Email</label>
               <input type="email" value={data.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} placeholder="hello@yourbrand.com" className={inputBaseClasses} />
             </div>
             <div>
               <label className={labelClasses}>WhatsApp Number</label>
               <input type="text" value={data.contact_whatsapp || ''} onChange={e => updateField('contact_whatsapp', e.target.value)} placeholder="+91 00000 00000" className={inputBaseClasses} />
             </div>
             <div>
               <label className={labelClasses}>Collaboration Interest</label>
               <textarea rows={2} value={data.collab_types || ''} onChange={e => updateField('collab_types', e.target.value)} placeholder="e.g. Open to UGC, Ambassadorships..." className={`${inputBaseClasses} resize-none`} />
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: TWO COLUMNS (METRICS & SOCIALS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* METRICS & FORMATS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Performance Metrics</h3>
              <p className="text-xs font-medium text-neutral-500">Your reach and specialties</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Total Reach</label>
                <input type="text" value={data.total_reach || ''} onChange={e => updateField('total_reach', e.target.value)} placeholder="e.g. 120K+" className={inputBaseClasses} />
              </div>
              <div>
                <label className={labelClasses}>Avg. Monthly Views</label>
                <input type="text" value={data.avg_views || ''} onChange={e => updateField('avg_views', e.target.value)} placeholder="e.g. 50K+" className={inputBaseClasses} />
              </div>
              <div className="col-span-2">
                <label className={labelClasses}>Engagement Rate</label>
                <input type="text" value={data.engagement_rate || ''} onChange={e => updateField('engagement_rate', e.target.value)} placeholder="e.g. 4.8%" className={inputBaseClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Specialty Content Formats</label>
              <TagInput 
                value={data.content_formats || []} 
                onChange={formats => updateField('content_formats', formats)} 
                suggestions={['Short-form Video', 'Commercial Photography', 'Digital Art', 'Podcasting']} 
                placeholder="Add format (e.g. Lifestyle Vlogs)" 
              />
            </div>
          </div>
        </section>

        {/* NETWORK PRESENCE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">Network Presence</h3>
                <p className="text-xs font-medium text-neutral-500">Max 6 platforms</p>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
              {(data.platforms || []).length}/6
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {(data.platforms || []).map((p: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl relative group">
                <button type="button" onClick={() => {
                  const pCopy = [...(data.platforms || [])]; pCopy.splice(i, 1); updateField('platforms', pCopy);
                }} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                  <Trash2 size={14} />
                </button>
                <div className="w-full sm:w-1/3">
                  <select value={p.platform || ''} onChange={e => {
                    const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, platform: e.target.value }; updateField('platforms', pCopy);
                  }} className={`${inputBaseClasses} py-2.5 appearance-none`}>
                    <option value="">Platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Threads">Threads</option>
                    <option value="Twitter / X">Twitter / X</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Behance">Behance</option>
                    <option value="Dribbble">Dribbble</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
                <div className="w-full sm:flex-1 grid grid-cols-2 gap-2">
                  <input type="text" value={p.followers || ''} onChange={e => {
                    const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, followers: e.target.value }; updateField('platforms', pCopy);
                  }} placeholder="Followers (e.g 10K)" className={`${inputBaseClasses} py-2.5`} />
                  <input type="url" value={p.url || ''} onChange={e => {
                    const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, url: e.target.value }; updateField('platforms', pCopy);
                  }} placeholder="https://..." className={`${inputBaseClasses} py-2.5`} />
                </div>
              </div>
            ))}
            
            {(data.platforms || []).length < 6 && (
              <button type="button" onClick={() => updateField('platforms', [...(data.platforms || []), { platform: '', url: '', followers: '' }])} className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2 mt-auto">
                <Plus size={16} /> Add Social Link
              </button>
            )}
          </div>
        </section>
      </div>

      {/* SECTION: CURATED PORTFOLIO */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
              <Layout size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Curated Portfolio</h3>
              <p className="text-xs font-medium text-neutral-500">Showcase your top 2 masterpieces</p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            {(data.works || []).length}/2
          </span>
        </div>

        <div className="space-y-6">
          {(data.works || []).map((work: any, i: number) => {
            const hasExternalUrl = !!work.external_url;
            return (
              <div key={i} className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-3xl relative group flex flex-col lg:flex-row gap-6">
                <button type="button" onClick={() => {
                  const wCopy = [...(data.works || [])]; wCopy.splice(i, 1); updateField('works', wCopy);
                }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                  <Trash2 size={16} />
                </button>

                {/* Masterpiece Media Selector */}
                <div className="w-full lg:w-56 h-40 rounded-2xl bg-white border border-neutral-200 overflow-hidden relative flex-shrink-0">
                  {!hasExternalUrl ? (
                    <div className="w-full h-full relative group/media cursor-pointer flex flex-col items-center justify-center">
                      {work.url ? (
                        <>
                          {work.type === 'video' ? (
                            <video src={getAssetUrl(work.url)} className="absolute inset-0 w-full h-full object-cover" muted />
                          ) : (
                            <img src={getAssetUrl(work.url)} className="absolute inset-0 w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                            <Upload size={20} className="mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Replace File</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-400">
                          <Upload size={24} className="text-orange-400" />
                          <div className="text-center">
                            <span className="text-[10px] font-bold uppercase text-neutral-500">Upload Media</span>
                            <p className="text-[9px] mt-0.5">Image/Video • Max 50MB</p>
                          </div>
                        </div>
                      )}
                      <input type="file" accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWorkUpload(file, i);
                      }} />
                      {uploading && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-orange-50 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                        <CheckCircle2 size={20} className="text-orange-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-orange-600">External Link Active</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 content-center">
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Work Title / Caption</label>
                    <input type="text" value={work.title || ''} onChange={e => { const wCopy = [...(data.works || [])]; wCopy[i] = { ...work, title: e.target.value }; updateField('works', wCopy) }} placeholder="e.g. Cinematic Lifestyle Reel" className={inputBaseClasses} />
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Media Source Type</label>
                    <select value={work.type || 'image'} onChange={e => { const wCopy = [...(data.works || [])]; wCopy[i] = { ...work, type: e.target.value }; updateField('works', wCopy) }} className={`${inputBaseClasses} appearance-none`}>
                      <option value="image">Still Graphic / Photo</option>
                      <option value="video">Motion / Video</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={labelClasses}>External Link (Optional)</label>
                    <input type="url" value={work.external_url && !work.external_url.includes('supabase.co') && !work.external_url.startsWith('/content/') ? work.external_url : ''} onChange={e => {
                      const wCopy = [...(data.works || [])];
                      wCopy[i] = { ...work, external_url: e.target.value, url: e.target.value ? '' : work.url };
                      updateField('works', wCopy);
                    }} placeholder="Paste YouTube/Vimeo Link" className={inputBaseClasses} />
                  </div>
                </div>
              </div>
            );
          })}

          {(data.works || []).length < 2 && (
            <button type="button" onClick={() => updateField('works', [...(data.works || []), { title: '', type: 'image', url: '', thumbnail_url: '', external_url: '' }])} className="w-full py-8 border-2 border-dashed border-neutral-200 rounded-3xl text-sm font-bold text-neutral-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Plus size={20} />
              </div>
              Add Another Masterpiece
            </button>
          )}
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
