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
                  <div className="relative w-48 h-48 border-2 border-white/20 rounded-3xl overflow-hidden mt-8 flex items-center justify-center bg-white/5">
                    <img src="/logo-square.png" alt="KnoWMi" className="w-16 h-16 opacity-100 absolute z-0 shadow-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    
                    {/* Scanner Line */}
                    <motion.div 
                      animate={{ y: [-100, 100, -100] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute w-full h-1 bg-orange-500 shadow-[0_0_20px_#f97316] z-10"
                    />
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500 rounded-br-3xl" />
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
                  <div className="w-full h-32 rounded-3xl bg-black overflow-hidden relative shadow-lg flex flex-col items-start justify-center p-6 border-b-4 border-orange-500">
                     <h2 className="text-white font-bold text-xl leading-tight text-left">Code.<br/>Build.<br/><span className="text-orange-500">Innovate.</span></h2>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative -mt-10 mb-2 w-full flex justify-center">
                    <div className="w-20 h-20 rounded-[24px] bg-neutral-800 border-4 border-[#f8f8fb] overflow-hidden shadow-lg relative">
                      <img src="/mock-profile.jpg" alt="Nikhil Kumar" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Profile Info */}
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 text-2xl font-black mb-1">Nikhil Kumar</h2>
                  <p className="text-slate-600 font-semibold text-xs mb-3">Content Creator</p>
                  
                  {/* Availability Pill */}
                  <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 mb-5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     <span className="text-slate-700 text-[10px] font-semibold">Open</span>
                     <span className="text-slate-400 text-[10px]">- Responds within 24 hours</span>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-700">
                      <Scan size={16} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-700">
                      <User size={16} />
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex justify-between px-2 mb-4">
                    <div className="flex flex-col items-center flex-1">
                      <span className="font-bold text-slate-800 text-base sm:text-lg">48</span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-slate-500 tracking-widest uppercase">Impressions</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 border-x border-slate-200">
                      <span className="font-bold text-slate-800 text-base sm:text-lg">BNGLR</span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-slate-500 tracking-widest uppercase">Most Reached</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="font-bold text-slate-800 text-base sm:text-lg">18-35</span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-slate-500 tracking-widest uppercase">Audience Age</span>
                    </div>
                  </div>
                  
                  {/* Inside the mind */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2 text-purple-500">
                      <Zap size={10} />
                      <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase">Inside the mind</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight px-2 sm:px-4">
                      I am Very enthusiastic towards my work. I respect all work
                    </p>
                  </div>

                  {/* Claim Button */}
                  <div className="absolute bottom-4 left-0 w-full px-6 group z-50">
                    <motion.div
                      animate={phase === 3 ? { scale: [1, 0.95, 1], backgroundColor: ["#f97316", "#ea580c", "#f97316"] } : {}}
                      transition={{ duration: 0.3, delay: 1 }}
                      className="w-full py-3 sm:py-4 bg-orange-500 rounded-2xl flex items-center justify-center gap-2 text-white font-black uppercase text-xs sm:text-sm tracking-widest relative overflow-hidden shadow-xl"
                    >
                      <ShoppingCart size={18} />
                      Claim Your Tee
                      
                      {phase === 3 && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          className="absolute inset-0 bg-white rounded-full origin-center pointer-events-none"
                        />
                      )}
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
