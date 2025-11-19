export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-label="Niminal logo"
    >
      <rect width="32" height="32" rx="6" fill="currentColor" className="text-white"/>
      <path
        d="M7 24V8h2.5l6.5 11V8H19v16h-2.5L10 13v11H7z"
        className="fill-slate-800 dark:fill-slate-900"
      />
      <circle cx="24" cy="22" r="2" className="fill-slate-800 dark:fill-slate-900"/>
    </svg>
  )
}
