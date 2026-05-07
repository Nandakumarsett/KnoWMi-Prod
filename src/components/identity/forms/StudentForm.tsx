import React from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { URLInput } from '../URLInput'
import { Plus, Trash2 } from 'lucide-react'

interface StudentFormProps {
  data: any
  onChange: (newData: any) => void
}

export function StudentForm({ data = {}, onChange }: StudentFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 items-start">
      {/* SECTION: CAMPUS LIFE */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Campus Life</h3>
        <div className="bg-white p-8 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-6">
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
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Thought Bubble Emoji</label>
            <EmojiPicker
              value={data.thought_bubble || '💭'}
              onChange={emoji => updateField('thought_bubble', emoji)}
            />
          </div>
        </div>
      </section>

      {/* SECTION: CAMPUS STATS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Campus Stats</h3>
        <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-[12px] border border-[#E5D5C4] shadow-sm">
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
      </section>

      {/* SECTION: PLAYLIST */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Vibe & Music</h3>
        <div className="bg-white p-8 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-6">
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
            <div key={i} className="p-6 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-4 relative">
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
