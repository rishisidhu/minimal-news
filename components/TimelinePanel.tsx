'use client'

import { NewsArticle } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface TimelinePanelProps {
  articles: NewsArticle[]
}

export default function TimelinePanel({ articles }: TimelinePanelProps) {
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'CoinDesk':
        return 'bg-blue-500'
      case 'The Block':
        return 'bg-purple-500'
      case 'Reddit':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-5 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
        Timeline
      </h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-3 hover:border-amber-500 dark:hover:border-amber-600 transition-colors">
              <p className="text-xs font-light text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-1 mb-0.5">
                {article.title}
              </p>

              <div className="text-[10px] font-light text-slate-500 dark:text-slate-500">
                {formatDistanceToNow(new Date(article.created_at || article.published_at), { addSuffix: true })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
