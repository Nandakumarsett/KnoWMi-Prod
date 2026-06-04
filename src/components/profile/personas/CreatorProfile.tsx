import React from "react";
import { ProfileData, CreatorData } from "../../../types/profile";
import { PulseBar } from "../shared/PulseBar";
import { VerifiedBadge } from "../shared/VerifiedBadge";
import { ProfileAvatar } from "../shared/ProfileAvatar";
import { getAssetUrl } from "../../../lib/supabase";
import {
  LayoutGrid,
  Instagram,
  Youtube,
  Twitter,
  Github,
  Share2,
  Sparkles,
  TrendingUp,
  Camera,
  Play,
  Film,
  MapPin,
  Trophy,
  Mail,
  MessageCircle,
  Clock,
  Users,
  Target,
  Briefcase,
  Facebook,
  Linkedin,
  Globe,
  Activity,
  X,
  Lock,
  QrCode,
} from "lucide-react";
import { trackLinkClick } from "../../../lib/analytics/track";
import { useGatedLink } from "../../../hooks/useGatedLink";

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  "twitter / x": Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  threads: Twitter,
  behance: LayoutGrid,
  dribbble: Globe,
  medium: Sparkles,
  github: Github,
  tiktok: Share2,
  twitch: Twitter,
};

export function CreatorProfile({
  profile,
  stats,
}: {
  profile: ProfileData;
  stats?: any;
}) {
  const [avatarError, setAvatarError] = React.useState(false);
  const data = (profile.persona_data || {}) as CreatorData;
  const activeTheme = (profile.profile_theme || "default").toLowerCase();
  const { isGated, handleGatedClick, GateModal } = useGatedLink();
  const [selectedWork, setSelectedWork] = React.useState<any>(null);
  const [showFomoModal, setShowFomoModal] = React.useState(false);

  const liveViews = stats?.totalViews || 0;
  const topCity = stats?.topCities?.[0]?.city || "Global";
  const isFreeProfile =
    profile.tier === "Starter" ||
    profile.tier === "Free" ||
    profile.status === "free" ||
    (!profile.status && (!profile.tier || profile.tier === "Starter"));

  const getThumbnail = (work: any) => {
    if (work.external_url) {
      const url = work.external_url;
      const ytMatch = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      );
      if (ytMatch)
        return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      if (url.includes("vimeo.com")) {
        const id = url.split("/").pop();
        return `https://vumbnail.com/${id}.jpg`;
      }
      return null;
    }
    const mediaUrl =
      work.thumbnail_url ||
      work.img ||
      (work.type !== "video" ? work.url : null);
    if (!mediaUrl) return null;
    return getAssetUrl(mediaUrl);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  // PLATFORM BRAND STYLES MAP
  const brandStyles: Record<string, string> = {
    instagram:
      "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
    youtube: "bg-[#FF0000] text-white",
    twitter: "bg-[#000000] text-white",
    "twitter / x": "bg-[#000000] text-white",
    threads: "bg-[#000000] text-white",
    facebook: "bg-[#1877F2] text-white",
    linkedin: "bg-[#0077B5] text-white",
    behance: "bg-[#1769ff] text-white",
    dribbble: "bg-[#ea4c89] text-white",
    medium: "bg-[#000000] text-white",
    github: "bg-[#181717] text-white",
  };

  const logoNames: Record<string, string> = {
    instagram: "instagram",
    youtube: "youtube",
    twitter: "x",
    "twitter / x": "x",
    threads: "threads",
    facebook: "facebook",
    linkedin: "linkedin",
    behance: "behance",
    dribbble: "dribbble",
    medium: "medium",
    github: "github",
  };

  // ----------------------------------------------------
  // LAYOUT 0: ORIGINAL CLASSIC STYLE (Classic Theme)
  // ----------------------------------------------------
  if (activeTheme === "classic") {
    const getPlaceColor = (city: string) => {
      const c = city.toLowerCase();
      if (
        c.includes("bengaluru") ||
        c.includes("bangalore") ||
        c.includes("karnataka") ||
        c.includes("mysuru") ||
        c.includes("hubballi") ||
        c.includes("mangalore")
      )
        return "#D71920";
      if (
        c.includes("chennai") ||
        c.includes("madras") ||
        c.includes("tamil nadu") ||
        c.includes("coimbatore") ||
        c.includes("madurai")
      )
        return "#F9CD05";
      if (
        c.includes("mumbai") ||
        c.includes("bombay") ||
        c.includes("maharashtra") ||
        c.includes("pune") ||
        c.includes("nagpur")
      )
        return "#004BA0";
      if (
        c.includes("kolkata") ||
        c.includes("calcutta") ||
        c.includes("west bengal")
      )
        return "#3A225D";
      if (
        c.includes("hyderabad") ||
        c.includes("telangana") ||
        c.includes("andhra") ||
        c.includes("vijayawada") ||
        c.includes("visakhapatnam")
      )
        return "#F26522";
      if (
        c.includes("rajasthan") ||
        c.includes("jaipur") ||
        c.includes("jodhpur") ||
        c.includes("udaipur")
      )
        return "#EA1A85";
      if (c.includes("delhi")) return "#17479E";
      if (
        c.includes("punjab") ||
        c.includes("ludhiana") ||
        c.includes("amritsar") ||
        c.includes("chandigarh")
      )
        return "#DD1F2D";
      if (
        c.includes("gujarat") ||
        c.includes("ahmedabad") ||
        c.includes("surat") ||
        c.includes("vadodara")
      )
        return "#1C1C3C";
      if (
        c.includes("lucknow") ||
        c.includes("kanpur") ||
        c.includes("agra") ||
        c.includes("uttar pradesh")
      )
        return "#00AEEF";
      return "#1A1A1A";
    };
    const cityColor = getPlaceColor(topCity);

    return (
      <div className="w-full pb-12 relative overflow-hidden bg-white rounded-[40px] border border-[#E5D5C4] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 10 + 5}px`,
              }}
            >
              {i % 4 === 0 ? "🦋" : "✨"}
            </div>
          ))}
        </div>

        <section className="relative z-10 text-left">
          <div className="w-full h-48 sm:h-64 relative bg-[#1A1A1A] overflow-hidden rounded-t-[40px]">
            {data.featured_work_url ? (
              <img
                src={getAssetUrl(data.featured_work_url)}
                className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
                alt="Profile Banner"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-600" />
            )}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent via-[25%]" />
            <div className="absolute top-6 right-8 text-white/40 z-20">
              <Sparkles size={28} className="animate-pulse" />
            </div>
          </div>

          <div className="relative h-12 px-8 z-30">
            <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div
                className="w-40 h-40 sm:w-48 sm:h-48 p-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #C1440E, #F97316)",
                }}
              >
                <div className="w-full h-full bg-white p-1 rounded-full overflow-hidden shadow-inner">
                  {!avatarError && profile.avatar_url ? (
                    <img
                      src={getAssetUrl(profile.avatar_url)}
                      alt={profile.display_name}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full object-cover rounded-full flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl rounded-full"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      {profile.display_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
              {profile.is_verified && (
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-neutral-100">
                  <VerifiedBadge
                    isVerified={profile.is_verified}
                    accentColor="#C1440E"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pt-6 relative z-20">
            <div className="flex flex-col items-center mb-10">
              <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-2 uppercase italic leading-tight">
                  {profile.display_name}
                </h1>
                <p className="text-xs font-black text-orange-600 uppercase tracking-[0.4em] leading-none mt-2 mb-4">
                  {data.type || "CREATIVE PROFESSIONAL"}
                </p>
                {profile.bio && (
                  <p className="text-sm font-black text-neutral-800 leading-tight italic max-w-lg mx-auto">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`mb-16 animate-fadeIn w-full -mt-6 ${isFreeProfile ? "cursor-pointer hover:opacity-85 transition-opacity" : ""}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <div className="flex justify-evenly items-start w-full">
                <div className="flex flex-col items-center text-center">
                  <span
                    className={`text-4xl font-black text-neutral-900 leading-none mb-3 ${isFreeProfile ? "blur-[6px] select-none opacity-50 inline-block px-2" : ""}`}
                  >
                    {isFreeProfile ? "8,204" : liveViews}
                  </span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                    Profile Views
                  </p>
                </div>
                <div className="flex flex-col items-center text-center transform translate-x-4">
                  <span
                    className={`text-4xl font-black leading-none mb-3 ${isFreeProfile ? "blur-[6px] select-none opacity-50 inline-block px-2" : ""}`}
                    style={{ color: cityColor }}
                  >
                    {isFreeProfile ? "New York" : topCity}
                  </span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                    Most Scanned Place
                  </p>
                </div>
              </div>
            </div>

            {data.about && (
              <div className="mb-8">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-1">
                  Professional Narrative
                </p>
                <p className="text-base text-neutral-600 leading-relaxed bg-neutral-50/30 py-4 px-6 rounded-[24px] border border-neutral-100/50 max-w-2xl italic">
                  "{data.about}"
                </p>
              </div>
            )}

            {data.platforms && data.platforms.length > 0 && (
              <div className="mb-12">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">
                  Where you can find me
                </p>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-start gap-3 sm:gap-8 overflow-x-auto no-scrollbar pb-2">
                  {data.platforms.map((p) => {
                    const platform = p.platform?.toLowerCase();
                    const Icon = PLATFORM_ICONS[platform] || Share2;
                    const style =
                      brandStyles[platform] || "bg-neutral-900 text-white";
                    const logo = logoNames[platform];

                    return (
                      <a
                        key={p.platform}
                        href={ensureAbsoluteUrl(p.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          handleGatedClick(e, p.url, () =>
                            trackLinkClick(
                              profile.id,
                              p.platform || "unknown",
                              p.url,
                            ),
                          );
                          if (!isGated)
                            window.open(ensureAbsoluteUrl(p.url), "_blank");
                        }}
                        className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 shrink-0 social-link-item cursor-pointer"
                      >
                        <div
                          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${style} transition-shadow group-hover:shadow-xl p-3 sm:p-3.5 relative overflow-hidden`}
                        >
                          {logo ? (
                            <img
                              src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                              className="w-full h-full object-contain filter invert"
                              alt={p.platform}
                              style={{ filter: "brightness(0) invert(1)" }}
                            />
                          ) : null}
                          <Icon
                            size={24}
                            className={
                              logo
                                ? "hidden"
                                : `sm:hidden ${logo ? "" : "sm:block"}`
                            }
                          />
                          <Icon
                            size={28}
                            className={logo ? "hidden" : "hidden sm:block"}
                          />
                          {isGated && (
                            <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center">
                              <Lock
                                size={18}
                                className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                                strokeWidth={2.5}
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-center hidden sm:block">
                          <p className="text-[10px] font-black uppercase text-neutral-900 tracking-tighter">
                            {p.platform}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {data.content_formats && data.content_formats.length > 0 && (
              <div className="mb-12">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-4">
                  Core Specialization
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.content_formats.map((format) => (
                    <span
                      key={format}
                      className="px-4 py-2 rounded-xl bg-orange-50 text-xs font-black uppercase tracking-widest text-orange-600 border border-orange-100"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.works && data.works.length > 0 && (
              <div className="mb-12">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">
                  Recent Showcase
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {data.works.map((w, i) => {
                    const thumb = getThumbnail(w);
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedWork(w)}
                        className="group relative rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm hover:shadow-xl transition-all aspect-video cursor-pointer"
                      >
                        <img
                          src={
                            thumb ||
                            "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070"
                          }
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={w.title}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {w.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <section className="px-0 mb-6 relative z-10">
              <div className="flex flex-col items-center text-center gap-8 bg-neutral-50/50 p-8 rounded-[32px] border border-neutral-100/50">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-2 whitespace-nowrap">
                    <Sparkles size={16} className="text-orange-500" />
                    <span className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900">
                      Open for Collaboration
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium italic">
                    {data.collab_types ||
                      "Available for strategic creative partnerships."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full">
                  {data.contact_email && (
                    <a
                      href={`mailto:${data.contact_email}`}
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-neutral-200 rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all text-xs font-black uppercase tracking-widest text-neutral-900 shadow-sm whitespace-nowrap flex-1 min-w-[160px]"
                    >
                      <Mail size={16} /> Email Me
                    </a>
                  )}
                  {data.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 rounded-2xl hover:bg-orange-600 transition-all text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-neutral-900/10 whitespace-nowrap flex-1 min-w-[160px]"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>
        <GateModal />
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 1: BRUTALIST HIGH-FASHION (Minimal Theme)
  // ----------------------------------------------------
  if (activeTheme === "minimal") {
    return (
      <div className="w-full pb-24 relative bg-white text-black font-sans min-h-screen">
        {/* Top Header / Menu */}
        <div className="absolute top-6 right-6 z-40 flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-widest block">
              Scan to Connect
            </span>
          </div>
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
            <QrCode size={18} className="text-black" />
          </div>
        </div>

        {/* Banner (Background) */}
        {data.featured_work_url && (
          <div
            className="absolute top-0 left-0 w-full h-64 sm:h-80 z-0 pointer-events-none opacity-40 mix-blend-multiply"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          >
            <img
              src={getAssetUrl(data.featured_work_url)}
              alt="Banner"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        )}

        <div className="px-6 sm:px-12 pt-32 max-w-4xl mx-auto flex flex-col items-center relative z-10">
          {/* Profile Pic */}
          <div className="w-full mb-6 flex justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              {!avatarError && profile.avatar_url ? (
                <img
                  src={getAssetUrl(profile.avatar_url)}
                  alt={profile.display_name}
                  className="w-full h-full object-cover grayscale"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div
                  className="w-full h-full object-cover grayscale flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl "
                  style={{ fontFamily: "sans-serif" }}
                >
                  {profile.display_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

          {/* Typographic Header */}
          <div className="text-center w-full mb-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none mb-4">
              {profile.display_name}
            </h1>
            <p className="text-sm sm:text-base font-bold tracking-widest uppercase border-y-2 border-black py-2 inline-block">
              {data.type || "DIGITAL CREATOR"}
            </p>
          </div>

          {/* Tagline / Bio */}
          {profile.bio && (
            <div className="mb-10 w-full text-center max-w-lg mx-auto">
              <p className="text-sm font-bold tracking-widest uppercase italic">
                "{profile.bio}"
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap justify-center sm:justify-between items-center gap-4 mb-10 bg-white">
            <div
              className={`text-center ${isFreeProfile ? "cursor-pointer hover:opacity-80" : ""}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">
                VIEWS
              </span>
              <span
                className={`text-2xl font-black ${isFreeProfile ? "blur-[4px]" : ""}`}
              >
                {isFreeProfile ? "4.2K" : liveViews}
              </span>
            </div>
            <div className="hidden sm:block w-0.5 h-8 bg-black"></div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">
                LOCATION
              </span>
              <span className="text-xl font-black uppercase">{topCity}</span>
            </div>
            <div className="hidden sm:block w-0.5 h-8 bg-black"></div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">
                VIBE SCORE
              </span>
              <span className="text-3xl font-black flex items-end gap-1">
                92<span className="text-xs mb-1">/100</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full text-left mb-12">
            {/* Work List */}
            {data.content_formats && data.content_formats.length > 0 && (
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 border-b-4 border-black pb-2">
                  WORK
                </h3>
                <ul className="space-y-3">
                  {data.content_formats.map((format) => (
                    <li
                      key={format}
                      className="font-bold text-sm uppercase tracking-widest flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-black"></div> {format}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About / Narrative */}
            {data.about && (
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 border-b-4 border-black pb-2">
                  NARRATIVE
                </h3>
                <p className="text-xs font-bold leading-relaxed">
                  {data.about}
                </p>
              </div>
            )}
          </div>

          {/* Socials */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-center mb-10">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6 border-b-4 border-black pb-2 text-left">
                SOCIALS
              </h3>
              <div className="flex flex-wrap gap-4 justify-start">
                {data.platforms.map((p) => {
                  const platform = p.platform?.toLowerCase();
                  const Icon = PLATFORM_ICONS[platform] || Share2;
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () =>
                          trackLinkClick(
                            profile.id,
                            p.platform || "unknown",
                            p.url,
                          ),
                        );
                        if (!isGated)
                          window.open(ensureAbsoluteUrl(p.url), "_blank");
                      }}
                      className="w-14 h-14 border-4 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] relative cursor-pointer"
                    >
                      <Icon size={24} />
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <Lock size={14} className="text-white" />
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact / Action */}
          <div className="w-full mt-4">
            {data.contact_email && (
              <a
                href={`mailto:${data.contact_email}`}
                className="block w-full py-5 bg-black text-white text-center font-black text-xl uppercase tracking-widest hover:bg-white hover:text-black hover:border-4 hover:border-black transition-all"
              >
                LET'S CONNECT &rarr;
              </a>
            )}
          </div>
        </div>
        <GateModal />
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 2: SYNTHWAVE / CYBERPUNK CONSOLE (Neon Theme)
  // ----------------------------------------------------
  if (activeTheme === "neon") {
    return (
      <div className="w-full pb-24 relative bg-[#0D0B1A] text-white font-sans overflow-x-hidden min-h-screen">
        {/* Neon Background Accents & Banner */}
        {data.featured_work_url && (
          <div
            className="absolute top-0 left-0 w-full h-72 sm:h-96 opacity-40 mix-blend-screen pointer-events-none z-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          >
            <img
              src={getAssetUrl(data.featured_work_url)}
              className="w-full h-full object-cover filter contrast-125 saturate-150 grayscale"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/40 via-purple-600/20 to-transparent mix-blend-overlay" />
          </div>
        )}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF2D78]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-black/40 border border-[#FF2D78]/50 px-3 py-1.5 rounded-md backdrop-blur-md shadow-[0_0_10px_rgba(255,45,120,0.3)]">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF2D78]">
              Scan to Connect
            </span>
            <QrCode size={16} className="text-[#FF2D78]" />
          </div>
          <div className="w-8 h-8 flex flex-col justify-center gap-1.5 items-end cursor-pointer group mt-2">
            <div className="w-6 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
            <div className="w-8 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)]"></div>
            <div className="w-4 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-24 max-w-4xl mx-auto flex flex-col items-center relative z-20">
          {/* Avatar with Neon Ring */}
          <div className="relative mb-8">
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-br from-[#FF2D78] to-purple-600 shadow-[0_0_30px_rgba(255,45,120,0.6)] animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-full h-full rounded-full bg-[#0D0B1A] overflow-hidden p-1">
                {!avatarError && profile.avatar_url ? (
                  <img
                    src={getAssetUrl(profile.avatar_url)}
                    alt={profile.display_name}
                    className="w-full h-full object-cover rounded-full filter contrast-125 saturate-50"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full object-cover rounded-full filter contrast-125 saturate-50 flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl rounded-full"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {profile.display_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="text-center w-full mb-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              {profile.display_name}
            </h1>
            <h2 className="text-sm sm:text-base font-black tracking-[0.3em] uppercase text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)]">
              {data.type || "DIGITAL CREATOR"}
            </h2>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="w-full max-w-lg mx-auto text-center mb-10">
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full max-w-3xl border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-10 flex flex-wrap justify-between items-center gap-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div
              className={`text-center flex-1 min-w-[80px] ${isFreeProfile ? "cursor-pointer hover:opacity-80" : ""}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                VIEWS
              </span>
              <span
                className={`text-2xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block ${isFreeProfile ? "blur-[4px]" : ""}`}
              >
                {isFreeProfile ? "4.2K" : liveViews}
              </span>
            </div>
            <div className="text-center flex-1 min-w-[80px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                LOCATION
              </span>
              <span className="text-xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block truncate max-w-full uppercase">
                {topCity}
              </span>
            </div>
            <div className="text-center flex-1 min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D78] block mb-2 drop-shadow-[0_0_5px_rgba(255,45,120,0.8)]">
                VIBE SCORE
              </span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] flex items-baseline gap-1">
                  92<span className="text-sm text-gray-400">/100</span>
                </span>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-[#FF2D78] shadow-[0_0_10px_rgba(255,45,120,1)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
            {/* What I Do */}
            {data.content_formats && data.content_formats.length > 0 && (
              <div className="bg-black/30 border border-[#FF2D78]/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(255,45,120,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-[#FF2D78] mb-5">
                  WHAT I DO
                </h3>
                <ul className="space-y-4">
                  {data.content_formats.map((format) => (
                    <li
                      key={format}
                      className="text-sm text-gray-200 flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,1)]"></div>
                      <span className="font-medium tracking-wide">
                        {format}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Narrative */}
            {data.about && (
              <div className="bg-black/30 border border-cyan-500/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-cyan-400 mb-5">
                  NARRATIVE
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {data.about}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-center mb-10">
              <div className="flex flex-wrap gap-5 justify-center">
                {data.platforms.map((p) => {
                  const platform = p.platform?.toLowerCase();
                  const Icon = PLATFORM_ICONS[platform] || Share2;
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () =>
                          trackLinkClick(
                            profile.id,
                            p.platform || "unknown",
                            p.url,
                          ),
                        );
                        if (!isGated)
                          window.open(ensureAbsoluteUrl(p.url), "_blank");
                      }}
                      className="w-12 h-12 rounded-full border border-[#FF2D78]/50 flex items-center justify-center bg-black/50 text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:shadow-[0_0_20px_rgba(255,45,120,0.8)] transition-all cursor-pointer relative"
                    >
                      <Icon size={20} />
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center">
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {data.contact_email && (
            <div className="w-full flex justify-center pb-8">
              <a
                href={`mailto:${data.contact_email}`}
                className="px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all"
              >
                INITIATE CONTACT
              </a>
            </div>
          )}

          {/* FOMO Modal */}
          {showFomoModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#0D0B1A] border-2 border-[#FF2D78] rounded-[24px] p-8 max-w-sm w-full shadow-[0_0_40px_rgba(255,45,120,0.3)] relative animate-zoomIn text-center">
                <button
                  onClick={() => setShowFomoModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#FF2D78] transition-colors"
                >
                  <X size={20} />
                </button>
                <Activity
                  size={48}
                  className="text-[#FF2D78] mx-auto mb-6 animate-pulse"
                />
                <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">
                  Unlock Telemetry
                </h3>
                <p className="text-xs font-light text-gray-400 mb-8 leading-relaxed">
                  Upgrade to full tier to view real-time profile scans and
                  audience telemetry.
                </p>
                <button
                  onClick={() => (window.location.href = "/#pricing")}
                  className="w-full py-4 bg-[#FF2D78] hover:bg-[#D41C5C] text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(255,45,120,0.5)]"
                >
                  🔒 CLAIM TEE
                </button>
              </div>
            </div>
          )}
        </div>
        <GateModal />
      </div>
    );
  }
  // ----------------------------------------------------
  // LAYOUT 3: GLOW EDITORIAL (Default / Glow Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full pb-20 relative bg-gradient-to-br from-[#F6F6F9] via-[#F0F0F4] to-[#E9E9EE] text-gray-900 font-sans min-h-screen overflow-x-hidden selection:bg-fuchsia-200 selection:text-fuchsia-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap');
          
          .glow-theme { font-family: 'Plus Jakarta Sans', sans-serif; }
          .glow-serif { font-family: 'Playfair Display', serif; }
          
          /* Ambient floating orbs */
          .light-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            pointer-events: none;
            animation: floatOrb 30s ease-in-out infinite alternate;
          }
          @keyframes floatOrb {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, -30px) scale(1.08); }
            100% { transform: translate(-20px, 20px) scale(0.95); }
          }
          
          /* Gradient text */
          .text-gradient-glow {
            background: linear-gradient(135deg, #FF3366, #9933FF, #00C3FF);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 6s ease infinite;
          }
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          /* Entrance animations */
          .stagger-fade { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(24px); }
          @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
          
          /* Social bubble hover */
          .social-bubble {
            width: 48px; height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
          }
          .social-bubble:hover {
            transform: scale(1.15) translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          }

          /* Divider line */
          .section-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(153,51,255,0.12) 30%, rgba(153,51,255,0.12) 70%, transparent 100%);
          }

          /* Stat item hover */
          .stat-item { transition: transform 0.3s ease; }
          .stat-item:hover { transform: translateY(-2px); }

          /* Collab card */
          .collab-card {
            background: rgba(255,255,255,0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.9);
            border-radius: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            transition: all 0.4s ease;
          }
          .collab-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(153,51,255,0.1);
          }
        `,
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="light-orb"
          style={{
            top: "-8%",
            left: "-5%",
            width: "450px",
            height: "450px",
            background: "#FF3366",
            opacity: 0.06,
          }}
        />
        <div
          className="light-orb"
          style={{
            top: "40%",
            right: "-8%",
            width: "500px",
            height: "500px",
            background: "#9933FF",
            opacity: 0.05,
            animationDelay: "-8s",
          }}
        />
        <div
          className="light-orb"
          style={{
            bottom: "-5%",
            left: "30%",
            width: "350px",
            height: "350px",
            background: "#00C3FF",
            opacity: 0.06,
            animationDelay: "-15s",
          }}
        />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-5 sm:px-10 pt-6 glow-theme">
        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 1 — THE HERO                            */}
        {/* ════════════════════════════════════════════════ */}
        <section
          className="relative w-full mb-12 stagger-fade"
          style={{ animationDelay: "0s" }}
        >
          {/* Banner */}
          {data.featured_work_url ? (
            <div className="w-full h-48 sm:h-64 rounded-t-[32px] rounded-b-[12px] sm:rounded-b-[24px] overflow-hidden relative shadow-sm">
              <img
                src={getAssetUrl(data.featured_work_url)}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-40 sm:h-56 rounded-[32px] bg-gradient-to-br from-fuchsia-50 via-violet-50 to-cyan-50" />
          )}

          {/* Avatar + Identity */}
          <div className="relative px-4 sm:px-8 flex flex-col items-center sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0 group -mt-16 sm:-mt-24 z-10 mb-4 sm:mb-5">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded-[32px] sm:rounded-[36px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden">
                  {!avatarError && profile.avatar_url ? (
                    <img
                      src={getAssetUrl(profile.avatar_url)}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-bold text-4xl">
                      {profile.display_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 w-7 h-7 rounded-full bg-gradient-to-br from-[#00C3FF] to-[#9933FF] border-[3px] border-[#FAFAFC] shadow-md" />
            </div>

            {/* Name, Tagline, Availability */}
            <div className="text-center sm:text-left w-full">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gradient-glow leading-tight mb-2"
                style={{ paddingBottom: "0.05em" }}
              >
                {profile.display_name}
              </h1>
              {profile.is_verified && (
                <div className="inline-flex mb-2">
                  <VerifiedBadge
                    isVerified={profile.is_verified}
                    accentColor="#9933FF"
                  />
                </div>
              )}
              {data.tagline && (
                <p className="text-sm sm:text-base font-bold text-gray-700 tracking-wide mb-4">
                  {data.tagline}
                </p>
              )}

              {/* Availability Signal */}
              {data.availability_status && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-white/60 mb-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.availability_status === "Open" ? "bg-emerald-400" : data.availability_status === "Selective" ? "bg-amber-400" : "bg-rose-400"}`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${data.availability_status === "Open" ? "bg-emerald-500" : data.availability_status === "Selective" ? "bg-amber-500" : "bg-rose-500"}`}
                    ></span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {data.availability_status}
                  </span>
                  {data.response_time && (
                    <span className="text-xs text-gray-600 font-bold hidden sm:inline">
                      {"\u00b7"} Responds {data.response_time.toLowerCase()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Social Links Row */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 px-4 sm:px-8">
              {data.platforms.map((p) => {
                const platform = p.platform?.toLowerCase();
                const Icon = PLATFORM_ICONS[platform] || Share2;
                const styleClass = brandStyles[platform]
                  ? brandStyles[platform].replace(" text-white", "")
                  : "bg-gray-800";

                return (
                  <a
                    key={p.platform}
                    href={ensureAbsoluteUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () =>
                        trackLinkClick(
                          profile.id,
                          p.platform || "unknown",
                          p.url,
                        ),
                      );
                      if (!isGated)
                        window.open(ensureAbsoluteUrl(p.url), "_blank");
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden group shadow-md bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5"
                    title={`${p.platform}${p.followers ? ` \u00b7 ${p.followers}` : ""}`}
                  >
                    <Icon
                      size={36}
                      className="relative z-10 text-gray-700 group-hover:text-white transition-colors duration-300"
                    />
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${styleClass}`}
                      style={{ zIndex: 0 }}
                    />

                    {isGated && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-20">
                        <Lock size={12} className="text-gray-700" />
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 2 — THE IMPACT STRIP                    */}
        {/* ════════════════════════════════════════════════ */}
        <section
          className="mb-12 stagger-fade"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-wrap justify-center sm:justify-between gap-8 sm:gap-4 text-center w-full max-w-2xl mx-auto">
            {/* Impressions */}
            <div
              className={`stat-item flex-1 min-w-[100px] ${isFreeProfile ? "cursor-pointer" : ""}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <div
                className={`text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 tracking-tight ${isFreeProfile ? "blur-[5px]" : ""}`}
              >
                {isFreeProfile ? "4.2K" : liveViews}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                Impressions
              </div>
            </div>

            {/* Location */}
            <div className="stat-item flex-1 min-w-[100px]">
              <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight truncate max-w-[140px] mx-auto">
                {topCity}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                Base
              </div>
            </div>

            {/* Audience Age */}
            {data.audience_age_group && (
              <div className="stat-item flex-1 min-w-[100px]">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                  {data.audience_age_group}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                  Audience Age
                </div>
              </div>
            )}

            {/* Gender Split */}
            {data.audience_gender_split && (
              <div className="stat-item flex-1 min-w-[100px]">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                  {data.audience_gender_split}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                  Gender Split
                </div>
              </div>
            )}

            {/* Visual Style — shown only if gender split is absent */}
            {data.visual_style && !data.audience_gender_split && (
              <div className="stat-item flex-1 min-w-[100px]">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                  {data.visual_style}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                  Aesthetic
                </div>
              </div>
            )}

            {/* Posting Frequency — shown only if audience_age_group is absent */}
            {data.posting_frequency && !data.audience_age_group && (
              <div className="stat-item flex-1 min-w-[100px]">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                  {data.posting_frequency}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mt-1">
                  Frequency
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 3 — THE STORY & AESTHETIC               */}
        {/* ════════════════════════════════════════════════ */}
        {(profile.bio ||
          data.about ||
          data.content_formats ||
          data.audience_interests ||
          data.visual_style) && (
          <section
            className="mb-12 stagger-fade"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Top row: The Bio Narrative */}
            {(profile.bio || data.about) && (
              <div className="mb-10 text-center max-w-3xl mx-auto">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-purple-500 mb-4 flex items-center justify-center gap-2">
                  <Sparkles size={18} /> Inside the Mind
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  {data.about || profile.bio}
                </p>
              </div>
            )}

            {/* Bottom Grid: The Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Core Focus Card */}
              {data.content_formats && data.content_formats.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/80 shadow-sm flex flex-col min-h-[120px] lg:col-span-2">
                  <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mb-3">
                    Core Focus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.content_formats.map((format: string) => (
                      <span
                        key={format}
                        className="px-4 py-2 bg-gray-50 rounded-2xl text-sm font-bold text-gray-800 border border-gray-100 shadow-sm"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Audience Interests Card */}
              {data.audience_interests &&
                data.audience_interests.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/80 shadow-sm flex flex-col min-h-[120px] lg:col-span-2">
                    <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mb-3">
                      Audience Interests
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.audience_interests.map(
                        (interest: string, i: number) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-gradient-to-br from-fuchsia-50 to-purple-50 text-purple-700 rounded-2xl text-sm font-bold border border-purple-100/60 shadow-sm"
                          >
                            {interest}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Visual Aesthetic Card */}
              {data.visual_style && (
                <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/80 shadow-sm flex flex-col justify-center min-h-[120px] lg:col-span-2">
                  <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mb-1">
                    Visual Aesthetic
                  </div>
                  <div className="text-xl font-extrabold text-gray-900">
                    {data.visual_style}
                  </div>
                  {data.posting_frequency && (
                    <div className="mt-1 text-[11px] text-gray-700 font-bold uppercase tracking-wider">
                      Posts {data.posting_frequency}
                    </div>
                  )}
                </div>
              )}

              {/* Top Audience Location Card */}
              {data.audience_top_location && (
                <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/80 shadow-sm flex flex-col justify-center min-h-[120px] lg:col-span-2">
                  <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700 mb-1">
                    Top Location
                  </div>
                  <div className="text-xl font-extrabold text-gray-900">
                    {data.audience_top_location}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 4 — THE BUSINESS (Collab Prefs)         */}
        {/* ════════════════════════════════════════════════ */}
        {(data.collab_types_tags ||
          data.rate_range_min ||
          data.turnaround_time ||
          data.deliverable_formats) && (
          <section
            className="mb-12 stagger-fade"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-blue-500 mb-10 flex items-center gap-2">
              <Briefcase size={18} /> Work With Me
            </h3>

            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:gap-12">
                {/* Open To */}
                {data.collab_types_tags &&
                  data.collab_types_tags.length > 0 && (
                    <div className="space-y-4 min-w-[200px]">
                      <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700">
                        Open To
                      </div>
                      <div className="space-y-3">
                        {data.collab_types_tags.map(
                          (type: string, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                              <span className="text-[15px] font-bold text-gray-800">
                                {type}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex flex-col gap-10 flex-grow">
                  {/* Rates & Turnaround in a row */}
                  <div className="flex flex-wrap gap-8 sm:gap-10">
                    {(data.rate_range_min || data.rate_range_max) && (
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700">
                          Rates
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                          {"\u20B9"}
                          {data.rate_range_min
                            ? data.rate_range_min.toLocaleString()
                            : "\u2014"}
                          {data.rate_range_max ? (
                            <span className="text-gray-600 font-extrabold">
                              {" "}
                              {"\u2013"} {data.rate_range_max.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-600 font-extrabold">
                              +
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {data.turnaround_time && (
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700">
                          Turnaround
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                          {data.turnaround_time}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deliverables */}
                  {data.deliverable_formats &&
                    data.deliverable_formats.length > 0 && (
                      <div className="space-y-3 mt-2">
                        <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-700">
                          Deliverables
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {data.deliverable_formats.map(
                            (format: string, i: number) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-blue-50/80 text-blue-600 rounded-xl text-sm font-bold border border-blue-100 shadow-sm"
                              >
                                {format}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 5 — THE PROOF (Past Collaborations)     */}
        {/* ════════════════════════════════════════════════ */}
        {data.past_collaborations && data.past_collaborations.length > 0 && (
          <section
            className="mb-12 stagger-fade"
            style={{ animationDelay: "0.35s" }}
          >
            <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-gray-600 mb-10 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" /> Notable
              Collaborations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {data.past_collaborations.map((collab: any, i: number) => (
                <div
                  key={i}
                  className="collab-card p-8 flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 mb-5 flex items-center justify-center overflow-hidden">
                    {collab.logo_url ? (
                      <img
                        src={getAssetUrl(collab.logo_url)}
                        className="w-full h-full object-contain p-2.5 group-hover:scale-110 transition-transform duration-300"
                        alt={collab.brand_name}
                      />
                    ) : (
                      <span className="text-lg font-black text-gray-200">
                        {collab.brand_name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    {collab.brand_name}
                  </h4>
                  <p className="text-[13px] text-gray-700 font-semibold leading-relaxed">
                    {collab.campaign_description}
                  </p>
                  {collab.link && (
                    <a
                      href={collab.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-[0.15em] transition-colors"
                    >
                      View Campaign {"\u2192"}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 6 — THE MASTERPIECES (Gallery)          */}
        {/* ════════════════════════════════════════════════ */}
        {data.works && data.works.length > 0 && (
          <section
            className="mb-12 stagger-fade"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-gray-600 mb-10 flex items-center gap-2">
              <Camera size={18} className="text-pink-500" /> Recent Work
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.works.map((w, i) => {
                const thumb = getThumbnail(w);
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedWork(w)}
                    className="group collab-card overflow-hidden cursor-pointer"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-gray-50">
                      <img
                        src={
                          thumb ||
                          "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800"
                        }
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={w.title}
                      />
                      {w.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                            <Play
                              size={22}
                              className="ml-0.5"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {w.title}
                      </h4>
                      {w.description && (
                        <p className="text-xs text-gray-600 font-semibold mt-1 line-clamp-1">
                          {w.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 7 — LET'S CONNECT (CTA)                */}
        {/* ════════════════════════════════════════════════ */}
        <section
          className="mb-12 stagger-fade text-center"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] max-w-3xl mx-auto">
            <h2 className="glow-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6 italic">
              Let's Create Together
            </h2>

            <div className="inline-flex items-center justify-center gap-2 mb-10 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100/50">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600">
                Collaboration
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
              <span className="text-sm font-bold text-gray-800">
                {data.collab_types ||
                  "Always open to discussing new projects and creative ideas."}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {data.contact_email && (
                <a
                  href={`mailto:${data.contact_email}`}
                  className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
                >
                  Start a Conversation
                </a>
              )}
              {data.contact_whatsapp && (
                <a
                  href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-4 bg-white text-gray-900 text-sm font-bold rounded-full border border-gray-200 hover:border-[#25D366] hover:text-[#25D366] transition-all hover:-translate-y-1"
                >
                  WhatsApp Message
                </a>
              )}
            </div>

            {data.preferred_contact_method && (
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-700">
                    Preferred Reach Out
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs font-bold text-gray-800">
                    {data.preferred_contact_method}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ═══ SELECTED WORK MODAL ═══ */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-white/80 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white p-2 rounded-[28px] max-w-3xl w-full relative shadow-[0_24px_80px_rgba(0,0,0,0.12)] animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedWork(null)}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 p-3 bg-white text-gray-400 hover:text-gray-900 rounded-full shadow-md transition-all hover:scale-110 z-10"
            >
              <X size={18} strokeWidth={3} />
            </button>
            <div className="bg-gray-50 rounded-[22px] overflow-hidden">
              {selectedWork.external_url ? (
                <div className="w-full aspect-video bg-black">
                  <iframe
                    src={getEmbedUrl(selectedWork.external_url)}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : getThumbnail(selectedWork) ? (
                <div className="w-full aspect-video bg-black">
                  <img
                    src={getThumbnail(selectedWork)}
                    className="w-full h-full object-cover"
                    alt={selectedWork.title}
                  />
                </div>
              ) : null}
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  {selectedWork.title}
                </h3>
                {selectedWork.description && (
                  <p className="text-sm text-gray-700 font-semibold leading-relaxed">
                    {selectedWork.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FOMO MODAL ═══ */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-white/80 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-[32px] p-10 max-w-sm w-full shadow-[0_24px_80px_rgba(0,0,0,0.1)] relative text-center animate-zoomIn">
            <button
              onClick={() => setShowFomoModal(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center mx-auto mb-6">
              <Activity size={28} className="text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
              Unlock Insights
            </h3>
            <p className="text-sm text-gray-700 font-semibold mb-8 leading-relaxed">
              Upgrade to full tier to view real-time profile scans and audience
              telemetry.
            </p>
            <button
              onClick={() => (window.location.href = "/#pricing")}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-[11px] uppercase tracking-widest rounded-full transition-all shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
            >
              Claim Tee to Unlock
            </button>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  );
}
