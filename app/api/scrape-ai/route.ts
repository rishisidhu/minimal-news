import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scrapeOpenAI } from '@/lib/scrapers/openai'
import { scrapeMITTechReview } from '@/lib/scrapers/mit-tech-review'
import { scrapeTechCrunchAI } from '@/lib/scrapers/techcrunch-ai'
import { scrapeWiredAI } from '@/lib/scrapers/wired-ai'
import { scrapeVentureBeatAI } from '@/lib/scrapers/venturebeat-ai'
import { scrapeDeepMind } from '@/lib/scrapers/deepmind'
import { scrapeMetaAI } from '@/lib/scrapers/meta-ai'
import { scrapeNvidiaAI } from '@/lib/scrapers/nvidia-ai'
import { scrapeHuggingFace } from '@/lib/scrapers/huggingface'

const AI_SOURCES = [
  'OpenAI', 'MIT Tech Review', 'TechCrunch', 'Wired', 'VentureBeat',
  'DeepMind', 'Meta AI', 'NVIDIA', 'Hugging Face'
]

export async function POST() {
  try {
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
      openaiArticles,
      mitTechReviewArticles,
      techcrunchArticles,
      wiredArticles,
      venturebeatArticles,
      deepmindArticles,
      metaAiArticles,
      nvidiaArticles,
      huggingfaceArticles
    ] = await Promise.all([
      scrapeOpenAI(),
      scrapeMITTechReview(),
      scrapeTechCrunchAI(),
      scrapeWiredAI(),
      scrapeVentureBeatAI(),
      scrapeDeepMind(),
      scrapeMetaAI(),
      scrapeNvidiaAI(),
      scrapeHuggingFace(),
    ])

    const allArticles = [
      ...openaiArticles,
      ...mitTechReviewArticles,
      ...techcrunchArticles,
      ...wiredArticles,
      ...venturebeatArticles,
      ...deepmindArticles,
      ...metaAiArticles,
      ...nvidiaArticles,
      ...huggingfaceArticles
    ]

    // Upsert articles into Supabase
    let upsertedCount = 0

    for (const article of allArticles) {
      const { error } = await supabaseAdmin
        .from('news_articles')
        .upsert(article, { onConflict: 'article_url' })
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
        openai: openaiArticles.length,
        mitTechReview: mitTechReviewArticles.length,
        techcrunch: techcrunchArticles.length,
        wired: wiredArticles.length,
        venturebeat: venturebeatArticles.length,
        deepmind: deepmindArticles.length,
        metaAi: metaAiArticles.length,
        nvidia: nvidiaArticles.length,
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
