import React, { useState } from 'react'
import { TagInput } from '../TagInput'
import { EmojiPicker } from '../EmojiPicker'
import { URLInput } from '../URLInput'
import { Plus, Trash2, RefreshCw } from 'lucide-react'

const TECH_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML/CSS',
  'Node.js', 'Django', 'FastAPI', 'Laravel', 'Spring', 'Express',
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Firebase',
  'Docker', 'AWS', 'GCP', 'Azure', 'Kubernetes', 'GitHub Actions',
  'Git', 'VS Code', 'Figma', 'Postman', 'Linux', 'GraphQL'
]

interface DeveloperFormProps {
  data: any
  onChange: (newData: any) => void
  isOwner?: boolean
}

export function DeveloperForm({ data = {}, onChange, isOwner }: DeveloperFormProps) {
  const [githubUser, setGithubUser] = useState('')
  const [syncing, setSyncing] = useState(false)

  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  const updateAbout = (field: string, value: any) => {
    onChange({
      ...data,
      about: { ...(data.about || {}), [field]: value }
    })
  }

  const handleSyncGithub = async () => {
    if (!githubUser) return
    setSyncing(true)
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${githubUser}`),
        fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`)
      ])
      const user = await userRes.json()
      const repos = await reposRes.json()

      const totalStars = Array.isArray(repos) ? repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0) : 0
      const topRepos = Array.isArray(repos) ? repos
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 4) : []

      const importedProjects = topRepos.map((r: any) => ({
        name: r.name,
        description: r.description || '',
        stars: r.stargazers_count,
        github_url: r.html_url,
        live_url: r.homepage || '',
        tech: [r.language].filter(Boolean)
      }))

      onChange({
        ...data,
        tagline: user.bio || data.tagline || '',
        commits: (user.public_repos || 0) * 10,
        collab: user.followers || 0,
        projects: [...(data.projects || []), ...importedProjects]
      })

      alert('✓ Synced from GitHub!')
    } catch (err) {
      console.error(err)
      alert('GitHub Sync failed. Please enter manual data.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* SECTION: ABOUT */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 1: About You</h3>
        <div className="space-y-4 bg-white/5 p-6 rounded-[28px] border border-white/10">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Role / Title</label>
            <input
              type="text"
              value={data.about?.role || ''}
              onChange={e => updateAbout('role', e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
            />
            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-wider">This shows directly under your name</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Mission Statement</label>
            <textarea
              rows={2}
              maxLength={120}
              value={data.about?.mission || ''}
              onChange={e => updateAbout('mission', e.target.value)}
              placeholder="e.g. Building digital identity for creators"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
            />
            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-wider">What are you passionate about building?</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Programming Languages</label>
            <TagInput
              value={data.about?.languages || []}
              onChange={tags => updateAbout('languages', tags)}
              suggestions={['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust']}
            />
          </div>
        </div>
      </section>

      {/* SECTION: STATS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 2: Stats</h3>
        <div className="bg-white/5 p-6 rounded-[28px] border border-white/10 space-y-4">
          <div className="flex gap-4 items-center p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <input
              type="text"
              value={githubUser}
              onChange={e => setGithubUser(e.target.value)}
              placeholder="Your GitHub Username"
              className="flex-1 bg-transparent border-0 outline-none p-1 text-sm text-white"
            />
            <button
              type="button"
              onClick={handleSyncGithub}
              className="px-4 py-2 bg-[#3fb950] text-black font-black text-xs uppercase rounded-xl hover:bg-[#3fb950]/90 flex items-center gap-1"
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync GitHub'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Commits</label>
              <input
                type="number"
                value={data.commits || 0}
                onChange={e => updateField('commits', Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Collaborations</label>
              <input
                type="number"
                value={data.collabs || 0}
                onChange={e => updateField('collabs', Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TECH STACK */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 3: Tech Stack</h3>
        <div className="bg-white/5 p-6 rounded-[28px] border border-white/10">
          <TagInput
            value={data.tech_stack || []}
            onChange={tags => updateField('tech_stack', tags)}
            suggestions={TECH_SUGGESTIONS}
            placeholder="Search or enter tech to add"
          />
        </div>
      </section>

      {/* SECTION: PROJECTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 4: Projects</h3>
        <div className="space-y-4">
          {(data.projects || []).map((p: any, i: number) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[28px] space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  const pCopy = [...(data.projects || [])]
                  pCopy.splice(i, 1)
                  updateField('projects', pCopy)
                }}
                className="absolute top-6 right-6 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={p.name || ''}
                    onChange={e => {
                      const pCopy = [...(data.projects || [])]
                      pCopy[i] = { ...p, name: e.target.value }
                      updateField('projects', pCopy)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Stars</label>
                  <input
                    type="number"
                    value={p.stars || 0}
                    onChange={e => {
                      const pCopy = [...(data.projects || [])]
                      pCopy[i] = { ...p, stars: Number(e.target.value) }
                      updateField('projects', pCopy)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Description</label>
                <textarea
                  maxLength={80}
                  value={p.description || ''}
                  onChange={e => {
                    const pCopy = [...(data.projects || [])]
                    pCopy[i] = { ...p, description: e.target.value }
                    updateField('projects', pCopy)
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">GitHub URL</label>
                  <URLInput
                    value={p.github_url || ''}
                    onChange={url => {
                      const pCopy = [...(data.projects || [])]
                      pCopy[i] = { ...p, github_url: url }
                      updateField('projects', pCopy)
                    }}
                    onMetaFetched={meta => {
                      const pCopy = [...(data.projects || [])]
                      pCopy[i] = { ...p, description: meta.description || p.description, stars: meta.stars || p.stars }
                      updateField('projects', pCopy)
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Live URL</label>
                  <input
                    type="url"
                    value={p.live_url || ''}
                    onChange={e => {
                      const pCopy = [...(data.projects || [])]
                      pCopy[i] = { ...p, live_url: e.target.value }
                      updateField('projects', pCopy)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                { name: 'Untitled Project', description: '', stars: 0, github_url: '', live_url: '', tech: [] }
              ])
            }}
            className="w-full p-4 border border-dashed border-white/10 rounded-3xl hover:bg-white/5 transition-colors text-xs font-black uppercase tracking-widest text-white/60 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another project
          </button>
        </div>
      </section>

      {/* SECTION: ACHIEVEMENTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Section 5: Achievements</h3>
        <div className="space-y-4">
          {(data.achievements || []).map((ach: any, i: number) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 relative">
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
                className="flex-1 bg-transparent border-0 outline-none p-1 text-sm text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const achCopy = [...(data.achievements || [])]
                  achCopy.splice(i, 1)
                  updateField('achievements', achCopy)
                }}
                className="text-red-500 hover:text-red-400"
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
                { icon: '🏆', label: 'Hackathon Winner' }
              ])
            }}
            className="w-full p-3 border border-dashed border-white/10 rounded-2xl text-xs font-black uppercase opacity-60 flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add an achievement
          </button>
        </div>
      </section>
    </div>
  )
}
