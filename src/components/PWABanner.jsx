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
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl"
      style={{
        transform: 'translateX(-50%)',
        background: 'var(--ink)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '420px',
        width: 'calc(100% - 32px)',
        animation: 'fadeUp 0.5s ease',
      }}
      role="banner"
      aria-label="Install KnoWMi app"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #FF9933, #138808)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="9" height="9" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="13" y="2" width="9" height="9" rx="1.5" fill="white" opacity="0.7"/>
          <rect x="2" y="13" width="9" height="9" rx="1.5" fill="white" opacity="0.7"/>
          <rect x="13" y="13" width="9" height="9" rx="1.5" fill="white" opacity="0.9"/>
        </svg>
      </div>
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
