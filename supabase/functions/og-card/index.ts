import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../shared/cors.ts'

/**
 * og-card Edge Function
 * Dynamically serves HTML with custom Open Graph & Twitter meta tags tailored to the creator,
 * or generates an SVG/HTML preview of their brand card for crawlers (LinkedInBot, Twitterbot, etc.)
 */
serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const username = url.searchParams.get('username') || url.searchParams.get('u') || '';
  const format = url.searchParams.get('format') || 'html'; // 'html' or 'svg'

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  let profile = null;
  if (username) {
    // 1. Try match by username
    const { data: byUsername } = await supabase
      .from('profiles')
      .select('id, username, display_name, first_name, last_name, persona, wm_code, tagline, avatar_url, is_verified, secure_slug')
      .ilike('username', username)
      .maybeSingle();

    if (byUsername) {
      profile = byUsername;
    } else {
      // 2. Try match by secure_slug or id
      const { data: bySlug } = await supabase
        .from('profiles')
        .select('id, username, display_name, first_name, last_name, persona, wm_code, tagline, avatar_url, is_verified, secure_slug')
        .or(`secure_slug.eq.${username},id.eq.${username}`)
        .maybeSingle();
      if (bySlug) profile = bySlug;
    }
  }

  const profileName = profile?.display_name || 
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
    profile?.username || 
    'KnoWMi Creator';

  const personaTitle = (profile?.persona || 'Phygital Creator').toUpperCase();
  const wmCode = (profile?.wm_code || `WM-${(profile?.id || '1001').slice(0, 6)}`).replace('PT-', 'WM-');
  const tagline = profile?.tagline || 'Scan Me. Know Me. • Phygital Identity Protocol';
  const profileUrl = `https://knowmi.in/p/${username || profile?.username || profile?.id || ''}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=H&data=${encodeURIComponent(profileUrl)}`;

  // If SVG card image format requested (serves dynamically generated visual card)
  if (format === 'svg') {
    const svgCard = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#12121E" />
      <stop offset="50%" stop-color="#0A0A14" />
      <stop offset="100%" stop-color="#050508" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#F97316" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Outer Border Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="36" fill="none" stroke="#FFFFFF" stroke-width="4" />
  <rect x="40" y="40" width="1120" height="12" rx="6" fill="#F97316" />
  <rect x="40" y="578" width="1120" height="12" rx="6" fill="#F97316" />

  <!-- Left Column: Creator Identity -->
  <g transform="translate(100, 120)">
    <!-- Pill -->
    <rect x="0" y="0" width="220" height="36" rx="18" fill="rgba(249,115,22,0.15)" stroke="#F97316" stroke-width="1.5" />
    <text x="110" y="23" fill="#F97316" font-family="system-ui, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="2">✦ KnoWMi IDENTITY ✦</text>

    <!-- Name -->
    <text x="0" y="100" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="start" letter-spacing="1">${escapeXml(profileName.toUpperCase())}</text>

    <!-- Persona & WM Code -->
    <text x="0" y="145" fill="#F97316" font-family="monospace" font-size="20" font-weight="700">${escapeXml(personaTitle)}  •  ${escapeXml(wmCode)}</text>

    <!-- Tagline -->
    <text x="0" y="195" fill="#AAAAAA" font-family="system-ui, sans-serif" font-size="18" font-style="italic">"${escapeXml(tagline)}"</text>

    <!-- Slogan & Call to action -->
    <text x="0" y="300" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="2">SCAN ME. KNOW ME.</text>
    <rect x="0" y="315" width="180" height="4" fill="#F97316" />

    <text x="0" y="360" fill="#888888" font-family="monospace" font-size="16">https://knowmi.in/p/${escapeXml(username)}</text>
  </g>

  <!-- Right Column: Scannable Personalized QR Code -->
  <g transform="translate(740, 100)">
    <rect x="0" y="0" width="360" height="360" rx="28" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
    <image href="${qrCodeUrl}" x="30" y="30" width="300" height="300" />
    <text x="180" y="400" fill="#F97316" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="3">SCAN TO VIEW LIVE PROFILE</text>
  </g>
</svg>
    `;

    return new Response(svgCard, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        ...corsHeaders,
      }
    });
  }

  // Otherwise return HTML wrapper with dynamic Open Graph tags for crawlers
  const cardImageUrl = `${supabaseUrl}/functions/v1/og-card?username=${encodeURIComponent(username)}&format=svg`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeXml(profileName)} | KnoWMi® Digital Identity</title>
  <meta name="description" content="${escapeXml(tagline)} — ${escapeXml(profileName)}'s official KnoWMi Phygital Pass. Scan Me. Know Me.">
  
  <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${profileUrl}" />
  <meta property="og:title" content="${escapeXml(profileName)} | KnoWMi® Digital Identity" />
  <meta property="og:description" content="⚡ ${escapeXml(personaTitle)} • ${escapeXml(wmCode)} — ${escapeXml(tagline)}" />
  <meta property="og:image" content="${cardImageUrl}" />
  <meta property="og:image:secure_url" content="${cardImageUrl}" />
  <meta property="og:image:type" content="image/svg+xml" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KnoWMi" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${profileUrl}" />
  <meta name="twitter:title" content="${escapeXml(profileName)} | KnoWMi® Digital Identity" />
  <meta name="twitter:description" content="⚡ ${escapeXml(personaTitle)} • ${escapeXml(wmCode)} — ${escapeXml(tagline)}" />
  <meta name="twitter:image" content="${cardImageUrl}" />

  <!-- Instant Browser Redirect to SPA Profile -->
  <script>
    window.location.replace('${profileUrl}');
  </script>
</head>
<body style="background:#05050A;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p>Redirecting to <a href="${profileUrl}" style="color:#F97316;">${escapeXml(profileName)}'s KnoWMi Profile</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
      ...corsHeaders,
    }
  });
});

function escapeXml(unsafe: string) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
