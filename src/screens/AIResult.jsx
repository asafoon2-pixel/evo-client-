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
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-evo-black overflow-hidden">
      {/* Background image */}
      {event.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.backgroundImage}
            alt=""
            className="w-full h-full object-cover blur-lg opacity-10"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-evo-black via-evo-black/70 to-evo-black" />
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
          className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight"
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
              className="text-xs font-medium tracking-widest uppercase text-evo-muted border border-evo-border rounded-full px-4 py-1.5"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          {...stagger(4)}
          className="text-evo-muted text-sm leading-relaxed font-light max-w-sm"
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
            className="w-full max-w-xs py-4 rounded-full border border-evo-accent text-evo-accent text-sm font-medium tracking-[0.12em] uppercase hover:bg-evo-accent hover:text-black transition-all duration-300 active:scale-95"
          >
            Build This Event
          </button>
          <button
            onClick={() => navigate('discover')}
            className="text-evo-muted text-sm tracking-wide hover:text-white transition-colors py-2"
          >
            Refine my taste
          </button>
        </motion.div>
      </div>
    </div>
  )
}
