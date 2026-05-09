import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, Sparkles, CheckCircle2, AlertCircle, TrendingUp, 
  Plus, Instagram, Youtube, Twitter, MessageCircle, Globe, 
  Trash2, Layout, Info, Rocket, Trophy, 
  Link as LinkIcon, Camera, Target, User, ShieldCheck, Eye,
  Code2, GraduationCap, Dumbbell, Gamepad2, ChevronRight,
  Zap, Github, Linkedin, Mail, Calendar, MapPin, Star
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { computeCompletionScore } from '../lib/identity/completion-score'
import { TagInput } from '../components/identity/TagInput'
import { EmojiPicker } from '../components/identity/EmojiPicker'
import { personaConfigs } from '../config/personaConfig'

// Import Persona forms for 100% parity
import { DeveloperForm } from '../components/identity/forms/DeveloperForm'
import { StudentForm } from '../components/identity/forms/StudentForm'
import { CreatorForm } from '../components/identity/forms/CreatorForm'
import { GamerForm } from '../components/identity/forms/GamerForm'
import { FitnessForm } from '../components/identity/forms/FitnessForm'

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
  influencer: { emoji: '📸', color: '#F97316', icon: Sparkles },
  developer: { emoji: '💻', color: '#3B82F6', icon: Code2 },
  dev: { emoji: '💻', color: '#3B82F6', icon: Code2 },
  gamer: { emoji: '🎮', color: '#8B5CF6', icon: Gamepad2 },
  student: { emoji: '🎓', color: '#10B981', icon: GraduationCap },
  fitness: { emoji: '💪', color: '#EF4444', icon: Dumbbell },
  gym: { emoji: '💪', color: '#EF4444', icon: Dumbbell }
}

export default function IdentityStudio() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [activePersona, setActivePersona] = useState(searchParams.get('persona') || 'influencer')
  const [data, setData] = useState<any>({
    first_name: '',
    last_name: '',
    bio: '',
    tagline: '',
    categories: [],
    platforms: [],
    collab_types: [],
    collab_formats: [],
    featured_content: [],
    achievements: [],
    role: '',
    mission: '',
    languages: [],
    tech_stack: [],
    projects: [],
    university: '',
    course: '',
    gamer_tag: '',
    main_games: [],
    stats: '',
    stream_url: '',
    disciplines: [],
    streak_days: 0,
    goals: [],
    total_reach: '',
    avg_engagement: ''
  })

  useEffect(() => {
    async function load() {
      if (!user) return
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (prof) {
        setProfile(prof)
        const personaType = searchParams.get('persona') || prof.persona_type || 'influencer'
        setActivePersona(personaType)
        
        const identities = prof.persona_data?.identities || []
        const personaIden = identities.find((i: any) => i.persona_type === personaType)
        
        // Initialize with core profile data for parity
        const coreData = {
          first_name: prof.first_name || '',
          last_name: prof.last_name || '',
          bio: prof.bio || '',
          instagram: prof.instagram_url || '',
          linkedin: prof.linkedin_url || '',
          github: prof.github_url || '',
          youtube: prof.youtube_url || '',
          twitter: prof.twitter_url || '',
          tiktok: prof.tiktok_url || '',
          twitch: prof.twitch_url || '',
          whatsapp: prof.whatsapp_number || ''
        }

        if (personaIden) {
          setData((prev: any) => ({
            ...prev,
            ...coreData,
            ...personaIden.data
          }))
        } else {
          setData((prev: any) => ({
            ...prev,
            ...coreData
          }))
        }
      }
      setLoading(false)
    }
    load()
  }, [user])

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const currentIdentities = profile?.persona_data?.identities || []
      const activeIdx = currentIdentities.findIndex((i: any) => i.persona_type === activePersona)
      
      const identityUpdate = {
        id: activeIdx >= 0 ? currentIdentities[activeIdx].id : `id_${Date.now()}`,
        persona_type: activePersona,
        avatar_url: activeIdx >= 0 ? currentIdentities[activeIdx].avatar_url : profile?.avatar_url,
        active: true,
        data: { ...data }
      }

      const newIdentities = currentIdentities.map((i: any) => ({ ...i, active: false }))
      if (activeIdx >= 0) {
        newIdentities[activeIdx] = identityUpdate
      } else {
        newIdentities.push(identityUpdate)
      }

      // Sync to legacy columns for top-level access
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
        persona_data: { ...profile.persona_data, identities: newIdentities },
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        ...legacySync
      }).eq('id', user.id)

      if (error) throw error

      // Update public_profiles too for consistency
      await supabase.from('public_profiles').update({
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        avatar_url: identityUpdate.avatar_url,
        persona_type: activePersona,
        ...legacySync
      }).eq('id', user.id)
      
      // Update local state
      setProfile({ ...profile, persona_type: activePersona, persona_data: { ...profile.persona_data, identities: newIdentities } })
      alert('Changes saved successfully!')
    } catch (err: any) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const { score, incomplete, grade } = useMemo(() => computeCompletionScore(activePersona, data), [activePersona, data])
  const activeConfig = useMemo(() => personaConfigs[activePersona.toLowerCase()], [activePersona])

  // AI Guidance Messages
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

  const config = PERSONA_CONFIG[activePersona] || PERSONA_CONFIG.influencer

  return (
    <div className="studio-page pb-40">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 🔝 HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center transition-all">
              <ArrowLeft size={20} className="text-neutral-400" />
            </button>
            <div>
              <h1 className="text-xl font-black font-display tracking-tight">Build Your {activeConfig?.name || activePersona.charAt(0).toUpperCase() + activePersona.slice(1)} Identity {config.emoji}</h1>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Complete your profile to unlock more visibility</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#F97316] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Strength</p>
              <p className="text-xs font-bold text-orange-500">{score >= 80 ? "Elite Level Achieved! 🏆" : "Good progress. Let's hit 80% 🚀"}</p>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#F1F1EF" strokeWidth="4" fill="transparent" />
                <circle
                  cx="24" cy="24" r="20" stroke={config.color} strokeWidth="4" fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - score / 100)}
                  strokeLinecap="round"
                  className="progress-ring"
                />
              </svg>
              <span className="absolute text-[10px] font-black">{score}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10">
        
        {/* Forms centered */}
        <div className="max-w-[850px] mx-auto">
          
          {/* LEFT: FORM SECTIONS */}
          <div className="space-y-12">
            
            {/* --- PERSONA SPECIFIC RENDERING --- */}
            
            {/* Section: Basic Identity */}
            <section id="tagline" className="glass-card p-10 animate-slideUp">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><User size={28}/></div>
                  <div>
                    <h3 className="text-xl font-black font-display tracking-tight">Basic Identity</h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Foundational profile details</p>
                  </div>
                </div>
                {data.tagline && <span className="status-badge completed">Completed ✅</span>}
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

                <div>
                  <label className="section-label">Public Bio</label>
                  <textarea 
                    placeholder="Tell the world who you are..." 
                    className="input-field min-h-[100px] py-4"
                    value={data.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="section-label mb-0">Public Tagline</label>
                    <span className="text-[10px] font-black text-orange-500">+10% Boost</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g., Building the future of digital identity" 
                    className="input-field"
                    value={data.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                  />
                </div>
              </div>
            </section>
              
            {/* Section: Detailed Persona Attributes (Forms) */}
            <section id="detailed_attributes" className="glass-card p-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><Target size={28}/></div>
                <div>
                  <h3 className="text-xl font-black font-display tracking-tight">Detailed Persona Attributes</h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Specific details for your {activePersona} identity</p>
                </div>
              </div>
              
              <div className="p-0 sm:p-2">
                {['developer', 'dev'].includes(activePersona) && <DeveloperForm data={data} onChange={setData} isOwner />}
                {activePersona === 'student' && <StudentForm data={data} onChange={setData} />}
                {activePersona === 'creator' && <CreatorForm data={data} onChange={setData} />}
                {activePersona === 'gamer' && <GamerForm data={data} onChange={setData} />}
                {['fitness', 'gym', 'athlete'].includes(activePersona) && <FitnessForm data={data} onChange={setData} />}
                {activePersona === 'influencer' && <CreatorForm data={data} onChange={setData} />}
              </div>
            </section>

            {/* Section: Achievements */}
            <section id="achievements" className="glass-card p-10 animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-inner"><Trophy size={28}/></div>
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
                  tags={data.achievements} 
                  onChange={(tags) => updateField('achievements', tags)}
                  placeholder="Add achievement (e.g., Verified on Instagram, Best Actor 2023)"
                />
              </div>
            </section>

          </div>

          </div>
        </div>

        </div>
      </main>

      {/* Removed sticky insight strip as requested */}

      {/* 🚀 ACTION-DRIVEN FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-8 flex items-center justify-center gap-6">
         <button 
          onClick={() => window.open(`/p/${profile?.secure_slug || profile?.id}`, '_blank')}
          className="px-10 py-4 rounded-2xl border-2 border-neutral-100 text-neutral-600 font-black text-xs uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-200 transition-all flex items-center gap-2"
         >
           <Eye size={18} /> Preview Profile
         </button>
         <button 
          onClick={handleSave}
          disabled={saving}
          className="px-14 py-4 rounded-2xl bg-[#F97316] text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
         >
           {saving ? 'Boosting...' : <><Rocket size={20} /> Boost My Profile</>}
         </button>
      </footer>
    </div>
  )
}
