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
    role: string;
    mission: string;
    languages: string[];
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
  quick_talk_url?: string;
}

export interface StudentData {
  type: 'student';
  university: string;
  course: string;
  year: string;
  mood: string;
  campus_rank_pct: number;
  study_buddies: number;
  thought_bubble: string;
  batch_year?: string;
  favorite_subject?: string;
  resume_url?: string;
  website?: string;
  playlist_url?: string;
  playlist_name?: string;
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
  collab_types?: string;
  contact_preference?: string;
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
}
