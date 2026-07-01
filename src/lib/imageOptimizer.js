/**
 * Connection-aware image optimizer utility
 * Dynamically adjusts size and compression level based on current network speed
 */
export function getOptimizedImageUrl(originalUrl) {
  if (!originalUrl) return originalUrl;

  try {
    // Detect network speed if supported
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = conn && (conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData);

    if (originalUrl.includes('unsplash.com')) {
      const url = new URL(originalUrl);
      
      if (isSlow) {
        // Highly compressed, lower resolution fallback for slow connections
        url.searchParams.set('w', '400');
        url.searchParams.set('q', '40');
      } else {
        // Balanced performance resolution for fast connections
        const width = url.searchParams.get('w');
        if (!width || parseInt(width) > 1000) {
          url.searchParams.set('w', '800');
        }
        const quality = url.searchParams.get('q');
        if (!quality || parseInt(quality) > 85) {
          url.searchParams.set('q', '75');
        }
      }
      return url.toString();
    }
  } catch (e) {
    console.warn("Failed to optimize image URL:", originalUrl, e);
  }

  return originalUrl;
}
