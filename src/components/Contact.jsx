import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { MessageSquare, Send } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.from('leads').insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }
    ])

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    } else {
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
  }

  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-white snap-section min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              Get In Touch
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-black mb-8 leading-[1.05] tracking-tight">
              Let's Build the Future of <br />
              <span className="text-orange-500 italic">Identity Together.</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium mb-12 leading-relaxed">
              Questions about bulk orders, customization, or just want to say hi? We're here to help you bridge your physical and digital worlds.
            </p>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 text-black font-black uppercase tracking-widest text-xs">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <MessageSquare size={18} />
                  </div>
                  WhatsApp: +91 79813 25397
               </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-[3rem] p-10 md:p-14 border border-neutral-100 shadow-2xl shadow-neutral-100">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-orange-600">
                  <Send size={32} />
                </div>
                <h3 className="text-3xl font-display font-black mb-4 text-black italic">Message Received!</h3>
                <p className="text-neutral-500 font-medium leading-relaxed">Your details are safe with us. We'll be in touch personally within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-10 px-8 py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-neutral-100 outline-none focus:border-orange-500 transition-all text-sm font-medium"
                      placeholder="John Doe" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-neutral-100 outline-none focus:border-orange-500 transition-all text-sm font-medium"
                      placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">WhatsApp / Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-neutral-100 outline-none focus:border-orange-500 transition-all text-sm font-medium"
                    placeholder="+91 00000 00000" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Message</label>
                  <textarea rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-neutral-100 outline-none focus:border-orange-500 transition-all text-sm font-medium resize-none"
                    placeholder="Tell us about your squad, team, or custom vision..." />
                </div>

                {status === 'error' && (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                    {errorMsg}
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-5 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {status === 'loading' ? 'Sending...' : 'Submit Interest'}
                  {!status === 'loading' && <Send size={14} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
