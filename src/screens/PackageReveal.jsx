import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { DiscoBall, Cocktail, Speaker, Confetti, Microphone, StarIcon } from '../components/EvoEventIcons'

const CATEGORY_META = {
  venue:         { label: 'The Space',      tagline: 'Where the evening begins',    icon: '🏛️' },
  catering:      { label: 'The Table',      tagline: 'Food worth lingering over',   icon: '🍽️' },
  entertainment: { label: 'The Sound',      tagline: 'Music that moves the room',   icon: '🎵' },
  lighting:      { label: 'The Atmosphere', tagline: 'Light that shapes the mood',  icon: '✨' },
  decor:         { label: 'The Feeling',    tagline: 'Details that tell your story', icon: '🌸' },
}

// Floating background icons with fixed positions
const BG_ICONS = [
  { Component: DiscoBall,  style: { top: '8%',  left: '6%',  opacity: 0.35 }, delay: 0, ft: 'a' },
  { Component: Cocktail,   style: { top: '7%',  right: '8%', opacity: 0.3  }, delay: 0.4, ft: 'b' },
  { Component: Speaker,    style: { top: '42%', left: '3%',  opacity: 0.25 }, delay: 0.2, ft: 'a' },
  { Component: Confetti,   style: { top: '38%', right: '4%', opacity: 0.3  }, delay: 0.6, ft: 'b' },
  { Component: Microphone, style: { bottom: '18%', left: '7%', opacity: 0.28 }, delay: 0.3, ft: 'a' },
  { Component: StarIcon,   style: { bottom: '16%', right: '6%', opacity: 0.32 }, delay: 0.5, ft: 'b' },
]

export default function PackageReveal() {
  const { navigate, eventPackage } = useApp()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)
  const isScrolling = useRef(false)

  const sections = eventPackage?.sections || []

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isScrolling.current) return
    const el = scrollRef.current
    const w = el.offsetWidth
    const newIndex = Math.round(el.scrollLeft / w)
    if (newIndex !== activeIndex) setActiveIndex(Math.max(0, Math.min(sections.length - 1, newIndex)))
  }, [activeIndex, sections.length])

  const goTo = (index) => {
    if (!scrollRef.current) return
    isScrolling.current = true
    scrollRef.current.scrollTo({ left: index * scrollRef.current.offsetWidth, behavior: 'smooth' })
    setActiveIndex(index)
    setTimeout(() => { isScrolling.current = false }, 400)
  }

  if (!eventPackage) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  const section = sections[activeIndex]
  const meta = section ? (CATEGORY_META[section.id] || { label: section.label, tagline: '', icon: '⭐' }) : {}

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── Floating background icons ────────────────────────────────────── */}
      {BG_ICONS.map(({ Component, style, delay, ft }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: style.opacity, scale: 1 }}
          transition={{ delay: 0.3 + delay, duration: 0.6 }}
          className={ft === 'a' ? 'animate-float' : 'animate-float-b'}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            animationDelay: `${i * 0.4}s`,
            ...style,
            opacity: undefined,
          }}
        >
          <motion.div style={{ opacity: style.opacity }}>
            <Component size={44} />
          </motion.div>
        </motion.div>
      ))}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 24px 8px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.22em', color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}
        >
          EVO
        </motion.span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.06em' }}
        >
          {activeIndex === 0 ? 'גלול ימינה כדי לגלות את הספקים שלך' : 'ניתן להחליף ספקים בעמוד הבא'}
        </motion.p>
      </div>

      {/* ── Center circle + vendor info ──────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>

        {/* Large glowing circle */}
        <motion.div
          key={activeIndex}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            width: 240, height: 240,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(107,95,228,0.25)',
            boxShadow: '0 0 0 16px rgba(107,95,228,0.05), 0 0 0 32px rgba(107,95,228,0.025), 0 20px 60px rgba(107,95,228,0.15)',
          }}
        >
          {section?.image && (
            <img src={section.image} alt={section.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(44,32,22,0.1) 0%, rgba(44,32,22,0.4) 100%)' }} />
          {/* Category icon */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, opacity: 0.9,
          }}>
            {meta.icon}
          </div>
        </motion.div>

        {/* Vendor info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${activeIndex}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginTop: 28, padding: '0 32px' }}
          >
            {/* Category label */}
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'var(--primary)', marginBottom: 8,
            }}>
              {meta.label}
            </p>
            {/* Vendor name */}
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10 }}>
              {section?.vendor?.name}
            </h2>
            {/* Tagline */}
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
              {meta.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Hidden scroll container (handles swipe) ───────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          opacity: 0, // invisible — just for touch/scroll detection
          zIndex: 5,
        }}
      >
        {sections.map((_, i) => (
          <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: '100%' }} />
        ))}
      </div>

      {/* ── Section dots ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center',
          padding: '0 0 12px', position: 'relative', zIndex: 10,
        }}
      >
        {sections.map((s, i) => {
          const m = CATEGORY_META[s.id] || {}
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === activeIndex ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: i === activeIndex ? 'var(--primary)' : 'rgba(44,32,22,0.18)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              title={m.label}
            />
          )
        })}
      </motion.div>

      {/* ── Vendor mini-labels row ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '0 24px 12px', position: 'relative', zIndex: 10, flexWrap: 'wrap' }}>
        {sections.map((s, i) => {
          const m = CATEGORY_META[s.id] || { label: s.label }
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                fontSize: 11, fontWeight: 600,
                padding: '5px 12px', borderRadius: 9999,
                background: i === activeIndex ? 'rgba(107,95,228,0.12)' : 'transparent',
                color: i === activeIndex ? 'var(--primary)' : 'var(--text-muted)',
                border: i === activeIndex ? '1px solid rgba(107,95,228,0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
            >
              {m.label}
            </button>
          )
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          padding: '12px 24px 32px',
          background: 'rgba(245,240,232,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(44,32,22,0.06)',
          position: 'relative', zIndex: 10,
        }}
      >
        <motion.button
          onClick={() => navigate('summary')}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '16px', borderRadius: 9999,
            background: 'var(--primary)', color: '#fff',
            fontSize: 14, fontWeight: 600, letterSpacing: '0.08em',
            boxShadow: 'var(--shadow-accent)', border: 'none', cursor: 'pointer',
          }}
        >
          ראה פירוט מלא ומחירים →
        </motion.button>
      </motion.div>
    </div>
  )
}
