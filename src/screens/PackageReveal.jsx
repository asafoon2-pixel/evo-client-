import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Zap, AlertCircle, Star, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SwapSheet from '../components/SwapSheet'
import Badge from '../components/ui/Badge'

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
        className="fixed inset-0 z-40 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-6"
        style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border)', boxShadow: '0 -4px 24px rgba(45,27,105,0.10)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border)' }} />
        <p className="label-overline mb-2">Tune the Vibe</p>
        <p className="font-light mb-6" style={{ color: 'var(--text-primary)' }}>What's not quite right?</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TUNE_OPTIONS.map(o => (
            <motion.button key={o.id} onClick={() => setSelected(o.id)} whileTap={{ scale: 0.97 }}
              className="py-3 px-4 rounded-xl text-sm font-light transition-all duration-200"
              style={{
                border:     `1px solid ${selected === o.id ? 'var(--primary)' : 'var(--border)'}`,
                color:      selected === o.id ? 'var(--primary)' : 'var(--text-muted)',
                background: selected === o.id ? 'var(--primary-dim)' : 'transparent',
              }}>
              {o.label}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={() => { onClose(); navigate('building') }}
          disabled={!selected}
          whileTap={selected ? { scale: 0.97 } : {}}
          className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: selected ? 'var(--primary)' : 'transparent',
            color: selected ? '#000' : 'var(--primary)',
            border: selected ? 'none' : '1px solid var(--primary)',
            opacity: selected ? 1 : 0.35,
            boxShadow: selected ? 'var(--shadow-accent)' : 'none',
          }}>
          Apply &amp; Rebuild
        </motion.button>
        <button onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-center transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          Cancel
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function PackageReveal() {
  const { navigate, eventPackage, openSwapSheet, totalPrice, depositAmount } = useApp()
  const [tuneOpen, setTuneOpen] = useState(false)

  if (!eventPackage) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  const formatPrice = n => `₪${n.toLocaleString()}`

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '70vw', maxHeight: 380, minHeight: 260 }}>
        <motion.img
          src={eventPackage.heroImage} alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.08 }} animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.1) 40%, rgba(8,10,15,1) 100%)' }} />

        <button onClick={() => navigate('building')}
          className="absolute top-12 left-5 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={18} className="text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-6 left-0 right-0 text-center px-8"
        >
          <p className="label-overline mb-2">EVO Built This For You</p>
          <h1 className="font-display text-[28px] sm:text-[34px] font-light text-white leading-tight">{eventPackage.name}</h1>
        </motion.div>
      </div>

      {/* Tags */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex gap-2 justify-center px-6 mt-5 mb-6 flex-wrap">
        {eventPackage.tags.map(tag => <Badge key={tag} label={tag} variant="neutral" size="sm" />)}
      </motion.div>

      {/* Description */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-sm font-light leading-relaxed text-center px-8 mb-10"
        style={{ color: 'var(--text-muted)' }}>
        {eventPackage.description}
      </motion.p>

      {/* Sections */}
      <div className="space-y-0">
        {eventPackage.sections.map((section, i) => (
          <motion.div key={section.id}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}>

            {/* Section image */}
            <div className="relative overflow-hidden mx-6 mb-5" style={{ height: 220, borderRadius: 'var(--radius)' }}>
              <img src={section.image} alt={section.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,15,0.85) 0%, transparent 50%)' }} />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'var(--primary)', border: '1px solid rgba(200,169,110,0.3)' }}>
                  {section.label}
                </span>
              </div>
            </div>

            {/* Vendor info */}
            <div className="px-6 mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-light italic mb-1" style={{ color: 'var(--text-muted)' }}>{section.tagline}</p>
                  <h3 className="font-display text-[22px] font-light" style={{ color: 'var(--text-primary)' }}>{section.vendor.name}</h3>
                  <p className="text-sm mt-2 leading-relaxed font-light" style={{ color: 'var(--text-muted)' }}>{section.vendor.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{formatPrice(section.vendor.price)}</span>
                    {section.vendor.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={11} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{section.vendor.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button onClick={() => openSwapSheet(section.id)} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 text-xs tracking-wide transition-all mt-1 shrink-0 px-3 py-1.5 rounded-full"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--elevated)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.5)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <RefreshCw size={11} />
                  Swap
                </motion.button>
              </div>
            </div>

            {/* Constraint card */}
            {section.constraint && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 + 0.15 }}
                className="mx-6 mb-4 p-4 rounded-[16px] flex gap-3 items-start"
                style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#FBBF24' }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#FBBF24' }}>EVO Note</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>{section.constraint.message}</p>
                </div>
              </motion.div>
            )}

            {i < eventPackage.sections.length - 1 && (
              <div className="mx-6 h-px mb-10 mt-2" style={{ background: 'var(--border)' }} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Budget summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="mx-6 mt-10 p-5" style={{ borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
        <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>Package Summary</p>
        {eventPackage.sections.map(s => (
          <div key={s.id} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPrice(s.vendor.price)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Event Value</span>
          <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Deposit to secure (20%)</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{formatPrice(depositAmount)}</span>
        </div>
        <div className="mt-4 pt-4 flex items-start gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <Zap size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
          <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            EVO handles all vendor payments. You pay once — we coordinate everything.
          </p>
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,245,247,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button onClick={() => navigate('secure')} whileTap={{ scale: 0.98 }}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all mb-3"
          style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-accent)' }}>
          Secure This Event — {formatPrice(depositAmount)}
        </motion.button>
        <button onClick={() => setTuneOpen(true)}
          className="w-full py-2 text-sm tracking-wide text-center transition-colors"
          style={{ color: 'var(--primary)' }}>
          Tune the vibe
        </button>
      </div>

      <SwapSheet />
      {tuneOpen && <TuneSheet onClose={() => setTuneOpen(false)} />}
    </div>
  )
}
