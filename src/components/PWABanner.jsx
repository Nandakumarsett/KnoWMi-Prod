import { useState, useEffect } from 'react'

export default function PWABanner() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // 1. Do not show if user previously dismissed it
    if (localStorage.getItem('pwa_dismissed') === 'true') {
      return
    }

    // 2. Do not show if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (isStandalone) {
      return
    }

    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Delay showing the banner to let the page load first
      setTimeout(() => setShow(true), 4000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
      }
      setDeferredPrompt(null)
    } else {
      window.open('https://knowmi.in', '_blank')
    }
  }

  const dismiss = () => {
    localStorage.setItem('pwa_dismissed', 'true')
    setShow(false)
  }

  return (
    <div
      className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-[150] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border-[3px] border-black animate-slideUp md:w-[420px]"
      style={{
        background: '#1a1a1a',
        boxShadow: '6px 6px 0px #000',
      }}
      role="banner"
      aria-label="Install KnoWMi app"
    >
      <img 
        src="/favicon.png" 
        alt="KnoWMi Logo" 
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-[2px] border-black"
      />
      <div className="flex-1 min-w-0">
        <div className="font-black text-xs text-white uppercase tracking-wider">Add KnoWMi to Home Screen</div>
        <div className="text-[10px] mt-0.5 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Install the app for instant access</div>
      </div>
      <button 
        onClick={install} 
        className="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-black border-[2px] border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-200 active:scale-95 cursor-pointer" 
        style={{ background: '#f97316' }}
      >
        Install
      </button>
      <button 
        onClick={dismiss} 
        className="flex-shrink-0 p-1.5 rounded-lg text-xs hover:text-white transition-colors cursor-pointer" 
        style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent' }} 
        aria-label="Dismiss install banner"
      >
        X
      </button>
    </div>
  )
}
