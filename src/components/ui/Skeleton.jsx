// Enhanced by EVO Agent
function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-evo-card rounded-2xl border border-evo-border p-4 space-y-3">
      <SkeletonBlock className="h-40 w-full rounded-xl" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 10 }) {
  return <div className={`skeleton rounded-full w-${size} h-${size}`} />
}

export default SkeletonBlock
