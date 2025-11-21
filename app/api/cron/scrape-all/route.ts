import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('⏰ Cron job triggered: scrape-all')

  // Verify this is a legitimate Vercel Cron request
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('❌ Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const startTime = Date.now()

    // Import all scraper modules
    const [cryptoModule, aiModule, productModule] = await Promise.all([
      import('../../scrape/route'),
      import('../../scrape-ai/route'),
      import('../../scrape-product/route')
    ])

    console.log('📰 Running all scrapers in parallel...')

    // Run all scrapers in parallel
    const [cryptoResult, aiResult, productResult] = await Promise.all([
      cryptoModule.POST(),
      aiModule.POST(),
      productModule.POST()
    ])

    const duration = Date.now() - startTime

    // Parse responses
    const cryptoData = await cryptoResult.json()
    const aiData = await aiResult.json()
    const productData = await productResult.json()

    console.log(`✅ All scrapers completed in ${duration}ms`)
    console.log('📊 Results:', {
      crypto: cryptoData.success ? `${cryptoData.stats?.total || 0} articles` : 'failed',
      ai: aiData.success ? `${aiData.stats?.total || 0} articles` : 'failed',
      product: productData.success ? `${productData.stats?.total || 0} articles` : 'failed'
    })

    return NextResponse.json({
      success: true,
      message: `All scrapers completed in ${duration}ms`,
      results: {
        crypto: cryptoData,
        ai: aiData,
        product: productData
      },
      duration: `${duration}ms`
    })
  } catch (error) {
    console.error('❌ Combined cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Combined cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
