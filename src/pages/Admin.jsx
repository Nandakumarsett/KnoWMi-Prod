import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import CatalogAdmin from '../components/CatalogAdmin'
import LeadsAdmin from '../components/LeadsAdmin'
import AnalyticsAdmin from '../components/AnalyticsAdmin'
import OrdersAdmin from '../components/OrdersAdmin'
import QRStudioAdmin from '../components/QRStudioAdmin'
import { createClient } from '@supabase/supabase-js'

// Separate client for creating users without logging the Owner out
const supabaseAdminGen = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

export default function Admin() {
  const { user, profile, role, isOwner, isStaff, profileLoading, signOut } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [tab, setTab] = useState('users')

  useEffect(() => {
    if (isStaff && !isOwner && tab === 'users') {
      setTab('referrals')
    }
  }, [isStaff, isOwner])

  const [newRole, setNewRole] = useState({ username: '', password: '', role: 'ambassador' })
  const [roleMsg, setRoleMsg] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => { if (isStaff) fetchData() }, [isStaff])

  // Self-healing: Ensure database role matches the hardcoded owner status
  useEffect(() => {
    if (isOwner && profile && profile.role !== 'owner') {
      supabase.from('profiles')
        .update({ role: 'owner', is_verified: true })
        .eq('id', profile.id)
        .then(({ error }) => {
          if (!error) {
            console.log('Admin: Database role synchronized successfully.')
            fetchData()
          }
        })
    }
  }, [isOwner, profile])

  const [fetchError, setFetchError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const { data, error } = await supabase.rpc('get_all_profiles')
      if (error) {
        console.error('Admin: RPC error, trying fallback select...', error)
        const { data: fallback, error: fError } = await supabase.from('profiles').select('*')
        if (fError) {
          setFetchError(fError.message)
          setUsers([])
        } else {
          setUsers(Array.isArray(fallback) ? fallback : [])
        }
      } else {
        setUsers(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Admin: Fetch catch error:', err)
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (p) => {
    if (!isOwner) return alert('Only Owner can modify payment status')
    setUpdating(p.id)
    const ns = p.status === 'paid' ? 'free' : 'paid'
    try {
      const { error } = await supabase.rpc('update_profile_admin', { 
        p_profile_id: p.id, 
        p_status: ns, 
        p_amount: p.amount_paid || 0 
      })
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === p.id ? { ...u, status: ns } : u))
    } catch (err) {
      alert(`Update failed: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const toggleVerification = async (u) => {
    if (!isOwner) return alert('Only Owner can verify profiles')
    setUpdating(u.id)
    try {
      const { error } = await supabase.from('profiles').update({ is_verified: !u.is_verified }).eq('id', u.id)
      if (error) throw error
      setUsers(prev => prev.map(item => item.id === u.id ? { ...item, is_verified: !u.is_verified } : item))
    } catch (err) {
      alert(`Verification update failed: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const updateAmount = async (id, amt) => {
    if (!isOwner) return
    const n = parseInt(amt) || 0
    try {
      const { error } = await supabase.rpc('update_profile_admin', { 
        p_profile_id: id, 
        p_status: n > 0 ? 'paid' : 'free', 
        p_amount: n 
      })
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === id ? { ...u, amount_paid: n, status: n > 0 ? 'paid' : 'free' } : u))
    } catch (err) {
      console.error('Update amount error:', err)
    }
  }

  const updateTier = async (id, newTier) => {
    if (!isOwner) return
    try {
      const { error } = await supabase.from('profiles').update({ tier: newTier }).eq('id', id)
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === id ? { ...u, tier: newTier } : u))
    } catch (err) {
      alert(`Tier update failed: ${err.message}`)
    }
  }

  const changeRole = async (id, newRoleVal) => {
    if (!isOwner) return
    try {
      const { error } = await supabase.rpc('update_profile_admin_role', { 
        p_profile_id: id, 
        p_new_role: newRoleVal 
      })
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRoleVal } : u))
    } catch (err) {
      alert(`Role change failed: ${err.message}`)
    }
  }

  const handleCreateTeamAccount = async (e) => {
    e.preventDefault()
    if (!newRole.username.trim() || newRole.password.length < 6) {
      setRoleMsg('Username required & Password min 6 chars')
      return
    }

    setCreating(true)
    setRoleMsg('')

    const genEmail = `${newRole.username.trim().toLowerCase()}@knowmi.in`

    // Create user in Auth
    const { data, error } = await supabaseAdminGen.auth.signUp({
      email: genEmail,
      password: newRole.password,
      options: { data: { first_name: newRole.username.trim() } }
    })

    if (error) {
      setRoleMsg(`Error: ${error.message}`)
      setCreating(false)
      return
    }

    // Insert into profiles
    if (data.user) {
      const { error: profileError } = await supabase.rpc('insert_profile_admin', {
        p_user_id: data.user.id,
        p_first_name: newRole.username.trim(),
        p_role: newRole.role
      })
      
      if (profileError) {
        setRoleMsg(`Profile Error: ${profileError.message}`)
      } else {
        setRoleMsg('✅ Account created successfully!')
        setNewRole({ username: '', password: '', role: 'ambassador' })
        fetchData() // Refresh list
      }
    }
    setCreating(false)
  }

  // Early returns for access control
  if (profileLoading && !isOwner) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/40">Verifying Authority</p>
      </div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center p-8">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>Admin Access</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Please sign in from the home page first.</p>
        <a href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>← Go to Home</a>
      </div>
    </div>
  )

  if (!isStaff) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center p-8">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Access Denied</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>You don't have admin privileges.</p>
        <a href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>← Back to Home</a>
      </div>
    </div>
  )

  const filtered = users.filter(u => (u.first_name || '').toLowerCase().includes(search.toLowerCase()))
  const customers = filtered.filter(u => !u.role || u.role === 'customer')
  const staff = filtered.filter(u => u.role && u.role !== 'customer')
  const stats = { total: users.length, paid: users.filter(u => u.status === 'paid').length, free: users.filter(u => u.status === 'free').length, revenue: users.reduce((s, u) => s + (u.amount_paid || 0), 0) }

  const roleBadge = { owner: { bg: '#dc2626', label: 'Owner' }, ambassador: { bg: '#2563eb', label: 'Ambassador' }, collaborator: { bg: '#7c3aed', label: 'Collaborator' }, customer: { bg: '#6b7280', label: 'Customer' } }
  const myBadge = roleBadge[role] || roleBadge.customer

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 md:px-6 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border2)' }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm" style={{ color: 'var(--muted)' }}>← Home</a>
            <h1 className="text-lg font-bold" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{profile?.first_name || user?.user_metadata?.first_name || 'Owner'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: myBadge.bg }}>{myBadge.label}</span>
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Sign out of Admin Panel?')) signOut()
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E5D5C4] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        {fetchError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>Permission Error or Network Issue: {fetchError}</span>
            </div>
            <button onClick={fetchData} className="px-3 py-1 rounded-lg bg-white border border-red-200 text-xs font-bold hover:bg-red-50 transition-colors">Retry Fetch</button>
          </div>
        )}

        {loading && users.length === 0 && (
          <div className="mb-6 p-12 text-center rounded-2xl bg-white border border-dashed border-neutral-200 animate-pulse">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">Establishing Secure Connection...</p>
            <p className="text-xs text-neutral-300 mt-2">Fetching global profile intelligence</p>
          </div>
        )}

        {/* Stats (Owner Only) */}
        {isOwner && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { l: 'Total Users', v: stats.total, c: 'var(--ink)' },
              { l: 'Paid', v: stats.paid, c: '#138808' },
              { l: 'Free', v: stats.free, c: '#E07A00' },
              { l: 'Revenue', v: `₹${stats.revenue.toLocaleString()}`, c: 'var(--sf)' },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>{s.l}</div>
                <div className="text-xl font-bold" style={{ color: s.c, fontFamily: 'Fraunces, serif' }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--off)', border: '1px solid var(--border2)' }}>
          {[
            ...(isOwner ? [
              { k: 'users', l: '👥 Customers' }, 
              { k: 'orders', l: '📦 Orders' },
              { k: 'qr_studio', l: '🖨️ QR Studio' },
              { k: 'team', l: '🛡️ Team' }, 
              { k: 'catalog', l: '👕 Catalog' }, 
              { k: 'leads', l: '📥 Leads' },
              { k: 'analytics', l: '📊 Analytics' },
              { k: 'create', l: '➕ Create Account' }
            ] : [{ k: 'referrals', l: '🔗 My Referrals' }])
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className="flex-1 min-w-[120px] py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap px-4"
              style={{ background: tab === t.k ? 'white' : 'transparent', color: tab === t.k ? 'var(--ink)' : 'var(--muted)', boxShadow: tab === t.k ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Customers tab (Owner Only) */}
        {tab === 'users' && isOwner && (
          <>
            <div className="flex gap-3 mb-4">
              <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 max-w-md px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: '1.5px solid var(--border)', background: 'white' }} />
              <button onClick={fetchData} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--off)', border: '1px solid var(--border)' }}>↻ Refresh</button>
            </div>
            {loading ? <div className="text-center py-12" style={{ color: 'var(--muted)' }}>Loading...</div> : (
              <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                {customers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 hover:bg-[var(--off)] transition-colors" style={{ borderBottom: '1px solid var(--border2)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>
                        {(u.first_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{u.first_name || 'Unknown'}</div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={u.amount_paid || 0} onBlur={e => updateAmount(u.id, e.target.value)}
                        className="w-16 px-2 py-1 rounded-lg text-xs text-center outline-none" style={{ border: '1px solid var(--border)', fontFamily: 'JetBrains Mono' }} />
                      <select defaultValue={u.tier || 'Elite'} onChange={e => updateTier(u.id, e.target.value)}
                        className="px-2 py-1.5 rounded-lg text-[11px] outline-none" style={{ border: '1px solid var(--border)', background: 'var(--off)' }}>
                        <option value="Starter">Starter</option>
                        <option value="Creator">Creator</option>
                        <option value="Pro">Pro</option>
                        <option value="Elite">Elite</option>
                        <option value="Founding">Founding</option>
                      </select>
                      <button onClick={() => toggleStatus(u)} disabled={updating === u.id}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{
                          background: u.status === 'paid' ? 'rgba(220,38,38,0.08)' : 'rgba(19,136,8,0.08)',
                          color: u.status === 'paid' ? '#dc2626' : '#138808' }}>
                        {u.status === 'paid' ? 'Set Free' : 'Mark Paid'}
                      </button>
                      <button onClick={() => toggleVerification(u)} disabled={updating === u.id}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{
                          background: u.is_verified ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                          color: u.is_verified ? '#3b82f6' : '#f59e0b' }}>
                        {u.is_verified ? 'Verified ✓' : 'Verify'}
                      </button>
                      {isOwner && (
                        <select defaultValue={u.role || 'customer'} onChange={e => changeRole(u.id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg text-[11px] outline-none" style={{ border: '1px solid var(--border)', background: 'var(--off)' }}>
                          <option value="customer">Customer</option>
                          <option value="ambassador">Ambassador</option>
                          <option value="collaborator">Collaborator</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
                {customers.length === 0 && <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>No customers found</div>}
              </div>
            )}
          </>
        )}

        {/* Team tab (owner only) */}
        {tab === 'team' && isOwner && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
            {staff.length === 0 && <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>No team members yet. Promote a customer from the Customers tab using the dropdown.</div>}
            {staff.map(a => {
              const r = roleBadge[a.role] || roleBadge.customer
              const myReferrals = users.filter(u => u.invited_by === a.id)
              return (
                <div key={a.id} className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border2)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: r.bg }}>{(a.first_name || '?').charAt(0)}</div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{a.first_name || 'Unknown'}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: r.bg }}>{r.label}</span>
                        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Ref: {a.wm_code || 'None'} ({myReferrals.length} invites)</span>
                      </div>
                    </div>
                  </div>
                  {a.role !== 'owner' && (
                    <button onClick={() => changeRole(a.id, 'customer')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
                      Remove from Team
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Create Account Tab (Owner Only) */}
        {tab === 'create' && isOwner && (
          <div className="max-w-md mx-auto rounded-xl p-6" style={{ background: 'white', border: '1px solid var(--border2)' }}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>Create Team Account</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Generate login credentials for Ambassadors.</p>
            </div>
            
            {roleMsg && (
              <div className="mb-4 p-3 rounded-lg text-sm text-center font-medium" 
                style={{ background: roleMsg.includes('✅') ? 'rgba(19,136,8,0.1)' : 'rgba(220,38,38,0.1)', color: roleMsg.includes('✅') ? '#138808' : '#dc2626' }}>
                {roleMsg}
              </div>
            )}

            <form onSubmit={handleCreateTeamAccount} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--ink)' }}>Username</label>
                <input type="text" value={newRole.username} onChange={e => setNewRole({...newRole, username: e.target.value.replace(/\s+/g, '')})}
                  placeholder="e.g. rahul" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--off)' }} />
              </div>
              
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--ink)' }}>Password</label>
                <input type="text" value={newRole.password} onChange={e => setNewRole({...newRole, password: e.target.value})}
                  placeholder="Min 6 characters" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--off)' }} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--ink)' }}>Role</label>
                <select value={newRole.role} onChange={e => setNewRole({...newRole, role: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer" style={{ border: '1px solid var(--border)', background: 'var(--off)' }}>
                  <option value="ambassador">Ambassador</option>
                  <option value="collaborator">Collaborator</option>
                </select>
              </div>

              <button type="submit" disabled={creating} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-2 transition-all"
                style={{ background: 'var(--ink)', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* My Referrals Tab (Staff Only) */}
        {tab === 'referrals' && !isOwner && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="rounded-xl p-6 text-center" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,153,51,0.1)' }}>
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--ink)' }}>Your WM-Code</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Share this code to track your invites.</p>
                <div className="px-4 py-3 rounded-lg text-lg font-bold tracking-widest" style={{ background: 'var(--off)', border: '1px dashed var(--border)', color: 'var(--sf)', fontFamily: 'JetBrains Mono' }}>
                  {profile?.wm_code || 'LOADING...'}
                </div>
              </div>

              {/* Earnings Stats */}
              <div className="rounded-xl p-6" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--ink)' }}>Referral Performance</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>Total Invites</span>
                    <span className="font-bold" style={{ color: 'var(--ink)' }}>{users.filter(u => u.invited_by === profile?.id).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>Paid Customers</span>
                    <span className="font-bold text-[#138808]">{users.filter(u => u.invited_by === profile?.id && u.status === 'paid').length}</span>
                  </div>
                  <div className="h-px w-full my-1" style={{ background: 'var(--border)' }}></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Estimated Earnings</span>
                    <span className="font-bold text-lg" style={{ color: 'var(--sf)' }}>
                      ₹{users.filter(u => u.invited_by === profile?.id && u.status === 'paid').length * 50}
                    </span>
                  </div>
                  <p className="text-[10px] text-center mt-2" style={{ color: 'var(--muted)' }}>*Calculated at ₹50 per paid referral</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                <div className="px-5 py-4 font-bold" style={{ borderBottom: '1px solid var(--border2)', color: 'var(--ink)' }}>
                  People You Invited
                </div>
                {users.filter(u => u.invited_by === profile?.id).length === 0 ? (
                  <div className="text-center py-12 text-sm" style={{ color: 'var(--muted)' }}>You haven't invited anyone yet.</div>
                ) : (
                  users.filter(u => u.invited_by === profile?.id).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border2)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>
                          {(u.first_name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{u.first_name}</div>
                          <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Joined {new Date(u.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{
                        background: u.status === 'paid' ? 'rgba(19,136,8,0.1)' : 'rgba(255,153,51,0.1)',
                        color: u.status === 'paid' ? '#138808' : '#E07A00',
                      }}>
                        {u.status === 'paid' ? '✓ Paid' : 'Free'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Catalog tab (Owner Only) */}
        {tab === 'catalog' && isOwner && (
          <CatalogAdmin />
        )}

        {/* Leads tab (Owner Only) */}
        {tab === 'leads' && isOwner && (
          <LeadsAdmin />
        )}

        {/* Orders tab (Owner Only) */}
        {tab === 'orders' && isOwner && (
          <OrdersAdmin />
        )}

        {/* QR Studio tab (Owner Only) */}
        {tab === 'qr_studio' && isOwner && (
          <QRStudioAdmin />
        )}

        {/* Analytics tab (Owner Only) */}
        {tab === 'analytics' && isOwner && (
          <AnalyticsAdmin users={users} />
        )}
      </div>
    </div>
  )
}
