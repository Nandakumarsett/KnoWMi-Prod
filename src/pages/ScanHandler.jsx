import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getAccurateLocation } from '../lib/analytics/geolocation'
import { buildFingerprint } from '../lib/analytics/fingerprint'
import { MapPin, ShieldCheck, X } from 'lucide-react'

export default function ScanHandler() {
  const { code } = useParams()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('fetching_profile')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!code) return

      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)
        
        let foundProfile = null
        let profileError = null

        try {
          let dbQuery = supabase.from('public_profiles').select('id, user_id, first_name, secure_slug, ghost_mode')
          if (isUUID) {
            dbQuery = dbQuery.or(`id.eq.${code},secure_slug.eq.${code}`)
          } else {
            dbQuery = dbQuery.or(`wm_code.ilike.${code},wm_code.ilike.WM-${code},wm_code.ilike.PT-${code},secure_slug.eq.${code}`)
          }
          const res = await dbQuery.single()
          if (!res.error && res.data) {
            foundProfile = res.data
          } else {
            profileError = res.error || new Error('Profile not found')
          }
        } catch (e) {
          profileError = e
        }

        if (profileError || !foundProfile) {
          console.error('Profile not found for code:', code, profileError)
          navigate('/')
          return
        }

        setProfile(foundProfile)
        
        // Immediately trigger the finishScan logic which navigates and fires analytics
        finishScan(foundProfile)
        
      } catch (err) {
        console.error('Error fetching profile:', err)
        navigate('/')
      }
    }

    const finishScan = (resolvedProfile) => {
      setStatus('redirecting')
      
      const finalSlug = resolvedProfile.secure_slug || resolvedProfile.id

      // Factory Claim Flow: Unclaimed shirt
      if (!resolvedProfile.user_id) {
        navigate(`/p/${finalSlug}?claim=true`)
        return
      }

      // Immediately navigate for a seamless, fast user experience
      navigate(`/p/${finalSlug}?src=qr`)

      // FIRE AND FORGET ANALYTICS IN BACKGROUND
      const runAnalytics = async () => {
        try {
          const userAgent = navigator.userAgent
          const isIOS = /iPad|iPhone|iPod/.test(userAgent)
          const isAndroid = /Android/.test(userAgent)
          const isMobile = isIOS || isAndroid || /Mobi/i.test(userAgent)
          
          let device = 'Desktop'
          if (isIOS) device = 'iPhone'
          else if (isAndroid) device = 'Android'
          else if (isMobile) device = 'Mobile'

          let fp = 'anonymous'
          try {
            fp = await buildFingerprint()
          } catch (e) {}
          
          let resolvedCity = 'Unknown'
          let resolvedCountry = 'India'

          // Resolve IP-based location silently
          try {
            const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')
            if (res.ok) {
              const data = await res.json()
              resolvedCity = data.city || data.locality || 'Unknown'
              resolvedCountry = data.countryName || 'India'
            }
          } catch (e) {}

          const { data: { user } } = await supabase.auth.getUser();
          
          try {
            await supabase.from('qr_scan_events').insert({
              profile_id: resolvedProfile.id,
              device_type: device.toLowerCase(),
              browser: 'Webview/Browser',
              os: navigator.platform,
              scanner_fp: fp,
              scanned_at: new Date().toISOString(),
              scanner_id: user?.id,
              city: resolvedCity,
              country: resolvedCountry
            })
          } catch (e) {}

          if (resolvedProfile.user_id) {
            supabase.functions.invoke('send-push-notification', {
              body: {
                userId: resolvedProfile.user_id,
                title: 'New Scan Alert! 🔥',
                body: `Someone just scanned your KnoWMi profile using a ${device} in ${resolvedCity}!`,
                url: '/dashboard',
                metadata: { device, city: resolvedCity }
              }
            }).catch(() => {});
          }
        } catch (err) {
          console.error('Background analytics error:', err)
        }
      }

      runAnalytics()
    }

    fetchProfile()
  }, [code, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--sf)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold tracking-widest uppercase text-xs">
          {status === 'redirecting' ? 'Finalizing...' : 'Connecting to Identity...'}
        </p>
      </div>
    </div>
  )
}
