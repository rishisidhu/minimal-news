'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export default function HomePage() {
  const categories = [
    {
      title: 'Crypto',
      description: 'Stay updated with the latest in cryptocurrency and blockchain',
      href: '/crypto',
      emoji: '₿',
      gradient: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20',
      border: 'border-blue-500/20 hover:border-blue-500/40'
    },
    {
      title: 'AI',
      description: 'Discover the cutting edge of artificial intelligence',
      href: '/ai',
      emoji: '🤖',
      gradient: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20',
      border: 'border-purple-500/20 hover:border-purple-500/40'
    },
    {
      title: 'Product',
      description: 'Learn from the best in product management and design',
      href: '/product',
      emoji: '🚀',
      gradient: 'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20',
      border: 'border-orange-500/20 hover:border-orange-500/40'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo and Brand */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="font-serif text-6xl font-semibold text-slate-900 dark:text-white mb-4">
            Niminal
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            News without the noise.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 ${category.border} bg-gradient-to-br ${category.gradient} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                {category.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {category.description}
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                Explore
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* About Link */}
        <div className="mt-12">
          <Link
            href="/about"
            className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            About Niminal
          </Link>
        </div>
      </main>
    </div>
  )
}
