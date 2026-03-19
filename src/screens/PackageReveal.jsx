// Enhanced by EVO Agent
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Zap, AlertCircle, Star, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SwapSheet from '../components/SwapSheet'
import Badge from '../components/ui/Badge'

const TUNE_OPTIONS = [
  { id: 'formal', label: 'More formal' },
  { id: 'casual', label: 'More casual' },
  { id: 'minimal', label: 'More minimal' },
  { id: 'abundant', label: 'More abundant' },
  { id: 'romantic', label: 'More romantic' },
  { id: 'energetic', label: 'More energetic' },
]

function TuneSheet({ onClose }) {
  const [selected, setSelected] = useState(null)
  const { navigate } = useApp()

  const handleApply = () => {
    onClose()
    navigate('building')
  }

  return (
    <AnimatePresence>
      <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-evo-card rounded-t-3xl border-t border-evo-border px-6 pb-10 pt-6">
        <div className="w-10 h-1 bg-evo-border rounded-full mx-auto mb-6" />
        <p className="text-xs tracking-[0.25em] uppercase text-evo-accent mb-2">Tune the Vibe</p>
        <p className="text-white font-light mb-6">What's not quite right?</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TUNE_OPTIONS.map(o => (
            <motion.button key={o.id} onClick={() => setSelected(o.id)} whileTap={{ scale: 0.97 }}
              className={`py-3 px-4 rounded-xl border text-sm font-light transition-all duration-200 ${selected === o.id ? 'border-evo-accent text-evo-accent bg-evo-accent/8' : 'border-evo-border text-evo-muted hover:text-white hover:border-evo-border/70'}`}>
              {o.label}
            </motion.button>
          ))}
        </div>
        <motion.button onClick={handleApply} disabled={!selected} whileTap={selected ? { scale: 0.97 } : {}}
          className="w-full py-3.5 rounded-full bg-evo-accent text-black text-sm font-semibold tracking-wider uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B8946A]">
          Apply &amp; Rebuild
        </motion.button>
        <button onClick={onClose} className="w-full mt-3 py-2 text-evo-muted text-sm text-center hover:text-white transition-colors">
          Cancel
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function PackageReveal() {
  const { navigate, eventPackage, openSwapSheet, totalPrice, depositAmount } = useApp()
  const [tuneOpen, setTuneOpen] = useState(false)

  if (!eventPackage) {
    navigate('building')
    return null
  }

  const formatPrice = n => `₪${n.toLocaleString()}`

  return (
    <div className="w-full min-h-screen bg-evo-black overflow-y-auto pb-32">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '70vw', maxHeight: 380, minHeight: 260 }}>
        <motion.img
          src={eventPackage.heroImage} alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.08 }} animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-evo-black" />

        <button onClick={() => navigate('building')}
          className="absolute top-12 left-5 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all active:scale-95">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-6 left-0 right-0 text-center px-8"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-evo-accent mb-2 font-medium">EVO Built This For You</p>
          <h1 className="text-2xl sm:text-3xl font-light text-white leading-tight">{eventPackage.name}</h1>
        </motion.div>
      </div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 justify-center px-6 mt-5 mb-6 flex-wrap"
      >
        {eventPackage.tags.map(tag => (
          <Badge key={tag} label={tag} variant="neutral" size="sm" />
        ))}
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-evo-muted text-sm font-light leading-relaxed text-center px-8 mb-10"
      >
        {eventPackage.description}
      </motion.p>

      {/* Sections */}
      <div className="space-y-0">
        {eventPackage.sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Section image */}
            <div className="relative overflow-hidden mx-6 rounded-2xl mb-5" style={{ height: 220 }}>
              <img src={section.image} alt={section.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm text-evo-accent border border-evo-accent/30 px-3 py-1.5 rounded-full">
                  {section.label}
                </span>
              </div>
            </div>

            {/* Vendor info */}
            <div className="px-6 mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-evo-muted text-xs font-light italic mb-1">{section.tagline}</p>
                  <h3 className="text-white text-xl font-light">{section.vendor.name}</h3>
                  <p className="text-evo-muted text-sm mt-2 leading-relaxed font-light">{section.vendor.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-evo-accent text-sm font-semibold">{formatPrice(section.vendor.price)}</span>
                    {section.vendor.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-evo-accent fill-evo-accent" />
                        <span className="text-evo-muted text-xs">{section.vendor.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap button */}
                <motion.button
                  onClick={() => openSwapSheet(section.id)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 text-evo-muted text-xs tracking-wide hover:text-white transition-all mt-1 shrink-0 border border-evo-border hover:border-evo-accent/50 rounded-full px-3 py-1.5 bg-evo-elevated hover:bg-evo-accent/5"
                >
                  <RefreshCw size={11} />
                  Swap
                </motion.button>
              </div>
            </div>

            {/* Constraint card */}
            {section.constraint && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 + 0.15 }}
                className="mx-6 mb-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start"
              >
                <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs tracking-widest uppercase text-amber-400 mb-1">EVO Note</p>
                  <p className="text-evo-muted text-xs font-light leading-relaxed">{section.constraint.message}</p>
                </div>
              </motion.div>
            )}

            {i < eventPackage.sections.length - 1 && (
              <div className="mx-6 h-px bg-evo-border mb-10 mt-2" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Budget summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mx-6 mt-10 bg-evo-card rounded-2xl border border-evo-border p-5"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-evo-muted mb-4">Package Summary</p>
        {eventPackage.sections.map(s => (
          <div key={s.id} className="flex justify-between py-2.5 border-b border-evo-border/40 last:border-0">
            <span className="text-evo-muted text-xs">{s.label}</span>
            <span className="text-white text-xs font-medium">{formatPrice(s.vendor.price)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-3 border-t border-evo-border">
          <span className="text-white text-sm font-medium">Total Event Value</span>
          <span className="text-white text-lg font-light">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-evo-muted text-xs">Deposit to secure (20%)</span>
          <span className="text-evo-accent text-sm font-semibold">{formatPrice(depositAmount)}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-evo-border flex items-start gap-2">
          <Zap size={12} className="text-evo-accent shrink-0 mt-0.5" />
          <p className="text-evo-dim text-xs leading-relaxed font-light">
            EVO handles all vendor payments. You pay once — we coordinate everything.
          </p>
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-evo-black/95 backdrop-blur-md border-t border-evo-border px-6 py-4 z-30">
        <motion.button
          onClick={() => navigate('secure')}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full bg-evo-accent text-black text-sm font-semibold tracking-wider uppercase shadow-[0_4px_24px_rgba(201,169,110,0.3)] hover:bg-[#B8946A] transition-all mb-3"
        >
          Secure This Event — {formatPrice(depositAmount)}
        </motion.button>
        <button onClick={() => setTuneOpen(true)}
          className="w-full py-2 text-evo-muted text-sm tracking-wide text-center hover:text-white transition-colors">
          Tune the vibe
        </button>
      </div>

      <SwapSheet />
      {tuneOpen && <TuneSheet onClose={() => setTuneOpen(false)} />}
    </div>
  )
}
