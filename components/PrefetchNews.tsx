'use client'

import { useEffect } from 'react'
import { prefetchAllNews } from '@/lib/prefetch'

/**
 * Background prefetch component - renders nothing but starts loading news data
 * Place on homepage to prefetch all sections in background
 */
export default function PrefetchNews() {
  useEffect(() => {
    // Start prefetching all news endpoints immediately
    prefetchAllNews()
  }, [])

  return null // Renders nothing, just prefetches
}
