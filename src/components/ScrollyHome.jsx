import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon } from 'lucide-react';
import Tshirt3DModel from './Tshirt3DModel';
import InteractiveJourney from './InteractiveJourney';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollyHome() {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    let ctx = gsap.context(() => {
      
      // 1. Hero Reveal
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
        }
      });
      
      heroTimeline.to('.hero-shirt', {
        scale: 1.15,
        opacity: 0.2,
        ease: 'none'
      }, 0);
      
      heroTimeline.to('.hero-text', {
        y: -150,
        opacity: 0,
        ease: 'none'
      }, 0);

      // 2. Fabric Section
      const fabricTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.fabric-section',
          start: 'top 60%',
          end: 'center center',
          scrub: 1,
        }
      });

      fabricTl.to('.fabric-title', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      })
      .to('.fabric-badge', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
      }, "-=0.5")
      .to('.fabric-desc', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, "-=0.5")
      .to('.fabric-image', {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out'
      }, 0);

      // 3. QR Section
      gsap.fromTo('.qr-glow', 
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1, 
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: '.qr-section',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );

      // 4. Digital Profile
      gsap.fromTo('.phone-mockup',
        { y: '50vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.profile-section',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative z-0 pb-32 font-display transition-colors duration-500">
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-slate-100 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg text-slate-800 dark:text-white transition-all hover:scale-110"
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* 1. Hero Section */}
      <section className="hero-section h-[100svh] w-full relative flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-500">
        <img 
          src="/assets/scrolly/shirt_hero.png" 
          alt="KnoWMi T-Shirt" 
          className="hero-shirt absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white dark:from-transparent dark:via-black/40 dark:to-black pointer-events-none transition-colors duration-500" />
        <div className="hero-text relative z-10 text-center px-4">
          <p className="text-sm md:text-base font-bold text-orange-500 tracking-[0.3em] uppercase mb-6">Introducing KnoWMi</p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-4 leading-[0.9] text-slate-900 dark:text-white transition-colors duration-500">
            The Phygital<br/>Era <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 italic">Begins</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium tracking-widest uppercase mt-12 animate-pulse">Scroll to unlock</p>
        </div>
      </section>

      {/* 2. Fabric Detail Section */}
      <section className="fabric-section min-h-[100svh] w-full relative bg-white dark:bg-black flex items-center py-24 overflow-hidden transition-colors duration-500">
        {/* Premium HD Background */}
        <div className="absolute inset-0 z-0">
           <img 
              src="/assets/scrolly/premium_heavyweight_fabric.png" 
              alt="Premium Fabric Background" 
              className="w-full h-full object-cover opacity-10 dark:opacity-50 dark:mix-blend-screen scale-105"
            />
            {/* Cinematic shadows */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black transition-colors duration-500" />
        </div>
        
        {/* 2-Column Content */}
        <div className="fabric-text relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl lg:w-3/5 flex flex-col gap-8 md:gap-12 z-10">
            {/* 220 GSM */}
            <div className="overflow-hidden">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-slate-900 dark:text-white translate-y-full opacity-0">
                220 GSM<br/>Heavyweight.<br/><span className="text-orange-500">Drop Shoulder.</span>
              </h2>
            </div>

            {/* 200 GSM */}
            <div className="overflow-hidden">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-slate-300 hover:text-slate-400 dark:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-500 cursor-pointer translate-y-full opacity-0">
                200 GSM<br/>Regular Tee.
              </h2>
            </div>
            
            {/* Hoodie */}
            <div className="overflow-hidden relative flex items-start gap-4">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-slate-200 dark:text-neutral-800 translate-y-full opacity-0">
                Premium<br/>Hoodie.
              </h2>
              <div className="fabric-badge opacity-0 -translate-y-4">
                <span className="text-orange-500 text-xs md:text-sm font-bold tracking-widest uppercase px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 mt-2 block shadow-[0_0_15px_rgba(249,115,22,0.2)]">Coming Soon</span>
              </div>
            </div>

            <p className="fabric-desc text-xl md:text-2xl text-slate-500 dark:text-neutral-400 font-medium max-w-lg mt-4 opacity-0 translate-y-8">
              Uncompromised comfort meets structured streetwear aesthetic. Designed to last a lifetime.
            </p>
          </div>
          
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="fabric-image relative w-full h-[500px] lg:h-[700px] max-w-md lg:max-w-xl group opacity-0 translate-x-12">
              <Tshirt3DModel />
            </div>
          </div>
        </div>
      </section>

      {/* 3. QR Section */}
      <section className="qr-section min-h-[100svh] w-full relative bg-white dark:bg-black flex flex-col items-center justify-center py-24 px-6 transition-colors duration-500">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-5xl md:text-8xl font-black uppercase text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              Invisible <br className="hidden md:block"/><span className="text-orange-500">Tech.</span>
            </h2>
            <p className="text-lg md:text-2xl text-slate-500 dark:text-neutral-400 font-medium max-w-md text-left">
              The embedded QR tag. Scan once, bind forever. Your digital identity worn proudly.
            </p>
          </div>
          
          <div className="qr-glow relative w-full aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(249,115,22,0.15)] border border-slate-200 dark:border-white/10 group">
            <img 
              src="/assets/scrolly/invisible_tech_new.jpg" 
              alt="QR Code Grid" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            {/* Subtle interactive overlay */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/10 transition-colors group-hover:bg-transparent" />
          </div>
        </div>
      </section>

      {/* 4. Digital Profile Section */}
      <section className="profile-section min-h-[100svh] w-full relative bg-white dark:bg-black flex items-center pt-24 px-6 overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 z-10 md:pr-12 text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black uppercase mb-8 leading-[0.9] tracking-tighter">
              Your Life,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Embedded.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-neutral-400 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
              A dynamic digital profile bound to your physical garment forever. Manage your identity, track scans, and connect instantly.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-end w-full min-h-[500px] md:h-[80vh] mt-8 md:mt-0">
            <div className="phone-mockup w-full h-full max-w-md drop-shadow-[0_-20px_80px_rgba(249,115,22,0.3)]">
              <InteractiveJourney />
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
