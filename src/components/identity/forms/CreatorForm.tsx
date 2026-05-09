import React from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { Plus, Trash2 } from 'lucide-react'

interface CreatorFormProps {
  data: any
  onChange: (newData: any) => void
}

export function CreatorForm({ data = {}, onChange }: CreatorFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-24 items-start">
      {/* SECTION: YOUR IDENTITY */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Your Identity</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Creator Tagline</label>
            <input
              type="text"
              maxLength={80}
              value={data.tagline || ''}
              onChange={e => updateField('tagline', e.target.value)}
              placeholder="e.g. Creating content that connects"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Creator Type</label>
            <input
              type="text"
              maxLength={50}
              value={data.type || ''}
              onChange={e => updateField('type', e.target.value)}
              placeholder="e.g. Visual Artist"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Featured Work Banner URL</label>
            <input
              type="url"
              value={data.featured_work_url || ''}
              onChange={e => updateField('featured_work_url', e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Specialty Formats</label>
            <TagInput
              value={data.content_formats || []}
              onChange={formats => updateField('content_formats', formats)}
              suggestions={['Video', 'Photography', 'Design', 'Writing', 'Podcast']}
            />
          </div>
        </div>
      </section>

      {/* SECTION: PLATFORMS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Platforms</h3>
        <div className="space-y-4">
          {(data.platforms || []).map((p: any, i: number) => (
            <div key={i} className="p-8 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-8 relative">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.platforms || [])]
                  pCopy.splice(i, 1)
                  updateField('platforms', pCopy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Platform Name</label>
                  <select
                    value={p.platform || ''}
                    onChange={e => {
                      const pCopy = [...(data.platforms || [])]
                      pCopy[i] = { ...p, platform: e.target.value }
                      updateField('platforms', pCopy)
                    }}
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
                  >
                    <option value="">Select Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="behance">Behance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Followers / Count</label>
                  <input
                    type="text"
                    value={p.followers || ''}
                    onChange={e => {
                      const pCopy = [...(data.platforms || [])]
                      pCopy[i] = { ...p, followers: e.target.value }
                      updateField('platforms', pCopy)
                    }}
                    placeholder="e.g. 128K"
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Profile URL</label>
                <input
                  type="url"
                  value={p.url || ''}
                  onChange={e => {
                    const pCopy = [...(data.platforms || [])]
                    pCopy[i] = { ...p, url: e.target.value }
                    updateField('platforms', pCopy)
                  }}
                  placeholder="https://..."
                  className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateField('platforms', [
                ...(data.platforms || []),
                { platform: 'instagram', url: '', followers: '0' }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add a platform card
          </button>
        </div>
      </section>

      {/* SECTION: SELECTED WORKS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Selected Works</h3>
        <div className="space-y-4">
          {(data.works || []).map((work: any, i: number) => (
            <div key={i} className="p-6 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  const wCopy = [...(data.works || [])]
                  wCopy.splice(i, 1)
                  updateField('works', wCopy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Work Title</label>
                  <input
                    type="text"
                    value={work.title || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, title: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. Graphic Design Reel"
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Work Type</label>
                  <select
                    value={work.type || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, type: e.target.value }
                      updateField('works', wCopy)
                    }}
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
                  >
                    <option value="image">Image / Graphic</option>
                    <option value="video">Video</option>
                    <option value="article">Article / Writing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Work URL</label>
                  <input
                    type="url"
                    value={work.url || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, url: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. https://instagram.com/..."
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={work.thumbnail_url || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, thumbnail_url: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateField('works', [
                ...(data.works || []),
                { title: '', type: 'image', url: '', thumbnail_url: '' }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another work item
          </button>
        </div>
      </section>

      {/* SECTION: COLLAB PREFERENCES */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Collab Preferences</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Collab Types / Open To</label>
            <input
              type="text"
              value={data.collab_types || ''}
              onChange={e => updateField('collab_types', e.target.value)}
              placeholder="e.g. Freelance · Commissions · Full-time"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Contact Preference</label>
            <input
              type="text"
              value={data.contact_preference || ''}
              onChange={e => updateField('contact_preference', e.target.value)}
              placeholder="e.g. DM me on Instagram or Email"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION: ACHIEVEMENTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 5: Achievements</h3>
        <div className="space-y-4">
          {(data.achievements || []).map((ach: any, i: number) => (
            <div key={i} className="p-4 bg-white border border-[#E5D5C4] rounded-[12px] flex items-center gap-4 relative shadow-sm">
              <EmojiPicker
                value={ach.icon || '🏆'}
                onChange={emoji => {
                  const achCopy = [...(data.achievements || [])]
                  achCopy[i] = { ...ach, icon: emoji }
                  updateField('achievements', achCopy)
                }}
              />
              <input
                type="text"
                maxLength={50}
                value={ach.label || ''}
                onChange={e => {
                  const achCopy = [...(data.achievements || [])]
                  achCopy[i] = { ...ach, label: e.target.value }
                  updateField('achievements', achCopy)
                }}
                placeholder="e.g. Awwwards Winner 2023"
                className="flex-1 bg-transparent border-0 outline-none p-1 text-sm text-[#1A1A1A] focus:outline-none placeholder:text-[#8C8276]"
              />
              <button
                type="button"
                onClick={() => {
                  const achCopy = [...(data.achievements || [])]
                  achCopy.splice(i, 1)
                  updateField('achievements', achCopy)
                }}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateField('achievements', [
                ...(data.achievements || []),
                { icon: '🏆', label: 'Award Winner' }
              ])
            }}
            className="w-full p-3 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] text-xs font-black uppercase tracking-widest text-[#C1440E] flex items-center justify-center gap-2 hover:bg-[#FDF6EC] transition-all"
          >
            <Plus size={14} /> Add an achievement
          </button>
        </div>
      </section>
    </div>
  )
}
