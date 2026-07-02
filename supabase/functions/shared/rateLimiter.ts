import { getCorsHeaders } from './cors.ts'

export async function handleRateLimit(req: Request, options: {
  limit?: number;      // max requests per window
  windowMs?: number;   // time window in milliseconds (default: 60000 / 1 min)
  endpoint: string;    // endpoint name for namespace partitioning
}): Promise<Response | null> {
  const corsHeaders = {
    ...getCorsHeaders(req),
    'Content-Type': 'application/json'
  }
  // Only apply rate limiting to actual requests, skip OPTIONS pre-flight
  if (req.method === 'OPTIONS') return null;

  const limit = options.limit ?? 60;
  const windowMs = options.windowMs ?? 60000;
  const endpoint = options.endpoint;

  // 1. Resolve Client IP address
  const clientIp = req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   'unknown-ip';

  // 2. Get IP subnet range (/24) to identify subnet attacks
  let ipRange = 'unknown-range';
  if (clientIp && clientIp.includes('.')) {
    const parts = clientIp.split('.');
    if (parts.length === 4) {
      ipRange = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // 3. Resolve Client Fingerprint from body (if POST request)
  let visitorFp = 'unknown-fp';
  try {
    const clone = req.clone();
    const body = await clone.json();
    if (body && body.fp) {
      visitorFp = body.fp;
    }
  } catch (_) {
    // Body is empty or not JSON
  }

  // 4. Open Deno KV
  let kv;
  try {
    // @ts-ignore Deno.openKv is global in edge runtime
    kv = await Deno.openKv();
  } catch (e) {
    console.error("Deno KV is not initialized:", e);
    return null; // fallback gracefully if KV is unavailable
  }

  const now = Date.now();
  const ipKey = ["rate-limit", endpoint, "ip", clientIp];
  const rangeKey = ["rate-limit", endpoint, "range", ipRange];
  const fpKey = ["rate-limit", endpoint, "fp", visitorFp];

  async function checkKey(key: any[], maxLimit: number): Promise<boolean> {
    const res = await kv.get(key);
    let data = res.value as { count: number; expiresAt: number } | null;
    
    if (!data || data.expiresAt < now) {
      data = { count: 1, expiresAt: now + windowMs };
      await kv.set(key, data, { expireIn: windowMs / 1000 });
      return true;
    }

    if (data.count >= maxLimit) {
      return false;
    }

    data.count += 1;
    await kv.set(key, data, { expireIn: (data.expiresAt - now) / 1000 });
    return true;
  }

  // Check IP Limit
  const ipAllowed = await checkKey(ipKey, limit);
  if (!ipAllowed) {
    return new Response(JSON.stringify({ 
      error: "Unauthorized access. Please don't try again.",
      code: "RATE_LIMIT_EXCEEDED"
    }), { status: 403, headers: corsHeaders });
  }

  // Check subnet level (/24) limit (allow limit * 5 to prevent false positives for company proxies)
  if (ipRange !== 'unknown-range') {
    const subnetAllowed = await checkKey(rangeKey, limit * 5);
    if (!subnetAllowed) {
      return new Response(JSON.stringify({ 
        error: "Unauthorized access. Please don't try again.",
        code: "RATE_LIMIT_EXCEEDED"
      }), { status: 403, headers: corsHeaders });
    }
  }

  // Check Visitor Fingerprint limit (tighter limit for fingerprint)
  if (visitorFp !== 'unknown-fp') {
    const fpLimit = limit < 15 ? limit : 15;
    const fpAllowed = await checkKey(fpKey, fpLimit);
    if (!fpAllowed) {
      return new Response(JSON.stringify({ 
        error: "Unauthorized access. Please don't try again.",
        code: "RATE_LIMIT_EXCEEDED"
      }), { status: 403, headers: corsHeaders });
    }
  }

  return null;
}
