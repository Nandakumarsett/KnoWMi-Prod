import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Send, Megaphone, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const POLICIES = [
  { value: 'Privacy Policy', url: 'https://knowmi.in/legal#privacy' },
  { value: 'Terms of Service', url: 'https://knowmi.in/legal#terms' },
  { value: 'Returns & Exchanges Policy', url: 'https://knowmi.in/legal#refund' },
  { value: 'Shipping Policy', url: 'https://knowmi.in/legal#shipping' },
]

export default function BroadcastAdmin() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    policy_name: 'Privacy Policy',
    summary: '',
    effective_date: '',
    policy_url: 'https://knowmi.in/legal#privacy',
  })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [broadcasts, setBroadcasts] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    fetchHistory()
    // Set default effective date to 7 days from now
    const d = new Date()
    d.setDate(d.getDate() + 7)
    setForm(f => ({ ...f, effective_date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }))
  }, [])

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('email_broadcasts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setBroadcasts(data || [])
    setLoadingHistory(false)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.summary.trim() || !form.effective_date.trim()) return

    const confirmed = window.confirm(
      `⚠️ This will send a policy update email to ALL registered users.\n\nPolicy: ${form.policy_name}\nEffective: ${form.effective_date}\n\nProceed?`
    )
    if (!confirmed) return

    setSending(true)
    setResult(null)

    try {
      const { data, error } = await supabase.functions.invoke('broadcast-email', {
        body: {
          policy_name: form.policy_name,
          summary: form.summary,
          effective_date: form.effective_date,
          policy_url: form.policy_url,
          caller_user_id: user?.id,
        }
      })

      if (error) throw error
      setResult({ success: true, sent: data.sent, failed: data.failed, total: data.total })
      setForm(f => ({ ...f, summary: '' }))
      fetchHistory()
    } catch (err) {
      setResult({ success: false, error: err.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)' }}>
        <Megaphone size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-neutral-800">Policy Change Notification</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            As promised in our legal policies, we notify all users at least 7 days before any policy changes take effect.
            Use this tool to send that notification.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl p-6" style={{ background: 'white', border: '1px solid var(--border2)' }}>
        <h3 className="font-bold text-sm mb-5" style={{ color: 'var(--ink)' }}>Compose Policy Broadcast</h3>
        
        {result && (
          <div className={`mb-5 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.success
              ? <><CheckCircle size={16} /> Sent to {result.sent} users ({result.failed} failed, {result.total} total)</>
              : <><AlertCircle size={16} /> Error: {result.error}</>
            }
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Policy
              </label>
              <select
                value={form.policy_name}
                onChange={e => {
                  const policy = POLICIES.find(p => p.value === e.target.value)
                  setForm(f => ({ ...f, policy_name: e.target.value, policy_url: policy?.url || f.policy_url }))
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--off)' }}
              >
                {POLICIES.map(p => <option key={p.value} value={p.value}>{p.value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Effective Date (min. 7 days from today)
              </label>
              <input
                type="text"
                value={form.effective_date}
                onChange={e => setForm(f => ({ ...f, effective_date: e.target.value }))}
                placeholder="e.g. 28 May 2025"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--off)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Summary of Changes (shown in the email — be clear and specific)
            </label>
            <textarea
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              placeholder={`Example:\n• Section 4 (Data Sharing) updated to clarify how courier partner data is used.\n• Section 7 (Cookies) updated to reflect removal of analytics cookies.\n\nNo data is being sold. No new data is being collected.`}
              rows={6}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-y"
              style={{ border: '1px solid var(--border)', background: 'var(--off)', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={sending || !form.summary.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: sending ? 'var(--muted)' : 'var(--ink)', opacity: (!form.summary.trim() || sending) ? 0.6 : 1 }}
          >
            <Send size={14} />
            {sending ? 'Sending to all users...' : 'Send Policy Notification to All Users'}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
        <div className="px-5 py-4 border-b font-bold text-sm" style={{ color: 'var(--ink)', borderColor: 'var(--border2)' }}>
          Broadcast History
        </div>
        {loadingHistory ? (
          <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>No broadcasts sent yet</div>
        ) : (
          broadcasts.map(b => (
            <div key={b.id} className="flex items-center justify-between p-4 border-b last:border-b-0"
              style={{ borderColor: 'var(--border2)' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{b.metadata?.policy_name || b.subject}</p>
                <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                  {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{b.sent_count} sent</p>
                {b.failed_count > 0 && <p className="text-[11px] text-red-400">{b.failed_count} failed</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
