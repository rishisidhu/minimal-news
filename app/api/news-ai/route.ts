import { NextResponse } from 'next/server'
import { supabase, NewsArticle } from '@/lib/supabase'
import { selectArticles } from '@/lib/article-selector'

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
      .gte('updated_at', sixHoursAgo)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching AI news:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch AI news' },
        { status: 500 }
      )
    }

    // Group articles by source first
    const articlesBySource: { [key: string]: NewsArticle[] } = {}
    for (const article of (data || [])) {
      const source = article.source
      if (!articlesBySource[source]) {
        articlesBySource[source] = []
      }
      articlesBySource[source].push(article)
    }

    // Apply smart selection to each source, then limit per source
    const limitedArticles: NewsArticle[] = []
    for (const source in articlesBySource) {
      const sourceArticles = articlesBySource[source]
      // Use smart selector to get best mix for this source
      const selected = selectArticles(sourceArticles, maxPerSource * 3)
      // Then limit to maxPerSource
      limitedArticles.push(...selected.slice(0, maxPerSource))
    }

    // Sort by time (newest first)
    limitedArticles.sort((a, b) =>
      new Date(b.updated_at || b.published_at).getTime() -
      new Date(a.updated_at || a.published_at).getTime()
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
