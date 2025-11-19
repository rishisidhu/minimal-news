import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeIntercom(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://www.intercom.com/blog/product/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articleUrls: { url: string; title: string }[] = []
    const seenUrls = new Set<string>()

    const articleSelectors = [
      'a[href*="/blog/"]',
      'article a',
      '.post a',
      '.blog-card a',
    ]

    for (const selector of articleSelectors) {
      $(selector).each((i, elem) => {
        if (articleUrls.length >= 10) return false

        const $elem = $(elem)
        let url = $elem.attr('href')
        if (!url) return

        if (!url.startsWith('http')) {
          url = `https://www.intercom.com${url}`
        }

        if (seenUrls.has(url) || url === 'https://www.intercom.com/blog/product/') return
        seenUrls.add(url)

        const title = $elem.text().trim() || $elem.attr('title') || $elem.find('h2, h3').text().trim()
        if (!title || title.length < 10) return

        articleUrls.push({ url, title: title.substring(0, 200) })
      })

      if (articleUrls.length > 0) break
    }

    // Fetch OG data from each article page
    const articles: NewsArticle[] = []
    for (const { url, title } of articleUrls) {
      try {
        const articleResponse = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        })
        const $article = cheerio.load(articleResponse.data)

        const ogImage = $article('meta[property="og:image"]').attr('content') || null
        const ogDesc = $article('meta[property="og:description"]').attr('content') ||
                       $article('meta[name="description"]').attr('content') || ''

        articles.push({
          title,
          excerpt: ogDesc.substring(0, 1000),
          image_url: ogImage,
          source: 'Intercom',
          article_url: url,
          published_at: new Date().toISOString(),
        })
      } catch {
        articles.push({
          title,
          excerpt: '',
          image_url: null,
          source: 'Intercom',
          article_url: url,
          published_at: new Date().toISOString(),
        })
      }
    }

    console.log(`Intercom: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Intercom:', error)
    return []
  }
}
