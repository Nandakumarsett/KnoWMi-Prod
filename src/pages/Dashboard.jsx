import { useState, useEffect, useMemo, useRef } from 'react'
import Avatar from '../components/Avatar'
import { useNavigate } from 'react-router-dom'
import { 
  Zap, LayoutDashboard, Signal, Globe, User, Save, Check, Plus, X,
  Instagram, Linkedin, MessageCircle, Github, Twitter, Youtube, 
  Mail, Twitch, Trophy, GraduationCap, Dumbbell, Gamepad2, 
  Code2, Rocket, Newspaper, Star, Target, Activity, Link2, Bell, 
  Settings, Eye, Sparkles, TrendingUp, TrendingDown, Users, 
  ArrowUpRight, ChevronRight, Clock, MapPin, Smartphone, BarChart3,
  Flame, Share2, Download, Award, Palette, GripVertical, Trash2,
  Upload, Loader2, Camera, Paintbrush, ArrowRight, CheckCircle2,
  Edit3, ChevronLeft, Lock, Crown, QrCode, ShoppingBag, UserPlus, ShieldCheck,
  ArrowLeft, ChevronDown
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase, getAssetUrl } from '../lib/supabase'
import ViewsChart from '../components/analytics/ViewsChart'
import DevicePie from '../components/analytics/DevicePie'
import SourceDonut from '../components/analytics/SourceDonut'
import ReferrerBar from '../components/analytics/ReferrerBar'
import RecentVisitors from '../components/analytics/RecentVisitors'
import LiveCounter from '../components/analytics/LiveCounter'
import QRManager from '../components/dashboard/QRManager'
import { getAnalyticsData } from '../lib/analytics/data-source'
import { useRealtimeAnalytics } from '../hooks/useRealtimeAnalytics'
import HeroCard from '../components/vibe/HeroCard'
import StatGrid from '../components/vibe/StatGrid'
import MomentsCard from '../components/vibe/MomentsCard'
import DeviceDonut from '../components/vibe/DeviceDonut'
import StreakCard from '../components/vibe/StreakCard'
import CityCard from '../components/vibe/CityCard'
import ViralCard from '../components/vibe/ViralCard'
import { AIInsightsToggle } from '../components/vibe/AIInsightsToggle'

// Import Persona forms
import { DeveloperForm } from '../components/identity/forms/DeveloperForm'
import { StudentForm } from '../components/identity/forms/StudentForm'
import { CreatorForm } from '../components/identity/forms/CreatorForm'
import { GamerForm } from '../components/identity/forms/GamerForm'
import { FitnessForm } from '../components/identity/forms/FitnessForm'
import { InfluencerForm } from '../components/identity/forms/InfluencerForm'

// ============ PREMIUM DESIGN SYSTEM ============
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  :root {
    --sf: #F97316;
    --sf-dark: #2A2A2A;
    --sf-light: #EAEAEA;
    --brand-black: #111111;
    --sf-glow: rgba(224, 123, 26, 0.15);
    --gold: #FFB347;
    --emerald: #10B981;
    --emerald-light: #ECFDF5;
    --ruby: #EF4444;
    --ruby-light: #FEF2F2;
    --sapphire: #3B82F6;
    --sapphire-light: #EFF6FF;
    --violet: #8B5CF6;
    --violet-light: #F5F3FF;
    --pink: #EC4899;
    --pink-light: #FDF2F8;
  }

  body { background: #FAFAF9; color: #111111; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  .font-display { font-family: 'Montserrat', sans-serif; font-weight: 800; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .card { background: white; border: 1px solid #E7E5E4; border-radius: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .card:hover { border-color: #D6D3D1; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); transform: translateY(-2px); }

  .btn-primary { background: var(--sf); color: white; border-radius: 16px; font-weight: 700; transition: all 0.3s ease; }
  .btn-primary:hover { background: var(--sf-dark); box-shadow: 0 10px 20px var(--sf-glow); transform: translateY(-1px); }

  .premium-input { width: 100%; padding: 14px 18px; background: #F5F5F4; border: 1px solid #E7E5E4; border-radius: 16px; font-size: 14px; font-weight: 500; transition: all 0.2s; outline: none; }
  .premium-input:focus { background: white; border-color: var(--sf); box-shadow: 0 0 0 4px var(--sf-glow); }

  .live-dot { width: 8px; height: 8px; background: var(--emerald); border-radius: 50%; position: relative; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

  .step-dot { transition: all 0.4s ease; border: 2px solid transparent; }
  .step-dot.active { border-color: var(--sf); background: var(--sf-light); color: var(--sf); transform: scale(1.1); }
  .step-dot.completed { background: #ECFDF5; color: #10B981; }

  .persona-card { cursor: pointer; border-radius: 28px; padding: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 2px solid transparent; }
  .persona-card.active { border-color: white; outline: 3px solid var(--sf); transform: scale(1.02); box-shadow: 0 30px 60px -10px rgba(0,0,0,0.1); }

  .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: #1C1917; color: white; padding: 12px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.4s ease-out; z-index: 1000; }
  @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

  .animate-float-preview { animation: floatPreview 6s ease-in-out infinite; }
  @keyframes floatPreview { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

  .gradient-text { background: linear-gradient(135deg, var(--sf), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  .qr-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(224, 123, 26, 0.9), rgba(245, 158, 11, 0.8));
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    z-index: 10;
  }

  .premium-shimmer {
    position: relative;
    overflow: hidden;
  }
  .premium-shimmer::after {
    content: "";
    position: absolute;
    top: -150%;
    left: -150%;
    width: 300%;
    height: 300%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0) 45%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 55%,
      transparent 100%
    );
    animation: shimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(25deg);
    pointer-events: none;
  }
  @keyframes shimmer {
    0% { transform: translate(-30%, -30%) rotate(25deg); }
    100% { transform: translate(30%, 30%) rotate(25deg); }
  }

  .tab-transition {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tab-hidden {
    opacity: 0;
    transform: scale(0.98) translateY(15px);
    filter: blur(8px);
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .tab-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`

const PERSONAS = {
  dev: {
    id: 'dev', label: 'Developer', emoji: '💻', icon: Code2, bg: 'linear-gradient(180deg, #0A1628 0%, #0F1E38 100%)',
    accent: '#3B9EFF', accentLight: 'rgba(59, 158, 255, 0.15)', cardBg: 'rgba(59, 158, 255, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#6B9CD1', tagBg: 'rgba(59, 158, 255, 0.12)',
    buttonBg: 'linear-gradient(135deg, #3B9EFF, #5FB4FF)',
    fields: ['github', 'linkedin', 'blog', 'twitter', 'instagram'], stats: ['Built Projects', 'GitHub Stars']
  },
  influencer: {
    id: 'influencer', label: 'Creator', emoji: '📸', icon: Rocket, bg: 'linear-gradient(180deg, #2A1810 0%, #3A2418 100%)',
    accent: '#F59E0B', accentLight: 'rgba(245, 158, 11, 0.15)', cardBg: 'rgba(245, 158, 11, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#D4A574', tagBg: 'rgba(245, 158, 11, 0.12)',
    buttonBg: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    fields: ['instagram', 'tiktok', 'youtube', 'email'], stats: ['Followers', 'Collabs']
  },
  gamer: {
    id: 'gamer', label: 'Gamer', emoji: '🎮', icon: Gamepad2, bg: 'linear-gradient(180deg, #1A0B2E 0%, #241240 100%)',
    accent: '#A855F7', accentLight: 'rgba(168, 85, 247, 0.15)', cardBg: 'rgba(168, 85, 247, 0.1)',
    textPrimary: '#FFFFFF', textSecondary: '#B794D6', tagBg: 'rgba(168, 85, 247, 0.12)',
    buttonBg: 'linear-gradient(135deg, #A855F7, #C084FC)',
    fields: ['twitch', 'discord', 'steam', 'youtube', 'instagram'], stats: ['League Rank', 'Followers']
  },
  student: {
    id: 'student', label: 'Student', emoji: '🎓', icon: GraduationCap, bg: 'linear-gradient(180deg, #0F1225 0%, #1A1E3A 100%)',
    accent: '#818CF8', accentLight: 'rgba(129, 140, 248, 0.15)', cardBg: 'rgba(129, 140, 248, 0.1)',
    textPrimary: '#FFFFFF', textSecondary: '#A5B4FC', tagBg: 'rgba(129, 140, 248, 0.12)',
    buttonBg: 'linear-gradient(135deg, #818CF8, #A78BFA)',
    fields: ['linkedin', 'github', 'resume', 'notion', 'instagram'], stats: ['CGPA', 'University']
  },
  gym: {
    id: 'gym', label: 'Athlete', emoji: '💪', icon: Dumbbell, bg: 'linear-gradient(180deg, #2A0A0A 0%, #3A1414 100%)',
    accent: '#EF4444', accentLight: 'rgba(239, 68, 68, 0.15)', cardBg: 'rgba(239, 68, 68, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#FCA5A5', tagBg: 'rgba(239, 68, 68, 0.12)',
    buttonBg: 'linear-gradient(135deg, #EF4444, #F87171)',
    fields: ['strava', 'instagram', 'youtube', 'coaching'], stats: ['Max PR', 'Gym Name']
  }
}

const VerificationLock = ({ profile, user }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="card p-10 max-w-md w-full glass shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--sf), var(--gold))' }} />
      <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Lock size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-display font-black text-neutral-900 mb-4 leading-tight">Identity <span className="text-orange-500 italic">Pending</span></h2>
      <p className="text-sm text-neutral-500 mb-10 leading-relaxed font-medium">
        Welcome to KnoWMi, <span className="font-bold text-neutral-800">{profile?.first_name}</span>! Your Analytics Pulse and Phygital Profile are currently locked while we verify your account.
      </p>
      <div className="space-y-4">
        <a
          href={`https://wa.me/917981325397?text=${encodeURIComponent(`Hi KnoWMi! I'm ${profile?.first_name}. I've signed up and would like to verify my account.\nEmail: ${user?.email}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-xl"
        >
          <MessageCircle size={20} className="fill-white/20" />
          Verify via WhatsApp
        </a>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Verification typically takes 5-10 minutes.
        </p>
      </div>
    </div>
    <div className="mt-12 flex items-center gap-6 opacity-30 grayscale pointer-events-none">
       <BarChart3 size={32} />
       <Users size={32} />
       <Trophy size={32} />
       <MapPin size={32} />
    </div>
  </div>
)

const FIELD_META = {
  github:    { emoji: '🐙', label: 'GitHub', prefix: 'github.com/' },
  linkedin:  { emoji: '💼', label: 'LinkedIn', prefix: 'linkedin.com/in/' },
  twitter:   { emoji: '🐦', label: 'Twitter', prefix: 'twitter.com/' },
  instagram: { emoji: '📸', label: 'Instagram', prefix: 'instagram.com/' },
  youtube:   { emoji: '📺', label: 'YouTube', prefix: 'youtube.com/@' },
  tiktok:    { emoji: '🎵', label: 'TikTok', prefix: 'tiktok.com/@' },
  twitch:    { emoji: '🎮', label: 'Twitch', prefix: 'twitch.tv/' },
  discord:   { emoji: '💬', label: 'Discord', prefix: 'discord.gg/' },
  steam:     { emoji: '🎯', label: 'Steam', prefix: 'steamcommunity.com/id/' },
  notion:    { emoji: '📝', label: 'Notion', prefix: 'notion.so/' },
  strava:    { emoji: '🏃', label: 'Strava', prefix: 'strava.com/athletes/' },
  blog:      { emoji: '📄', label: 'Blog', prefix: 'https://' },
  email:     { emoji: '💌', label: 'Email', prefix: '' },
  coaching:  { emoji: '📞', label: 'Coaching', prefix: 'wa.me/' },
  resume:    { emoji: '📋', label: 'Resume', prefix: 'https://' }
}

const StatCard = ({ label, value, color, icon: Icon, delay = 0 }) => (
  <div className="card p-8 animate-slideUp group hover:border-orange-500/30" style={{ animationDelay: `${delay}s` }}>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg" style={{ background: `${color}15`, color, boxShadow: `0 8px 20px ${color}15` }}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">{label}</p>
    <h3 className="text-4xl font-black font-display text-neutral-900 tracking-tight">{value.toLocaleString()}</h3>
  </div>
)
const PersonaEditor = ({ profile, onUpdate }) => {
  // Initialize identities from persona_data or create the first one from profile
  const [identities, setIdentities] = useState(() => {
    const stored = profile?.persona_data?.identities || []
    if (stored.length === 0 && profile?.persona_type) {
      return [{
        id: 'primary',
        persona_type: profile.persona_type,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        data: profile.persona_data || {},
        active: true
      }]
    }
    return stored
  })

  const [activeIdentityId, setActiveIdentityId] = useState(() => {
    const active = identities.find(i => i.active)
    return active ? active.id : 'primary'
  })

  // State for the identity currently being edited
  const [editingId, setEditingId] = useState(null) 
  const [persona, setPersona] = useState('dev')
  const [data, setData] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [showDetailedPersona, setShowDetailedPersona] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extractedColor, setExtractedColor] = useState(null)
  const colorCache = useRef({})
  const [errors, setErrors] = useState({})
  const [statErrors, setStatErrors] = useState({})

  // Load identity into editor
  const startEditing = (id) => {
    const identity = identities.find(i => i.id === id)
    if (identity) {
      setEditingId(id)
      setPersona(identity.persona_type)
      setData(identity.data || {})
      setFirstName(identity.first_name)
      setLastName(identity.last_name)
      setBio(identity.bio)
      setIsEditing(true)
    }
  }

  const addNewIdentity = () => {
    if (identities.length >= 3) return
    const newId = `id-${Math.random().toString(36).substring(2, 9)}`
    setEditingId(newId)
    setPersona(null) // Force Choose Your Path
    setData({})
    setFirstName(profile?.first_name || '')
    setLastName(profile?.last_name || '')
    setBio('')
    setIsEditing(true)
  }

  const toggleActive = async (id) => {
    const updated = identities.map(i => ({ ...i, active: i.id === id }))
    setIdentities(updated)
    
    const active = updated.find(i => i.id === id)
    // Update main profile with active identity data for public view/Tee scan
    await supabase.from('profiles').update({
      persona_type: active.persona_type,
      persona_data: { ...active.data, identities: updated },
      first_name: active.first_name,
      last_name: active.last_name,
      bio: active.bio
    }).eq('id', profile.id)
    onUpdate()
  }

  const formatK = (val) => {
    if (!val) return '0';
    const num = parseInt(String(val).replace(/\D/g, ''));
    if (isNaN(num)) return val;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  }

  // Extract color logic remains same...
  useEffect(() => {
    if (profile?.avatar_url) {
      if (colorCache.current[profile.avatar_url]) {
        setExtractedColor(colorCache.current[profile.avatar_url]);
        return;
      }
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = profile.avatar_url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1; canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const color = `rgb(${r},${g},${b})`;
        colorCache.current[profile.avatar_url] = color;
        setExtractedColor(color);
      };
    }
  }, [profile?.avatar_url])

  const baseTheme = PERSONAS[persona] || PERSONAS[persona === 'developer' ? 'dev' : persona] || PERSONAS.dev
  const theme = useMemo(() => {
    if (!extractedColor) return baseTheme;
    const darkBase = baseTheme.bg.match(/#[0-9A-Fa-f]{6}/g)?.[1] || '#0F172A';
    return {
      ...baseTheme,
      accent: extractedColor,
      bg: `linear-gradient(180deg, ${extractedColor}44 0%, ${darkBase} 100%)`,
      cardBg: `${extractedColor}20`
    };
  }, [baseTheme, extractedColor])

  const handleAvatarUpload = async (file) => {
    if (!file || file.size > 2 * 1024 * 1024) return
    try {
      setUploading(true)
      const filePath = `${profile.id}-${Math.random()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(filePath, file)
      const maskedUrl = `/content/avatars/${filePath}`
      await supabase.from('profiles').update({ avatar_url: maskedUrl }).eq('id', profile.id)
      onUpdate()
    } finally { setUploading(false) }
  }

  const handleSave = async () => {
    // Validation...
    const fieldErrors = {};
    const sErrors = {};
    theme.fields.forEach(f => {
      if (data[f] && /^\d+$/.test(data[f])) fieldErrors[f] = true;
    });
    theme.stats.forEach(s => {
      if (data[s] && !/^\d+$/.test(String(data[s]).replace(/[KM]/gi, ''))) sErrors[s] = true;
    });

    if (Object.keys(fieldErrors).length > 0 || Object.keys(sErrors).length > 0) {
      setErrors(fieldErrors);
      setStatErrors(sErrors);
      return;
    }

    setSaving(true)
    try {
      // Update or Add to identities array
      let updatedIdentities = [...identities]
      const existingIndex = updatedIdentities.findIndex(i => i.id === editingId)
      
      const identityData = {
        id: editingId,
        persona_type: persona,
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        data: data,
        active: existingIndex >= 0 ? updatedIdentities[existingIndex].active : identities.length === 0
      }

      if (existingIndex >= 0) {
        updatedIdentities[existingIndex] = identityData
      } else {
        updatedIdentities.push(identityData)
      }

      const isMainSync = identityData.active
      
      const dbData = {}
      if (isMainSync) {
        // Only sync to the EXACT legacy columns existing in the DB schema cache
        if (data.instagram) dbData.instagram_url = data.instagram;
        if (data.linkedin) dbData.linkedin_url = data.linkedin;
        if (data.github) dbData.github_url = data.github;
        if (data.twitter) dbData.twitter_url = data.twitter;
        if (data.website) dbData.website_url = data.website;
        if (data.youtube) dbData.youtube_url = data.youtube;
        if (data.twitch) dbData.twitch_url = data.twitch;
        if (data.whatsapp) dbData.whatsapp_number = data.whatsapp;
      }

      // 1. Update main profiles table
      const { error } = await supabase.from('profiles').update({ 
        persona_type: isMainSync ? persona : profile.persona_type, 
        persona_data: { ...profile.persona_data, identities: updatedIdentities },
        first_name: isMainSync ? firstName : profile.first_name,
        last_name: isMainSync ? lastName : profile.last_name,
        bio: isMainSync ? bio : profile.bio,
        ...dbData
      }).eq('id', profile?.id)

      if (error) throw error

      // 2. Sync to public_profiles table
      if (isMainSync) {
        await supabase.from('public_profiles').update({
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          persona_type: persona,
          ...dbData
        }).eq('id', profile?.id)
      }

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      setIsEditing(false)
      setIdentities(updatedIdentities)
      onUpdate()
    } catch (err) {
      console.error('Save error:', err)
      alert(`Save failed: ${err.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (!isEditing) {
    const isCreator = profile?.status === 'paid' || profile?.role === 'owner'
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-display font-black">My <span className="text-orange-500">Identities</span></h2>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{identities.length} / 3 Slots Used</span>
        </div>
        
        {/* Identity Cards List */}
        <div className="space-y-4">
          {identities.map(idnt => (
            <div 
              key={idnt.id} 
              onClick={() => startEditing(idnt.id)}
              className="card p-6 bg-white flex items-center gap-6 shadow-xl relative overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all active:scale-[0.98]"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${idnt.active ? 'bg-orange-500' : 'bg-neutral-200'}`} />
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
              <Avatar src={profile?.avatar_url} name={`${idnt.first_name} ${idnt.last_name}`} username={profile?.username} size="w-16 h-16 text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-black text-xl">{idnt.first_name} {idnt.last_name}</h3>
                  {idnt.active ? (
                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-md border border-emerald-100 flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleActive(idnt.id); }} 
                      className="px-2 py-0.5 bg-neutral-50 text-neutral-400 text-[9px] font-black uppercase rounded-md border border-neutral-200 hover:border-orange-200 hover:text-orange-500 transition-all relative z-10"
                    >
                      Make Live
                    </button>
                  )}
                </div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{PERSONAS[idnt.persona_type]?.label} Persona</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Identity Button (Creator Plan Only) */}
        {isCreator ? (
          identities.length < 3 ? (
            <button onClick={addNewIdentity} className="w-full h-24 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Identity</span>
            </button>
          ) : (
            <div className="text-center py-4 px-6 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Max 3 Identities Reached</p>
            </div>
          )
        ) : (
          <div className="card p-8 bg-orange-50 border border-orange-100 text-center">
            <Lock size={32} className="mx-auto mb-4 text-orange-500 opacity-50" />
            <h3 className="text-lg font-bold mb-1">Upgrade to Creator Plan</h3>
            <p className="text-xs text-neutral-500 mb-6">Unlock up to 3 different identities for your phygital scans.</p>
            <button onClick={() => window.location.href = '/#pricing'} className="btn-primary px-8 py-3 text-sm">Upgrade Now</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8 animate-slideUp">
          {/* Section 1: Path - Only show if persona is not yet chosen for this identity */}
          {!persona && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">01</div>
                <h2 className="text-xl font-display font-black">Choose Your Path</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(PERSONAS).map(p => (
                  <div key={p.id} onClick={() => setPersona(p.id)} className={`persona-card p-4 h-32 ${persona === p.id ? 'active' : ''}`} style={{ background: p.bg }}>
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: p.cardBg }}>{p.emoji}</div>
                     <h3 className="text-sm font-display font-bold text-white mb-0.5">{p.label}</h3>
                     <p className="text-[8px] uppercase font-bold tracking-widest" style={{ color: p.textSecondary }}>Select Theme</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Identity */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">{!persona ? '02' : '01'}</div>
              <h2 className="text-xl font-display font-black">Build Your Identity</h2>
            </div>
            <div className="space-y-4 card p-6 bg-white shadow-sm">
              <div className="flex items-center gap-6 p-4 bg-neutral-50 rounded-2xl">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center text-4xl shadow-lg border-4 border-white">
                    <Avatar src={profile?.avatar_url} name={`${firstName} ${lastName}`} username={profile?.username} size="w-20 h-20 text-4xl" />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-110 transition-all"><Plus size={16}/><input type="file" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files[0])}/></label>
                </div>
                <div><p className="text-sm font-bold">Profile Picture</p><p className="text-[10px] text-neutral-400">JPG or PNG • Max 2MB</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">First Name</label><input className="premium-input" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Last Name</label><input className="premium-input" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
              </div>
              <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Bio</label><textarea className="premium-input min-h-[100px]" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world who you are..." /></div>
              <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Public Tagline</label><input className="premium-input" value={data.tagline || ''} onChange={e => setData({...data, tagline: e.target.value})} placeholder="e.g. Building the future..." /></div>
            </div>
          </section>

          {/* Section 3: Connect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">{profile?.persona_type ? '02' : '03'}</div>
              <h2 className="text-xl font-display font-black">Connect Your World</h2>
            </div>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  {theme.stats.map(s => (
                    <div key={s} className={`p-3 card transition-all ${statErrors[s] ? 'bg-red-50 border-red-200' : 'bg-white shadow-sm'}`}>
                      <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mb-1">{s}</p>
                      <input 
                        className={`w-full text-lg font-display font-black outline-none bg-transparent ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-900'}`} 
                        placeholder="0" 
                        value={data[s] || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val && !/^\d*$/.test(val)) {
                            setStatErrors({...statErrors, [s]: true})
                          } else {
                            setStatErrors({...statErrors, [s]: false})
                            setData({...data, [s]: val})
                          }
                        }} 
                      />
                      <p className={`text-[8px] font-bold mt-0.5 ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-400'}`}>
                        {statErrors[s] ? '⚠️ Numbers Only' : 'Ex: 12000 -> 12K'}
                      </p>
                    </div>
                  ))}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {theme.fields.map(f => {
                    const isLocked = profile?.status !== 'paid' && profile?.role !== 'owner' && ['instagram', 'youtube'].includes(f)
                    const hasError = errors[f]
                    return (
                      <div key={f} className={`flex items-center gap-3 p-3 card transition-all ${isLocked ? 'opacity-60 bg-neutral-50' : 'bg-white shadow-sm'} ${hasError ? 'border-ruby-500 bg-red-50' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${hasError ? 'bg-ruby-100 text-ruby-500' : 'bg-neutral-100'}`}>{FIELD_META[f]?.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[8px] font-bold uppercase tracking-wider truncate mb-0.5 ${hasError ? 'text-ruby-500' : 'text-neutral-400'}`}>{f}</p>
                          <input 
                            disabled={isLocked}
                            className={`w-full text-xs font-bold outline-none bg-transparent ${hasError ? 'text-ruby-500' : isLocked ? 'text-neutral-400' : 'text-neutral-900'}`} 
                            placeholder={isLocked ? 'Locked' : `UserName`} 
                            value={data[f] || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              setData({...data, [f]: val});
                            }} 
                          />
                        </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          </section>

          {/* Section 4: Specific Persona Details */}
          {persona && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-orange-500/30">{profile?.persona_type ? '03' : '04'}</div>
                <h2 className="text-2xl font-display font-black text-[#1A0A00]">Detailed Persona Attributes</h2>
              </div>
              
              {!showDetailedPersona ? (
                <button 
                  type="button"
                  onClick={() => setShowDetailedPersona(true)}
                  className="w-full py-6 bg-white border-2 border-dashed border-[#E5D5C4] hover:bg-[#FDF6EE] hover:border-orange-300 transition-all rounded-[24px] flex flex-col items-center justify-center gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  <span className="text-sm font-black text-neutral-800 tracking-tight">Click to add Additional details</span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Expand for specific attributes</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowDetailedPersona(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                    >
                      <ChevronDown size={14} className="rotate-180" /> Collapse Attributes
                    </button>
                  </div>
                  <div className="p-6 sm:p-10 bg-white border border-[#E5D5C4] rounded-[32px] shadow-xl shadow-[#E5D5C4]/20 animate-slideUp">
                    {['developer', 'dev'].includes(persona) && <DeveloperForm data={data} onChange={setData} isOwner />}
                    {persona === 'student' && <StudentForm data={data} onChange={setData} />}
                    {persona === 'creator' && <CreatorForm data={data} onChange={setData} />}
                    {persona === 'gamer' && <GamerForm data={data} onChange={setData} />}
                    {['fitness', 'gym', 'athlete'].includes(persona) && <FitnessForm data={data} onChange={setData} />}
                    {persona === 'influencer' && <InfluencerForm data={data} onChange={setData} />}
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="flex flex-col gap-3 pt-6">
            <button onClick={handleSave} className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg shadow-2xl">
              {saving ? <Loader2 className="animate-spin" /> : <><Save size={24}/> Save Identity</>}
            </button>
            <button onClick={() => setIsEditing(false)} className="py-3 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">Cancel Changes</button>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-neutral-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Identity Preview</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50">
              <div className="live-dot" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Live</span>
            </div>
          </div>

          <div className="persona-card overflow-hidden animate-float-preview shadow-2xl" style={{ background: theme.bg, padding: 0 }}>
            <div className="preview-card" style={{ padding: '40px 24px' }}>
              <div 
                className="w-24 h-24 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-5xl shadow-2xl"
                style={{ background: theme.cardBg, border: `2.5px solid ${theme.accentLight}` }}
              >
                <Avatar src={profile?.avatar_url} name={`${firstName} ${lastName}`} username={profile?.username} size="w-24 h-24 text-4xl" />
              </div>
              <h3 className="text-2xl font-display font-black text-center mb-1" style={{ color: theme.textPrimary }}>{firstName} {lastName || ''}</h3>
              <p className="text-[10px] font-bold text-center uppercase tracking-[0.2em] mb-4" style={{ color: theme.accent }}>{data.tagline || `${theme.label} Identity`}</p>
              
              {bio && (
                <p className="text-center text-[10px] mb-4 leading-relaxed opacity-60 line-clamp-2 px-4" style={{ color: theme.textSecondary }}>
                  {bio}
                </p>
              )}

              {/* Stats Grid */}
              {theme.stats && theme.stats.some(s => data[s]) && (
                <div className="flex items-center justify-center gap-6 mb-6 px-4">
                  {theme.stats.map((s, i) => (
                    <div key={s} className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xl font-display font-black" style={{ color: theme.accent }}>{formatK(data[s])}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-50" style={{ color: theme.textSecondary }}>{s}</p>
                      </div>
                      {i === 0 && theme.stats[1] && <div className="w-px h-8 bg-white/10" />}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                 {theme?.fields?.filter(f => data[f]).slice(0, 3).map(f => (
                   <div key={f} className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 shadow-inner" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                     <span className="text-lg">{FIELD_META[f]?.emoji || '🔗'}</span>
                     <div className="flex flex-col">
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{FIELD_META[f]?.label || f}</span>
                       <span className="text-[11px] font-black uppercase tracking-tight text-white">{data[f]}</span>
                     </div>
                     <ArrowRight size={14} className="ml-auto" style={{ color: theme.accent }} />
                   </div>
                 ))}
                 {theme.fields.filter(f => data[f]).length === 0 && (
                   <div className="text-center py-8 opacity-20" style={{ color: theme.textSecondary }}>
                     <Link2 size={24} className="mx-auto mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Links will appear here</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-400 mt-6 font-bold uppercase tracking-widest">
            Real-Time Intelligence Preview
          </p>
        </div>
      </div>
      {showToast && <div className="toast"><CheckCircle2 size={16} /> Identity Updated!</div>}
    </div>
  )
}



const IdentityPass = ({ profile }) => {
  const isOwner = profile?.role === 'owner';
  const isFree = profile?.status === 'free' || (!profile?.status && !profile?.tier) || profile?.tier === 'Free';
  const isPaid = !isFree || isOwner;
  const secretSlug = profile?.secure_slug || profile?.id
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/p/${secretSlug}`)}`

  return (
    <div className="animate-slideUp space-y-8">
      <div className="flex items-end justify-between">
        <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">My Official Identity</p><h2 className="text-5xl font-display font-black tracking-tight">Identity <span className="gradient-text">Pass</span></h2></div>
        <div className="flex gap-2">
          {isPaid && <button onClick={() => window.print()} className="btn-primary h-12 px-8 text-sm flex items-center gap-2"><Download size={18}/> Print / Download Pass</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
        <div className="relative group">
          <div 
            onClick={() => window.location.href = `/p/${profile?.secure_slug || profile?.first_name || profile?.id}`}
            className="card p-12 flex flex-col items-center bg-white shadow-2xl relative overflow-hidden cursor-pointer hover:shadow-orange-500/10 transition-all border-none"
          >
            <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-emerald-50/50 px-2.5 py-1.5 rounded-xl backdrop-blur-sm border border-emerald-500/10">
              <div className="live-dot"/>
              <span className="text-[10px] text-emerald-600 font-black tracking-widest uppercase">Verified</span>
            </div>

            <div className="flex flex-col items-center -mt-4 mb-3">
              <img src="/logo-square.png" className="w-36 h-36 object-contain -mb-10 bg-transparent border-none shadow-none" alt="KnoWMi Logo" />
              <h4 className="text-[32px] font-display font-black leading-[0.8] mb-1 tracking-[0.05em]">KnoWMi</h4>
              <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-neutral-400">Official Identity Pass</p>
            </div>

            <div className="relative w-64 h-64 mb-6">
              <img src={qrUrl} className={`w-full h-full object-contain ${!isPaid ? 'opacity-20 blur-sm grayscale' : ''}`} alt="Identity QR" />
              
              {!isPaid && (
                <div className="qr-mask">
                  <Lock className="text-white mb-4" size={40} />
                  <p className="text-white font-black text-xs uppercase tracking-widest text-center px-6 leading-relaxed">Identity Pass Locked</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-5 w-64 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-3xl font-display font-black leading-tight">{profile?.first_name} {profile?.last_name || ''}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  {profile?.persona_data?.title || 'Digital Creator'}
                </p>
              </div>
              <p className="text-[14px] font-black text-orange-500 uppercase tracking-[0.3em]">
                {String(profile?.wm_code || '').replace('PT-', 'WM-')}
              </p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8 bg-orange-50/30 border-orange-200 premium-shimmer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shrink-0"><Crown size={24}/></div>
              <div>
                <h4 className="text-lg font-bold mb-1">{isPaid ? 'You are our Premium Customer Now' : 'Upgrade to Premium (Buy A Tee)'}</h4>
                <p className="text-sm text-neutral-600 mb-6">
                  {isPaid 
                    ? 'Your physical identity is active. Enjoy unmasked QR access, detailed scan locations, and advanced persona statistics.' 
                    : 'Buy A Tee to unlock QR Analytics, location tracking, and advanced persona profile statistics.'}
                </p>
                {!isPaid && <button onClick={() => window.location.href = '/#pricing'} className="btn-primary px-8 py-3 text-sm">Buy A Tee — View Plans</button>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="card p-6 bg-emerald-50/20 border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Award size={20}/></div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Premium Benefits Included</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    "Lifetime Advanced Analytics",
                    "Dynamic NFC Sleeve Activation",
                    "240 GSM Ultra-Premium Cotton",
                    "Verified Profile Badge",
                    "Priority 24/7 WhatsApp Support",
                    "Location-Based Scan Tracking"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                      <Check size={14} className="text-emerald-500" /> {benefit}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, user, loading: authLoading, refreshProfile, isVerified, role } = useAuth()
  const [scans, setScans] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('knowmi_active_tab') || 'analytics'
  })
  
  useEffect(() => {
    localStorage.setItem('knowmi_active_tab', activeTab)
  }, [activeTab])

  const [analyticsView, setAnalyticsView] = useState('vibe')
  const [vibeTheme, setVibeTheme] = useState('light')
  const [vibeStats, setVibeStats] = useState(null)
  const [selectedRange, setSelectedRange] = useState('today')
  const [vibeLoading, setVibeLoading] = useState(false)
  const [qrTokens, setQrTokens] = useState([])
  const [isLive, setIsLive] = useState(false)
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/?auth=signin')
    }
  }, [user, authLoading, navigate])
  const [editorProgress, setEditorProgress] = useState(null)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [dailyStats, setDailyStats] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [analyticsSummary, setAnalyticsSummary] = useState({ total: 0, unique: 0, qr: 0, repeat: 0 })
  const [locationInsights, setLocationInsights] = useState([])
  const [deviceDistribution, setDeviceDistribution] = useState({ mobile: 0, desktop: 0, tablet: 0 })
  const [linkClicks, setLinkClicks] = useState([])
  const [selectedSize, setSelectedSize] = useState('L')
  const idleTimer = useRef(null)



  const [connections, setConnections] = useState([])
  
  const refreshAnalytics = useMemo(() => async () => {
    if (!profile?.id) return;
    const rangeToUse = analyticsView === 'classic' ? selectedRange : 'all';
    const data = await getAnalyticsData(profile.id, rangeToUse);
    setVibeStats(data);
    setVibeLoading(false);
  }, [profile?.id, analyticsView, selectedRange]);

  useEffect(() => {
    if (profile?.id) {
      setVibeLoading(true);
      refreshAnalytics();
    }
  }, [profile?.id, refreshAnalytics]);

  const handleNewEvent = useMemo(() => () => {
    console.log('✅ LIVE EVENT RECEIVED');
    setIsLive(true);
    setTimeout(() => setIsLive(false), 20000);
    refreshAnalytics();
  }, [refreshAnalytics]);

  useRealtimeAnalytics(profile?.id, handleNewEvent);

  useEffect(() => { 
    if (profile?.id) {
      // Fetch orders
      supabase.from('orders').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false })
        .then(({data}) => { setOrders(data || []); setLoading(false) })
    } else if (!authLoading) setLoading(false)
  }, [profile, authLoading])

  const latestOrder = orders[0]

  const deviceData = [
    { name: 'iPhone', value: 45, color: '#E07B1A' },
    { name: 'Android', value: 35, color: '#10B981' },
    { name: 'Desktop', value: 20, color: '#8B5CF6' }
  ]

  const chartData = useMemo(() => {
    return [6,5,4,3,2,1,0].map(i => {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      return { 
        name: d.toLocaleDateString('en', {day:'numeric', month:'short'}), 
        value: (scans || []).filter(s => s?.scanned_at?.startsWith(ds)).length 
      }
    })
  }, [scans])



  // REAL DATA CALCULATIONS (LIVE FORMULAS)
  const totalProfileViews = vibeStats?.totalViews || 0
  const uniqueScans = vibeStats?.uniqueViews || 0
  const qrScanRate = vibeStats?.qrScanRate || 0
  const qrScanRateLabel = `${qrScanRate}%`
  const repeatScore = vibeStats?.repeatScore || 0
  const repeatScoreLabel = repeatScore >= 40 ? 'High Loyalty' : repeatScore >= 15 ? 'Growing' : 'New Audience'

  const todayTotal = vibeStats?.todayTotal || 0
  const todayUnique = vibeStats?.todayUnique || 0

  const moments = useMemo(() => {
    if (!vibeStats) return [];
    const m = [];
    
    function formatSafeDate(dateStr, opts) {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', opts);
    }

    if (vibeStats.peakHour) {
      m.push({ 
        emoji: '🔥', 
        title: vibeStats.peakHour, 
        subtitle: 'Peak activity hour', 
        value: 'Peak', 
        glowColor: 'amber' 
      });
    }

    const bestDayLabel = formatSafeDate(vibeStats.bestDay?.day, { weekday: 'long' });
    if (bestDayLabel) {
      m.push({ 
        emoji: '⭐', 
        title: bestDayLabel, 
        subtitle: 'Your viral day', 
        value: 'Best', 
        glowColor: 'purple' 
      });
    }

    if (vibeStats.topCities?.[0]) {
      m.push({ 
        emoji: '📍', 
        title: vibeStats.topCities[0].city, 
        subtitle: 'Your primary vibe hub', 
        value: 'Hub', 
        glowColor: 'teal' 
      });
    }

    // Add recent event as a moment if it's very recent
    const latest = vibeStats.latestActivity?.[0];
    if (latest && (Date.now() - new Date(latest.viewed_at).getTime()) < 3600000) {
      m.push({
        emoji: '🆕',
        title: latest.city || 'Unknown Location',
        subtitle: 'Fresh scan detected',
        value: 'New',
        glowColor: 'coral'
      });
    }

    return m;
  }, [vibeStats]);



  if (authLoading || loading) return <div className="min-h-screen bg-[#FAFAF9] p-10"><style dangerouslySetInnerHTML={{ __html: STYLES }}/><div className="skeleton h-20 w-full rounded-2xl mb-6"/><div className="skeleton h-64 w-full rounded-2xl"/></div>

  // ABSOLUTE GATE: If not verified AND not owner, they see NOTHING but the lock.
  if (isVerified !== true && role !== 'owner') return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <header className="h-16 border-b bg-white/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </header>
      <VerificationLock profile={profile} user={user} />
    </div>
  )

  const isVibeDark = activeTab === 'analytics' && vibeTheme === 'dark';

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 relative overflow-hidden ${isVibeDark ? 'bg-[#0a0a0f] text-[#f0eff8] vibe-page dark' : 'bg-[#FAFAF9] text-[#111111]'}`}>
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-60" style={{
        backgroundImage: isVibeDark 
          ? 'radial-gradient(circle at 15% 50%, rgba(249, 115, 22, 0.08), transparent 35%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 35%)'
          : 'radial-gradient(circle at 15% 50%, rgba(249, 115, 22, 0.05), transparent 35%), radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.05), transparent 35%)'
      }} />
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* Personalized Navigation */}
      <header className={`h-20 backdrop-blur-md border-b flex items-center px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300 ${isVibeDark ? 'bg-[#13131a]/80 border-white/10' : 'bg-white/80 border-neutral-100'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className={`p-2 rounded-xl transition-colors flex items-center gap-2 group ${isVibeDark ? 'text-neutral-400 hover:bg-white/5' : 'text-neutral-400 hover:bg-neutral-100'}`}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
            </button>
            <div className={`h-8 w-px hidden sm:block ${isVibeDark ? 'bg-white/10' : 'bg-neutral-100'}`} />
            <div className="flex flex-col">
              <h1 className={`font-display text-2xl tracking-tight-premium transition-colors duration-300 ${isVibeDark ? 'text-white' : 'text-[#111111]'}`}>
                {profile?.first_name ? `${profile.first_name}'s` : 'KnoWMi'} <span className={`font-light text-xl ${isVibeDark ? 'text-neutral-500' : 'text-neutral-300'}`}>| Analytics</span>
              </h1>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-luxury leading-none mt-2">Scan Me. Know Me.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate(`/p/${profile?.secure_slug || profile?.id}`)}
              className={`flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl border transition-all cursor-pointer group ${isVibeDark ? 'bg-white/5 border-white/10 hover:border-orange-500/50' : 'bg-neutral-50 border-neutral-100 hover:border-orange-200'}`}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-black leading-none transition-colors duration-300 ${isVibeDark ? 'text-white' : 'text-neutral-900'}`}>{profile?.first_name}</p>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-luxury mt-2">{(profile?.wm_code || 'WM-NEW-000').replace('PT-', 'WM-')}</p>
                {profile?.is_verified && (
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1">✦ Founding Member</p>
                )}
              </div>
              <Avatar 
                src={profile?.avatar_url} 
                name={profile?.first_name} 
                username={profile?.username} 
                size="w-9 h-9 border-2 border-white shadow-sm group-hover:border-orange-500/20 transition-all" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-48">
        <div className={`tab-transition ${activeTab === 'analytics' ? 'tab-visible' : 'tab-hidden'}`}>
          {activeTab === 'analytics' && (
            <div className="animate-slideUp">

              {/* Sub-tab toggle */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-1 p-1.5 rounded-2xl border backdrop-blur-xl transition-colors duration-300" style={{
                  background: isVibeDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                  borderColor: isVibeDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  boxShadow: isVibeDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.04)'
                }}>
                  <button
                    onClick={() => setAnalyticsView('vibe')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden`}
                    style={{
                      background: analyticsView === 'vibe' ? (isVibeDark ? '#ffffff' : '#111111') : 'transparent',
                      color: analyticsView === 'vibe' ? (isVibeDark ? '#111111' : '#ffffff') : (isVibeDark ? 'rgba(255,255,255,0.5)' : '#888888'),
                      boxShadow: analyticsView === 'vibe' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    ✨ Vibe Stats
                  </button>
                  <button
                    onClick={() => setAnalyticsView('classic')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300`}
                    style={{
                      background: analyticsView === 'classic' ? (isVibeDark ? '#ffffff' : '#111111') : 'transparent',
                      color: analyticsView === 'classic' ? (isVibeDark ? '#111111' : '#ffffff') : (isVibeDark ? 'rgba(255,255,255,0.5)' : '#888888'),
                      boxShadow: analyticsView === 'classic' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    📊 Reports
                  </button>
                </div>
                <button
                  onClick={() => setVibeTheme(vibeTheme === 'light' ? 'dark' : 'light')}
                  style={{
                    padding: '10px 20px', borderRadius: 20, fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                    border: isVibeDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all .3s ease',
                    background: isVibeDark ? 'rgba(255,255,255,0.05)' : '#ffffff', color: isVibeDark ? '#ffffff' : '#111111',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  className={`hover:scale-105 active:scale-95`}
                >
                  {vibeTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>

              {/* ── VIBE STATS VIEW ── */}
              {analyticsView === 'vibe' && (
                <div className={`vibe-page ${vibeTheme === 'dark' ? 'dark' : ''}`} style={{ width: '100%', borderRadius: 24, padding: '16px 0', overflow: 'hidden' }}>
                  {vibeLoading || !vibeStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                      {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 120, background: 'var(--surface)', borderRadius: 16, animation: 'vibeSkeleton 1.5s ease-in-out infinite' }} />)}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 16px' }}>
                      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                        <HeroCard
                          todayScans={todayTotal}
                          isLive={isLive}
                          weekSparkline={vibeStats.weekSparkline}
                        />
                        <div style={{ marginTop: 24, width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); navigate('/insights'); }}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl hover:border-orange-500/50 hover:bg-orange-50/20 transition-all duration-300 shadow-sm flex items-center justify-between gap-3 active:scale-95 select-none"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center animate-pulse">✦</span>
                              <span className="text-sm font-bold font-display text-neutral-900">AI Insights (Beta)</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl">View Details →</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Your numbers</p>
                          <StatGrid 
                            totalViews={vibeStats.totalViews} 
                            tshirtScans={vibeStats.tshirtScans} 
                            profileQRScans={vibeStats.profileQRScans} 
                            uniqueViews={vibeStats.uniqueViews} 
                          />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Moments that matter</p>
                          <MomentsCard moments={moments} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Who's viewing</p>
                          <DeviceDonut {...vibeStats.deviceBreakdown} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Your streak</p>
                          <StreakCard {...vibeStats.streak} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Where in the world</p>
                          <CityCard topCities={vibeStats.topCities} totalCities={vibeStats.totalCities} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                          <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Your best moment</p>
                          <ViralCard bestMoment={vibeStats.bestMoment} />
                        </div>
                      </div>
                      <div style={{ height: 32 }} />
                    </div>
                  )}
                </div>
              )}

              {(vibeLoading || !vibeStats) && analyticsView === 'classic' && (
                <div className="space-y-8 p-4">
                  <div className="h-12 w-full bg-neutral-100 rounded-2xl animate-pulse" />
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-32 bg-neutral-100 rounded-2xl animate-pulse" />)}
                  </div>
                  <div className="h-96 w-full bg-neutral-100 rounded-3xl animate-pulse" />
                </div>
              )}

              {analyticsView === 'classic' && vibeStats && (
                <div className={`space-y-8 ${isVibeDark ? 'dark' : ''}`}>
                  {isVibeDark && (
                    <style dangerouslySetInnerHTML={{ __html: `
                      .space-y-8.dark .bg-white { background-color: #13131a !important; color: #fff !important; }
                      .space-y-8.dark .border-neutral-100,
                      .space-y-8.dark .border-neutral-50,
                      .space-y-8.dark .border-neutral-200 { border-color: rgba(255,255,255,0.12) !important; }
                      .space-y-8.dark .text-neutral-900,
                      .space-y-8.dark .text-neutral-800,
                      .space-y-8.dark .text-neutral-700 { color: #f0eff8 !important; }
                      .space-y-8.dark .text-neutral-600,
                      .space-y-8.dark .text-neutral-500 { color: #aaa5c3 !important; }
                      .space-y-8.dark .text-neutral-400 { color: #9c97b8 !important; }
                      .space-y-8.dark .text-neutral-300 { color: #8a85a4 !important; }
                      .space-y-8.dark .bg-neutral-50,
                      .space-y-8.dark .bg-neutral-50\\/30,
                      .space-y-8.dark .bg-neutral-100 { background-color: #1c1c26 !important; }
                      .space-y-8.dark .recharts-default-legend .recharts-legend-item-text { color: #f0eff8 !important; }
                    ` }} />
                  )}
          
          {/* Section 1: Highlights Bar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400">
              Highlights <span className="lowercase font-bold opacity-60">({selectedRange === 'today' ? 'Today' : selectedRange === 'yesterday' ? 'Yesterday' : selectedRange === 'last_7' ? 'Last 7 days' : selectedRange === 'last_week' ? 'Last week' : selectedRange === 'last_month' ? 'Last month' : selectedRange === 'ytd' ? 'Year to date' : 'All time'})</span>
            </h2>
            <div className="flex gap-3">
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer outline-none transition-all ${isVibeDark ? 'bg-[#1c1c26] border-white/10 text-white hover:border-white/20' : 'bg-white border-neutral-100 text-neutral-800 hover:border-neutral-200'}`}
              >
                <option value="today">Today Only</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7">Last 7 Days</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="ytd">Year to Date (YTD)</option>
                <option value="all">All Time</option>
              </select>
              <button className="px-4 py-2 bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Export Analytics</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Views', value: totalProfileViews.toLocaleString(), sub: 'Scans & Web', trend: 'Live', color: 'text-neutral-900', tooltip: 'Total number of times your profile page or phygital products have been loaded or scanned.' },
              { label: 'Unique Views', value: uniqueScans.toLocaleString(), sub: 'Real Individuals', trend: 'Verified', color: 'text-blue-500', tooltip: 'Number of unique visitors who viewed or scanned your profile, based on verification.' },
              { label: 'QR Scan Rate', value: qrScanRateLabel, sub: 'Physical to Digital', trend: 'Calculated', color: 'text-orange-500', tooltip: 'The percentage of visitors who scanned physical QR products versus accessing direct links.' },
              { label: 'Repeat Score', value: `${repeatScore}%`, sub: repeatScoreLabel, trend: 'Active', color: 'text-emerald-500', tooltip: 'The percentage of users who returned to view your profile again after their first visit.' }
            ].map((stat, i) => (
              <div key={i} className="p-6 vibe-card relative group overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
                  <div className="relative group/tooltip flex shrink-0">
                    <div className="w-4 h-4 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-400 flex items-center justify-center cursor-help shrink-0 select-none hover:bg-neutral-200 transition-colors">i</div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-neutral-900 text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl border border-neutral-800 font-sans normal-case tracking-normal leading-normal select-none">
                      {stat.tooltip}
                    </div>
                  </div>
                </div>
                <p className={`text-4xl font-black mb-1.5 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-bold text-neutral-300 uppercase tracking-tighter">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Section 2: Main Reports & Activity Grid */}

          {/* BENTO GRID: Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {/* Main Traffic Chart - Large Bento Piece */}
            <div className="md:col-span-4 vibe-card overflow-hidden flex flex-col bg-white animate-slideUp">
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/20">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-luxury text-neutral-900 mb-1">Traffic Intelligence</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">7-Day Engagement Window</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Total Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Unique Views</span>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1">
                <div className="h-[320px] w-full">
                  <ViewsChart data={vibeStats.dailyStats} />
                </div>
              </div>
              <div className="px-8 py-5 border-t border-neutral-50 bg-neutral-50/10 text-center">
                 <button className="text-[10px] font-black uppercase tracking-luxury text-neutral-400 hover:text-blue-500 transition-all">Deep Data Analysis ›</button>
              </div>
            </div>

            {/* Latest Activity - Vertical Bento Piece */}
            <div className="md:col-span-2 vibe-card overflow-hidden flex flex-col bg-white animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-luxury text-neutral-900 flex items-center gap-2">
                  Live Feed
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                </h3>
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                {!vibeStats.latestActivity?.length ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                       <Clock size={28} className="text-neutral-300" />
                    </div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Listening for Scans...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {vibeStats.latestActivity.slice(0, 5).map((ev, i) => (
                      <div key={i} className="flex gap-5 items-start group">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <Activity size={16} className="text-blue-500" />
                        </div>
                        <div className="flex-1">
                           <p className="text-[11px] font-black text-neutral-900 leading-tight">
                             {ev.is_repeat ? 'Repeat Visit' : (ev.referrer === 'qr' ? 'QR Code Scan' : 'Direct Link')}
                           </p>
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight mt-1">{ev.device_type} • {ev.city || 'Unknown'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-neutral-50 bg-neutral-50/10 text-center">
                 <button className="text-[10px] font-black uppercase tracking-luxury text-neutral-400 hover:text-orange-500 transition-all">Live Logs ›</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Location Insights - 3 columns */}
            <div className="md:col-span-3 vibe-card overflow-hidden flex flex-col bg-white animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-luxury text-neutral-900 flex items-center gap-2">
                  Global Reach
                  <MapPin size={16} className="text-orange-500" />
                </h3>
              </div>
              <div className="p-8 space-y-6">
                {vibeStats.topCities.length > 0 ? (
                  vibeStats.topCities.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-lg shadow-inner group-hover:bg-orange-50 transition-all">{loc.flag}</div>
                         <div>
                           <p className="text-xs font-black text-neutral-900">{loc.city}</p>
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{loc.country}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-neutral-900">{loc.count} Views</p>
                         <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${loc.barPct}%` }} />
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                     <Globe size={32} className="mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Global Signals...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Referral Sources - 2 columns */}
            <div className="md:col-span-2 vibe-card overflow-hidden flex flex-col bg-white animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-luxury text-neutral-900">Referral Sources</h3>
              </div>
              <div className="p-8 space-y-6">
                {Object.entries(vibeStats.topReferrers).length > 0 ? (
                  Object.entries(vibeStats.topReferrers).map(([ref, count], i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center">
                           <Share2 size={16} className="text-neutral-400" />
                         </div>
                         <span className="text-xs font-black text-neutral-700 capitalize">{ref}</span>
                       </div>
                       <span className="text-xs font-black text-neutral-900">{count}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                     <p className="text-[10px] font-black uppercase tracking-widest">No Referral Data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="vibe-card overflow-visible flex flex-col bg-white">
              <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 flex items-center gap-1.5">
                  Device Distribution
                  <div className="relative group flex shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-200 text-[9px] font-bold text-neutral-400 flex items-center justify-center cursor-help shrink-0 select-none hover:bg-neutral-300 transition-colors">i</div>
                    <div className="absolute top-full left-0 mt-2 w-48 p-2.5 bg-neutral-900 text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-xl border border-neutral-800 font-sans normal-case tracking-normal leading-normal select-none">
                      Devices (Mobile, Desktop, Tablet) used to scan or view your profile.
                    </div>
                  </div>
                </h3>
              </div>
              <div className="p-6 min-h-[300px] flex items-center justify-center">
              <DevicePie data={vibeStats.deviceBreakdown} />
              </div>
            </div>
            </div>
          </div>
        )}

      </div>
    )}
  </div>
          
          {/* Existing Tabs */}
          <div className={`tab-transition ${activeTab === 'profile' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'profile' && <PersonaEditor profile={profile} onUpdate={refreshProfile} />}
          </div>
          
          <div className={`tab-transition ${activeTab === 'pass' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'pass' && <IdentityPass profile={profile} />}
          </div>

          {/* Order Status Tab */}
          <div className={`tab-transition ${activeTab === 'order-status' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'order-status' && (
              <div className="space-y-8 animate-slideUp pb-20">
                <div className="flex items-end justify-between">
                  <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Delivery Pulse</p><h2 className="text-5xl font-display font-black tracking-tight">Order <span className="gradient-text">Status</span></h2></div>
                </div>

                {!latestOrder ? (
                  <div className="card p-20 text-center">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No active orders</h3>
                    <p className="text-sm text-neutral-400 mb-8">Browse the collection to get your Signature Tee.</p>
                    <button onClick={() => window.location.href = '/#collection'} className="btn-primary px-8 py-3 text-sm">Browse Collection</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="card p-8 bg-white shadow-xl border-none">
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Order Placed</p>
                            <p className="text-lg font-bold">{new Date(latestOrder.order_date || latestOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Order ID</p>
                            <p className="text-lg font-bold font-mono">{latestOrder.order_number || latestOrder.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="space-y-8 relative">
                          {/* Tracking Line */}
                          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-neutral-100" />
                          
                          {[
                            { label: 'Order Confirmed', status: 'pending', icon: Check, desc: 'Your identity is being prepared' },
                            { label: 'Payment Verified', status: 'paid', icon: ShieldCheck, desc: 'Quality check and packing' },
                            { label: 'In Transit', status: 'shipped', icon: Rocket, desc: latestOrder.tracking_info || 'Handed over to delivery partner' },
                            { label: 'Delivered', status: 'delivered', icon: MapPin, desc: `Arriving in ${latestOrder.delivery_city || 'your city'}` }
                          ].map((step, i) => {
                            const isCompleted = ['pending', 'paid', 'shipped', 'delivered'].indexOf(latestOrder.status) >= ['pending', 'paid', 'shipped', 'delivered'].indexOf(step.status)
                            const isCurrent = latestOrder.status === step.status
                            
                            return (
                              <div key={i} className={`flex gap-6 relative z-10 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-all ${isCompleted ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                  <step.icon size={14} strokeWidth={3} />
                                </div>
                                <div className="pb-2">
                                  <h4 className={`text-sm font-black uppercase tracking-wider mb-0.5 ${isCurrent ? 'text-orange-600' : 'text-neutral-900'}`}>{step.label}</h4>
                                  <p className="text-xs text-neutral-500">{isCompleted ? step.desc : 'Waiting...'}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="card p-6 border-dashed bg-transparent flex items-center gap-4 text-neutral-500">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm"><Globe size={24}/></div>
                        <div>
                          <p className="text-xs font-bold">Estimated Delivery</p>
                          <p className="text-[10px]">{latestOrder.estimated_delivery || 'Calculating based on your city...'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card p-10 bg-neutral-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
                       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
                       <div className="relative w-full aspect-square animate-float-slow">
                          {latestOrder.model_image_url ? (
                            <img src={getAssetUrl(latestOrder.model_image_url)} className="w-full h-full object-contain" alt={latestOrder.item_name} />
                          ) : (
                            <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]">
                              <path d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" fill="#262626" />
                              <path d="M45,108 Q100,120 155,108" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                              <rect x="50" y="80" width="100" height="1" fill="var(--saffron)" className="animate-scan-glow" />
                            </svg>
                          )}
                       </div>
                       <div className="text-center mt-6">
                         <h3 className="text-xl font-display font-black text-white mb-2">{latestOrder.item_name}</h3>
                         <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">{latestOrder.sku || 'SKU-SIGNATURE-TEE'}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`tab-transition ${activeTab === 'phygital' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'phygital' && (
              <div className="animate-slideUp space-y-8">
                <div className="flex items-end justify-between">
                  <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Physical Identification</p><h2 className="text-5xl font-display font-black tracking-tight">QR <span className="gradient-text">Studio</span></h2></div>
                </div>
                <QRManager initialTokens={qrTokens} profileId={profile?.id} profileSlug={profile?.secure_slug} />
              </div>
            )}
          </div>
        </main>

        {/* Global Live Toast Notification - TOP BANNER */}
        {isLive && (
          <div className="fixed top-0 left-0 right-0 z-[9999] animate-vibeSlideDown">
            <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-center gap-3 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Eye size={18} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Live: Someone is seeing your profile right now!
              </span>
            </div>
          </div>
        )}

        <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-[28px] p-1.5 flex justify-between w-[calc(100%-32px)] max-w-[420px] z-50 transition-all duration-700 ease-in-out backdrop-blur-md translate-y-0 opacity-100 pointer-events-auto
          ${isVibeDark ? 'bg-[#13131a]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'glass border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}`}>
          {[
            { id: 'analytics', icon: Signal, label: 'Pulse' },
            { id: 'profile', icon: User, label: 'Identity' },
            { id: 'pass', icon: ShieldCheck, label: 'Pass' },
            { id: 'order-status', icon: Clock, label: 'Status' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center justify-center flex-1 h-14 rounded-[20px] transition-all duration-300 relative group
                ${activeTab === tab.id 
                  ? (isVibeDark ? 'bg-orange-500/20 text-orange-400 shadow-[0_4px_12px_rgba(234,88,12,0.1)] -translate-y-1' : 'bg-orange-50 text-orange-600 shadow-[0_4px_12px_rgba(224,123,26,0.08)] -translate-y-1') 
                  : (isVibeDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-400')}`}
            >
              <tab.icon size={22} className={`transition-all duration-300 ${activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(224,123,26,0.3)] scale-110' : 'group-hover:scale-110'}`}/>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-1 transition-all duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full animate-ping" />}
            </button>
          ))}
        </nav>
      </div>
    )
  }
