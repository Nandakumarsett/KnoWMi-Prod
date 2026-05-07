import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error fetching leads:', error)
    else setLeads(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return
    await supabase.from('leads').delete().eq('id', id)
    fetchLeads()
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--border2)] overflow-hidden">
      <div className="p-6 border-b border-[var(--border2)] flex justify-between items-center bg-[var(--off)]">
        <div>
          <h2 className="text-lg font-bold font-display text-[var(--ink)]">Interested Customers</h2>
          <p className="text-xs text-[var(--muted)]">People who submitted the contact form on the homepage.</p>
        </div>
        <button onClick={fetchLeads} className="px-4 py-2 rounded-lg text-sm font-bold bg-white border border-[var(--border2)] hover:bg-gray-50 transition-colors">
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[var(--muted)]">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="p-12 text-center text-[var(--muted)]">No leads found yet.</div>
      ) : (
        <div className="divide-y divide-[var(--border2)]">
          {leads.map(lead => (
            <div key={lead.id} className="p-6 hover:bg-[var(--off)] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--ink)] mb-1">{lead.name}</h3>
                  <div className="flex gap-4 text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-1">✉️ <a href={`mailto:${lead.email}`} className="hover:text-[var(--sf)]">{lead.email}</a></span>
                    {lead.phone && <span className="flex items-center gap-1">📞 <a href={`tel:${lead.phone}`} className="hover:text-[var(--sf)]">{lead.phone}</a></span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--muted)] mb-2">{new Date(lead.created_at).toLocaleString()}</div>
                  <button onClick={() => handleDelete(lead.id)} className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider">
                    Delete Lead
                  </button>
                </div>
              </div>
              
              {lead.message && (
                <div className="bg-white p-4 rounded-lg border border-[var(--border2)] text-sm text-[var(--ink)] italic">
                  "{lead.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
