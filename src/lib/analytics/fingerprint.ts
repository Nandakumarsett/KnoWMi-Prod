export async function buildFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return '';
  
  const data = [
    window.screen.width,
    window.screen.height,
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 4,
    // Canvas fingerprinting
    (() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillText("KnoWMi-Identity-V1", 2, 2);
      return canvas.toDataURL();
    })()
  ].join('|');

  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
