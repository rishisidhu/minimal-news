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
    // Generate batch ID for this scrape session
    const now = new Date().toISOString()
    const batchId = `batch-${now}`

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

    console.log(`💾 Inserting ${allArticles.length} articles to database...`)

    // Fetch existing article URLs to avoid duplicates
    const articleUrls = allArticles.map(a => a.article_url)
    const { data: existingArticles } = await supabaseAdmin
      .from('news_articles')
      .select('article_url')
      .in('article_url', articleUrls)

    const existingUrls = new Set(existingArticles?.map(a => a.article_url) || [])

    // Filter to only new articles
    const newArticles = allArticles.filter(a => !existingUrls.has(a.article_url))

    console.log(`📊 Found ${existingUrls.size} existing articles, inserting ${newArticles.length} new ones`)

    // Add batch tracking to new articles only
    const articlesWithBatch = newArticles.map(article => ({
      ...article,
      scrape_batch_id: batchId,
      scrape_batch_time: now
    }))

    // Batch insert instead of upsert (faster and avoids timeout)
    const { error: insertError, count } = await supabaseAdmin
      .from('news_articles')
      .insert(articlesWithBatch, { count: 'exact' })

    if (insertError) {
      console.error('❌ Error inserting articles:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: 'Database insert failed',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log(`✅ Product scrape complete in ${duration}ms`)
    console.log(`   - Total articles scraped: ${allArticles.length}`)
    console.log(`   - New articles inserted: ${count || newArticles.length}`)

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
