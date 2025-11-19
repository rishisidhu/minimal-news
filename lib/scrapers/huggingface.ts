import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeHuggingFace(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://huggingface.co/blog', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articles: NewsArticle[] = []
    const seenUrls = new Set<string>()

    const articleSelectors = [
      'a[href*="/blog/"]',
      'article a',
      '[class*="card"] a',
      '[class*="post"] a'
    ]

    for (const selector of articleSelectors) {
      $(selector).each((i, elem) => {
        if (articles.length >= 15) return false

        const $elem = $(elem)
        const href = $elem.attr('href')
        if (!href) return

        const fullUrl = href.startsWith('http') ? href : `https://huggingface.co${href}`

        if (seenUrls.has(fullUrl)) return
        if (!fullUrl.includes('/blog/') || fullUrl === 'https://huggingface.co/blog') return
        seenUrls.add(fullUrl)

        let title = $elem.find('h1, h2, h3, h4').first().text().trim()
        if (!title) {
          title = $elem.text().trim().split('\n')[0]
        }
        if (!title || title.length < 5) return

        let excerpt = ''
        const description = $elem.find('p').first().text().trim()
        if (description) {
          excerpt = description.substring(0, 1000)
        } else {
          excerpt = title
        }

        let imageUrl: string | null = null
        const img = $elem.find('img').first().attr('src')
        if (img) {
          imageUrl = img.startsWith('http') ? img : `https://huggingface.co${img}`
        }

        articles.push({
          title,
          excerpt,
          image_url: imageUrl,
          source: 'Hugging Face',
          article_url: fullUrl,
          published_at: new Date().toISOString(),
        })
      })

      if (articles.length > 0) break
    }

    console.log(`Hugging Face: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Hugging Face:', error)
    return []
  }
}
