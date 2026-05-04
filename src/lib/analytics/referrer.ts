export function categoriseReferrer(ref: string): 'qr' | 'social' | 'direct' | 'other' {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('src') === 'qr') return 'qr';
  }

  if (!ref || ref.includes(window.location.origin)) return 'direct';
  
  const socialDomains = ['linkedin', 'twitter', 't.co', 'instagram', 'facebook', 'youtube', 'tiktok', 'whatsapp'];
  if (socialDomains.some(domain => ref.toLowerCase().includes(domain))) {
    return 'social';
  }

  return 'other';
}
