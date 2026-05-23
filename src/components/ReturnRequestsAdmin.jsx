import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { AlertCircle, CheckCircle, Clock, RefreshCw, Eye, MessageSquare } from 'lucide-react'

const STATUS_STYLES = {
  pending:      { bg: 'rgba(245,158,11,0.1)',  color: '#D97706', label: '⏳ Pending' },
  under_review: { bg: 'rgba(59,130,246,0.1)',  color: '#2563EB', label: '🔍 Under Review' },
  approved:     { bg: 'rgba(16,185,129,0.1)',  color: '#059669', label: '✓ Approved' },
  rejected:     { bg: 'rgba(239,68,68,0.1)',   color: '#DC2626', label: '✗ Rejected' },
  resolved:     { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', label: '✅ Resolved' },
}

const ISSUE_LABELS = {
  defect: 'Manufacturing Defect',
  wrong_item: 'Wrong Item Delivered',
  qr_issue: 'QR Not Scanning',
  size_exchange: 'Size Exchange',
  other: 'Other',
}

export default function ReturnRequestsAdmin() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('return_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRequests(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase
      .from('return_requests')
      .update({ status, admin_notes: adminNote || undefined })
      .eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, admin_notes: adminNote || r.admin_notes } : r))
    setUpdating(null)
    setExpanded(null)
    setAdminNote('')
  }

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Requests', value: counts.total, color: 'var(--ink)' },
          { label: 'Pending', value: counts.pending, color: '#D97706' },
          { label: 'Approved', value: counts.approved, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--border2)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm" style={{ color: 'var(--ink)' }}>Return & Exchange Requests</h2>
        <button onClick={fetchRequests} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: 'var(--off)', border: '1px solid var(--border)' }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm" style={{ color: 'var(--muted)' }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'white', border: '1px dashed var(--border)' }}>
          <CheckCircle size={32} className="mx-auto mb-3 text-neutral-200" />
          <p className="text-sm font-bold" style={{ color: 'var(--muted)' }}>No return requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => {
            const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending
            const isExpanded = expanded === r.id
            return (
              <div key={r.id} className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
                <div className="flex items-start justify-between p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-black" style={{ color: 'var(--ink)', fontFamily: 'JetBrains Mono' }}>
                        {r.order_number || r.order_id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: style.bg, color: style.color }}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                        {ISSUE_LABELS[r.issue_type] || r.issue_type}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{r.description}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--off)', border: '1px solid var(--border)' }}>
                    <Eye size={12} /> {isExpanded ? 'Close' : 'Review'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-4" style={{ borderColor: 'var(--border2)', background: 'var(--off)' }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Description</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{r.description}</p>
                      </div>
                      {r.video_url && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Unboxing Video</p>
                          <a href={r.video_url} target="_blank" rel="noopener noreferrer" title="Opens in a new tab"
                            className="text-sm font-bold text-orange-500 hover:underline break-all">
                            View Video ↗
                          </a>
                        </div>
                      )}
                      {r.admin_notes && (
                        <div className="col-span-2">
                          <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Previous Admin Notes</p>
                          <p className="text-sm text-neutral-600">{r.admin_notes}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                        Admin Notes (optional)
                      </label>
                      <textarea
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        placeholder="Reason for approval/rejection, instructions to customer..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                        style={{ border: '1px solid var(--border)', background: 'white' }}
                      />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {['under_review', 'approved', 'rejected', 'resolved'].map(s => {
                        if (s === r.status) return null
                        const st = STATUS_STYLES[s]
                        return (
                          <button key={s}
                            disabled={updating === r.id}
                            onClick={() => updateStatus(r.id, s)}
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{ background: st.bg, color: st.color, opacity: updating === r.id ? 0.7 : 1 }}>
                            Mark as {STATUS_STYLES[s].label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
