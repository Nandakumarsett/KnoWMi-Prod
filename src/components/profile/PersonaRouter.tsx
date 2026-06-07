import { ProfileData } from '../../types/profile'
import { DeveloperProfile } from './personas/DeveloperProfile'
import { StudentProfile } from './personas/StudentProfile'
import { CreatorProfile } from './personas/CreatorProfile'


import { ErrorBoundary } from './ErrorBoundary'

interface PersonaRouterProps {
  profile: ProfileData
  recentVisitors?: any[]
  stats?: any
}

export function PersonaRouter({ profile, recentVisitors = [], stats }: PersonaRouterProps) {
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
      return <StudentProfile profile={profile} visitors={recentVisitors} stats={stats} />
    case 'creator':
    default:
      return (
        <ErrorBoundary>
          <CreatorProfile profile={profile} stats={stats} />
        </ErrorBoundary>
      )
  }
}
