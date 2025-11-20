'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

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
      {/* Spotlight effect - radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.03),transparent_50%)]" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Logo and Brand */}
        <div className="text-center mb-24">
          <div className="flex justify-center mb-10">
            <Logo className="w-16 h-16 opacity-60" />
          </div>
          <h1 className="font-serif text-8xl font-extralight tracking-wider text-black dark:text-white mb-8" style={{ letterSpacing: '0.15em' }}>
            NIMINAL
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-black/20 dark:via-white/30 to-transparent mb-8" />
          <p className="text-sm tracking-[0.3em] text-black/50 dark:text-white/40 font-light uppercase">
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
              <div className="relative bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 overflow-hidden">
                {/* Reflection effect - gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 dark:from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle spotlight on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-black/0 dark:from-white/0 via-black/5 dark:via-white/5 to-black/0 dark:to-white/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                {/* Content */}
                <div className="relative">
                  <div className="text-4xl mb-4 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    {category.emoji}
                  </div>
                  <h2 className="text-lg font-light tracking-wider text-black dark:text-white mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>
                    {category.title}
                  </h2>
                  <p className="text-xs text-black/50 dark:text-white/40 font-light tracking-wide">
                    {category.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-[10px] font-light tracking-[0.2em] uppercase text-black/40 dark:text-white/30 group-hover:text-black/70 dark:group-hover:text-white/60 transition-colors">
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
            className="text-[10px] tracking-[0.3em] uppercase text-white/20 hover:text-white/40 transition-colors font-extralight"
          >
            About
          </Link>
        </div>
      </main>
    </div>
  )
}
