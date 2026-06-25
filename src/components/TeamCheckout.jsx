import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Users, ShoppingBag, AlertCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const PRICE_PER_MEMBER = 699
const MIN_MEMBERS = 4

const createEmptyMember = (index) => ({
  id: Date.now() + index,
  name: '',
  size: 'M',
  color: null, // will be set to first available color after load
})

export default function TeamCheckout({ onClose, user, onAuth, selectedDesign }) {
  const [members, setMembers] = useState([])
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [availableColors, setAvailableColors] = useState([])
  const [colorsLoading, setColorsLoading] = useState(true)

  // Load colors from the selected design record in the DB
  useEffect(() => {
    const loadColors = async () => {
      setColorsLoading(true)
      try {
        if (selectedDesign?.id) {
          const { data } = await supabase
            .from('persona_designs')
            .select('available_colors')
            .eq('id', selectedDesign.id)
            .maybeSingle()
          const colors = (data?.available_colors || []).filter(c => c.stock > 0)
          setAvailableColors(colors)
          // Init members with first available color pre-selected
          const defaultColor = colors[0]?.id || null
          setMembers(Array.from({ length: MIN_MEMBERS }, (_, i) => ({ ...createEmptyMember(i), color: defaultColor })))
        } else {
          setAvailableColors([])
          setMembers(Array.from({ length: MIN_MEMBERS }, (_, i) => createEmptyMember(i)))
        }
      } catch (e) {
        setAvailableColors([])
        setMembers(Array.from({ length: MIN_MEMBERS }, (_, i) => createEmptyMember(i)))
      } finally {
        setColorsLoading(false)
      }
    }
    loadColors()
  }, [selectedDesign?.id])

  const totalAmount = members.length * PRICE_PER_MEMBER
  const totalPaise = totalAmount * 100
  const isValid = members.length >= MIN_MEMBERS && members.every(m => m.name.trim().length > 0)

  const updateMember = (id, field, value) =>
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))

  const addMember = () => {
    const defaultColor = availableColors[0]?.id || null
    setMembers(prev => [...prev, { ...createEmptyMember(prev.length), color: defaultColor }])
  }

  const removeMember = (id) => {
    if (members.length <= MIN_MEMBERS) return
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleCheckout = async () => {
    if (!user) { onAuth(); return }
    if (!isValid) {
      alert(`Please fill in all ${members.length} member names before proceeding.`)
      return
    }
    setCheckoutLoading(true)

    const sdkLoaded = await new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Please check your connection.')
      setCheckoutLoading(false)
      return
    }

    try {
      const { data: orderData, error: apiError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          plan_id: 'team',
          amount_override: totalPaise,
          user_id: user.id,
          customer_details: {
            team_name: teamName || 'My Team',
            design_id: selectedDesign?.id,
            design: selectedDesign?.name || 'Team Design',
            members: members.map(m => ({
              name: m.name,
              size: m.size,
              color: m.color,
              color_label: availableColors.find(c => c.id === m.color)?.label || m.color,
            })),
            quantity: members.length,
          }
        }
      })

      if (apiError || !orderData) throw new Error(apiError?.message || 'Failed to create order')

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'KnoWMi',
        description: `Team Plan — ${members.length} Members`,
        image: 'https://knowmi.co/favicon.ico',
        order_id: orderData.order_id,
        handler: function (response) {
          sessionStorage.setItem('knowmi_payment_success', 'true')
          alert(`🎉 Team order placed for ${members.length} members! ID: ${response.razorpay_payment_id}`)
          onClose()
        },
        prefill: { email: user.email },
        theme: { color: '#f97316' }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', (response) => {
        alert('Payment Failed: ' + response.error.description)
      })
      paymentObject.open()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-neutral-100 px-8 pt-8 pb-6 rounded-t-[40px] bg-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all"
          >
            <X size={18} className="text-neutral-600" />
          </button>

          <div className="flex items-center gap-4 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Users size={22} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-black text-black tracking-tight">Team Plan Setup</h2>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                ₹699 per member · Min. {MIN_MEMBERS} members
              </p>
            </div>
          </div>

          {/* Team Name */}
          <div className="mt-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
              Team / Organisation Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. Startup XYZ, College Fest Team..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
        </div>

        {/* Colors loading / no colors warning */}
        {!colorsLoading && availableColors.length === 0 && (
          <div className="mx-8 mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-700">No colours in stock for this design</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Please ask the admin to set available colours and stock in the Catalog panel.
                You can still complete your order and we will contact you.
              </p>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="px-8 py-6 space-y-4">
          {colorsLoading ? (
            <div className="flex items-center justify-center py-10 gap-3 text-neutral-400">
              <Loader size={20} className="animate-spin" />
              <span className="text-sm font-medium">Loading design details...</span>
            </div>
          ) : (
            <>
              {members.map((member, index) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  index={index}
                  availableColors={availableColors}
                  onChange={(field, val) => updateMember(member.id, field, val)}
                  onRemove={() => removeMember(member.id)}
                  canRemove={members.length > MIN_MEMBERS}
                />
              ))}

              <button
                onClick={addMember}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-400 font-black text-[11px] uppercase tracking-widest hover:border-orange-400 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Another Member
              </button>

              {/* Pricing Breakdown Card */}
              <div className="mt-6 bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-3.5 text-xs text-neutral-600 font-medium">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Pricing Breakdown ({members.length} Members)</p>
                <div className="flex justify-between items-center">
                  <span>Base T-Shirt Price</span>
                  <span className="line-through text-neutral-400 font-bold">₹{(1299 * members.length).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-orange-600 font-bold">
                  <span>Bulk Team Special Promo</span>
                  <span>-₹{(600 * members.length).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Priority Shipping & Custom QR Setup</span>
                  <span className="text-green-600 font-bold">₹0 (FREE)</span>
                </div>
                <div className="border-t border-neutral-200/60 pt-3.5 flex justify-between items-center text-sm">
                  <span className="font-black text-black">Total Amount</span>
                  <span className="font-black text-lg text-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-8 py-6 rounded-b-[40px] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Total for {members.length} members
            </p>
            <p className="text-3xl font-black text-black">
              ₹{totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-neutral-400 font-medium">₹699 × {members.length}</p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || colorsLoading}
            className="px-10 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-3 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checkoutLoading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <ShoppingBag size={18} />
            }
            {checkoutLoading ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} Securely`}
          </button>
        </div>

        {/* Name validation hint */}
        {!isValid && members.some(m => !m.name.trim()) && !colorsLoading && (
          <p className="text-center text-[10px] text-orange-500 font-bold pb-4 -mt-2">
            Please enter a name for every team member to continue.
          </p>
        )}
      </div>
    </div>
  )
}

function MemberRow({ member, index, availableColors, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-neutral-50/80 border border-neutral-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          Member {index + 1}
        </span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-red-50 hover:text-red-400 flex items-center justify-center text-neutral-300 transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">
            Full Name *
          </label>
          <input
            type="text"
            value={member.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="e.g. Ravi Kumar"
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
          />
        </div>

        {/* Size */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">
            T-Shirt Size
          </label>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => onChange('size', s)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  member.size === s
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white border border-neutral-200 text-neutral-400 hover:border-orange-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Color — from DB inventory */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">
            T-Shirt Colour
          </label>
          {availableColors.length === 0 ? (
            <p className="text-[11px] text-neutral-400 italic">No colours in stock</p>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              {availableColors.map(c => (
                <button
                  key={c.id}
                  onClick={() => onChange('color', c.id)}
                  title={`${c.label} (${c.stock} in stock)`}
                  className={`relative w-9 h-9 rounded-full transition-all hover:scale-110 ${
                    member.color === c.id ? 'ring-2 ring-offset-2 ring-orange-500 scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    border: c.id === 'white' ? '2px solid #e5e7eb' : `2px solid ${c.hex}`
                  }}
                >
                  {member.color === c.id && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[11px] font-black"
                      style={{ color: c.id === 'white' ? '#111' : '#fff' }}
                    >✓</span>
                  )}
                </button>
              ))}
              <span className="text-[10px] font-bold text-neutral-400">
                {availableColors.find(c => c.id === member.color)?.label || ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
