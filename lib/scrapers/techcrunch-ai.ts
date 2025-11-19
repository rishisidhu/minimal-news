import Parser from 'rss-parser'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

const parser = new Parser()

export async function scrapeTechCrunchAI(): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL('https://techcrunch.com/tag/artificial-intelligence/feed/')
    const articles: NewsArticle[] = []

    for (const item of feed.items.slice(0, 15)) {
      if (!item.title || !item.link) continue

      let imageUrl: string | null = null
      let excerpt = item.contentSnippet || item.content || ''

      // Try to get image and better excerpt from the article page
      try {
        const articleResponse = await axios.get(item.link, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        })
        const $ = cheerio.load(articleResponse.data)

        // Get Open Graph image
        const ogImage = $('meta[property="og:image"]').attr('content')
        if (ogImage) {
          imageUrl = ogImage
        }

        // Get better excerpt
        const ogDesc = $('meta[property="og:description"]').attr('content')
        if (ogDesc) {
          excerpt = ogDesc
        }
      } catch {
        // Use RSS data if fetch fails
      }

      excerpt = excerpt.substring(0, 1000)

      articles.push({
        title: item.title,
        excerpt,
        image_url: imageUrl,
        source: 'TechCrunch',
        article_url: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
    }

    console.log(`TechCrunch AI: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping TechCrunch AI:', error)
    return []
  }
}
