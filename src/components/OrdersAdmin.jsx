import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Package, Truck, CheckCircle2, AlertCircle, Search, 
  MapPin, Calendar, Hash, Tag, Image as ImageIcon,
  ChevronRight, Edit3, Save, X, Loader2, Plus, RefreshCcw, Trash2
} from 'lucide-react'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const CANCELLATION_REASONS = [
    "Customer doesn't want",
    "Order placed by mistake",
    "Product out of stock",
    "Payment failed",
    "Other"
  ]

  useEffect(() => {
    fetchOrders()
    fetchCatalog()
  }, [])

  const fetchCatalog = async () => {
    const { data } = await supabase.from('persona_designs').select('*').order('name')
    if (data) setCatalog(data)
  }

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
    
    if (!error) setOrders(data || [])
    setLoading(false)
  }

  const handleUpdateOrder = async (id) => {
    setLoading(true)
    // Filter out nested objects like 'profiles' from the fetch
    const { profiles, ...updateData } = editForm
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      alert(`Update failed: ${error.message}`)
    } else {
      setEditingId(null)
      fetchOrders()
    }
    setLoading(false)
  }

  const handleDeleteOrder = async (id) => {
    const reason = window.prompt("Delete Order\nPlease enter the reason for deletion:\n1. Customer doesn't want\n2. Order placed by mistake\n3. Other (type below)")
    
    if (!reason) return

    let finalReason = reason
    if (reason === '1') finalReason = "Customer doesn't want"
    if (reason === '2') finalReason = "Order placed by mistake"

    if (window.confirm(`Are you sure you want to DELETE this order?\nReason: ${finalReason}`)) {
      setLoading(true)
      // We log the reason to the console or could save it to a logs table if needed
      console.log(`Deleting order ${id}. Reason: ${finalReason}`)
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) alert("Delete failed: " + error.message)
      else fetchOrders()
      setLoading(false)
    }
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    shipped: 'bg-blue-100 text-blue-700 border-blue-200',
    delivered: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  }

  const filtered = orders.filter(o => 
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.profiles?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.delivery_city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order #, Customer, or City..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-orange-500 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
              setEditingId('new')
              setEditForm({
                status: 'paid',
                item_name: 'The Signature Tee',
                size: 'L',
                amount: 999,
                order_date: new Date().toISOString().split('T')[0],
                order_number: 'ORD-' + (orders.length + 1001)
              })
            }}
            className="flex-1 md:flex-none px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Create Manual Order
          </button>
          <button 
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
          </button>
        </div>
      </div>

      {editingId === 'new' && (
        <div className="card p-8 bg-orange-50 border-orange-200 mb-8 animate-slideUp">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus className="text-orange-600" /> New Manual Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Customer WM-CODE</label>
              <input 
                type="text"
                placeholder="e.g. WM-NAN-001"
                onChange={async (e) => {
                  const code = e.target.value.toUpperCase()
                  // Try wm_code
                  const { data: wmMatch } = await supabase.from('profiles').select('id, first_name').eq('wm_code', code).single()
                  if (wmMatch) {
                    setEditForm({...editForm, profile_id: wmMatch.id, customer_name: wmMatch.first_name})
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border-none bg-white shadow-sm outline-none focus:ring-2 ring-orange-500/20"
              />
              {editForm.customer_name && <p className="text-[10px] text-orange-600 font-bold mt-1">✓ Found: {editForm.customer_name}</p>}
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Product Design</label>
              <select 
                value={editForm.item_name}
                onChange={e => {
                  const design = catalog.find(d => d.name === e.target.value)
                  if (design) {
                    setEditForm({
                      ...editForm, 
                      item_name: design.name, 
                      model_image_url: design.model_image_url || design.front_image_url,
                      amount: design.price
                    })
                  } else {
                    setEditForm({...editForm, item_name: e.target.value})
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border-none bg-white shadow-sm outline-none"
              >
                <option value="">Select from Catalog</option>
                {catalog.map(d => (
                  <option key={d.id} value={d.name}>{d.name} (₹{d.price})</option>
                ))}
                <option value="custom">Other / Custom</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Order #</label>
              <input 
                type="text"
                value={editForm.order_number}
                onChange={e => setEditForm({...editForm, order_number: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl text-sm border-none bg-white shadow-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Est. Delivery</label>
              <input 
                type="text"
                value={editForm.estimated_delivery || ''}
                onChange={e => setEditForm({...editForm, estimated_delivery: e.target.value})}
                placeholder="e.g. 5 Days"
                className="w-full px-4 py-2.5 rounded-xl text-sm border-none bg-white shadow-sm outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditingId(null)} className="px-6 py-2.5 font-bold text-neutral-400">Cancel</button>
            <button 
              disabled={!editForm.profile_id}
              onClick={async () => {
                setLoading(true)
                // Remove helper fields that aren't in the DB
                const { customer_name, ...dbData } = editForm
                const { error } = await supabase.from('orders').insert([dbData])
                
                if (error) {
                  alert(`Error creating order: ${error.message}`)
                } else {
                  alert('✅ Order created and assigned successfully!')
                  setEditingId(null)
                  fetchOrders()
                }
                setLoading(false)
              }}
              className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl font-bold text-sm disabled:opacity-50"
            >
              Create Order & Assign to User
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(o => (
          <div key={o.id} className="card p-6 bg-white shadow-sm hover:shadow-md transition-all border-neutral-100 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Order Image / Model */}
              <div className="w-full lg:w-32 h-32 bg-neutral-50 rounded-2xl flex items-center justify-center shrink-0 border-2 border-neutral-50 overflow-hidden">
                {o.model_image_url ? (
                  <img src={o.model_image_url} className="w-full h-full object-cover" />
                ) : (
                   <div className="relative w-full h-full p-2 opacity-20">
                      <svg viewBox="0 0 200 250" className="w-full h-full fill-current">
                        <path d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" />
                      </svg>
                   </div>
                )}
              </div>

              {/* Order Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Hash size={12} /> {o.order_number || 'PENDING-ID'}
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[o.status] || 'bg-neutral-100'}`}>
                    {o.status}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-auto">
                    {new Date(o.order_date || o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Customer</p>
                    <p className="font-bold">{o.profiles?.first_name} {o.profiles?.last_name}</p>
                    <p className="text-xs text-neutral-500">{o.profiles?.wm_code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Product</p>
                    <p className="font-bold">{o.item_name}</p>
                    <p className="text-xs text-neutral-500">Size: {o.size} · SKU: {o.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Delivery City</p>
                    <p className="font-bold flex items-center gap-1.5"><MapPin size={14} className="text-neutral-400" /> {o.delivery_city || 'Not Set'}</p>
                    <p className="text-xs text-neutral-500">Value: ₹{o.amount}</p>
                  </div>
                </div>

                {editingId === o.id ? (
                  <div className="p-4 bg-neutral-50 rounded-2xl space-y-4 border border-neutral-200 animate-slideUp">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Status</label>
                        <select 
                          value={editForm.status} 
                          onChange={e => setEditForm({...editForm, status: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Order #</label>
                        <input 
                          type="text"
                          value={editForm.order_number || ''}
                          onChange={e => setEditForm({...editForm, order_number: e.target.value})}
                          placeholder="e.g. ORD-1001"
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Tracking Info</label>
                        <input 
                          type="text"
                          value={editForm.tracking_info || ''}
                          onChange={e => setEditForm({...editForm, tracking_info: e.target.value})}
                          placeholder="e.g. Bluedart: 123456"
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Delivery City</label>
                        <input 
                          type="text"
                          value={editForm.delivery_city || ''}
                          onChange={e => setEditForm({...editForm, delivery_city: e.target.value})}
                          placeholder="e.g. Mumbai"
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">SKU</label>
                        <input 
                          type="text"
                          value={editForm.sku || ''}
                          onChange={e => setEditForm({...editForm, sku: e.target.value})}
                          placeholder="e.g. SIG-TEE-BLK"
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Est. Delivery</label>
                        <input 
                          type="text"
                          value={editForm.estimated_delivery || ''}
                          onChange={e => setEditForm({...editForm, estimated_delivery: e.target.value})}
                          placeholder="e.g. 3-5 Business Days"
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Order Date</label>
                        <input 
                          type="date"
                          value={editForm.order_date || ''}
                          onChange={e => setEditForm({...editForm, order_date: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg text-sm border-none bg-white shadow-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm font-bold text-neutral-400">Cancel</button>
                      <button 
                        onClick={() => handleUpdateOrder(o.id)}
                        className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                      >
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                       <span className="flex items-center gap-1.5"><Truck size={14} /> {o.tracking_info || 'No tracking yet'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteOrder(o.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(o.id)
                          setEditForm(o)
                        }}
                        className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <Edit3 size={14} /> Manage Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
             <Package size={48} className="mx-auto text-neutral-200 mb-4" />
             <p className="text-neutral-400 font-medium">No orders found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
