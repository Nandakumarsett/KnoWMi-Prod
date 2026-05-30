export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'select' | 'tags' | 'array';
  options?: string[];
  placeholder?: string;
  suggestions?: string[];
  itemSchema?: FieldConfig[];
}

export interface PersonaConfig {
  id: string;
  name: string;
  theme: {
    color: string;
    style: string;
    bg: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    cardBg: string;
    buttonBg: string;
    badgeStyle: string;
  };
  fields: FieldConfig[];
  themes?: { id: string; name: string }[];
}

const developerConfig: PersonaConfig = {
  id: 'developer',
  name: 'Tech',
  theme: {
    color: 'light',
    style: 'minimal',
    bg: '#f8f9fa',
    accent: '#3fb950',
    textPrimary: '#1A1A1A',
    textSecondary: '#5c646e',
    cardBg: '#ffffff',
    buttonBg: 'linear-gradient(135deg, #238636, #2ea043)',
    badgeStyle: 'bg-green-50 text-green-700'
  },
  themes: [
    { id: 'default', name: 'Terminal' },
    { id: 'blueprint', name: 'Blueprint' },
    { id: 'hacker', name: 'Hacker' }
  ],
  fields: [
    { key: 'skills', label: 'Core Skills', type: 'tags', suggestions: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'] },
    { key: 'github', label: 'GitHub Profile', type: 'url', placeholder: 'https://github.com/...' },
    { key: 'tech_stack', label: 'Tech Stack', type: 'tags', suggestions: ['Next.js', 'Vite', 'TailwindCSS', 'Python', 'Supabase'] },
    {
      key: 'projects',
      label: 'Selected Projects',
      type: 'array',
      itemSchema: [
        { key: 'name', label: 'Project Name', type: 'text', placeholder: 'e.g. KnoWMi Identity Protocol' },
        { key: 'description', label: 'Project Description', type: 'text', placeholder: 'e.g. Decentralized phygital identity' },
        { key: 'live_url', label: 'Live URL', type: 'url', placeholder: 'https://...' }
      ]
    }
  ]
};


const creatorConfig: PersonaConfig = {
  id: 'influencer',
  name: 'Creator',
  theme: {
    color: 'purple',
    style: 'bold',
    bg: 'linear-gradient(180deg, #2e1065 0%, #0f172a 100%)',
    accent: '#a855f7',
    textPrimary: '#ffffff',
    textSecondary: '#d8b4fe',
    cardBg: 'rgba(168, 85, 247, 0.08)',
    buttonBg: 'linear-gradient(135deg, #a855f7, #c084fc)',
    badgeStyle: 'bg-purple-500/20 text-purple-300'
  },
  themes: [
    { id: 'default', name: 'Glow' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'neon', name: 'Neon' }
  ],
  fields: [
    { key: 'niche', label: 'Creative Niche', type: 'text', placeholder: 'e.g. Tech Reviewer' },
    { key: 'followers', label: 'Total Reach', type: 'text', placeholder: 'e.g. 150K+' },
    { 
      key: 'platforms', 
      label: 'Main Platforms', 
      type: 'array',
      itemSchema: [
        { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'YouTube', 'TikTok', 'X', 'Twitch'] },
        { key: 'url', label: 'Profile URL', type: 'url', placeholder: 'https://...' },
        { key: 'followers', label: 'Followers on Platform', type: 'text', placeholder: 'e.g. 50K' }
      ]
    },
    { 
      key: 'collabs', 
      label: 'Recent Partnerships', 
      type: 'array',
      itemSchema: [
        { key: 'brand', label: 'Brand Name', type: 'text', placeholder: 'e.g. Nike' },
        { key: 'campaign', label: 'Campaign Title', type: 'text', placeholder: 'e.g. Fall Identity' }
      ]
    }
  ]
};

const studentConfig: PersonaConfig = {
  id: 'student',
  name: 'Student',
  theme: {
    color: 'blue',
    style: 'clean',
    bg: 'linear-gradient(180deg, #091a3c 0%, #0b1120 100%)',
    accent: '#3b82f6',
    textPrimary: '#ffffff',
    textSecondary: '#93c5fd',
    cardBg: 'rgba(59, 130, 246, 0.08)',
    buttonBg: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    badgeStyle: 'bg-blue-500/20 text-blue-300'
  },
  themes: [
    { id: 'default', name: 'Notebook' },
    { id: 'campus', name: 'Campus' },
    { id: 'night owl', name: 'Night Owl' }
  ],
  fields: [
    { key: 'college', label: 'College / University', type: 'text', placeholder: 'e.g. Stanford University' },
    { key: 'course', label: 'Major / Course', type: 'text', placeholder: 'e.g. Computer Science' },
    { key: 'year', label: 'Current Year', type: 'select', options: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Postgrad'] },
    { key: 'interests', label: 'Academic Interests', type: 'tags', suggestions: ['AI & ML', 'Cybersecurity', 'Web3', 'Quantum Computing', 'Data Science'] }
  ]
};


const gamerConfig: PersonaConfig = {
  id: 'gamer',
  name: 'Gamer',
  theme: {
    color: 'neon',
    style: 'gaming',
    bg: 'linear-gradient(180deg, #09090b 0%, #1e1b4b 100%)',
    accent: '#00ffaa',
    textPrimary: '#ffffff',
    textSecondary: '#a7f3d0',
    cardBg: 'rgba(0, 255, 170, 0.08)',
    buttonBg: 'linear-gradient(135deg, #00ffaa, #00d48a)',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300'
  },
  fields: [
    { key: 'games', label: 'Main Games Played', type: 'tags', suggestions: ['Valorant', 'CS:GO', 'Apex Legends', 'League of Legends', 'COD: Warzone'] },
    { key: 'rank', label: 'Peak Rank / Level', type: 'text', placeholder: 'e.g. Radiant / Immortal' },
    { key: 'platform', label: 'Primary Platform', type: 'select', options: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'] },
    { key: 'stream_link', label: 'Twitch / Stream URL', type: 'url', placeholder: 'https://twitch.tv/...' }
  ]
};

export const personaConfigs: Record<string, PersonaConfig> = {
  developer: developerConfig,
  dev: developerConfig,
  influencer: creatorConfig,
  creator: creatorConfig,
  student: studentConfig,
};

