import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, role, is_verified, tier')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching auth profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Auth Profile Crash:', err)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      try {
        console.log('Auth: Loading initial session...')
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth: Session error:', error)
          if (active) setLoading(false)
          return
        }
        
        if (!active) return
        
        const session = data?.session
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          console.log('Auth: User found, fetching profile...', currentUser.id)
          await fetchProfile(currentUser.id)
        }
      } catch (err) {
        console.error('Auth: Crash in loadInitial:', err)
      } finally {
        if (active) {
          console.log('Auth: Initial load complete')
          setLoading(false)
        }
      }
    }

    loadInitial()

    const authResult = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        console.log('Auth: State change event:', _event)
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) await fetchProfile(currentUser.id)
        else setProfile(null)
      } catch (err) {
        console.error('Auth: Crash in onAuthStateChange:', err)
      } finally {
        setLoading(false)
      }
    })

    const subscription = authResult?.data?.subscription

    return () => {
      active = false
      if (subscription) subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async (data) => supabase.auth.signUp(data)
  const signIn = async (data) => supabase.auth.signInWithPassword(data)

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
