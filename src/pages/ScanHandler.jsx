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

        // 3. Log the scan in the database
        let fp = 'anonymous'
        try {
          const { buildFingerprint } = await import('../lib/analytics/fingerprint')
          fp = await buildFingerprint()
        } catch (e) {
          console.warn('Fingerprinting failed, using anonymous:', e)
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('qr_scan_events').insert({
          profile_id: profile.id,
          device_type: device.toLowerCase(),
          browser: 'Webview/Browser',
          os: navigator.platform,
          scanner_fp: fp,
          scanned_at: new Date().toISOString(),
          scanner_id: user?.id
        })

        // 4. Trigger Push Notification asynchronously
        if (profile.user_id) {
          supabase.functions.invoke('send-push-notification', {
            body: {
              userId: profile.user_id,
              title: 'New Scan Alert! 🔥',
              body: `Someone just scanned your KnoWMi profile using a ${device}!`,
              url: '/dashboard'
            }
          }).catch(err => console.error('Failed to trigger push notification:', err));
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
