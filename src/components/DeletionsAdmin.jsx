import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, AlertCircle, CheckCircle, RefreshCw, Clock, XCircle } from 'lucide-react'

const STATUS_STYLES = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#D97706', label: '⏳ Pending' },
  processing: { bg: 'rgba(59,130,246,0.1)',  color: '#2563EB', label: '⚙️ Processing' },
  completed: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', label: '🚨 Deleted' },
  cancelled: { bg: 'rgba(16,185,129,0.1)',  color: '#059669', label: '✓ Restored' },
}

export default function DeletionsAdmin() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)
  const [activeFilter, setActiveFilter] = useState('pending')

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('deletion_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRequests(data || [])
    setLoading(false)
  }

  const handleDeleteUser = async (reqId, userId, userEmail) => {
    const confirmation = window.prompt(
      `⚠️ NUCLEAR ACTION ⚠️\n\nThis will permanently delete user account "${userEmail}" from Supabase Auth.\nThis action cannot be undone and will permanently wipe their profile and scan history.\n\nType DELETE to confirm:`
    )
    
    if (confirmation !== 'DELETE') return

    setActioning(reqId)
    try {
      // 1. Send confirmation email to user before permanent deletion
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'deletion_completed',
            to: userEmail,
            toName: '',
            data: { email: userEmail }
          }
        })
      } catch (emailErr) {
        console.error('Failed to send deletion confirmation email:', emailErr)
      }

      // 2. Perform the database deletion RPC
      const { error } = await supabase.rpc('delete_user_admin', { 
        p_user_id: userId, 
        p_request_id: reqId 
      })

      if (error) throw error

      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'completed', processed_at: new Date().toISOString() } : r))
      alert(`User ${userEmail} was successfully deleted.`)
    } catch (err) {
      console.error(err)
      alert(`Delete failed: ${err.message || 'Please try again.'}`)
    } finally {
      setActioning(null)
    }
  }

  const handleCancelRequest = async (reqId, profileId) => {
    if (!window.confirm('Cancel this deletion request and restore the user to normal?')) return

    setActioning(reqId)
    try {
      // 1. Update status
      const { error: requestErr } = await supabase
        .from('deletion_requests')
        .update({ status: 'cancelled', processed_at: new Date().toISOString() })
        .eq('id', reqId)

      if (requestErr) throw requestErr

      // 2. Reactivate tokens
      if (profileId) {
        await supabase
          .from('qr_tokens')
          .update({ is_active: true })
          .eq('profile_id', profileId)
      }

      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'cancelled' } : r))
    } catch (err) {
      console.error(err)
      alert('Failed to cancel request')
    } finally {
      setActioning(null)
    }
  }

  const filtered = requests.filter(r => r.status === activeFilter)

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Requests', value: counts.total, color: '#ffffff' },
          { label: '⏳ Pending', value: counts.pending, color: '#D97706' },
          { label: '🚨 Deleted', value: counts.completed, color: '#DC2626' },
          { label: '✓ Restored', value: counts.cancelled, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 bg-[#1a1a1a] border-[3px] border-white rounded-xl shadow-[4px_4px_0px_#fff]">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-neutral-400 font-bold">{s.label}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/20 pb-px">
        {['pending', 'completed', 'cancelled'].map(t => (
          <button
            key={t}
            onClick={() => setActiveFilter(t)}
            className={`pb-3 text-xs font-black uppercase tracking-widest border-b-2 px-1 transition-all ${activeFilter === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-neutral-400 hover:text-neutral-400'}`}
          >
            {t} Requests ({counts[t]})
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white">Account Deletion Queue</h2>
        <button onClick={fetchRequests} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: 'var(--off)', border: '1px solid var(--border)' }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-neutral-400 font-bold">Loading queue...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'white', border: '1px dashed var(--border)' }}>
          <CheckCircle size={32} className="mx-auto mb-3 text-neutral-200" />
          <p className="text-sm font-bold text-neutral-400 font-bold">No requests in this queue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending
            const isPending = r.status === 'pending'
            return (
              <div key={r.id} className="rounded-xl overflow-hidden p-5 bg-[#1a1a1a] border-[3px] border-white rounded-xl shadow-[4px_4px_0px_#fff]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-black text-red-600">
                        {r.email}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: style.bg, color: style.color }}>
                        {style.label}
                      </span>
                      <span className="text-[9px] font-black text-neutral-300 font-mono bg-[#1a1a1a] px-2 py-0.5 rounded-md">ID: {r.id.slice(0, 8)}</span>
                    </div>
                    {r.reason && (
                      <p className="text-xs text-neutral-400 font-bold font-medium bg-neutral-50/50 border border-white/20 p-2.5 rounded-lg">
                        <strong>Reason:</strong> {r.reason}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock size={12} /> Requested: {new Date(r.created_at).toLocaleDateString()}</span>
                      {r.processed_at && (
                        <span>• Processed: {new Date(r.processed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  {isPending && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleCancelRequest(r.id, r.user_id)}
                        disabled={actioning === r.id}
                        className="px-3.5 py-2 hover:bg-[#1a1a1a] rounded-xl text-xs font-bold transition-all border border-white/20"
                      >
                        Cancel & Restore
                      </button>
                      <button
                        onClick={() => handleDeleteUser(r.id, r.user_id, r.email)}
                        disabled={actioning === r.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[4px_4px_0px_#fff] shadow-red-600/10"
                      >
                        <Trash2 size={13} />
                        Permanently Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
