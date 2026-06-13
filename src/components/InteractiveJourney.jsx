import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, User, ShoppingCart, CheckCircle, MousePointer2, Zap, ArrowRight, X } from 'lucide-react';

export default function InteractiveJourney() {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Define the auto-playing sequence timings
    const sequence = [
      { p: 1, delay: 3500 }, // Phase 1: QR Scan (3.5s)
      { p: 2, delay: 3000 }, // Phase 2: Glow Profile (3s)
      { p: 3, delay: 3000 }, // Phase 3: Action Click (3s)
      { p: 4, delay: 3000 }, // Phase 4: Checkout Success (3s)
      { p: 5, delay: 5000 }, // Phase 5: Finale Image (5s)
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
      <div className="relative w-full max-w-[320px] h-[650px] transition-all duration-1000 ease-in-out">
        
        {/* The Finale Image - expands when phase 5 is active */}
        <AnimatePresence>
          {phase === 5 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1.2, y: -20 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-50 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.5)] border border-white/10 bg-black"
            >
              <img 
                src="/assets/scrolly/tshirt_front_v9.jpg" 
                alt="User wearing KnoWMi Tee"
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
            scale: phase === 5 ? 0.8 : 1,
            opacity: phase === 5 ? 0 : 1,
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
                  <div className="relative w-48 h-48 border-2 border-white/20 rounded-3xl overflow-hidden mt-8 flex items-center justify-center">
                    <img src="/knowmi_logo.png" alt="KnoWMi" className="w-16 h-16 opacity-50 absolute z-0" />
                    
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

            {/* Phase 2 & 3: Glow Profile View */}
            <AnimatePresence>
              {(phase === 2 || phase === 3) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="absolute inset-0 bg-[#0A0A0A] overflow-hidden w-full"
                >
                  {/* Header/Banner */}
                  <div className="h-32 bg-gradient-to-b from-orange-900/40 to-transparent relative">
                    <img src="/knowmi_logo.png" alt="KnoWMi" className="w-8 h-8 absolute top-6 left-6" />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="px-6 -mt-12 relative z-10 w-full">
                    <div className="w-24 h-24 rounded-full bg-neutral-800 border-4 border-[#0A0A0A] mb-4 overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                      <div className="w-full h-full bg-gradient-to-tr from-orange-600 to-yellow-500" />
                    </div>
                    
                    <h2 className="text-white text-2xl font-black mb-1">Alex KnoWMi</h2>
                    <p className="text-orange-500 font-medium text-sm mb-4">Digital Creator</p>
                    
                    <div className="flex gap-4 mb-8 w-full">
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-white font-bold text-lg">12.4K</div>
                        <div className="text-neutral-500 text-xs">Scans</div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-white font-bold text-lg">850</div>
                        <div className="text-neutral-500 text-xs">Tees Sold</div>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <div className="relative group w-full">
                      <motion.div 
                        animate={phase === 3 ? { scale: [1, 0.95, 1], backgroundColor: ["#f97316", "#ea580c", "#f97316"] } : {}}
                        transition={{ duration: 0.3, delay: 1 }}
                        className="w-full py-4 bg-orange-500 rounded-full flex items-center justify-center gap-2 text-black font-black uppercase tracking-widest relative overflow-hidden"
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
                        <MousePointer2 size={32} className="text-white drop-shadow-xl" fill="rgba(255,255,255,0.8)" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 4: Razorpay Checkout */}
            <AnimatePresence>
              {phase === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#0e1116] p-6 flex flex-col w-full"
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
