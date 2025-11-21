import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('⏰ Cron job triggered: scrape-crypto')

  // Verify this is a legitimate Vercel Cron request
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('❌ Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Import and call the existing scrape route
    const scrapeModule = await import('../../scrape/route')
    return scrapeModule.POST()
  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
