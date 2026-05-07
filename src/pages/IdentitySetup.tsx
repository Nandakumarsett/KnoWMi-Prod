import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useAutoSave } from '../hooks/useAutoSave'
import { computeCompletionScore } from '../lib/identity/completion-score'
import { CompletionRing } from '../components/identity/CompletionRing'
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

            // Resolve actual data from potential nested structures (identities array vs persona key)
            let loadedPersonaData = data.persona_data || {}
            if (Array.isArray(data.persona_data?.identities) && data.persona_data.identities.length > 0) {
              const activeId = data.persona_data.identities.find((i: any) => i.persona_type === currentPersona || i.active) || data.persona_data.identities[0]
              loadedPersonaData = activeId.data || {}
            } else if (data.persona_data?.[currentPersona]) {
              loadedPersonaData = data.persona_data[currentPersona]
            }
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
    const configuredKeys = profile?.persona_data 
      ? Object.keys(profile.persona_data).filter(k => PERSONAS.some(p => p.id === k)) 
      : []

    const maxPersonas = (profile?.tier === 'Creator' || profile?.tier === 'Pro') ? 3 : (profile?.tier === 'Starter' ? 1 : 6)

    const alreadyExists = configuredKeys.includes(newPersona) || profile?.persona === newPersona || profile?.persona_type === newPersona
    if (!alreadyExists && configuredKeys.length >= maxPersonas) {
      alert(`Your ${profile?.tier || 'Starter'} Plan allows up to ${maxPersonas} persona profile(s). Please upgrade to unlock more!`)
      return
    }

    setSearchParams({ persona: newPersona })
    setPersona(newPersona)
    let nextData = profile?.persona_data || {}
    if (Array.isArray(profile?.persona_data?.identities)) {
      const activeId = profile.persona_data.identities.find((i: any) => i.persona_type === newPersona)
      if (activeId) nextData = activeId.data || {}
    } else if (profile?.persona_data?.[newPersona]) {
      nextData = profile.persona_data[newPersona]
    }
    setFormData(nextData)

    if (profile?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
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
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <Sparkles className="animate-spin text-orange-500" size={32} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] text-[#1A0A00] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">No profile active</h1>
        <p className="text-neutral-500 mb-8 max-w-xs">Please sign up or complete account setup first.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-black rounded-full font-bold">Return Home</button>
      </div>
    )
  }

  const result = computeCompletionScore(persona, formData)

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#1A0A00] font-sans selection:bg-orange-500/30 select-none pb-20">
      {/* Header bar */}
      <header className="fixed top-0 w-full z-50 bg-[#FDF6EE]/80 border-b border-[#F0E0CC] px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1A0A00] hover:text-orange-500 transition-all">
            <ArrowLeft size={20} className="text-orange-500" /> Go Back
          </button>
          <div className="flex items-center gap-2">
             <img src="/favicon.png" alt="Logo" className="w-7 h-7 rounded-lg object-cover" />
             <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Identity Studio</span>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="max-w-7xl mx-auto pt-28 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Identity Forms */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-2 text-[#1A0A00]">
                   Live Identity Builder
                </h1>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  Choose a persona tab to build its specific profile data
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <SaveStatus status={saveStatus} />
                <button 
                  onClick={() => {
                    save(formData)
                    alert('Changes saved successfully!')
                  }}
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Active Persona Indicator */}
            <div className="flex items-center gap-3 bg-[#F0E0CC]/40 border border-[#F0E0CC] p-4 rounded-[12px]">
              <span className="text-xs font-black uppercase tracking-widest text-[#5C5246]">Active Persona:</span>
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-[8px] select-none shadow-sm">
                {PERSONAS.find(p => p.id === persona)?.label || persona.toUpperCase()}
              </span>
            </div>

            {/* Main Data Forms */}
            <div className="border border-[#F0E0CC] bg-white p-6 sm:p-10 rounded-[40px] shadow-xl">
              {['developer', 'dev'].includes(persona) && <DeveloperForm data={formData} onChange={handleFormChange} isOwner />}
              {persona === 'student' && <StudentForm data={formData} onChange={handleFormChange} />}
              {persona === 'creator' && <CreatorForm data={formData} onChange={handleFormChange} />}
              {persona === 'gamer' && <GamerForm data={formData} onChange={handleFormChange} />}
              {['fitness', 'gym', 'athlete'].includes(persona) && <FitnessForm data={formData} onChange={handleFormChange} />}
              {persona === 'influencer' && <InfluencerForm data={formData} onChange={handleFormChange} />}
            </div>
          </div>

          {/* RIGHT: Real-time Profile Power/Completion Ring */}
          <div className="lg:col-span-4 space-y-8 sticky top-28 h-fit">
            <CompletionRing
              score={result.score}
              incomplete={result.incomplete}
              grade={result.grade}
              onFillClick={handleAnchorClick}
            />
          </div>

        </div>
      </main>
    </div>
  )
}
