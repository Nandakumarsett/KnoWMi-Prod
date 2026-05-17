import { useState, useEffect, useMemo, useRef } from 'react'
import Avatar from '../components/Avatar'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  ArrowLeft, ChevronDown, Wand2, Info
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
  .glass-morphism { 
    background: rgba(255, 255, 255, 0.4); 
    backdrop-filter: blur(12px); 
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  }

  .card { background: white; border: 1px solid #E7E5E4; border-radius: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .card:hover { border-color: #D6D3D1; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); transform: translateY(-2px); }

  .three-d-container { perspective: 1200px; }
  .three-d-card {
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
  }
  .three-d-card:hover {
    transform: rotateX(4deg) rotateY(-4deg) translateY(-8px);
    box-shadow: 20px 20px 60px rgba(0,0,0,0.05), -20px -20px 60px rgba(255,255,255,0.8);
  }

  .floating { animation: floating 3s ease-in-out infinite; }
  @keyframes floating {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .mesh-bg {
    background-color: #FDF6EC;
    background-image: 
      radial-gradient(at 0% 0%, hsla(25,100%,90%,1) 0, transparent 50%), 
      radial-gradient(at 50% 0%, hsla(35,100%,90%,1) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(45,100%,90%,1) 0, transparent 50%);
    background-attachment: fixed;
  }

  .glow-text {
    text-shadow: 0 0 20px rgba(193, 68, 14, 0.2);
  }

  .persona-card { 
    cursor: pointer; 
    border-radius: 32px; 
    padding: 24px; 
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .persona-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  .persona-card:hover::before { transform: translateX(100%); }
  .persona-card.active { 
    border-color: white; 
    outline: 4px solid var(--sf); 
    transform: scale(1.05) translateY(-5px); 
    box-shadow: 0 40px 80px -15px rgba(193, 68, 14, 0.2); 
    z-index: 10;
  }

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

  @media print {
    @page { margin: 0; size: auto; }
    body { background: white !important; margin: 0 !important; padding: 0 !important; }
    header, nav, footer, .no-print { display: none !important; }
    
    body * { visibility: hidden; }
    .qr-print-card, .qr-print-card * { visibility: visible; }
    .qr-print-card {
      position: fixed !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 450px !important;
      border: 1px solid #E7E5E4 !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 60px !important;
      border-radius: 32px !important;
      background: white !important;
    }
    .qr-print-card img { max-width: 100% !important; }
  }
`

const PERSONAS = {
  dev: {
    id: 'dev', label: 'Tech', emoji: '💻', icon: Code2, bg: 'linear-gradient(180deg, #0A1628 0%, #0F1E38 100%)',
    accent: '#3B9EFF', accentLight: 'rgba(59, 158, 255, 0.15)', cardBg: 'rgba(59, 158, 255, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#6B9CD1', tagBg: 'rgba(59, 158, 255, 0.12)',
    buttonBg: 'linear-gradient(135deg, #3B9EFF, #5FB4FF)',
    fields: ['github', 'linkedin', 'blog', 'twitter', 'instagram'], stats: ['Built Projects', 'GitHub Stars']
  },
  influencer: {
    id: 'influencer', label: 'Content Creator', emoji: '🎬', icon: Rocket, bg: 'linear-gradient(180deg, #2A1810 0%, #3A2418 100%)',
    accent: '#F59E0B', accentLight: 'rgba(245, 158, 11, 0.15)', cardBg: 'rgba(245, 158, 11, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#D4A574', tagBg: 'rgba(245, 158, 11, 0.12)',
    buttonBg: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    fields: ['instagram', 'tiktok', 'youtube', 'email'], stats: ['Followers', 'Collabs']
  },
  student: {
    id: 'student', label: 'Student', emoji: '🎓', icon: GraduationCap, bg: 'linear-gradient(180deg, #0F1225 0%, #1A1E3A 100%)',
    accent: '#818CF8', accentLight: 'rgba(129, 140, 248, 0.15)', cardBg: 'rgba(129, 140, 248, 0.1)',
    textPrimary: '#FFFFFF', textSecondary: '#A5B4FC', tagBg: 'rgba(129, 140, 248, 0.12)',
    buttonBg: 'linear-gradient(135deg, #818CF8, #A78BFA)',
    fields: ['linkedin', 'github', 'resume', 'notion', 'instagram'], stats: ['CGPA', 'University']
  },

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
  const navigate = useNavigate()
  // Initialize identities from persona_data or create the first one from profile
  const [identities, setIdentities] = useState([])

  useEffect(() => {
    const stored = profile?.persona_data?.identities || []
    if (stored.length === 0 && profile?.persona_type) {
      setIdentities([{
        id: 'primary',
        persona_type: profile.persona_type,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        data: profile.persona_data || {},
        active: true
      }])
    } else {
      setIdentities(stored)
    }
  }, [profile])

  const [activeIdentityId, setActiveIdentityId] = useState('primary')

  useEffect(() => {
    const active = identities.find(i => i.active)
    if (active) {
      setActiveIdentityId(active.id)
    }
  }, [identities])

  const [searchParams, setSearchParams] = useSearchParams()
  
  // State for the identity currently being edited
  const [editingId, setEditingId] = useState(() => searchParams.get('edit')) 
  const [persona, setPersona] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [data, setData] = useState({})

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  const [isEditing, setIsEditing] = useState(() => searchParams.get('mode') === 'edit')
  const [showDetailedPersona, setShowDetailedPersona] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extractedColor, setExtractedColor] = useState(null)
  const colorCache = useRef({})
  const [errors, setErrors] = useState({})
  const [statErrors, setStatErrors] = useState({})

  // Sync state to search params
  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search) // Read from window to be safe
    if (isEditing && editingId) {
      newParams.set('mode', 'edit')
      newParams.set('edit', editingId)
      newParams.set('tab', 'profile') // Force tab to profile while editing
    } else {
      newParams.delete('mode')
      newParams.delete('edit')
    }
    setSearchParams(newParams, { replace: true })
  }, [isEditing, editingId])

  // Load identity into editor
  const startEditing = (id) => {
    const identity = identities.find(i => i.id === id)
    if (identity) {
      setEditingId(id)
      setPersona(identity.persona_type)
      setAvatarUrl(identity.avatar_url || '')
      setData(identity.data || {})
      setFirstName(identity.first_name)

      setLastName(identity.last_name)
      setBio(identity.bio)
      setIsEditing(true)
    }
  }

  // Effect to load data if initial search params exist
  useEffect(() => {
    if (searchParams.get('edit')) {
      const id = searchParams.get('edit')
      const identity = identities.find(i => i.id === id)
      if (identity) {
        setEditingId(id)
        setPersona(identity.persona_type)
        setAvatarUrl(identity.avatar_url || '')
        setData(identity.data || {})
        setFirstName(identity.first_name)

        setLastName(identity.last_name)
        setBio(identity.bio)
        setIsEditing(true)
      }
    }
  }, [identities]) 
  
  // Sync state FROM search params (e.g. when clicking global back button)
  useEffect(() => {
    const isEditMode = searchParams.get('mode') === 'edit' || searchParams.get('mode') === 'new' || !!searchParams.get('edit')
    if (!isEditMode && isEditing) {
      setIsEditing(false)
    } else if (isEditMode && !isEditing) {
      setIsEditing(true)
    }
  }, [searchParams, isEditing])

  const addNewIdentity = () => {
    if (identities.length >= 3) return
    const newId = `id-${Math.random().toString(36).substring(2, 9)}`
    setEditingId(newId)
    setPersona(null) // Force Choose Your Path
    setAvatarUrl('')

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
      avatar_url: active.avatar_url,
      persona_data: { ...(profile.persona_data || {}), identities: updated },
      first_name: active.first_name,
      last_name: active.last_name,
      bio: active.bio
    }).eq('user_id', profile.user_id || profile.id)

    // Sync to public_profiles for immediate reflection on public page
    await supabase.from('public_profiles').update({
      persona_type: active.persona_type,
      avatar_url: active.avatar_url,
      first_name: active.first_name,
      last_name: active.last_name,
      bio: active.bio
    }).eq('user_id', profile.user_id || profile.id)

    onUpdate()
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    const identity = identities.find(i => i.id === id)
    if (identity?.active) {
      alert("You cannot delete your active identity. Please activate another one first.")
      return
    }

    if (!window.confirm("Are you sure you want to delete this identity? This action cannot be undone.")) return

    const updatedIdentities = identities.filter(i => i.id !== id)
    setIdentities(updatedIdentities)

    try {
      console.log('🚀 NUCLEAR DELETE START')
      console.log('🆔 Target Identity ID:', id)
      console.log('👤 Current User ID:', profile?.user_id)
      console.log('📋 Current Identities Count:', identities.length)

      const updatedIdentities = identities.filter(i => i.id !== id)
      console.log('📋 New Identities Count:', updatedIdentities.length)

      const { data, error } = await supabase.from('profiles').update({
        persona_data: { ...(profile.persona_data || {}), identities: updatedIdentities }
      })
      .eq('user_id', profile.user_id || user?.id)
      .select()

      if (error) {
        console.error('❌ DATABASE ERROR:', error)
        throw error
      }
      
      console.log('✅ DATABASE UPDATE SUCCESS:', data)
      setIdentities(updatedIdentities)
      if (onUpdate) await onUpdate()
      
      alert("Identity deleted successfully.")
      window.location.reload()
    } catch (err) {
      console.error('❌ DELETION FATAL ERROR:', err)
      alert("CRITICAL ERROR: Failed to delete. " + (err.message || "Please check console (F12)"))
    }
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

  const baseTheme = PERSONAS[persona] || PERSONAS[persona === 'developer' ? 'dev' : persona] || PERSONAS.dev || { bg: '', fields: [], stats: [] }
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

  const calculateStrength = () => {
    let score = 0;
    if (profile?.avatar_url) score += 15;
    if (firstName && lastName) score += 10;
    if (bio) score += 10;
    if (data.tagline) score += 5;
    
    // Check if any socials are linked
    const hasSocials = theme?.fields?.some(f => !!data[f]);
    if (hasSocials) score += 20;
    
    // Detailed attributes
    if (data.featured_content?.length) score += 10;
    if (data.achievements?.length) score += 10;
    if (data.projects?.length || data.main_games?.length || data.goals?.length || data.skills?.length) score += 20;
    
    return Math.min(score, 100);
  };

  const handleAvatarUpload = async (file) => {
    if (!file || file.size > 2 * 1024 * 1024) return
    try {
      setUploading(true)
      const filePath = `${profile.id}-${Math.random()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(filePath, file)
      const maskedUrl = `/content/avatars/${filePath}`
      setAvatarUrl(maskedUrl)
      // We don't update profiles table here, handleSave will do it if active
    } finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!profile?.id) {
      alert("Error: Profile not loaded. Please refresh the page.")
      return
    }

    // Validation...
    const fieldErrors = {};
    const sErrors = {};
    theme.fields.forEach(f => {
      // Basic check: if it's purely digits and it's a social handle field, it might be a mistake
      if (data[f] && /^\d+$/.test(data[f]) && !['email', 'whatsapp'].includes(f)) {
        fieldErrors[f] = true;
      }
    });
    theme.stats.forEach(s => {
      const isTextStat = ['Gym Name', 'University', 'League Rank', 'Club', 'Team'].some(kw => s.includes(kw));
      if (!isTextStat && data[s] && !/^\d+$/.test(String(data[s]).replace(/[KM]/gi, '').replace(/[,. ]/g, ''))) {
        sErrors[s] = true;
      }
    });

    if (Object.keys(fieldErrors).length > 0 || Object.keys(sErrors).length > 0) {
      setErrors(fieldErrors);
      setStatErrors(sErrors);
      alert("Please fix the errors highlighted in red before saving. (Check that social handles are correct and stats are numbers)");
      return;
    }

    setSaving(true)
    try {
      // Update or Add to identities array
      let updatedIdentities = [...identities]
      const existingIndex = updatedIdentities.findIndex(i => i.id === editingId)
      
      const identityData = {
        id: editingId || `id_${Date.now()}`,
        persona_type: persona || 'influencer',
        display_label: PERSONAS[persona]?.label || persona,

        avatar_url: avatarUrl,
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
        persona_type: isMainSync ? (persona || 'influencer') : profile.persona_type, 
        avatar_url: isMainSync ? avatarUrl : profile.avatar_url,
        persona_data: { 
          ...(profile.persona_data || {}), 
          identities: updatedIdentities
        },

        first_name: isMainSync ? firstName : profile.first_name,
        last_name: isMainSync ? lastName : profile.last_name,
        bio: isMainSync ? bio : profile.bio,
        ...dbData
      }).eq('id', profile.id)

      if (error) throw error

      // 2. Sync to public_profiles table
      if (isMainSync) {
        await supabase.from('public_profiles').update({
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          avatar_url: avatarUrl,
          persona_type: persona || 'influencer',
          ...dbData
        }).eq('id', profile.id)
      }

      setIdentities(updatedIdentities)
      setShowToast(true)
      
      if (onUpdate) await onUpdate()
      
      // Delay slightly so the user sees the "Saving" state finish before the transition
      setTimeout(() => {
        setIsEditing(false)
        setShowToast(false)
      }, 1000)
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
              onClick={() => navigate(`/studio?persona=${idnt.persona_type}&edit=${idnt.id}`)}
              className="card p-6 bg-white flex items-center gap-6 shadow-xl relative overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all active:scale-[0.98]"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${idnt.active ? 'bg-orange-500' : 'bg-neutral-200'}`} />
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                <Avatar src={idnt.avatar_url} name={`${idnt.first_name} ${idnt.last_name}`} username={profile?.username} size="w-full h-full text-2xl" />
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
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {(PERSONAS[idnt.persona_type]?.label || 
                    (idnt.persona_type === 'influencer' ? 'Content Creator' : 
                     idnt.persona_type === 'developer' ? 'Tech' : 
                     idnt.persona_type === 'dev' ? 'Tech' : 
                     idnt.persona_type.charAt(0).toUpperCase() + idnt.persona_type.slice(1))
                  )} Persona
                </p>

              </div>
              <div className="flex items-center gap-2">
                {!idnt.active && (
                  <button 
                    onClick={(e) => {
                      console.log('🗑️ TRASH ICON CLICKED');
                      e.stopPropagation();
                      e.preventDefault();
                      handleDelete(idnt.id, e);
                    }}
                    className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 hover:text-ruby-500 hover:bg-ruby-50 transition-all active:scale-90 relative z-20"
                    title="Delete Identity"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Identity Button (Creator Plan Only) */}
        {isCreator ? (
          identities.length < 3 ? (
            <button onClick={() => navigate('/studio?mode=new')} className="w-full h-24 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/30 transition-all group">
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
    <div className="relative min-h-screen mesh-bg pb-20">
      <div className="max-w-[850px] mx-auto">
        <div className="space-y-12 animate-slideUp">
          {/* Header Section - STICKY */}
          <div className="sticky top-0 z-40 glass-morphism p-6 sm:p-8 rounded-b-[40px] border-b border-white/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200 text-neutral-400 rounded-xl hover:text-neutral-900 hover:border-neutral-900 transition-all active:scale-90"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-display font-black text-[#1A1A1A]">Build your Identity</h1>
                    <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em]">{persona ? `${persona} active` : 'Configuring...'}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-8 py-3 bg-[#C1440E] text-white rounded-xl font-black uppercase tracking-wider text-[10px] shadow-lg shadow-orange-500/20 hover:bg-[#A0350B] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16}/> Save Profile</>}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Profile Power</span>
                  <span className="text-orange-600 font-bold">{calculateStrength()}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
                    style={{ width: `${calculateStrength()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Choose Path (If no persona) */}
          {!persona && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg floating">01</div>
                <div>
                  <h2 className="text-2xl font-display font-black text-[#1A1A1A] glow-text">Choose Your Path</h2>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select your core identity theme</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 three-d-container">
                {Object.values(PERSONAS).filter(p => !identities.some(i => i.persona_type === p.id)).map(p => {
                  const exists = false; // Always false now since we filtered them out
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        if (exists) {
                          const idnt = identities.find(i => i.persona_type === p.id);
                          navigate(`/studio?persona=${p.id}&edit=${idnt.id}`);
                        } else {
                          navigate(`/studio?persona=${p.id}&mode=new`);
                        }
                      }} 
                      className={`persona-card group h-56 flex flex-col items-center justify-center text-center three-d-card overflow-hidden relative cursor-pointer ${persona === p.id ? 'active ring-4 ring-orange-500 shadow-2xl scale-105' : 'bg-white/40 backdrop-blur-xl border-white/60 hover:bg-white/80'} ${exists ? 'opacity-80' : ''}`} 
                      style={{ 
                        background: persona === p.id ? p.bg : undefined,
                        borderColor: persona === p.id ? 'white' : undefined
                      }}
                    >
                      {exists && (
                        <div className="absolute top-4 left-0 right-0 z-20">
                          <span className="bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-lg">Persona Exists</span>
                        </div>
                      )}
                     {/* Background Glow for unselected */}
                     {persona !== p.id && (
                       <div 
                         className="absolute -bottom-10 -right-10 w-32 h-32 blur-3xl opacity-20 pointer-events-none transition-all group-hover:scale-150 group-hover:opacity-40"
                         style={{ background: p.accent }}
                       />
                     )}

                     <div 
                       className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10" 
                       style={{ background: persona === p.id ? 'rgba(255,255,255,0.1)' : p.accentLight }}
                     >
                       {p.emoji}
                       {persona === p.id && (
                         <div className="absolute -top-2 -right-2 bg-white text-orange-600 rounded-full p-1 shadow-lg border border-orange-100">
                           <Check size={14} />
                         </div>
                       )}
                     </div>

                     <div className="relative z-10">
                       <h3 className={`text-lg font-display font-black mb-1 uppercase tracking-wider transition-colors ${persona === p.id ? 'text-white' : 'text-[#1A1A1A]'}`}>
                         {p.label}
                       </h3>
                       <p 
                         className={`text-[9px] uppercase font-black tracking-[0.3em] transition-opacity ${persona === p.id ? 'text-white/60' : ''}`}
                         style={{ color: persona === p.id ? undefined : p.accent }}
                       >
                         {persona === p.id ? 'Active Theme' : 'Choose Protocol'}
                       </p>
                     </div>

                     {/* Premium Hover Effect */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  );
                })}
            </div>
            </section>
          )}

          {persona && (
            <>
              {/* Section 2: Basic Info */}
              <section className="space-y-6 three-d-container">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg floating">01</div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-[#1A1A1A] glow-text">Your Identity</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tell us who you are</p>
                  </div>
                </div>
                <div className="space-y-8 bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-[48px] border-2 border-white shadow-2xl three-d-card">
                  <div className="flex items-center gap-8 pb-8 border-b border-neutral-100">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-[40px] bg-neutral-100 border-4 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <Avatar src={avatarUrl} name={`${firstName} ${lastName}`} username={profile?.username} size="w-full h-full text-4xl" />
                      </div>
                      <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border border-[#E5D5C4] rounded-2xl shadow-xl flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:scale-110 transition-all cursor-pointer">
                        <Camera size={20} />
                        <input type="file" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-base font-black uppercase text-neutral-900 mb-1">Profile Picture</h4>
                      <p className="text-[11px] text-neutral-400 font-bold mb-4 uppercase tracking-widest">JPG or PNG • Max 2MB</p>
                      <div className="flex gap-3">
                        <label className="px-5 py-2.5 bg-neutral-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-black transition-colors cursor-pointer">
                          Upload New
                          <input type="file" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files[0])} />
                        </label>
                        <button className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-600 text-[10px] font-black uppercase rounded-xl hover:bg-neutral-50 transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[#5C5246] ml-1">First Name</label>
                      <input className="w-full bg-[#FDF6EC]/30 border border-[#E5D5C4] rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#C1440E] transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[#5C5246] ml-1">Last Name</label>
                      <input className="w-full bg-[#FDF6EC]/30 border border-[#E5D5C4] rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#C1440E] transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#5C5246] ml-1">Creative Bio</label>
                    <textarea className="w-full bg-[#FDF6EC]/30 border border-[#E5D5C4] rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#C1440E] transition-all min-h-[140px] resize-none" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world who you are..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#5C5246] ml-1">Public Tagline</label>
                    <input className="w-full bg-[#FDF6EC]/30 border border-[#E5D5C4] rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#C1440E] transition-all" value={data.tagline || ''} onChange={e => setData({...data, tagline: e.target.value})} placeholder="e.g. Building the future..." />
                  </div>
                </div>
              </section>

              {/* Section 3: Audience Reach */}
              <section className="space-y-6 three-d-container">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg floating" style={{ animationDelay: '0.5s' }}>02</div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-[#1A1A1A] glow-text">Audience Reach</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Show your impact</p>
                  </div>
                </div>
                <div className="space-y-8 bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-[48px] border-2 border-white shadow-2xl three-d-card">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {theme.stats.map(s => (
                        <div key={s} className={`p-8 rounded-3xl border transition-all ${statErrors[s] ? 'bg-red-50 border-red-200' : 'bg-[#FDF6EC]/30 border-[#E5D5C4]'}`}>
                          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-3">{s}</p>
                          <input 
                            className={`w-full text-3xl font-display font-black outline-none bg-transparent ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-900'}`} 
                            placeholder={['Gym Name', 'University', 'League Rank', 'Club', 'Team'].some(kw => s.includes(kw)) ? `Enter Your ${s}` : "0"} 
                            value={data[s] || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              const isTextStat = ['Gym Name', 'University', 'League Rank', 'Club', 'Team'].some(kw => s.includes(kw));
                              if (!isTextStat && val && !/^\d*$/.test(val.replace(/[KM]/gi, '').replace(/[,. ]/g, ''))) {
                                setStatErrors({...statErrors, [s]: true})
                              } else {
                                setStatErrors({...statErrors, [s]: false})
                                setData({...data, [s]: val})
                              }
                            }} 
                          />
                          <p className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-400'}`}>
                            {statErrors[s] ? '⚠️ Numbers Only' : ['Gym Name', 'University', 'League Rank'].some(kw => s.includes(kw)) ? 'Text format supported' : 'Enter raw number'}
                          </p>
                        </div>
                      ))}
                   </div>
                   <div className="pt-8 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">Linked Platforms</p>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
                          <ShieldCheck size={14} className="text-blue-500" />
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Secure Sync</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {theme.fields.map(f => {
                          const isLocked = profile?.status !== 'paid' && profile?.role !== 'owner' && ['instagram', 'youtube'].includes(f)
                          const hasError = errors[f]
                          return (
                            <div key={f} className={`flex items-center gap-5 p-5 rounded-[24px] border transition-all ${isLocked ? 'opacity-60 bg-neutral-50 border-neutral-200' : 'bg-white border-[#E5D5C4] shadow-sm hover:border-[#C1440E] hover:shadow-lg hover:shadow-orange-500/5'} ${hasError ? 'border-ruby-500 bg-red-50' : ''}`}>
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${hasError ? 'bg-ruby-100 text-ruby-500' : 'bg-neutral-50'}`}>{FIELD_META[f]?.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[9px] font-black uppercase tracking-wider truncate mb-1.5 ${hasError ? 'text-ruby-500' : 'text-neutral-400'}`}>{f}</p>
                                {isLocked ? (
                                  <div className="flex items-center gap-1 text-neutral-400 group-hover:text-orange-500 transition-colors">
                                    <Lock size={12} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Premium Only</span>
                                  </div>
                                ) : (
                                  <input
                                    className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-neutral-800 placeholder:text-neutral-300"
                                    placeholder={FIELD_META[f]?.prefix || 'Your username...'}
                                    value={data[f] || ''}
                                    onChange={e => setData({...data, [f]: e.target.value})}
                                  />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                   </div>
                </div>
              </section>

              {/* Section 4: Detailed Persona Attributes */}
              <section className="space-y-6 three-d-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg floating" style={{ animationDelay: '1s' }}>03</div>
                    <div>
                      <h2 className="text-2xl font-display font-black text-[#1A1A1A] glow-text">Detailed Attributes</h2>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Customize your persona specific data</p>
                    </div>
                  </div>
                  {!showDetailedPersona && (
                    <button 
                      onClick={() => setShowDetailedPersona(true)}
                      className="px-6 py-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
                    >
                      Configure Details <Plus size={14} />
                    </button>
                  )}
                </div>

                {showDetailedPersona && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => setShowDetailedPersona(false)}
                        className="px-4 py-2 bg-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <ChevronDown size={14} className="rotate-180" /> Collapse Attributes
                      </button>
                    </div>
                    <div className="p-8 sm:p-12 bg-white border border-[#E5D5C4] rounded-[48px] shadow-2xl shadow-[#E5D5C4]/30 animate-slideUp overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16" />
                      <div className="relative z-10">
                        {['developer', 'dev'].includes(persona) && <DeveloperForm data={data} onChange={setData} isOwner />}
                        {persona === 'student' && <StudentForm data={data} onChange={setData} />}
                        {persona === 'creator' && <CreatorForm data={data} onChange={setData} />}
                        {persona === 'gamer' && <GamerForm data={data} onChange={setData} />}
                        {['fitness', 'gym', 'athlete'].includes(persona) && <FitnessForm data={data} onChange={setData} />}
                        {persona === 'influencer' && <CreatorForm data={data} onChange={setData} />}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Bottom Action Bar for better UX */}
              <div className="pt-10 flex items-center justify-center gap-6">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="group flex items-center gap-2 px-10 py-4 bg-white border-2 border-neutral-100 text-neutral-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-900 transition-all"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-14 py-4 bg-[#C1440E] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 hover:bg-[#A0350B] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Changes</>}
                </button>
              </div>
            </>
          )}


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

  if (!isPaid) {
    return (
      <div className="animate-slideUp space-y-8 pb-20">
        <div className="flex items-end justify-between">
          <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">My Official Identity</p><h2 className="text-5xl font-display font-black tracking-tight">Identity <span className="gradient-text">Pass</span></h2></div>
        </div>

        <div className="card p-12 text-center bg-white shadow-xl border-none max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-orange-50 border border-orange-200 rounded-3xl flex items-center justify-center shadow-lg">
              <Lock size={36} className="text-orange-500 animate-bounce" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-3 text-neutral-900">
            Buy a Tee to Unlock Pass
          </h3>
          <p className="text-sm font-semibold max-w-sm text-neutral-500 mb-8 leading-relaxed">
            Get your physical NFC Smart Tee to activate your official KnoWMi Identity Pass and unlock physical scanning capabilities.
          </p>
          <button
            onClick={() => window.location.href = '/#pricing'}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Buy a Tee to Unlock 🚀
          </button>
        </div>
      </div>
    )
  }

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
            className="qr-print-card card p-12 flex flex-col items-center bg-white shadow-2xl relative overflow-hidden cursor-pointer hover:shadow-orange-500/10 transition-all border-none"
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
              <img 
                src={qrUrl} 
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-full object-contain select-none ${!isPaid ? 'opacity-20 blur-sm grayscale' : ''}`} 
                alt="Identity QR" 
              />
              <div className="absolute inset-0 z-10" />
              
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
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile, user, loading: authLoading, refreshProfile, isVerified, role } = useAuth()
  const isFree = profile?.status === 'free' || (!profile?.status && !profile?.tier) || profile?.tier === 'Free';
  const isPaid = !isFree || role === 'owner';
  const [scans, setScans] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    if (tab) return tab
    if (searchParams.get('mode') === 'edit') return 'profile'
    return 'analytics'
  })
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    } else if (searchParams.get('mode') === 'edit') {
      setActiveTab('profile')
    }
  }, [searchParams])
  
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

  // Bypassed absolute verification gate so new unverified users can view their analytics instantly.

  const isVibeDark = activeTab === 'analytics' && vibeTheme === 'dark';

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 relative overflow-hidden ${isVibeDark ? 'bg-[#000000] text-[#f0eff8] vibe-page dark' : 'bg-[#FAFAF9] text-[#111111]'}`}>
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-60" style={{
        backgroundImage: isVibeDark 
          ? 'radial-gradient(circle at 15% 50%, rgba(249, 115, 22, 0.08), transparent 35%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 35%)'
          : 'radial-gradient(circle at 15% 50%, rgba(249, 115, 22, 0.05), transparent 35%), radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.05), transparent 35%)'
      }} />
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {isVibeDark && (
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #000000 !important; }
          .dark .vibe-card { background-color: #0a0a0a !important; color: #fff !important; border-color: rgba(255,255,255,0.08) !important; }
          .dark .bg-white { background-color: #0a0a0a !important; color: #fff !important; border-color: rgba(255,255,255,0.08) !important; }
          .dark .border-neutral-100,
          .dark .border-neutral-50,
          .dark .border-neutral-200 { border-color: rgba(255,255,255,0.08) !important; }
          .dark .text-neutral-900,
          .dark .text-neutral-800,
          .dark .text-neutral-700 { color: #f0eff8 !important; }
          .dark .text-neutral-600,
          .dark .text-neutral-500 { color: #aaa5c3 !important; }
          .dark .text-neutral-400 { color: #9c97b8 !important; }
          .dark .text-neutral-300 { color: #8a85a4 !important; }
          .dark .bg-neutral-50,
          .dark .bg-neutral-50\\/30,
          .dark .bg-neutral-50\\/20,
          .dark .bg-neutral-50\\/10,
          .dark .bg-neutral-100 { background-color: #111111 !important; }
          .dark .recharts-default-legend .recharts-legend-item-text { color: #f0eff8 !important; }
          .dark p[style*="color: var(--muted)"] { color: #9c97b8 !important; }
          .dark p[style*="color: var(--text)"] { color: #f0eff8 !important; }
          .dark input, .dark textarea, .dark select { background-color: #111111 !important; color: #fff !important; border-color: rgba(255,255,255,0.1) !important; }
        ` }} />
      )}
      
      {/* Personalized Navigation */}
      <header className={`h-20 backdrop-blur-md border-b flex items-center px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300 ${isVibeDark ? 'bg-[#13131a]/80 border-white/10' : 'bg-white/80 border-neutral-100'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                const isEditingMode = searchParams.get('mode') === 'edit'
                if (isEditingMode) {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('mode')
                  newParams.delete('edit')
                  setSearchParams(newParams)
                } else if (activeTab !== 'analytics') {
                  setActiveTab('analytics')
                  navigate('/dashboard')
                } else {
                  navigate('/')
                }
              }}
              className={`p-2 rounded-xl transition-colors flex items-center gap-2 group ${isVibeDark ? 'text-neutral-400 hover:bg-white/5' : 'text-neutral-400 hover:bg-neutral-100'}`}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
                {searchParams.get('mode') === 'edit' ? 'Back to Identities' : activeTab === 'analytics' ? 'Home' : 'Back to Analytics'}
              </span>
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
            {(() => {
              const pData = profile?.persona_data || {};
              const activeIdentity = (pData.identities && Array.isArray(pData.identities)) 
                ? (pData.identities.find(i => i.active) || pData.identities[0])
                : null;
              
              const displayName = activeIdentity?.first_name || profile?.first_name || 'User';
              const wmCode = (activeIdentity?.wm_code || profile?.wm_code || 'WM-NEW-000').replace('PT-', 'WM-');
              const avatarSrc = activeIdentity?.avatar_url || profile?.avatar_url;

              return (
                <div 
                  onClick={() => navigate(`/p/${profile?.secure_slug || profile?.id}?from=${activeTab}`)}
                  className={`flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl border transition-all cursor-pointer group ${isVibeDark ? 'bg-white/5 border-white/10 hover:border-orange-500/50' : 'bg-neutral-50 border-neutral-100 hover:border-orange-200'}`}
                >
                  <div className="text-right hidden sm:block">
                    <p className={`text-xs font-black leading-none transition-colors duration-300 ${isVibeDark ? 'text-white' : 'text-neutral-900'}`}>{displayName}</p>
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-luxury mt-2">{wmCode}</p>
                    {profile?.is_verified && (
                      <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1">✦ Founding Member</p>
                    )}
                  </div>
                  <Avatar 
                    src={avatarSrc} 
                    name={displayName} 
                    username={profile?.username} 
                    size="w-9 h-9 border-2 border-white shadow-sm group-hover:border-orange-500/20 transition-all" 
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-48">
        <div className={`tab-transition ${activeTab === 'analytics' ? 'tab-visible' : 'tab-hidden'}`}>
          {activeTab === 'analytics' && (
            <div className="relative">
              {/* If not paid, display the beautiful premium lock overlay in the middle */}
              {!isPaid && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-neutral-900/40 backdrop-blur-md rounded-[32px] text-center border-2 border-dashed border-orange-500/20 select-none min-h-[500px]">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-orange-500/30 rounded-3xl blur-2xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-white dark:bg-neutral-950 border-2 border-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Lock size={44} className="text-orange-500 animate-bounce" />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-black mb-3 text-white">
                    Unlock Analytics on a Paid Plan
                  </h3>
                  <p className="text-sm font-semibold max-w-sm text-neutral-300 mb-8 leading-relaxed">
                    View advanced vibe statistics, traffic intelligence, repeat scores, global reach, and live scan tracking.
                  </p>
                  <button
                    onClick={() => navigate('/#pricing')}
                    className="px-10 py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-orange-500/30"
                  >
                    Buy a Tee to Unlock 🚀
                  </button>
                </div>
              )}

              <div className={`animate-slideUp ${!isPaid ? 'filter blur-xl select-none pointer-events-none opacity-40' : ''}`}>

              {/* Sub-tab toggle */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-1 p-1.5 rounded-2xl border transition-colors duration-300" style={{
                  background: isVibeDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                  borderColor: isVibeDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                  boxShadow: isVibeDark ? 'inset 0 2px 10px rgba(0,0,0,0.2)' : 'inset 0 2px 10px rgba(0,0,0,0.02)'
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
                    padding: '10px 24px', borderRadius: 24, fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                    border: 'none', cursor: 'pointer', transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isVibeDark ? '#ffffff' : '#111111', 
                    color: isVibeDark ? '#111111' : '#ffffff',
                    boxShadow: isVibeDark ? '0 8px 24px rgba(255,255,255,0.15)' : '0 8px 24px rgba(0,0,0,0.2)'
                  }}
                  className={`hover:scale-105 active:scale-95 flex items-center gap-2`}
                >
                  {isVibeDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
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
            <div className="md:col-span-4 vibe-card overflow-hidden flex flex-col animate-slideUp">
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/20">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-1">Traffic Intelligence</h3>
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
                 <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-500 transition-all">Deep Data Analysis ›</button>
              </div>
            </div>

            {/* Latest Activity - Vertical Bento Piece */}
            <div className="md:col-span-2 vibe-card overflow-hidden flex flex-col animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
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
                        <div className="shrink-0 group-hover:scale-110 transition-transform">
                           {ev.visitor ? (
                             <Avatar 
                               src={ev.visitor.avatar_url} 
                               name={ev.visitor.first_name} 
                               size="w-10 h-10" 
                               className="rounded-2xl" 
                             />
                           ) : (
                             <div className="w-10 h-10 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                               <Activity size={16} className="text-blue-500" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1">
                           <p className="text-[11px] font-black text-neutral-900 leading-tight">
                             {ev.visitor ? (
                               <span className="text-orange-500">{ev.visitor.first_name}</span>
                             ) : (
                               ev.is_repeat ? 'Repeat Visit' : (ev.referrer === 'qr' ? 'QR Code Scan' : 'Direct Link')
                             )}
                           </p>
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight mt-1">
                             {ev.visitor ? (ev.is_repeat ? 'Returned to see you' : 'Just discovered you') : `${ev.device_type} • ${ev.city || 'Unknown'}`}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-neutral-50 bg-neutral-50/10 text-center">
                 <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-500 transition-all">Live Logs ›</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Location Insights - 3 columns */}
            <div className="md:col-span-3 vibe-card overflow-hidden flex flex-col animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                  Global Reach
                  <MapPin size={16} className="text-orange-500" />
                </h3>
              </div>
              <div className="p-8 space-y-6">
                {vibeStats.topCities.length > 0 ? (
                  vibeStats.topCities.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg shadow-inner group-hover:bg-orange-50 group-hover:border-orange-200 transition-all">{loc.flag}</div>
                         <div>
                           <p className="text-xs font-black text-neutral-900">{loc.city}</p>
                           <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{loc.country}</p>
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
            <div className="md:col-span-2 vibe-card overflow-hidden flex flex-col animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">Referral Sources</h3>
              </div>
              <div className="p-8 space-y-6">
                {Object.entries(vibeStats.topReferrers).length > 0 ? (
                  Object.entries(vibeStats.topReferrers).map(([ref, count], i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                           <Share2 size={16} className="text-neutral-500" />
                         </div>
                         <span className="text-[13px] font-black text-neutral-800 capitalize">{ref}</span>
                       </div>
                       <span className="text-[13px] font-black text-neutral-900">{count}</span>
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
            <div className="vibe-card overflow-visible flex flex-col">
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
              onClick={() => {
                setActiveTab(tab.id);
                const newParams = new URLSearchParams(window.location.search);
                newParams.set('tab', tab.id);
                setSearchParams(newParams, { replace: true });
              }} 
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
