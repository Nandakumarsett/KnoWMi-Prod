import { Instagram, Github, Linkedin, Twitter, Youtube, Music, Globe, MessageCircle, Twitch, Briefcase, Dribbble, PenTool } from 'lucide-react'
import { SocialLink } from '../../../types/profile'

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

import { supabase } from '../../../lib/supabase'

export function SocialGrid({ links, style = 'row', profileId }: SocialGridProps) {
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

  if (style === 'grid') {
    return (
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
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ background: meta.color }}
              >
                <Icon size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase opacity-40 truncate">{link.platform}</span>
                <span className="text-xs font-bold truncate">{link.url}</span>
              </div>
            </a>
          )
        })}
      </div>
    )
  }

  return (
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
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl"
            style={{ background: meta.color }}
            title={link.platform}
          >
            <Icon size={24} />
          </a>
        )
      })}
    </div>
  )
}
