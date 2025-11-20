'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import { NewsArticle } from '@/lib/supabase'

const PRODUCT_SOURCES = [
  'Hacker News',
  'First Round',
  'Product School'
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductPage() {
  const [isScrapingInitial, setIsScrapingInitial] = useState(true)
  const [selectedSources, setSelectedSources] = useState<string[]>(PRODUCT_SOURCES)

  const { data, error, isLoading } = useSWR(
    '/api/news-product',
    fetcher,
    {
      refreshInterval: 10000,
    }
  )

  // Initial scrape on mount
  useEffect(() => {
    const initialScrape = async () => {
      try {
        await fetch('/api/scrape-product', { method: 'POST' })
      } catch (err) {
        console.error('Initial scrape failed:', err)
      } finally {
        setIsScrapingInitial(false)
      }
    }
    initialScrape()
  }, [])

  // Periodic scraping every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/scrape-product', { method: 'POST' })
      } catch (err) {
        console.error('Periodic scrape failed:', err)
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleAll = () => {
    const newSelected = selectedSources.length === PRODUCT_SOURCES.length
      ? [PRODUCT_SOURCES[0]]
      : PRODUCT_SOURCES
    setSelectedSources(newSelected)
  }

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter(s => s !== source))
      }
    } else {
      setSelectedSources([...selectedSources, source])
    }
  }

  const articles: NewsArticle[] = data?.data || []
  const filteredArticles = articles.filter(article => selectedSources.includes(article.source))

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Failed to load news</h2>
          <p className="text-slate-600 dark:text-slate-400">Please try again later</p>
        </div>
      </div>
    )
  }

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
                  Product Edition
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
                className="px-3 py-1.5 text-xs font-medium text-white border border-slate-400/30 rounded-md hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                AI
              </Link>
              <Link
                href="/product"
                className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 border border-slate-400/30 rounded-md"
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

      {/* Source Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={toggleAll}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors flex-shrink-0 ${
                selectedSources.length === PRODUCT_SOURCES.length
                  ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />

            <div className="flex gap-1.5 flex-shrink-0">
              {PRODUCT_SOURCES.map(source => (
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
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(isLoading || isScrapingInitial) ? (
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
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No articles found. Try selecting more sources.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured row - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.slice(0, 2).map((article) => (
                <NewsCard key={article.id || article.article_url} article={article} featured />
              ))}
            </div>

            {/* Regular articles - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.slice(2).map((article) => (
                <NewsCard key={article.id || article.article_url} article={article} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredArticles.length} articles from {selectedSources.length} sources
          </p>
        </div>
      </footer>
    </div>
  )
}
