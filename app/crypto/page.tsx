'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import SourceFilter from '@/components/SourceFilter'
import Logo from '@/components/Logo'
import { NewsArticle } from '@/lib/supabase'
import { prefetchOtherNews } from '@/lib/prefetch'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
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

  // Prefetch other sections in background
  useEffect(() => {
    prefetchOtherNews('crypto')
  }, [])

  // Periodic scraping - trigger scrape every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/scrape', { method: 'POST' })
        mutate() // Refresh the data after scraping
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
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="font-serif text-4xl font-semibold text-white">
                  Niminal
                </h1>
                <p className="text-sm text-slate-200 mt-1">
                  News without the noise.
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/crypto"
                className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 border border-slate-400/30 rounded-md"
              >
                Crypto
              </Link>
              <Link
                href="/ai"
                className="px-3 py-1.5 text-xs font-medium text-white border border-slate-400/30 rounded-md hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                AI
              </Link>
              <Link
                href="/product"
                className="px-3 py-1.5 text-xs font-medium text-white border border-slate-400/30 rounded-md hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                Product
              </Link>
              <Link
                href="/about"
                className="px-3 py-1.5 text-xs font-medium text-white border border-slate-400/30 rounded-md hover:bg-white/10 hover:border-slate-300/50 transition-colors"
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

        {isLoading && allArticles.length === 0 ? (
          <div className="space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Fetching latest articles...
            </p>
            {/* Skeleton loading - list style */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              ))}
            </div>
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
            {/* Featured row - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.slice(0, 2).map((article) => (
                <NewsCard key={article.id} article={article} featured />
              ))}
            </div>

            {/* Regular articles - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(2).map((article) => (
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
            News without the noise.
          </p>
        </div>
      </footer>
    </div>
  )
}
