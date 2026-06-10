import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    setProfile(data)
    return data
  }

  // Send welcome email — only on first signup (created_at ≈ last_sign_in_at)
  const maybeSendWelcomeEmail = async (authUser) => {
    try {
      const createdAt = new Date(authUser.created_at).getTime()
      const lastSignIn = new Date(authUser.last_sign_in_at || authUser.created_at).getTime()
      const isFirstLogin = Math.abs(createdAt - lastSignIn) < 10_000 // within 10 seconds

      if (!isFirstLogin) return

      // Check if we already sent a welcome email (flag stored in profile metadata)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('welcome_email_sent, first_name, last_name')
        .eq('user_id', authUser.id)
        .single()

      if (profileData?.welcome_email_sent) return

      const firstName = profileData?.first_name || authUser.user_metadata?.first_name || 'there'

      // Invoke the send-email edge function
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'welcome',
          to: authUser.email,
          toName: firstName,
          data: {
            firstName,
            email: authUser.email,
          }
        }
      })

      // Mark welcome email as sent so we never send it again
      await supabase
        .from('profiles')
        .update({ welcome_email_sent: true })
        .eq('user_id', authUser.id)

    } catch (err) {
      // Non-critical — never block auth flow
      console.warn('Welcome email could not be sent:', err?.message)
    }
  }

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) fetchProfile(currentUser.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser.id)
        // Send welcome email on SIGNED_IN (covers both email+password and OAuth)
        if (event === 'SIGNED_IN') {
          maybeSendWelcomeEmail(currentUser)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithOtp = async (data) => supabase.auth.signInWithOtp(data)
  const verifyOtp = async (data) => supabase.auth.verifyOtp(data)

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = () => {
    if (user) fetchProfile(user.id)
  }

  const role = profile?.role || 'customer'
  const isOwner = role === 'owner'
  const isStaff = ['owner', 'ambassador', 'collaborator'].includes(role)
  const isVerified = profile?.is_verified === true

  const value = {
    user,
    profile,
    loading,
    role,
    isOwner,
    isStaff,
    isVerified,
    signInWithOtp,
    verifyOtp,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
