import React from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { URLInput } from '../URLInput'
import { Plus, Trash2, FileText, Globe, Eye } from 'lucide-react'

interface StudentFormProps {
  data: any
  onChange: (newData: any) => void
  onUpload?: (file: File, type: string) => Promise<void>
  uploading?: boolean
}

export function StudentForm({ data = {}, onChange, onUpload, uploading }: StudentFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-24 items-start">
      {/* SECTION: CAMPUS LIFE */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Campus Life</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">University Name</label>
            <input
              type="text"
              value={data.university || ''}
              onChange={e => updateField('university', e.target.value)}
              placeholder="e.g. IIT Madras"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Personal Website / Portfolio</label>
            <div className="relative">
              <input
                type="url"
                value={data.website || ''}
                onChange={e => updateField('website', e.target.value)}
                placeholder="https://yourname.com"
                className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 pl-10 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
              />
              <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Course / Major</label>
            <input
              type="text"
              value={data.course || ''}
              onChange={e => updateField('course', e.target.value)}
              placeholder="e.g. B.Tech Computer Science"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Year</label>
              <select
                value={data.year || ''}
                onChange={e => updateField('year', e.target.value)}
                className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Mood Tag</label>
              <select
                value={data.mood || ''}
                onChange={e => updateField('mood', e.target.value)}
                className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
              >
                <option value="">Select Mood</option>
                <option value="Grinding 📚">Grinding 📚</option>
                <option value="Vibing 🎵">Vibing 🎵</option>
                <option value="Loving it 🚀">Loving it 🚀</option>
                <option value="Stressed ☕">Stressed ☕</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CAREER ASSETS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Career Assets</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-4">Professional Resume (PDF)</label>
            <div className="flex items-center gap-6 p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group relative">
              <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-white group-hover:text-orange-500 transition-all">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase text-neutral-900 mb-0.5">
                  {data.resume_url ? 'Resume Uploaded ✓' : 'Upload Resume'}
                </h4>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                  {data.resume_url ? 'Click to replace with new PDF' : 'Max 5MB • PDF Only'}
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpload) onUpload(file, 'resume');
                }}
                disabled={uploading}
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {data.resume_url && (
              <a 
                href={data.resume_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 tracking-widest"
              >
                <Eye size={12} /> View Current Resume
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Campus Rank <span className="text-orange-500">(%)</span></label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={data.campus_rank_pct || ''}
                  onChange={e => updateField('campus_rank_pct', Number(e.target.value))}
                  placeholder="5"
                  className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 pr-10 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#8C8276]">%</span>
            </div>
            <p className="text-[10px] text-[#8C8276] mt-1 font-bold">Enter a number — e.g. 5 means Top 5%</p>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Study Buddies</label>
            <input
              type="number"
              min={0}
              value={data.study_buddies || ''}
              onChange={e => updateField('study_buddies', Number(e.target.value))}
              placeholder="e.g. 8"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
            <p className="text-[10px] text-[#8C8276] mt-1 font-bold">Number of people you study with</p>
          </div>
        </div>
      </div>
    </section>

      {/* SECTION: PLAYLIST */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Vibe & Music</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Spotify Playlist URL</label>
            <URLInput
              value={data.playlist_url || ''}
              onChange={url => updateField('playlist_url', url)}
              placeholder="https://open.spotify.com/..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Playlist Name / Label</label>
            <input
              type="text"
              value={data.playlist_name || ''}
              onChange={e => updateField('playlist_name', e.target.value)}
              placeholder="e.g. 🎧 My Study Beats"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION: PROJECTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Projects</h3>
        <div className="space-y-4">
          {(data.projects || []).map((p: any, i: number) => (
            <div key={i} className="p-8 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-8 relative">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.projects || []).filter((_: any, idx: number) => idx !== i)]
                  updateField('projects', pCopy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Media Upload Area */}
                <div className="relative h-40 rounded-2xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-200 hover:border-emerald-500 transition-all flex flex-col items-center justify-center group">
                  {p.url ? (
                    <>
                      <img src={getAssetUrl(p.url)} className="absolute inset-0 w-full h-full object-cover" alt="Project Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Media</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Plus size={24} className="text-neutral-300 mb-2" />
                      <span className="text-[10px] font-black uppercase text-neutral-400">Project Thumbnail</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onUpload) onUpload(file, `student_project_media_${i}`);
                    }}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <EmojiPicker
                      value={p.emoji || '🚀'}
                      onChange={emoji => {
                        const pCopy = [...(data.projects || [])]
                        pCopy[i] = { ...p, emoji }
                        updateField('projects', pCopy)
                      }}
                    />
                    <div className="flex-1">
                      <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Project Name</label>
                      <input
                        type="text"
                        value={p.name || ''}
                        onChange={e => {
                          const pCopy = [...(data.projects || [])]
                          pCopy[i] = { ...p, name: e.target.value }
                          updateField('projects', pCopy)
                        }}
                        className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                      />
                    </div>
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
                { name: 'Untitled Project', emoji: '🚀', tech: [] }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase tracking-widest text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another project
          </button>
        </div>
      </section>

      {/* SECTION: HACKATHONS & CLUBS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Extracurriculars</h3>
        <div className="bg-white p-6 rounded-[12px] border border-[#E5D5C4] shadow-sm space-y-6">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Hackathons & Events</label>
            <TagInput
              value={data.hackathons || []}
              onChange={tags => updateField('hackathons', tags)}
              suggestions={['NASA Space Apps', 'MLH Local Hack Day', 'EthGlobal', 'Devfolio', 'Google HashCode']}
              placeholder="Enter hackathon names..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Clubs & Societies</label>
            <TagInput
              value={data.clubs || []}
              onChange={tags => updateField('clubs', tags)}
              suggestions={['Computer Science Society', 'Robotics Club', 'Debate Team', 'Google Developer Student Club', 'Finance Society']}
              placeholder="Enter clubs..."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
