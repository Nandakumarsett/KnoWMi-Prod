import { useState } from 'react'
import { Lock, X, Sparkles, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Hook that gates external link navigation for unauthenticated visitors.
 * Returns { isGated, handleGatedClick, GateModal, handlePrivacyClick, PrivacyModal }
 */
export function useGatedLink() {
  const { user } = useAuth()
  const [showGate, setShowGate] = useState(false)
  const [showPrivacyGate, setShowPrivacyGate] = useState(false)
  const isGated = false; // Disable global signup gate so everyone can see all data when Privacy Mode is disabled

  const handleGatedClick = (e: React.MouseEvent, url: string, onAllowed?: () => void) => {
    if (isGated) {
      e.preventDefault()
      e.stopPropagation()
      setShowGate(true)
      return
    }
    if (onAllowed) onAllowed()
  }

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPrivacyGate(true)
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
              window.location.href = '/?auth=signin'
            }}
            className="w-full mt-3 py-3 bg-white/5 text-neutral-300 font-bold text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            Already have an account? Login →
          </button>
        </div>
      </div>
    )
  }

  const PrivacyModal = () => {
    if (!showPrivacyGate) return null

    if (user) {
      // Existing Customer - owner has privacy mode active
      return (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowPrivacyGate(false)}
        >
          <div
            className="bg-neutral-900 border-2 border-red-500/30 rounded-[32px] p-8 max-w-sm w-full text-center relative shadow-2xl shadow-red-500/10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPrivacyGate(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 bg-red-500/15 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <Shield size={30} />
            </div>

            <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight">
              Privacy Mode Enabled
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              The owner of this profile has enabled Privacy Mode to secure their private contact details. These communication channels are locked.
            </p>

            <button
              onClick={() => setShowPrivacyGate(false)}
              className="w-full py-4 bg-neutral-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-neutral-700 transition-all active:scale-95 cursor-pointer border border-neutral-700"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      )
    }

    // Guest Visitor - promote tee claiming
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setShowPrivacyGate(false)}
      >
        <div
          className="bg-neutral-900 border-2 border-orange-500/30 rounded-[32px] p-8 max-w-sm w-full text-center relative shadow-2xl shadow-orange-500/10"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setShowPrivacyGate(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="w-16 h-16 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
            <Sparkles size={30} />
          </div>

          <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight">
            Claim Your Tee
          </h3>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            This profile is locked under Privacy Mode. Secure your own KnoWMi physical product and claim your digital identity to unlock premium connection features.
          </p>

          <button
            onClick={() => {
              window.location.href = '/#pricing'
            }}
            className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer"
          >
            Get KnoWMi Tee 🚀
          </button>

          <button
            onClick={() => {
              localStorage.setItem('return_to', window.location.pathname + window.location.search)
              window.location.href = '/?auth=signup'
            }}
            className="w-full mt-3 py-3 bg-white/5 text-neutral-300 font-bold text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
          >
            Create Free Account
          </button>
        </div>
      </div>
    )
  }

  return { isGated, handleGatedClick, GateModal, handlePrivacyClick, PrivacyModal, setShowGate }
}
