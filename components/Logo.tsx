export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-label="Minimal News logo"
    >
      <rect width="32" height="32" rx="6" fill="currentColor" className="text-white"/>
      <path
        d="M8 24V8h2l6 10 6-10h2v16h-2.5V13l-5.5 9-5.5-9v11H8z"
        className="fill-slate-800 dark:fill-slate-900"
      />
    </svg>
  )
}
