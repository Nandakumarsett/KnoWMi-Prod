import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getAccurateLocation } from '../lib/analytics/geolocation'
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
          let dbQuery = supabase.from('public_profiles').select('id, user_id, first_name, secure_slug')
          if (isUUID) {
            dbQuery = dbQuery.or(`id.eq.${code},secure_slug.eq.${code}`)
          } else {
            dbQuery = dbQuery.or(`wm_code.ilike.${code},wm_code.ilike.WM-${code},wm_code.ilike.PT-${code},secure_slug.eq.${code}`)
          }
          const res = await dbQuery.single()
          if (!res.error && res.data) foundProfile = res.data
          else profileError = res.error
        } catch (e) {}

        if (!foundProfile) {
          try {
            let fallbackQuery = supabase.from('public_profiles').select('id, first_name, secure_slug')
            if (isUUID) {
              fallbackQuery = fallbackQuery.or(`id.eq.${code},secure_slug.eq.${code}`)
            } else {
              fallbackQuery = fallbackQuery.or(`wm_code.ilike.${code},wm_code.ilike.WM-${code},wm_code.ilike.PT-${code},secure_slug.eq.${code}`)
            }
            const res = await fallbackQuery.single()
            if (!res.error && res.data) foundProfile = res.data
            else profileError = res.error || new Error('Profile not found')
          } catch (e) {
            profileError = e
          }
        }

        if (profileError || !foundProfile) {
          console.error('Profile not found for code:', code, profileError)
          navigate('/')
          return
        }

        setProfile(foundProfile)
        setStatus('requesting_location')
      } catch (err) {
        console.error('Error fetching profile:', err)
        navigate('/')
      }
    }

    fetchProfile()
  }, [code, navigate])

  const finishScan = async (resolvedCity, resolvedCountry) => {
    setStatus('redirecting')
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
        const { buildFingerprint } = await import('../lib/analytics/fingerprint')
        fp = await buildFingerprint()
      } catch (e) {}
      
      const { data: { user } } = await supabase.auth.getUser();
      
      try {
        await supabase.from('qr_scan_events').insert({
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
      } catch (e) {}

      if (profile.user_id) {
        supabase.functions.invoke('send-push-notification', {
          body: {
            userId: profile.user_id,
            title: 'New Scan Alert! 🔥',
            body: `Someone just scanned your KnoWMi profile using a ${device} in ${resolvedCity}!`,
            url: '/dashboard',
            metadata: { device, city: resolvedCity }
          }
        }).catch(() => {});
      }

      const finalSlug = profile.secure_slug || profile.id
      navigate(`/p/${finalSlug}?src=qr`)
    } catch (e) {
      navigate('/')
    }
  }

  const handleAllowLocation = async () => {
    setStatus('redirecting')
    if (!navigator.geolocation) {
      finishScan('Unknown', 'India')
      return
    }
    
    try {
      const position = await getAccurateLocation({ timeout: 10000, maximumAge: 0, enableHighAccuracy: true })
      const { latitude, longitude } = position.coords
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
      if (res.ok) {
        const data = await res.json()
        const city = data.city || data.locality || 'Unknown'
        const country = data.countryName || 'India'
        finishScan(city !== 'Unknown' ? city : 'Unknown', country)
        return
      }
      finishScan('Unknown', 'India')
    } catch (e) {
      finishScan('Unknown', 'India')
    }
  }

  const handleSkipLocation = () => {
    finishScan('Unknown', 'India')
  }

  if (status === 'requesting_location') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-md w-full bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-[32px] p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MapPin size={32} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-black mb-3">Accurate Analytics</h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            To provide 100% accurate scan analytics to the creator as outlined in our Privacy Policy, we request your location.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleAllowLocation}
              className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> Allow Location
            </button>
            <button
              onClick={handleSkipLocation}
              className="w-full py-4 bg-transparent border border-neutral-700 text-neutral-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <X size={16} /> Skip (Use Unknown)
            </button>
          </div>
        </div>
      </div>
    )
  }

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
