import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { fetchProfile } from "../lib/profile/fetch-profile";
import { ProfileData } from "../types/profile";
import { PersonaRouter } from "../components/profile/PersonaRouter";
import ProfileViewTracker from "../components/analytics/ProfileViewTracker";
import {
  Sparkles,
  X,
  UserPlus,
  Share2,
  ArrowLeft,
  Lock,
  Award,
} from "lucide-react";
import { ProfileCTAs } from "../components/profile/shared/ProfileCTAs";
import { PulseBar } from "../components/profile/shared/PulseBar";
import { VerifiedBadge } from "../components/profile/shared/VerifiedBadge";
import { SocialGrid } from "../components/profile/shared/SocialGrid";
import { ProfileAvatar } from "../components/profile/shared/ProfileAvatar";
import { personaConfigs } from "../config/personaConfig";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getAnalyticsData } from "../lib/analytics/data-source";
import AuthModal from "../components/AuthModal";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showQR, setShowQR] = useState(false);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectForm, setConnectForm] = useState({
    name: "",
    email: "",
    social: "",
    message: "",
  });
  const [connectStatus, setConnectStatus] = useState("");

  // Sanitize display_name — strip accidental username/persona prefix concatenation
  // e.g. "tester_personaTester Persona" → "Tester Persona"
  const safeDisplayName = useMemo(() => {
    if (!profile) return "KnoWMi User";
    const rawName = profile.display_name || "";
    const usernameRaw = profile.username || "";
    const personaRaw = profile.persona || "";

    let cleanDisplayName = rawName;
    if (
      usernameRaw &&
      rawName.toLowerCase().startsWith(usernameRaw.toLowerCase())
    ) {
      cleanDisplayName = rawName.slice(usernameRaw.length).trim();
    } else if (
      personaRaw &&
      rawName.toLowerCase().startsWith(personaRaw.toLowerCase())
    ) {
      cleanDisplayName = rawName.slice(personaRaw.length).trim();
    }
    return cleanDisplayName || rawName || profile.username || "KnoWMi User";
  }, [profile]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      setLoading(true);
      const data = await fetchProfile(username);
      setProfile(data);
      if (data?.id) {
        const analytics = await getAnalyticsData(data.id, "all");
        setStats(analytics);
        setRecentVisitors(analytics.latestActivity || []);
      }
      setLoading(false);
    }
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (profile) {
      document.title = `${safeDisplayName} | KnoWMi`;

      // Update or create meta description
      let descMeta = document.querySelector('meta[name="description"]');
      const descContent =
        profile.bio ||
        `Connect with ${safeDisplayName} on KnoWMi. Check out their verified digital persona and official physical scans.`;
      if (!descMeta) {
        descMeta = document.createElement("meta");
        descMeta.setAttribute("name", "description");
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute("content", descContent);

      // Open Graph / Twitter Card Tags
      const ogTitle = `${safeDisplayName} | KnoWMi`;
      const ogDesc = descContent;
      const ogUrl = window.location.href;
      const ogImage =
        profile.avatar_url || `${window.location.origin}/logo-square.webp`;

      const tags = {
        "og:title": ogTitle,
        "og:description": ogDesc,
        "og:url": ogUrl,
        "og:image": ogImage,
        "og:type": "profile",
        "twitter:card": "summary_large_image",
        "twitter:title": ogTitle,
        "twitter:description": ogDesc,
        "twitter:image": ogImage,
      };

      Object.entries(tags).forEach(([property, value]) => {
        let metaTag =
          document.querySelector(`meta[property="${property}"]`) ||
          document.querySelector(`meta[name="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement("meta");
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute("property", property);
        metaTag.setAttribute("name", property);
        metaTag.setAttribute("content", value);
      });
    }
  }, [profile, safeDisplayName]);

  const isOwnerOfProfile = user && profile && user.id === profile.user_id;
  const isScanner = !isOwnerOfProfile;

  useEffect(() => {
    if (profile && !isOwnerOfProfile) {
      const brandSettings = profile.persona_data?.team_branding;
      if (
        brandSettings?.redirect_mode === "direct_corporate" &&
        brandSettings?.redirect_url
      ) {
        window.location.replace(brandSettings.redirect_url);
      }
    }
  }, [profile, user, isOwnerOfProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <Sparkles className="animate-spin text-[#C1440E]" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        {/* Animated ring */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 rounded-xl border-[3px] border-orange-500 bg-[#1a1a1a] shadow-[6px_6px_0px_#F97316] flex items-center justify-center animate-pulse">
            <Sparkles size={32} className="text-orange-500" />
          </div>
        </div>
        <span className="relative z-10 px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] mb-6">
          Unclaimed Tee
        </span>
        <h1 className="relative z-10 text-4xl font-black mb-4 uppercase tracking-tighter text-white">
          This Tee is Available
        </h1>
        <p className="relative z-10 text-neutral-400 mb-3 max-w-sm leading-relaxed font-bold">
          The account linked to this KnoWMi Tee has been removed. This Tee is
          now free to be claimed.
        </p>
        <p className="relative z-10 text-neutral-500 text-xs mb-10 max-w-xs leading-relaxed font-bold">
          If you own this Tee, sign in and claim it to lock your digital
          identity to it.
        </p>
        <button
          onClick={() => {
            navigate("/?auth=signin");
          }}
          className="relative z-10 px-10 py-5 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[6px_6px_0px_#000] active:scale-95 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Claim Your Tee
        </button>
        <button
          onClick={() => navigate("/")}
          className="relative z-10 mt-6 px-6 py-3 bg-white text-black border-[3px] border-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-xl shadow-[4px_4px_0px_#000]"
        >
          Return to KnoWMi
        </button>
      </div>
    );
  }

  const pAlias = (profile.persona || "").toLowerCase();
  const activeConfig = personaConfigs[pAlias] || personaConfigs.developer;
  const fromSrc = searchParams.get("src");
  const isClaimFlow = searchParams.get("claim") === "true" || !profile.user_id;
  // Apply ghost mode if the profile has it enabled, OR if forced via URL (for testing)
  const isGhostMode =
    (profile?.ghost_mode === true || searchParams.get("ghost") === "true") &&
    !isOwnerOfProfile;
  const fromTab = searchParams.get("from") || "analytics";
  const accentColor = activeConfig?.theme?.accent || "#C1440E";
  const isFreeProfile =
    profile.tier === "Starter" ||
    profile.tier === "Free" ||
    profile.status === "free" ||
    (!profile.status && (!profile.tier || profile.tier === "Starter"));

    // Extract the active identity's data if identities exist
    const identities = profile.persona_data?.identities || [];
    const activeIdentity = identities.find((i: any) => i.active) || identities[0];
    const identityData = activeIdentity?.data || {};

    // Sort platforms in persona_data so youtube is next to instagram
    let modifiedPersonaData = { 
      ...profile.persona_data,
      ...identityData
    };
    if (
    modifiedPersonaData.platforms &&
    Array.isArray(modifiedPersonaData.platforms)
  ) {
    let sortedPlatforms = [...modifiedPersonaData.platforms];
    const instaIdx = sortedPlatforms.findIndex(
      (l: any) => l.platform?.toLowerCase() === "instagram",
    );
    const ytIdx = sortedPlatforms.findIndex(
      (l: any) => l.platform?.toLowerCase() === "youtube",
    );
    if (instaIdx !== -1 && ytIdx !== -1 && ytIdx !== instaIdx + 1) {
      const ytPlatform = sortedPlatforms.splice(ytIdx, 1)[0];
      const newInstaIdx = sortedPlatforms.findIndex(
        (l: any) => l.platform?.toLowerCase() === "instagram",
      );
      sortedPlatforms.splice(newInstaIdx + 1, 0, ytPlatform);
    }
    modifiedPersonaData.platforms = sortedPlatforms;
  }

  const displayProfile = {
    ...profile,
    avatar_url: profile.avatar_url,
    social_links: profile.social_links,
    persona_data: modifiedPersonaData,
    ghost_mode: isGhostMode,
  };

  // In Ghost Mode, blur personal communication apps but allow public showcasing apps
  if (isGhostMode) {
    const communicationApps = ['whatsapp', 'email', 'phone', 'instagram', 'snapchat', 'telegram', 'facebook', 'messenger', 'discord', 'x', 'twitter'];
    
    if (displayProfile.social_links) {
      displayProfile.social_links = displayProfile.social_links.map((link: any) => {
        if (communicationApps.includes((link.platform || "").toLowerCase())) {
          return {
            ...link,
            url: "https://knowmi.co/private-blur",
          };
        }
        return link;
      });
    }
    
    if (displayProfile.persona_data) {
      const pData = { ...displayProfile.persona_data };
      if (pData.platforms) {
        pData.platforms = pData.platforms.map((link: any) => {
          if (communicationApps.includes((link.platform || "").toLowerCase())) {
            return {
              ...link,
              url: "https://knowmi.co/private-blur",
            };
          }
          return link;
        });
      }
      
      // Mask explicit contact fields
      if (pData.contact_email) {
        pData.contact_email = "private-blur@knowmi.co";
      }
      if (pData.contact_whatsapp) {
        pData.contact_whatsapp = "private-blur";
      }
      if (pData.contact_phone) {
        pData.contact_phone = "private-blur";
      }
      if (pData.quick_talk_url) {
        pData.quick_talk_url = "https://knowmi.co/private-blur";
      }
      
      displayProfile.persona_data = pData;
    }
  }

  if (isClaimFlow) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
        <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6 relative z-10 animate-pulse">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-black mb-4 font-display uppercase tracking-tighter text-white relative z-10">
          Unclaimed Tee
        </h1>
        <p className="text-neutral-400 mb-10 max-w-sm leading-relaxed relative z-10">
          You've scanned a fresh, unclaimed KnoWMi physical product. Claim it
          now to lock your digital identity to this item.
        </p>
        <button
          onClick={() => {
            localStorage.setItem("knowmi_pending_claim", profile.id);
            if (user) {
              navigate("/dashboard");
            } else {
              navigate("/?auth=signin");
            }
          }}
          className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/20 active:scale-95 transition-all relative z-10 hover:bg-orange-600"
        >
          Claim This Tee
        </button>
      </div>
    );
  }

  const hasIdentity =
    profile.persona_data?.identities &&
    profile.persona_data.identities.length > 0;

  if (!hasIdentity) {
    if (isOwnerOfProfile) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
          <div className="w-20 h-20 bg-[#1a1a1a] border-[3px] border-white text-orange-500 rounded-xl shadow-[6px_6px_0px_#F97316] flex items-center justify-center mb-6 relative z-10 animate-pulse">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter text-white relative z-10">
            Setup your Identity
          </h1>
          <p className="text-neutral-400 font-bold mb-10 max-w-sm leading-relaxed relative z-10">
            You haven't set up your digital identity yet. Create one now to make
            this profile yours.
          </p>
          <button
            onClick={() => navigate("/dashboard?tab=profile")}
            className="px-10 py-5 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[6px_6px_0px_#000] active:scale-95 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none relative z-10"
          >
            Setup Identity
          </button>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
          <div className="w-20 h-20 bg-[#1a1a1a] text-neutral-400 border-[3px] border-white shadow-[6px_6px_0px_#fff] rounded-xl flex items-center justify-center mb-6 relative z-10">
            <UserPlus size={32} />
          </div>
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter text-white relative z-10">
            Identity Pending
          </h1>
          <p className="text-neutral-400 font-bold mb-10 max-w-sm leading-relaxed relative z-10">
            This user hasn't set up their digital identity yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative z-10"
          >
            Return Home
          </button>
        </div>
      );
    }
  }

  // Legacy safeDisplayName calculations removed

  // Friendly persona label from config
  const customType = profile.persona_data?.type;
  const personaLabel =
    customType && customType.toLowerCase() !== pAlias
      ? customType
      : activeConfig?.name ||
        (profile.persona || "")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const isDarkTheme = true;
  const pageBg = "#0a0a0a";
  const textPrimary = "#FFFFFF";
  const textSecondary = "#a3a3a3";
  const cardBg = "#1a1a1a";
  const borderColor = "#ffffff";
  const headerBg = "#0a0a0a";

  // Mobile View
  if (!isDesktop) {
    return (
      <div
        className={`min-h-screen text-[#1A1A1A] font-sans selection:bg-orange-500/30 pb-12 ${isScanner ? "ghost-protection" : ""} ${isGhostMode ? "ghost-mode-active" : ""}`}
        style={{ background: pageBg, color: textPrimary }}
        onContextMenu={(e) => isScanner && e.preventDefault()}
      >
        <ProfileViewTracker profileId={profile.id} />

        {/* Top Header */}
        <header
          className="fixed top-0 w-full z-[120] border-b-[3px] px-6 py-3 flex justify-between items-center"
          style={{ background: headerBg, borderColor: borderColor }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/logo-square.webp"
              alt="Logo"
              fetchpriority="high"
              loading="eager"
              className="w-6 h-6 rounded-lg object-cover"
              style={{ filter: 'invert(1) hue-rotate(180deg)' }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: textPrimary }}
            >
              {safeDisplayName}
            </span>
          </div>
          {isOwnerOfProfile ? (
            <button
              onClick={() =>
                navigate(
                  fromTab === "studio"
                    ? "/studio"
                    : `/dashboard?tab=${fromTab}`,
                )
              }
              className="px-3 py-1.5 bg-white text-black border-[3px] border-black rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all select-none shrink-0"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <button
              onClick={() =>
                fromSrc === "leaderboard"
                  ? navigate("/leaderboard")
                  : navigate("/")
              }
              className="p-2 bg-white text-black border-[3px] border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all select-none shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </header>

        {/* Brand Banner Header for Redirect Mode option brand_header */}
        {profile.persona_data?.team_branding?.redirect_mode ===
          "brand_header" && (
          <div
            className="mt-16 py-4 px-6 text-center text-white flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-md"
            style={{
              backgroundColor:
                profile.persona_data.team_branding.accent_color || "#F97316",
            }}
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest text-white mb-1.5 border border-white/10 flex items-center gap-1">
              <Award size={10} />{" "}
              {profile.persona_data.team_branding.team_name || "Team Member"}
            </span>
            <p className="text-xs uppercase font-black tracking-widest truncate max-w-full px-4 text-white">
              {profile.persona_data.team_branding.tagline || "Unified Branding"}
            </p>
          </div>
        )}

        {/* Small Button to view QR on Mobile */}
        <div className="pt-20 px-6 flex justify-center mb-6 gap-3">
          {isFreeProfile ? (
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-orange-500 border-[3px] border-orange-500 rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#F97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              🔒 Buy A Tee to Unlock your QR
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black border-[3px] border-white rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                ✦ Tap to view QR
              </button>
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <UserPlus size={16} /> Connect
              </button>
            </>
          )}
        </div>

        {isFreeProfile && (
          <div className="px-6 mb-6">
            <div
              className="w-full p-6 bg-[#1a1a1a] border-[3px] border-orange-500 rounded-xl text-center shadow-[6px_6px_0px_#F97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer group"
              onClick={() => (window.location.href = "/#pricing")}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000]">
                  Standard Tier
                </span>
                <h4
                  className="text-sm font-black uppercase tracking-wide text-white mt-2"
                >
                  Buy a Tee to Unlock QR & Reach
                </h4>
                <p
                  className="text-[11px] leading-relaxed max-w-[240px] font-bold text-neutral-400"
                >
                  Unlock dynamic physical scans, detailed custom themes, and
                  full global connection analytics.
                </p>
                <button className="mt-3 px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black font-black text-[10px] uppercase tracking-widest rounded-lg shadow-[3px_3px_0px_#000] pointer-events-none">
                  Buy a Tee to Unlock 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Mobile Persona Router below */}
        <div className="px-2">
          {profile?.ghost_mode && isOwnerOfProfile && (
            <div className="w-full text-center mt-2 mb-4 animate-fadeIn">
              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Lock size={12} /> Privacy Mode is Active
              </p>
            </div>
          )}
          <PersonaRouter
            profile={displayProfile}
            recentVisitors={recentVisitors}
            stats={stats}
            hideHeader={isDesktop}
          />
        </div>

        {/* QR Overlay Modal */}
        {showQR && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
            <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-sm w-full flex flex-col items-center relative border-[3px] border-white shadow-[8px_8px_0px_#F97316] text-white">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white border-[2px] border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-6 mt-2">
                <img
                  src="/logo-square.webp"
                  fetchpriority="high"
                  loading="eager"
                  className="w-6 h-6 object-cover rounded"
                  style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                  alt="KW"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Identity Protocol
                </span>
              </div>

              {isFreeProfile ? (
                <div
                  className="w-52 h-52 bg-[#0a0a0a] border-[3px] border-orange-500 rounded-xl flex flex-col items-center justify-center p-4 text-center mb-6 relative overflow-hidden shadow-[6px_6px_0px_#F97316] cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
                  onClick={() => (window.location.href = "/#pricing")}
                >
                  <Lock
                    size={28}
                    className="text-orange-500 mb-2 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold mt-1 text-white uppercase tracking-wider">
                    Buy a Tee to Unlock QR
                  </p>
                  <button className="mt-4 px-4 py-2 bg-orange-500 text-black border-[3px] border-black font-black text-[10px] uppercase tracking-widest rounded-lg shadow-[3px_3px_0px_#000] pointer-events-none">
                    Upgrade 🚀
                  </button>
                </div>
              ) : (
                <div
                  className="w-52 h-52 p-2 bg-white border-[4px] border-orange-500 shadow-[6px_6px_0px_#F97316] rounded-xl mb-6 flex items-center justify-center relative"
                >
                  <div className="w-full h-full bg-white overflow-hidden relative flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`}
                      className="w-full h-full object-contain pointer-events-none select-none mix-blend-multiply"
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      fetchpriority="high"
                      loading="eager"
                      alt="QR Code"
                    />
                    <div className="absolute inset-0 z-10" />
                    <div className="absolute inset-0 m-auto w-10 h-10 bg-black border-[3px] border-yellow-500 rounded-xl flex items-center justify-center z-20 select-none overflow-hidden">
                      <img
                        src="/favicon.png"
                        fetchpriority="high"
                        loading="eager"
                        className="w-full h-full object-contain p-1"
                        style={{ filter: 'invert(1) hue-rotate(216deg)' }}
                        alt="KnoWMi Logo"
                      />
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-xl font-black tracking-tight mb-1 text-center font-display text-[#1A1A1A]">
                {profile.display_name}
              </h3>
              <p className="text-[10px] font-bold text-[#5C5246] uppercase tracking-widest text-center">
                {profile.member_id}
              </p>
              {profile.is_verified && (
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                  ✦ Founding Member
                </p>
              )}
            </div>
          </div>
        )}

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 z-[100] bg-[#1A1A1A]/60 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
            <div className="bg-white p-8 rounded-[32px] w-full max-w-[320px] shadow-2xl relative">
              <button
                onClick={() => setShowConnectModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900"
              >
                <X size={16} />
              </button>
              <h3 className="text-xl font-black font-display text-neutral-900 mb-2">
                Leave your Card
              </h3>
              <p className="text-xs text-neutral-500 mb-6 font-medium">
                Connect with {safeDisplayName}. They will see your details in
                their dashboard.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={connectForm.name}
                  onChange={(e) =>
                    setConnectForm({ ...connectForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 outline-none focus:border-[#C1440E]"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={connectForm.email}
                  onChange={(e) =>
                    setConnectForm({ ...connectForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 outline-none focus:border-[#C1440E]"
                />
                <input
                  type="text"
                  placeholder="Instagram/LinkedIn Handle"
                  value={connectForm.social}
                  onChange={(e) =>
                    setConnectForm({ ...connectForm, social: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 outline-none focus:border-[#C1440E]"
                />
                <textarea
                  placeholder="Message (optional)"
                  value={connectForm.message}
                  onChange={(e) =>
                    setConnectForm({ ...connectForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 outline-none focus:border-[#C1440E] resize-none h-20"
                />

                {connectStatus === "success" && (
                  <p className="text-emerald-500 text-xs font-bold text-center">
                    Connection sent!
                  </p>
                )}
                {connectStatus === "error" && (
                  <p className="text-red-500 text-xs font-bold text-center">
                    Failed to send.
                  </p>
                )}

                <button
                  onClick={async () => {
                    if (!connectForm.name || !connectForm.email) return;
                    setConnectStatus("sending");
                    const { error } = await supabase
                      .from("network_connections")
                      .insert({
                        profile_id: profile.id,
                        visitor_name: connectForm.name,
                        visitor_email: connectForm.email,
                        visitor_social: connectForm.social,
                        visitor_message: connectForm.message,
                      });
                    if (error) setConnectStatus("error");
                    else {
                      setConnectStatus("success");
                      setTimeout(() => setShowConnectModal(false), 2000);
                    }
                  }}
                  className="w-full py-3 bg-[#C1440E] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#A0350B]"
                >
                  {connectStatus === "sending"
                    ? "Sending..."
                    : "Send Connection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans selection:bg-orange-500/30 ${isScanner ? "ghost-protection" : ""} ${isGhostMode ? "ghost-mode-active" : ""}`}
      style={{ background: pageBg, color: textPrimary }}
      onContextMenu={(e) => isScanner && e.preventDefault()}
    >
      <ProfileViewTracker profileId={profile.id} />

      <header
        className="fixed top-0 w-full z-[120] border-b-[3px] border-white px-8 py-4"
        style={{ background: headerBg, borderColor: borderColor }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo-square.webp"
              alt="Logo"
              className="w-8 h-8 rounded-lg object-cover"
              style={{ filter: 'invert(1) hue-rotate(180deg)' }}
            />
            <span
              className="text-xs font-black uppercase tracking-[0.3em] opacity-40"
              style={{ color: textPrimary }}
            >
              {safeDisplayName}'s Profile
            </span>
          </div>
          {isOwnerOfProfile ? (
            <button
              onClick={() =>
                navigate(
                  fromTab === "studio"
                    ? "/studio"
                    : `/dashboard?tab=${fromTab}`,
                )
              }
              className="px-4 py-2 bg-white text-black border-[3px] border-black rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all select-none shrink-0"
            >
              <ArrowLeft size={16} />{" "}
              {fromTab === "studio" ? "Back to Setup" : "Back to Dashboard"}
            </button>
          ) : (
            <button
              onClick={() =>
                fromSrc === "leaderboard"
                  ? navigate("/leaderboard")
                  : navigate("/")
              }
              className="p-2 bg-white text-black border-[3px] border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all select-none shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-28 pb-12 px-4 sm:px-8">
        {/* Brand Banner Header for Redirect Mode option brand_header */}
        {profile.persona_data?.team_branding?.redirect_mode ===
          "brand_header" && (
          <div
            className="mb-8 py-5 px-8 rounded-3xl text-center text-white flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-xl shadow-neutral-100/50"
            style={{
              backgroundColor:
                profile.persona_data.team_branding.accent_color || "#F97316",
            }}
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-white mb-2 border border-white/10 flex items-center gap-1.5">
              <Award size={12} />{" "}
              {profile.persona_data.team_branding.team_name || "Team Member"}
            </span>
            <p className="text-sm uppercase font-black tracking-widest truncate max-w-full px-4 text-white">
              {profile.persona_data.team_branding.tagline || "Unified Branding"}
            </p>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">
          {/* Left Column - Fixed Identity Card */}
          <div className="w-[380px] shrink-0 sticky top-28">
            <div
              className="rounded-[24px] p-10 shadow-2xl flex flex-col items-center border"
              style={{
                background: cardBg,
                borderColor: borderColor,
                color: textPrimary,
              }}
            >
              <div
                className="relative mb-8 group cursor-pointer flex flex-col items-center"
                onClick={() => setShowQR(!showQR)}
              >
                <div
                  className={`w-48 h-48 p-2 bg-white border-[4px] border-orange-500 shadow-[6px_6px_0px_#F97316] transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${showQR ? "rounded-xl" : "rounded-[24px]"}`}
                >
                  <div
                    className={`w-full h-full bg-[#1a1a1a] overflow-hidden relative flex items-center justify-center ${showQR ? "rounded-xl" : "rounded-[16px]"}`}
                  >
                    {showQR ? (
                      isFreeProfile ? (
                        <div
                          className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center relative rounded-[10px] overflow-hidden animate-fadeIn select-none pointer-events-auto border-[3px] border-orange-500 cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = "/#pricing";
                          }}
                        >
                          <Lock
                            size={28}
                            className="text-orange-500 mb-2 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            Locked
                          </span>
                          <p className="text-[11px] font-bold mt-1 text-white uppercase tracking-wider">
                            Buy a Tee to Unlock QR
                          </p>
                          <button className="mt-4 px-4 py-2 bg-orange-500 text-black border-[3px] border-black font-black text-[10px] uppercase tracking-widest rounded-lg shadow-[3px_3px_0px_#000] z-20 relative pointer-events-none">
                            Upgrade 🚀
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-white flex items-center justify-center relative p-2 select-none animate-fadeIn rounded-none">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`}
                            className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            fetchpriority="high"
                            loading="eager"
                            alt="QR Code"
                          />
                          <div className="absolute inset-0 z-10" />
                          <div className="absolute inset-0 m-auto w-10 h-10 bg-black border-[3px] border-yellow-500 rounded-xl flex items-center justify-center z-20 select-none overflow-hidden">
                            <img
                              src="/favicon.png"
                              fetchpriority="high"
                              loading="eager"
                              className="w-full h-full object-contain p-1"
                              style={{ filter: 'invert(1) hue-rotate(216deg)' }}
                              alt="KnoWMi Logo"
                            />
                          </div>
                        </div>
                      )
                    ) : (
                      <ProfileAvatar
                        src={displayProfile.avatar_url}
                        name={safeDisplayName}
                        size={176}
                        shape="circle"
                        className="select-none animate-fadeIn"
                        priorityLoad={true}
                      />
                    )}
                  </div>
                </div>
                {!showQR && (
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1a1a1a] border-[3px] border-white shadow-[3px_3px_0px_#fff] rounded-[12px] flex items-center justify-center pointer-events-none">
                    <VerifiedBadge
                      isVerified={profile.is_verified}
                      accentColor={accentColor}
                    />
                  </div>
                )}
                <div className="absolute -bottom-4 bg-white text-black border-[3px] border-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg pointer-events-none shadow-[3px_3px_0px_#000] flex items-center gap-1 select-none animate-slideUp">
                  {showQR ? "↺ Tap for Photo" : "✦ Tap for QR"}
                </div>
              </div>

              <h1
                className="text-4xl font-black tracking-tight mb-2 text-center"
                style={{ color: textPrimary }}
              >
                {safeDisplayName}
              </h1>
              <div className="flex flex-col items-center mb-6">
                <p
                  className="text-xs font-black uppercase tracking-[0.2em] opacity-30 text-[#1A1A1A]"
                  style={{ color: textPrimary }}
                >
                  {profile.member_id}
                </p>
                {profile.is_verified && (
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5">
                    ✦ Founding Member
                  </p>
                )}
              </div>

              <div
                className="px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-8"
                style={{ background: `${accentColor}15`, color: accentColor }}
              >
                {personaLabel} Persona
              </div>

              <p
                className="text-sm text-center leading-relaxed mb-10 italic"
                style={{ color: textPrimary, opacity: 0.8 }}
              >
                "{profile.bio || "Creating digital value."}"
              </p>

              <ProfileCTAs profile={displayProfile} accentColor={accentColor} />

              <div className="w-full mt-6 flex justify-center">
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full justify-center"
                >
                  <UserPlus size={16} /> Leave Your Card
                </button>
              </div>

              <div
                className="w-full mt-10"
              >
                <SocialGrid
                  links={displayProfile.social_links}
                  style="row"
                  profileId={profile.id}
                  isGhostMode={isGhostMode}
                />
              </div>

              {profile.ghost_mode && (
                <div className="w-full text-center mt-4 mb-2 animate-fadeIn">
                  <p className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    isOwnerOfProfile 
                      ? 'border-orange-500/20 bg-orange-500/5 text-orange-500' 
                      : 'border-red-500/20 bg-red-500/5 text-red-500'
                  }`}>
                    <Lock size={12} /> {isOwnerOfProfile ? "Privacy Mode is Active" : "Private Mode activated by Owner"}
                  </p>
                </div>
              )}

              <div className="w-full mt-10">
                <PulseBar
                  pulse={profile.pulse}
                  tier={profile.tier}
                  accentColor={accentColor}
                />
              </div>

              {isFreeProfile && (
                <div className="w-full mt-8">
                  <div
                    className="w-full p-6 bg-[#1a1a1a] border-[3px] border-orange-500 rounded-xl text-center shadow-[6px_6px_0px_#F97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer group"
                    onClick={() => (window.location.href = "/#pricing")}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000]">
                        Standard Tier
                      </span>
                      <h4
                        className="text-sm font-black uppercase tracking-wide text-white mt-2"
                      >
                        Buy a Tee to Unlock QR & Reach
                      </h4>
                      <p
                        className="text-[11px] leading-relaxed max-w-[240px] font-bold text-neutral-400"
                      >
                        Unlock dynamic physical scans, detailed custom themes, and
                        full global connection analytics.
                      </p>
                      <button className="mt-3 px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black font-black text-[10px] uppercase tracking-widest rounded-lg shadow-[3px_3px_0px_#000] pointer-events-none">
                        Buy a Tee to Unlock 🚀
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex-1 max-w-[680px] min-h-[600px] rounded-xl overflow-hidden shadow-[8px_8px_0px_#fff] p-6 border-[4px] border-white"
            style={{ background: cardBg }}
          >
            <PersonaRouter
              profile={displayProfile}
              recentVisitors={recentVisitors}
              stats={stats}
              hideHeader={isDesktop}
            />
          </div>
        </div>
      </main>

      <footer
        className="max-w-7xl mx-auto px-8 py-12 border-t flex justify-between items-center opacity-40"
        style={{ borderColor: borderColor }}
      >
        <p
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: textPrimary }}
        >
          © 2024 KnoWMi Identity Protocol
        </p>
        <div
          className="flex gap-6 text-[10px] font-black uppercase tracking-widest"
          style={{ color: textPrimary }}
        >
          <span>Privacy</span>
          <span>Terms</span>
          <span>Protocol</span>
        </div>
      </footer>

      {/* Floating Visitor CTA Pill */}
      {(!user || user?.id !== profile?.user_id) && !isClaimFlow && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4 animate-slideUp">
          <div
            onClick={() => (window.location.href = !user ? "/?auth=signup" : "/dashboard")}
            className="bg-[#1a1a1a] border-[3px] border-white p-3.5 rounded-xl shadow-[4px_4px_0px_#F97316] flex items-center justify-between gap-4 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border-[2px] border-black flex items-center justify-center text-xl animate-pulse shadow-[2px_2px_0px_#000]">
                👕
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">
                  Powered by KnoWMi
                </p>
                <p className="text-xs font-black text-white tracking-widest uppercase">
                  Claim Your Tee
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500 border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:bg-white transition-colors">
              <ArrowLeft size={14} className="rotate-180" />
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal for Desktop */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
          <div className="bg-[#1a1a1a] p-8 border-[3px] border-white shadow-[8px_8px_0px_#F97316] rounded-xl w-full max-w-[400px] relative text-white">
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-white border-[2px] border-black text-black font-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">
              Leave your Card
            </h3>
            <p className="text-xs text-neutral-400 mb-6 font-bold">
              Connect with {safeDisplayName}. They will see your details in
              their dashboard.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={connectForm.name}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border-[3px] border-white rounded-lg text-sm text-white font-bold outline-none placeholder:text-neutral-500 shadow-[4px_4px_0px_#fff]"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={connectForm.email}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border-[3px] border-white rounded-lg text-sm text-white font-bold outline-none placeholder:text-neutral-500 shadow-[4px_4px_0px_#fff]"
              />
              <input
                type="text"
                placeholder="Instagram/LinkedIn Handle"
                value={connectForm.social}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, social: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border-[3px] border-white rounded-lg text-sm text-white font-bold outline-none placeholder:text-neutral-500 shadow-[4px_4px_0px_#fff]"
              />
              <textarea
                placeholder="Message (optional)"
                value={connectForm.message}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border-[3px] border-white rounded-lg text-sm text-white font-bold outline-none placeholder:text-neutral-500 shadow-[4px_4px_0px_#fff] resize-none h-24"
              />

              {connectStatus === "success" && (
                <p className="text-emerald-500 text-xs font-bold text-center">
                  Connection sent!
                </p>
              )}
              {connectStatus === "error" && (
                <p className="text-red-500 text-xs font-bold text-center">
                  Failed to send.
                </p>
              )}

              <button
                onClick={async () => {
                  if (!connectForm.name || !connectForm.email) return;
                  setConnectStatus("sending");
                  const { error } = await supabase
                    .from("network_connections")
                    .insert({
                      profile_id: profile.id,
                      visitor_name: connectForm.name,
                      visitor_email: connectForm.email,
                      visitor_social: connectForm.social,
                      visitor_message: connectForm.message,
                    });
                  if (error) setConnectStatus("error");
                  else {
                    setConnectStatus("success");
                    setTimeout(() => setShowConnectModal(false), 2000);
                  }
                }}
                className="w-full py-4 mt-2 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {connectStatus === "sending" ? "Sending..." : "Send Connection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
