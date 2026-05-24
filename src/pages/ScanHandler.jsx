import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ScanHandler() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const recordScan = async () => {
      if (!code) return

      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)
        
        let profile = null
        let profileError = null

        // Try querying with user_id first (optimal for push alerts)
        try {
          let dbQuery = supabase
            .from('public_profiles')
            .select('id, user_id, first_name, secure_slug')

          if (isUUID) {
            dbQuery = dbQuery.or(`id.eq.${code},secure_slug.eq.${code}`)
          } else {
            dbQuery = dbQuery.or(`wm_code.ilike.${code},wm_code.ilike.WM-${code},wm_code.ilike.PT-${code},secure_slug.eq.${code}`)
          }

          const res = await dbQuery.single()
          if (!res.error && res.data) {
            profile = res.data
          } else {
            profileError = res.error
          }
        } catch (e) {
          console.warn('Initial profile query failed:', e)
        }

        // If it failed (e.g., user_id column doesn't exist in live view yet), query without user_id
        if (!profile) {
          try {
            let fallbackQuery = supabase
              .from('public_profiles')
              .select('id, first_name, secure_slug')

            if (isUUID) {
              fallbackQuery = fallbackQuery.or(`id.eq.${code},secure_slug.eq.${code}`)
            } else {
              fallbackQuery = fallbackQuery.or(`wm_code.ilike.${code},wm_code.ilike.WM-${code},wm_code.ilike.PT-${code},secure_slug.eq.${code}`)
            }

            const res = await fallbackQuery.single()
            if (!res.error && res.data) {
              profile = res.data
              profileError = null // found successfully
            } else {
              profileError = res.error || new Error('Profile not found')
            }
          } catch (e) {
            profileError = e
          }
        }

        if (profileError || !profile) {
          console.error('Profile not found for code:', code, profileError)
          navigate('/')
          return
        }

        // 2. Capture basic device/location info
        const userAgent = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/.test(userAgent)
        const isAndroid = /Android/.test(userAgent)
        const isMobile = isIOS || isAndroid || /Mobi/i.test(userAgent)
        
        let device = 'Desktop'
        if (isIOS) device = 'iPhone'
        else if (isAndroid) device = 'Android'
        else if (isMobile) device = 'Mobile'

        // 3. Smart Geolocation Resolution (HTML5 Geolocation with IP API Fallback)
        let resolvedCity = 'Unknown'
        let resolvedCountry = 'India'
        
        const getBrowserLocation = () => {
          return new Promise((resolve) => {
            if (!navigator.geolocation) return resolve(null)
            
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords
                  // 1. Try BigDataCloud (fast, completely free, no headers block)
                  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                  if (res.ok) {
                    const data = await res.json()
                    const city = data.city || data.locality || 'Unknown'
                    const country = data.countryName || 'India'
                    if (city !== 'Unknown') return resolve({ city, country })
                  }
                  
                  // 2. Try Nominatim as fallback
                  const resNom = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                    headers: { 'Accept-Language': 'en' }
                  })
                  if (resNom.ok) {
                    const data = await resNom.json()
                    const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.state_district || data.address?.state || 'Unknown'
                    const country = data.address?.country || 'India'
                    return resolve({ city, country })
                  }
                  resolve(null)
                } catch (e) {
                  console.warn('Reverse geocode failed:', e)
                  resolve(null)
                }
              },
              (err) => {
                console.warn('Browser location permission failed or denied:', err)
                resolve(null)
              },
              { timeout: 4000, enableHighAccuracy: true }
            )
          })
        }

        const getIpLocation = async () => {
          // 1. Try freeipapi.com (reliable, high limits, HTTPS)
          try {
            const res = await fetch('https://freeipapi.com/api/json')
            if (res.ok) {
              const data = await res.json()
              if (data.cityName && data.cityName !== 'Unknown') {
                return { city: data.cityName, country: data.countryName || 'India' }
              }
            }
          } catch (e) {
            console.warn('freeipapi failed:', e)
          }

          // 2. Try ipwho.is (reliable, HTTPS)
          try {
            const res = await fetch('https://ipwho.is/')
            if (res.ok) {
              const data = await res.json()
              if (data.success && data.city && data.city !== 'Unknown') {
                return { city: data.city, country: data.country || 'India' }
              }
            }
          } catch (e) {
            console.warn('ipwho.is failed:', e)
          }

          // 3. Try ipapi.co (standard fallback)
          try {
            const res = await fetch('https://ipapi.co/json/')
            if (res.ok) {
              const data = await res.json()
              if (data.city && data.city !== 'Unknown') {
                return { city: data.city, country: data.country_name || 'India' }
              }
            }
          } catch (e) {
            console.warn('ipapi.co failed:', e)
          }

          return { city: 'Unknown', country: 'India' }
        }

        try {
          const geoResult = await getBrowserLocation()
          if (geoResult && geoResult.city && geoResult.city !== 'Unknown') {
            resolvedCity = geoResult.city
            resolvedCountry = geoResult.country || 'India'
          } else {
            const ipResult = await getIpLocation()
            if (ipResult && ipResult.city && ipResult.city !== 'Unknown') {
              resolvedCity = ipResult.city
              resolvedCountry = ipResult.country || 'India'
            }
          }
        } catch (e) {
          console.warn('Geolocation resolution pipeline failed:', e)
        }

        // 4. Log the scan in the database
        let fp = 'anonymous'
        try {
          const { buildFingerprint } = await import('../lib/analytics/fingerprint')
          fp = await buildFingerprint()
        } catch (e) {
          console.warn('Fingerprinting failed, using anonymous:', e)
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        try {
          const { error: scanInsertError } = await supabase.from('qr_scan_events').insert({
            profile_id: profile.id,
            device_type: device.toLowerCase(),
            browser: 'Webview/Browser',
            os: navigator.platform,
            scanner_fp: fp,
            scanned_at: new Date().toISOString(),
            scanner_id: user?.id,
            city: resolvedCity,
            country: resolvedCountry
          })
          if (scanInsertError) {
            console.error('Failed to log scan to qr_scan_events:', scanInsertError.message)
          }
        } catch (e) {
          console.error('Scan logging error:', e)
        }

        // 5. Trigger Push Notification asynchronously (falls back to Email Scan Alert in Edge Function if no push tokens)
        if (profile.user_id) {
          supabase.functions.invoke('send-push-notification', {
            body: {
              userId: profile.user_id,
              title: 'New Scan Alert! 🔥',
              body: `Someone just scanned your KnoWMi profile using a ${device} in ${resolvedCity}!`,
              url: '/dashboard',
              metadata: {
                device: device,
                city: resolvedCity
              }
            }
          }).catch(err => console.error('Failed to trigger scan notification:', err));
        }

        // 5. Redirect to the randomized URL (safety first)
        const finalSlug = profile.secure_slug || profile.id
        navigate(`/p/${finalSlug}?src=qr`)
      } catch (err) {
        console.error('Error logging scan:', err)
        navigate('/')
      }
    }

    recordScan()
  }, [code, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--sf)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold tracking-widest uppercase text-xs">Connecting to Identity...</p>
      </div>
    </div>
  )
}
