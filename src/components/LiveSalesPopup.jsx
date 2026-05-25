import React, { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';

const RECENT_PURCHASES = [
  { name: 'Rahul', city: 'Delhi', plan: 'Creator Plan' },
  { name: 'Priya', city: 'Bangalore', plan: 'Starter Plan' },
  { name: 'Arjun', city: 'Pune', plan: 'Creator Plan' },
  { name: 'Sneha', city: 'Hyderabad', plan: 'Team Plan' },
  { name: 'Karan', city: 'Mumbai', plan: 'Creator Plan' },
  { name: 'Ananya', city: 'Chennai', plan: 'Starter Plan' },
  { name: 'Vikram', city: 'Gurgaon', plan: 'Creator Plan' },
  { name: 'Neha', city: 'Noida', plan: 'Starter Plan' },
];

const TIME_AGO = ['Just now', '2 mins ago', '5 mins ago', '12 mins ago', '22 mins ago'];

export default function LiveSalesPopup() {
  const [visible, setVisible] = useState(false);
  const [purchase, setPurchase] = useState(null);
  const [timeAgo, setTimeAgo] = useState('Just now');
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    // Show first popup after 3 seconds
    const initialTimer = setTimeout(() => {
      triggerNewPopup();
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, [closed]);

  const triggerNewPopup = () => {
    if (closed) return;
    
    // Pick random purchase
    const randomPurchase = RECENT_PURCHASES[Math.floor(Math.random() * RECENT_PURCHASES.length)];
    const randomTime = TIME_AGO[Math.floor(Math.random() * TIME_AGO.length)];
    
    setPurchase(randomPurchase);
    setTimeAgo(randomTime);
    setVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setVisible(false);
      
      // Trigger next popup in 15 to 30 seconds
      if (!closed) {
        const nextDelay = Math.floor(Math.random() * 15000) + 15000;
        setTimeout(triggerNewPopup, nextDelay);
      }
    }, 5000);
  };

  if (closed || !purchase) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-[90] transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-neutral-100 flex items-start gap-4 max-w-sm relative">
        <button 
          onClick={() => { setClosed(true); setVisible(false); }}
          className="absolute top-2 right-2 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={12} />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={18} className="text-orange-500" />
        </div>
        
        <div>
          <p className="text-xs font-bold text-neutral-800 leading-tight">
            Someone from {purchase.city} just bought
          </p>
          <p className="text-sm font-black text-black my-0.5">
            a {purchase.plan}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{timeAgo}</p>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
