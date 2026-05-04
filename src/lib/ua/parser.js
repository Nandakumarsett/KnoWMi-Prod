export function parseOS(ua) {
  if (!ua) return 'Other';
  const u = ua.toLowerCase();
  if (u.includes('android'))              return 'Android';
  if (u.includes('iphone'))              return 'iOS';
  if (u.includes('ipad'))                return 'iPadOS';
  if (u.includes('windows phone'))       return 'Windows Phone';
  if (u.includes('windows nt'))          return 'Windows';
  if (u.includes('mac os x') && !u.includes('iphone') && !u.includes('ipad')) return 'macOS';
  if (u.includes('cros'))                return 'ChromeOS';
  if (u.includes('linux'))               return 'Linux';
  return 'Other'; // Never return "Unknown"
}
