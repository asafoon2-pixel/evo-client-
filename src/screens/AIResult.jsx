import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useApp } from '../context/AppContext'

const stagger = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.3, ease: 'easeOut' },
})

export default function AIResult() {
  const { navigate, generatedEvent } = useApp()

  const event = {
    name: 'הערב המיוחד שלך',
    description: 'אירוע שנבנה בקפידה בהתאם לטעם ולאינסטינקטים שלך.',
    tags: ['מותאם אישית', 'ייחודי', 'בלתי נשכח'],
    backgroundImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    ...(generatedEvent || {}),
  }

  return (
    <div dir="rtl" className="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Background image */}
      {event.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.backgroundImage}
            alt=""
            className="w-full h-full object-cover blur-lg opacity-10"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--background) 0%, rgba(245,240,232,0.7) 50%, var(--background) 100%)' }} />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg w-full">
        {/* EVO read label */}
        <motion.p
          {...stagger(0)}
          className="text-xs tracking-[0.3em] uppercase mb-10" style={{ color: 'var(--primary)' }}
        >
          EVO קרא את הטעם שלך
        </motion.p>

        {/* Event name */}
        <motion.h1
          {...stagger(1)}
          className="text-4xl sm:text-5xl font-light leading-tight tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {event.name}
        </motion.h1>

        {/* Gold line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="h-px mt-8 mb-8"
          style={{ background: 'var(--primary)' }}
        />

        {/* Tags */}
        <motion.div {...stagger(3)} className="flex gap-3 flex-wrap justify-center mb-8">
          {event.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-medium tracking-widest uppercase rounded-full px-4 py-1.5" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          {...stagger(4)}
          className="text-sm leading-relaxed font-light max-w-sm" style={{ color: 'var(--text-muted)' }}
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
            className="w-full max-w-xs py-4 rounded-full text-sm font-medium tracking-[0.12em] uppercase transition-all duration-300 active:scale-95" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            בנה את האירוע הזה
          </button>
          <button
            onClick={() => navigate('eventVisualizer')}
            className="w-full max-w-xs py-4 rounded-full text-sm font-medium tracking-[0.12em] uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            style={{ background: 'rgba(107,95,228,0.15)', color: 'var(--primary)', border: '1px solid rgba(107,95,228,0.3)' }}
          >
            <Palette size={15} />
            צור תמונה לאירוע
          </button>
          <button
            onClick={() => navigate('brief')}
            className="text-sm tracking-wide transition-colors py-2" style={{ color: 'var(--text-muted)' }}
          >
            כוונן את הטעם שלי
          </button>
        </motion.div>
      </div>
    </div>
  )
}
