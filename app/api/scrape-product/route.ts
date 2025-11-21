import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scrapeHackerNews } from '@/lib/scrapers/hackernews'
import { scrapeFirstRound } from '@/lib/scrapers/firstround'
import { scrapeProductSchool } from '@/lib/scrapers/productschool'

const PRODUCT_SOURCES = [
  'Hacker News',
  'First Round',
  'Product School'
]

export async function POST() {
  console.log('🚀 Starting product scrape...')
  const startTime = Date.now()

  try {
    // Delete old articles (older than 6 hours) for product sources only
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    console.log(`🗑️  Deleting articles older than ${sixHoursAgo}...`)

    const { error: deleteError, count: deletedCount } = await supabaseAdmin
      .from('news_articles')
      .delete()
      .lt('created_at', sixHoursAgo)
      .in('source', PRODUCT_SOURCES)

    if (deleteError) {
      console.error('❌ Error deleting old articles:', deleteError)
    } else {
      console.log(`✅ Deleted ${deletedCount || 0} old articles`)
    }

    // Scrape all product sources in parallel
    console.log('📰 Scraping sources in parallel...')
    const [
      hackerNewsArticles,
      firstRoundArticles,
      productSchoolArticles
    ] = await Promise.all([
      scrapeHackerNews(),
      scrapeFirstRound(),
      scrapeProductSchool()
    ])

    console.log(`📊 Scrape results:`)
    console.log(`   - Hacker News: ${hackerNewsArticles.length} articles`)
    console.log(`   - First Round: ${firstRoundArticles.length} articles`)
    console.log(`   - Product School: ${productSchoolArticles.length} articles`)

    const allArticles = [
      ...hackerNewsArticles,
      ...firstRoundArticles,
      ...productSchoolArticles
    ]

    console.log(`💾 Upserting ${allArticles.length} articles to database...`)

    // Add updated_at timestamp to all articles
    const now = new Date().toISOString()
    const articlesWithTimestamp = allArticles.map(article => ({
      ...article,
      updated_at: now
    }))

    // Batch upsert instead of sequential (faster and avoids timeout)
    const { error: upsertError, count } = await supabaseAdmin
      .from('news_articles')
      .upsert(articlesWithTimestamp, { onConflict: 'article_url', count: 'exact' })

    if (upsertError) {
      console.error('❌ Error upserting articles:', upsertError)
      console.error('Error details:', JSON.stringify(upsertError, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: 'Database insert failed',
          details: upsertError.message
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log(`✅ Product scrape complete in ${duration}ms`)
    console.log(`   - Total articles: ${allArticles.length}`)
    console.log(`   - Upserted: ${count || allArticles.length}`)

    return NextResponse.json({
      success: true,
      message: `Scraped ${allArticles.length} articles in ${duration}ms`,
      stats: {
        hackerNews: hackerNewsArticles.length,
        firstRound: firstRoundArticles.length,
        productSchool: productSchoolArticles.length,
        total: allArticles.length,
        duration: `${duration}ms`
      }
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('❌ Product scraping error:', error)
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape articles',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
