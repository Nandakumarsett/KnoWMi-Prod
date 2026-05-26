import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ open, onClose, onSuccess, redirectAfter, defaultTab = 'signup' }) {
  const [tab, setTab] = useState(defaultTab) // signup, signin, forgot
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
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
      setError(''); 
      setSuccessMsg('');
      setPassword(''); 
      setTab(defaultTab) 
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
    // Save intent so we can show the "Welcome Back" message if they try to sign up with an existing email
    localStorage.setItem('pending_auth_type', tab)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account'
        }
      }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!firstName.trim()) { setError('Please enter your User Name'); return }
    if (!email.trim().includes('@')) { setError('Please enter a valid email'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setError('')

    // 1. Check if User Name (first_name) already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('first_name', firstName.trim())
      .maybeSingle();

    if (existingUser) {
      setError('User Name exists, Please try another.');
      setLoading(false);
      return;
    }

    // 2. Resolve referral code to an ID if provided
    let invitedById = null;
    if (referralCode.trim()) {
      const code = referralCode.trim().toUpperCase()
      // Try wm_code
      const { data: wmMatch } = await supabase.from('profiles').select('id').eq('wm_code', code).single()
      if (wmMatch) {
        invitedById = wmMatch.id
      }
    }
    
    // 3. Create user in Supabase Auth (Trigger handles profile creation)
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { 
        data: { 
          first_name: firstName.trim(),
          invited_by: invitedById
        } 
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setTab('signin')
    setSuccessMsg('✅ Account created! Please check your email for the verification link.')
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password) { setError('Please enter your password'); return }

    setLoading(true)
    setError('')

    // Auto-append domain for team members logging in with just a username
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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to KnoWMi"
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
          animation: 'authPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--sf), var(--gold))' }} />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--paper2)', color: 'var(--muted)', fontSize: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--sf)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper2)'; e.currentTarget.style.color = 'var(--muted)' }}
          aria-label="Close"
        >✕</button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <img src="/logo-square.png" alt="Logo" className="h-10 w-auto object-contain" />
              <div className="relative inline-block">
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '42px',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    color: 'var(--ink)',
                    letterSpacing: '-0.06em'
                  }}
                >
                  Kno<span style={{ color: 'var(--saffron)' }}>WM</span>i
                </span>
              </div>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
              {tab === 'signup' ? 'Create your identity' : tab === 'forgot' ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '6px' }}>
              {tab === 'signup' ? 'Join 12,000+ wearers across India' : tab === 'forgot' ? 'We will send you a reset link' : 'Continue to your KnoWMi'}
            </p>
          </div>

          <>
            {/* Tab toggle */}
          {tab !== 'forgot' && (
            <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1.5px solid var(--border)', background: 'var(--paper2)' }}>
              {['signup', 'signin'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccessMsg('') }}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: tab === t ? 'var(--sf)' : 'transparent',
                    color: tab === t ? '#fff' : 'var(--muted)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                  {t === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>
          )}

          {/* Google Login */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-sm transition-all border-2 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200"
              style={{ color: 'var(--ink)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-neutral-400 font-bold tracking-widest">or email</span></div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium" 
              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>
              {error}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium" 
              style={{ background: 'rgba(19,136,8,0.08)', color: '#138808', border: '1px solid rgba(19,136,8,0.15)' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={tab === 'signup' ? handleSignUp : tab === 'forgot' ? handleForgotPassword : handleSignIn} className="flex flex-col gap-3">
            {/* Name field - only for signup */}
            {tab === 'signup' && (
              <input
                type="text"
                placeholder="User Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '1.5px solid var(--border)', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--sf)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,123,26,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                autoComplete="given-name"
              />
            )}

            {/* Email / Username */}
            <input
              type={tab === 'signup' || tab === 'forgot' ? 'email' : 'text'}
              placeholder={tab === 'signup' || tab === 'forgot' ? 'Email address' : 'Email or Username'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1.5px solid var(--border)', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--sf)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,123,26,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              autoComplete="email"
            />

            {/* Password */}
            {tab !== 'forgot' && (
              <div className="relative">
                <input
                  type="password"
                  placeholder={tab === 'signup' ? 'Create password (min 6 chars)' : 'Password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: '1.5px solid var(--border)', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--sf)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,123,26,0.12)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                />
                {tab === 'signin' && (
                  <button 
                    type="button" 
                    onClick={() => { setTab('forgot'); setError(''); setSuccessMsg('') }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--sf)] hover:underline"
                  >
                    FORGOT?
                  </button>
                )}
              </div>
            )}

            {/* Referral Code (Optional) */}
            {tab === 'signup' && (
              <input
                type="text"
                placeholder="Referral Code (Optional)"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '1.5px solid var(--border)', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--sf)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,123,26,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all mt-1"
              style={{
                background: 'linear-gradient(135deg, var(--sf), var(--gold))',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 4px 16px rgba(224,123,26,0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? (tab === 'signup' ? 'Creating account...' : tab === 'forgot' ? 'Sending link...' : 'Signing in...')
                : (tab === 'signup' ? 'Create Account →' : tab === 'forgot' ? 'Send Reset Link' : 'Sign In →')
              }
            </button>
            
            {tab === 'forgot' && (
              <button 
                type="button" 
                onClick={() => setTab('signin')} 
                className="text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] mt-2"
              >
                ← Back to Sign In
              </button>
            )}
          </form>

          <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '16px', lineHeight: 1.6 }}>
            By continuing, you agree to KnoWMi's{' '}
            <a href="/legal#terms" style={{ color: 'var(--sf)', textDecoration: 'underline' }}>Terms</a> &{' '}
            <a href="/legal#privacy" style={{ color: 'var(--sf)', textDecoration: 'underline' }}>Privacy Policy</a>
          </p>
          </>
        </div>

        <style>{`
          @keyframes authPop {
            from { transform: scale(0.92) translateY(20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
