import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)

// Storage Proxying Utility
const STORAGE_ENDPOINT = 'https://jwsoutcwgwwfovrdrmjk.supabase.co/storage/v1/object/public/'
const PROXY_PATH = '/content/'
const IS_DEV = import.meta.env.DEV

/**
 * Transforms a full Supabase storage URL into a proxied local path.
 */
export const maskStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return url
  
  // If we are in dev, we actually want to ensure it's NOT masked for loading
  if (IS_DEV) {
    if (url.startsWith(PROXY_PATH)) {
      return url.replace(PROXY_PATH, STORAGE_ENDPOINT)
    }
    return url
  }

  // In production, mask it
  if (url.includes(STORAGE_ENDPOINT)) {
    return url.replace(STORAGE_ENDPOINT, PROXY_PATH)
  }
  return url
}

/**
 * Ensures a URL is correctly pointed to either the proxy (prod) or supabase (dev).
 */
export const getAssetUrl = (pathOrUrl) => {
  if (!pathOrUrl) return pathOrUrl
  
  // If it's a data URL or already handled
  if (pathOrUrl.startsWith('data:')) return pathOrUrl

  // Always return the direct Supabase URL to support video streaming byte-range requests
  if (pathOrUrl.startsWith(PROXY_PATH)) {
    return pathOrUrl.replace(PROXY_PATH, STORAGE_ENDPOINT)
  }
  if (pathOrUrl.startsWith('http')) return pathOrUrl 
  return `${STORAGE_ENDPOINT}${pathOrUrl}`
}
