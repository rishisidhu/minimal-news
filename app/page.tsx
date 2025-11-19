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
                  Niminal
                </h1>
                <p className="text-sm text-slate-200 mt-1">
                  News without the noise.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/ai"
                className="px-4 py-2 text-sm font-medium text-white border border-slate-400/30 rounded-lg hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                AI
              </Link>
              <Link
                href="/product"
                className="px-4 py-2 text-sm font-medium text-white border border-slate-400/30 rounded-lg hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                Product
              </Link>
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
          <div className="space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Fetching latest articles...
            </p>
            {/* Skeleton loading cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                  <div className="h-32 bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    </div>
                  </div>
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
