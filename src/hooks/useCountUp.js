import { useEffect, useRef, useState, useCallback } from 'react';

export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const frameRef = useRef(null);
  const nodeRef = useRef(null);

  const observerRef = useRef(null);

  const observe = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (!node) return;
    
    nodeRef.current = node;
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTrigger(true); },
      { threshold: 0.2 }
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    if (!trigger || !target) return;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else setValue(target);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, trigger]);

  return { value, ref: observe };
}
