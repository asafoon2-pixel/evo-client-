import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useApp } from '../context/AppContext'
import SwapSheet from '../components/SwapSheet'

// ── Phase constants ───────────────────────────────────────────────────────────
// 0 = black opening
// 1 = "EVO Built This For You" title
// 2..N = vendor reveals (one per section)
// N+1 = closing mosaic + CTA

// ── Cinematic word reveal ─────────────────────────────────────────────────────
function CinematicTitle({ lines, color = '#fff', delay = 0 }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {lines.map((line, li) => (
        <div key={li} className="flex gap-[0.18em] flex-wrap justify-center overflow-hidden">
          {line.split(' ').map((word, wi) => (
            <motion.span
              key={wi}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: delay + li * 0.3 + wi * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ display: 'inline-block', color, fontFamily: 'inherit' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Category meta ─────────────────────────────────────────────────────────────
const CATEGORY_META = {
  venue:         { overline: 'The Space',      tagline: 'Where your evening begins' },
  catering:      { overline: 'The Table',      tagline: 'Food worth lingering over' },
  entertainment: { overline: 'The Sound',      tagline: 'Music that moves the room' },
  lighting:      { overline: 'The Atmosphere', tagline: 'Light that shapes the mood' },
  decor:         { overline: 'The Feeling',    tagline: 'Details that tell your story' },
  photography:   { overline: 'The Memory',     tagline: 'Moments preserved forever' },
  bar:           { overline: 'The Pour',       tagline: 'Drinks to remember the night' },
  dj:            { overline: 'The Pulse',      tagline: 'The beat that never stops' },
}

// ── Full-screen vendor reveal ─────────────────────────────────────────────────
function VendorReveal({ section, index, total, onNext, isLast }) {
  const meta = CATEGORY_META[section.id] || { overline: section.label, tagline: '' }
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowDetails(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      onClick={onNext}
    >
      {/* Full-bleed image */}
      <motion.div className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}>
        <img src={section.image} alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.85) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />

      {/* Top: progress + overline */}
      <div className="relative z-10 px-6 pt-14 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: showDetails ? 1 : 0, x: showDetails ? 0 : -16 }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white opacity-70">
            {meta.overline}
          </p>
        </motion.div>

        {/* Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showDetails ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 20 : 6,
                background: i <= index ? '#fff' : 'rgba(255,255,255,0.3)',
              }} />
          ))}
        </motion.div>
      </div>

      {/* Center: dramatic vendor name */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-center">
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.4em' }}
                animate={{ opacity: 0.75, letterSpacing: '0.22em' }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-[10px] font-bold uppercase text-white mb-4">
                {meta.tagline}
              </motion.p>
              <h2 className="font-display text-[38px] sm:text-[46px] font-light text-white leading-tight" style={{ textShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
                {section.vendor.name}
              </h2>
              {section.vendor.rating && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex items-center justify-center gap-1.5 mt-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(section.vendor.rating) ? '#C8A96E' : 'none'} stroke="#C8A96E" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  <span className="text-xs text-white opacity-70 ml-1">{section.vendor.rating}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: description + tap hint */}
      <div className="relative z-10 px-6 pb-14">
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              {section.vendor.description && (
                <p className="text-sm font-light text-white opacity-75 text-center leading-relaxed mb-6"
                  style={{ lineHeight: 1.75 }}>
                  {section.vendor.description}
                </p>
              )}
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="text-center text-xs text-white opacity-50 tracking-widest uppercase">
                {isLast ? 'Tap to see the full picture' : 'Tap to continue'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Closing mosaic ────────────────────────────────────────────────────────────
function ClosingMosaic({ sections, eventPackage, onConfirm, onTune }) {
  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>

      {/* Mosaic grid background */}
      <div className="absolute inset-0 grid grid-cols-2" style={{ opacity: 0.45 }}>
        {sections.slice(0, 4).map((s, i) => (
          <div key={i} className="overflow-hidden">
            <motion.img src={s.image} alt="" className="w-full h-full object-cover"
              initial={{ scale: 1.1 }} animate={{ scale: 1 }}
              transition={{ duration: 4, delay: i * 0.15, ease: 'easeOut' }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.7) 0%, rgba(8,10,15,0.6) 40%, rgba(8,10,15,0.92) 75%, rgba(8,10,15,1) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-full px-6 pt-16 pb-10">

        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 h-px mb-8 mx-auto"
          style={{ background: '#C8A96E', transformOrigin: 'left' }} />

        {/* Main text */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[10px] font-semibold tracking-[0.4em] uppercase mb-4"
            style={{ color: '#C8A96E' }}>
            EVO Built This For You
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[36px] font-light text-white leading-tight mb-4">
            {eventPackage.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-wrap gap-2 justify-center">
            {eventPackage.tags?.map(tag => (
              <span key={tag} className="text-[11px] px-3 py-1 rounded-full text-white"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Vendor list */}
        <div className="space-y-2.5 mb-10">
          {sections.map((s, i) => {
            const meta = CATEGORY_META[s.id] || { overline: s.label }
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img src={s.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60 text-white">
                    {meta.overline}
                  </p>
                  <p className="text-sm font-medium text-white truncate">{s.vendor.name}</p>
                </div>
                {s.vendor.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#C8A96E" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span className="text-xs text-white opacity-60">{s.vendor.rating}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* EVO narrative */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="text-sm font-light text-center leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
          Every element here was chosen with intention — not just to fill a checklist, but to create a feeling. This is the version of your event that EVO believes in.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3">
          <button onClick={onConfirm}
            className="w-full py-4 text-sm font-semibold tracking-widest uppercase rounded-full transition-all"
            style={{ background: '#C8A96E', color: '#0A0A0A' }}>
            Review vendors &amp; confirm →
          </button>
          <button onClick={onTune}
            className="w-full py-3 text-sm tracking-wide text-center"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tune the vibe
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Tune sheet ────────────────────────────────────────────────────────────────
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
        className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-6"
        style={{ background: '#0F0F14', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: '#C8A96E' }}>Tune the Vibe</p>
        <p className="font-light mb-6 text-white">What's not quite right?</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TUNE_OPTIONS.map(o => (
            <motion.button key={o.id} onClick={() => setSelected(o.id)} whileTap={{ scale: 0.97 }}
              className="py-3 px-4 rounded-xl text-sm font-light transition-all"
              style={{
                border: `1px solid ${selected === o.id ? '#C8A96E' : 'rgba(255,255,255,0.12)'}`,
                color: selected === o.id ? '#C8A96E' : 'rgba(255,255,255,0.5)',
                background: selected === o.id ? 'rgba(200,169,110,0.1)' : 'transparent',
              }}>
              {o.label}
            </motion.button>
          ))}
        </div>
        <motion.button onClick={() => { onClose(); navigate('building') }}
          disabled={!selected}
          whileTap={selected ? { scale: 0.97 } : {}}
          className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase rounded-full transition-all"
          style={{
            background: selected ? '#C8A96E' : 'transparent',
            color: selected ? '#0A0A0A' : 'rgba(255,255,255,0.25)',
            border: selected ? 'none' : '1px solid rgba(255,255,255,0.15)',
          }}>
          Apply &amp; Rebuild
        </motion.button>
        <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-center"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Cancel</button>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Opening sequence ──────────────────────────────────────────────────────────
function OpeningSequence({ eventPackage, onDone }) {
  const [phase, setPhase] = useState(0)
  // phase 0: black + EVO mark
  // phase 1: title reveal
  // phase 2: done → hand off

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => onDone(), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col items-center justify-center"
      style={{ background: '#080A0F' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}>

      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.5 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(45,27,105,0.35) 0%, rgba(200,169,110,0.08) 45%, transparent 70%)' }} />

      {/* EVO wordmark */}
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.6em', scale: 0.9 }}
        animate={{ opacity: phase >= 0 ? 1 : 0, letterSpacing: '0.22em', scale: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-white font-display text-[13px] font-semibold tracking-[0.22em] uppercase mb-8">
        EVO
      </motion.div>

      {/* Main title */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div className="text-center px-8">
            <div className="overflow-hidden mb-2">
              <motion.p
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[11px] tracking-[0.42em] uppercase font-semibold"
                style={{ color: '#C8A96E' }}>
                Built This For You
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[40px] font-light text-white leading-tight">
                {eventPackage.name}
              </motion.h1>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-px mx-auto mt-6"
              style={{ background: '#C8A96E', transformOrigin: 'center' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 0.4 : 0 }}
        transition={{ delay: 1.5 }}
        onClick={onDone}
        className="absolute bottom-12 text-xs tracking-widest uppercase text-white">
        Skip intro
      </motion.button>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PackageReveal() {
  const { navigate, eventPackage, openSwapSheet } = useApp()
  const [phase, setPhase] = useState('opening')  // opening | vendor-N | closing
  const [vendorIndex, setVendorIndex] = useState(0)
  const [tuneOpen, setTuneOpen] = useState(false)

  if (!eventPackage) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: '#080A0F' }}>
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.6 }}
        className="text-white text-xs tracking-[0.3em] uppercase">Building your event…</motion.div>
    </div>
  )

  const sections = eventPackage.sections || []

  const goNext = () => {
    if (vendorIndex < sections.length - 1) {
      setVendorIndex(i => i + 1)
    } else {
      setPhase('closing')
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#080A0F' }}>

      {/* Opening */}
      <AnimatePresence>
        {phase === 'opening' && (
          <OpeningSequence
            key="opening"
            eventPackage={eventPackage}
            onDone={() => { setVendorIndex(0); setPhase('vendor') }}
          />
        )}
      </AnimatePresence>

      {/* Vendor reveals */}
      <AnimatePresence mode="wait">
        {phase === 'vendor' && sections[vendorIndex] && (
          <VendorReveal
            key={`vendor-${vendorIndex}`}
            section={sections[vendorIndex]}
            index={vendorIndex}
            total={sections.length}
            onNext={goNext}
            isLast={vendorIndex === sections.length - 1}
          />
        )}
      </AnimatePresence>

      {/* Closing mosaic */}
      <AnimatePresence>
        {phase === 'closing' && (
          <ClosingMosaic
            key="closing"
            sections={sections}
            eventPackage={eventPackage}
            onConfirm={() => navigate('summary')}
            onTune={() => setTuneOpen(true)}
          />
        )}
      </AnimatePresence>

      <SwapSheet />
      {tuneOpen && <TuneSheet onClose={() => setTuneOpen(false)} />}
    </div>
  )
}
