// Enhanced by EVO Agent
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const f = (delay = 0, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
})

const stats = [
  { value: '2,400+', label: 'Events produced' },
  { value: '98%',   label: 'Client satisfaction' },
  { value: '< 3min', label: 'To your package' },
]

export default function Entry() {
  const { navigate } = useApp()

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-evo-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="w-full h-full object-cover scale-110 blur-sm opacity-20"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-evo-black/70 via-evo-black/20 to-evo-black" />
        {/* Subtle radial glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 pt-16 flex flex-col items-center">
        <motion.div {...f(0.1)}>
          <div className="flex items-center gap-3">
            <span className="text-[44px] font-light tracking-[0.4em] text-white select-none leading-none">EVO</span>
          </div>
        </motion.div>
        <motion.div {...f(0.2)} className="mt-2">
          <div className="h-px w-12 bg-evo-accent mx-auto opacity-60" />
        </motion.div>
      </div>

      {/* Center */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.p {...f(0.3)} className="text-[10px] font-semibold tracking-[0.35em] uppercase text-evo-accent mb-7">
          AI-Powered Event Production
        </motion.p>

        <motion.h1
          className="text-[52px] sm:text-6xl font-light text-white leading-[1.1] tracking-tight"
          {...f(0.45, 30)}
        >
          Your event.
          <br />
          <span className="text-evo-accent italic">Produced.</span>
        </motion.h1>

        <motion.p
          className="mt-5 text-evo-muted text-[15px] tracking-wide font-light leading-relaxed max-w-xs"
          {...f(0.65)}
        >
          Tell us nothing. Show us everything.
          <br />EVO builds the rest.
        </motion.p>

        {/* Stats */}
        <motion.div
          {...f(0.8)}
          className="mt-10 flex items-center gap-6"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white text-base font-medium leading-none">{s.value}</p>
              <p className="text-evo-dim text-[10px] mt-1 tracking-wide">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="relative z-10 pb-16 flex flex-col items-center gap-4 w-full px-8">
        <motion.button
          {...f(1.0)}
          onClick={() => navigate('discover')}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-xs py-4 rounded-full bg-evo-accent text-black text-sm font-semibold tracking-[0.15em] uppercase shadow-evo-accent hover:bg-[#B8946A] transition-all duration-200"
        >
          Start Building
        </motion.button>

        <motion.p
          className="text-evo-dim text-xs tracking-widest"
          {...f(1.15)}
        >
          No forms. No search. Just vision.
        </motion.p>
      </div>
    </div>
  )
}
