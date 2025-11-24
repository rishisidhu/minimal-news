import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'
import { fetchRSSWithCache } from '../rss-cache'

interface ArticleMetadata {
  imageUrl: string | null
  description: string | null
}

async function fetchArticleMetadata(url: string): Promise<ArticleMetadata> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
      }
    })
    const $ = cheerio.load(response.data)

    // Extract image
    let imageUrl: string | null = null
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) imageUrl = ogImage
    else {
      const twitterImage = $('meta[name="twitter:image"]').attr('content')
      if (twitterImage) imageUrl = twitterImage
    }

    // Extract description
    let description: string | null = null
    const ogDescription = $('meta[property="og:description"]').attr('content')
    if (ogDescription && ogDescription.trim().length > 0) {
      description = ogDescription.trim()
    } else {
      const metaDescription = $('meta[name="description"]').attr('content')
      if (metaDescription && metaDescription.trim().length > 0) {
        description = metaDescription.trim()
      }
    }

    console.log(`CryptoPotato: Fetched metadata for ${url.substring(0, 50)}... - Image: ${!!imageUrl}, Desc: ${!!description}`)
    return { imageUrl, description }
  } catch (error) {
    console.error(`Error fetching metadata from ${url}:`, error)
    return { imageUrl: null, description: null }
  }
}

export async function scrapeCryptoPotato(): Promise<NewsArticle[]> {
  try {
    const feed = await fetchRSSWithCache('https://cryptopotato.com/feed/')
    const articles: NewsArticle[] = []

    for (const item of feed.items.slice(0, 15)) {
      if (!item.title || !item.link) continue

      let imageUrl: string | null = null
      let excerpt: string = item.contentSnippet?.substring(0, 1000) || item.title

      // Extract image from content
      if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
        if (imgMatch) {
          imageUrl = imgMatch[1]
        }
      }

      // Fetch metadata from article page
      if (item.link) {
        const metadata = await fetchArticleMetadata(item.link)
        if (!imageUrl && metadata.imageUrl) {
          imageUrl = metadata.imageUrl
        }
        if (metadata.description && (metadata.description.length > excerpt.length || excerpt === item.title)) {
          excerpt = metadata.description.substring(0, 1000)
        }
      }

      articles.push({
        title: item.title,
        excerpt: excerpt,
        image_url: imageUrl,
        source: 'CryptoPotato',
        article_url: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
    }

    return articles
  } catch (error) {
    console.error('Error scraping CryptoPotato:', error)
    return []
  }
}
