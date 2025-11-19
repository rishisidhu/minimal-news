import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeIndieHackers(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://www.indiehackers.com/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articles: NewsArticle[] = []
    const seenUrls = new Set<string>()

    // IndieHackers post selectors
    const selectors = [
      '.feed-item a',
      '.post-link',
      'a[href*="/post/"]',
      '.content-title a',
    ]

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        if (articles.length >= 15) return false

        const $elem = $(elem)
        let url = $elem.attr('href')
        if (!url) return

        if (!url.startsWith('http')) {
          url = `https://www.indiehackers.com${url}`
        }

        if (seenUrls.has(url)) return
        seenUrls.add(url)

        const title = $elem.text().trim() || $elem.attr('title')
        if (!title || title.length < 10 || title.length > 300) return

        // Try to find excerpt from parent
        const $parent = $elem.closest('.feed-item, .post')
        const excerpt = $parent.find('.post-body, .excerpt, p').first().text().trim() || title

        articles.push({
          title: title.substring(0, 200),
          excerpt: excerpt.substring(0, 500),
          image_url: null,
          source: 'IndieHackers',
          article_url: url,
          published_at: new Date().toISOString(),
        })
      })

      if (articles.length > 0) break
    }

    console.log(`IndieHackers: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping IndieHackers:', error)
    return []
  }
}
