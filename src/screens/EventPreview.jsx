import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const previewSections = [
  {
    id: 'atmosphere', label: 'ATMOSPHERE', descriptor: 'Warm. Textured. Intimate.',
    images: [
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'venue', label: 'VENUE', descriptor: 'Space that holds the night.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    detail: 'Converted warehouse with arched windows and warm stone walls. Capacity for up to 120 guests.',
  },
  {
    id: 'dining', label: 'DINING', descriptor: 'Food worth lingering over.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    detail: 'Mediterranean sharing plates. Unhurried. Generous.',
  },
  {
    id: 'entertainment', label: 'ENTERTAINMENT', descriptor: 'Sound that shapes the room.',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
    detail: 'Live acoustic sets flowing into curated late-night music.',
  },
]

const palette = [
  { color: '#1C1208', label: 'Deep Espresso' },
  { color: '#C9A96E', label: 'Burnished Gold' },
  { color: '#7C5C3A', label: 'Warm Walnut' },
  { color: '#E8D5B0', label: 'Aged Linen' },
  { color: '#2D2018', label: 'Midnight Amber' },
]

const f = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function EventPreview() {
  const { navigate, eventPackage } = useApp()
  const [showFilmModal, setShowFilmModal] = useState(false)

  const event = eventPackage || { name: 'Your Curated Evening', tags: ['Curated', 'Personal', 'Distinctive'] }

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-20" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <div className="relative h-80 overflow-hidden" style={{ background: 'var(--card)' }}>
        <motion.img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
          alt="" className="w-full h-full object-cover opacity-60"
          initial={{ scale: 1.08 }} animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, transparent 40%, rgba(8,10,15,1) 100%)' }} />

        <button onClick={() => navigate('management')}
          className="absolute top-12 left-5 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={18} className="text-white" />
        </button>

        <motion.div {...f(0.3)} className="absolute bottom-8 left-0 right-0 text-center px-8">
          <p className="label-overline mb-2">Your Evening</p>
          <h1 className="font-display text-3xl font-light text-white leading-tight">{event.name}</h1>
        </motion.div>
      </div>

      <div className="px-6 space-y-10 pt-8">

        {/* Preview film CTA */}
        <motion.button {...f(0.1)} onClick={() => setShowFilmModal(true)} whileTap={{ scale: 0.98 }}
          className="w-full p-5 flex items-center gap-5 transition-all glass-card"
          style={{ borderRadius: 'var(--radius)' }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ border: '1px solid var(--primary)' }}>
            <Play size={16} style={{ color: 'var(--primary)', marginLeft: 2 }} />
          </motion.div>
          <div className="text-left">
            <p className="text-evo-text text-sm font-medium">Watch Your Event Preview</p>
            <p className="text-xs mt-0.5 font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              A curated preview assembled from your taste profile
            </p>
          </div>
        </motion.button>

        {/* Atmosphere collage */}
        <motion.div {...f(0.15)}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>{previewSections[0].label}</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previewSections[0].images.map((img, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2' : ''}`}
                style={{ borderRadius: 'var(--radius-sm)', height: 140, background: 'var(--card)' }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-lg font-light tracking-wide text-evo-text">{previewSections[0].descriptor}</p>
        </motion.div>

        {/* Venue / Dining / Entertainment */}
        {previewSections.slice(1).map((section, i) => (
          <motion.div key={section.id} {...f(0.2 + i * 0.07)}>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>{section.label}</p>
            <div className="overflow-hidden" style={{ borderRadius: 'var(--radius)', height: 200, background: 'var(--card)' }}>
              <img src={section.image} alt={section.label} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4">
              <p className="text-lg font-light text-evo-text">{section.descriptor}</p>
              <p className="text-sm mt-2 font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>{section.detail}</p>
            </div>
          </motion.div>
        ))}

        {/* Color palette */}
        <motion.div {...f(0.4)}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>PALETTE</p>
          <div className="flex gap-3 items-end">
            {palette.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className="w-full rounded-xl"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: p.color }}
                  initial={{ height: 0 }} animate={{ height: 48 + i * 8 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: [0.22,1,0.36,1] }}
                />
                <p className="text-[9px] text-center leading-tight" style={{ color: 'var(--text-dim)' }}>{p.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div {...f(0.45)} className="text-center pt-2">
          <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Your event is taking shape.</p>
          <motion.button onClick={() => navigate('management')} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-sm font-semibold tracking-[0.12em] uppercase transition-all"
            style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-accent)' }}>
            Back to My Event
          </motion.button>
        </motion.div>
      </div>

      {/* Film Modal */}
      <AnimatePresence>
        {showFilmModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
            style={{ background: 'var(--background)' }}>
            <button onClick={() => setShowFilmModal(false)}
              className="absolute top-12 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)' }}>
              <X size={18} className="text-evo-muted" />
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }} className="text-center max-w-xs w-full">
              <p className="label-overline mb-8">A preview of your evening</p>

              <div className="space-y-2 mb-10">
                {[
                  'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
                ].map((img, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.18, ease: [0.22,1,0.36,1] }}
                    className="w-full overflow-hidden" style={{ height: 80, borderRadius: 'var(--radius-sm)' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                <p className="font-display text-2xl font-light mb-3 text-evo-text">{event.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Full cinematic preview available when your event is fully booked.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
