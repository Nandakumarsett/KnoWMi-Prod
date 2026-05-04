import React from 'react'
import { TagInput } from '../TagInput'
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
    <div className="space-y-12">
      {/* SECTION: YOUR IDENTITY */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 1: Your Identity</h3>
        <div className="bg-white/5 p-6 rounded-[28px] border border-white/10 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Creator Tagline</label>
            <input
              type="text"
              maxLength={80}
              value={data.tagline || ''}
              onChange={e => updateField('tagline', e.target.value)}
              placeholder="e.g. Creating content that connects"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Creator Type</label>
            <input
              type="text"
              maxLength={50}
              value={data.type || ''}
              onChange={e => updateField('type', e.target.value)}
              placeholder="e.g. Visual Artist"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Featured Work Banner URL</label>
            <input
              type="url"
              value={data.featured_work_url || ''}
              onChange={e => updateField('featured_work_url', e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Specialty Formats</label>
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
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 2: Platforms</h3>
        <div className="space-y-4">
          {(data.platforms || []).map((p: any, i: number) => (
            <div key={i} className="p-5 rounded-[28px] bg-white/5 border border-white/10 space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.platforms || [])]
                  pCopy.splice(i, 1)
                  updateField('platforms', pCopy)
                }}
                className="absolute top-6 right-6 text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Platform Name</label>
                  <select
                    value={p.platform || ''}
                    onChange={e => {
                      const pCopy = [...(data.platforms || [])]
                      pCopy[i] = { ...p, platform: e.target.value }
                      updateField('platforms', pCopy)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
                  >
                    <option value="">Select Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="behance">Behance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Followers / Count</label>
                  <input
                    type="text"
                    value={p.followers || ''}
                    onChange={e => {
                      const pCopy = [...(data.platforms || [])]
                      pCopy[i] = { ...p, followers: e.target.value }
                      updateField('platforms', pCopy)
                    }}
                    placeholder="e.g. 128K"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Profile URL</label>
                <input
                  type="url"
                  value={p.url || ''}
                  onChange={e => {
                    const pCopy = [...(data.platforms || [])]
                    pCopy[i] = { ...p, url: e.target.value }
                    updateField('platforms', pCopy)
                  }}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
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
            className="w-full p-4 border border-dashed border-white/10 rounded-[28px] hover:bg-white/5 transition-colors text-xs font-black uppercase opacity-60 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add a platform card
          </button>
        </div>
      </section>

      {/* SECTION: SELECTED WORKS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 3: Selected Works</h3>
        <div className="space-y-4">
          {(data.works || []).map((work: any, i: number) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[28px] space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  const wCopy = [...(data.works || [])]
                  wCopy.splice(i, 1)
                  updateField('works', wCopy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Work Title</label>
                  <input
                    type="text"
                    value={work.title || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, title: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. Graphic Design Reel"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Work Type</label>
                  <select
                    value={work.type || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, type: e.target.value }
                      updateField('works', wCopy)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
                  >
                    <option value="image">Image / Graphic</option>
                    <option value="video">Video</option>
                    <option value="article">Article / Writing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Work URL</label>
                  <input
                    type="url"
                    value={work.url || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, url: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. https://instagram.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={work.thumbnail_url || ''}
                    onChange={e => {
                      const wCopy = [...(data.works || [])]
                      wCopy[i] = { ...work, thumbnail_url: e.target.value }
                      updateField('works', wCopy)
                    }}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
            className="w-full p-4 border border-dashed border-white/10 rounded-[28px] hover:bg-white/5 transition-colors text-xs font-black uppercase opacity-60 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another work item
          </button>
        </div>
      </section>
    </div>
  )
}
