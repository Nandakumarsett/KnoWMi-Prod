export type PersonaType = 'developer' | 'student' | 'creator' | 'influencer';


export interface SocialLink {
  platform: string;   // 'instagram' | 'github' | 'linkedin' | 'twitter' | 'youtube' | 'spotify' etc
  url: string;
  label?: string;
}

export interface DeveloperData {
  type: 'developer';
  tagline: string;
  commits: number;
  collabs: number;
  about: {
    role?: string;
    mission?: string;
    languages?: string[];
    status?: string;
    company?: string;
  };
  tech_stack: string[];
  resume_url?: string;
  projects: Array<{
    name: string;
    description: string;
    github_url?: string;
    live_url?: string;
    stars?: number;
  }>;
  achievements: Array<{
    icon: string;
    label: string;
  }>;
  contact_email?: string;
  contact_whatsapp?: string;
  quick_talk_url?: string;
  collab_types?: string;
  platforms?: Array<{
    platform: string;
    url: string;
    followers?: string;
  }>;
  featured_work_url?: string;
}

export interface StudentData {
  type: 'student';
  university: string;
  course: string;
  year: string;
  mood: string;
  campus_rank_pct: number;
  courses_completed?: number;
  study_buddies: number;
  thought_bubble: string;
  upcoming_events?: Array<{ title: string; date: string; }>;
  batch_year?: string;
  favorite_subject?: string;
  resume_url?: string;
  website?: string;
  playlist_url?: string;
  playlist_name?: string;
  featured_work_url?: string;
  projects: Array<{
    name: string;
    emoji: string;
    description?: string;
    tech: string[];
    url?: string;
    github_url?: string;
  }>;
  hackathons: Array<{
    name: string;
    year: string;
    achievement?: string;
  }>;
  clubs: string[];
  platforms?: Array<{
    platform: string;
    url: string;
  }>;
  availability?: string;
  core_skills?: string[];
  hobbies?: string[];
  contact_email?: string;
  quick_talk_url?: string;
}


export interface CreatorData {
  type: 'creator';
  tagline: string;
  featured_work_url?: string;
  content_formats: string[];
  works: Array<{
    title: string;
    thumbnail_url?: string;
    url: string;
    type: 'image' | 'video' | 'article' | 'design';
  }>;
  platforms: Array<{
    platform: string;
    url: string;
    followers?: string;
    metric_label?: string;
  }>;
  
  // Base fields
  contact_email?: string;
  contact_whatsapp?: string;
  
  // Section 1: Availability Status
  availability_status?: 'Open' | 'Fully booked' | 'Selective';
  response_time?: string;
  preferred_contact_method?: string;

  // Section 2: Collaboration Preferences
  collab_types_tags?: string[];
  rate_range_min?: number;
  rate_range_max?: number;
  turnaround_time?: string;
  deliverable_formats?: string[];

  // Section 3: Audience Snapshot
  audience_age_group?: string;
  audience_interests?: string[];

  // Section 4: Content Aesthetic
  visual_style?: 'Cinematic' | 'Minimalist' | 'Vibrant' | 'Moody';
  posting_frequency?: string;

  // Section 5: Past Collaborations
  past_collaborations?: Array<{
    brand_name: string;
    campaign_description: string;
    logo_url?: string;
    link?: string;
  }>;

  // Legacy/other fields to retain backward compatibility
  collab_types?: string;
  total_reach?: string;
  avg_views?: string;
  engagement_rate?: string;
  location?: string;
  achievements: Array<{
    icon: string;
    label: string;
  }>;
}

export interface GamerData {
  type: 'gamer';
  gamer_tag: string;
  status: 'online' | 'in-game' | 'offline';
  main_games: Array<{
    name: string;
    logo_url?: string;
    rank?: string;
  }>;
  stats: {
    kd_ratio?: number;
    total_wins?: number;
    hours_played?: number;
    custom_stat_label?: string;
    custom_stat_value?: string;
  };
  achievements: Array<{
    icon: string;
    label: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  stream_url?: string;
}

export interface FitnessData {
  type: 'fitness';
  tagline: string;
  location?: string;
  streak_days: number;
  prs_count: number;
  total_workouts: number;
  disciplines: string[];
  goals: Array<{
    label: string;
    current: number;
    target: number;
    unit: string;
  }>;
  achievements: Array<{
    icon: string;
    label: string;
  }>;
}

export interface InfluencerData {
  type: 'influencer';
  tagline: string;
  is_verified: boolean;
  total_reach?: string;
  avg_engagement?: string;
  categories: string[];
  collab_types: string[];
  platforms: Array<{
    platform: string;
    url: string;
    followers: string;
    metric_label: string;
  }>;
  featured_content: Array<{
    title: string;
    thumbnail_url?: string;
    url: string;
    views?: string;
  }>;
}


export type PersonaData =
  | DeveloperData
  | StudentData
  | CreatorData
  | InfluencerData;

export interface ProfileData {
  id: string;
  user_id?: string;
  username: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url: string | null;
  member_id: string;
  persona: PersonaType;
  mood: string | null;
  bio: string | null;
  pulse: number;
  tier: 'Founding' | 'Elite' | 'Pro' | 'Starter';
  status?: string;
  social_links: SocialLink[];
  persona_data: PersonaData;
  is_verified: boolean;
  joined_at: string;
  views?: number;
  top_location?: string;
  ghost_mode?: boolean;
  profile_theme?: string;
}

