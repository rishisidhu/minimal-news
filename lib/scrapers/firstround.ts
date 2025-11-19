import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeFirstRound(): Promise<NewsArticle[]> {
  try {
    // First, get the list of article URLs from the homepage
    const response = await axios.get('https://review.firstround.com/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articleUrls: string[] = []
    const seenUrls = new Set<string>()

    // Collect article URLs from the listing
    $('a').each((i, elem) => {
      if (articleUrls.length >= 10) return false

      const $elem = $(elem)
      let url = $elem.attr('href')
      if (!url) return

      // Only process article URLs (they have descriptive slugs)
      if (!url.startsWith('/') && !url.includes('review.firstround.com')) return
      if (url.includes('/articles/') || url.includes('/author/') || url.includes('/tag/')) return

      // Make URL absolute
      if (url.startsWith('/')) {
        url = `https://review.firstround.com${url}`
      }

      // Skip non-article pages
      if (url === 'https://review.firstround.com/' || url.includes('#')) return
      if (!url.match(/firstround\.com\/[a-z0-9-]+\/?$/i)) return
      if (seenUrls.has(url)) return
      seenUrls.add(url)
      articleUrls.push(url)
    })

    // If we didn't find URLs, use known articles
    if (articleUrls.length === 0) {
      articleUrls.push(
        'https://review.firstround.com/how-to-pick-company-name/',
        'https://review.firstround.com/the-other-pmf-wes-kaos-personality-message-fit-framework-for-founders/',
        'https://review.firstround.com/sentrys-path-to-product-market-fit/',
        'https://review.firstround.com/when-to-hire-your-first-pm/',
        'https://review.firstround.com/mercurys-path-to-product-market-fit/',
      )
    }

    // Fetch each article page to get proper OG meta tags
    const articles = await Promise.all(
      articleUrls.map(async (articleUrl) => {
        try {
          const articleResponse = await axios.get(articleUrl, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
          })

          const $article = cheerio.load(articleResponse.data)

          const title = $article('meta[property="og:title"]').attr('content') ||
                       $article('title').text().split('|')[0].trim()
          const excerpt = $article('meta[property="og:description"]').attr('content') ||
                         $article('meta[name="description"]').attr('content') || title
          const image = $article('meta[property="og:image"]').attr('content') || null

          if (!title || title.length < 3) return null

          return {
            title: title.substring(0, 200),
            excerpt: excerpt.substring(0, 1000),
            image_url: image,
            source: 'First Round',
            article_url: articleUrl,
            published_at: new Date().toISOString(),
          }
        } catch {
          return null
        }
      })
    )

    const validArticles = articles.filter((a): a is NewsArticle => a !== null)
    console.log(`First Round: Scraped ${validArticles.length} articles`)
    return validArticles
  } catch (error) {
    console.error('Error scraping First Round:', error)
    return []
  }
}
