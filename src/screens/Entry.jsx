import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

export default function Entry() {
  const { navigate } = useApp()

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-evo-black">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="w-full h-full object-cover scale-110 blur-sm opacity-25"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-evo-black/60 via-transparent to-evo-black/80" />
      </div>

      {/* Top wordmark */}
      <div className="relative z-10 pt-16 flex flex-col items-center">
        <motion.div {...fadeUp(0.1)}>
          <span className="text-5xl font-light tracking-[0.3em] text-white select-none">
            EVO
          </span>
        </motion.div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 -mt-8">
        <motion.div {...fadeUp(0.3)}>
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-evo-accent mb-8">
            Powered by AI
          </p>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl font-light text-white leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        >
          Your event.
          <br />
          <span className="text-evo-accent">Produced.</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-evo-muted text-base tracking-wide font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          Tell us nothing. Show us everything.
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 pb-16 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <button
            onClick={() => navigate('discover')}
            className="px-10 py-4 rounded-full border border-evo-accent text-evo-accent text-sm font-medium tracking-[0.15em] uppercase hover:bg-evo-accent hover:text-black transition-all duration-300 active:scale-95"
          >
            Start Building
          </button>
        </motion.div>

        <motion.p
          className="text-evo-dim text-xs tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.35 }}
        >
          No forms. No search. Just vision.
        </motion.p>
      </div>
    </div>
  )
}
