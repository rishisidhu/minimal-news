'use client'

import { useState, useRef, useEffect } from 'react'

export default function AmbientPlayer() {
  const [isMuted, setIsMuted] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Check localStorage for user's mute preference
    const savedMute = localStorage.getItem('ambientMuted')
    if (savedMute !== null) {
      setIsMuted(savedMute === 'true')
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady || !audioRef.current) return

    if (isMuted) {
      audioRef.current.pause()
    } else {
      // Try to play - browsers require user interaction first
      audioRef.current.play().catch(() => {
        // Auto-play blocked, will play on next user interaction
      })
    }

    // Save preference
    localStorage.setItem('ambientMuted', String(isMuted))
  }, [isMuted, isReady])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!isReady) return null

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop
        preload="auto"
        // Very low volume - 10%
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.volume = 0.1
          }
        }}
      />

      <button
        onClick={toggleMute}
        className="fixed bottom-4 left-4 z-50 p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-700 group"
        aria-label={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
        title={isMuted ? 'Play relaxing music' : 'Mute music'}
      >
        {isMuted ? (
          // Muted icon
          <svg
            className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          // Playing icon with animated waves
          <svg
            className="w-4 h-4 text-amber-600 dark:text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </>
  )
}
