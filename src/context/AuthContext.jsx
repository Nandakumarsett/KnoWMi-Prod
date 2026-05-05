import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      setProfileLoading(false)
      return
    }
    
    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, role, is_verified, tier')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Auth: Profile fetch error:', err)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const fetchingUserId = { current: null }

    // Fail-safe: ensure loading screen disappears after 2 seconds no matter what
    const failSafe = setTimeout(() => {
      if (active && loading) {
        console.warn('Auth: Fail-safe triggered - forcing loading false')
        setLoading(false)
      }
    }, 2000)

    const handleStateChange = async (session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      // Immediately unblock the UI once we know the session status
      if (active) {
        setLoading(false)
        clearTimeout(failSafe)
      }

      if (currentUser && fetchingUserId.current !== currentUser.id) {
        fetchingUserId.current = currentUser.id
        await fetchProfile(currentUser.id)
      } else if (!currentUser) {
        fetchingUserId.current = null
        setProfile(null)
        setProfileLoading(false)
      }
    }

    // Initialize session and set up listener
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (active) await handleStateChange(session)
      } catch (e) {
        console.error('Auth: Init error:', e)
        if (active) setLoading(false)
      }
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth: Event', event)
      if (active) await handleStateChange(session)
    })

    return () => {
      active = false
      subscription.unsubscribe()
      clearTimeout(failSafe)
    }
  }, [fetchProfile])

  const signUp = async (data) => supabase.auth.signUp(data)
  const signIn = async (data) => supabase.auth.signInWithPassword(data)

  const signOut = useCallback(async () => {
    // 1. Mark as exiting to prevent any loading screens from re-triggering
    setIsExiting(true)
    
    // 2. Optimistic cleanup: immediately clear state to unblock UI
    setUser(null)
    setProfile(null)
    setProfileLoading(false)
    setLoading(false) // Just in case
    
    try {
      // 3. Clear Supabase session
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Auth: SignOut Error:', err)
    } finally {
      // Small delay then reset exiting state
      setTimeout(() => { if (setIsExiting) setIsExiting(false) }, 1000)
    }
  }, [])

  const refreshProfile = () => {
    if (user) fetchProfile(user.id)
  }

  const OWNER_EMAIL = 'nandakumarsettivanyam@gmail.com'
  const isHardcodedOwner = user?.email === OWNER_EMAIL

  const role = isHardcodedOwner ? 'owner' : (profile?.role || 'customer')
  const isOwner = role === 'owner'
  const isStaff = isHardcodedOwner || ['owner', 'ambassador', 'collaborator'].includes(role)
  const isVerified = isHardcodedOwner || profile?.is_verified === true

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    role,
    isOwner,
    isStaff,
    isVerified,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  // Only show the global loader on INITIAL load, and NEVER during sign out
  if (loading && !isExiting) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF6F0', color: '#C1440E', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #C1440E22', borderTopColor: '#C1440E', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '10px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Loading Protocol...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
