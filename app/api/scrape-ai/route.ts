import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scrapeTechCrunchAI } from '@/lib/scrapers/techcrunch-ai'
import { scrapeWiredAI } from '@/lib/scrapers/wired-ai'
import { scrapeVentureBeatAI } from '@/lib/scrapers/venturebeat-ai'
import { scrapeHuggingFace } from '@/lib/scrapers/huggingface'

const AI_SOURCES = [
  'TechCrunch', 'Wired', 'VentureBeat', 'Hugging Face'
]

export async function POST() {
  try {
    // Generate batch ID for this scrape session
    const now = new Date().toISOString()
    const batchId = `batch-${now}`

    // Delete AI articles older than 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    const { error: deleteError, count: deletedCount } = await supabaseAdmin
      .from('news_articles')
      .delete()
      .lt('created_at', sixHoursAgo)
      .in('source', AI_SOURCES)

    if (deleteError) {
      console.error('Error deleting old AI articles:', deleteError)
    } else {
      console.log(`Deleted ${deletedCount || 0} AI articles older than 6 hours`)
    }

    // Scrape all AI sources in parallel
    const [
      techcrunchArticles,
      wiredArticles,
      venturebeatArticles,
      huggingfaceArticles
    ] = await Promise.all([
      scrapeTechCrunchAI(),
      scrapeWiredAI(),
      scrapeVentureBeatAI(),
      scrapeHuggingFace(),
    ])

    const allArticles = [
      ...techcrunchArticles,
      ...wiredArticles,
      ...venturebeatArticles,
      ...huggingfaceArticles
    ]

    // Upsert articles into Supabase
    let upsertedCount = 0

    for (const article of allArticles) {
      const { error } = await supabaseAdmin
        .from('news_articles')
        .upsert({
          ...article,
          updated_at: now,
          scrape_batch_id: batchId,
          scrape_batch_time: now
        }, { onConflict: 'article_url' })
        .select()

      if (error) {
        console.error('Error upserting AI article:', error)
      } else {
        upsertedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${allArticles.length} AI articles. Upserted: ${upsertedCount}`,
      stats: {
        techcrunch: techcrunchArticles.length,
        wired: wiredArticles.length,
        venturebeat: venturebeatArticles.length,
        huggingface: huggingfaceArticles.length,
      }
    })
  } catch (error) {
    console.error('Error in AI scrape route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape AI news' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
