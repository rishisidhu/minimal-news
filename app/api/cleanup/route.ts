import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Delete ALL articles from the database
    const { error, count } = await supabaseAdmin
      .from('news_articles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Match all rows

    if (error) {
      console.error('Error deleting articles:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete articles', details: error },
        { status: 500 }
      )
    }

    console.log(`Cleanup: Deleted ${count || 0} articles from database`)

    return NextResponse.json({
      success: true,
      message: `Deleted all ${count || 0} articles. Fresh articles will be scraped in the next cycle.`,
      deletedCount: count || 0,
    })
  } catch (error) {
    console.error('Error in cleanup route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup database' },
      { status: 500 }
    )
  }
}
