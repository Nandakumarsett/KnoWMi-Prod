import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

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

    const handleStateChange = async (session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      // Immediately unblock the UI once we know the session status
      if (active) setLoading(false)

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
        if (active) setLoading(false)
      }
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth: Event', _event)
      if (active) await handleStateChange(session)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async (data) => supabase.auth.signUp(data)
  const signIn = async (data) => supabase.auth.signInWithPassword(data)

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProfileLoading(false)
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF6F0', color: '#C1440E', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #C1440E22', borderTopColor: '#C1440E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
