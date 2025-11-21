import { createClient } from '@supabase/supabase-js'

// Validate environment variables with clear error messages
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
// Create a lazy-initialized admin client that validates at runtime
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    // Initialize admin client on first use (runtime only)
    if (!_supabaseAdmin) {
      if (!supabaseServiceKey) {
        throw new Error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. This is required for server-side database writes.')
      }
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      console.log('✅ Supabase admin client initialized')
    }
    return _supabaseAdmin[prop as keyof typeof _supabaseAdmin]
  }
})

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
}
