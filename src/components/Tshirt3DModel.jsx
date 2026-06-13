import React, { useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Interactive T-shirt viewer using photorealistic images + CSS 3D transforms
// Drag/touch to rotate. Shows front and back based on rotation angle.
// ─────────────────────────────────────────────────────────────────────────────
export default function Tshirt3DModel() {
  const containerRef = useRef(null);
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0 });
  const animFrame = useRef(null);

  // Auto-rotate when not dragging
  const autoRotate = useRef(true);
  React.useEffect(() => {
    let frame;
    const spin = () => {
      if (autoRotate.current && !isDragging) {
        setRotateY(prev => prev + 0.3);
      }
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, [isDragging]);

  // Determine which face to show
  const normalizedAngle = ((rotateY % 360) + 360) % 360;
  const showBack = normalizedAngle > 90 && normalizedAngle < 270;

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    autoRotate.current = false;
    lastPos.current = { x: e.clientX || e.touches?.[0]?.clientX || 0, y: e.clientY || e.touches?.[0]?.clientY || 0 };
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;
    velocity.current.x = deltaX;
    setRotateY(prev => prev + deltaX * 0.5);
    setRotateX(prev => Math.max(-15, Math.min(15, prev - deltaY * 0.3)));
    lastPos.current = { x: clientX, y: clientY };
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    // Momentum
    const decelerate = () => {
      if (Math.abs(velocity.current.x) > 0.1) {
        setRotateY(prev => prev + velocity.current.x * 0.4);
        velocity.current.x *= 0.95;
        animFrame.current = requestAnimationFrame(decelerate);
      } else {
        // Resume auto-rotate after momentum stops
        setTimeout(() => { autoRotate.current = true; }, 2000);
      }
    };
    animFrame.current = requestAnimationFrame(decelerate);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{ perspective: '1200px' }}
    >
      {/* 3D card wrapper */}
      <div
        className="relative w-[90vw] h-[90vw] max-w-[850px] max-h-[850px] md:w-[700px] md:h-[800px] lg:w-[850px] lg:h-[950px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isDragging ? 'none' : 'transform 0.05s linear',
        }}
      >
        {/* FRONT face */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <img
            src="/assets/scrolly/tshirt_front_v4.png"
            alt="KnoWMi T-Shirt Front"
            className="w-full h-full object-contain mix-blend-lighten drop-shadow-[0_20px_60px_rgba(255,85,0,0.15)]"
            draggable={false}
          />
        </div>

        {/* BACK face */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src="/assets/scrolly/tshirt_back_v6.png"
            alt="KnoWMi T-Shirt Back"
            className="w-full h-full object-contain mix-blend-lighten drop-shadow-[0_20px_60px_rgba(255,85,0,0.15)]"
            draggable={false}
          />
        </div>
      </div>

      {/* Subtle "drag to rotate" hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-500 text-xs tracking-widest uppercase font-medium animate-pulse pointer-events-none">
        ↔ Drag to rotate
      </div>
    </div>
  );
}
