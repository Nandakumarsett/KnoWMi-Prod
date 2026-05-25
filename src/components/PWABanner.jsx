import { useState, useEffect } from 'react'

export default function PWABanner() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
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
      if (outcome === 'accepted') setShow(false)
      setDeferredPrompt(null)
    } else {
      window.open('https://knowmi.in', '_blank')
    }
  }

  return (
    <div
      className="fixed top-24 left-1/2 z-[150] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl"
      style={{
        transform: 'translateX(-50%)',
        background: 'var(--ink)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '420px',
        width: 'calc(100% - 32px)',
        animation: 'fadeDown 0.5s ease',
      }}
      role="banner"
      aria-label="Install KnoWMi app"
    >
      <img 
        src="/favicon.png" 
        alt="KnoWMi Logo" 
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-white">Add KnoWMi to Home Screen</div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Install the app for instant access</div>
      </div>
      <button onClick={install} className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 active:scale-95" style={{ background: 'linear-gradient(135deg, #FF9933, #E07A00)' }}>
        Install
      </button>
      <button onClick={() => setShow(false)} className="flex-shrink-0 p-1.5 rounded-lg text-xs" style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent' }} aria-label="Dismiss install banner">
        X
      </button>
    </div>
  )
}
