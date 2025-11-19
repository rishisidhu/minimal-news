'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import SourceFilter from '@/components/SourceFilter'
import Logo from '@/components/Logo'
import { NewsArticle } from '@/lib/supabase'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isScrapingInitial, setIsScrapingInitial] = useState(true)
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'CoinDesk', 'The Block', 'Reddit', 'Cointelegraph', 'CryptoPotato', 'Paradigm', 'a16z Crypto', 'Messari'
  ])

  // Fetch news with auto-refresh every 10 seconds
  const { data, error, isLoading, mutate } = useSWR(
    '/api/news',
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
      onSuccess: () => {
        setLastRefreshed(new Date())
      }
    }
  )

  // Initial scrape on mount
  useEffect(() => {
    const initialScrape = async () => {
      try {
        await fetch('/api/scrape', { method: 'POST' })
        setIsScrapingInitial(false)
        mutate() // Refresh the news data
      } catch (error) {
        console.error('Initial scrape failed:', error)
        setIsScrapingInitial(false)
      }
    }

    initialScrape()
  }, [mutate])

  // Periodic scraping every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/scrape', { method: 'POST' })
        mutate() // Refresh the news data
      } catch (error) {
        console.error('Periodic scrape failed:', error)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [mutate])

  const allArticles: NewsArticle[] = data?.data || []
  const articles = allArticles.filter(article => selectedSources.includes(article.source))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-black dark:via-gray-950 dark:to-gray-900 shadow-lg border-b border-gray-700 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="font-serif text-4xl font-semibold text-white">
                  Minimal News
                </h1>
                <p className="text-sm text-slate-200 mt-1">
                  Read. Inform. Move on.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium text-white border border-slate-400/30 rounded-lg hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                About
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Source Filter */}
        <SourceFilter onFilterChange={setSelectedSources} />

        {isScrapingInitial && allArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading latest crypto news...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load news. Please check your Supabase configuration.
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-400">
              No news articles found. The scraper will fetch new articles shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Article */}
            {articles[0] && (
              <NewsCard article={articles[0]} featured />
            )}

            {/* Regular Articles */}
            <div className="space-y-4">
              {articles.slice(1).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Updates every 10 seconds • 8 Sources • Max 3 articles per source
          </p>
        </div>
      </footer>
    </div>
  )
}
