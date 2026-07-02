const ALLOWED_ORIGINS = [
  'https://knowmi.in',
  'https://www.knowmi.in',
  'https://knowmi-prod.vercel.app', // in case they use vercel for preview/staging
  'http://localhost:5173',
  'http://localhost:5174',
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  
  // Check if the origin matches our whitelist or is a preview deployment
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || 
                    origin.startsWith('https://knowmi-prod-') || 
                    origin.endsWith('.supabase.co'); // allow supabase dashboard calls
                    
  const allowedOrigin = isAllowed ? origin : 'https://knowmi.in';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  };
}
