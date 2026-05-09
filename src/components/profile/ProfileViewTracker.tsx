import { useEffect, useRef } from 'react'
import { buildFingerprint } from '../../lib/analytics/fingerprint'
import { categoriseReferrer } from '../../lib/analytics/referrer'

interface ProfileViewTrackerProps {
  profileId: string
}

export function ProfileViewTracker({ profileId }: ProfileViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    
    const track = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const source = searchParams.get('src') || 'direct'
        const fp = await buildFingerprint()
        const referrer = categoriseReferrer(document.referrer)

        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-profile-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            profileId, 
            referrer, 
            fp,
            source
          }),
          keepalive: true,
        })
      } catch (err) {
        console.error('Tracking error:', err)
      }
    }

    if (profileId) {
      track()
    }
  }, [profileId])

  return null
}
