import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeProductSchool(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('https://productschool.com/blog/', {
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
      '.blog-post a',
      'article a',
      '.post-card a',
    ]

    for (const selector of articleSelectors) {
      $(selector).each((i, elem) => {
        if (articleUrls.length >= 10) return false

        const $elem = $(elem)
        let url = $elem.attr('href')
        if (!url) return

        if (!url.startsWith('http')) {
          url = `https://productschool.com${url}`
        }

        if (seenUrls.has(url) || url === 'https://productschool.com/blog/') return
        seenUrls.add(url)

        const title = $elem.text().trim() || $elem.attr('title') || $elem.find('h2, h3').text().trim()
        if (!title || title.length < 10) return

        articleUrls.push({ url, title: title.substring(0, 200) })
      })

      if (articleUrls.length > 0) break
    }

    // Fetch OG data from each article page in parallel
    const articles = await Promise.all(
      articleUrls.map(async ({ url, title }) => {
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

          return {
            title,
            excerpt: ogDesc.substring(0, 1000),
            image_url: ogImage,
            source: 'Product School',
            article_url: url,
            published_at: new Date().toISOString(),
          }
        } catch {
          return {
            title,
            excerpt: '',
            image_url: null,
            source: 'Product School',
            article_url: url,
            published_at: new Date().toISOString(),
          }
        }
      })
    )

    console.log(`Product School: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Product School:', error)
    return []
  }
}
