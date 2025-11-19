import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeMessari(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://messari.io/research', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
      }
    })

    const $ = cheerio.load(response.data)
    const articles: NewsArticle[] = []

    // Messari research uses article cards
    const articleSelectors = [
      'a[href*="/report/"]',
      'a[href*="/research/"]',
      'article a',
      '[class*="card"] a'
    ]

    const seenUrls = new Set<string>()

    for (const selector of articleSelectors) {
      $(selector).each((i, elem) => {
        if (articles.length >= 15) return false

        const $elem = $(elem)
        const href = $elem.attr('href')
        if (!href) return

        const fullUrl = href.startsWith('http') ? href : `https://messari.io${href}`

        // Skip duplicates and non-research links
        if (seenUrls.has(fullUrl)) return
        if (!fullUrl.includes('/report/') && !fullUrl.includes('/research/')) return
        seenUrls.add(fullUrl)

        // Extract title
        let title = $elem.find('h1, h2, h3, h4').first().text().trim()
        if (!title) {
          title = $elem.text().trim().split('\n')[0]
        }
        if (!title || title.length < 5) return

        // Extract excerpt
        let excerpt = ''
        const description = $elem.find('p').first().text().trim()
        if (description) {
          excerpt = description.substring(0, 1000)
        } else {
          excerpt = title
        }

        // Extract image
        let imageUrl: string | null = null
        const img = $elem.find('img').first().attr('src')
        if (img) {
          imageUrl = img.startsWith('http') ? img : `https://messari.io${img}`
        }

        articles.push({
          title: title,
          excerpt: excerpt,
          image_url: imageUrl,
          source: 'Messari',
          article_url: fullUrl,
          published_at: new Date().toISOString(),
        })
      })

      if (articles.length > 0) break
    }

    console.log(`Messari: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Messari:', error)
    return []
  }
}
