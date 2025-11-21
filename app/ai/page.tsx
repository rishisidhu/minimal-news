'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import { NewsArticle } from '@/lib/supabase'
import { prefetchOtherNews } from '@/lib/prefetch'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const AI_SOURCES = [
  'TechCrunch',
  'Wired',
  'VentureBeat',
  'Hugging Face',
]

export default function AINews() {
  const [selectedSources, setSelectedSources] = useState<string[]>(AI_SOURCES)

  // Fetch AI news with auto-refresh every 10 seconds
  const { data, error, isLoading, mutate } = useSWR(
    '/api/news-ai',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  )

  // Prefetch other sections in background
  useEffect(() => {
    prefetchOtherNews('ai')
  }, [])

  const toggleAll = () => {
    const newSelected = selectedSources.length === AI_SOURCES.length
      ? [AI_SOURCES[0]]
      : AI_SOURCES
    setSelectedSources(newSelected)
  }

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length === 1) return
      setSelectedSources(selectedSources.filter(s => s !== source))
    } else {
      setSelectedSources([...selectedSources, source])
    }
  }

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
                  AI Edition
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/crypto"
                className="px-3 py-1.5 text-xs font-medium text-white border border-slate-400/30 rounded-md hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                Crypto
              </Link>
              <Link
                href="/ai"
                className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 border border-slate-400/30 rounded-md"
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
        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={toggleAll}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors flex-shrink-0 ${
                selectedSources.length === AI_SOURCES.length
                  ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />

            <div className="flex gap-1.5 flex-shrink-0">
              {AI_SOURCES.map(source => (
                <button
                  key={source}
                  onClick={() => toggleSource(source)}
                  className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                    selectedSources.includes(source)
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                      : 'text-slate-400 dark:text-slate-500 border border-transparent hover:text-slate-600 dark:hover:text-slate-400'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              No AI news articles found. The scraper will fetch new articles shortly.
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
            Updates every 10 seconds • 9 Sources • Max 3 articles per source
          </p>
        </div>
      </footer>
    </div>
  )
}
