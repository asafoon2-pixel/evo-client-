// Enhanced by EVO Agent
import { motion } from 'framer-motion'

const variants = {
  primary:   'bg-evo-accent text-black hover:bg-[#B8946A] shadow-evo-accent',
  secondary: 'border border-evo-accent text-evo-accent hover:bg-evo-accent hover:text-black',
  ghost:     'border border-evo-border text-evo-muted hover:border-white/30 hover:text-white',
  danger:    'border border-evo-error/50 text-evo-error hover:bg-evo-error/10',
}

const sizes = {
  sm:  'px-4 py-2 text-xs tracking-[0.1em]',
  md:  'px-6 py-3.5 text-sm tracking-[0.1em]',
  lg:  'px-8 py-4 text-sm tracking-[0.12em]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative rounded-full font-medium uppercase transition-all duration-200
        flex items-center justify-center gap-2 select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
