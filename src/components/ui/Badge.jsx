// Enhanced by EVO Agent
const variants = {
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
  accent:  'bg-evo-accent/10 text-evo-accent border-evo-accent/20',
  neutral: 'bg-evo-elevated text-evo-muted border-evo-border',
  new:     'bg-evo-accent/10 text-evo-accent border-evo-accent/30 animate-pulse',
}

const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-3 py-1',
}

export default function Badge({ label, variant = 'neutral', size = 'md', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium tracking-wide uppercase border rounded-full ${variants[variant]} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {label}
    </span>
  )
}
