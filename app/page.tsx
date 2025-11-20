'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import PrefetchNews from '@/components/PrefetchNews'

export default function HomePage() {
  const categories = [
    {
      title: 'Crypto',
      description: 'Cryptocurrency & Blockchain',
      href: '/crypto',
      emoji: '₿',
    },
    {
      title: 'AI',
      description: 'Artificial Intelligence',
      href: '/ai',
      emoji: '🤖',
    },
    {
      title: 'Product',
      description: 'Management & Design',
      href: '/product',
      emoji: '🚀',
    }
  ]

  return (
    <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden">
      {/* Prefetch all news in background */}
      <PrefetchNews />

      {/* Spotlight effect - radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.03),transparent_50%)]" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Logo and Brand */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
            <Logo className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-80" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wider text-black dark:text-white mb-6 sm:mb-7 md:mb-8 px-4" style={{ letterSpacing: '0.08em' }}>
            <span className="sm:tracking-[0.10em] md:tracking-[0.12em] lg:tracking-[0.15em]">NIMINAL</span>
          </h1>
          <div className="h-px w-24 sm:w-28 md:w-32 mx-auto bg-gradient-to-r from-transparent via-black/30 dark:via-white/30 to-transparent mb-6 sm:mb-7 md:mb-8" />
          <p className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-black/60 dark:text-white/40 font-light uppercase px-4">
            News Without The Noise
          </p>
        </div>

        {/* Category Cards - Smaller tiles with glass effect */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative"
            >
              {/* Glass card with reflection */}
              <div className="relative bg-black/[0.08] dark:bg-white/5 backdrop-blur-md border border-black/[0.15] dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-black/[0.15] dark:hover:bg-white/10 hover:border-black/30 dark:hover:border-white/20 overflow-hidden">
                {/* Reflection effect - gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.15] dark:from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle spotlight on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-black/0 dark:from-white/0 via-black/[0.08] dark:via-white/5 to-black/0 dark:to-white/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                {/* Content */}
                <div className="relative">
                  <div className="text-4xl mb-4 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    {category.emoji}
                  </div>
                  <h2 className="text-lg font-light tracking-wider text-black dark:text-white mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>
                    {category.title}
                  </h2>
                  <p className="text-xs text-black/55 dark:text-white/40 font-light tracking-wide">
                    {category.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-[10px] font-light tracking-[0.2em] uppercase text-black/50 dark:text-white/30 group-hover:text-black/80 dark:group-hover:text-white/60 transition-colors">
                    Enter
                    <svg className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* About Link */}
        <div className="mt-20">
          <Link
            href="/about"
            className="text-[10px] tracking-[0.3em] uppercase text-black/30 dark:text-white/20 hover:text-black/50 dark:hover:text-white/40 transition-colors font-extralight"
          >
            About
          </Link>
        </div>
      </main>
    </div>
  )
}
