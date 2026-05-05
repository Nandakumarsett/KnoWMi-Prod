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
      const { data: { session } } = await supabase.auth.getSession()
      if (!active) return
      
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) await fetchProfile(currentUser.id)
      setLoading(false)
    }

    loadInitial()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) await fetchProfile(currentUser.id)
      else setProfile(null)
      setLoading(false)
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
