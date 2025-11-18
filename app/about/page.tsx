import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-black dark:via-gray-950 dark:to-gray-900 shadow-lg border-b border-gray-700 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link href="/" className="inline-block">
              <div>
                <h1 className="font-serif text-4xl font-semibold text-white hover:text-slate-200 transition-colors">
                  Minimal News
                </h1>
                <p className="text-sm text-slate-200 mt-2">
                  Read. Inform. Move on.
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-white border border-slate-400/30 rounded-lg hover:bg-white/10 hover:border-slate-300/50 transition-colors"
              >
                Home
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700">
          <div className="space-y-8">
            {/* Slogan */}
            <div className="text-center pb-8 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Read. Inform. Move on.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 italic">
                News without the noise
              </p>
            </div>

            {/* Philosophy */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Our Philosophy
              </h3>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  In a world of endless scrolling and infinite feeds, we believe news consumption should be intentional, focused, and finite.
                </p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Minimal News</strong> is designed around four core principles:
                </p>

                {/* Four Principles */}
                <div className="grid sm:grid-cols-2 gap-6 my-8">
                  {/* Principle 1 */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      No Endless Scroll
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      We show you a curated selection of the latest news, not an infinite feed designed to keep you hooked. Read what matters, then get back to your life.
                    </p>
                  </div>

                  {/* Principle 2 */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Fresh Only
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Articles older than 6 hours are automatically removed. We focus on what's happening now, not yesterday's headlines recycled endlessly.
                    </p>
                  </div>

                  {/* Principle 3 */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      50 Words, No More
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Every article is condensed to around 50 words. Get the essence without the fluff.
                    </p>
                  </div>

                  {/* Principle 4 */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Read and Go
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      No engagement tricks, no clickbait, no endless recommendations. We're designed for you to read, stay informed, and move on with your day.
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We aggregate cryptocurrency news from multiple trusted sources e.g.: <strong>CoinDesk</strong>, <strong>The Block</strong>, and <strong>Reddit's r/CryptoCurrency</strong>.
                  The feed updates automatically every 10 seconds, but articles are curated, not endless.
                </p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  This is news designed for humans, not algorithms. Welcome to Minimal News.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Minimal News • Read. Inform. Move on.
          </p>
        </div>
      </footer>
    </div>
  )
}
