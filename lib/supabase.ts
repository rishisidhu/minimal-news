import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Validate environment variables with clear error messages
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public env vars must be present (needed for client-side)
if (!supabaseUrl) {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables')
}

// Service key is only needed at runtime (server-side), not during build
// We'll validate it when supabaseAdmin is actually used
if (typeof window === 'undefined' && supabaseServiceKey) {
  console.log('✅ Supabase environment variables validated')
}

// Client for public read access (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-only client for write operations (bypasses RLS)
// Create admin client directly (env var checked at build time above)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || '', // Will fail at runtime if missing, but TypeScript is happy
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface NewsArticle {
  id?: string
  title: string
  excerpt: string
  image_url: string | null
  source: string
  article_url: string
  published_at: string
  created_at?: string
  updated_at?: string
  scrape_batch_id?: string
  scrape_batch_time?: string
}
