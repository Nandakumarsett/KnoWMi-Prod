import React, { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, CheckCircle2, AlertCircle, TrendingUp,
  Plus, Instagram, Youtube, Twitter, MessageCircle, Globe,
  Trash2, Layout, Info, Rocket, Trophy, Save,
  Link as LinkIcon, Camera, Target, User, ShieldCheck, Eye,
  Code2, GraduationCap, ChevronRight,
  Zap, Github, Linkedin, Mail, Calendar, MapPin, Star
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { computeCompletionScore } from '../lib/identity/completion-score'
import { TagInput } from '../components/identity/TagInput'
import { EmojiPicker } from '../components/identity/EmojiPicker'
import { personaConfigs } from '../config/personaConfig'
import Avatar from '../components/Avatar'

// Import Persona forms for 100% parity
import { DeveloperForm } from '../components/identity/forms/DeveloperForm'
import { StudentForm } from '../components/identity/forms/StudentForm'
import { CreatorForm } from '../components/identity/forms/CreatorForm'

// --- STYLES ---

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .studio-page {
    font-family: 'Inter', sans-serif;
    background-color: #FAFAF9;
    color: #1A1A1A;
    min-height: 100vh;
  }
  
  .font-display { font-family: 'Montserrat', sans-serif; }
  
  .glass-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.04);
    border: 1px solid #F1F1EF;
    transition: all 0.3s ease;
  }
  
  .glass-card:hover {
    box-shadow: 0 20px 60px -15px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    background: #F8F8F7;
    border: 1.5px solid transparent;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }
  
  .input-field:focus {
    background: white;
    border-color: #F97316;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
  }

  .section-label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #8C8276;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .chip {
    padding: 8px 16px;
    background: white;
    border: 1.5px solid #F1F1EF;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .chip:hover {
    border-color: #F97316;
    color: #F97316;
    background: #FFF7ED;
  }

  .chip.active {
    background: #F97316;
    color: white;
    border-color: #F97316;
  }

  .progress-ring {
    transition: stroke-dashoffset 0.8s ease-in-out;
  }

  .animate-float-preview {
    animation: float 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -10px); }
  }

  .sticky-insight {
    position: fixed;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    width: fit-content;
    white-space: nowrap;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .status-badge.completed { background: #ECFDF5; color: #10B981; }
  .status-badge.missing { background: #FFF7ED; color: #F97316; }
`

// --- HELPERS ---

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Globe,
  twitch: MessageCircle,
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  website: Globe,
  other: LinkIcon
}

const PERSONA_CONFIG: Record<string, any> = {
  influencer: { label: 'Content Creator', emoji: '🎬', color: '#F97316', icon: Sparkles },
  developer: { label: 'Tech', emoji: '💻', color: '#3B82F6', icon: Code2 },
  student: { label: 'Student', emoji: '🎓', color: '#10B981', icon: GraduationCap }
}

const INITIAL_STATE = {
  first_name: '',
  last_name: '',
  bio: '',
  tagline: '',
  location: '',
  website: '',
  instagram: '',
  linkedin: '',
  github: '',
  twitter: '',
  youtube: '',
  threads: '',
  behance: '',
  dribbble: '',
  medium: '',
  twitch: '',
  whatsapp: '',
  est_year: '',
  avatar_url: '',
  skills: [],
  achievements: [],
  projects: [],
  works: [],
  platforms: [],
  collab_info: '',
  niche: '',
  total_reach: '',
  avg_engagement: ''
}

export default function IdentityStudio() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, refreshProfile } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [activePersona, setActivePersona] = useState(() => {
    const p = searchParams.get('persona')
    if (!p) return ''
    return ['tech', 'dev', 'developer'].includes(p.toLowerCase()) ? 'developer' : p.toLowerCase()
  })
  const [data, setData] = useState<any>({ ...INITIAL_STATE })

  useEffect(() => {
    async function load() {
      try {
        if (!user) return
        const { data: prof, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
        if (error) throw error

        if (prof) {
          setProfile(prof)
          const identities = prof.persona_data?.identities || []
          let personaType = searchParams.get('persona')
          let editId = searchParams.get('edit')
          const isNewMode = searchParams.get('mode') === 'new'

          if (!personaType && !editId && !isNewMode && identities.length > 0) {
            // Default to the active or first identity to prevent losing place when switching tabs
            const activeIden = identities.find((i: any) => i.active) || identities[0]
            personaType = activeIden.persona_type
            editId = activeIden.id
            setActivePersona(personaType || '')
            navigate(`/studio?persona=${personaType}&edit=${editId}`, { replace: true })
          } else {
            setActivePersona(personaType || '')
          }

          const personaIden = editId
            ? identities.find((i: any) => i.id === editId)
            : identities.find((i: any) => i.persona_type === personaType)

          const coreData = {
            first_name: prof.first_name || '',
            last_name: prof.last_name || '',
            bio: personaIden?.bio || personaIden?.data?.bio || '',
            instagram: personaIden?.data?.instagram || '',
            linkedin: personaIden?.data?.linkedin || '',
            github: personaIden?.data?.github || '',
            youtube: personaIden?.data?.youtube || '',
            twitter: personaIden?.data?.twitter || '',
            tiktok: personaIden?.data?.tiktok || '',
            twitch: personaIden?.data?.twitch || '',
            whatsapp: personaIden?.data?.whatsapp || '',
            avatar_url: personaIden?.avatar_url || personaIden?.data?.avatar_url || ''
          }

          if (personaIden) {
            setData((prev: any) => {
              const baseData = { ...prev, ...coreData, ...(personaIden.data || {}) }
              try {
                const draft = sessionStorage.getItem(`draft_persona_${personaType || ''}`);
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            })
          } else if (searchParams.get('mode') === 'new') {
            // FRESH DATA for new identities - explicitly empty bio/socials/avatar
            setData((prev: any) => {
              const baseData = { ...INITIAL_STATE, first_name: prof.first_name || '', last_name: prof.last_name || '', avatar_url: '' }
              try {
                const draft = sessionStorage.getItem(`draft_persona_${personaType || ''}`);
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            })
          } else {
            // Default fresh state for undefined personas
            setData((prev: any) => {
              const baseData = { ...INITIAL_STATE, first_name: prof.first_name || '', last_name: prof.last_name || '' }
              try {
                const draft = sessionStorage.getItem(`draft_persona_${personaType || ''}`);
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            })
          }
        }
      } catch (err) {
        // silently fail in production
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  // Auto-save draft changes to sessionStorage
  useEffect(() => {
    if (activePersona && data && Object.keys(data).length > 0) {
      // Don't save empty initialization state as draft
      if (data.first_name !== '' || data.last_name !== '' || data.bio !== '' || data.tagline !== '' || data.about || data.tech_stack) {
        sessionStorage.setItem(`draft_persona_${activePersona}`, JSON.stringify(data))
      }
    }
  }, [data, activePersona])

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file || file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }
    if (!user?.id) {
      toast.error('Please log in to upload an image')
      return
    }

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const maskedUrl = `/content/avatars/${filePath}`
      updateField('avatar_url', maskedUrl)
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (file: File, type: string): Promise<string | null> => {
    if (!file || file.size > 50 * 1024 * 1024) {
      toast.error('File must be less than 50MB')
      return null
    }
    if (!user?.id) {
      toast.error('Please log in to upload a file')
      return null
    }

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${type}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const maskedUrl = `/content/avatars/${filePath}`
      
      // Update top level fields if not a work/project media
      if (!type.startsWith('work_media_') && !type.includes('_project_media_')) {
        updateField(type, maskedUrl)
      }
      
      return maskedUrl
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleAutoFill = (url: string) => {
    if (!url) return;
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.split('/').filter(Boolean);
      
      if (parsedUrl.hostname.includes('instagram.com') && path[0]) {
        updateField('instagram', url);
        const handle = path[0].replace(/[_.]/g, ' ');
        if (!data.first_name) {
          updateField('first_name', handle.charAt(0).toUpperCase() + handle.slice(1));
        }
        toast.success('✨ Instagram connected and details pre-filled!')
      } 
      else if (parsedUrl.hostname.includes('linkedin.com') && path[0] === 'in' && path[1]) {
        updateField('linkedin', url);
        const handle = path[1].replace(/[-_]/g, ' ').split(' ');
        if (!data.first_name && handle[0]) {
          updateField('first_name', handle[0].charAt(0).toUpperCase() + handle[0].slice(1));
        }
        if (!data.last_name && handle[1]) {
          updateField('last_name', handle[1].charAt(0).toUpperCase() + handle[1].slice(1));
        }
        toast.success('✨ LinkedIn connected and details pre-filled!')
      } else {
        toast.error('Please paste a valid Instagram or LinkedIn profile URL.')
      }
    } catch (e) {
      toast.error('Invalid URL format.')
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save.')
      return
    }

    setSaving(true)

    try {
      const currentIdentities = profile?.persona_data?.identities || []
      const editId = searchParams.get('edit')

      const activeIdx = editId
        ? currentIdentities.findIndex((i: any) => i.id === editId)
        : currentIdentities.findIndex((i: any) => i.persona_type === activePersona)

      const identityUpdate = {
        id: activeIdx >= 0 ? currentIdentities[activeIdx].id : (editId || `id_${Date.now()}`),
        persona_type: activePersona,
        avatar_url: data.avatar_url || '',
        first_name: data.first_name || profile?.first_name,
        last_name: data.last_name || profile?.last_name,
        bio: data.bio || '',
        active: true,
        data: { ...data, bio: data.bio || '' }
      }

      const newIdentities = currentIdentities.map((i: any) => ({ ...i, active: false }))
      if (activeIdx >= 0) {
        newIdentities[activeIdx] = identityUpdate
      } else {
        newIdentities.push(identityUpdate)
      }

      const legacySync: any = {}
      if (data.instagram) legacySync.instagram_url = data.instagram
      if (data.linkedin) legacySync.linkedin_url = data.linkedin
      if (data.github) legacySync.github_url = data.github
      if (data.youtube) legacySync.youtube_url = data.youtube
      if (data.twitter) legacySync.twitter_url = data.twitter
      if (data.tiktok) legacySync.tiktok_url = data.tiktok
      if (data.twitch) legacySync.twitch_url = data.twitch

      const { error } = await supabase.from('profiles').update({
        persona_type: activePersona,
        avatar_url: identityUpdate.avatar_url,
        persona_data: { ...(profile?.persona_data || {}), identities: newIdentities },
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio
      }).eq('user_id', user.id)

      if (error) {
        toast.error('Failed to save: ' + error.message)
        return
      }

      setProfile({
        ...profile,
        persona: activePersona,
        persona_type: activePersona,
        persona_data: { ...(profile?.persona_data || {}), identities: newIdentities }
      })
      sessionStorage.removeItem(`draft_persona_${activePersona}`)
      toast.success('Changes saved successfully! 🎉')
      // Refresh global profile state instead of hard reload
      if (refreshProfile) refreshProfile()
    } catch (err: any) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const { score, incomplete } = useMemo(() => computeCompletionScore(activePersona || 'influencer', data), [activePersona, data])

  const activeConfig = useMemo(() => {
    const persona = (activePersona || 'influencer').toLowerCase()
    const key = ['tech', 'dev', 'developer'].includes(persona) ? 'developer' : persona
    return personaConfigs[key] || personaConfigs['influencer']
  }, [activePersona])

  const config = useMemo(() => {
    const persona = (activePersona || 'influencer').toLowerCase()
    const key = ['tech', 'dev', 'developer'].includes(persona) ? 'developer' : persona
    return PERSONA_CONFIG[key] || PERSONA_CONFIG['influencer']
  }, [activePersona])

  const aiMessage = useMemo(() => {
    if (score === 100) return "Your profile is optimized for maximum impact! You're ready to dominate."
    if (score >= 80) return "Excellent work. Just a few more details to reach elite status."
    if (score >= 50) return `You're ${score}% complete. Every detail you add builds more trust with your visitors.`
    return "Let's build a powerful identity. Start with the basics to get noticed."
  }, [score, incomplete])

  const topActions = incomplete.slice(0, 3)

  if (loading) return (
    <div className="studio-page flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )


  return (
    <div className="studio-page pb-40">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* 🔝 HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 shrink-0 rounded-xl bg-neutral-50 sm:bg-transparent hover:bg-neutral-100 flex items-center justify-center transition-all">
              <ArrowLeft size={20} className="text-neutral-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-black font-display tracking-tight truncate">
                Build your {activePersona ? (activeConfig?.name || activePersona.charAt(0).toUpperCase() + activePersona.slice(1)) + ' ' : ''}Identity {activePersona ? config.emoji : '✨'}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                {activePersona ? 'Complete your profile to unlock more visibility' : 'Choose your path to begin'}
              </p>
            </div>
          </div>

          {activePersona ? (
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="hidden md:flex px-6 py-2.5 bg-[#F97316] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>

              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Strength</p>
                <p className="text-xs font-bold text-orange-500">{score >= 80 ? "Elite Level Achieved! 🏆" : "Good progress. Let's hit 80% 🚀"}</p>
              </div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" stroke="#F1F1EF" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="50%" cy="50%" r="40%" stroke={config.color} strokeWidth="4" fill="transparent"
                    strokeDasharray="251"
                    strokeDashoffset={251 * (1 - score / 100)}
                    strokeLinecap="round"
                    className="progress-ring"
                  />
                </svg>
                <span className="absolute text-[9px] sm:text-[10px] font-black">{score}%</span>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10">

        {/* Forms centered */}
        <div className="max-w-[1000px] mx-auto">

          {/* LEFT: FORM SECTIONS */}
          <div className="space-y-12">

            {/* Section 1: Choose Path (If no persona) */}
            {!activePersona && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg">01</div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-[#1A1A1A]">Choose Your Path</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select your core identity theme</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(PERSONA_CONFIG).filter(([key]) => {
                    const existingIdentities = profile?.persona_data?.identities || [];
                    return !existingIdentities.some((i: any) => i.persona_type === key);
                  }).map(([key, p]) => (
                    <div
                      key={key}
                      onClick={() => {
                        setActivePersona(key)
                        navigate(`/studio?persona=${key}&mode=new`, { replace: true })
                      }}
                      className="glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                        {p.emoji}
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-wider">{p.label || key}</h3>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">Select Protocol</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activePersona && (
              <>
                <section className="glass-card p-10 animate-slideUp mb-8" style={{ background: 'linear-gradient(to right, rgba(249, 115, 22, 0.05), transparent)' }}>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20"><Sparkles size={28} /></div>
                    <div>
                      <h3 className="text-xl font-black font-display tracking-tight text-orange-500">One-Click AI Profile</h3>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Paste a social link to instantly build your identity</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="url" 
                      id="ai-autofill-input"
                      placeholder="Paste your Instagram or LinkedIn profile URL..."
                      className="input-field flex-1 !bg-white !border-orange-500/20 focus:!border-orange-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAutoFill(e.currentTarget.value);
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('ai-autofill-input') as HTMLInputElement;
                        if (input) handleAutoFill(input.value);
                      }}
                      className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-md"
                    >
                      Generate
                    </button>
                  </div>
                </section>

                <section id="tagline" className="glass-card p-10 animate-slideUp">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><User size={28} /></div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight">Basic Identity</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Foundational profile details</p>
                      </div>
                    </div>
                    {data.tagline && <span className="status-badge completed">Completed ✅</span>}
                  </div>

                  {/* Avatar Upload Sub-section */}
                  <div className="flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-[32px] bg-neutral-100 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <Avatar src={data.avatar_url} name={`${data.first_name} ${data.last_name}`} username={profile?.secure_slug || profile?.id} size="w-full h-full text-4xl" />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-neutral-200 rounded-xl shadow-lg flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:scale-110 transition-all cursor-pointer">
                        <Camera size={18} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-neutral-900 mb-1 tracking-tighter">
                        {data.first_name || data.last_name ? `${data.first_name} ${data.last_name}` : 'New Identity'}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest">JPG or PNG • Max 2MB</p>
                      <div className="flex gap-3">
                        <label className="px-4 py-2 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors cursor-pointer">
                          Upload New
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
                        </label>
                        <button
                          onClick={() => updateField('avatar_url', '')}
                          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="section-label">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          className="input-field"
                          value={data.first_name}
                          onChange={(e) => updateField('first_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="section-label">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          className="input-field"
                          value={data.last_name}
                          onChange={(e) => updateField('last_name', e.target.value)}
                        />
                      </div>
                    </div>

                    {(activePersona === 'influencer' || activePersona === 'creator') && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="section-label">Creator Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Visual Artist"
                            className="input-field"
                            value={data.type}
                            onChange={(e) => updateField('type', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="section-label">Location Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai, India"
                            className="input-field"
                            value={data.location}
                            onChange={(e) => updateField('location', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="section-label">Established Since</label>
                          <input
                            type="text"
                            placeholder="e.g. 2021"
                            className="input-field"
                            value={data.est_year}
                            onChange={(e) => updateField('est_year', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {(activePersona === 'influencer' || activePersona === 'creator') && (
                      <div>
                        <label className="section-label">About the Creator</label>
                        <input
                          type="text"
                          placeholder="A short one-liner summary..."
                          className="input-field"
                          value={data.about}
                          onChange={(e) => updateField('about', e.target.value)}
                        />
                      </div>
                    )}

                    <div>
                      <label className="section-label">Public Bio</label>
                      <textarea
                        placeholder="Tell the world who you are..."
                        className="input-field min-h-[100px] py-4"
                        value={data.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                      />
                    </div>

                  </div>
                </section>

                {/* Section: Detailed Persona Attributes (Forms) */}
                <section id="detailed_attributes" className="glass-card p-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><Target size={28} /></div>
                    <div>
                      <h3 className="text-xl font-black font-display tracking-tight">Detailed Persona Attributes</h3>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Specific details for your {activePersona} identity</p>
                    </div>
                  </div>

                  <div className="p-0 sm:p-2">
                    {['developer', 'dev'].includes(activePersona) && <DeveloperForm data={data} onChange={setData} isOwner onUpload={handleFileUpload} uploading={uploading} />}
                    {activePersona === 'student' && <StudentForm data={data} onChange={setData} onUpload={handleFileUpload} uploading={uploading} />}
                    {(activePersona === 'creator' || activePersona === 'influencer') && <CreatorForm data={data} onChange={setData} onUpload={handleFileUpload} uploading={uploading} />}
                  </div>
                </section>

                {/* Section: Achievements */}
                <section id="achievements" className="glass-card p-10 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-inner"><Trophy size={28} /></div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight">Achievements</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Trust & Authority</p>
                      </div>
                    </div>
                    {data.achievements.length > 0 ? <span className="status-badge completed">Completed ✅</span> : <span className="status-badge missing">Missing +10% ⚠️</span>}
                  </div>

                  <div className="space-y-6">
                    <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">Boost trust with achievements (awards, milestones, or high-value certifications).</p>
                    <TagInput
                      value={data.achievements || []}
                      onChange={(tags) => updateField('achievements', tags)}
                      placeholder="Add achievement (e.g., Verified on Instagram, Best Actor 2023)"
                    />
                  </div>
                </section>
              </>
            )}

          </div>
        </div>
      </main>

      {/* Removed sticky insight strip as requested */}

      {/* 🚀 ACTION-DRIVEN FOOTER */}
      {activePersona ? (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-8 flex items-center justify-center gap-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-14 py-4 rounded-2xl bg-[#F97316] text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Saving Profile...' : <><Save size={20} /> Save Profile</>}
          </button>
        </footer>
      ) : null}
    </div>
  )
}
