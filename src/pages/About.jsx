import React, { useEffect } from 'react'
import { Zap, Globe, ShieldCheck, Users, Heart, Target, Sparkles, MessageCircle, ArrowRight, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Link } from 'react-router-dom'

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-[900px] mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-32 animate-reveal">
            <div className="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6">Our Story</div>
            <h1 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight text-black">
              Modeling the Future of <br/>
              <span className="text-orange-500 italic font-serif">Human Connection</span>
            </h1>
            <div className="space-y-6 text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto font-medium">
              <p>KnoWMi started from a simple thought I kept coming back to —</p>
              <p className="text-black font-bold">Why are we still exchanging information the old way, when the world around us has changed?</p>
              <p className="text-lg">We meet people, share numbers, follow each other on social media, exchange cards — but most of those connections fade. I felt there had to be a simpler and more meaningful way.</p>
              <p className="text-orange-500 font-display font-black text-2xl tracking-tight mt-10">That thought became KnoWMi.</p>
            </div>
          </div>

          <div className="space-y-40">
            {/* Why I Built This */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-orange-500">The Motivation</h2>
                  <h3 className="text-4xl font-display font-black text-black leading-tight">Why I Built This</h3>
                </div>
                <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                  <p>I wanted to create something that turns introductions into real connections. Something simple, practical, and meaningful.</p>
                  <p className="p-6 bg-neutral-50 rounded-2xl border-l-4 border-orange-500 font-bold italic text-black">
                    "A way for people to express identity while making it easier to connect in everyday life. That idea is at the heart of KnoWMi."
                  </p>
                </div>
              </div>
              <div className="aspect-square bg-gradient-to-br from-orange-500/10 to-neutral-50 rounded-[64px] border border-neutral-100 relative overflow-hidden shadow-2xl shadow-orange-500/5 group flex items-center justify-center">
                 <div className="text-orange-500 opacity-20">
                   <Zap size={100} />
                 </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
              </div>
            </section>

            {/* One Scan. Real Connection. */}
            <section className="text-center space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-display font-black tracking-tight">One Scan. <span className="text-orange-500">Real Connection.</span></h2>
                <p className="text-xl text-neutral-500 max-w-xl mx-auto">Sometimes opportunities begin with a single introduction.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['A New Friend', 'A Collaborator', 'A Customer', 'A Future Employer'].map((item, idx) => (
                  <div key={idx} className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100 text-center group hover:bg-black hover:border-black transition-all duration-300">
                    <p className="font-display font-black text-sm uppercase tracking-wider group-hover:text-white transition-colors">{item}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-lg text-neutral-600 font-medium max-w-2xl mx-auto">
                KnoWMi helps make those moments easier. Scan once, connect instantly, and let that introduction continue beyond the first hello.
              </p>
            </section>

            {/* Beliefs & Values */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 bg-black text-white rounded-[48px] space-y-8 shadow-2xl shadow-black/20">
                <h3 className="text-3xl font-display font-black">What I Believe</h3>
                <ul className="space-y-6">
                  {[
                    'Be authentic.',
                    'Stay curious.',
                    'Make connecting easy.',
                    'Create something meaningful.',
                    'Wear your identity with pride.'
                  ].map((belief, i) => (
                    <li key={i} className="flex items-center gap-4 text-xl font-bold">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      {belief}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-12 bg-orange-500 text-white rounded-[48px] space-y-8 shadow-2xl shadow-orange-500/20">
                <h3 className="text-3xl font-display font-black">What KnoWMi Stands For</h3>
                <div className="space-y-6 text-xl font-bold leading-tight">
                  <p className="opacity-90">This is about more than a product.</p>
                  <p>It is about helping people be remembered. Helping people express who they are. Helping people connect in a way that feels natural.</p>
                </div>
                <div className="pt-4">
                  <Sparkles className="w-12 h-12 opacity-30" />
                </div>
              </div>
            </section>

            {/* Built for Real People */}
            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-display font-black text-black">Built for Real People</h2>
                <p className="text-neutral-500">KnoWMi is for people with personality.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Students', desc: 'Building their future.', icon: <Globe /> },
                  { title: 'Creators', desc: 'Sharing their work.', icon: <Sparkles /> },
                  { title: 'Developers', desc: 'Meeting collaborators.', icon: <Users /> },
                  { title: 'Gamers', desc: 'Finding community.', icon: <Zap /> },
                  { title: 'Fitness', desc: 'Building identity.', icon: <Heart /> },
                  { title: 'Visionaries', desc: 'Standing out and connecting.', icon: <Target /> },
                ].map((p, i) => (
                  <div key={i} className="p-8 bg-white border border-neutral-100 rounded-3xl shadow-lg shadow-neutral-100/50 flex items-center gap-6 group hover:border-orange-500/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {React.cloneElement(p.icon, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-black">{p.title}</h4>
                      <p className="text-sm text-neutral-500 font-medium">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vision & From Me */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-neutral-100 pt-32">
              <div className="space-y-8">
                <h3 className="text-3xl font-display font-black text-black">My Vision</h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  I believe physical products can do more than serve a purpose. They can create interaction. They can open doors. They can carry identity.
                </p>
                <p className="text-lg text-neutral-600 leading-relaxed font-bold">
                  My vision for KnoWMi is to build something where identity and connection come together in a simple, practical way.
                </p>
              </div>
              <div className="p-10 bg-neutral-50 rounded-3xl space-y-6">
                <MessageCircle className="w-10 h-10 text-orange-500 opacity-50" />
                <h3 className="text-2xl font-display font-black text-black">From Me</h3>
                <div className="space-y-4 text-neutral-600 italic leading-relaxed">
                  <p>This began as an idea I cared about deeply. Something small, but with the potential to grow into something meaningful.</p>
                  <p className="text-black font-bold not-italic text-lg">"If one scan can start one real connection, then this has purpose. And I believe it can become much bigger than that."</p>
                </div>
                <div className="pt-6">
                  <a href="mailto:support.knowmi@gmail.com" className="inline-flex items-center gap-2 text-sm font-black text-black hover:text-orange-500 transition-colors">
                    <Mail size={16} /> support.knowmi@gmail.com
                  </a>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="p-16 bg-neutral-900 rounded-[64px] text-center space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
                  Be Someone <br/>
                  <span className="text-orange-500 italic">People Remember</span>
                </h2>
                <p className="text-neutral-400 text-lg max-w-md mx-auto">
                  That is really what KnoWMi is about. Not just being seen — but being remembered.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/#pricing" className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all flex items-center gap-2 group shadow-2xl shadow-orange-500/20">
                  Explore KnoWMi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/#how-it-works" className="bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                  See How It Works
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
