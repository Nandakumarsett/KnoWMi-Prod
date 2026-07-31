import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { posthog } from "../lib/posthog";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Globe,
  Trash2,
  Layout,
  Info,
  Rocket,
  Trophy,
  Save,
  Link as LinkIcon,
  Camera,
  Target,
  User,
  ShieldCheck,
  Eye,
  Code2,
  GraduationCap,
  ChevronRight,
  Zap,
  Github,
  Linkedin,
  Mail,
  Calendar,
  MapPin,
  Star,
  X,
} from "lucide-react";
import { PersonaRouter } from "../components/profile/PersonaRouter";
import { useAuth } from "../context/AuthContext";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";
import { computeCompletionScore } from "../lib/identity/completion-score";
import { TagInput } from "../components/identity/TagInput";
import { EmojiPicker } from "../components/identity/EmojiPicker";
import { personaConfigs } from "../config/personaConfig";
import Avatar from "../components/Avatar";

// Import Persona forms for 100% parity
import { DeveloperForm } from "../components/identity/forms/DeveloperForm";
import { StudentForm } from "../components/identity/forms/StudentForm";
import { CreatorForm } from "../components/identity/forms/CreatorForm";

// --- STYLES ---

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .studio-page {
    font-family: 'Inter', sans-serif;
    background-color: #0a0a0a;
    color: #ffffff;
    min-height: 100vh;
  }
  
  .font-display { font-family: 'Montserrat', sans-serif; text-transform: uppercase; }
  
  .glass-card {
    background: #1a1a1a;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #fff;
    border: 2px solid #fff;
    transition: all 0.2s ease;
  }
  
  .glass-card:hover {
    box-shadow: 2px 2px 0px #fff;
    transform: translate(1px, 1px);
  }

  .input-field {
    width: 100%;
    padding: 10px 14px;
    background: #0a0a0a;
    border: 2px solid #333;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    outline: none;
    color: white;
    box-shadow: 2px 2px 0px #333;
  }
  
  .input-field:focus {
    border-color: #F97316;
    background: #0a0a0a;
    box-shadow: 2px 2px 0px #F97316;
  }

  .section-label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #a3a3a3;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 2px solid #262626;
    padding-bottom: 4px;
  }

  .chip {
    padding: 6px 14px;
    background: #1a1a1a;
    border: 2px solid #404040;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    text-transform: uppercase;
    box-shadow: 2px 2px 0px #404040;
  }

  .chip:hover {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .chip.active {
    background: #F97316;
    color: black;
    border-color: #000;
    box-shadow: 2px 2px 0px #000;
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
    border-radius: 4px;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px #000;
  }

  .status-badge.completed { background: #34d399; color: #000; }
  .status-badge.missing { background: #F97316; color: #000; }

  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Overrides for mobile replica inside studio preview */
  .studio-preview-wrapper .min-h-screen {
    min-height: 100% !important;
    padding-top: 2rem !important; /* Make room for the notch bezel */
  }
  /* Disable cursor pointer-events for navigation links in preview */
  .studio-preview-wrapper a,
  .studio-preview-wrapper button {
    pointer-events: none !important;
  }
  /* Allow scroll gestures on child items */
  .studio-preview-wrapper * {
    pointer-events: auto;
  }
`;

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
  other: LinkIcon,
};

const PERSONA_CONFIG: Record<string, any> = {
  creator: {
    label: "Content Creator",
    emoji: "🎬",
    color: "#F97316",
    icon: Sparkles,
  },
  developer: { label: "Tech", emoji: "💻", color: "#3B82F6", icon: Code2 },
  student: {
    label: "Student",
    emoji: "🎓",
    color: "#10B981",
    icon: GraduationCap,
  },
};

const isCreatorPersona = (p?: string) => {
  if (!p) return false;
  const lower = p.toLowerCase();
  return lower.includes("creator") || ["influencer", "gamer", "fitness"].includes(lower);
};

const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  bio: "",
  tagline: "",
  location: "",
  website: "",
  instagram: "",
  linkedin: "",
  github: "",
  twitter: "",
  youtube: "",
  threads: "",
  behance: "",
  dribbble: "",
  medium: "",
  twitch: "",
  whatsapp: "",
  est_year: "",
  avatar_url: "",
  skills: [],
  achievements: [],
  projects: [],
  works: [],
  platforms: [],
  collab_info: "",
  niche: "",
  total_reach: "",
  avg_engagement: "",
  profile_theme: "default",
};

// A premium isolated iframe container to simulate a real mobile viewport width (350px)
// This ensures that CSS @media queries evaluate correctly for mobile view, aligning everything exactly like a real phone.
function MobilePreviewFrame({ children }: { children: React.ReactNode }) {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!iframeRef) return;
    const doc = iframeRef.contentDocument || iframeRef.contentWindow?.document;
    if (!doc) return;

    // Set document meta and base styles
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mobile Preview</title>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background-color: #0D1117;
              overflow-x: hidden;
              overflow-y: auto;
            }
            /* Custom thin scrollbar inside iframe */
            ::-webkit-scrollbar {
              width: 4px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            
            /* Bezel notch buffer */
            .min-h-screen {
              min-height: 100% !important;
              padding-top: 2.2rem !important;
            }
            /* Disable pointers for preview interaction safety */
            a, button {
              pointer-events: none !important;
            }
            * {
              pointer-events: auto;
            }
          </style>
        </head>
        <body>
          <div id="preview-root" style="width: 100%; height: 100%;"></div>
        </body>
      </html>
    `);
    doc.close();

    // Copy all parent document styles into iframe document
    const head = doc.head;
    const parentStyles = document.querySelectorAll('link[rel="stylesheet"], style');
    parentStyles.forEach((style) => {
      head.appendChild(style.cloneNode(true));
    });

    setMounted(true);
  }, [iframeRef]);

  const previewRoot = iframeRef?.contentDocument?.getElementById("preview-root");

  return (
    <iframe
      ref={setIframeRef}
      className="w-full h-full border-none bg-transparent"
      title="Mobile Live Preview"
    >
      {mounted && previewRoot && createPortal(children, previewRoot)}
    </iframe>
  );
}

export default function IdentityStudio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshProfile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activePersona, setActivePersona] = useState(() => {
    const p = searchParams.get("persona");
    if (!p) return "";
    return ["tech", "dev", "developer"].includes(p.toLowerCase())
      ? "developer"
      : p.toLowerCase();
  });
  const [data, setData] = useState<any>({ ...INITIAL_STATE });
  const [showDetailed, setShowDetailed] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        const { data: prof, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;

        if (prof) {
          setProfile(prof);
          const identities = prof.persona_data?.identities || [];
          let personaType = searchParams.get("persona");
          let editId = searchParams.get("edit");
          const isNewMode = searchParams.get("mode") === "new";

          if (!personaType && !editId && !isNewMode && identities.length > 0) {
            // Default to the active or first identity to prevent losing place when switching tabs
            const activeIden =
              identities.find((i: any) => i.active) || identities[0];
            personaType = activeIden.persona_type;
            editId = activeIden.id;
            setActivePersona(personaType || "");
            navigate(`/studio?persona=${personaType}&edit=${editId}`, {
              replace: true,
            });
          } else {
            setActivePersona(personaType || "");
          }

          const personaIden = editId
            ? identities.find((i: any) => i.id === editId)
            : identities.find((i: any) => i.persona_type === personaType);

          const coreData = {
            first_name: prof.first_name || "",
            last_name: prof.last_name || "",
            bio: personaIden?.bio || personaIden?.data?.bio || "",
            instagram: personaIden?.data?.instagram || "",
            linkedin: personaIden?.data?.linkedin || "",
            github: personaIden?.data?.github || "",
            youtube: personaIden?.data?.youtube || "",
            twitter: personaIden?.data?.twitter || "",
            tiktok: personaIden?.data?.tiktok || "",
            twitch: personaIden?.data?.twitch || "",
            whatsapp: personaIden?.data?.whatsapp || "",
            avatar_url:
              personaIden?.avatar_url || personaIden?.data?.avatar_url || "",
          };

          if (personaIden) {
            const hasDetailed = 
              (personaIden.data?.skills && personaIden.data.skills.length > 0) || 
              (personaIden.data?.projects && personaIden.data.projects.length > 0) ||
              (personaIden.data?.experience && personaIden.data.experience.length > 0) ||
              (personaIden.data?.education && personaIden.data.education.length > 0) ||
              (personaIden.data?.custom_links && personaIden.data.custom_links.length > 0);
            
            const hasAchievements = personaIden.data?.achievements && personaIden.data.achievements.length > 0;
            
            setShowDetailed(!!hasDetailed);
            setShowAchievements(!!hasAchievements);

            setData((prev: any) => {
              const baseData = {
                ...prev,
                ...coreData,
                ...(personaIden.data || {}),
              };
              try {
                const draft = sessionStorage.getItem(
                  `draft_persona_${personaType || ""}`,
                );
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            });
          } else if (searchParams.get("mode") === "new") {
            // FRESH DATA for new identities - explicitly empty bio/socials/avatar
            setData((prev: any) => {
              const baseData = {
                ...INITIAL_STATE,
                first_name: prof.first_name || "",
                last_name: prof.last_name || "",
                avatar_url: "",
              };
              try {
                const draft = sessionStorage.getItem(
                  `draft_persona_${personaType || ""}`,
                );
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            });
          } else {
            // Default fresh state for undefined personas
            setData((prev: any) => {
              const baseData = {
                ...INITIAL_STATE,
                first_name: prof.first_name || "",
                last_name: prof.last_name || "",
              };
              try {
                const draft = sessionStorage.getItem(
                  `draft_persona_${personaType || ""}`,
                );
                if (draft) return { ...baseData, ...JSON.parse(draft) };
              } catch (e) {}
              return baseData;
            });
          }
        }
      } catch (err) {
        // silently fail in production
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // Auto-save draft changes to sessionStorage
  useEffect(() => {
    if (activePersona && data && Object.keys(data).length > 0) {
      // Don't save empty initialization state as draft
      if (
        data.first_name !== "" ||
        data.last_name !== "" ||
        data.bio !== "" ||
        data.tagline !== "" ||
        data.about ||
        data.tech_stack
      ) {
        sessionStorage.setItem(
          `draft_persona_${activePersona}`,
          JSON.stringify(data),
        );
      }
    }
  }, [data, activePersona]);

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file || file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    if (!user?.id) {
      toast.error("Please log in to upload an image");
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const maskedUrl = `/content/avatars/${filePath}`;
      updateField("avatar_url", maskedUrl);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: string,
  ): Promise<string | null> => {
    if (!file || file.size > 50 * 1024 * 1024) {
      toast.error("File must be less than 50MB");
      return null;
    }
    if (!user?.id) {
      toast.error("Please log in to upload a file");
      return null;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${type}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const maskedUrl = `/content/avatars/${filePath}`;

      // Update top level fields if not a work/project media
      if (
        !type.startsWith("work_media_") &&
        !type.includes("_project_media_")
      ) {
        updateField(type, maskedUrl);
      }

      return maskedUrl;
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAutoFill = (url: string) => {
    if (!url) return;
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.split("/").filter(Boolean);

      if (parsedUrl.hostname.includes("instagram.com") && path[0]) {
        updateField("instagram", url);
        const handle = path[0].replace(/[_.]/g, " ");
        if (!data.first_name) {
          updateField(
            "first_name",
            handle.charAt(0).toUpperCase() + handle.slice(1),
          );
        }
        toast.success("✨ Instagram connected and details pre-filled!");
      } else if (
        parsedUrl.hostname.includes("linkedin.com") &&
        path[0] === "in" &&
        path[1]
      ) {
        updateField("linkedin", url);
        const handle = path[1].replace(/[-_]/g, " ").split(" ");
        if (!data.first_name && handle[0]) {
          updateField(
            "first_name",
            handle[0].charAt(0).toUpperCase() + handle[0].slice(1),
          );
        }
        if (!data.last_name && handle[1]) {
          updateField(
            "last_name",
            handle[1].charAt(0).toUpperCase() + handle[1].slice(1),
          );
        }
        toast.success("✨ LinkedIn connected and details pre-filled!");
      } else {
        toast.error("Please paste a valid Instagram or LinkedIn profile URL.");
      }
    } catch (e) {
      toast.error("Invalid URL format.");
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }

    setSaving(true);

    try {
      const currentIdentities = profile?.persona_data?.identities || [];
      const editId = searchParams.get("edit");

      const activeIdx = editId
        ? currentIdentities.findIndex((i: any) => i.id === editId)
        : currentIdentities.findIndex(
            (i: any) => i.persona_type === activePersona,
          );

      const identityUpdate = {
        id:
          activeIdx >= 0
            ? currentIdentities[activeIdx].id
            : editId || `id_${Date.now()}`,
        persona_type: activePersona,
        avatar_url: data.avatar_url || "",
        first_name: data.first_name || profile?.first_name,
        last_name: data.last_name || profile?.last_name,
        bio: data.bio || "",
        active: true,
        data: { ...data, bio: data.bio || "" },
      };

      const newIdentities = currentIdentities.map((i: any) => ({
        ...i,
        active: false,
      }));
      if (activeIdx >= 0) {
        newIdentities[activeIdx] = identityUpdate;
      } else {
        newIdentities.push(identityUpdate);
      }

      const legacySync: any = {};
      if (data.instagram) legacySync.instagram_url = data.instagram;
      if (data.linkedin) legacySync.linkedin_url = data.linkedin;
      if (data.github) legacySync.github_url = data.github;
      if (data.youtube) legacySync.youtube_url = data.youtube;
      if (data.twitter) legacySync.twitter_url = data.twitter;
      if (data.tiktok) legacySync.tiktok_url = data.tiktok;
      if (data.twitch) legacySync.twitch_url = data.twitch;

      const { error } = await supabase
        .from("profiles")
        .update({
          persona_type: activePersona,
          avatar_url: identityUpdate.avatar_url,
          persona_data: {
            ...(profile?.persona_data || {}),
            identities: newIdentities,
          },
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
          profile_theme: data.profile_theme || "default",
        })
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to save: " + error.message);
        return;
      }

      setProfile({
        ...profile,
        persona: activePersona,
        persona_type: activePersona,
        profile_theme: data.profile_theme || "default",
        persona_data: {
          ...(profile?.persona_data || {}),
          identities: newIdentities,
        },
      });
      sessionStorage.removeItem(`draft_persona_${activePersona}`);
      toast.success("Changes saved successfully! 🎉");
      try {
        posthog.capture("Save Persona Theme", {
          persona_type: activePersona,
          profile_theme: data.profile_theme || "default",
          completion_score: score
        });
      } catch (_) {}
      // Refresh global profile state instead of hard reload
      if (refreshProfile) refreshProfile();
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const { score, incomplete } = useMemo(
    () => computeCompletionScore(activePersona || "creator", data),
    [activePersona, data],
  );

  const previewProfile = useMemo(() => {
    const fn = (data.first_name || '').trim();
    const ln = (data.last_name || '').trim();
    
    const social_links = [
      { platform: 'instagram', url: data.instagram ? `https://instagram.com/${data.instagram.replace(/^@/, '')}` : '' },
      { platform: 'linkedin', url: data.linkedin ? (data.linkedin.includes('linkedin.com') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`) : '' },
      { platform: 'github', url: data.github ? (data.github.includes('github.com') ? data.github : `https://github.com/${data.github}`) : '' },
      { platform: 'twitter', url: data.twitter ? (data.twitter.includes('twitter.com') ? data.twitter : `https://twitter.com/${data.twitter}`) : '' },
      { platform: 'youtube', url: data.youtube ? (data.youtube.includes('youtube.com') ? data.youtube : `https://youtube.com/${data.youtube}`) : '' },
      { platform: 'website', url: data.website || '' },
      { platform: 'whatsapp', url: data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : '' }
    ].filter(link => link.url);

    return {
      id: profile?.id || 'preview-id',
      user_id: profile?.user_id || null,
      username: fn.toLowerCase() || 'preview',
      display_name: fn && ln ? `${fn} ${ln}` : (fn || ln || 'Your Name'),
      first_name: fn,
      last_name: ln,
      avatar_url: data.avatar_url,
      member_id: profile?.wm_code || 'WM-PREVIEW-001',
      persona: activePersona,
      mood: data.mood || 'Expressive & Curious',
      bio: data.bio || '',
      pulse: score || 20,
      tier: profile?.status === 'paid' ? 'Creator' : 'Starter',
      status: profile?.status || 'free',
      is_verified: profile?.is_verified ?? false,
      joined_at: profile?.created_at || new Date().toISOString(),
      views: 0,
      top_location: 'India',
      ghost_mode: false,
      profile_theme: data.profile_theme || 'default',
      social_links,
      persona_data: {
        ...data,
        identities: [
          {
            active: true,
            persona_type: activePersona,
            first_name: fn,
            last_name: ln,
            avatar_url: data.avatar_url,
            bio: data.bio,
            data: { ...data }
          }
        ],
        [activePersona]: { ...data }
      }
    };
  }, [data, activePersona, profile, score]);

  const activeConfig = useMemo(() => {
    const persona = (activePersona || "creator").toLowerCase();
    if (["tech", "dev", "developer"].includes(persona)) return personaConfigs["developer"];
    if (isCreatorPersona(persona)) return personaConfigs["creator"];
    return personaConfigs[persona] || personaConfigs["creator"];
  }, [activePersona]);

  const config = useMemo(() => {
    const persona = (activePersona || "creator").toLowerCase();
    if (["tech", "dev", "developer"].includes(persona)) return PERSONA_CONFIG["developer"];
    if (isCreatorPersona(persona)) return PERSONA_CONFIG["creator"];
    return PERSONA_CONFIG[persona] || PERSONA_CONFIG["creator"];
  }, [activePersona]);

  const aiMessage = useMemo(() => {
    if (score === 100)
      return "Your profile is optimized for maximum impact! You're ready to dominate.";
    if (score >= 80)
      return "Excellent work. Just a few more details to reach elite status.";
    if (score >= 50)
      return `You're ${score}% complete. Every detail you add builds more trust with your visitors.`;
    return "Let's build a powerful identity. Start with the basics to get noticed.";
  }, [score, incomplete]);

  const topActions = incomplete.slice(0, 3);

  if (loading || authLoading)
    return (
      <div className="studio-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="studio-page pb-40">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* 🔝 HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b-[4px] border-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate("/dashboard?tab=profile")}
              className="w-10 h-10 shrink-0 rounded-xl bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-black font-display tracking-tight truncate">
                Build your{" "}
                {activePersona
                  ? (activeConfig?.name ||
                      activePersona.charAt(0).toUpperCase() +
                        activePersona.slice(1)) + " "
                  : ""}
                Identity {activePersona ? config.emoji : "✨"}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                {activePersona
                  ? "Complete your profile to unlock more visibility"
                  : "Choose your path to begin"}
              </p>
            </div>
          </div>

          {activePersona ? (
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="hidden md:flex px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Changes
              </button>

              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Strength
                </p>
                <p className="text-xs font-bold text-orange-500">
                  {score >= 80
                    ? "Elite Level Achieved! 🏆"
                    : "Good progress. Let's hit 80% 🚀"}
                </p>
              </div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke="#F1F1EF"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke={config.color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="251"
                    strokeDashoffset={251 * (1 - score / 100)}
                    strokeLinecap="round"
                    className="progress-ring"
                  />
                </svg>
                <span className="absolute text-[9px] sm:text-[10px] font-black">
                  {score}%
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className={activePersona ? "grid grid-cols-1 lg:grid-cols-[1fr_385px] gap-10 items-start" : "max-w-[1000px] mx-auto"}>
          {/* LEFT: FORM SECTIONS */}
          <div className="space-y-12 w-full min-w-0">
            {/* Section 1: Choose Path (If no persona) */}
            {!activePersona && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_#000]">
                    01
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-white">
                      Choose Your Path
                    </h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Select your core identity theme
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(PERSONA_CONFIG)
                    .filter(([key]) => {
                      const existingIdentities =
                        profile?.persona_data?.identities || [];
                      return !existingIdentities.some(
                        (i: any) => i.persona_type === key,
                      );
                    })
                    .map(([key, p]) => (
                      <div
                        key={key}
                        onClick={() => {
                          setActivePersona(key);
                          navigate(`/studio?persona=${key}&mode=new`, {
                            replace: true,
                          });
                        }}
                        className="glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all"
                      >
                        <div className="w-16 h-16 rounded-xl bg-[#0a0a0a] border-[3px] border-white flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                          {p.emoji}
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider">
                          {p.label || key}
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
                          Select Protocol
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {activePersona && (
              <>
                <section
                  className="glass-card p-10 animate-slideUp mb-8 bg-[#1a1a1a]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                        <Eye size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight text-white">
                          Public Profile
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                          See how your identity looks to the world
                        </p>
                      </div>
                    </div>
                     <button
                      onClick={() =>
                        navigate(
                          `/p/${profile?.username || profile?.id}?from=studio`,
                        )
                      }
                      className="px-6 py-3 bg-white text-black border-[3px] border-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 shrink-0"
                    >
                      <Eye size={16} /> View Profile
                    </button>
                  </div>
                </section>

                <section
                  id="tagline"
                  className="glass-card p-10 animate-slideUp"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                        <User size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight text-white">
                          Basic Identity
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                          Foundational profile details
                        </p>
                      </div>
                    </div>
                    {data.tagline && (
                      <span className="status-badge completed">
                        Completed ✅
                      </span>
                    )}
                  </div>

                  {/* Avatar Upload Sub-section */}
                  <div className="flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-xl bg-[#0a0a0a] border-[4px] border-white shadow-[6px_6px_0px_#fff] overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <Avatar
                          src={data.avatar_url}
                          name={`${data.first_name} ${data.last_name}`}
                          username={profile?.secure_slug || profile?.id}
                          size="w-full h-full text-4xl"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] flex items-center justify-center text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">
                        <Camera size={18} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleAvatarUpload(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-1 tracking-tighter">
                        {data.first_name || data.last_name
                          ? `${data.first_name} ${data.last_name}`
                          : "New Identity"}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest">
                        JPG or PNG • Max 2MB
                      </p>
                      <div className="flex gap-3">
                        <label className="px-4 py-2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer">
                          Upload New
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleAvatarUpload(e.target.files[0])
                            }
                          />
                        </label>
                        <button
                          onClick={() => updateField("avatar_url", "")}
                          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
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
                          maxLength={50}
                          onChange={(e) =>
                            updateField("first_name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="section-label">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          className="input-field"
                          value={data.last_name}
                          maxLength={50}
                          onChange={(e) =>
                            updateField("last_name", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {isCreatorPersona(activePersona) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                          <label className="section-label">Location Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai, India"
                            className="input-field"
                            value={data.location}
                            maxLength={100}
                            onChange={(e) =>
                              updateField("location", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="section-label">
                            Established Since
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2021"
                            className="input-field"
                            value={data.est_year}
                            maxLength={4}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              updateField("est_year", val)
                            }}
                          />
                        </div>
                      </div>
                    )}



                    <div>
                      <label className="section-label">Profile Theme</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(() => {
                          let options = ["default", "classic", "minimal", "neon"]; // Default to Creator
                          
                          if (["tech", "dev", "developer"].includes(activePersona?.toLowerCase() || "")) {
                            options = [
                              "default",
                              "classic",
                              "blueprint",
                              "hacker",
                            ];
                          } else if (activePersona?.toLowerCase().includes("student")) {
                            options = [
                              "default",
                              "classic",
                              "campus",
                              "night owl",
                            ];
                          }

                          return options.map((opt) => (
                            <div
                              key={opt}
                              onClick={() => updateField("profile_theme", opt)}
                              className={`p-3 rounded-xl border-[3px] cursor-pointer transition-all text-center flex flex-col justify-center items-center ${
                                (data.profile_theme?.toLowerCase() ||
                                  "default") === opt
                                  ? "border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]"
                                  : "border-white bg-[#0a0a0a] hover:border-orange-500 shadow-[4px_4px_0px_#fff]"
                              }`}
                            >
                              <p
                                className={`text-[10px] font-black uppercase tracking-wider ${
                                  (data.profile_theme?.toLowerCase() ||
                                    "default") === opt
                                    ? "text-black"
                                    : "text-neutral-400"
                                }`}
                              >
                                {opt === "default"
                                  ? ["tech", "dev", "developer"].includes(activePersona?.toLowerCase() || "")
                                    ? "Terminal"
                                    : activePersona?.toLowerCase().includes("student")
                                      ? "Notebook"
                                      : "Glow"
                                  : opt === "classic"
                                    ? "Classic"
                                    : opt}
                              </p>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    <div>
                      <label className="section-label">
                        Public Bio
                        {!data.bio && (
                          <span className="ml-auto text-orange-400 font-bold text-[9px] uppercase tracking-widest animate-pulse">
                            ← Tap a vibe to fill instantly
                          </span>
                        )}
                      </label>
                      <textarea
                        placeholder="Tell the world who you are..."
                        className="input-field min-h-[100px] py-4"
                        value={data.bio}
                        maxLength={500}
                        onChange={(e) => updateField("bio", e.target.value)}
                      />
                      {/* ⚡ One-tap Vibe Presets */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(
                          isCreatorPersona(activePersona)
                            ? [
                                { emoji: "🎬", label: "Creator", bio: "Creating content that connects and inspires. Building community one story at a time." },
                                { emoji: "✨", label: "Visionary", bio: "Turning ideas into viral moments. Here to make noise and leave a mark." },
                                { emoji: "🌍", label: "Storyteller", bio: "Authentic storyteller. Brand collaborator. Helping people discover what they love." },
                                { emoji: "🚀", label: "Ambitious", bio: "Growing every day. Content is my craft, community is my purpose." },
                              ]
                            : activePersona?.toLowerCase().includes("student")
                            ? [
                                { emoji: "🎓", label: "Learner", bio: "Forever a student. Building skills, chasing goals, and making the most of every opportunity." },
                                { emoji: "💡", label: "Builder", bio: "Student by day, builder by night. Learning, experimenting, and sharing the journey." },
                                { emoji: "🌱", label: "Growing", bio: "Early in the journey but full of drive. Open to learning, networking, and growing." },
                                { emoji: "🔥", label: "Hustler", bio: "Studying hard, building harder. Future-focused and ready to create real impact." },
                              ]
                            : [
                                { emoji: "💻", label: "Tech", bio: "Building things that matter. Passionate about technology, clean code, and solving real problems." },
                                { emoji: "🚀", label: "Ambitious", bio: "Shipping products, solving problems, and levelling up every day. Open to collabs." },
                                { emoji: "⚡", label: "Minimal", bio: "Code. Create. Repeat. Focused on building with purpose." },
                                { emoji: "🌐", label: "Open", bio: "Developer, maker, and community contributor. Let's build something great together." },
                              ]
                        ).map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => updateField("bio", preset.bio)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-orange-500/20 hover:border-orange-500 text-[11px] font-bold text-neutral-300 hover:text-white transition-all"
                            title={preset.bio}
                          >
                            <span>{preset.emoji}</span>
                            <span>{preset.label}</span>
                          </button>
                        ))}
                        {data.bio && (
                          <button
                            type="button"
                            onClick={() => updateField("bio", "")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 hover:text-red-300 transition-all"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </section>

                {/* Section: Detailed Persona Attributes (Forms) */}
                <section
                  id="detailed_attributes"
                  className="glass-card p-10 animate-slideUp"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                        <Target size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight text-white">
                          Detailed Persona Attributes
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                          Specific details for your {activePersona} identity
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDetailed(!showDetailed);
                        try {
                          posthog.capture("Toggle Detailed Form", { expanded: !showDetailed, persona: activePersona });
                        } catch (_) {}
                      }}
                      className={`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        showDetailed
                          ? "bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                          : "bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      }`}
                    >
                      {showDetailed ? "Collapse Details" : "Configure Details +25%"}
                    </button>
                  </div>

                  {showDetailed && (
                    <div className="p-0 sm:p-2 animate-fadeIn">
                      {["developer", "dev"].includes(activePersona) && (
                        <DeveloperForm
                          data={data}
                          onChange={setData}
                          isOwner
                          onUpload={handleFileUpload}
                          uploading={uploading}
                        />
                      )}
                      {activePersona === "student" && (
                        <StudentForm
                          data={data}
                          onChange={setData}
                          onUpload={handleFileUpload}
                          uploading={uploading}
                        />
                      )}
                      {isCreatorPersona(activePersona) && (
                        <CreatorForm
                          data={data}
                          onChange={setData}
                          onUpload={handleFileUpload}
                          uploading={uploading}
                        />
                      )}
                    </div>
                  )}
                </section>

                {/* Section: Achievements */}
                <section
                  id="achievements"
                  className="glass-card p-10 animate-slideUp"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                        <Trophy size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-display tracking-tight text-white">
                          Achievements
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                          Trust & Authority
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {data.achievements?.length > 0 ? (
                        <span className="status-badge completed">
                          Completed ✅
                        </span>
                      ) : (
                        <span className="status-badge missing">
                          Missing +10% ⚠️
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAchievements(!showAchievements);
                          try {
                            posthog.capture("Toggle Achievements Form", { expanded: !showAchievements });
                          } catch (_) {}
                        }}
                        className={`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          showAchievements
                            ? "bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                            : "bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        }`}
                      >
                        {showAchievements ? "Collapse" : "Add Achievements"}
                      </button>
                    </div>
                  </div>

                  {showAchievements && (
                    <div className="space-y-6 animate-fadeIn">
                      <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                        Boost trust with achievements (awards, milestones, or
                        high-value certifications).
                      </p>
                      <TagInput
                        value={data.achievements || []}
                        onChange={(tags) => updateField("achievements", tags)}
                        placeholder="Add achievement (e.g., Verified on Instagram, Best Actor 2023)"
                      />
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          {/* RIGHT: LIVE PREVIEW DEVICE FRAME */}
          {activePersona && (
            <div className="hidden lg:block lg:fixed lg:top-[120px] lg:w-[350px] lg:right-[calc((100vw-1200px)/2+40px)] max-[1200px]:lg:right-10 z-30">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 text-center">Live Preview Card</p>
              
              {/* Phone Frame wrapper */}
              <div className="relative mx-auto w-[350px] h-[680px] bg-black border-[12px] border-neutral-900 rounded-[56px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-4 ring-neutral-800/80">
                {/* Speaker/Camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2" />
                  <div className="w-12 h-1 bg-neutral-950 rounded-full" />
                </div>
                
                {/* Scrollable screen inside */}
                <div className="flex-1 w-full h-full bg-[#0d1117] relative">
                  <MobilePreviewFrame>
                    <PersonaRouter profile={previewProfile} hideHeader={false} />
                  </MobilePreviewFrame>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating preview button for mobile/tablet */}
      {activePersona && (
        <button
          onClick={() => setShowMobilePreview(true)}
          className="lg:hidden fixed bottom-28 right-6 z-50 w-12 h-12 rounded-full bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center transition-all active:scale-95"
          title="Show Live Preview"
        >
          <Eye size={20} />
        </button>
      )}

      {/* Mobile Preview Modal Backdrop */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-[9999] lg:hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] h-[90vh] bg-black border-[12px] border-neutral-900 rounded-[56px] overflow-hidden flex flex-col shadow-2xl ring-4 ring-neutral-800/80">
            {/* Close button */}
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white/10 hover:bg-neutral-850"
            >
              <X size={16} />
            </button>
            <div className="flex-1 w-full h-full bg-[#0d1117] relative">
              <MobilePreviewFrame>
                <PersonaRouter profile={previewProfile} hideHeader={false} />
              </MobilePreviewFrame>
            </div>
          </div>
        </div>
      )}

      {/* Removed sticky insight strip as requested */}

      {/* ⚡ ACTION-DRIVEN FOOTER */}
      {activePersona ? (
        <footer className="relative md:fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-[4px] border-white p-6 pb-8 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-14 py-4 rounded-xl bg-orange-500 text-black border-[4px] border-black font-black text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[6px_6px_0px_#000] disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              "Saving Profile..."
            ) : (
              <>
                <Save size={20} /> Save Profile
              </>
            )}
          </button>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secured by KnoWMi Identity Cloud • End-to-End Encrypted</span>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
