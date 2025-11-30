import { NextResponse } from 'next/server'
import { supabaseAdmin, NewsArticle } from '@/lib/supabase'
import { selectArticles } from '@/lib/article-selector'

const PRODUCT_SOURCES = [
  'Hacker News',
  'First Round',
  'Product School'
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maxPerSource = parseInt(searchParams.get('maxPerSource') || '3')

    // Get articles from the last 6 hours for product sources only
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .select('*')
      .in('source', PRODUCT_SOURCES)
      .gte('created_at', sixHoursAgo)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch articles' },
        { status: 500 }
      )
    }

    // Group articles by source first
    const groupedBySource: { [key: string]: NewsArticle[] } = {}
    const articles = (data || []) as NewsArticle[]
    for (const article of articles) {
      if (!groupedBySource[article.source]) {
        groupedBySource[article.source] = []
      }
      groupedBySource[article.source].push(article)
    }

    // Apply smart selection to each source, then limit per source
    const limitedArticles: NewsArticle[] = []
    for (const source in groupedBySource) {
      const sourceArticles = groupedBySource[source]
      // Use smart selector to get best mix for this source
      const selected = selectArticles(sourceArticles, maxPerSource * 3)
      // Then limit to maxPerSource
      limitedArticles.push(...selected.slice(0, maxPerSource))
    }

    // Sort by time (newest first)
    const limitedData = limitedArticles.sort((a, b) =>
      new Date(b.created_at || b.published_at).getTime() -
      new Date(a.created_at || a.published_at).getTime()
    )

    return NextResponse.json({
      success: true,
      data: limitedData,
      count: limitedData.length
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
