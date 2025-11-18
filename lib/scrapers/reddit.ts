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

export async function scrapeReddit(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://www.reddit.com/r/CryptoCurrency/hot.json?limit=15', {
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

    // Log response for debugging
    if (!response.data || !response.data.data || !response.data.data.children) {
      console.error('Reddit API returned unexpected structure:', JSON.stringify(response.data).substring(0, 200))
      return []
    }

    const posts: RedditPost[] = response.data.data.children || []
    console.log(`Reddit: Successfully fetched ${posts.length} posts`)

    const articles: NewsArticle[] = []

    for (const post of posts) {
      const { title, selftext, thumbnail, created_utc, permalink, preview } = post.data

      if (!title || title.length < 10) continue

      // Get image URL
      let imageUrl: string | null = null
      if (preview && preview.images && preview.images[0]) {
        imageUrl = preview.images[0].source.url.replace(/&amp;/g, '&')
      } else if (thumbnail && thumbnail.startsWith('http') && !thumbnail.includes('self')) {
        imageUrl = thumbnail
      }

      // Create excerpt from selftext
      const excerpt = selftext
        ? selftext.substring(0, 500).trim()
        : title

      articles.push({
        title,
        excerpt,
        image_url: imageUrl,
        source: 'Reddit',
        article_url: `https://www.reddit.com${permalink}`,
        published_at: new Date(created_utc * 1000).toISOString(),
      })
    }

    console.log(`Reddit: Returning ${articles.length} articles`)
    return articles
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Reddit API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: JSON.stringify(error.response?.data).substring(0, 200),
        message: error.message
      })
    } else {
      console.error('Error scraping Reddit:', error)
    }
    return []
  }
}
