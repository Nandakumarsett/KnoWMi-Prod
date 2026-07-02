import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Send } from 'lucide-react'

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
    <section id="contact" className="py-32 relative overflow-hidden bg-[#0a0a0a] min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-500 border-[3px] border-black shadow-[3px_3px_0px_#000] mb-6 text-black text-[10px] font-black uppercase tracking-widest">
              Get In Touch
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight uppercase">
              Let's Build the Future of <br />
              <span className="text-orange-500 underline decoration-[6px] underline-offset-8">Identity Together.</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium mb-12 leading-relaxed">
              Questions about bulk orders, customization, or just want to say hi? We're here to help you bridge your physical and digital worlds.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-10 md:p-14 border-2 sm:border-[3px] border-white shadow-[4px_4px_0px_#F97316] sm:shadow-[8px_8px_0px_#F97316]">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-orange-500 border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-xl flex items-center justify-center mx-auto mb-8 text-black">
                    <Send size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white uppercase">Message Received!</h3>
                  <p className="text-neutral-300 font-bold leading-relaxed">Your details are safe with us. We'll be in touch personally within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-10 px-8 py-3 rounded-lg bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] text-[10px] font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label htmlFor="contact-name" className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Name</label>
                      <input id="contact-name" required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 rounded-lg bg-black border-[3px] border-white outline-none focus:border-orange-500 transition-all text-sm font-black text-white"
                        placeholder="John Doe" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label htmlFor="contact-email" className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Email</label>
                      <input id="contact-email" required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-lg bg-black border-[3px] border-white outline-none focus:border-orange-500 transition-all text-sm font-black text-white"
                        placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">WhatsApp / Phone</label>
                    <input id="contact-phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\s()]/g, '') })}
                      className="w-full px-6 py-4 rounded-lg bg-black border-[3px] border-white outline-none focus:border-orange-500 transition-all text-sm font-black text-white"
                      placeholder="+91 00000 00000" />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Message</label>
                    <textarea id="contact-message" rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 rounded-lg bg-black border-[3px] border-white outline-none focus:border-orange-500 transition-all text-sm font-black resize-none text-white"
                      placeholder="Tell us about your squad, team, or custom vision..." />
                  </div>

                  {status === 'error' && (
                    <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest text-center border border-red-500/20">
                      {errorMsg}
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'}
                    className="w-full py-5 rounded-lg bg-orange-500 text-black border-[3px] border-black font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {status === 'loading' ? 'Sending...' : 'Submit Interest'}
                    {!status === 'loading' && <Send size={14} strokeWidth={3} />}
                  </button>
                </form>
              )}
            </div>

            <div className="flex justify-center lg:justify-start pl-2">
              <a href="mailto:support.knowmi@gmail.com" className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs hover:text-orange-500 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-500 border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black">
                  <Mail size={18} strokeWidth={3} />
                </div>
                Email: support.knowmi@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
