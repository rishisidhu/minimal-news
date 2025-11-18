import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for public read access (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-only client for write operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
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
