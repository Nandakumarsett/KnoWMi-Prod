import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ open, onClose, onSuccess, redirectAfter, defaultTab = 'signup' }) {
  const [tab, setTab] = useState(defaultTab) // signup, signin, forgot
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
      setError(''); 
      setSuccessMsg('');
      setPassword(''); 
      setAgreeTerms(false);
      const isClaiming = localStorage.getItem('knowmi_pending_claim');
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
    if (tab === 'signup' && !agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to register.');
      return;
    }
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
    if (!agreeTerms) { setError('You must agree to the Terms of Service and Privacy Policy to register.'); return }

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
    
    console.log("Supabase Auth SignUp Response:", response)
    const { data: authData, error: signUpError } = response

    if (signUpError) {
      console.error("SignUp Error:", signUpError)
      setError(signUpError.message)
      setLoading(false)
      return
    }

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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to KnoWMi"
    >
      <div
        className="relative w-full max-w-md bg-[#1a1a1a] rounded-xl overflow-hidden border-[3px] border-white shadow-[8px_8px_0px_#F97316]"
        style={{
          animation: 'authPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Top accent bar */}
        <div className="h-2 w-full bg-orange-500 border-b-[3px] border-white" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white border-[2px] border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          aria-label="Close"
        >✕</button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-4xl font-black tracking-tighter text-white leading-none">
                Kno<span className="text-orange-500">WM</span>i
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide text-white">
              {tab === 'signup' ? 'Create Identity' : tab === 'forgot' ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p className="text-xs font-bold text-neutral-400 mt-2 uppercase tracking-widest">
              {tab === 'signup' ? 'Join 12,000+ wearers across India' : tab === 'forgot' ? 'We will send you a reset link' : 'Continue to your KnoWMi'}
            </p>
          </div>

          <>
            {/* Tab toggle */}
          {tab !== 'forgot' && !localStorage.getItem('knowmi_pending_claim') && (
            <div className="flex rounded-lg overflow-hidden mb-6 border-[3px] border-white bg-[#0a0a0a]">
              {['signup', 'signin'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccessMsg('') }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-orange-500 text-black border-none' : 'text-neutral-400 hover:text-white'}`}>
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
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border-[3px] border-black rounded-xl text-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
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
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t-[3px] border-white/20"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a1a1a] px-3 text-white font-black tracking-widest">or email</span></div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wide bg-red-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000]">
              {error}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wide bg-green-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000]">
              {successMsg}
            </div>
          )}

          <form onSubmit={tab === 'signup' ? handleSignUp : tab === 'forgot' ? handleForgotPassword : handleSignIn} className="flex flex-col gap-4">
            {/* Name field - only for signup */}
            {tab === 'signup' && (
              <input
                type="text"
                placeholder="USER NAME"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-[3px] border-black rounded-lg outline-none focus:shadow-[4px_4px_0px_#F97316] transition-shadow"
                autoComplete="given-name"
              />
            )}

            {/* Email / Username */}
            <input
              type={tab === 'signup' || tab === 'forgot' ? 'email' : 'text'}
              placeholder={tab === 'signup' || tab === 'forgot' ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-[3px] border-black rounded-lg outline-none focus:shadow-[4px_4px_0px_#F97316] transition-shadow"
              autoComplete="email"
            />

            {/* Password */}
            {tab !== 'forgot' && (
              <div className="relative">
                <input
                  type="password"
                  placeholder={tab === 'signup' ? 'CREATE PASSWORD (MIN 6 CHARS)' : 'PASSWORD'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-[3px] border-black rounded-lg outline-none focus:shadow-[4px_4px_0px_#F97316] transition-shadow"
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                />
                {tab === 'signin' && (
                  <button 
                    type="button" 
                    onClick={() => { setTab('forgot'); setError(''); setSuccessMsg('') }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-black hover:bg-orange-500 px-2 py-1 rounded-sm transition-colors"
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
                placeholder="REFERRAL CODE (OPTIONAL)"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-[3px] border-black rounded-lg outline-none focus:shadow-[4px_4px_0px_#F97316] transition-shadow"
              />
            )}

             {/* Terms Checkbox */}
             {tab === 'signup' && (
               <label className="flex items-start gap-3 cursor-pointer select-none text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-2 leading-relaxed text-left">
                 <input
                   type="checkbox"
                   required
                   checked={agreeTerms}
                   onChange={e => setAgreeTerms(e.target.checked)}
                   className="mt-0.5 w-4 h-4 accent-orange-500 rounded border-2 border-white bg-black checked:bg-orange-500 checked:border-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                 />
                 <span className="flex-1">
                   I agree to KnoWMi's{' '}
                   <a href="/legal#terms" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 underline decoration-2">Terms</a>
                   {' '}and{' '}
                   <a href="/legal#privacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 underline decoration-2">Privacy Policy</a>
                 </span>
               </label>
             )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading
                ? (tab === 'signup' ? 'CREATING...' : tab === 'forgot' ? 'SENDING...' : 'SIGNING IN...')
                : (tab === 'signup' ? 'CREATE ACCOUNT →' : tab === 'forgot' ? 'SEND RESET LINK' : 'SIGN IN →')
              }
            </button>
            
            {tab === 'forgot' && (
              <button 
                type="button" 
                onClick={() => setTab('signin')} 
                className="text-[10px] font-black text-white hover:text-orange-500 uppercase tracking-widest mt-2"
              >
                ← BACK TO SIGN IN
              </button>
            )}
          </form>

          <p className="text-[10px] font-bold text-neutral-500 text-center mt-6 uppercase tracking-widest">
            By continuing, you agree to KnoWMi's{' '}
            <a href="/legal#terms" className="text-white hover:text-orange-500 underline decoration-2">Terms</a> &{' '}
            <a href="/legal#privacy" className="text-white hover:text-orange-500 underline decoration-2">Privacy Policy</a>
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
