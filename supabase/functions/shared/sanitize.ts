export function sanitizeString(str: any, maxLength = 200): string {
  if (typeof str !== 'string') return '';
  
  // Trim and limit length to prevent DoS via massive payloads
  let clean = str.trim().slice(0, maxLength);
  
  // HTML escaping to prevent script injection in target rendering contexts
  return clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeUuid(uuid: any): string | null {
  if (typeof uuid !== 'string') return null;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid) ? uuid.toLowerCase() : null;
}
