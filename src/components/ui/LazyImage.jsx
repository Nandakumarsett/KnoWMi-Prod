import { useState, useRef, useEffect } from 'react';

/**
 * LazyImage — drop-in <img> replacement that:
 * 1. Reserves exact space with a skeleton shimmer while loading
 * 2. Fades the real image in (opacity 0→1) once loaded — zero flicker
 * 3. Falls back to `fallback` prop (or a neutral placeholder) on error
 * 4. Supports `eager` prop to load immediately for above-the-fold images
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  style = {},
  fallback = null,
  eager = false,
  skeletonClassName = '',
  onLoad: onLoadProp,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // If the browser already has it cached, the 'load' event won't fire.
  // Check .complete immediately after mount.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoadProp?.(e);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true); // hide skeleton even on error
  };

  const resolvedSrc = error && fallback ? fallback : src;

  return (
    <div
      className={`relative overflow-hidden ${skeletonClassName}`}
      style={{ display: 'contents', ...(!loaded ? { position: 'relative' } : {}) }}
    >
      {/* Skeleton shimmer — shown until image loads */}
      {!loaded && (
        <div
          className="absolute inset-0 z-10 bg-neutral-100"
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'knowmi-shimmer 1.4s ease-in-out infinite',
            borderRadius: 'inherit',
          }}
        />
      )}

      <img
        ref={imgRef}
        src={resolvedSrc}
        alt={alt}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
          willChange: loaded ? 'auto' : 'opacity',
        }}
        {...rest}
      />
    </div>
  );
}
