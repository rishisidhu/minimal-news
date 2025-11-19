import axios from 'axios'
import { NewsArticle } from '../supabase'

interface PHPost {
  id: string
  name: string
  tagline: string
  description?: string
  url: string
  votesCount: number
  thumbnail?: {
    url: string
  }
  createdAt: string
}

interface PHResponse {
  data: {
    posts: {
      edges: Array<{
        node: PHPost
      }>
    }
  }
}

export async function scrapeProductHunt(): Promise<NewsArticle[]> {
  try {
    // Use Product Hunt's public GraphQL API
    const query = `
      query {
        posts(first: 15) {
          edges {
            node {
              id
              name
              tagline
              description
              url
              votesCount
              thumbnail {
                url
              }
              createdAt
            }
          }
        }
      }
    `

    const response = await axios.post<PHResponse>(
      'https://api.producthunt.com/v2/api/graphql',
      { query },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Public API access - no auth required for basic queries
        }
      }
    )

    if (!response.data?.data?.posts?.edges) {
      console.log('Product Hunt: No data returned from API')
      return []
    }

    const articles: NewsArticle[] = response.data.data.posts.edges
      .map(({ node }) => {
        const excerpt = node.description || node.tagline || `${node.votesCount} upvotes`

        return {
          title: node.name,
          excerpt: excerpt.substring(0, 1000),
          image_url: node.thumbnail?.url || null,
          source: 'Product Hunt',
          article_url: node.url,
          published_at: node.createdAt || new Date().toISOString(),
        }
      })
      .filter((a): a is NewsArticle => a !== null && a.title.length > 0)

    console.log(`Product Hunt: Scraped ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error('Error scraping Product Hunt:', error)
    return []
  }
}
