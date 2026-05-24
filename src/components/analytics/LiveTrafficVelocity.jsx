import React, { useState, useEffect } from 'react';

export default function LiveTrafficVelocity() {
  // Initial heights for the visualizer
  const [heights, setHeights] = useState([
    40, 25, 65, 85, 45, 95, 75, 50, 80, 100, 60, 35, 70, 55, 90, 45, 80, 30
  ]);

  useEffect(() => {
    // Animate the bars like a real-time equalizer to simulate "live traffic velocity"
    const interval = setInterval(() => {
      setHeights(prev => 
        prev.map(h => {
          // Calculate a random shift up or down, bounded between 15 and 100
          const shift = Math.floor(Math.random() * 40) - 20; 
          let newH = h + shift;
          if (newH < 15) newH = 15;
          if (newH > 100) newH = 100;
          return newH;
        })
      );
    }, 700); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden" style={{ minHeight: '320px' }}>
      
      {/* Background aesthetic watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      <div className="flex-1 flex items-end gap-1.5 sm:gap-2.5 w-full h-full pb-2 pt-10 z-10">
        {heights.map((h, idx) => (
          <div 
            key={idx} 
            className="flex-1 bg-orange-500/5 rounded-t-md transition-colors h-full flex items-end"
          >
            <div 
              className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-md shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-[750ms] ease-out" 
              style={{ height: `${h}%` }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
