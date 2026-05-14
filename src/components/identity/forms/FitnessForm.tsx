import React from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { Plus, Trash2 } from 'lucide-react'

interface FitnessFormProps {
  data: any
  onChange: (newData: any) => void
}

export function FitnessForm({ data = {}, onChange }: FitnessFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-24 items-start">
      {/* SECTION: IDENTITY */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Identity</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Fitness Tagline</label>
            <input
              type="text"
              maxLength={80}
              value={data.tagline || ''}
              onChange={e => updateField('tagline', e.target.value)}
              placeholder="e.g. Stronger every day"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Location</label>
            <input
              type="text"
              value={data.location || ''}
              onChange={e => updateField('location', e.target.value)}
              placeholder="e.g. Bengaluru"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Training Styles / Disciplines</label>
            <TagInput
              value={data.disciplines || []}
              onChange={tags => updateField('disciplines', tags)}
              suggestions={['Powerlifting', 'Calisthenics', 'HIIT', 'Yoga', 'Running']}
            />
          </div>
        </div>
      </section>

      {/* SECTION: STREAK & STATS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Streak & Stats</h3>
        <div className="grid grid-cols-3 gap-6 bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Streak Days 🔥</label>
            <input
              type="number"
              min={0}
              step={1}
              value={data.streak_days || ''}
              onChange={e => updateField('streak_days', Number(e.target.value))}
              placeholder="e.g. 30"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">PRs Hit 🏋️</label>
            <input
              type="number"
              min={0}
              step={1}
              value={data.prs_count || ''}
              onChange={e => updateField('prs_count', Number(e.target.value))}
              placeholder="e.g. 14"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Workouts Logged</label>
            <input
              type="number"
              min={0}
              step={1}
              value={data.total_workouts || ''}
              onChange={e => updateField('total_workouts', Number(e.target.value))}
              placeholder="e.g. 120"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION: CURRENT GOALS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Current Goals</h3>
        <div className="space-y-4">
          {(data.goals || []).map((goal: any, i: number) => (
            <div key={i} className="p-8 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-8 relative">
              <button
                type="button"
                onClick={() => {
                  const copy = [...(data.goals || [])]
                  copy.splice(i, 1)
                  updateField('goals', copy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Goal Name</label>
                <input
                  type="text"
                  value={goal.label || ''}
                  onChange={e => {
                    const copy = [...(data.goals || [])]
                    copy[i] = { ...goal, label: e.target.value }
                    updateField('goals', copy)
                  }}
                  placeholder="e.g. Bench Press 100kg"
                  className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Current</label>
                  <input
                    type="number"
                    value={goal.current || 0}
                    onChange={e => {
                      const copy = [...(data.goals || [])]
                      copy[i] = { ...goal, current: Number(e.target.value) }
                      updateField('goals', copy)
                    }}
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Target</label>
                  <input
                    type="number"
                    value={goal.target || 1}
                    onChange={e => {
                      const copy = [...(data.goals || [])]
                      copy[i] = { ...goal, target: Number(e.target.value) }
                      updateField('goals', copy)
                    }}
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Unit</label>
                  <input
                    type="text"
                    value={goal.unit || 'kg'}
                    onChange={e => {
                      const copy = [...(data.goals || [])]
                      copy[i] = { ...goal, unit: e.target.value }
                      updateField('goals', copy)
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
              updateField('goals', [
                ...(data.goals || []),
                { label: 'Bench Press 100kg', current: 78, target: 100, unit: 'kg' }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add a current goal
          </button>
        </div>
      </section>

      {/* SECTION: ACHIEVEMENTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Hall of Fame / Achievements</h3>
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
                className="flex-1 bg-transparent border-0 outline-none p-1 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none"
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
                { icon: '🥇', label: "Marathon Finisher '24" }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] text-xs font-black uppercase text-[#C1440E] hover:bg-[#FDF6EC] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add an achievement
          </button>
        </div>
      </section>
    </div>
  )
}
