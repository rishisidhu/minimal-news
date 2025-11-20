import { preload } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

/**
 * Prefetch all news endpoints in the background
 * Useful for homepage to start loading all sections immediately
 */
export const prefetchAllNews = () => {
  preload('/api/news', fetcher)
  preload('/api/news-ai', fetcher)
  preload('/api/news-product', fetcher)
}

/**
 * Prefetch news endpoints except the current one
 * Useful for section pages to load other sections in background
 */
export const prefetchOtherNews = (exclude: 'crypto' | 'ai' | 'product') => {
  const endpoints = {
    crypto: '/api/news',
    ai: '/api/news-ai',
    product: '/api/news-product'
  }

  Object.entries(endpoints).forEach(([key, endpoint]) => {
    if (key !== exclude) {
      preload(endpoint, fetcher)
    }
  })
}
