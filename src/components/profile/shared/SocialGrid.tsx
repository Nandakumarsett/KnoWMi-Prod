import { useState } from 'react'
import { Instagram, Github, Linkedin, Twitter, Youtube, Music, Globe, MessageCircle, Twitch, Briefcase, Dribbble, PenTool, Lock, X } from 'lucide-react'
import { SocialLink } from '../../../types/profile'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'

interface SocialGridProps {
  links: SocialLink[]
  style?: 'row' | 'grid'
  profileId?: string
}

const PLATFORM_META: Record<string, any> = {
  instagram: { icon: Instagram, color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  github: { icon: Github, color: '#181717' },
  linkedin: { icon: Linkedin, color: '#0077B5' },
  twitter: { icon: Twitter, color: '#000000' },
  youtube: { icon: Youtube, color: '#FF0000' },
  spotify: { icon: Music, color: '#1DB954' },
  twitch: { icon: Twitch, color: '#9146FF' },
  behance: { icon: Briefcase, color: '#053EFF' },
  dribbble: { icon: Dribbble, color: '#EA4C89' },
  medium: { icon: PenTool, color: '#000000' },
  whatsapp: { icon: MessageCircle, color: '#25D366' },
  website: { icon: Globe, color: '#444444' }
}

export function SocialGrid({ links, style = 'row', profileId }: SocialGridProps) {
  const { user, loading: authLoading } = useAuth()
  const [showGate, setShowGate] = useState(false)
  // Wait for auth to resolve before deciding. During loading, assume not gated to avoid flicker.
  // After loading completes, gate if no user is logged in.
  const isGated = !authLoading && !user;

  if (!links || links.length === 0) return null
  
  // Custom sorting: move youtube immediately after instagram if both exist
  let sortedLinks = [...links];
  const instaIdx = sortedLinks.findIndex(l => l.platform.toLowerCase() === 'instagram');
  const ytIdx = sortedLinks.findIndex(l => l.platform.toLowerCase() === 'youtube');
  if (instaIdx !== -1 && ytIdx !== -1 && ytIdx !== instaIdx + 1) {
    const ytLink = sortedLinks.splice(ytIdx, 1)[0];
    const newInstaIdx = sortedLinks.findIndex(l => l.platform.toLowerCase() === 'instagram');
    sortedLinks.splice(newInstaIdx + 1, 0, ytLink);
  }

  const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, platform: string, url: string) => {
    e.preventDefault();
    if (isGated) {
      setShowGate(true);
      return;
    }
    if (profileId) {
      try {
        const fp = localStorage.getItem('knowmi_fp') || 'unknown';
        await supabase.from('link_click_events').insert({
          profile_id: profileId,
          platform,
          url,
          visitor_fp: fp
        });
      } catch (err) {
        console.error('Failed to track link click:', err);
      }
    }
    window.open(url, '_blank');
  };

  const renderGateModal = () => {
    if (!showGate) return null;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 max-w-sm w-full text-center relative shadow-2xl">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowGate(false) }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight">Locked Network</h3>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            Create a free KnoWMi account to unlock these links and securely save this connection.
          </p>
          <button 
            onClick={() => {
              localStorage.setItem('return_to', window.location.pathname + window.location.search);
              window.location.href = '/?auth=signup';
            }}
            className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            Create Free Account
          </button>
          <button 
            onClick={() => {
              localStorage.setItem('return_to', window.location.pathname + window.location.search);
              window.location.href = '/?auth=login';
            }}
            className="w-full mt-3 py-3 bg-transparent text-neutral-300 font-bold text-xs hover:text-white transition-colors cursor-pointer"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    )
  }

  if (style === 'grid') {
    return (
      <>
        <div className="grid grid-cols-2 gap-3 w-full">
          {sortedLinks.map((link, idx) => {
            const meta = PLATFORM_META[link.platform] || { icon: Globe, color: '#444444' }
            const Icon = meta.icon
            return (
              <a 
                key={link.platform}
                href={link.url}
                onClick={(e) => handleLinkClick(e, link.platform, link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-4 rounded-2xl bg-white/5 border transition-all hover:bg-white/10 active:scale-[0.98] social-link-item cursor-pointer ${isGated ? 'border-orange-500/30' : 'border-white/10'}`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg relative overflow-hidden"
                  style={{ background: meta.color }}
                >
                  <Icon size={20} className={isGated ? 'opacity-30' : ''} />
                  {isGated && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <Lock size={14} className="text-orange-400 drop-shadow-lg" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase opacity-40 truncate">{link.platform}</span>
                  <span className="text-xs font-bold truncate">{link.url}</span>
                </div>
              </a>
            )
          })}
        </div>
        {renderGateModal()}
      </>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center py-4">
        {sortedLinks.map((link) => {
          const meta = PLATFORM_META[link.platform] || { icon: Globe, color: '#444444' }
          const Icon = meta.icon
          return (
            <a 
              key={link.platform}
              href={link.url}
              onClick={(e) => handleLinkClick(e, link.platform, link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl social-link-item relative cursor-pointer ${isGated ? 'ring-2 ring-orange-500/30 ring-offset-2 ring-offset-transparent' : ''}`}
              style={{ background: meta.color }}
              title={link.platform}
            >
              <Icon size={24} className={isGated ? 'opacity-30' : ''} />
              {isGated && (
                <div className="absolute inset-0 rounded-2xl bg-black/65 backdrop-blur-[1px] flex flex-col items-center justify-center gap-0.5">
                  <Lock size={16} className="text-orange-400 drop-shadow-lg" strokeWidth={2.5} />
                </div>
              )}
            </a>
          )
        })}
      </div>
      {renderGateModal()}
    </>
  )
}
