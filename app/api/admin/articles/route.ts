import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // Check username and password from Authorization header
    const authHeader = request.headers.get('authorization')
    const credentials = authHeader?.replace('Bearer ', '')

    // Parse credentials (format: username:password)
    // Use indexOf to split only on the FIRST colon
    const colonIndex = credentials?.indexOf(':') ?? -1
    const username = colonIndex > -1 && credentials ? credentials.substring(0, colonIndex) : ''
    const password = colonIndex > -1 && credentials ? credentials.substring(colonIndex + 1) : ''

    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log('Auth attempt:', {
      receivedUsername: username,
      expectedUsername: adminUsername,
      passwordMatch: password === adminPassword,
      passwordLength: password?.length,
      expectedPasswordLength: adminPassword?.length
    })

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 }
      )
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Fetch all articles with full details, sorted by created_at DESC
    const { data: articles, error } = await supabaseAdmin
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      )
    }

    // Determine category for each article based on source
    const articlesWithCategory = articles.map(article => {
      let category = 'Crypto' // default

      const aiSources = ['TechCrunch', 'Wired', 'VentureBeat', 'HuggingFace', 'OpenAI', 'MIT Tech Review', 'DeepMind', 'Meta AI', 'NVIDIA AI']
      const productSources = ['Roman Pichler', 'Product Coalition', 'Aha!', 'ProductTalk', 'Intercom', 'Product School', "Lenny's Newsletter", 'SVPG', 'Mind the Product', 'ProductPlan', 'Reddit Product', 'Indie Hackers', 'Product Hunt', 'a16z Product', 'First Round']

      if (aiSources.includes(article.source)) {
        category = 'AI'
      } else if (productSources.includes(article.source)) {
        category = 'Product'
      }

      return {
        ...article,
        category
      }
    })

    return NextResponse.json({
      success: true,
      count: articlesWithCategory.length,
      articles: articlesWithCategory
    })
  } catch (error) {
    console.error('Error in admin articles route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
