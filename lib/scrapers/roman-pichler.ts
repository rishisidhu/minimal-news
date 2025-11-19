import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeRomanPichler(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://www.romanpichler.com/blog/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articles: NewsArticle[] = []
    const seenUrls = new Set<string>()

    const articleSelectors = [
      'a[href*="/blog/"]',
      'article a',
      '.post a',
      '.entry-title a',
    ]

    for (const selector of articleSelectors) {
      $(selector).each((i, elem) => {
        if (articles.length >= 15) return false

        const $elem = $(elem)
        let url = $elem.attr('href')
        if (!url) return

        if (!url.startsWith('http')) {
          url = `https://www.romanpichler.com${url}`
        }

        if (seenUrls.has(url) || url === 'https://www.romanpichler.com/blog/') return
        seenUrls.add(url)

        const title = $elem.text().trim() || $elem.attr('title') || $elem.find('h2, h3').text().trim()
        if (!title || title.length < 10) return

        const excerpt = $elem.closest('article, .post').find('p, .excerpt').first().text().trim() || ''
        const imageUrl = $elem.find('img').attr('src') || $elem.closest('article').find('img').attr('src') || null

        articles.push({
          title: title.substring(0, 200),
          excerpt: excerpt.substring(0, 1000),
          image_url: imageUrl,
          source: 'Roman Pichler',
          article_url: url,
          published_at: new Date().toISOString(),
        })
      })

      if (articles.length > 0) break
    }

    console.log(`Roman Pichler: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Roman Pichler:', error)
    return []
  }
}
