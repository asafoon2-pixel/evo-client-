import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, RefreshCw, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SwapSheet from '../components/SwapSheet'

const CATEGORY_META = {
  venue:         { label: 'The Space',      tagline: 'Where the evening begins' },
  catering:      { label: 'The Table',      tagline: 'Food worth lingering over' },
  entertainment: { label: 'The Sound',      tagline: 'Music that moves the room' },
  lighting:      { label: 'The Atmosphere', tagline: 'Light that shapes the mood' },
  decor:         { label: 'The Feeling',    tagline: 'Details that tell your story' },
}

const TUNE_OPTIONS = [
  { id: 'formal',    label: 'More formal' },
  { id: 'casual',    label: 'More casual' },
  { id: 'minimal',   label: 'More minimal' },
  { id: 'abundant',  label: 'More abundant' },
  { id: 'romantic',  label: 'More romantic' },
  { id: 'energetic', label: 'More energetic' },
]

function TuneSheet({ onClose }) {
  const [selected, setSelected] = useState(null)
  const { navigate } = useApp()
  return (
    <AnimatePresence>
      <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-6 pb-10 pt-6"
        style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border)' }} />
        <p className="text-[10px] font-semibold tracking-[0.28em] uppercase mb-1" style={{ color: 'var(--primary)' }}>Tune the Vibe</p>
        <p className="text-base font-light mb-5" style={{ color: 'var(--text-primary)' }}>What's not quite right?</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {TUNE_OPTIONS.map(o => (
            <motion.button key={o.id} onClick={() => setSelected(o.id)} whileTap={{ scale: 0.97 }}
              className="py-3 px-4 rounded-xl text-sm font-light transition-all"
              style={{
                border: `1px solid ${selected === o.id ? 'var(--primary)' : 'var(--border)'}`,
                color: selected === o.id ? 'var(--primary)' : 'var(--text-muted)',
                background: selected === o.id ? 'rgba(45,27,105,0.06)' : 'transparent',
              }}>
              {o.label}
            </motion.button>
          ))}
        </div>
        <motion.button onClick={() => { onClose(); navigate('building') }} disabled={!selected}
          whileTap={selected ? { scale: 0.97 } : {}}
          className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase rounded-full transition-all"
          style={{
            background: selected ? 'var(--primary)' : 'transparent',
            color: selected ? '#fff' : 'var(--primary)',
            border: selected ? 'none' : '1px solid var(--primary)',
            opacity: selected ? 1 : 0.4,
          }}>
          Apply &amp; Rebuild
        </motion.button>
        <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-center"
          style={{ color: 'var(--text-muted)' }}>Cancel</button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function PackageReveal() {
  const { navigate, eventPackage, openSwapSheet } = useApp()
  const [tuneOpen, setTuneOpen] = useState(false)

  if (!eventPackage) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        <motion.img
          src={eventPackage.sections?.[0]?.image || eventPackage.heroImage}
          alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.25) 0%, rgba(8,10,15,0.05) 40%, rgba(8,10,15,0.75) 100%)' }} />

        <button onClick={() => navigate('building')}
          className="absolute top-12 left-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <ArrowLeft size={18} className="text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-6 text-center">
          <p className="text-[10px] font-semibold tracking-[0.32em] uppercase mb-2" style={{ color: 'rgba(200,169,110,0.95)' }}>
            EVO Built This For You
          </p>
          <h1 className="font-display text-[28px] font-light text-white leading-tight">
            {eventPackage.name}
          </h1>
        </motion.div>
      </div>

      {/* Tags */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex gap-2 justify-center px-6 mt-5 mb-2 flex-wrap">
        {eventPackage.tags?.map(tag => (
          <span key={tag} className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(45,27,105,0.08)', color: 'var(--primary)', border: '1px solid rgba(45,27,105,0.15)' }}>
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Description */}
      {eventPackage.description && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-sm font-light text-center px-8 mt-3 mb-8 leading-relaxed"
          style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          {eventPackage.description}
        </motion.p>
      )}

      {/* Vendor cards */}
      <div className="px-6 space-y-4">
        {eventPackage.sections?.map((section, i) => {
          const meta = CATEGORY_META[section.id] || { label: section.label, tagline: '' }
          return (
            <motion.div key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

              {/* Image strip */}
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <motion.img src={section.image} alt={section.label}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.04 }} animate={{ scale: 1 }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.08 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.0) 30%, rgba(8,10,15,0.65) 100%)' }} />

                {/* Category label on image */}
                <div className="absolute top-3 left-4">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.3)' }}>
                    {meta.label}
                  </span>
                </div>

                {/* Vendor name on image bottom */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white text-base font-semibold">{section.vendor.name}</p>
                  {section.vendor.rating && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={10} style={{ color: '#C8A96E', fill: '#C8A96E' }} />
                      <span className="text-xs text-white opacity-70">{section.vendor.rating}</span>
                      {section.vendor.reviewCount && (
                        <span className="text-xs text-white opacity-50">· {section.vendor.reviewCount} reviews</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs font-light italic" style={{ color: 'var(--text-muted)' }}>{meta.tagline}</p>
                </div>
                <motion.button onClick={() => openSwapSheet(section.id)} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--elevated)' }}>
                  <RefreshCw size={10} /> Swap
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Closing note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="mx-6 mt-6 mb-4 p-5 rounded-2xl flex gap-3 items-start"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <Zap size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
        <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
          Every element here was chosen with intention — not just to fill a checklist, but to create a feeling. This is the version of your event that EVO believes in.
        </p>
      </motion.div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,245,247,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button onClick={() => navigate('summary')} whileTap={{ scale: 0.98 }}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase"
          style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}>
          Review vendors &amp; confirm →
        </motion.button>
        <button onClick={() => setTuneOpen(true)}
          className="w-full mt-2 py-2 text-sm text-center"
          style={{ color: 'var(--primary)' }}>
          Tune the vibe
        </button>
      </div>

      <SwapSheet />
      {tuneOpen && <TuneSheet onClose={() => setTuneOpen(false)} />}
    </div>
  )
}
