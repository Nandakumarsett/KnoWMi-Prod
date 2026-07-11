import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tshirt3DModel from './Tshirt3DModel';
import InteractiveJourney from './InteractiveJourney';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollyHome() {
  const containerRef = useRef(null);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
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
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set('.phone-mockup', { y: 0, opacity: 1 });
        gsap.set('.qr-glow', { scale: 1, opacity: 1, y: 0 });
        gsap.set('.fabric-title, .fabric-badge, .fabric-desc, .fabric-image', { x: 0, y: 0, opacity: 1 });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden relative z-0 pb-32 font-display">
      
      {/* 1. Hero Section */}
      <section className="hero-section h-[100svh] w-full relative flex items-center justify-center overflow-hidden bg-black">
        <img 
          src="/assets/scrolly/shirt_hero.webp" 
          alt="KnoWMi T-Shirt" 
          className="hero-shirt absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
        <div className="hero-text relative z-10 text-center px-4">
          <p className="text-sm md:text-base font-bold text-orange-500 tracking-[0.3em] uppercase mb-6">Introducing KnoWMi</p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">
            The Phygital<br/>Era <span className="bg-orange-500 text-black px-4 py-1 rounded-xl inline-block mt-2 border-[3px] border-black shadow-[5px_5px_0px_#000] rotate-2">Begins</span>
          </h1>
          <div className="flex flex-col items-center gap-2 mt-12 animate-bounce">
            <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">Explore Our Features Below</p>
            <ChevronDown className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </section>

      {/* 2. Fabric Detail Section */}
      <section className="fabric-section min-h-[100svh] w-full relative bg-black flex items-center py-24 overflow-hidden">
        {/* Premium HD Background */}
        <div className="absolute inset-0 z-0">
           <img 
              src="/assets/scrolly/premium_heavyweight_fabric.webp" 
              alt="Premium Fabric Background" 
              className="w-full h-full object-cover opacity-50 mix-blend-screen scale-105"
            />
            {/* Cinematic shadows */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        {/* 2-Column Content */}
        <div className="fabric-text relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl lg:w-3/5 flex flex-col gap-8 md:gap-12 z-10">
            {/* 220 GSM */}
            <div className="overflow-hidden">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white translate-y-full opacity-0">
                220 GSM<br/>Heavyweight.<br/><span className="text-orange-500">Drop Shoulder.</span>
              </h2>
            </div>

            {/* 200 GSM */}
            <div className="overflow-hidden">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-neutral-600 hover:text-neutral-300 transition-colors duration-500 cursor-pointer translate-y-full opacity-0">
                200 GSM<br/>Regular Tee.
              </h2>
            </div>
            
            {/* Hoodie */}
            <div className="overflow-hidden relative flex items-start gap-4">
              <h2 className="fabric-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-neutral-800 translate-y-full opacity-0">
                Premium<br/>Hoodie.
              </h2>
              <div className="fabric-badge opacity-0 -translate-y-4">
                <span className="text-black text-xs md:text-sm font-black tracking-widest uppercase px-3 py-1.5 bg-orange-500 rounded-lg border-[3px] border-black mt-2 block shadow-[3px_3px_0px_#000]">Coming Soon</span>
              </div>
            </div>

            <p className="fabric-desc text-xl md:text-2xl text-neutral-400 font-medium max-w-lg mt-4 opacity-0 translate-y-8">
              Uncompromised comfort meets structured streetwear aesthetic. Designed to last a lifetime.
            </p>
          </div>
          
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="fabric-image relative w-full h-[500px] lg:h-[700px] max-w-md lg:max-w-xl group opacity-0 translate-x-12 lg:-mt-16">
              <Tshirt3DModel />
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
          
          <div className="qr-glow relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border-[3px] border-white shadow-[8px_8px_0px_#F97316] group">
            <img 
              src="/assets/scrolly/invisible_tech_new.webp" 
              alt="QR Code Grid" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            {/* Subtle interactive overlay */}
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          </div>
        </div>
      </section>

      {/* 4. Digital Profile Section */}
      <section className="profile-section min-h-0 md:min-h-[100svh] w-full relative bg-black flex items-center py-12 md:pt-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          {/* Text — compact on mobile */}
          <div className="flex-1 z-10 md:pr-12 text-center md:text-left">
            <span className="inline-block mb-3 px-3 py-1 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-md">Digital Identity</span>
            <h2 className="text-3xl md:text-8xl font-black uppercase mb-3 md:mb-8 leading-[0.9] tracking-tighter">
              Your Life,<br/><span className="text-orange-500 underline decoration-[3px] md:decoration-[6px] underline-offset-4 md:underline-offset-8">Embedded.</span>
            </h2>
            <p className="hidden md:block text-xl md:text-2xl text-neutral-400 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
              A dynamic digital profile bound to your physical garment forever. Manage your identity, track scans, and connect instantly.
            </p>
            <p className="md:hidden text-sm text-neutral-400 mb-4 max-w-xs mx-auto font-medium leading-relaxed">
              One scan. Your entire digital world — live, real-time, always updated.
            </p>
          </div>
          {/* Phone mockup — fixed height on mobile, full height on desktop */}
          <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md h-[520px] sm:h-[560px] md:h-[80vh] mt-2 md:mt-0 relative flex justify-center mx-auto">
            <div className="phone-mockup w-full h-full drop-shadow-[6px_6px_0px_#F97316] md:drop-shadow-[8px_8px_0px_#F97316]">
              <InteractiveJourney />
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
