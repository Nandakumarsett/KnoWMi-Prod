import { CompletionSection, CompletionResult } from '../../types/identity'

export const DEVELOPER_WEIGHTS: Record<string, number> = {
  role: 10,
  mission: 5,
  languages: 10,
  tech_stack: 15,
  projects: 25,
  achievements: 15,
  social_links: 20
}

export const STUDENT_WEIGHTS: Record<string, number> = {
  university: 10,
  course: 10,
  mood: 5,
  playlist: 20,
  projects: 20,
  hackathons: 15,
  clubs: 10,
  social_links: 10
}

export const CREATOR_WEIGHTS: Record<string, number> = {
  tagline: 10,
  featured_work: 15,
  content_formats: 10,
  works: 20,
  platforms: 25,
  achievements: 10,
  collab_info: 10
}

export const GAMER_WEIGHTS: Record<string, number> = {
  gamer_tag: 10,
  main_games: 25,
  stats: 20,
  achievements: 15,
  stream_url: 15,
  social_links: 15
}

export const FITNESS_WEIGHTS: Record<string, number> = {
  tagline: 10,
  disciplines: 15,
  streak: 15,
  goals: 30,
  achievements: 20,
  social_links: 10
}

export const INFLUENCER_WEIGHTS: Record<string, number> = {
  tagline: 10,
  platforms: 30,
  featured_content: 20,
  collab_info: 20,
  categories: 10,
  achievements: 10
}

export function isSectionFilled(key: string, data: any): boolean {
  if (!data) return false

  switch (key) {
    case 'role':
      return !!(data.about?.role || data.role || data.tagline)
    case 'mission':
      return !!(data.about?.mission || data.mission)
    case 'languages':
      return Array.isArray(data.about?.languages) && data.about.languages.length >= 2
    case 'tech_stack':
      return Array.isArray(data.tech_stack) && data.tech_stack.length >= 4
    case 'projects':
      return Array.isArray(data.projects) && data.projects.length >= 1
    case 'achievements':
      return Array.isArray(data.achievements) && data.achievements.length >= 1
    case 'social_links':
      return !!(data.social_links || (data.instagram || data.linkedin || data.github))
    case 'university':
      return !!data.university
    case 'course':
      return !!data.course
    case 'mood':
      return !!(data.mood || data.thought_bubble)
    case 'playlist':
      return !!(data.playlist_url || data.playlist_name)
    case 'hackathons':
      return Array.isArray(data.hackathons) && data.hackathons.length >= 1
    case 'clubs':
      return Array.isArray(data.clubs) && data.clubs.length >= 1
    case 'tagline':
      return !!data.tagline
    case 'featured_work':
      return !!data.featured_work_url
    case 'content_formats':
      return Array.isArray(data.content_formats) && data.content_formats.length >= 1
    case 'works':
      return Array.isArray(data.works) && data.works.length >= 1
    case 'platforms':
      return Array.isArray(data.platforms) && data.platforms.length >= 1
    case 'collab_info':
      return !!(data.collab_contact || data.collab_types || data.contact_preference)
    case 'gamer_tag':
      return !!data.gamer_tag
    case 'main_games':
      return Array.isArray(data.main_games) && data.main_games.length >= 1
    case 'stats':
      return !!(data.stats || data.streak_days || data.prs_count)
    case 'stream_url':
      return !!data.stream_url
    case 'disciplines':
      return Array.isArray(data.disciplines) && data.disciplines.length >= 1
    case 'streak':
      return typeof data.streak_days === 'number' && data.streak_days > 0
    case 'goals':
      return Array.isArray(data.goals) && data.goals.length >= 1
    case 'featured_content':
      return Array.isArray(data.featured_content) && data.featured_content.length >= 1
    case 'categories':
      return Array.isArray(data.categories) && data.categories.length >= 1
    default:
      return !!data[key]
  }
}

export function formatSectionLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function computeCompletionScore(persona: string, data: Record<string, any>): CompletionResult {
  const weights: Record<string, number> = {
    developer: DEVELOPER_WEIGHTS,
    student: STUDENT_WEIGHTS,
    creator: CREATOR_WEIGHTS,
    gamer: GAMER_WEIGHTS,
    fitness: FITNESS_WEIGHTS,
    influencer: INFLUENCER_WEIGHTS
  }[persona] || DEVELOPER_WEIGHTS

  let score = 0
  const incomplete: CompletionSection[] = []

  for (const [key, weight] of Object.entries(weights)) {
    const filled = isSectionFilled(key, data)
    if (filled) {
      score += weight
    } else {
      incomplete.push({
        id: key,
        points: weight,
        label: formatSectionLabel(key),
        filled: false,
        anchor: key
      })
    }
  }

  incomplete.sort((a, b) => b.points - a.points)

  return {
    score: Math.min(100, score),
    incomplete,
    grade: score >= 90 ? 'elite' : score >= 70 ? 'strong' : score >= 40 ? 'building' : 'starter'
  }
}
