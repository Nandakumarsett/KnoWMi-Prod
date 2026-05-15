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
  const [showVerification, setShowVerification] = useState(false)
  const [tempUser, setTempUser] = useState(null)

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
    setShowVerification(false)
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
    setTempUser({ email: email.trim(), name: firstName.trim() })
    setShowVerification(true)
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
                  KnoW<span style={{ color: 'var(--saffron)' }}>M</span>i
                </span>
              </div>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
              {showVerification ? 'Verification Required' : tab === 'signup' ? 'Create your identity' : tab === 'forgot' ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '6px' }}>
              {showVerification ? 'Verify your account via WhatsApp' : tab === 'signup' ? 'Join 12,000+ wearers across India' : tab === 'forgot' ? 'We will send you a reset link' : 'Continue to your KnoWMi'}
            </p>
          </div>

          {showVerification ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Final Step!</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                To prevent spam and protect our community, we verify all new accounts via WhatsApp. Click the button below to send us your verification request.
              </p>
              <a
                href={`https://wa.me/917981325397?text=${encodeURIComponent(`Hi KnoWMi! Please verify my account.\nName: ${tempUser?.name}\nEmail: ${tempUser?.email}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm text-white transition-all mb-4"
                style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Verify on WhatsApp
              </a>
              <button onClick={onClose} className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-all mt-4 block mx-auto">
                I'll verify later, take me home
              </button>
            </div>
          ) : (
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
          )}
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
