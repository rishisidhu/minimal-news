import { NewsArticle } from './supabase'

/**
 * Smart article selection algorithm that:
 * 1. Prioritizes fresh batch articles (70% weight)
 * 2. Includes older articles for variety (30% weight)
 * 3. Balances articles evenly across the 6-hour window
 */
export function selectArticles(
  articles: NewsArticle[],
  limit: number = 20
): NewsArticle[] {
  if (articles.length === 0) return []
  if (articles.length <= limit) return articles

  // Find the most recent batch
  const latestBatchTime = articles.reduce((latest, article) => {
    const batchTime = article.scrape_batch_time || article.updated_at
    return batchTime && (!latest || batchTime > latest) ? batchTime : latest
  }, '')

  // Split articles into fresh (latest batch) and older
  const freshArticles = articles.filter(
    a => (a.scrape_batch_time || a.updated_at) === latestBatchTime
  )
  const olderArticles = articles.filter(
    a => (a.scrape_batch_time || a.updated_at) !== latestBatchTime
  )

  // Calculate how many from each group
  const freshCount = Math.ceil(limit * 0.7) // 70% fresh
  const olderCount = limit - freshCount // 30% old

  // If we have enough fresh articles, take fresh + balanced old
  if (freshArticles.length >= freshCount) {
    const selectedFresh = freshArticles.slice(0, freshCount)
    const selectedOld = balanceAcrossTime(olderArticles, olderCount)
    return [...selectedFresh, ...selectedOld]
  }

  // If not enough fresh articles, take all fresh + more old
  const remainingSlots = limit - freshArticles.length
  const selectedOld = balanceAcrossTime(olderArticles, remainingSlots)
  return [...freshArticles, ...selectedOld]
}

/**
 * Balances article selection evenly across time buckets (1 hour each)
 * within the 6-hour window
 */
function balanceAcrossTime(
  articles: NewsArticle[],
  count: number
): NewsArticle[] {
  if (articles.length === 0) return []
  if (articles.length <= count) return articles

  const now = Date.now()
  const oneHour = 60 * 60 * 1000

  // Create 6 time buckets (one per hour)
  const buckets: NewsArticle[][] = Array.from({ length: 6 }, () => [])

  // Distribute articles into buckets based on their timestamp
  articles.forEach(article => {
    const timestamp = new Date(article.updated_at || article.published_at).getTime()
    const hoursSincePublished = Math.floor((now - timestamp) / oneHour)
    const bucketIndex = Math.min(hoursSincePublished, 5) // Cap at 5 for 6th hour
    buckets[bucketIndex].push(article)
  })

  // Calculate how many articles to take from each bucket
  const articlesPerBucket = Math.floor(count / 6)
  const remainder = count % 6

  const selected: NewsArticle[] = []

  // Take evenly from each bucket
  buckets.forEach((bucket, index) => {
    const takeCount = articlesPerBucket + (index < remainder ? 1 : 0)
    selected.push(...bucket.slice(0, takeCount))
  })

  // If we still need more articles (some buckets were empty), take from any bucket
  if (selected.length < count) {
    const remaining = articles.filter(a => !selected.includes(a))
    selected.push(...remaining.slice(0, count - selected.length))
  }

  return selected
}
