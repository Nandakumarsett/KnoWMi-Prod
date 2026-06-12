import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollyHome() {
  const containerRef = useRef(null);

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
      gsap.fromTo('.fabric-text', 
        { opacity: 0, y: 100 },
        {
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: '.fabric-section',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          }
        }
      );

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
    <div ref={containerRef} className="bg-black text-white overflow-hidden relative z-0 pb-32 font-display">
      
      {/* 1. Hero Section */}
      <section className="hero-section h-[100svh] w-full relative flex items-center justify-center overflow-hidden bg-black">
        <img 
          src="/assets/scrolly/shirt_hero.png" 
          alt="KnoWMi T-Shirt" 
          className="hero-shirt absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
        <div className="hero-text relative z-10 text-center px-4">
          <p className="text-sm md:text-base font-bold text-orange-500 tracking-[0.3em] uppercase mb-6">Introducing KnoWMi</p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">
            The Phygital<br/>Era <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 italic">Begins</span>
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-widest uppercase mt-12 animate-pulse">Scroll to unlock</p>
        </div>
      </section>

      {/* 2. Fabric Detail Section */}
      <section className="fabric-section min-h-[100svh] w-full relative bg-black flex items-center py-24 overflow-hidden">
        {/* Premium HD Background */}
        <div className="absolute inset-0 z-0">
           <img 
              src="/assets/scrolly/premium_heavyweight_fabric.png" 
              alt="Premium Fabric Background" 
              className="w-full h-full object-cover opacity-50 mix-blend-screen scale-105"
            />
            {/* Cinematic shadows */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        {/* 2-Column Content */}
        <div className="fabric-text relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl lg:w-1/2">
            <h2 className="text-5xl md:text-8xl font-black mb-8 uppercase leading-[0.9] tracking-tighter text-white">
              220 GSM<br/>Heavyweight.<br/><span className="text-orange-500">Drop Shoulder.</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 font-medium max-w-lg">Uncompromised comfort meets structured streetwear aesthetic. Designed to last a lifetime.</p>
          </div>
          
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] md:aspect-square lg:max-w-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(249,115,22,0.15)] group">
              <img 
                src="/assets/scrolly/anime_shirt.jpg" 
                alt="Anime Shirt" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. QR Section */}
      <section className="qr-section min-h-[100svh] w-full relative bg-black flex flex-col items-center justify-center py-24 px-6">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-5xl md:text-8xl font-black uppercase text-white leading-[0.9] tracking-tighter">
              Invisible <br className="hidden md:block"/><span className="text-orange-500">Tech.</span>
            </h2>
            <p className="text-lg md:text-2xl text-neutral-400 font-medium max-w-md text-left">
              The embedded QR tag. Scan once, bind forever. Your digital identity worn proudly.
            </p>
          </div>
          
          <div className="qr-glow relative w-full aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(249,115,22,0.15)] border border-white/10 group">
            <img 
              src="/assets/scrolly/invisible_tech_new.jpg" 
              alt="QR Code Grid" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            {/* Subtle interactive overlay */}
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          </div>
        </div>
      </section>

      {/* 4. Digital Profile Section */}
      <section className="profile-section min-h-[100svh] w-full relative bg-black flex items-center pt-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 z-10 md:pr-12 text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black uppercase mb-8 leading-[0.9] tracking-tighter">
              Your Life,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Embedded.</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
              A dynamic digital profile bound to your physical garment forever. Manage your identity, track scans, and connect instantly.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-end w-full h-[45vh] md:h-[80vh]">
            <img 
              src="/assets/scrolly/digital_profile.png" 
              alt="Digital Profile" 
              className="phone-mockup w-full h-full max-w-md object-contain object-bottom origin-bottom drop-shadow-[0_-20px_80px_rgba(249,115,22,0.3)]"
            />
          </div>
        </div>
      </section>
      
    </div>
  );
}
