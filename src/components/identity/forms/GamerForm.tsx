import React from 'react'
import { EmojiPicker } from '../EmojiPicker'
import { Plus, Trash2 } from 'lucide-react'

interface GamerFormProps {
  data: any
  onChange: (newData: any) => void
}

export function GamerForm({ data = {}, onChange }: GamerFormProps) {
  const safeData = data || {}
  const safeStats = safeData.stats || {}
  const safeGames = Array.isArray(safeData.main_games) ? safeData.main_games : []
  const safeAchievements = Array.isArray(safeData.achievements) ? safeData.achievements : []

  const updateField = (key: string, value: any) => {
    onChange({ ...safeData, [key]: value })
  }

  const updateStats = (key: string, value: any) => {
    onChange({
      ...safeData,
      stats: { ...(safeStats && typeof safeStats === 'object' ? safeStats : {}), [key]: value }
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-20 items-start">
      {/* SECTION: IDENTITY */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 1: Identity</h3>
        <div className="bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm space-y-10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Gamer Tag / Username</label>
            <input
              type="text"
              value={safeData.gamer_tag || ''}
              onChange={e => updateField('gamer_tag', e.target.value)}
              placeholder="e.g. ShadowBlade"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Status</label>
              <select
                value={safeData.status || ''}
                onChange={e => updateField('status', e.target.value)}
                className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all bg-[image:none]"
              >
                <option value="">Select Status</option>
                <option value="ONLINE">ONLINE</option>
                <option value="AFK">AFK</option>
                <option value="IN-GAME">IN-GAME</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Stream URL</label>
              <input
                type="url"
                value={safeData.stream_url || ''}
                onChange={e => updateField('stream_url', e.target.value)}
                placeholder="e.g. https://twitch.tv/..."
                className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#8C8276] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMBAT STATS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 2: Combat Stats</h3>
        <div className="grid grid-cols-3 gap-6 bg-white p-10 rounded-[24px] border border-[#E5D5C4] shadow-sm">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">K/D Ratio</label>
            <input
              type="text"
              value={safeStats.kd_ratio || ''}
              onChange={e => updateStats('kd_ratio', e.target.value)}
              placeholder="2.4"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Total Wins</label>
            <input
              type="text"
              value={safeStats.total_wins || ''}
              onChange={e => updateStats('total_wins', e.target.value)}
              placeholder="847"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Hours Played</label>
            <input
              type="text"
              value={safeStats.hours_played || ''}
              onChange={e => updateStats('hours_played', e.target.value)}
              placeholder="1,200"
              className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION: MAIN GAMES */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 3: Main Games</h3>
        <div className="space-y-4">
          {safeGames.map((game: any, i: number) => (
            <div key={i} className="p-8 bg-white border border-[#E5D5C4] rounded-[12px] shadow-sm space-y-8 relative">
              <button
                type="button"
                onClick={() => {
                  const copy = [...safeGames]
                  copy.splice(i, 1)
                  updateField('main_games', copy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Game Name</label>
                  <input
                    type="text"
                    value={game.name || ''}
                    onChange={e => {
                      const copy = [...safeGames]
                      copy[i] = { ...game, name: e.target.value }
                      updateField('main_games', copy)
                    }}
                    placeholder="e.g. Valorant"
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#5C5246] mb-1">Current Rank</label>
                  <input
                    type="text"
                    value={game.rank || ''}
                    onChange={e => {
                      const copy = [...safeGames]
                      copy[i] = { ...game, rank: e.target.value }
                      updateField('main_games', copy)
                    }}
                    placeholder="e.g. Diamond III"
                    className="w-full bg-white border border-[#E5D5C4] rounded-[8px] px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateField('main_games', [
                ...safeGames,
                { name: 'New Game', rank: 'MVP' }
              ])
            }}
            className="w-full p-4 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] hover:bg-[#FDF6EC] transition-all text-xs font-black uppercase text-[#C1440E] flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add a main game
          </button>
        </div>
      </section>

      {/* SECTION: ACHIEVEMENTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Section 4: Achievements</h3>
        <div className="space-y-4">
          {safeAchievements.map((ach: any, i: number) => (
            <div key={i} className="p-4 bg-white border border-[#E5D5C4] rounded-[12px] flex items-center gap-4 relative shadow-sm">
              <EmojiPicker
                value={ach.icon || '🏆'}
                onChange={emoji => {
                  const achCopy = [...safeAchievements]
                  achCopy[i] = { ...(ach && typeof ach === 'object' ? ach : { label: ach }), icon: emoji }
                  updateField('achievements', achCopy)
                }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  maxLength={60}
                  value={typeof ach === 'string' ? ach : (ach.label || '')}
                  onChange={e => {
                    const achCopy = [...safeAchievements]
                    if (typeof ach === 'string') {
                      achCopy[i] = e.target.value
                    } else {
                      achCopy[i] = { ...ach, label: e.target.value }
                    }
                    updateField('achievements', achCopy)
                  }}
                  placeholder="e.g. Top 1% Accuracy"
                  className="w-full bg-transparent border-0 outline-none p-1 text-sm text-[#1A1A1A] focus:outline-none placeholder:text-[#8C8276]"
                />
                <select
                  value={ach?.rarity || 'common'}
                  onChange={e => {
                    const achCopy = [...safeAchievements]
                    achCopy[i] = { ...(ach && typeof ach === 'object' ? ach : { label: ach }), rarity: e.target.value }
                    updateField('achievements', achCopy)
                  }}
                  className="bg-transparent text-[10px] font-black uppercase text-[#C1440E] outline-none border-0"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  const achCopy = [...safeAchievements]
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
                ...safeAchievements,
                { icon: '🎮', label: 'New Achievement', rarity: 'common' }
              ])
            }}
            className="w-full p-3 bg-white border border-dashed border-[#E5D5C4] rounded-[12px] text-xs font-black uppercase text-[#C1440E] hover:bg-[#FDF6EC] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add an achievement
          </button>
        </div>
      </section>
    </div>
  )
}
