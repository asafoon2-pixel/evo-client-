// Enhanced by EVO Agent
const variants = {
  default:  'bg-evo-card border border-evo-border',
  elevated: 'bg-evo-elevated border border-evo-border shadow-evo-md',
  bordered: 'bg-transparent border border-evo-border',
  accent:   'bg-evo-card border-l-2 border-evo-accent',
}

export default function Card({
  children,
  variant = 'default',
  hover = false,
  onClick,
  className = '',
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`
        rounded-2xl transition-all duration-200
        ${variants[variant]}
        ${hover || onClick ? 'hover:border-evo-border/70 hover:-translate-y-0.5 hover:shadow-evo-md active:translate-y-0 active:scale-[0.99] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Tag>
  )
}
