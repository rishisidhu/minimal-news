'use client'

import { NewsArticle } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  // Returns color for the small dot indicator
  const getDotColor = (source: string) => {
    switch (source) {
      // Crypto sources
      case 'CoinDesk':
        return 'bg-blue-500'
      case 'The Block':
        return 'bg-slate-700 dark:bg-slate-400'
      case 'Reddit':
        return 'bg-orange-500'
      case 'Cointelegraph':
        return 'bg-yellow-500'
      case 'CryptoPotato':
        return 'bg-green-500'
      case 'Paradigm':
        return 'bg-purple-500'
      case 'a16z Crypto':
        return 'bg-red-500'
      case 'Messari':
        return 'bg-cyan-500'
      // AI sources
      case 'OpenAI':
        return 'bg-emerald-500'
      case 'MIT Tech Review':
        return 'bg-red-500'
      case 'TechCrunch':
        return 'bg-green-500'
      case 'Wired':
        return 'bg-slate-700 dark:bg-slate-400'
      case 'VentureBeat':
        return 'bg-blue-500'
      case 'DeepMind':
        return 'bg-indigo-500'
      case 'Meta AI':
        return 'bg-blue-400'
      case 'NVIDIA':
        return 'bg-lime-500'
      case 'Hugging Face':
        return 'bg-yellow-400'
      // Product sources
      case 'r/ProductManagement':
        return 'bg-orange-500'
      case 'r/UserExperience':
        return 'bg-orange-400'
      case 'r/UXDesign':
        return 'bg-orange-400'
      case 'Hacker News':
        return 'bg-amber-500'
      case 'Product Hunt':
        return 'bg-red-500'
      case 'a16z':
        return 'bg-red-500'
      case 'First Round':
        return 'bg-teal-500'
      case 'Product School':
        return 'bg-violet-500'
      case 'IndieHackers':
        return 'bg-blue-500'
      default:
        return 'bg-slate-500'
    }
  }

  // Truncate to specified number of words
  const truncateToWords = (text: string, maxWords: number): string => {
    const words = text.split(/\s+/)
    if (words.length <= maxWords) return text

    const truncated = words.slice(0, maxWords).join(' ')
    const sentenceEnd = text.indexOf('.', truncated.length)
    if (sentenceEnd !== -1 && sentenceEnd - truncated.length < 100) {
      return text.substring(0, sentenceEnd + 1)
    }

    return truncated + '...'
  }

  // More text for excerpts
  const truncatedExcerpt = truncateToWords(article.excerpt, featured ? 80 : 50)

  // Card layout: image + title on top, excerpt below, source at bottom
  return (
    <article className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5">
        {/* Top row: Thumbnail + Title */}
        <div className="flex items-start gap-3 mb-3">
          {/* Small thumbnail */}
          {article.image_url ? (
            <div className={`relative flex-shrink-0 ${featured ? 'w-14 h-14' : 'w-10 h-10'} rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800`}>
              <Image
                src={article.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : (
            <div className={`flex-shrink-0 ${featured ? 'w-14 h-14' : 'w-10 h-10'} rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                {article.source.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Title next to image */}
          <h3 className={`flex-1 font-medium text-slate-900 dark:text-slate-100 leading-snug ${featured ? 'text-base line-clamp-2' : 'text-sm line-clamp-2'}`}>
            <a href={article.article_url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-slate-300 dark:decoration-slate-600">
              {article.title}
            </a>
          </h3>
        </div>

        {/* Excerpt */}
        <p className={`text-slate-600 dark:text-slate-400 leading-relaxed mb-3 ${featured ? 'text-sm line-clamp-4' : 'text-xs line-clamp-3'}`}>
          {truncatedExcerpt}
        </p>

        {/* Source at bottom - subtle with colored underline */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <span className={`w-1 h-3 rounded-full ${getDotColor(article.source)}`} />
            <span>{article.source}</span>
          </span>
          <span>{formatDistanceToNow(new Date(article.created_at || article.published_at), { addSuffix: true })}</span>
        </div>
      </div>
    </article>
  )
}
