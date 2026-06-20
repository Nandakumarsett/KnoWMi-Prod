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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-[900px] mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-32 animate-reveal">
            <div className="inline-block px-4 py-1 rounded-full bg-orange-500 border-[2px] border-black text-black text-[10px] font-black uppercase tracking-widest mb-6 shadow-[2px_2px_0px_#000]">Our Story</div>
            <h1 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight text-white uppercase tracking-tighter">
              Modeling the Future of <br/>
              <span className="text-orange-500">Human Connection</span>
            </h1>
            <div className="space-y-6 text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto font-bold">
              <p>KnoWMi started from a simple thought I kept coming back to —</p>
              <p className="text-white font-black">Why are we still exchanging information the old way, when the world around us has changed?</p>
              <p className="text-lg">We meet people, share numbers, follow each other on social media, exchange cards — but most of those connections fade. I felt there had to be a simpler and more meaningful way.</p>
              <p className="text-orange-500 font-display font-black text-2xl tracking-tight mt-10 uppercase">That thought became KnoWMi.</p>
            </div>
          </div>

          <div className="space-y-40">
            {/* Why I Built This */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-orange-500">The Motivation</h2>
                  <h3 className="text-4xl font-display font-black text-white uppercase leading-tight tracking-tighter">Why I Built This</h3>
                </div>
                <div className="space-y-6 text-lg text-neutral-400 leading-relaxed font-bold">
                  <p>I wanted to create something that turns introductions into real connections. Something simple, practical, and meaningful.</p>
                  <p className="p-6 bg-[#1a1a1a] rounded-xl border-[4px] border-orange-500 shadow-[6px_6px_0px_#f97316] font-black text-white">
                    "A way for people to express identity while making it easier to connect in everyday life. That idea is at the heart of KnoWMi."
                  </p>
                </div>
              </div>
              <div className="aspect-square bg-[#1a1a1a] border-[4px] border-white rounded-2xl relative overflow-hidden shadow-[8px_8px_0px_#fff] group flex items-center justify-center">
                 <div className="text-orange-500">
                   <Zap size={100} strokeWidth={1.5} />
                 </div>
              </div>
            </section>

            {/* One Scan. Real Connection. */}
            <section className="text-center space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase text-white">One Scan. <span className="text-orange-500">Real Connection.</span></h2>
                <p className="text-xl text-neutral-400 font-bold max-w-xl mx-auto">Sometimes opportunities begin with a single introduction.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['A New Friend', 'A Collaborator', 'A Customer', 'A Future Employer'].map((item, idx) => (
                  <div key={idx} className="p-8 bg-[#1a1a1a] rounded-xl border-[3px] border-white text-center group hover:border-orange-500 transition-all duration-300 hover:shadow-[4px_4px_0px_#f97316] hover:-translate-y-1">
                    <p className="font-display font-black text-sm uppercase tracking-wider text-white group-hover:text-orange-500 transition-colors">{item}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-lg text-neutral-400 font-bold max-w-2xl mx-auto">
                KnoWMi helps make those moments easier. Scan once, connect instantly, and let that introduction continue beyond the first hello.
              </p>
            </section>

            {/* Beliefs & Values */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 bg-[#1a1a1a] text-white border-[4px] border-white rounded-2xl space-y-8 shadow-[8px_8px_0px_#fff]">
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter">What I Believe</h3>
                <ul className="space-y-6">
                  {[
                    'Be authentic.',
                    'Stay curious.',
                    'Make connecting easy.',
                    'Create something meaningful.',
                    'Wear your identity with pride.'
                  ].map((belief, i) => (
                    <li key={i} className="flex items-center gap-4 text-xl font-black">
                      <div className="w-4 h-4 bg-orange-500 border-[2px] border-black shadow-[2px_2px_0px_#000] rotate-45" />
                      {belief}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-12 bg-orange-500 text-black border-[4px] border-black rounded-2xl space-y-8 shadow-[8px_8px_0px_#000]">
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter">What KnoWMi Stands For</h3>
                <div className="space-y-6 text-xl font-black leading-tight">
                  <p>This is about more than a product.</p>
                  <p>It is about helping people be remembered. Helping people express who they are. Helping people connect in a way that feels natural.</p>
                </div>
                <div className="pt-4">
                  <Sparkles className="w-12 h-12 text-black" />
                </div>
              </div>
            </section>

            {/* Built for Real People */}
            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Built for Real People</h2>
                <p className="text-neutral-400 font-bold">KnoWMi is for people with personality.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Students', desc: 'Building their future.', icon: <Globe /> },
                  { title: 'Creators', desc: 'Sharing their work.', icon: <Sparkles /> },
                  { title: 'Developers', desc: 'Meeting collaborators.', icon: <Users /> },
                  { title: 'Visionaries', desc: 'Standing out and connecting.', icon: <Target /> },
                ].map((p, i) => (
                  <div key={i} className="p-6 bg-[#1a1a1a] border-[3px] border-white rounded-xl shadow-[4px_4px_0px_#fff] flex flex-col items-start gap-4 group hover:border-orange-500 hover:shadow-[4px_4px_0px_#f97316] hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-black border-[2px] border-black shadow-[2px_2px_0px_#000]">
                      {React.cloneElement(p.icon, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-white uppercase">{p.title}</h4>
                      <p className="text-sm text-neutral-400 font-bold">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vision & From Me */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-[4px] border-white pt-32">
              <div className="space-y-8">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">My Vision</h3>
                <p className="text-lg text-neutral-400 font-bold leading-relaxed">
                  I believe physical products can do more than serve a purpose. They can create interaction. They can open doors. They can carry identity.
                </p>
                <p className="text-lg text-white leading-relaxed font-black">
                  My vision for KnoWMi is to build something where identity and connection come together in a simple, practical way.
                </p>
              </div>
              <div className="p-10 bg-[#1a1a1a] border-[4px] border-orange-500 rounded-2xl space-y-6 shadow-[6px_6px_0px_#f97316]">
                <MessageCircle className="w-10 h-10 text-orange-500" />
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">From Me</h3>
                <div className="space-y-4 text-neutral-300 font-bold leading-relaxed">
                  <p>This began as an idea I cared about deeply. Something small, but with the potential to grow into something meaningful.</p>
                  <p className="text-orange-500 font-black text-lg">"If one scan can start one real connection, then this has purpose. And I believe it can become much bigger than that."</p>
                </div>
                <div className="pt-6">
                  <a href="mailto:support.knowmi@gmail.com" className="inline-flex items-center gap-2 text-sm font-black text-white hover:text-orange-500 transition-colors bg-black px-4 py-2 rounded-lg border-[2px] border-white shadow-[2px_2px_0px_#fff]">
                    <Mail size={16} /> support.knowmi@gmail.com
                  </a>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="p-16 bg-orange-500 rounded-2xl border-[4px] border-black text-center space-y-10 relative overflow-hidden shadow-[8px_8px_0px_#000]">
              
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl md:text-6xl font-display font-black text-black uppercase tracking-tighter leading-tight">
                  Be Someone <br/>
                  <span className="text-white">People Remember</span>
                </h2>
                <p className="text-black font-black text-lg max-w-md mx-auto">
                  That is really what KnoWMi is about. Not just being seen — but being remembered.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/#pricing" className="bg-black text-white border-[3px] border-black px-10 py-5 rounded-xl font-black text-lg uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all flex items-center gap-2 group">
                  Explore KnoWMi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/#how-it-works" className="bg-white text-black border-[3px] border-black px-10 py-5 rounded-xl font-black text-lg uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all">
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
