import React from 'react'
import { TagInput } from '../TagInput'
import { Plus, Trash2 } from 'lucide-react'

interface InfluencerFormProps {
  data: any
  onChange: (newData: any) => void
}

export function InfluencerForm({ data = {}, onChange }: InfluencerFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="space-y-12">
      {/* SECTION: YOUR IDENTITY */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Your Identity</h3>
        <div className="bg-white p-6 rounded-[12px] border border-[#E5D5C4] shadow-sm space-y-4">
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
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Niche / Categories</label>
            <TagInput
              value={data.categories || []}
              onChange={tags => updateField('categories', tags)}
              suggestions={['Fashion', 'Travel', 'Tech', 'Lifestyle', 'Food']}
            />
          </div>
        </div>
      </section>

      {/* SECTION: AUDIENCE METRICS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Audience Reach</h3>
        <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-[12px] border border-[#E5D5C4] shadow-sm">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Total Combined Reach</label>
            <input
              type="text"
              value={data.total_reach || ''}
              onChange={e => updateField('total_reach', e.target.value)}
              placeholder="e.g. 450K"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Avg Engagement Rate</label>
            <input
              type="text"
              value={data.avg_engagement || ''}
              onChange={e => updateField('avg_engagement', e.target.value)}
              placeholder="e.g. 6.2%"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION: PLATFORMS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Platforms</h3>
        <div className="space-y-4">
          {(data.platforms || []).map((p: any, i: number) => (
            <div key={i} className="p-5 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  const copy = [...(data.platforms || [])]
                  copy.splice(i, 1)
                  updateField('platforms', copy)
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
                      const copy = [...(data.platforms || [])]
                      copy[i] = { ...p, platform: e.target.value }
                      updateField('platforms', copy)
                    }}
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
                  >
                    <option value="">Select Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Followers / Count</label>
                  <input
                    type="text"
                    value={p.followers || ''}
                    onChange={e => {
                      const copy = [...(data.platforms || [])]
                      copy[i] = { ...p, followers: e.target.value }
                      updateField('platforms', copy)
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
                    const copy = [...(data.platforms || [])]
                    copy[i] = { ...p, url: e.target.value }
                    updateField('platforms', copy)
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
                { platform: 'instagram', url: '', followers: '128K', metric_label: 'followers' }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add a platform
          </button>
        </div>
      </section>

      {/* SECTION: COLLAB PREFERENCES */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Collab Preferences</h3>
        <div className="bg-white p-6 rounded-[12px] border border-[#E5D5C4] shadow-sm space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Collab Types / Open To</label>
            <input
              type="text"
              value={data.collab_types || ''}
              onChange={e => updateField('collab_types', e.target.value)}
              placeholder="e.g. Brand deals · UGC"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Campaign Formats / Scope</label>
            <input
              type="text"
              value={data.collab_formats || ''}
              onChange={e => updateField('collab_formats', e.target.value)}
              placeholder="e.g. Reviews · Events · Reels · Campaigns"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
