import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'
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
  ArrowLeft, ChevronDown, Wand2, Info, Printer
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { formatDistanceToNow } from 'date-fns'
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
import { usePushNotifications } from '../hooks/usePushNotifications'

// Import Persona forms
import { DeveloperForm } from '../components/identity/forms/DeveloperForm'
import { StudentForm } from '../components/identity/forms/StudentForm'
import { CreatorForm } from '../components/identity/forms/CreatorForm'
import { GamerForm } from '../components/identity/forms/GamerForm'
import BusinessNeedsTab from '../components/business/BusinessNeedsTab'


// ─── Dashboard Support Components ──────────────────────────

function ReturnRequestForm({ user, latestOrder, supabaseClient }) {
  const [form, setForm] = useState({ issue_type: 'defect', description: '', video_url: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) { setErr('Please describe the issue.'); return }
    if (!latestOrder) { setErr('No order found on your account.'); return }
    setSubmitting(true); setErr('')
    const { error } = await supabaseClient.from('return_requests').insert({
      user_id: user?.id,
      order_id: latestOrder.id,
      order_number: latestOrder.order_number || latestOrder.id,
      issue_type: form.issue_type,
      description: form.description,
      video_url: form.video_url || null,
    })
    if (error) { setErr(error.message); setSubmitting(false); return }
    // Send confirmation email
    await supabaseClient.functions.invoke('send-email', {
      body: {
        type: 'return_request',
        to: user?.email,
        toName: '',
        data: {
          firstName: '',
          requestId: 'REQ-' + Date.now().toString().slice(-6),
          orderNumber: latestOrder.order_number || latestOrder.id,
          issueDescription: form.description,
        }
      }
    })
    setDone(true); setSubmitting(false)
  }

  if (done) return (
    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl text-green-700 text-sm font-bold">
      <CheckCircle2 size={18} /> Request submitted! We'll respond within 2 business days.
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <p className="text-sm text-red-500 font-medium">{err}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-400 mb-1.5">Issue Type</label>
          <select value={form.issue_type} onChange={e => setForm(f => ({ ...f, issue_type: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-neutral-200 bg-neutral-50">
            <option value="defect">Manufacturing Defect</option>
            <option value="wrong_item">Wrong Item Delivered</option>
            <option value="qr_issue">QR Not Scanning</option>
            <option value="size_exchange">Size Exchange</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-400 mb-1.5">Unboxing Video Link</label>
          <input type="url" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
            placeholder="Google Drive / YouTube link"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-neutral-200 bg-neutral-50" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-400 mb-1.5">Describe the Issue</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3} required placeholder="Be specific — what is the defect, what did you receive, etc."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-neutral-200 bg-neutral-50 resize-none" />
      </div>
      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed">
        ⚠️ A valid, continuous, uncut unboxing video is <strong>mandatory</strong> for all return requests. No video = No return/exchange.
      </div>
      <button type="submit" disabled={submitting}
        className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-bold transition-all hover:bg-neutral-700 disabled:opacity-60">
        {submitting ? 'Submitting...' : 'Submit Return Request'}
      </button>
    </form>
  )
}

function AccountDeletionButton({ user, supabaseClient }) {
  const [confirming, setConfirming] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleRequest = async () => {
    setSubmitting(true)
    await supabaseClient.from('deletion_requests').insert({
      user_id: user?.id,
      email: user?.email,
      reason: reason || null,
    })
    await supabaseClient.functions.invoke('send-email', {
      body: {
        type: 'deletion_request',
        to: user?.email,
        toName: '',
        data: {
          firstName: '',
          email: user?.email,
          requestId: 'DEL-' + Date.now().toString().slice(-6),
        }
      }
    })
    setDone(true); setSubmitting(false)
  }

  if (done) return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
      ✓ Deletion request submitted. Your account will be permanently deleted within <strong>7 working days</strong>. You'll receive a confirmation email once done. All QR links associated with your Tee will redirect to KnoWMi's "Claim Your Tee" page.
    </div>
  )

  if (!confirming) return (
    <button onClick={() => setConfirming(true)}
      className="px-5 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all">
      Request Account Deletion
    </button>
  )

  return (
    <div className="space-y-3 p-4 bg-red-50 rounded-2xl border border-red-100">
      <p className="text-sm font-bold text-red-700">Are you sure? This will permanently delete your profile and all associated data within 7 working days. All QR links linked to your Tee will redirect to KnoWMi's "Claim Your Tee" page.</p>
      <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
        placeholder="Optional: reason for leaving"
        className="w-full px-3 py-2 rounded-xl text-sm border border-red-200 bg-white resize-none outline-none" />
      <div className="flex gap-3">
        <button onClick={handleRequest} disabled={submitting}
          className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Yes, Delete My Account'}
        </button>
        <button onClick={() => setConfirming(false)}
          className="px-5 py-2.5 text-neutral-500 text-sm font-bold hover:text-neutral-800">
          Cancel
        </button>
      </div>
    </div>
  )
}

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
  const isFree = profile?.status === 'free' || (!profile?.status && (!profile?.tier || profile?.tier === 'Starter' || profile?.tier === 'Free')) || profile?.tier === 'Free' || profile?.tier === 'Starter';
  const isPaid = !isFree || profile?.role === 'owner';
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
      const identityDataObj = { ...(identity.data || {}) };
      if (identity.bio && !identityDataObj.bio) {
        identityDataObj.bio = identity.bio;
      }
      setData(identityDataObj)
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
        const identityDataObj = { ...(identity.data || {}) };
        if (identity.bio && !identityDataObj.bio) {
          identityDataObj.bio = identity.bio;
        }
        setData(identityDataObj)
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
    const limit = isPaid ? 3 : 1;
    if (identities.length >= limit) return
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
      toast.error("You cannot delete your active identity. Please activate another one first.")
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
      
      toast.success("Identity deleted successfully.")
    } catch (err) {
      console.error('❌ DELETION FATAL ERROR:', err)
      toast.error("Failed to delete identity: " + (err.message || "Please try again."))
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
      toast.error("Error: Profile not loaded. Please refresh the page.")
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
      toast.error("Please fix the errors highlighted in red before saving. (Check that social handles are correct and stats are numbers)");
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
        bio: data.bio || '',
        data: { ...data, bio: data.bio || '' },
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

        first_name: profile.first_name,
        last_name: isMainSync ? lastName : profile.last_name,
        bio: isMainSync ? (data.bio || '') : profile.bio,
        ...dbData
      }).eq('id', profile.id)

      if (error) throw error

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
      toast.error(`Save failed: ${err.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (!isEditing) {
    const isCreator = profile?.status === 'paid' || profile?.role === 'owner'
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Ghost Mode Toggle */}
        <div className="card p-6 bg-neutral-900 text-white rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-black text-lg text-white">Privacy Mode</h3>
              {profile?.ghost_mode && <div className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black uppercase rounded border border-red-500/30 animate-pulse">Privacy Active</div>}
            </div>
            <p className="text-xs text-neutral-400 max-w-[250px]">
              Instantly hide your social links and profile picture for privacy.
            </p>
          </div>
          <button 
            onClick={async () => {
              const newStatus = !profile?.ghost_mode;
              try {
                const { error } = await supabase.from('profiles').update({ ghost_mode: newStatus }).eq('id', profile.id);
                if (error) {
                  console.error('Supabase update error:', error);
                  toast.error(`Failed to update privacy mode: ${error.message}`);
                } else {
                  toast.success(newStatus ? "Privacy Mode activated!" : "Privacy Mode deactivated!");
                  if (onUpdate) await onUpdate();
                }
              } catch (e) { 
                console.error('Ghost mode error', e); 
                toast.error(`Error: ${e.message}`);
              }
            }}
            className={`w-14 h-8 rounded-full transition-all relative ${profile?.ghost_mode ? 'bg-red-500' : 'bg-neutral-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${profile?.ghost_mode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-2 mt-8">
          <h2 className="text-xl font-display font-black">My <span className="text-orange-500">Identities</span></h2>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{identities.length} / {isPaid ? 3 : 1} Slots Used</span>
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

        {/* Add New Identity Button (Creator Plan / Free First Slot Limit Check) */}
        {identities.length < (isPaid ? 3 : 1) ? (
          <button onClick={() => navigate('/studio?mode=new')} className="w-full h-24 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/30 transition-all group">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Identity</span>
          </button>
        ) : (
          !isPaid ? (
            <div className="card p-8 bg-orange-50 border border-orange-100 text-center">
              <Lock size={32} className="mx-auto mb-4 text-orange-500 opacity-50" />
              <h3 className="text-lg font-bold mb-1">Upgrade to Creator Plan</h3>
              <p className="text-xs text-neutral-500 mb-6">Unlock up to 3 different identities for your phygital scans.</p>
              <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3 text-sm">Upgrade Now</button>
            </div>
          ) : (
            <div className="text-center py-4 px-6 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Max 3 Identities Reached</p>
            </div>
          )
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
                              let val = e.target.value;
                              const isTextStat = ['Gym Name', 'University', 'League Rank', 'Club', 'Team'].some(kw => s.includes(kw));
                              if (!isTextStat) {
                                // Strictly enforce numbers only
                                val = val.replace(/\D/g, '');
                              }
                              setStatErrors({...statErrors, [s]: false});
                              setData({...data, [s]: val});
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
  const isFree = profile?.status === 'free' || (!profile?.status && (!profile?.tier || profile?.tier === 'Starter' || profile?.tier === 'Free')) || profile?.tier === 'Free' || profile?.tier === 'Starter';
  const isPaid = !isFree || isOwner;
  const secretSlug = profile?.secure_slug || profile?.id
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/s/${secretSlug}`)}`

  const rawPersonaData = profile?.persona_data || {}
  const activeIdentity = (rawPersonaData.identities && Array.isArray(rawPersonaData.identities))
    ? (rawPersonaData.identities.find((i) => i.active) || rawPersonaData.identities[0])
    : null

  const fn = (activeIdentity?.first_name || profile?.first_name || '').trim()
  const ln = (activeIdentity?.last_name || profile?.last_name || '').trim()

  const firstNameIsSlug = fn.includes('_') || (fn === fn.toLowerCase() && !fn.includes(' ') && fn.length > 0)
  let displayName;
  if (firstNameIsSlug && ln) {
    displayName = ln;
  } else if (fn && ln) {
    displayName = `${fn} ${ln}`;
  } else {
    displayName = fn || ln || 'KnoWMi User';
  }

  const personaTitle = activeIdentity?.display_label || 
    (activeIdentity?.persona_type === 'influencer' ? 'Content Creator' : 
     activeIdentity?.persona_type === 'developer' || activeIdentity?.persona_type === 'dev' ? 'Tech' : 
     activeIdentity?.persona_type ? activeIdentity.persona_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Digital Creator');

  return (
    <div className="animate-slideUp space-y-8">
      <div className="flex items-end justify-between">
        <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">My Official Identity</p><h2 className="text-5xl font-display font-black tracking-tight">Identity <span className="gradient-text">Pass</span></h2></div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const slug = profile?.secure_slug || profile?.first_name || profile?.id;
              const profileLink = `${window.location.origin}/p/${slug}`;
              navigator.clipboard.writeText(profileLink);
              toast.success("Profile link copied to clipboard! 🔗");
            }} 
            className="h-12 px-8 text-sm font-black bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 flex items-center gap-2 transition-all active:scale-95 shadow-md shrink-0"
          >
            <Share2 size={18}/> Share My Profile
          </button>
          <button 
            onClick={() => {
              if (isPaid) {
                window.print()
              } else {
                toast("Upgrade to Premium to print or export your official Identity Pass! 🚀", { icon: '👑' })
                navigate('/shop')
              }
            }} 
            className="btn-primary h-12 px-8 text-sm flex items-center gap-2 shrink-0"
          >
            <Download size={18}/> Print / Download Pass
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
        <div className="relative group">
          <div 
            onClick={() => navigate(`/p/${profile?.secure_slug || profile?.first_name || profile?.id}`)}
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

            <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
              <img 
                src={qrUrl} 
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-full object-contain select-none ${!isPaid ? 'opacity-20 blur-sm grayscale' : ''}`} 
                alt="Identity QR" 
              />
              <div className="absolute inset-0 z-10" />
              {isPaid && (
                <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-neutral-100 p-0.5 z-20 select-none overflow-hidden">
                  <img src="/favicon.png" className="w-full h-full object-contain rounded-full" alt="KnoWMi Logo" />
                </div>
              )}
              
              {!isPaid && (
                <div className="qr-mask">
                  <Lock className="text-white mb-4" size={40} />
                  <p className="text-white font-black text-xs uppercase tracking-widest text-center px-6 leading-relaxed">Identity Pass Locked</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-5 w-64 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-3xl font-display font-black leading-tight">{displayName}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  {personaTitle}
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
                {!isPaid && <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3 text-sm">Buy A Tee — View Plans</button>}
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

const GamificationTab = ({ profile, completion, stats }) => {
  const totalScans = stats?.scans || 0;
  const level = profile?.tier === 'Creator' ? 'Pro' : (profile?.tier === 'Diamond' ? 'Diamond' : Math.floor(completion / 25) + 1 + Math.floor(totalScans / 50));
  
  const badges = [
    { id: 'identity', name: 'Identity Complete', desc: '100% Profile Completion', icon: Star, unlocked: completion === 100, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'first_scan', name: 'First Contact', desc: 'Got your first physical scan', icon: Zap, unlocked: totalScans > 0, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'popular', name: 'Rising Star', desc: 'Reached 50+ total scans', icon: TrendingUp, unlocked: totalScans >= 50, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'pro', name: 'Verified Creator', desc: 'Active Premium Subscription', icon: ShieldCheck, unlocked: profile?.status !== 'free' || profile?.role === 'owner', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'early', name: 'Early Adopter', desc: 'Joined during Beta phase', icon: Rocket, unlocked: (profile?.created_at ? new Date(String(profile.created_at).replace(' ', 'T')) : new Date()) < new Date('2026-08-01'), color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="animate-slideUp max-w-[1200px] mx-auto space-y-8 pb-32">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Rewards & Progress</p>
          <h2 className="text-5xl font-display font-black tracking-tight">Level <span className="gradient-text">{level}</span></h2>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{unlockedCount}/{badges.length} Badges Unlocked</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map(badge => (
          <div key={badge.id} className={`card p-6 border-2 transition-all duration-300 ${badge.unlocked ? 'border-orange-500/30 bg-white shadow-xl shadow-orange-500/5 hover:-translate-y-1' : 'border-neutral-100 bg-neutral-50/50 opacity-60 grayscale'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${badge.unlocked ? badge.bg + ' ' + badge.color : 'bg-neutral-200 text-neutral-400'}`}>
                <badge.icon size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black text-neutral-900 tracking-tight">{badge.name}</h4>
                <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">{badge.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-neutral-900 text-white border-neutral-800 mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black font-display mb-2">Next Level Goals</h3>
            <p className="text-sm text-neutral-400 font-medium max-w-lg">Keep building your KnoWMi identity to unlock exclusive perks, custom apparel discounts, and verified status.</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
             <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 w-full md:w-72">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Completion</span>
                 <span className="text-xs font-black">{completion}%</span>
               </div>
               <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-500 rounded-full relative transition-all duration-1000" style={{ width: `${completion}%` }}>
                   <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile, user, loading: authLoading, refreshProfile, isVerified, role } = useAuth()
  const [showComingSoon, setShowComingSoon] = useState(false)
  const isFree = profile?.status === 'free' || (!profile?.status && (!profile?.tier || profile?.tier === 'Starter' || profile?.tier === 'Free')) || profile?.tier === 'Free' || profile?.tier === 'Starter';
  const isPaid = !isFree || role === 'owner';

  // Strategic Completion Formula (Gamified Hook)
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    
    // 1. Identity created (has persona_type) -> +30%
    if (profile.persona_type) score += 30;
    
    // 2. Avatar & display name -> +20%
    if (profile.avatar_url) score += 10;
    if (profile.first_name || profile.last_name) score += 10;
    
    // 3. Bio filled -> +15%
    if (profile.bio) score += 15;
    
    // 4. Social links or custom links filled -> +10%
    const storedIdentities = profile.persona_data?.identities || [];
    const hasLinks = storedIdentities.some(id => id.data?.platforms && id.data.platforms.length > 0);
    if (hasLinks || (profile.social_links && Object.keys(profile.social_links).length > 0)) {
      score += 10;
    }
    
    // 5. Active and Paid (NFC Tee Activated) -> +25%
    if (isPaid) score += 25;
    
    return score;
  }, [profile, isPaid]);

  const [scans, setScans] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Onboarding Wizard State
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => localStorage.getItem('knowmi_onboarding_dismissed') === 'true')
  const [hasPreviewed, setHasPreviewed] = useState(() => localStorage.getItem('knowmi_onboarding_previewed') === 'true')
  const [hasShared, setHasShared] = useState(() => localStorage.getItem('knowmi_onboarding_shared') === 'true')

  const { isSupported: pushSupported, isSubscribed: pushSubscribed, loading: pushLoading, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePushNotifications(user?.id);
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
    } else {
      setActiveTab('analytics')
    }
  }, [searchParams])

  const hasEnforcedProfileTab = useRef(false)
  // If the profile loads and the user has no identities, default to the 'profile' (Identity Studio) tab so they aren't greeted by a blurred analytics lock screen.
  useEffect(() => {
    if (profile && !authLoading && !hasEnforcedProfileTab.current) {
      hasEnforcedProfileTab.current = true
      const stored = profile?.persona_data?.identities || []
      const hasTabParam = searchParams.get('tab')
      if (stored.length === 0 && !hasTabParam) {
        setActiveTab('profile')
      }
    }
  }, [profile, authLoading, searchParams])
  
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

  // Process Factory Claim Flow if user just logged in from a physical scan
  useEffect(() => {
    const pendingClaimId = localStorage.getItem('knowmi_pending_claim')
    if (pendingClaimId && user && profile) {
      const claimTee = async () => {
        try {
          // Use secure RPC to bind the factory tee ID to the user's digital identity
          const { error } = await supabase.rpc('claim_factory_tee', { p_factory_id: pendingClaimId });
          if (error) throw error;
            
          localStorage.removeItem('knowmi_pending_claim')
          toast.success("🎉 Tee claimed successfully! This physical product is now permanently paired to your digital identity.", { duration: 5000 })
          if (refreshProfile) refreshProfile()
        } catch (e) {
          console.error("Claim error", e)
        }
      }
      claimTee()
    }
  }, [user, profile])

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
  
  const refreshAnalytics = useCallback(async () => {
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

  const handleNewEvent = useCallback(() => {
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
        .then(({data}) => { setOrders(data || []) })
      
      // Fetch QR Tokens
      supabase.from('qr_tokens').select('*, stats:qr_token_stats(*)').eq('profile_id', profile.id).order('created_at', { ascending: false })
        .then(({data}) => { setQrTokens(data || []); setLoading(false) })

      // Fetch network connections
      supabase.from('network_connections').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false })
        .then(({data}) => { setConnections(data || []) })
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
      const d = new Date(typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr);
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
    if (latest && (Date.now() - new Date(typeof latest.viewed_at === 'string' ? latest.viewed_at.replace(' ', 'T') : latest.viewed_at).getTime()) < 3600000) {
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
            <button 
              onClick={() => setShowOnboardingModal(true)}
              className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none border border-orange-500/30 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white mr-2"
            >
              Onboarding Guide
            </button>
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
        {/* Onboarding Guide is now moved to the header/modal */}
        {/* Sleek Profile Completion Progress Bar */}
        {activeTab === 'profile' && (
          <div className="mb-10 w-full animate-slideUp">
            <div className="bg-white border border-neutral-100 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-inner">
                <Target size={24} className="animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest leading-none mb-2">Profile Setup Completion</h3>
                <p className="text-[11px] font-bold text-neutral-400">
                  {profileCompletion < 100 
                    ? `Complete your path to get the physical NFC smart Tee & unlock 100% of features!` 
                    : `Congratulations! Your KnoWMi Identity is fully activated! 🎉`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-[320px]">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">{profileCompletion}% Complete</span>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Level {profileCompletion === 100 ? 'Max' : '1'}</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000 shadow-md"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
              {profileCompletion < 100 && (
                <button 
                  onClick={() => navigate('/shop')}
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  Unlock 100% 🚀
                </button>
              )}
            </div>
          </div>
        </div>
        )}

        <div className={`tab-transition ${activeTab === 'analytics' ? 'tab-visible' : 'tab-hidden'}`}>
          {activeTab === 'analytics' && (
            <div className="relative">
              {/* If not paid, display the beautiful premium lock overlay in the middle */}
              {!isPaid && (
                <div className="absolute inset-x-0 top-0 z-50 flex flex-col items-center justify-start pt-16 p-8 text-center select-none">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-orange-500/25 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-white dark:bg-neutral-950 border-2 border-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Lock size={44} className="text-orange-500 animate-bounce" />
                    </div>
                  </div>
                  <h3 
                    style={{ fontFamily: 'Fraunces, serif' }} 
                    className={`text-3xl font-black mb-3 ${isVibeDark ? 'text-white' : 'text-neutral-950'}`}
                  >
                    Unlock Analytics on a Paid Plan
                  </h3>
                  <p className={`text-sm font-semibold max-w-sm mb-8 leading-relaxed ${isVibeDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
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

              <div className={`animate-slideUp ${!isPaid ? 'filter blur-[10px] select-none opacity-30' : ''}`}>

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
                  <button
                    onClick={() => setAnalyticsView('links')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300`}
                    style={{
                      background: analyticsView === 'links' ? (isVibeDark ? '#ffffff' : '#111111') : 'transparent',
                      color: analyticsView === 'links' ? (isVibeDark ? '#111111' : '#ffffff') : (isVibeDark ? 'rgba(255,255,255,0.5)' : '#888888'),
                      boxShadow: analyticsView === 'links' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Link Stats
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
                            totalCities={vibeStats.totalCities} 
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
              {pushSupported && (
                <button 
                  onClick={pushSubscribed ? pushUnsubscribe : pushSubscribe}
                  disabled={pushLoading}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg ${pushSubscribed ? 'bg-orange-500 text-white shadow-orange-500/20 hover:scale-105' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <Bell size={12} className={pushSubscribed ? 'fill-current' : ''} />
                  {pushLoading ? 'Loading...' : pushSubscribed ? 'Alerts On' : 'Enable Scan Alerts'}
                </button>
              )}
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
              <button className="px-4 py-2 bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Export</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Views', value: totalProfileViews.toLocaleString(), sub: 'Scans & Web', trend: 'Live', color: 'text-neutral-900', tooltip: 'Total number of times your profile page or phygital products have been loaded or scanned.' },
              { label: 'Unique Views', value: uniqueScans.toLocaleString(), sub: 'Real Individuals', trend: 'Verified', color: 'text-blue-500', tooltip: 'Number of unique visitors who viewed or scanned your profile, based on verification.' },
              { label: 'QR Scan Rate', value: qrScanRateLabel, sub: 'Physical to Digital', trend: 'Calculated', color: 'text-orange-500', tooltip: 'The percentage of visitors who scanned physical QR products versus accessing direct links.' },
              { label: 'Repeat Score', value: `${repeatScore}%`, sub: repeatScoreLabel, trend: 'Active', color: 'text-emerald-500', tooltip: 'The percentage of users who returned to view your profile again after their first visit.' }
            ].map((stat, i) => (
              <div key={i} className="p-6 vibe-card relative group">
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
                 <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-500 transition-all">Deep Data Analysis •••</button>
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
                           <div className="flex justify-between items-start">
                             <p className="text-[11px] font-black text-neutral-900 leading-tight">
                               {ev.visitor ? (
                                 <span className="text-orange-500">{ev.visitor.first_name}</span>
                               ) : (
                                 ev.is_repeat ? 'Repeat Visit' : (ev.referrer === 'qr' ? 'QR Code Scan' : 'Direct Link')
                               )}
                             </p>
                             <span className="text-[9px] font-bold text-neutral-500 ml-2 whitespace-nowrap">
                               {formatDistanceToNow(new Date(typeof ev.viewed_at || ev.scanned_at === 'string' ? ev.viewed_at || ev.scanned_at.replace(' ', 'T') : ev.viewed_at || ev.scanned_at), { addSuffix: true })}
                             </span>
                           </div>
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

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Referral Sources */}
            <div className="vibe-card overflow-hidden flex flex-col animate-slideUp" style={{ animationDelay: '0.3s' }}>
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

            {/* Top Fans */}
            <div className="vibe-card overflow-hidden flex flex-col animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">Top Returning Fans</h3>
              </div>
              <div className="p-8 space-y-6">
                {vibeStats.topFans?.length > 0 ? (
                  vibeStats.topFans.map((fan, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         {fan.avatar ? (
                           <Avatar 
                             src={fan.avatar} 
                             name={fan.name} 
                             size="w-10 h-10" 
                             className="rounded-2xl" 
                           />
                         ) : (
                           <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                             <Activity size={16} className="text-neutral-500" />
                           </div>
                         )}
                         <div className="flex flex-col">
                           <span className="text-[13px] font-black text-neutral-800 capitalize">{fan.name}</span>
                         </div>
                       </div>
                       <span className="text-[13px] font-black text-neutral-900">{fan.count} Views</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 pt-8">
                     <p className="text-[10px] font-black uppercase tracking-widest">No Returning Fans Yet</p>
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

              {analyticsView === 'links' && vibeStats && (
                <div className={`space-y-8 animate-slideUp ${isVibeDark ? 'dark' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="vibe-card p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 shadow-inner">
                        <Target size={24} strokeWidth={2.5} />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Intent Rate</p>
                      <h3 className="text-5xl font-black font-display text-neutral-900 tracking-tight">{vibeStats.linkStats?.engagementIntentRate || 0}%</h3>
                      <p className="text-xs text-neutral-500 font-medium mt-4">of profile viewers tapped a link.</p>
                    </div>

                    <div className="vibe-card p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 shadow-inner">
                        <TrendingDown size={24} strokeWidth={2.5} />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Bounce Rate</p>
                      <h3 className="text-5xl font-black font-display text-neutral-900 tracking-tight">{vibeStats.linkStats?.bounceRate || 0}%</h3>
                      <p className="text-xs text-neutral-500 font-medium mt-4">viewed but left without clicking.</p>
                    </div>

                    <div className="vibe-card p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6 shadow-inner">
                        <Crown size={24} strokeWidth={2.5} />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Top Link</p>
                      <h3 className="text-4xl font-black font-display text-neutral-900 tracking-tight capitalize truncate w-full px-4">{vibeStats.linkStats?.topLink || 'None'}</h3>
                      <p className="text-xs text-neutral-500 font-medium mt-4">most popular destination.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="vibe-card p-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6">Clicks by Platform</h3>
                      <div className="space-y-4">
                        {vibeStats.linkStats?.clicksByPlatform && Object.keys(vibeStats.linkStats.clicksByPlatform).length > 0 ? (
                          Object.entries(vibeStats.linkStats.clicksByPlatform).map(([platform, count], i) => {
                            const ctr = vibeStats.uniqueViews > 0 ? Math.round((count / vibeStats.uniqueViews) * 100) : 0;
                            return (
                            <div key={i} className="flex flex-col border-b border-neutral-100 pb-4 last:border-0 last:pb-0 pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-black text-neutral-800 capitalize">{platform}</span>
                                <span className="text-[13px] font-black text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full">{count} clicks</span>
                              </div>
                              <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-neutral-900 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(ctr, 100)}%` }} />
                              </div>
                              <div className="text-[10px] font-bold text-neutral-400 mt-2 tracking-wider uppercase">{ctr}% Click-Through Rate</div>
                            </div>
                          )})
                        ) : (
                          <div className="text-center opacity-30 pt-4">
                            <p className="text-[10px] font-black uppercase tracking-widest">No clicks yet</p>
                            {vibeStats.linkStats?.error && (
                              <p className="text-red-500 mt-2 text-xs">Error: {vibeStats.linkStats.error}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="vibe-card p-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6">Recent Clicks</h3>
                      <div className="space-y-4">
                        {vibeStats.linkStats?.recentClicks?.length > 0 ? (
                          vibeStats.linkStats.recentClicks.map((click, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                              <div>
                                <span className="text-[13px] font-black text-neutral-800 capitalize">{click.platform}</span>
                                <p className="text-[10px] text-neutral-500 font-bold mt-1">{new Date(typeof click.clicked_at === 'string' ? click.clicked_at.replace(' ', 'T') : click.clicked_at).toLocaleString()}</p>
                              </div>
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Guest</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center opacity-30 pt-4">
                            <p className="text-[10px] font-black uppercase tracking-widest">No recent clicks</p>
                          </div>
                        )}
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
          
          {/* Network Tab */}
          <div className={`tab-transition ${activeTab === 'network' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'network' && (
              <div className="space-y-8 animate-slideUp pb-20 max-w-4xl mx-auto">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Two-Way Networking</p>
                    <h2 className="text-5xl font-display font-black tracking-tight">Your <span className="gradient-text">Network</span></h2>
                  </div>
                </div>

                {connections.length === 0 ? (
                  <div className="card p-20 text-center bg-white shadow-xl">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                      <Users size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No connections yet</h3>
                    <p className="text-sm text-neutral-400">When people leave their card on your profile, they will appear here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {connections.map((conn, idx) => (
                      <div key={idx} className="card p-6 bg-white shadow-sm flex items-center justify-between border border-neutral-100 hover:border-orange-500 transition-colors">
                        <div>
                          <h4 className="text-lg font-black text-neutral-900">{conn.visitor_name}</h4>
                          <p className="text-sm text-neutral-500">{conn.visitor_email}</p>
                          {conn.visitor_social && <p className="text-xs text-orange-500 font-bold mt-1">{conn.visitor_social}</p>}
                          {conn.visitor_message && <p className="text-sm italic text-neutral-400 mt-2">"{conn.visitor_message}"</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-400 font-bold">{new Date(typeof conn.created_at === 'string' ? conn.created_at.replace(' ', 'T') : conn.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                    <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3 text-sm">Browse Collection</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="card p-8 bg-white shadow-xl border-none">
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Order Placed</p>
                            <p className="text-lg font-bold">{new Date((typeof (latestOrder.order_date || latestOrder.created_at) === 'string' ? (latestOrder.order_date || latestOrder.created_at).replace(' ', 'T') : (latestOrder.order_date || latestOrder.created_at))).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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

                {/* Return Request Form */}
                <div className="card p-8 bg-white shadow-sm border border-neutral-100">
                  <div className="mb-6">
                    <p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-1">Support</p>
                    <h3 className="text-2xl font-display font-black tracking-tight">Report an Issue</h3>
                    <p className="text-sm text-neutral-400 mt-1">For defects, wrong items, or size exchanges. Requests must be raised within 7 days of delivery.</p>
                  </div>
                  <ReturnRequestForm user={user} latestOrder={latestOrder} supabaseClient={supabase} />
                </div>

                {/* Account Deletion */}
                <div className="card p-8 bg-white shadow-sm border border-red-50">
                  <p className="text-[11px] font-black uppercase text-red-400 tracking-[0.2em] mb-1">Danger Zone</p>
                  <h3 className="text-xl font-display font-black tracking-tight text-neutral-800 mb-2">Delete My Account</h3>
                  <p className="text-sm text-neutral-400 mb-5 leading-relaxed">Request permanent deletion of your KnoWMi account and personal data. This cannot be undone. Order records are retained for 7 years for tax compliance.</p>
                  <AccountDeletionButton user={user} supabaseClient={supabase} />
                </div>
              </div>
            )}
          </div>

          <div className={`tab-transition ${activeTab === 'phygital' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'phygital' && (
              <div className="animate-slideUp space-y-8">
                <div className="flex items-end justify-between">
                  <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Physical Identification</p><h2 className="text-5xl font-display font-black tracking-tight">QR <span className="gradient-text">Studio</span></h2></div>
                </div>
                <QRManager initialTokens={qrTokens} profileId={profile?.id} profileSlug={profile?.secure_slug} isPaid={isPaid} />
              </div>
            )}
          </div>
          
          <div className={`tab-transition ${activeTab === 'business' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'business' && (
              <BusinessNeedsTab profile={profile} />
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
            { id: 'network', icon: Users, label: 'Network' },
            { id: 'business', icon: Lock, label: 'Business' },
            { id: 'pass', icon: ShieldCheck, label: 'Pass' },
            { id: 'order-status', icon: Clock, label: 'Status' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => {
                if (tab.id === 'business') {
                  setShowComingSoon(true);
                  setTimeout(() => setShowComingSoon(false), 3000);
                  return;
                }
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

      {showOnboardingModal && (
        <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn text-white select-none">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/5 max-w-4xl w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
            
            <button 
              onClick={() => setShowOnboardingModal(false)} 
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              title="Close guide"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 max-w-3xl">
              <span className="px-3 py-1 bg-orange-500/15 text-orange-400 font-black text-[9px] uppercase tracking-widest rounded-lg">
                Onboarding Guide
              </span>
              <h2 className="text-3xl font-display font-black tracking-tight mt-3 mb-2 text-white">
                Activate your <span className="gradient-text">KnoWMi Presence</span>
              </h2>
              <p className="text-sm text-neutral-400 mb-8 font-medium">
                Follow these 3 simple steps to fully configure, preview, and launch your dynamic digital identity to the world.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                {/* Step 1 */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${profile?.persona_type ? 'bg-white/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${profile?.persona_type ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {profile?.persona_type ? '✓' : '1'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${profile?.persona_type ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {profile?.persona_type ? 'Completed' : 'Action Required'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">Create Identity</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Customize your dynamic persona tabs, social channels, and unique stats.</p>
                  {!profile?.persona_type ? (
                    <button 
                      onClick={() => { setActiveTab('profile'); setShowOnboardingModal(false); }} 
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                    >
                      Create Now
                    </button>
                  ) : (
                    <div className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 py-2.5">
                      ✦ Ready
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${hasPreviewed ? 'bg-white/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${hasPreviewed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {hasPreviewed ? '✓' : '2'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${hasPreviewed ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {hasPreviewed ? 'Completed' : 'Action Required'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">Preview Profile</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Check out how your live profile looks to others when they scan your QR code.</p>
                  {!hasPreviewed ? (
                    <button 
                      onClick={() => {
                        const slug = profile?.secure_slug || profile?.first_name || profile?.id;
                        window.open(`/p/${slug}`, '_blank');
                        localStorage.setItem('knowmi_onboarding_previewed', 'true');
                        setHasPreviewed(true);
                      }} 
                      disabled={!profile?.persona_type}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      Preview live
                    </button>
                  ) : (
                    <div className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 py-2.5">
                      ✦ Visualized
                    </div>
                  )}
                </div>

                {/* Step 3 */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${hasShared ? 'bg-white/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${hasShared ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {hasShared ? '✓' : '3'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${hasShared ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {hasShared ? 'Completed' : 'Action Required'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">Share Presence</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Copy your secure link to share on social channels and bio descriptions.</p>
                  {!hasShared ? (
                    <button 
                      onClick={() => {
                        const slug = profile?.secure_slug || profile?.first_name || profile?.id;
                        const profileLink = `${window.location.origin}/p/${slug}`;
                        navigator.clipboard.writeText(profileLink);
                        localStorage.setItem('knowmi_onboarding_shared', 'true');
                        setHasShared(true);
                        toast.success("Profile link copied! 🔗");
                      }} 
                      disabled={!profile?.persona_type || !hasPreviewed}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      Copy Share Link
                    </button>
                  ) : (
                    <div className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 py-2.5">
                      ✦ Shared
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showComingSoon && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 font-bold text-sm whitespace-nowrap" style={{ background: '#ea580c', color: 'white', zIndex: 9999 }}><Lock size={16} /> Business Center Coming Soon!</div>}
      </div>
    )
  }




export default function DashboardWrapper(props) { return <DashboardErrorBoundary><Dashboard {...props} /></DashboardErrorBoundary>; }


