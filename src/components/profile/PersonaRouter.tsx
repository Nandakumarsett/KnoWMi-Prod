import { ProfileData } from '../../types/profile'
import { DeveloperProfile } from './personas/DeveloperProfile'
import { StudentProfile } from './personas/StudentProfile'
import { CreatorProfile } from './personas/CreatorProfile'
import { GamerProfile } from './personas/GamerProfile'
import { FitnessProfile } from './personas/FitnessProfile'

interface PersonaRouterProps {
  profile: ProfileData
  recentVisitors?: any[]
}

export function PersonaRouter({ profile, recentVisitors = [] }: PersonaRouterProps) {
  const persona = (profile.persona || 'developer').toLowerCase()
  switch (persona) {
    case 'dev':
    case 'developer':
    case 'coder':
    case 'tech':
      return <DeveloperProfile profile={profile} />
    case 'student':
    case 'education':
    case 'university':
      return <StudentProfile profile={profile} visitors={recentVisitors} />
    case 'gamer':
    case 'gaming':
    case 'esports':
      return <GamerProfile profile={profile} />
    default:
      return <DeveloperProfile profile={profile} /> // Default to Developer as per high standard
  }
}
