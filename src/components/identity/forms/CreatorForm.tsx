import React from 'react'
import { TagInput } from '../TagInput'
import { 
  Plus, Trash2, Camera, Upload, 
  CheckCircle2, Globe, Layout, Sparkles, 
  Clock, Briefcase, Users, Target
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

  const handlePastCollabUpload = async (file: File, index: number) => {
    if (!onUpload) return;
    const uploadedUrl = await onUpload(file, `collab_logo_${index}`);
    if (uploadedUrl) {
      const cCopy = [...(data.past_collaborations || [])];
      cCopy[index] = { ...cCopy[index], logo_url: uploadedUrl };
      updateField('past_collaborations', cCopy);
    }
  }

  // Helper for consistent input styling
  const inputBaseClasses = "w-full bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none placeholder:text-neutral-400";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";
  const charCountClasses = (current: number, max: number) => 
    `text-[10px] font-bold absolute right-3 top-1.5 ${current > max ? 'text-red-500' : 'text-neutral-400'}`;

  return (
    <div className="space-y-8 sm:space-y-12 py-6 animate-fadeIn max-w-4xl mx-auto pb-20">
      
      {/* BRAND & AESTHETIC */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles size={100} />
        </div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-900">Brand Identity & Aesthetic</h3>
            <p className="text-xs font-medium text-neutral-500">Your profile banner and core style</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Banner Upload */}
          <div className="flex flex-col">
            <label className={labelClasses}>Profile Banner</label>
            <div className="relative group flex-1 min-h-[160px]">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-200 hover:border-purple-400 transition-all flex flex-col items-center justify-center cursor-pointer relative">
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
                    <Camera size={28} className="text-purple-400" />
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
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <div className="relative">
               <label className={labelClasses}>Creator Tagline</label>
               <input type="text" value={data.tagline || ''} onChange={e => updateField('tagline', e.target.value.slice(0, 60))} placeholder="The one-liner strangers read" className={inputBaseClasses} />
               <span className={charCountClasses((data.tagline || '').length, 60)}>{(data.tagline || '').length}/60</span>
             </div>
             <div>
               <label className={labelClasses}>Visual Style (Aesthetic)</label>
               <select value={data.visual_style || ''} onChange={e => updateField('visual_style', e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                  <option value="">Select an Aesthetic</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Vibrant">Vibrant</option>
                  <option value="Moody">Moody</option>
               </select>
             </div>
             <div className="relative">
               <label className={labelClasses}>Posting Frequency</label>
               <input type="text" value={data.posting_frequency || ''} onChange={e => updateField('posting_frequency', e.target.value.slice(0, 20))} placeholder="e.g. 3x a week" className={inputBaseClasses} />
               <span className={charCountClasses((data.posting_frequency || '').length, 20)}>{(data.posting_frequency || '').length}/20</span>
             </div>
             <div>
               <label className={labelClasses}>Inside the Mind (Detailed Bio)</label>
               <textarea rows={3} value={data.bio || ''} onChange={e => updateField('bio', e.target.value)} placeholder="Tell the world your creative mission..." className={`${inputBaseClasses} resize-none`} />
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 & 2: AVAILABILITY & COLLAB PREFS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AVAILABILITY */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Availability Status</h3>
              <p className="text-xs font-medium text-neutral-500">Real-time signal for brands</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
               <label className={labelClasses}>Current Status</label>
               <select value={data.availability_status || ''} onChange={e => updateField('availability_status', e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Selective">Selective</option>
                  <option value="Fully booked">Fully booked</option>
               </select>
            </div>
            <div className="relative">
               <label className={labelClasses}>Expected Response Time</label>
               <input type="text" value={data.response_time || ''} onChange={e => updateField('response_time', e.target.value.slice(0, 30))} placeholder="e.g. Within 24 hours" className={inputBaseClasses} />
               <span className={charCountClasses((data.response_time || '').length, 30)}>{(data.response_time || '').length}/30</span>
            </div>
            <div className="relative">
               <label className={labelClasses}>Preferred Contact Method</label>
               <input type="text" value={data.preferred_contact_method || ''} onChange={e => updateField('preferred_contact_method', e.target.value.slice(0, 20))} placeholder="e.g. Email, DM" className={inputBaseClasses} />
               <span className={charCountClasses((data.preferred_contact_method || '').length, 20)}>{(data.preferred_contact_method || '').length}/20</span>
            </div>
            <div className="pt-4 border-t border-neutral-100">
               <label className={labelClasses}>Contact Email</label>
               <input type="email" value={data.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} placeholder="hello@yourbrand.com" className={inputBaseClasses} />
            </div>
            <div className="pt-4">
               <label className={labelClasses}>WhatsApp Number (Optional)</label>
               <input type="tel" value={data.contact_whatsapp || ''} onChange={e => updateField('contact_whatsapp', e.target.value)} placeholder="e.g. +1234567890" className={inputBaseClasses} />
               <p className="text-[10px] text-neutral-400 mt-1">Include country code without spaces or dashes</p>
            </div>
          </div>
        </section>

        {/* COLLAB PREFERENCES */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Collab Preferences</h3>
              <p className="text-xs font-medium text-neutral-500">How you work with brands</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className={labelClasses}>Collaboration Status</label>
              <input type="text" value={data.collab_types || ''} onChange={e => updateField('collab_types', e.target.value.slice(0, 30))} placeholder="e.g. Open to Freelancer, Open to Opportunities" className={inputBaseClasses} />
              <span className={charCountClasses((data.collab_types || '').length, 30)}>{(data.collab_types || '').length}/30</span>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 m-0">Collab Types (Max 4)</label>
                <span className="text-[10px] font-bold text-neutral-400">{(data.collab_types_tags || []).length}/4</span>
              </div>
              <TagInput 
                value={data.collab_types_tags || []} 
                onChange={tags => { if (tags.length <= 4) updateField('collab_types_tags', tags) }} 
                suggestions={['UGC', 'Sponsored Post', 'Event Coverage', 'Product Review', 'Ambassador']} 
                placeholder="Add type" 
              />
            </div>
            <div>
              <label className={labelClasses}>Rate Range in ₹ (Optional)</label>
              <div className="flex gap-4">
                 <input type="number" value={data.rate_range_min || ''} onChange={e => updateField('rate_range_min', Number(e.target.value) || undefined)} placeholder="Min ₹" className={inputBaseClasses} />
                 <input type="number" value={data.rate_range_max || ''} onChange={e => updateField('rate_range_max', Number(e.target.value) || undefined)} placeholder="Max ₹" className={inputBaseClasses} />
              </div>
            </div>
            <div className="relative">
               <label className={labelClasses}>Typical Turnaround</label>
               <input type="text" value={data.turnaround_time || ''} onChange={e => updateField('turnaround_time', e.target.value.slice(0, 30))} placeholder="e.g. 5-7 business days" className={inputBaseClasses} />
               <span className={charCountClasses((data.turnaround_time || '').length, 30)}>{(data.turnaround_time || '').length}/30</span>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 m-0">Deliverable Formats (Max 5)</label>
                <span className="text-[10px] font-bold text-neutral-400">{(data.deliverable_formats || []).length}/5</span>
              </div>
              <TagInput 
                value={data.deliverable_formats || []} 
                onChange={tags => { if (tags.length <= 5) updateField('deliverable_formats', tags) }} 
                suggestions={['Reels', 'Shorts', 'Carousels', 'Raw Footage']} 
                placeholder="Add format" 
              />
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 3: AUDIENCE SNAPSHOT */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-sm">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-900">Audience Snapshot</h3>
            <p className="text-xs font-medium text-neutral-500">Quick self-declared demographics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div className="relative">
             <label className={labelClasses}>Primary Age Group</label>
             <input type="text" value={data.audience_age_group || ''} onChange={e => updateField('audience_age_group', e.target.value.slice(0, 20))} placeholder="e.g. 18-24" className={inputBaseClasses} />
             <span className={charCountClasses((data.audience_age_group || '').length, 20)}>{(data.audience_age_group || '').length}/20</span>
           </div>
           <div className="relative">
             <label className={labelClasses}>Creator Location (Base)</label>
             <input type="text" value={data.location || ''} onChange={e => updateField('location', e.target.value.slice(0, 20))} placeholder="e.g. Gudur" className={inputBaseClasses} />
             <span className={charCountClasses((data.location || '').length, 20)}>{(data.location || '').length}/20</span>
           </div>
        </div>
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 m-0">Top Interests (Max 5, 20 chars each)</label>
            <span className="text-[10px] font-bold text-neutral-400">{(data.audience_interests || []).length}/5</span>
          </div>
          <TagInput 
            value={data.audience_interests || []} 
            onChange={tags => { if (tags.length <= 5) updateField('audience_interests', tags.map(t => t.slice(0, 20))) }} 
            suggestions={['Tech', 'Fashion', 'Gaming', 'Fitness', 'Finance']} 
            placeholder="Add interest" 
          />
        </div>
      </section>

      {/* SECTION 5: PAST COLLABORATIONS */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Past Collaborations</h3>
              <p className="text-xs font-medium text-neutral-500">Showcase up to 3 major brand deals</p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            {(data.past_collaborations || []).length}/3
          </span>
        </div>

        <div className="space-y-6">
          {(data.past_collaborations || []).map((collab: any, i: number) => (
            <div key={i} className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-3xl relative group flex flex-col sm:flex-row gap-6">
              <button type="button" onClick={() => {
                const cCopy = [...(data.past_collaborations || [])]; cCopy.splice(i, 1); updateField('past_collaborations', cCopy);
              }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                <Trash2 size={16} />
              </button>

              <div className="w-24 h-24 rounded-2xl bg-white border border-neutral-200 overflow-hidden relative flex-shrink-0">
                <div className="w-full h-full relative group/media cursor-pointer flex flex-col items-center justify-center">
                  {collab.logo_url ? (
                    <>
                      <img src={getAssetUrl(collab.logo_url)} className="absolute inset-0 w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
                        <Upload size={16} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-400">
                      <Upload size={20} className="text-indigo-400" />
                      <span className="text-[9px] font-bold uppercase text-neutral-500 text-center px-1">Logo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePastCollabUpload(file, i);
                  }} />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4 content-center">
                <div className="relative">
                  <label className={labelClasses}>Brand Name</label>
                  <input type="text" value={collab.brand_name || ''} onChange={e => { const cCopy = [...(data.past_collaborations || [])]; cCopy[i] = { ...collab, brand_name: e.target.value.slice(0, 50) }; updateField('past_collaborations', cCopy) }} placeholder="e.g. Nike" className={inputBaseClasses} />
                  <span className={charCountClasses((collab.brand_name || '').length, 50)}>{(collab.brand_name || '').length}/50</span>
                </div>
                <div className="relative">
                  <label className={labelClasses}>Campaign Description</label>
                  <input type="text" value={collab.campaign_description || ''} onChange={e => { const cCopy = [...(data.past_collaborations || [])]; cCopy[i] = { ...collab, campaign_description: e.target.value.slice(0, 80) }; updateField('past_collaborations', cCopy) }} placeholder="e.g. Summer launch reel hitting 5M views" className={inputBaseClasses} />
                  <span className={charCountClasses((collab.campaign_description || '').length, 80)}>{(collab.campaign_description || '').length}/80</span>
                </div>
                <div>
                  <label className={labelClasses}>Reference Link (Optional)</label>
                  <input type="url" value={collab.link || ''} onChange={e => { const cCopy = [...(data.past_collaborations || [])]; cCopy[i] = { ...collab, link: e.target.value }; updateField('past_collaborations', cCopy) }} placeholder="https://..." className={inputBaseClasses} />
                </div>
              </div>
            </div>
          ))}

          {(data.past_collaborations || []).length < 3 && (
            <button type="button" onClick={() => updateField('past_collaborations', [...(data.past_collaborations || []), { brand_name: '', campaign_description: '', logo_url: '', link: '' }])} className="w-full py-6 border-2 border-dashed border-neutral-200 rounded-3xl text-sm font-bold text-neutral-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Plus size={20} />
              </div>
              Add Collaboration
            </button>
          )}
        </div>
      </section>

      {/* CURATED PORTFOLIO (Existing logic kept for backward compatibility/value) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
              <Layout size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Showcase Gallery</h3>
              <p className="text-xs font-medium text-neutral-500">Up to 2 masterpieces</p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            {(data.works || []).length}/2
          </span>
        </div>

        <div className="space-y-6">
          {(data.works || []).map((work: any, i: number) => {
            return (
              <div key={i} className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-3xl relative group flex flex-col lg:flex-row gap-6">
                <button type="button" onClick={() => {
                  const wCopy = [...(data.works || [])]; wCopy.splice(i, 1); updateField('works', wCopy);
                }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                  <Trash2 size={16} />
                </button>

                <div className="w-full lg:w-56 h-40 rounded-2xl bg-white border border-neutral-200 overflow-hidden relative flex-shrink-0">
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
                        </div>
                      </div>
                    )}
                    <input type="file" accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleWorkUpload(file, i);
                    }} />
                  </div>
                </div>

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
                      wCopy[i] = { ...work, external_url: e.target.value };
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

      {/* NETWORK PRESENCE (Socials) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm">
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
            <button type="button" onClick={() => updateField('platforms', [...(data.platforms || []), { platform: '', url: '', followers: '' }])} className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 hover:text-sky-600 hover:border-sky-300 transition-all flex items-center justify-center gap-2 mt-auto">
              <Plus size={16} /> Add Social Link
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
