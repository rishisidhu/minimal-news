import axios from 'axios'
import { NewsArticle } from '../supabase'

interface RedditPost {
  data: {
    title: string
    url: string
    selftext: string
    thumbnail: string
    created_utc: number
    permalink: string
    preview?: {
      images: Array<{
        source: {
          url: string
        }
      }>
    }
  }
}

async function scrapeSubreddit(subreddit: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.reddit.com/',
        'Connection': 'keep-alive'
      }
    })

    if (!response.data || !response.data.data || !response.data.data.children) {
      console.error(`${sourceName}: API returned unexpected structure`)
      return []
    }

    const posts: RedditPost[] = response.data.data.children || []
    const articles: NewsArticle[] = []

    for (const post of posts) {
      const { title, selftext, thumbnail, created_utc, permalink, preview } = post.data

      if (!title || title.length < 10) continue

      let imageUrl: string | null = null
      if (preview && preview.images && preview.images[0]) {
        imageUrl = preview.images[0].source.url.replace(/&amp;/g, '&')
      } else if (thumbnail && thumbnail.startsWith('http') && !thumbnail.includes('self')) {
        imageUrl = thumbnail
      }

      const excerpt = selftext
        ? selftext.substring(0, 500).trim()
        : title

      articles.push({
        title,
        excerpt,
        image_url: imageUrl,
        source: sourceName,
        article_url: `https://www.reddit.com${permalink}`,
        published_at: new Date(created_utc * 1000).toISOString(),
      })
    }

    console.log(`${sourceName}: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error(`Error scraping ${sourceName}:`, error)
    return []
  }
}

export async function scrapeRedditProductManagement(): Promise<NewsArticle[]> {
  return scrapeSubreddit('ProductManagement', 'r/ProductManagement')
}

export async function scrapeRedditUserExperience(): Promise<NewsArticle[]> {
  return scrapeSubreddit('userexperience', 'r/UserExperience')
}

export async function scrapeRedditUXDesign(): Promise<NewsArticle[]> {
  return scrapeSubreddit('UXDesign', 'r/UXDesign')
}
