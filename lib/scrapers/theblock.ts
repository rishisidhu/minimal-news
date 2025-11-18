import Parser from 'rss-parser'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

const parser = new Parser()

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

    // Extract description/excerpt - Try multiple sources
    let description: string | null = null

    // 1. Try meta tags first (removed 50-char minimum)
    const ogDescription = $('meta[property="og:description"]').attr('content')
    if (ogDescription && ogDescription.trim().length > 0) {
      description = ogDescription.trim()
    } else {
      const metaDescription = $('meta[name="description"]').attr('content')
      if (metaDescription && metaDescription.trim().length > 0) {
        description = metaDescription.trim()
      }
    }

    // 2. If no meta description or it's too short, extract from article body
    if (!description || description.length < 100) {
      const bodyParagraphs: string[] = []

      // Try The Block-specific selectors first, then common ones
      const selectors = [
        '.article__content p',
        '.articleContent p',
        '.post__content p',
        'article p',
        '.article-content p',
        '.post-content p',
        '.entry-content p',
        '[class*="article"] p',
        '[class*="content"] p',
        'main p',
        '.story p'
      ]

      for (const selector of selectors) {
        $(selector).each((i, elem) => {
          const text = $(elem).text().trim()
          // Skip very short paragraphs (ads, captions, etc.)
          if (text.length > 50 && bodyParagraphs.length < 5) {
            bodyParagraphs.push(text)
          }
        })
        if (bodyParagraphs.length >= 3) {
          console.log(`The Block: Found content using selector: ${selector}`)
          break // Found enough content
        }
      }

      if (bodyParagraphs.length > 0) {
        const bodyText = bodyParagraphs.join(' ').substring(0, 1000)
        if (!description || bodyText.length > description.length) {
          description = bodyText
        }
      } else {
        console.log(`The Block: No body paragraphs found for ${url.substring(0, 50)}...`)
      }
    }

    console.log(`The Block: Fetched metadata for ${url.substring(0, 50)}... - Image: ${!!imageUrl}, Desc: ${!!description} (${description?.length || 0} chars)`)
    return { imageUrl, description }
  } catch (error) {
    console.error(`Error fetching metadata from ${url}:`, error)
    return { imageUrl: null, description: null }
  }
}

export async function scrapeTheBlock(): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL('https://www.theblock.co/rss.xml')
    const articles: NewsArticle[] = []

    for (const item of feed.items.slice(0, 15)) {
      if (!item.title || !item.link) continue

      // Extract image from content or enclosure (fast)
      let imageUrl: string | null = null
      let excerpt: string = item.contentSnippet?.substring(0, 1000) || item.title

      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url
      } else if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
        if (imgMatch) {
          imageUrl = imgMatch[1]
        }
      }

      // Always fetch metadata from article page for better content
      if (item.link) {
        const metadata = await fetchArticleMetadata(item.link)
        if (!imageUrl && metadata.imageUrl) {
          imageUrl = metadata.imageUrl
        }
        // Use metadata description if it's longer or excerpt is just the title
        if (metadata.description && (metadata.description.length > excerpt.length || excerpt === item.title)) {
          excerpt = metadata.description.substring(0, 1000)
        }
      }

      articles.push({
        title: item.title,
        excerpt: excerpt,
        image_url: imageUrl,
        source: 'The Block',
        article_url: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
    }

    return articles
  } catch (error) {
    console.error('Error scraping The Block:', error)
    return []
  }
}
