import { useState, useEffect, useRef } from 'react'
import { supabase, getAssetUrl } from '../lib/supabase'
import { Save, RefreshCw, Eye, Image as ImageIcon, Upload, Play, Trash2, Plus, Film } from 'lucide-react'

export default function HomepagePreviewsAdmin() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(null) // ID of field being uploaded
  
  const [previews, setPreviews] = useState({
    influencer: {
      name: 'Sneha Kapoor',
      tagline: 'Building a community around sustainable luxury and mindful living.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
      works: [
        { title: 'The Minimalist Home', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', type: 'image' },
        { title: 'Travel Edit 2024', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', type: 'image' }
      ]
    },
    developer: {
      name: 'Aryan Sharma',
      mission: 'Engineering the future of decentralized identity.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      works: []
    },
    student: {
      name: 'Karan Mehta',
      bio: "Interning @Google. Building a fintech startup on the side.",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      works: []
    }
  })

  useEffect(() => {
    const saved = localStorage.getItem('homepage_previews')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Ensure works exist for all
        if (!parsed.influencer.works) parsed.influencer.works = []
        if (!parsed.developer.works) parsed.developer.works = []
        if (!parsed.student.works) parsed.student.works = []
        setPreviews(parsed)
      } catch (e) {
        console.error("Error parsing saved previews", e)
      }
    }
  }, [])

  const handleFileUpload = async (e, personaId, field, workIndex = null) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large (max 10MB)")
      return
    }

    const uploadKey = workIndex !== null ? `${personaId}-work-${workIndex}` : `${personaId}-${field}`
    console.log(`[AdminUpload] Starting upload for ${uploadKey}...`, file.name)
    setUploading(uploadKey)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `previews-${personaId}-${field}-${Date.now()}.${fileExt}`
      
      console.log(`[AdminUpload] Bucket: avatars, Path: ${fileName}`)
      
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
      
      if (error) {
        console.error('[AdminUpload] Supabase Error:', error)
        throw error
      }

      console.log('[AdminUpload] Success:', data)
      const url = `/content/avatars/${fileName}`
      
      if (workIndex !== null) {
        const newWorks = [...previews[personaId].works]
        newWorks[workIndex] = { 
          ...newWorks[workIndex], 
          img: url, 
          type: file.type.startsWith('video') ? 'video' : 'image' 
        }
        updateField(personaId, 'works', newWorks)
      } else {
        updateField(personaId, field, url)
      }
    } catch (error) {
      console.error('[AdminUpload] Caught Error:', error)
      alert(`Upload Failed: ${error.message || 'Unknown error'}. Check if the "avatars" bucket exists and allows public uploads.`)
    } finally {
      setUploading(null)
    }
  }

  const handleSave = () => {
    setLoading(true)
    localStorage.setItem('homepage_previews', JSON.stringify(previews))
    setTimeout(() => {
      setMsg('✅ Previews updated successfully! Refresh the homepage to see changes.')
      setLoading(false)
      setTimeout(() => setMsg(''), 3000)
    }, 800)
  }

  const updateField = (persona, field, val) => {
    setPreviews(prev => ({
      ...prev,
      [persona]: { ...prev[persona], [field]: val }
    }))
  }

  const addWorkItem = (personaId) => {
    const newWorks = [...(previews[personaId].works || [])]
    newWorks.push({ title: 'New Work', img: '', type: 'image' })
    updateField(personaId, 'works', newWorks)
  }

  const removeWorkItem = (personaId, index) => {
    const newWorks = [...previews[personaId].works]
    newWorks.splice(index, 1)
    updateField(personaId, 'works', newWorks)
  }

  const updateWorkField = (personaId, index, field, val) => {
    const newWorks = [...previews[personaId].works]
    newWorks[index] = { ...newWorks[index], [field]: val }
    updateField(personaId, 'works', newWorks)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#ffffff', fontFamily: 'Fraunces, serif' }}>Homepage Previews</h2>
          <p className="text-sm text-neutral-400 font-bold">Upload DPs and Recent Works (Images/Videos) for the persona showcase.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-[6px_6px_0px_#fff] hover:shadow-[8px_8px_0px_#fff] active:scale-95 disabled:opacity-50 bg-white text-black"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {msg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-3 animate-fadeIn">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-12">
        {Object.entries(previews).map(([id, p]) => (
          <div key={id} className="p-8 rounded-[40px] border border-[var(--border2)] bg-[#1a1a1a] shadow-[2px_2px_0px_#fff] hover:shadow-[4px_4px_0px_#fff] transition-shadow space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-2xl">
                {id === 'influencer' ? '🎬' : id === 'developer' ? '💻' : '🎓'}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                {id === 'influencer' ? 'Content Creator' : id === 'developer' ? 'Tech' : 'Student'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={p.name}
                    onChange={e => updateField(id, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Bio / Tagline</label>
                  <textarea 
                    rows={3}
                    value={id === 'influencer' ? p.tagline : id === 'developer' ? p.mission : p.bio}
                    onChange={e => updateField(id, id === 'influencer' ? 'tagline' : id === 'developer' ? 'mission' : 'bio', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Profile Picture (Upload)</label>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-[8px_8px_0px_#fff] overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      <img src={getAssetUrl(p.avatar)} className="w-full h-full object-cover" alt="" />
                    </div>
                    {uploading === `${id}-avatar` && (
                      <div className="absolute inset-0 bg-[#1a1a1a]/60 flex items-center justify-center rounded-full">
                        <RefreshCw size={20} className="animate-spin text-orange-500" />
                      </div>
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-3xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                      <Upload size={20} className="text-neutral-400 group-hover:text-orange-500 mb-2" />
                      <span className="text-[11px] font-bold text-neutral-400 font-bold group-hover:text-orange-500 uppercase tracking-widest">Replace DP</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, id, 'avatar')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Works Section */}
            <div className="pt-6 border-t border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Recent Works</h4>
                  <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Photos or Videos (Max 10MB)</p>
                </div>
                <button 
                  onClick={() => addWorkItem(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {p.works?.map((work, idx) => (
                  <div key={idx} className="p-5 rounded-3xl border border-white/20 bg-neutral-50/50 space-y-4 relative group">
                    <button 
                      onClick={() => removeWorkItem(id, idx)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1a1a1a] shadow-[4px_4px_0px_#fff] flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    <div className="flex gap-4">
                      <label className="w-32 h-32 rounded-2xl overflow-hidden bg-[#2a2a2a] border-2 border-white shadow-[2px_2px_0px_#fff] flex-shrink-0 cursor-pointer relative">
                        {work.img ? (
                          work.type === 'video' ? (
                            <video src={getAssetUrl(work.img)} className="w-full h-full object-cover" />
                          ) : (
                            <img src={getAssetUrl(work.img)} className="w-full h-full object-cover" alt="" />
                          )
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                            <ImageIcon size={24} />
                            <span className="text-[8px] font-bold uppercase mt-2">Upload</span>
                          </div>
                        )}
                        {uploading === `${id}-work-${idx}` && (
                          <div className="absolute inset-0 bg-[#1a1a1a]/60 flex items-center justify-center">
                            <RefreshCw size={16} className="animate-spin text-orange-500" />
                          </div>
                        )}
                        {work.type === 'video' && <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-md text-white"><Film size={10} /></div>}
                        <input type="file" className="hidden" accept="image/*,video/*" onChange={e => handleFileUpload(e, id, 'img', idx)} />
                      </label>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[8px] font-black uppercase tracking-widest text-neutral-400 mb-1">Title</label>
                          <input 
                            type="text" 
                            value={work.title}
                            onChange={e => updateWorkField(id, idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-white/20 text-xs font-bold outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${work.type === 'video' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                             {work.type || 'image'}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
