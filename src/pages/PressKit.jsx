import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Download, Image as ImageIcon, FileText, Share2, Mail } from 'lucide-react'

export default function PressKit() {
  const assets = [
    { title: 'Official Logo', type: 'PNG', size: '1.2 MB', icon: <ImageIcon size={20}/>, file: '/downloads/KnoWMi-Logo.webp' },
    { title: 'Founder Portrait', type: 'JPG', size: '2.4 MB', icon: <ImageIcon size={20}/>, file: '/downloads/Founder-Portrait.webp' },
    { title: 'Website Shortcut', type: 'HTML', size: '1.5 KB', icon: <FileText size={20}/>, file: '/downloads/KnoWMi-Official-Website.html' },
    { title: 'Digital Brand Card', type: 'HTML', size: '2.8 KB', icon: <Share2 size={20}/>, file: '/downloads/KnoWMi-Digital-Brand-Card.html' }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar isDark={false} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 animate-reveal">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-black">Press <span className="text-orange-500 italic">Kit</span></h1>
              <p className="text-xl text-neutral-600 max-w-md leading-relaxed">Everything you need to share the KnoWMi story with the world.</p>
            </div>
            <a href="/downloads/KnoWMi-Official-Website.html" download className="h-14 px-8 bg-black text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-black/10">
              <Download size={20} /> Download All Assets
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div className="space-y-16">
              {/* Asset Grid Modeling */}
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-black flex items-center gap-3 text-black">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><ImageIcon size={18}/></span>
                  Official Brand Assets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assets.map((a, i) => (
                    <a key={i} href={a.file} download className="p-6 bg-white border border-neutral-100 rounded-2xl flex items-center justify-between group hover:border-orange-500/30 hover:shadow-lg hover:shadow-neutral-100/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-orange-500 transition-colors">
                          {a.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black">{a.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{a.type} • {a.size}</p>
                        </div>
                      </div>
                      <Download size={18} className="text-neutral-300 group-hover:text-orange-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </section>

              {/* Story Modeling */}
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-black flex items-center gap-3 text-black">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><FileText size={18}/></span>
                  The KnoWMi Story
                </h2>
                <div className="p-10 bg-white border border-neutral-100 rounded-3xl shadow-xl shadow-neutral-100/50 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-widest text-orange-500">Mission</h3>
                    <p className="text-neutral-600 leading-relaxed text-lg font-medium">
                      To bridge the gap between our physical presence and our digital identities through high-fidelity, QR-integrated apparel.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-widest text-orange-500">Key Facts</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Founded in 2026', 'HQ: AP, India', 'Phygital Tech Focused', '100% Sustainable Cotton'].map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm font-bold text-neutral-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Modeling */}
            <aside className="space-y-8">
              <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-3xl space-y-6 shadow-sm">
                <h3 className="font-display font-black text-xl text-black">Media Contact</h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-neutral-200 shadow-sm flex items-center justify-center font-black text-orange-500 text-[10px]">
                    NK
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-black">Nanda Kumar</p>
                    <p className="text-[10px] text-neutral-500 font-bold">Founder & CEO</p>
                  </div>
                </div>
                <a href="mailto:support.knowmi@gmail.com" className="bg-black text-white w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-black hover:bg-neutral-800 transition-all shadow-lg shadow-black/10">
                  <Mail size={16} /> Contact Press
                </a>
              </div>

              <div className="p-8 bg-white border border-neutral-100 rounded-3xl space-y-4 shadow-lg shadow-neutral-100/50">
                <h3 className="font-bold text-sm text-black">Social Presence</h3>
                <div className="flex gap-2">
                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100" />)}
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 hover:translate-x-1 transition-transform">
                  <Share2 size={12}/> View Community
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
