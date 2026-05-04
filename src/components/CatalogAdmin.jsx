import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['Gamer', 'Influencer', 'Gym', 'Student', 'Developer', 'Creator']

export default function CatalogAdmin() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ category: 'Gamer', name: '', price: 999 })
  const [files, setFiles] = useState({ front: null, back: null, model: null })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDesigns()
  }, [])

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
    const { data, error } = await supabase.storage.from('product_images').upload(fileName, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(fileName)
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      if (!files.front && !files.back && !files.model) {
        alert("Please upload at least one image (Front, Back, or Model).")
        setUploading(false)
        return
      }

      // Upload files
      const frontUrl = await uploadImage(files.front)
      const backUrl = await uploadImage(files.back)
      const modelUrl = await uploadImage(files.model)

      const { error } = await supabase.from('persona_designs').insert([{
        category: formData.category.toLowerCase(),
        name: formData.name,
        price: formData.price,
        front_image_url: frontUrl,
        back_image_url: backUrl,
        model_image_url: modelUrl
      }])

      if (error) throw error

      alert("Design added successfully!")
      setFormData({ category: 'Gamer', name: '', price: 999 })
      setFiles({ front: null, back: null, model: null })
      document.getElementById('catalog-form').reset()
      fetchDesigns()

    } catch (err) {
      console.error(err)
      alert("Error adding design: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return
    const { error } = await supabase.from('persona_designs').delete().eq('id', id)
    if (error) alert("Error deleting design")
    else fetchDesigns()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Upload Form */}
      <div className="lg:col-span-1">
        <form id="catalog-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[var(--border2)]">
          <h2 className="text-lg font-bold mb-4 font-display text-[var(--ink)]">Add New Design</h2>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Category</label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--border2)] bg-[var(--off)] outline-none text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Design Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Neon Glitch V1" className="w-full px-3 py-2 rounded-lg border border-[var(--border2)] bg-[var(--off)] outline-none text-sm" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Price (₹)</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--border2)] bg-[var(--off)] outline-none text-sm" />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">Front Image (Optional)</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'front')} className="text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">Back Image (Optional)</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'back')} className="text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">Model Image (Optional)</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'model')} className="text-xs" />
            </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--sf), var(--gold))' }}>
            {uploading ? 'Uploading...' : 'Publish Design'}
          </button>
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
                    <img src={d.model_image_url || d.front_image_url || d.back_image_url || '/assets/tees/front.png'} alt={d.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wider mb-0.5">{d.category}</div>
                      <h3 className="text-sm font-bold text-[var(--ink)] leading-tight">{d.name}</h3>
                      <div className="text-xs text-[var(--muted)] mt-1">₹{d.price}</div>
                    </div>
                    <button onClick={() => handleDelete(d.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider self-start">Delete</button>
                  </div>
                </div>
              ))}
              {designs.length === 0 && <p className="text-sm text-[var(--muted)] col-span-2">No designs in catalog yet.</p>}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
