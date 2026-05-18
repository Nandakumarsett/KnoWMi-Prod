import React from 'react'
import { TagInput } from '../TagInput'
import { URLInput } from '../URLInput'
import { 
  Plus, Trash2, FileText, Globe, Eye, 
  GraduationCap, Music, Rocket, Users, 
  ShieldCheck, Sparkles, BookOpen, Layout,
  Upload, Camera, Github, MessageCircle
} from 'lucide-react'
import { EmojiPicker } from '../EmojiPicker'
import { getAssetUrl } from '../../../lib/supabase'

interface StudentFormProps {
  data: any
  onChange: (newData: any) => void
  onUpload?: (file: File, type: string) => Promise<string | null>
  uploading?: boolean
}

export function StudentForm({ data = {}, onChange, onUpload, uploading }: StudentFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  // Helper for consistent input styling
  const inputBaseClasses = "w-full bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none placeholder:text-neutral-400";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  return (
    <div className="space-y-8 sm:space-y-12 py-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* SECTION: ABOUT ME & AESTHETICS (COMBINED) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen size={100} />
        </div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-900">Identity & Story</h3>
            <p className="text-xs font-medium text-neutral-500">Your visual banner and personal pitch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Banner Upload */}
          <div className="flex flex-col">
            <label className={labelClasses}>Profile Banner</label>
            <div className="relative group flex-1 min-h-[160px]">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-200 hover:border-emerald-400 transition-all flex flex-col items-center justify-center cursor-pointer relative">
                {data.featured_work_url ? (
                  <>
                    <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Banner Preview" />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Camera size={24} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Change Banner</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-400 p-4 text-center">
                    <Camera size={28} className="text-emerald-400" />
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
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col">
             <label className={labelClasses}>Your Story / Bio</label>
             <textarea
              rows={6}
              value={data.bio || data.about_me || ''}
              onChange={e => onChange({ ...data, bio: e.target.value, about_me: e.target.value })}
              placeholder="What drives you? What are you learning right now?"
              className={`${inputBaseClasses} flex-1 resize-none`}
            />
          </div>
        </div>
      </section>
      
      {/* SECTION: ACADEMIC CORE */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <GraduationCap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-900">Academic Core</h3>
            <p className="text-xs font-medium text-neutral-500">Your university footprint</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className={labelClasses}>University Name</label>
            <input type="text" value={data.university || ''} onChange={e => updateField('university', e.target.value)} placeholder="e.g. Stanford University" className={inputBaseClasses} />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <label className={labelClasses}>Course / Major</label>
            <input type="text" value={data.course || ''} onChange={e => updateField('course', e.target.value)} placeholder="e.g. Computer Science" className={inputBaseClasses} />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <label className={labelClasses}>Current Year</label>
            <select value={data.year || ''} onChange={e => updateField('year', e.target.value)} className={`${inputBaseClasses} appearance-none cursor-pointer`}>
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className={labelClasses}>Batch Year</label>
            <input type="text" value={data.batch_year || ''} onChange={e => updateField('batch_year', e.target.value)} placeholder="e.g. Class of 2024" className={inputBaseClasses} />
          </div>
          <div className="col-span-1">
            <label className={labelClasses}>Favorite Subject</label>
            <input type="text" value={data.favorite_subject || ''} onChange={e => updateField('favorite_subject', e.target.value)} placeholder="e.g. Machine Learning" className={inputBaseClasses} />
          </div>
          <div className="col-span-1">
            <label className={labelClasses}>Campus Mood</label>
            <select value={data.mood || ''} onChange={e => updateField('mood', e.target.value)} className={`${inputBaseClasses} appearance-none cursor-pointer`}>
              <option value="">Select Mood</option>
              <option value="Grinding 📚">Grinding 📚</option>
              <option value="Vibing 🎵">Vibing 🎵</option>
              <option value="Loving it 🚀">Loving it 🚀</option>
              <option value="Stressed ☕">Stressed ☕</option>
            </select>
          </div>
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-neutral-100 mt-2">
            <div>
              <label className={labelClasses}>Portfolio / Website</label>
              <div className="relative">
                <input type="url" value={data.website || ''} onChange={e => updateField('website', e.target.value)} placeholder="https://yourdomain.com" className={`${inputBaseClasses} pl-10`} />
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Currently Open To</label>
              <input type="text" value={data.availability || ''} onChange={e => updateField('availability', e.target.value)} placeholder="e.g. Summer 2025 Internships" className={inputBaseClasses} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TWO COLUMNS (PROFESSIONAL & ECOSYSTEM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PROFESSIONAL GATEWAY */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Professional Gateway</h3>
              <p className="text-xs font-medium text-neutral-500">Skills and metrics</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Campus Rank (%)</label>
                <div className="relative">
                  <input type="number" min={1} max={100} value={data.campus_rank_pct || ''} onChange={e => updateField('campus_rank_pct', Number(e.target.value))} placeholder="e.g. 5" className={inputBaseClasses} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400">%</span>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Study Buddies</label>
                <input type="number" value={data.study_buddies || ''} onChange={e => updateField('study_buddies', Number(e.target.value))} placeholder="e.g. 15" className={inputBaseClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Core Skills / Superpowers</label>
              <TagInput value={data.core_skills || []} onChange={tags => updateField('core_skills', tags)} suggestions={['React', 'Figma', 'Python', 'Public Speaking']} placeholder="Enter skills..." />
            </div>
            
            <div>
              <label className={labelClasses}>Hobbies & Interests</label>
              <TagInput value={data.hobbies || []} onChange={tags => updateField('hobbies', tags)} suggestions={['Photography', 'Gaming', 'Reading']} placeholder="Enter hobbies..." />
            </div>

            <div className="pt-2">
              <label className={labelClasses}>Academic CV (PDF)</label>
              <div className="relative flex items-center gap-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-orange-400 shadow-sm">
                  <FileText size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-neutral-900 truncate">{data.resume_url ? 'Resume Attached ✓' : 'Upload Resume'}</p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{data.resume_url ? 'Click to replace file' : 'Max 5MB'}</p>
                </div>
                <input type="file" accept=".pdf" disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpload) onUpload(file, 'resume');
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE ECOSYSTEM & VIBES */}
        <section className="flex flex-col gap-8">
          
          {/* ECOSYSTEM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">Ecosystem</h3>
                <p className="text-xs font-medium text-neutral-500">Clubs and events</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Clubs & Societies</label>
                <TagInput value={data.clubs || []} onChange={tags => updateField('clubs', tags)} placeholder="Add clubs..." />
              </div>
              <div>
                <label className={labelClasses}>Hackathons & Events</label>
                <TagInput value={data.hackathons || []} onChange={tags => updateField('hackathons', tags)} placeholder="Add events..." />
              </div>
            </div>
          </div>

          {/* VIBES */}
          <div className="bg-[#1A1A1A] rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Music size={80} />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <Music size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black">Campus Vibes</h3>
                <p className="text-xs font-medium text-neutral-400">Your study playlist</p>
              </div>
            </div>
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Playlist Name</label>
                <input type="text" value={data.playlist_name || ''} onChange={e => updateField('playlist_name', e.target.value)} placeholder="e.g. Deep Focus" className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:bg-white/10 focus:border-emerald-400 transition-all outline-none placeholder:text-neutral-600" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Spotify/Apple URL</label>
                <input type="url" value={data.playlist_url || ''} onChange={e => updateField('playlist_url', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:bg-white/10 focus:border-emerald-400 transition-all outline-none placeholder:text-neutral-600" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: DIGITAL FOOTPRINT & CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DIRECT CONTACT */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Direct Contact</h3>
              <p className="text-xs font-medium text-neutral-500">How to reach you</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className={labelClasses}>Professional Email</label>
              <input type="email" value={data.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} placeholder="hello@example.com" className={inputBaseClasses} />
            </div>
            <div>
              <label className={labelClasses}>Quick Talk URL (Calendly, etc)</label>
              <input type="url" value={data.quick_talk_url || ''} onChange={e => updateField('quick_talk_url', e.target.value)} placeholder="https://..." className={inputBaseClasses} />
            </div>
          </div>
        </section>

        {/* NETWORK PRESENCE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">Social Links</h3>
                <p className="text-xs font-medium text-neutral-500">Max 4 platforms</p>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
              {(data.platforms || []).length}/4
            </span>
          </div>

          <div className="space-y-4">
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
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="Behance">Behance</option>
                    <option value="Medium">Medium</option>
                    <option value="Discord">Discord</option>
                  </select>
                </div>
                <div className="w-full sm:flex-1">
                  <input type="url" value={p.url || ''} onChange={e => {
                    const pCopy = [...(data.platforms || [])]; pCopy[i] = { ...p, url: e.target.value }; updateField('platforms', pCopy);
                  }} placeholder="https://..." className={`${inputBaseClasses} py-2.5`} />
                </div>
              </div>
            ))}
            
            {(data.platforms || []).length < 4 && (
              <button type="button" onClick={() => updateField('platforms', [...(data.platforms || []), { platform: '', url: '' }])} className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 hover:text-indigo-600 hover:border-indigo-300 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Social Link
              </button>
            )}
          </div>
        </section>
      </div>

      {/* SECTION: INNOVATION LAB */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Rocket size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Innovation Lab</h3>
              <p className="text-xs font-medium text-neutral-500">Showcase your top projects (Max 3)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            {(data.projects || []).length}/3
          </span>
        </div>

        <div className="space-y-6">
          {(data.projects || []).map((p: any, i: number) => (
            <div key={i} className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-3xl relative group flex flex-col lg:flex-row gap-6">
              <button type="button" onClick={() => {
                const pCopy = [...(data.projects || [])]; pCopy.splice(i, 1); updateField('projects', pCopy);
              }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white">
                <Trash2 size={16} />
              </button>

              {/* Project Image */}
              <div className="w-full lg:w-48 h-40 rounded-2xl bg-white border border-neutral-200 overflow-hidden relative group/img flex-shrink-0 cursor-pointer flex items-center justify-center">
                {p.url ? (
                  <>
                    <img src={getAssetUrl(p.url)} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Camera size={20} className="mb-1" />
                      <span className="text-[9px] font-bold uppercase">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <Layout size={24} className="text-neutral-300" />
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Add Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpload) onUpload(file, `student_project_media_${i}`).then(url => {
                    if (url) { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, url }; updateField('projects', pCopy); }
                  });
                }} />
              </div>

              {/* Project Details */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 flex gap-4">
                  <div>
                    <label className={labelClasses}>Icon</label>
                    <EmojiPicker value={p.emoji || '🚀'} onChange={emoji => { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, emoji }; updateField('projects', pCopy) }} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClasses}>Project Name</label>
                    <input type="text" value={p.name || ''} onChange={e => { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, name: e.target.value }; updateField('projects', pCopy) }} placeholder="Name" className={inputBaseClasses} />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Short Description</label>
                  <input type="text" value={p.description || ''} onChange={e => { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, description: e.target.value }; updateField('projects', pCopy) }} placeholder="What does this do?" className={inputBaseClasses} />
                </div>

                <div>
                  <label className={labelClasses}>GitHub URL</label>
                  <div className="relative">
                    <input type="url" value={p.github_url || ''} onChange={e => { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, github_url: e.target.value }; updateField('projects', pCopy) }} placeholder="https://..." className={`${inputBaseClasses} pl-10`} />
                    <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Core Tech (Tags)</label>
                  <TagInput value={p.tech || []} onChange={tech => { const pCopy = [...(data.projects || [])]; pCopy[i] = { ...p, tech }; updateField('projects', pCopy) }} placeholder="React, Node..." />
                </div>
              </div>
            </div>
          ))}

          {(data.projects || []).length < 3 && (
            <button type="button" onClick={() => updateField('projects', [...(data.projects || []), { name: '', description: '', url: '', emoji: '🚀', tech: [], github_url: '' }])} className="w-full py-8 border-2 border-dashed border-neutral-200 rounded-3xl text-sm font-bold text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Plus size={20} />
              </div>
              Feature New Project
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
