import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'

export default function AuthModal({ open, onClose, onSuccess, redirectAfter, defaultTab = 'signup' }) {
  const [tab, setTab] = useState(defaultTab) // signup, signin, forgot
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (open) {
      setError('')
      setSuccessMsg('')
      setPassword('')
      setAgreeTerms(false)
      setShowEmailForm(false)
      const isClaiming = localStorage.getItem('knowmi_pending_claim')
      setTab(isClaiming ? 'signin' : defaultTab)
    }
  }, [open, defaultTab])

  const handleClose = () => {
    setError('')
    setSuccessMsg('')
    onClose()
  }

  if (!open) return null

  const handleGoogleLogin = async () => {
    setLoading(true)
    posthog.capture('google_auth_started', { intent: tab })
    localStorage.setItem('pending_auth_type', tab)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' }
      }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!firstName.trim()) { setError('Please enter your display name'); return }
    if (!email.trim().includes('@')) { setError('Please enter a valid email'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (!agreeTerms) { setError('Please agree to our Terms to continue.'); return }

    setLoading(true)
    setError('')

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('first_name', firstName.trim())
      .maybeSingle()

    if (existingUser) {
      setError('That display name is taken. Try another.')
      setLoading(false)
      return
    }

    let invitedById = null
    if (referralCode.trim()) {
      const code = referralCode.trim().toUpperCase()
      const { data: wmMatch } = await supabase.from('profiles').select('id').eq('wm_code', code).single()
      if (wmMatch) invitedById = wmMatch.id
    }

    const response = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          invited_by: invitedById,
          terms_accepted: true
        }
      }
    })

    const { error: signUpError } = response
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    posthog.capture('account_created', { has_referral: !!referralCode.trim() })
    setLoading(false)
    handleClose()
    onSuccess?.(redirectAfter)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password) { setError('Please enter your password'); return }

    setLoading(true)
    setError('')

    const loginEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@knowmi.in`
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password
    })

    if (signInError) {
      if (signInError.message.toLowerCase().includes('email not confirmed')) {
        setError('Please check your email and confirm your account first.')
      } else if (signInError.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    posthog.capture('signed_in', { method: 'email' })
    setLoading(false)
    handleClose()
    onSuccess?.(redirectAfter)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your registered email address')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccessMsg('✅ Reset link sent! Please check your email.')
    }
    setLoading(false)
  }

  const isClaiming = !!localStorage.getItem('knowmi_pending_claim')
  const isSignIn = tab === 'signin' || isClaiming
  const isForgot = tab === 'forgot'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to KnoWMi"
    >
      <div
        className="relative w-full sm:max-w-md bg-[#111] sm:rounded-2xl rounded-t-2xl overflow-hidden border-t-[3px] sm:border-[3px] border-white shadow-[0_0_60px_rgba(249,115,22,0.3)]"
        style={{ animation: 'authSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Orange accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="px-6 pt-6 pb-8">

          {/* Header */}
          <div className="text-center mb-7">
            <span className="text-3xl font-black tracking-tighter text-white leading-none">
              Kno<span className="text-orange-500">WM</span>i
            </span>
            {!isForgot && (
              <>
                <h2 className="text-xl font-black text-white mt-2">
                  {isSignIn ? 'Welcome back 👋' : 'Claim your identity'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isSignIn
                    ? 'Sign in to access your KnoWMi card'
                    : 'Your card is ready. Takes about 30 seconds.'}
                </p>
              </>
            )}
            {isForgot && (
              <h2 className="text-xl font-black text-white mt-2">Reset Password</h2>
            )}
          </div>

          {/* Sign In / Sign Up tab toggle (only when not claiming / not forgot) */}
          {!isForgot && !isClaiming && (
            <div className="flex rounded-xl overflow-hidden mb-6 border-2 border-white/10 bg-white/5 p-1 gap-1">
              {['signup', 'signin'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); setSuccessMsg(''); setShowEmailForm(false) }}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tab === t ? 'bg-orange-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                >
                  {t === 'signup' ? 'New here' : 'Sign In'}
                </button>
              ))}
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">
              {successMsg}
            </div>
          )}

          {/* ===== FORGOT PASSWORD FORM ===== */}
          {isForgot && (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/10 text-white placeholder-neutral-500 font-semibold text-sm border border-white/20 rounded-xl outline-none focus:border-orange-500 transition-colors"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-widest"
              >
                ← Back to sign in
              </button>
            </form>
          )}

          {/* ===== MAIN AUTH FLOW ===== */}
          {!isForgot && (
            <>
              {/* PRIMARY: Google Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                id="google-auth-btn"
                className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-2xl text-black font-black text-sm shadow-[0_4px_24px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_32px_rgba(249,115,22,0.6)] hover:-translate-y-[2px] active:translate-y-0 transition-all disabled:opacity-60 mb-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-orange-500 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{loading ? 'Connecting...' : `Continue with Google`}</span>
                {!loading && <span className="ml-auto text-xs text-gray-400 font-normal">Fastest ⚡</span>}
              </button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setShowEmailForm(v => !v)}
                    className="bg-[#111] px-3 text-[11px] text-neutral-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    {showEmailForm ? 'Hide email form ↑' : 'Use email instead ↓'}
                  </button>
                </div>
              </div>

              {/* SECONDARY: Email/Password form — collapsed by default */}
              {showEmailForm && (
                <form
                  onSubmit={isSignIn ? handleSignIn : handleSignUp}
                  className="flex flex-col gap-3"
                >
                  {!isSignIn && (
                    <input
                      type="text"
                      placeholder="Display Name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-neutral-500 font-semibold text-sm border border-white/20 rounded-xl outline-none focus:border-orange-500 transition-colors"
                      autoComplete="given-name"
                    />
                  )}

                  <input
                    type={!isSignIn ? 'email' : 'text'}
                    placeholder={!isSignIn ? 'Email Address' : 'Email or Username'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-neutral-500 font-semibold text-sm border border-white/20 rounded-xl outline-none focus:border-orange-500 transition-colors"
                    autoComplete="email"
                  />

                  <div className="relative">
                    <input
                      type="password"
                      placeholder={!isSignIn ? 'Create Password (min 6 chars)' : 'Password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-neutral-500 font-semibold text-sm border border-white/20 rounded-xl outline-none focus:border-orange-500 transition-colors"
                      autoComplete={!isSignIn ? 'new-password' : 'current-password'}
                    />
                    {isSignIn && (
                      <button
                        type="button"
                        onClick={() => { setTab('forgot'); setError(''); setSuccessMsg('') }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        FORGOT?
                      </button>
                    )}
                  </div>

                  {!isSignIn && (
                    <input
                      type="text"
                      placeholder="Referral Code (Optional)"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-neutral-500 font-semibold text-sm border border-white/20 rounded-xl outline-none focus:border-orange-500 transition-colors"
                    />
                  )}

                  {!isSignIn && (
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-neutral-400 leading-relaxed">
                      <input
                        type="checkbox"
                        required
                        checked={agreeTerms}
                        onChange={e => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer shrink-0"
                      />
                      <span>
                        I agree to KnoWMi's{' '}
                        <a href="/legal#terms" target="_blank" rel="noopener noreferrer" className="text-white underline">Terms</a>
                        {' '}and{' '}
                        <a href="/legal#privacy" target="_blank" rel="noopener noreferrer" className="text-white underline">Privacy Policy</a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-1 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                  >
                    {loading
                      ? (isSignIn ? 'SIGNING IN...' : 'CREATING...')
                      : (isSignIn ? 'SIGN IN →' : 'CREATE ACCOUNT →')
                    }
                  </button>
                </form>
              )}

              {/* Terms footnote */}
              <p className="text-[10px] text-neutral-600 text-center mt-5 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="/legal#terms" className="text-neutral-400 hover:text-white underline">Terms</a>
                {' '}&amp;{' '}
                <a href="/legal#privacy" className="text-neutral-400 hover:text-white underline">Privacy Policy</a>
              </p>
            </>
          )}
        </div>

        <style>{`
          @keyframes authSlideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @media (min-width: 640px) {
            @keyframes authSlideUp {
              from { transform: scale(0.94) translateY(20px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
          }
        `}</style>
      </div>
    </div>
  )
}
