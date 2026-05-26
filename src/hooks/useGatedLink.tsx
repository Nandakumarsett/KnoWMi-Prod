import { useState } from 'react'
import { Lock, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Hook that gates external link navigation for unauthenticated visitors.
 * Returns { isGated, handleGatedClick, GateModal }
 */
export function useGatedLink() {
  const { user } = useAuth()
  const [showGate, setShowGate] = useState(false)
  const isGated = !user

  const handleGatedClick = (e: React.MouseEvent, url: string, onAllowed?: () => void) => {
    if (isGated) {
      e.preventDefault()
      e.stopPropagation()
      setShowGate(true)
      return
    }
    if (onAllowed) onAllowed()
  }

  const GateModal = () => {
    if (!showGate) return null
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowGate(false)}
      >
        <div
          className="bg-neutral-900 border border-neutral-800 rounded-[28px] p-8 max-w-sm w-full text-center relative shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setShowGate(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="w-16 h-16 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock size={30} />
          </div>

          <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight">
            Locked Network
          </h3>
          <p className="text-sm text-neutral-400 mb-7 leading-relaxed">
            Create a free KnoWMi account to unlock these links and save this connection.
          </p>

          <button
            onClick={() => {
              localStorage.setItem('return_to', window.location.pathname + window.location.search)
              window.location.href = '/?auth=signup'
            }}
            className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-95"
          >
            🚀 Create Free Account
          </button>

          <button
            onClick={() => {
              localStorage.setItem('return_to', window.location.pathname + window.location.search)
              window.location.href = '/?auth=login'
            }}
            className="w-full mt-3 py-3 bg-white/5 text-neutral-300 font-bold text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            Already have an account? Login →
          </button>
        </div>
      </div>
    )
  }

  return { isGated, handleGatedClick, GateModal, setShowGate }
}
