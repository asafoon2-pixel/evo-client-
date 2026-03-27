import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const stagger = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.3, ease: 'easeOut' },
})

export default function AIResult() {
  const { navigate, generatedEvent } = useApp()

  const event = {
    name: 'Your Curated Evening',
    description: 'A thoughtfully composed event shaped entirely by your instincts.',
    tags: ['Curated', 'Personal', 'Distinctive'],
    backgroundImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    ...(generatedEvent || {}),
  }

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#0F0C1E' }}>
      {/* Background image */}
      {event.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.backgroundImage}
            alt=""
            className="w-full h-full object-cover blur-lg opacity-15"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,12,30,0.85) 0%, rgba(15,12,30,0.6) 50%, rgba(15,12,30,0.95) 100%)' }} />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg w-full">
        {/* EVO read label */}
        <motion.p
          {...stagger(0)}
          className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-10"
        >
          EVO Read Your Taste
        </motion.p>

        {/* Event name */}
        <motion.h1
          {...stagger(1)}
          className="text-4xl sm:text-5xl font-light leading-tight tracking-tight" style={{ color: '#F5F0FF' }}
        >
          {event.name}
        </motion.h1>

        {/* Gold line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="h-px bg-evo-accent mt-8 mb-8"
        />

        {/* Tags */}
        <motion.div {...stagger(3)} className="flex gap-3 flex-wrap justify-center mb-8">
          {event.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-medium tracking-widest uppercase rounded-full px-4 py-1.5" style={{ color: 'rgba(245,240,255,0.5)', border: '1px solid rgba(245,240,255,0.15)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          {...stagger(4)}
          className="text-sm leading-relaxed font-light max-w-sm" style={{ color: 'rgba(245,240,255,0.6)' }}
        >
          {event.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...stagger(5)}
          className="flex flex-col items-center gap-4 mt-12 w-full"
        >
          <button
            onClick={() => navigate('categories')}
            className="w-full max-w-xs py-4 rounded-full text-sm font-medium tracking-[0.12em] uppercase transition-all duration-300 active:scale-95" style={{ background: 'var(--primary)', color: '#fff', boxShadow: '0 4px 24px rgba(45,27,105,0.5)' }}
          >
            Build This Event
          </button>
          <button
            onClick={() => navigate('discover')}
            className="text-sm tracking-wide transition-colors py-2" style={{ color: 'rgba(245,240,255,0.5)' }}
          >
            Refine my taste
          </button>
        </motion.div>
      </div>
    </div>
  )
}
