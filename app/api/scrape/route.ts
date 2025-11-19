import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scrapeCoinDesk } from '@/lib/scrapers/coindesk'
import { scrapeTheBlock } from '@/lib/scrapers/theblock'
import { scrapeReddit } from '@/lib/scrapers/reddit'
import { scrapeCointelegraph } from '@/lib/scrapers/cointelegraph'
import { scrapeCryptoPotato } from '@/lib/scrapers/cryptopotato'
import { scrapeParadigm } from '@/lib/scrapers/paradigm'
import { scrapeA16z } from '@/lib/scrapers/a16z'
import { scrapeMessari } from '@/lib/scrapers/messari'

export async function POST() {
  try {
    // Delete articles older than 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    const { error: deleteError, count: deletedCount } = await supabaseAdmin
      .from('news_articles')
      .delete()
      .lt('created_at', sixHoursAgo)

    if (deleteError) {
      console.error('Error deleting old articles:', deleteError)
    } else {
      console.log(`Deleted ${deletedCount || 0} articles older than 6 hours`)
    }

    // Scrape all sources in parallel
    const [
      coindeskArticles,
      theblockArticles,
      redditArticles,
      cointelegraphArticles,
      cryptopotatoArticles,
      paradigmArticles,
      a16zArticles,
      messariArticles
    ] = await Promise.all([
      scrapeCoinDesk(),
      scrapeTheBlock(),
      scrapeReddit(),
      scrapeCointelegraph(),
      scrapeCryptoPotato(),
      scrapeParadigm(),
      scrapeA16z(),
      scrapeMessari(),
    ])

    const allArticles = [
      ...coindeskArticles,
      ...theblockArticles,
      ...redditArticles,
      ...cointelegraphArticles,
      ...cryptopotatoArticles,
      ...paradigmArticles,
      ...a16zArticles,
      ...messariArticles
    ]

    // Upsert articles into Supabase (insert new, update existing based on article_url)
    let upsertedCount = 0

    for (const article of allArticles) {
      const { error } = await supabaseAdmin
        .from('news_articles')
        .upsert(article, { onConflict: 'article_url' })
        .select()

      if (error) {
        console.error('Error upserting article:', error)
      } else {
        upsertedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${allArticles.length} articles. Upserted: ${upsertedCount}`,
      stats: {
        coindesk: coindeskArticles.length,
        theblock: theblockArticles.length,
        reddit: redditArticles.length,
        cointelegraph: cointelegraphArticles.length,
        cryptopotato: cryptopotatoArticles.length,
        paradigm: paradigmArticles.length,
        a16z: a16zArticles.length,
        messari: messariArticles.length,
      }
    })
  } catch (error) {
    console.error('Error in scrape route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape news' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Allow GET request to trigger scraping as well
  return POST()
}
