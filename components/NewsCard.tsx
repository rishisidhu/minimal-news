'use client'

import { NewsArticle } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'CoinDesk':
        return 'bg-blue-600 dark:bg-blue-700'
      case 'The Block':
        return 'bg-black dark:bg-gray-900'
      case 'Reddit':
        return 'bg-orange-600 dark:bg-orange-700'
      case 'Cointelegraph':
        return 'bg-yellow-600 dark:bg-yellow-700'
      case 'CryptoPotato':
        return 'bg-green-600 dark:bg-green-700'
      case 'Paradigm':
        return 'bg-purple-600 dark:bg-purple-700'
      case 'a16z Crypto':
        return 'bg-red-600 dark:bg-red-700'
      case 'Messari':
        return 'bg-cyan-600 dark:bg-cyan-700'
      default:
        return 'bg-slate-600 dark:bg-slate-700'
    }
  }

  // Truncate to 50 words or nearest complete sentence
  const truncateToWords = (text: string, maxWords: number): string => {
    const words = text.split(/\s+/)
    if (words.length <= maxWords) return text

    // Get first 50 words
    const truncated = words.slice(0, maxWords).join(' ')

    // Find nearest sentence end after truncation point
    const sentenceEnd = text.indexOf('.', truncated.length)
    if (sentenceEnd !== -1 && sentenceEnd - truncated.length < 50) {
      // If there's a period within 50 chars, use it
      return text.substring(0, sentenceEnd + 1)
    }

    return truncated + '...'
  }

  const truncatedExcerpt = truncateToWords(article.excerpt, 50)

  if (featured) {
    return (
      <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-600 group">
        {article.image_url && (
          <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
              priority
            />
          </div>
        )}

        <a
          href={article.article_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 bg-slate-800 dark:bg-slate-700 p-2 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
          title="Read full article"
        >
          <svg className="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <div className="p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${getSourceColor(article.source)} text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide`}>
              {article.source}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDistanceToNow(new Date(article.created_at || article.published_at), { addSuffix: true })}
            </span>
          </div>

          <h2 className="font-serif text-base font-semibold mb-2 text-slate-900 dark:text-slate-100 leading-tight">
            {article.title}
          </h2>

          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-7 mb-4">
            {truncatedExcerpt}
          </p>

          <a
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Read Article
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group hover:border-amber-500 dark:hover:border-amber-600">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        {article.image_url && (
          <div className="relative w-full sm:w-1/3 h-32 sm:h-auto bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 40vw"
              unoptimized
            />
          </div>
        )}

        {/* Content Section */}
        <div className="p-3 sm:p-4 flex-1 relative">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`${getSourceColor(article.source)} text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
              {article.source}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDistanceToNow(new Date(article.created_at || article.published_at), { addSuffix: true })}
            </span>
          </div>

          <h3 className="font-serif text-sm font-semibold mb-1.5 text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
            {article.title}
          </h3>

          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-6 mb-3">
            {truncatedExcerpt}
          </p>

          <a
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Read Article
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
