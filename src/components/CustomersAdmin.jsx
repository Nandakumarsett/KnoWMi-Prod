import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Users, Search, Phone, Mail, MapPin, 
  ShoppingBag, IndianRupee, RefreshCcw, Loader2, Calendar
} from 'lucide-react'

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCustomers(data)
    } else {
      // Fallback from profiles & orders if customers table not migrated yet
      const { data: profs } = await supabase.from('profiles').select('*, orders(*)')
      if (profs) {
        const mapped = profs.map(p => {
          const latestOrder = p.orders?.[0] || {}
          return {
            id: p.id,
            customer_code: `CUST-${p.wm_code || p.id.slice(0, 4).toUpperCase()}`,
            full_name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'KnoWMi Customer',
            email: p.email || latestOrder.customer_email || 'No email',
            phone: p.phone || latestOrder.customer_phone || 'No phone',
            street_address: latestOrder.shipping_address || 'Not provided',
            city: latestOrder.delivery_city || 'Bengaluru',
            state: latestOrder.delivery_state || 'Karnataka',
            pincode: latestOrder.delivery_pincode || '',
            total_orders: p.orders?.length || 1,
            total_spent: p.amount_paid || (p.status === 'paid' ? 799 : 0),
            created_at: p.created_at
          }
        })
        setCustomers(mapped)
      }
    }
    setLoading(false)
  }

  const filtered = customers.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.customer_code?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Customer ID, Name, Phone, Email, or City..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/20 outline-none focus:border-orange-500 transition-all bg-[#1a1a1a] text-white text-sm"
          />
        </div>
        <button 
          onClick={fetchCustomers}
          className="px-6 py-2.5 bg-[#1a1a1a] border border-white/20 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 text-white"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
          <span>Refresh Customers</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm font-semibold">Loading customer database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-[#1a1a1a] rounded-2xl border border-white/10 text-center text-neutral-400">
          <Users size={32} className="mx-auto mb-2 text-neutral-500" />
          <p className="text-sm font-bold text-white mb-1">No customers found</p>
          <p className="text-xs">Customers will appear automatically as orders are placed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-[#1a1a1a] border border-white/20 rounded-2xl p-6 shadow-[4px_4px_0px_#fff] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 font-mono bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                      Customer ID: #{c.id}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1.5 leading-snug">{c.full_name}</h3>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ₹{c.total_spent || 0}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-neutral-300 font-medium pt-2 border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-orange-500 shrink-0" />
                    <span>{c.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-orange-500 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-400 leading-tight">
                      {c.street_address ? `${c.street_address}, ${c.city}, ${c.state} ${c.pincode}` : `${c.city || 'Bengaluru'}, ${c.state || 'Karnataka'}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 pt-3 border-t border-neutral-800">
                <span className="flex items-center gap-1">
                  <ShoppingBag size={12} className="text-neutral-400" />
                  {c.total_orders || 1} Order(s)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-neutral-400" />
                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
