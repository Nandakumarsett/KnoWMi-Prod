import { useState, useEffect } from 'react'
import { supabase, getAssetUrl } from '../lib/supabase'
import { Plus, Trash2, Package, CheckCircle } from 'lucide-react'

const DEFAULT_COLORS = [
  { id: 'black',    label: 'Black',     hex: '#111111', stock: 0 },
  { id: 'white',    label: 'White',     hex: '#FFFFFF', stock: 0 },
  { id: 'navy',     label: 'Navy Blue', hex: '#1e3a5f', stock: 0 },
  { id: 'olive',    label: 'Olive',     hex: '#556B2F', stock: 0 },
  { id: 'charcoal', label: 'Charcoal',  hex: '#36454F', stock: 0 },
  { id: 'maroon',   label: 'Maroon',    hex: '#800000', stock: 0 },
]

export default function CatalogAdmin() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', price: 999 })
  const [files, setFiles] = useState({ front: null, back: null, model: null, image4: null, image5: null, image6: null })
  const [uploading, setUploading] = useState(false)
  const [editingInventory, setEditingInventory] = useState(null) // design id being edited
  const [editingDetails, setEditingDetails] = useState(null) // design object being edited
  const [colorDraft, setColorDraft] = useState([])

  useEffect(() => { fetchDesigns() }, [])

  const fetchDesigns = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('persona_designs').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error fetching designs:', error)
    else setDesigns(data || [])
    setLoading(false)
  }

  const handleFileChange = (e, type) => {
    setFiles({ ...files, [type]: e.target.files[0] })
  }

  const uploadImage = async (file) => {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('product_images').upload(fileName, file)
    if (uploadError) throw uploadError
    return `product_images/${fileName}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      if (!editingDetails && !files.front && !files.back && !files.model) {
        alert('Please upload at least one image.')
        setUploading(false)
        return
      }

      const updatePayload = {
        name: formData.name,
        price: formData.price,
      }

      if (files.front) updatePayload.front_image_url = await uploadImage(files.front)
      if (files.back) updatePayload.back_image_url = await uploadImage(files.back)
      if (files.model) updatePayload.model_image_url = await uploadImage(files.model)
      if (files.image4) updatePayload.image4_url = await uploadImage(files.image4)
      if (files.image5) updatePayload.image5_url = await uploadImage(files.image5)
      if (files.image6) updatePayload.image6_url = await uploadImage(files.image6)

      if (editingDetails) {
        const { error } = await supabase.from('persona_designs').update(updatePayload).eq('id', editingDetails.id)
        if (error) throw error
        alert('Design updated!')
      } else {
        updatePayload.category = 'universal'
        updatePayload.available_colors = []
        updatePayload.total_stock = 0
        updatePayload.is_available = true
        const { error } = await supabase.from('persona_designs').insert([updatePayload])
        if (error) throw error
        alert('Design added!')
      }
      
      setFormData({ name: '', price: 999 })
      setFiles({ front: null, back: null, model: null, image4: null, image5: null, image6: null })
      setEditingDetails(null)
      document.getElementById('catalog-form').reset()
      fetchDesigns()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleEditClick = (design) => {
    setEditingDetails(design)
    setFormData({ name: design.name, price: design.price || 999 })
    setFiles({ front: null, back: null, model: null, image4: null, image5: null, image6: null })
    document.getElementById('catalog-form').reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design?')) return
    const { error } = await supabase.from('persona_designs').delete().eq('id', id)
    if (error) alert('Error deleting design')
    else fetchDesigns()
  }

  const openInventoryEditor = (design) => {
    // Merge existing colors with defaults so all 6 options appear
    const existing = design.available_colors || []
    const merged = DEFAULT_COLORS.map(dc => {
      const found = existing.find(c => c.id === dc.id)
      return found ? { ...dc, ...found } : { ...dc }
    })
    setColorDraft(merged)
    setEditingInventory(design.id)
  }

  const saveInventory = async () => {
    // Only save colors that have stock > 0 or were already enabled
    const colors = colorDraft.filter(c => c.stock > 0)
    const totalStock = colors.reduce((sum, c) => sum + Number(c.stock), 0)
    const { error } = await supabase.from('persona_designs').update({
      available_colors: colors,
      total_stock: totalStock,
    }).eq('id', editingInventory)
    if (error) alert('Error saving: ' + error.message)
    else {
      alert('Inventory saved!')
      setEditingInventory(null)
      fetchDesigns()
    }
  }

  const updateColorStock = (colorId, stock) => {
    setColorDraft(prev => prev.map(c => c.id === colorId ? { ...c, stock: Math.max(0, Number(stock)) } : c))
  }

  return (
    <div className="space-y-8">

      {/* Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form id="catalog-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[var(--border2)] sticky top-28">
            <h2 className="text-lg font-bold mb-4 font-display text-[var(--ink)]">
              {editingDetails ? 'Edit Design' : 'Add New Design'}
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Design Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Neon Glitch V1" className="w-full px-3 py-2 rounded-lg border border-[var(--border2)] bg-[var(--off)] outline-none text-sm" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Price (₹)</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--border2)] bg-[var(--off)] outline-none text-sm" />
            </div>
            <div className="space-y-3 mb-6">
              {['front', 'back', 'model', 'image4', 'image5', 'image6'].map(type => (
                <div key={type}>
                  <label className="block text-xs font-bold text-[var(--muted)] mb-1 capitalize">{type} Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, type)} className="text-xs" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button type="submit" disabled={uploading} className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>
                {uploading ? 'Saving...' : editingDetails ? 'Update Design' : 'Publish Design'}
              </button>
              {editingDetails && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingDetails(null)
                    setFormData({ name: '', price: 999 })
                    setFiles({ front: null, back: null, model: null, image4: null, image5: null, image6: null })
                    document.getElementById('catalog-form').reset()
                  }} 
                  className="w-full py-3 rounded-xl font-bold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 transition-colors text-sm"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Catalog List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-[var(--border2)]">
            <h2 className="text-lg font-bold mb-4 font-display text-[var(--ink)]">Current Catalog</h2>
            {loading ? <p className="text-sm text-[var(--muted)]">Loading...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designs.map(d => (
                  <div key={d.id} className="flex gap-4 p-4 rounded-xl border border-[var(--border2)] hover:bg-[var(--off)] transition-colors">
                    <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={getAssetUrl(d.model_image_url || d.front_image_url || d.back_image_url) || '/assets/tees/front.png'} alt={d.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-bold text-[var(--ink)] leading-tight">{d.name}</h3>
                        <div className="text-xs text-[var(--muted)] mt-1">₹{d.price}</div>
                        {/* Color swatches */}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {(d.available_colors || []).length > 0
                            ? d.available_colors.map(c => (
                                <span key={c.id} title={`${c.label}: ${c.stock} pcs`}
                                  className="w-4 h-4 rounded-full border border-neutral-300 inline-block"
                                  style={{ backgroundColor: c.hex }} />
                              ))
                            : <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">No colors set</span>
                          }
                        </div>
                        {d.total_stock > 0 && (
                          <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                            <Package size={10} /> {d.total_stock} pcs in stock
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button onClick={() => openInventoryEditor(d)} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-wider">
                          Stock
                        </button>
                        <button onClick={() => handleEditClick(d)} className="text-[10px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-wider">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {designs.length === 0 && <p className="text-sm text-[var(--muted)] col-span-2">No designs in catalog yet.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Editor Modal */}
      {editingInventory && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingInventory(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-neutral-900 mb-1">Colour & Stock Manager</h3>
            <p className="text-xs text-neutral-400 font-medium mb-6">Set available stock per colour. Set to 0 to hide that colour from customers.</p>
            <div className="space-y-3">
              {colorDraft.map(color => (
                <div key={color.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-200 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-neutral-700">{color.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={color.stock}
                      onChange={e => updateColorStock(color.id, e.target.value)}
                      className="w-20 px-2 py-1.5 rounded-lg border border-neutral-200 text-sm font-bold text-center focus:outline-none focus:border-orange-400"
                    />
                    {color.stock > 0 && <CheckCircle size={16} className="text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditingInventory(null)} className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-500 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveInventory} className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-orange-500 transition-colors">
                Save Inventory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
