import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, User, ShoppingCart, CheckCircle, MousePointer2, Zap, ArrowRight, X } from 'lucide-react';
import tshirtBackImg from '../assets/scrolly/tshirt_back_reveal.png';

export default function InteractiveJourney() {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Define the auto-playing sequence timings
    const sequence = [
      { p: 1, delay: 3500 }, // Phase 1: QR Scan (3.5s)
      { p: 2, delay: 3000 }, // Phase 2: Default Profile View (3s)
      { p: 3, delay: 3000 }, // Phase 3: Action Click (3s)
      { p: 4, delay: 3500 }, // Phase 4: Fake Login (3.5s)
      { p: 5, delay: 3000 }, // Phase 5: Checkout Success (3s)
      { p: 6, delay: 5000 }, // Phase 6: Finale Image (5s)
    ];

    let currentPhaseIdx = 0;
    
    const runSequence = () => {
      currentPhaseIdx = (currentPhaseIdx + 1) % sequence.length;
      setPhase(sequence[currentPhaseIdx].p);
      timeoutId = setTimeout(runSequence, sequence[currentPhaseIdx].delay);
    };

    let timeoutId = setTimeout(runSequence, sequence[0].delay);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] flex items-end justify-center" style={{ perspective: '1000px' }}>
      
      {/* Container holding the mock smartphone and finale image */}
      <div className="relative w-full max-w-[300px] sm:max-w-[320px] h-[550px] sm:h-[650px] transition-all duration-1000 ease-in-out">
        
        {/* The Finale Image - expands when phase 6 is active */}
        <AnimatePresence>
          {phase === 6 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1.2, y: -20 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-50 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.5)] border border-white/10 bg-black"
            >
              <img 
                src={tshirtBackImg} 
                alt="User wearing KnoWMi Tee (Back)"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-end p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-2">
                    KnoWMi <span className="text-orange-500">Live</span>
                  </h3>
                  <p className="text-neutral-300 text-sm font-medium">Bound forever to the physical realm.</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Mock Smartphone Frame */}
        <motion.div 
          animate={{
            scale: phase === 6 ? 0.8 : 1,
            opacity: phase === 6 ? 0 : 1,
            rotateY: phase === 1 ? 5 : 0,
            rotateX: phase === 1 ? 5 : 0
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-black rounded-[45px] border-[8px] border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-40"
        >
          {/* Dynamic Screen Content */}
          <div className="relative w-full h-full bg-neutral-950 flex flex-col items-center pt-12 overflow-hidden">
            
            {/* Phase 1: QR Scanning */}
            <AnimatePresence>
              {phase === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8"
                >
                  <div className="absolute top-8 text-neutral-400 font-medium text-sm flex items-center gap-2">
                    <Scan size={16} /> Scanning KnoWMi Garment
                  </div>
                  
                  {/* Mock QR Target */}
                  <div className="relative w-56 h-56 border-[4px] border-orange-500 rounded-xl overflow-hidden mt-8 flex items-center justify-center bg-black shadow-[8px_8px_0px_#F97316]">
                    {/* Brutalist typographic logo */}
                    <div className="absolute z-0 flex flex-col items-center justify-center w-full h-full gap-1">
                      <span className="text-5xl font-black tracking-tighter text-white leading-none">
                        Kno
                      </span>
                      <span className="text-5xl font-black tracking-tighter bg-orange-500 text-black px-2 leading-none border-[3px] border-white -rotate-2">
                        WM
                      </span>
                      <span className="text-5xl font-black tracking-tighter text-white leading-none">
                        i
                      </span>
                    </div>
                    
                    {/* Scanner Line */}
                    <motion.div 
                      animate={{ y: [-112, 112, -112] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute w-full h-1.5 bg-white shadow-[0_0_15px_#fff] z-10"
                    />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-24 bg-orange-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Tag Detected
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2 & 3: Default Profile View (Nanda Kumar) */}
            <AnimatePresence>
              {(phase === 2 || phase === 3) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="absolute inset-0 bg-[#f8f8fb] overflow-hidden w-full font-sans text-center px-4 pt-4"
                >
                  {/* Banner Image */}
                  <div className="w-full h-32 rounded-xl bg-black overflow-hidden relative border-[3px] border-black shadow-[4px_4px_0px_#000] flex flex-col items-start justify-center p-6 mb-4">
                     <h2 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight text-left">Code.<br/>Build.<br/><span className="text-orange-500">Innovate.</span></h2>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative -mt-10 mb-2 w-full flex justify-center">
                    <div className="w-20 h-20 rounded-xl bg-neutral-800 border-[3px] border-black overflow-hidden shadow-[4px_4px_0px_#000] relative">
                      <img src="/mock-profile.jpg" alt="Nikhil Kumar" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-orange-500 border-2 border-black rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Profile Info */}
                  <h2 className="text-black text-3xl font-black mb-1 uppercase tracking-tight">Nikhil Kumar</h2>
                  <p className="text-black font-black text-xs mb-3 uppercase tracking-wider bg-orange-500 inline-block px-2 py-0.5 border-[2px] border-black -rotate-1 shadow-[2px_2px_0px_#000]">Content Creator</p>
                  
                  {/* Availability Pill */}
                  <div className="inline-flex items-center justify-center w-full mt-2 mb-5">
                    <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                       <div className="w-2 h-2 bg-orange-500 rounded-full border border-black"></div>
                       <span className="text-black text-[10px] font-black uppercase">Open</span>
                       <span className="text-neutral-500 font-bold text-[10px]">- Responds fast</span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black">
                      <Scan size={18} strokeWidth={3} />
                    </div>
                    <div className="w-10 h-10 bg-white rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black">
                      <User size={18} strokeWidth={3} />
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex justify-between px-2 mb-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-xl py-2 mx-2">
                    <div className="flex flex-col items-center flex-1">
                      <span className="font-black text-black text-lg">48K</span>
                      <span className="text-[8px] font-black text-neutral-500 tracking-widest uppercase">Reach</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 border-x-[3px] border-black">
                      <span className="font-black text-black text-lg">DEL</span>
                      <span className="text-[8px] font-black text-neutral-500 tracking-widest uppercase">Top City</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="font-black text-black text-lg">18-35</span>
                      <span className="text-[8px] font-black text-neutral-500 tracking-widest uppercase">Age Group</span>
                    </div>
                  </div>
                  
                  {/* Inside the mind */}
                  <div className="mb-4 mx-2 bg-orange-500 border-[3px] border-black shadow-[4px_4px_0px_#000] p-3 rounded-xl text-left">
                    <div className="flex items-center gap-2 mb-1 text-black">
                      <Zap size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Inside the mind</span>
                    </div>
                    <p className="text-xs font-black text-black leading-tight">
                      Very enthusiastic towards my work. I respect all work. Let's collaborate.
                    </p>
                  </div>

                  {/* Claim Button */}
                  <div className="absolute bottom-4 left-0 w-full px-4 group z-50">
                    <motion.div
                      animate={phase === 3 ? { scale: [1, 0.95, 1], x: [0, 2, 0], y: [0, 2, 0], boxShadow: ["4px 4px 0px #000", "0px 0px 0px #000", "4px 4px 0px #000"] } : {}}
                      transition={{ duration: 0.3, delay: 1 }}
                      className="w-full py-4 bg-orange-500 rounded-lg flex items-center justify-center gap-2 text-black border-[3px] border-black font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_#000] relative overflow-hidden"
                    >
                      <ShoppingCart size={18} strokeWidth={3} />
                      Claim Your Tee
                    </motion.div>
                  </div>

                  {/* Animated Cursor (Phase 3 only) */}
                  <AnimatePresence>
                    {phase === 3 && (
                      <motion.div 
                        initial={{ x: 50, y: 400, opacity: 0 }}
                        animate={{ x: 120, y: 340, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute z-50 pointer-events-none"
                      >
                        <MousePointer2 size={32} className="text-slate-800 drop-shadow-xl" fill="rgba(255,255,255,0.8)" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 4: Fake Login */}
            <AnimatePresence>
              {phase === 4 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 bg-neutral-950 p-6 flex flex-col items-center justify-center z-20"
                >
                  <img src="/logo-square.png" alt="KnoWMi" className="w-12 h-12 mb-6" />
                  <h3 className="text-white text-xl font-bold mb-8">Sign in to KnoWMi</h3>
                  
                  <div className="w-full space-y-4">
                    <div className="w-full bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                      <div className="text-neutral-500 text-xs mb-1">Email</div>
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-white font-mono overflow-hidden whitespace-nowrap"
                      >
                        nikhil@knowmi.com
                      </motion.div>
                    </div>
                    
                    <div className="w-full bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                      <div className="text-neutral-500 text-xs mb-1">Password</div>
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="text-white font-mono overflow-hidden whitespace-nowrap tracking-widest"
                      >
                        ••••••••
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 0.95, 1], backgroundColor: ["#f97316", "#ea580c", "#f97316"] }}
                      transition={{ duration: 0.3, delay: 2.2 }}
                      className="w-full mt-6 py-4 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold tracking-wide relative overflow-hidden"
                    >
                      Login & Continue
                      <motion.div 
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.6, delay: 2.2 }}
                        className="absolute inset-0 bg-white rounded-full origin-center pointer-events-none"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 5: Razorpay Checkout */}
            <AnimatePresence>
              {phase === 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#0e1116] p-6 flex flex-col w-full z-30"
                >
                  <div className="flex items-center justify-between mt-4 mb-8">
                    <div className="text-white font-bold flex items-center gap-2">
                       <Zap size={18} className="text-blue-500" /> Pay
                    </div>
                    <X size={20} className="text-neutral-500" />
                  </div>
                  
                  <div className="bg-neutral-900 rounded-2xl p-6 mb-4 w-full text-left">
                    <div className="text-neutral-400 text-sm mb-1">Paying KnoWMi Studios</div>
                    <div className="text-white text-4xl font-bold font-mono">₹999.00</div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center pb-20 w-full">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                    >
                      <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-white text-xl font-bold mb-2 text-center"
                    >
                      Payment Successful
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-neutral-400 text-center text-sm px-4"
                    >
                      Your physical tee is being embedded and prepared for shipment.
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
          
          {/* Mock Phone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-50"></div>
          
        </motion.div>
      </div>
    </div>
  );
}
