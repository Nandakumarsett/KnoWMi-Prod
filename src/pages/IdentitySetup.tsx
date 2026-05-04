import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useAutoSave } from '../hooks/useAutoSave'
import { computeCompletionScore } from '../lib/identity/completion-score'
import { CompletionRing } from '../components/identity/CompletionRing'
import { LivePreview } from '../components/identity/LivePreview'
import { SaveStatus } from '../components/identity/SaveStatus'
import { ProfileData } from '../types/profile'
import { Sparkles, ArrowLeft, Layout } from 'lucide-react'
// Forms
import { DeveloperForm } from '../components/identity/forms/DeveloperForm'
import { StudentForm } from '../components/identity/forms/StudentForm'
import { CreatorForm } from '../components/identity/forms/CreatorForm'
import { GamerForm } from '../components/identity/forms/GamerForm'
import { FitnessForm } from '../components/identity/forms/FitnessForm'
import { InfluencerForm } from '../components/identity/forms/InfluencerForm'

const PERSONAS = [
  { id: 'developer', label: '🧑‍💻 Developer' },
  { id: 'student', label: '🎓 Student' },
  { id: 'creator', label: '🎨 Creator' },
  { id: 'gamer', label: '🎮 Gamer' },
  { id: 'fitness', label: '💪 Fitness' },
  { id: 'influencer', label: '📱 Influencer' }
]

export default function IdentitySetup() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Current persona selection
  const [persona, setPersona] = useState<string>(searchParams.get('persona') || 'developer')
  // Forms data
  const [formData, setFormData] = useState<Record<string, any>>({})
  const { save, saveStatus } = useAutoSave(profile?.id || '', persona)

  useEffect(() => {
    let active = true
    async function loadProfile() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (active) {
          if (error || !data) {
            setProfile(null)
          } else {
            setProfile(data)

            const loadedPersona = searchParams.get('persona') || data.persona || data.persona_type || 'developer'
            const currentPersona = loadedPersona.toLowerCase()

            if (currentPersona !== persona) {
              setPersona(currentPersona)
              setSearchParams({ persona: currentPersona })
            }

            // Load the specific persona data or fallback to the general persona_data
            const loadedPersonaData = data.persona_data?.[currentPersona] || data.persona_data || {}
            setFormData(loadedPersonaData)
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    loadProfile()
    return () => { active = false }
  }, [user, searchParams])

  // Change Persona type and switch its data instantly
  const handlePersonaChange = async (newPersona: string) => {
    setSearchParams({ persona: newPersona })
    setPersona(newPersona)
    const nextData = profile?.persona_data?.[newPersona] || {}
    setFormData(nextData)

    if (profile?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            persona: newPersona,
            persona_type: newPersona
          })
          .eq('id', profile.id)
      } catch (err) {
        console.error('Error updating persona on tab change:', err)
      }
    }
  }

  const handleFormChange = (newData: Record<string, any>) => {
    setFormData(newData)
    save(newData)
  }

  // Handle direct fill from the CompletionRing anchor clicks
  const handleAnchorClick = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Sparkles className="animate-spin text-orange-500" size={32} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">No profile active</h1>
        <p className="text-neutral-500 mb-8 max-w-xs">Please sign up or complete account setup first.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-black rounded-full font-bold">Return Home</button>
      </div>
    )
  }

  const result = computeCompletionScore(persona, formData)

  // Mapping the local form and profile into ProfileData interface for LivePreview rendering
  const mappedProfile: ProfileData = {
    id: profile.id,
    username: profile.secure_slug || profile.first_name?.toLowerCase() || 'user',
    display_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    avatar_url: profile.avatar_url,
    member_id: profile.wm_code || `WM-${(profile.first_name || 'USER').substring(0,3).toUpperCase()}-001`,
    persona: persona as any,
    mood: formData.mood || 'Vibing & Building',
    bio: formData.about?.mission || formData.tagline || profile.bio || 'Building identity on KnoWMi.',
    pulse: profile.pulse_score || 92,
    tier: profile.tier || 'Elite',
    is_verified: profile.is_verified || true,
    joined_at: profile.created_at,
    social_links: [
      { platform: 'instagram', url: profile.instagram_url },
      { platform: 'linkedin', url: profile.linkedin_url },
      { platform: 'github', url: profile.github_url },
      { platform: 'twitter', url: profile.twitter_url }
    ].filter(l => l.url),
    persona_data: formData
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-orange-500/30 select-none pb-20">
      {/* Header bar */}
      <header className="fixed top-0 w-full z-50 bg-[#161b22]/80 border-b border-white/5 px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-orange-500 transition-all">
            <ArrowLeft size={20} className="text-orange-500" /> Go Back
          </button>
          <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white italic">KW</div>
             <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Identity Studio</span>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="max-w-7xl mx-auto pt-28 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Identity Forms */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
                   Live Identity Builder
                </h1>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  Choose a persona tab to build its specific profile data
                </p>
              </div>
              <SaveStatus status={saveStatus} />
            </div>

            {/* Persona Tabs */}
            <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 p-2 rounded-[28px]">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id)}
                  className={`flex-1 min-w-[120px] py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center transition-all ${
                    persona === p.id 
                      ? 'bg-orange-500 text-white shadow-xl scale-[1.02]' 
                      : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Main Data Forms */}
            <div className="border border-white/5 bg-white/[0.02] p-6 sm:p-10 rounded-[40px] shadow-2xl">
              {['developer', 'dev'].includes(persona) && <DeveloperForm data={formData} onChange={handleFormChange} isOwner />}
              {persona === 'student' && <StudentForm data={formData} onChange={handleFormChange} />}
              {persona === 'creator' && <CreatorForm data={formData} onChange={handleFormChange} />}
              {persona === 'gamer' && <GamerForm data={formData} onChange={handleFormChange} />}
              {['fitness', 'gym', 'athlete'].includes(persona) && <FitnessForm data={formData} onChange={handleFormChange} />}
              {persona === 'influencer' && <InfluencerForm data={formData} onChange={handleFormChange} />}
            </div>
          </div>

          {/* RIGHT: Real-time Profile Preview */}
          <div className="lg:col-span-5 space-y-8 sticky top-28 h-fit">
            <CompletionRing
              score={result.score}
              incomplete={result.incomplete}
              grade={result.grade}
              onFillClick={handleAnchorClick}
            />

            <LivePreview profile={mappedProfile} />
          </div>

        </div>
      </main>
    </div>
  )
}
