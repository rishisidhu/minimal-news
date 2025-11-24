import Parser from 'rss-parser'

const parser = new Parser()

interface CacheEntry {
  data: any
  timestamp: number
  etag?: string
}

// In-memory cache with 15-minute TTL
const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes in milliseconds

/**
 * Fetches RSS feed with caching support
 * - Caches responses for 15 minutes
 * - Returns cached data if still valid
 * - Significantly reduces bandwidth usage
 */
export async function fetchRSSWithCache(url: string): Promise<any> {
  const now = Date.now()
  const cached = cache.get(url)

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    console.log(`RSS Cache HIT: ${url} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`)
    return cached.data
  }

  // Fetch fresh data
  console.log(`RSS Cache MISS: ${url}`)
  try {
    const feed = await parser.parseURL(url)

    // Store in cache
    cache.set(url, {
      data: feed,
      timestamp: now
    })

    return feed
  } catch (error) {
    console.error(`Error fetching RSS feed ${url}:`, error)

    // Return stale cache if available (better than nothing)
    if (cached) {
      console.log(`Returning stale cache for ${url}`)
      return cached.data
    }

    throw error
  }
}

/**
 * Clear cache entries older than TTL
 * Called periodically to prevent memory leaks
 */
export function cleanupCache(): number {
  const now = Date.now()
  let cleaned = 0

  for (const [url, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(url)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`RSS Cache: Cleaned ${cleaned} expired entries`)
  }

  return cleaned
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).map(([url, entry]) => ({
      url,
      age: Math.round((Date.now() - entry.timestamp) / 1000),
      expired: (Date.now() - entry.timestamp) > CACHE_TTL
    }))
  }
}
