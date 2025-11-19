import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

interface HNItem {
  id: number
  title: string
  url?: string
  text?: string
  time: number
  score: number
  descendants?: number // comment count
}

export async function scrapeHackerNews(): Promise<NewsArticle[]> {
  try {
    // Get top stories IDs
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
      timeout: 10000
    })

    const storyIds: number[] = topStoriesResponse.data.slice(0, 15)

    // Fetch story details in parallel
    const stories = await Promise.all(
      storyIds.map(async (id) => {
        try {
          const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
            timeout: 5000
          })
          return response.data as HNItem
        } catch {
          return null
        }
      })
    )

    // Fetch article content for each story in parallel
    const articles = await Promise.all(
      stories.map(async (story) => {
        if (!story || !story.title || story.title.length < 10) return null

        const articleUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`

        // Try to fetch meta description from the article
        let excerpt = `${story.score} points • ${story.descendants || 0} comments`

        if (story.url) {
          try {
            const articleResponse = await axios.get(story.url, {
              timeout: 5000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
              }
            })
            const $ = cheerio.load(articleResponse.data)

            // Get meta description or og:description
            const metaDesc = $('meta[name="description"]').attr('content') ||
                            $('meta[property="og:description"]').attr('content') ||
                            $('meta[name="twitter:description"]').attr('content')

            if (metaDesc && metaDesc.length > 20) {
              excerpt = metaDesc.substring(0, 1000).trim()
            }
          } catch {
            // Keep default excerpt if fetch fails
          }
        } else if (story.text) {
          // For Ask HN / Show HN posts, use the text
          excerpt = story.text
            .replace(/<[^>]*>/g, '')
            .replace(/&#x2F;/g, '/')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .substring(0, 1000).trim()
        }

        return {
          title: story.title,
          excerpt,
          image_url: null,
          source: 'Hacker News',
          article_url: articleUrl,
          published_at: new Date(story.time * 1000).toISOString(),
        }
      })
    )

    const validArticles = articles.filter((a): a is NewsArticle => a !== null)
    console.log(`Hacker News: Scraped ${validArticles.length} articles`)
    return validArticles
  } catch (error) {
    console.error('Error scraping Hacker News:', error)
    return []
  }
}
