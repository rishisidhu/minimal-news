'use client'

import { useEffect, useState } from 'react'

const ALL_SOURCES = [
  'CoinDesk',
  'The Block',
  'Reddit',
  'Cointelegraph',
  'CryptoPotato',
  'Paradigm',
  'a16z Crypto',
  'Messari',
]

interface SourceFilterProps {
  onFilterChange: (selectedSources: string[]) => void
}

export default function SourceFilter({ onFilterChange }: SourceFilterProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(ALL_SOURCES)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedSources')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSelectedSources(parsed)
        onFilterChange(parsed)
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [])

  const toggleSource = (source: string) => {
    let newSelected: string[]
    if (selectedSources.includes(source)) {
      // Don't allow deselecting all sources
      if (selectedSources.length === 1) return
      newSelected = selectedSources.filter(s => s !== source)
    } else {
      newSelected = [...selectedSources, source]
    }

    setSelectedSources(newSelected)
    localStorage.setItem('selectedSources', JSON.stringify(newSelected))
    onFilterChange(newSelected)
  }

  const toggleAll = () => {
    const newSelected = selectedSources.length === ALL_SOURCES.length
      ? [ALL_SOURCES[0]] // Toggle off: select only CoinDesk
      : ALL_SOURCES // Toggle on: select all
    setSelectedSources(newSelected)
    localStorage.setItem('selectedSources', JSON.stringify(newSelected))
    onFilterChange(newSelected)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* All toggle button */}
        <button
          onClick={toggleAll}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors flex-shrink-0 ${
            selectedSources.length === ALL_SOURCES.length
              ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          All
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />

        {/* Source pills */}
        <div className="flex gap-1.5 flex-shrink-0">
          {ALL_SOURCES.map(source => (
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
  )
}
