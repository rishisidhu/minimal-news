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
  try {
    // Delete old articles (older than 6 hours) for product sources only
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    await supabaseAdmin
      .from('news_articles')
      .delete()
      .lt('created_at', sixHoursAgo)
      .in('source', PRODUCT_SOURCES)

    // Scrape all product sources in parallel
    const [
      hackerNewsArticles,
      firstRoundArticles,
      productSchoolArticles
    ] = await Promise.all([
      scrapeHackerNews(),
      scrapeFirstRound(),
      scrapeProductSchool()
    ])

    const allArticles = [
      ...hackerNewsArticles,
      ...firstRoundArticles,
      ...productSchoolArticles
    ]

    // Insert articles into Supabase
    let insertedCount = 0
    let skippedCount = 0

    for (const article of allArticles) {
      const { error } = await supabaseAdmin
        .from('news_articles')
        .upsert(article, { onConflict: 'article_url' })

      if (error) {
        console.error('Error inserting article:', error)
        skippedCount++
      } else {
        insertedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${allArticles.length} articles. Inserted: ${insertedCount}, Skipped (duplicates): ${skippedCount}`,
      stats: {
        hackerNews: hackerNewsArticles.length,
        firstRound: firstRoundArticles.length,
        productSchool: productSchoolArticles.length
      }
    })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape articles' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
