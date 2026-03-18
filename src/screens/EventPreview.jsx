// Enhanced by EVO Agent
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const previewSections = [
  {
    id: 'atmosphere',
    label: 'ATMOSPHERE',
    descriptor: 'Warm. Textured. Intimate.',
    images: [
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'venue',
    label: 'VENUE',
    descriptor: 'Space that holds the night.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    detail: 'Converted warehouse with arched windows and warm stone walls. Capacity for up to 120 guests.',
  },
  {
    id: 'dining',
    label: 'DINING',
    descriptor: 'Food worth lingering over.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    detail: 'Mediterranean sharing plates. Unhurried. Generous.',
  },
  {
    id: 'entertainment',
    label: 'ENTERTAINMENT',
    descriptor: 'Sound that shapes the room.',
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

export default function EventPreview() {
  const { navigate, eventPackage } = useApp()
  const [showFilmModal, setShowFilmModal] = useState(false)

  const event = eventPackage || {
    name: 'Your Curated Evening',
    tags: ['Curated', 'Personal', 'Distinctive'],
  }

  return (
    <div className="w-full min-h-screen bg-evo-black overflow-y-auto pb-20">
      {/* Hero */}
      <div className="relative h-80 bg-evo-card overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-evo-black" />

        {/* Back button */}
        <button
          onClick={() => navigate('management')}
          className="absolute top-12 left-5 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        {/* Event name overlay */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-2">Your Evening</p>
          <h1 className="text-3xl font-light text-white leading-tight">{event.name}</h1>
        </div>
      </div>

      <div className="px-6 space-y-10 pt-8">
        {/* Preview film CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowFilmModal(true)}
          className="w-full bg-evo-card rounded-2xl border border-evo-border p-5 flex items-center gap-5 hover:border-evo-accent/30 transition-all active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-full border border-evo-accent flex items-center justify-center shrink-0">
            <Play size={16} className="text-evo-accent ml-0.5" />
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-medium">Watch Your Event Preview</p>
            <p className="text-evo-muted text-xs mt-0.5 font-light leading-relaxed">
              A curated preview assembled from your taste profile
            </p>
          </div>
        </motion.button>

        {/* Atmosphere collage */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-evo-muted mb-4">
            {previewSections[0].label}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previewSections[0].images.map((img, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden bg-evo-card ${i === 0 ? 'col-span-2 row-span-1' : ''}`}
                style={{ height: 140 }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-white text-lg font-light tracking-wide">
            {previewSections[0].descriptor}
          </p>
        </motion.div>

        {/* Venue section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-evo-muted mb-4">
            {previewSections[1].label}
          </p>
          <div className="rounded-2xl overflow-hidden bg-evo-card" style={{ height: 200 }}>
            <img
              src={previewSections[1].image}
              alt="Venue"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <p className="text-white text-lg font-light">{previewSections[1].descriptor}</p>
            <p className="text-evo-muted text-sm mt-2 font-light leading-relaxed">
              {previewSections[1].detail}
            </p>
          </div>
        </motion.div>

        {/* Dining section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-evo-muted mb-4">
            {previewSections[2].label}
          </p>
          <div className="rounded-2xl overflow-hidden bg-evo-card" style={{ height: 200 }}>
            <img
              src={previewSections[2].image}
              alt="Dining"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <p className="text-white text-lg font-light">{previewSections[2].descriptor}</p>
            <p className="text-evo-muted text-sm mt-2 font-light leading-relaxed">
              {previewSections[2].detail}
            </p>
          </div>
        </motion.div>

        {/* Entertainment section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-evo-muted mb-4">
            {previewSections[3].label}
          </p>
          <div className="rounded-2xl overflow-hidden bg-evo-card" style={{ height: 200 }}>
            <img
              src={previewSections[3].image}
              alt="Entertainment"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <p className="text-white text-lg font-light">{previewSections[3].descriptor}</p>
            <p className="text-evo-muted text-sm mt-2 font-light leading-relaxed">
              {previewSections[3].detail}
            </p>
          </div>
        </motion.div>

        {/* Color palette */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-evo-muted mb-4">PALETTE</p>
          <div className="flex gap-3 items-end">
            {palette.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full rounded-xl border border-white/5"
                  style={{
                    height: 48 + i * 8,
                    backgroundColor: p.color,
                  }}
                />
                <p className="text-evo-dim text-[9px] text-center leading-tight">{p.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-center pt-2"
        >
          <p className="text-evo-muted text-sm font-light mb-6 leading-relaxed">
            Your event is taking shape.
          </p>
          <button
            onClick={() => navigate('management')}
            className="w-full py-4 rounded-full border border-evo-accent text-evo-accent text-sm font-medium tracking-[0.12em] uppercase hover:bg-evo-accent hover:text-black transition-all duration-300"
          >
            Back to My Event
          </button>
        </motion.div>
      </div>

      {/* Film Modal */}
      {showFilmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center px-8"
        >
          <button
            onClick={() => setShowFilmModal(false)}
            className="absolute top-12 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
          >
            <X size={18} className="text-white" />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-xs"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-8">
              A preview of your evening
            </p>

            {/* Simulated film strips */}
            <div className="space-y-2 mb-10">
              {[
                'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  className="w-full rounded-xl overflow-hidden"
                  style={{ height: 80 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-white text-2xl font-light mb-3">{event.name}</p>
              <p className="text-evo-muted text-xs leading-relaxed">
                Full cinematic preview available when your event is fully booked.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
