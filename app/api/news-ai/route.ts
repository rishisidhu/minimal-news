import { NextResponse } from 'next/server'
import { supabase, NewsArticle } from '@/lib/supabase'

const AI_SOURCES = [
  'TechCrunch', 'Wired', 'VentureBeat', 'Hugging Face'
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maxPerSource = parseInt(searchParams.get('maxPerSource') || '3')

    // Only fetch AI articles from the last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .in('source', AI_SOURCES)
      .gte('created_at', sixHoursAgo)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching AI news:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch AI news' },
        { status: 500 }
      )
    }

    // Limit to maxPerSource articles per source
    const articlesBySource: { [key: string]: NewsArticle[] } = {}
    const limitedArticles: NewsArticle[] = []

    for (const article of (data || [])) {
      const source = article.source
      if (!articlesBySource[source]) {
        articlesBySource[source] = []
      }
      if (articlesBySource[source].length < maxPerSource) {
        articlesBySource[source].push(article)
        limitedArticles.push(article)
      }
    }

    // Sort by time (newest first)
    limitedArticles.sort((a, b) =>
      new Date(b.created_at || b.published_at).getTime() -
      new Date(a.created_at || a.published_at).getTime()
    )

    return NextResponse.json({
      success: true,
      data: limitedArticles,
      count: limitedArticles.length,
    })
  } catch (error) {
    console.error('Error in AI news route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI news' },
      { status: 500 }
    )
  }
}
