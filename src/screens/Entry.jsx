import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const f = (delay = 0, y = 20) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

const stats = [
  { value: '2,400+', label: 'Events produced' },
  { value: '98%',    label: 'Satisfaction' },
  { value: '< 3min', label: 'To your package' },
]

export default function Entry() {
  const { navigate } = useApp()

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden" style={{ background: '#F5F5F7' }}>

      {/* Ambient dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Hero image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-15"
          draggable={false}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(245,245,247,0.55) 0%, rgba(245,245,247,0.15) 40%, rgba(245,245,247,0.97) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 45% at 50% 38%, rgba(45,27,105,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 pt-16 flex flex-col items-center">
        <motion.div {...f(0.1)}>
          <span className="text-[42px] font-light tracking-[0.5em] select-none leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#1E1060' }}>
            EVO
          </span>
        </motion.div>
        <motion.div {...f(0.25)} className="mt-3">
          <div className="h-px w-10 mx-auto" style={{ background: 'var(--primary)', opacity: 0.5 }} />
        </motion.div>
      </div>

      {/* Center hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.p {...f(0.35)} className="label-overline mb-8">
          AI-Powered Event Production
        </motion.p>

        <motion.h1
          {...f(0.5, 28)}
          className="font-display text-[56px] leading-[1.05] tracking-tight"
          style={{ color: '#1A1A2E' }}
        >
          Your event.
          <br />
          <span style={{ color: '#FF2D8A', fontStyle: 'italic' }}>Produced.</span>
        </motion.h1>

        <motion.p
          {...f(0.7)}
          className="mt-5 text-sm font-light leading-relaxed max-w-[260px]"
          style={{ color: 'var(--text-muted)' }}
        >
          Tell us nothing. Show us everything.
          <br />EVO builds the rest.
        </motion.p>

        {/* Stats */}
        <motion.div {...f(0.85)} className="mt-12 flex items-center gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[15px] font-medium leading-none" style={{ color: '#1A1A2E' }}>{s.value}</p>
              <p className="text-[10px] mt-1.5 tracking-wide" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="relative z-10 pb-14 flex flex-col items-center gap-4 w-full px-8">
        <motion.button
          {...f(1.05)}
          onClick={() => navigate('brief')}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-xs py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200"
          style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-accent)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
        >
          Start Building
        </motion.button>

        <motion.p {...f(1.2)} className="text-[11px] tracking-widest" style={{ color: 'var(--text-dim)' }}>
          No forms. No search. Just vision.
        </motion.p>
      </div>
    </div>
  )
}
