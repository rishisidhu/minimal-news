import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsArticle } from '../supabase'

export async function scrapeA16zProduct(): Promise<NewsArticle[]> {
  try {
    // Fetch the a16z articles page
    const response = await axios.get('https://a16z.com/articles/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const articles: NewsArticle[] = []
    const seenUrls = new Set<string>()

    // Find article links on the page
    $('a').each((i, elem) => {
      if (articles.length >= 15) return false

      const $elem = $(elem)
      let url = $elem.attr('href')
      if (!url) return

      // Only process a16z.com article URLs
      if (!url.includes('a16z.com/') && !url.startsWith('/')) return

      // Make URL absolute
      if (url.startsWith('/')) {
        url = `https://a16z.com${url}`
      }

      // Skip non-article URLs
      if (url.includes('/author/') || url.includes('/category/') || url.includes('/tag/')) return
      if (!url.match(/a16z\.com\/\d{4}\//) && !url.match(/a16z\.com\/[a-z-]+\/?$/)) return
      if (seenUrls.has(url)) return
      seenUrls.add(url)

      // Get title from link text or child headings
      let title = $elem.find('h2, h3, h4').first().text().trim()
      if (!title) {
        title = $elem.text().trim().split('\n')[0].trim()
      }
      if (!title || title.length < 10 || title.length > 300) return

      // Get excerpt from sibling or parent elements
      const $parent = $elem.closest('article, .post, div')
      let excerpt = $parent.find('p').first().text().trim()
      if (!excerpt || excerpt.length < 20) {
        excerpt = title
      }

      // Get image
      const image = $parent.find('img').first().attr('src') || null

      articles.push({
        title: title.substring(0, 200),
        excerpt: excerpt.substring(0, 1000),
        image_url: image,
        source: 'a16z',
        article_url: url,
        published_at: new Date().toISOString(),
      })
    })

    // If we didn't find articles from the listing, try fetching individual known essays
    if (articles.length === 0) {
      const knownEssays = [
        'good-product-manager-bad-product-manager',
        'pmarca-guide-to-startups-part-1-why-not-to-do-a-startup',
        'why-software-is-eating-the-world',
        'its-time-to-build',
        'the-pmarca-guide-to-career-planning-part-1-opportunity',
      ]

      const essayArticles = await Promise.all(
        knownEssays.map(async (slug) => {
          try {
            const essayUrl = `https://a16z.com/${slug}/`
            const essayResponse = await axios.get(essayUrl, {
              timeout: 5000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
              }
            })

            const $essay = cheerio.load(essayResponse.data)

            const title = $essay('meta[property="og:title"]').attr('content') ||
                         $essay('title').text().split('|')[0].trim()
            const excerpt = $essay('meta[property="og:description"]').attr('content') ||
                           $essay('meta[name="description"]').attr('content') || title
            const image = $essay('meta[property="og:image"]').attr('content') || null

            if (!title || title.length < 3) return null

            return {
              title: title.substring(0, 200),
              excerpt: excerpt.substring(0, 1000),
              image_url: image,
              source: 'a16z',
              article_url: essayUrl,
              published_at: new Date().toISOString(),
            }
          } catch {
            return null
          }
        })
      )

      articles.push(...essayArticles.filter((a): a is NewsArticle => a !== null))
    }

    console.log(`a16z: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping a16z:', error)
    return []
  }
}
