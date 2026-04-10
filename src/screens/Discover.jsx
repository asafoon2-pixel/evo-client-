// Enhanced by EVO Agent
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Heart, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { swipeCards } from '../data/index'
import SwipeCard from '../components/SwipeCard'

export default function Discover() {
  const { navigate, addSwipe, buildPackage, swipeResults, briefAnswers } = useApp()
  const [swipedCount, setSwipedCount] = useState(0)
  const [showInsight, setShowInsight] = useState(false)
  const insightShownRef = useRef(false)
  const navigatingRef   = useRef(false)

  const isDone       = swipedCount >= swipeCards.length
  const visibleCards = swipeCards.slice(swipedCount, swipedCount + 3)

  // ── Navigate when all cards are done ────────────────────────────────────
  useEffect(() => {
    if (!isDone) return
    if (navigatingRef.current) return
    navigatingRef.current = true
    buildPackage(swipeResults, briefAnswers)
    navigate('building')
  }, [isDone, navigate, buildPackage, swipeResults, briefAnswers])

  // ── Show mid-point insight ───────────────────────────────────────────────
  useEffect(() => {
    if (swipedCount !== 6) return
    if (insightShownRef.current) return
    insightShownRef.current = true
    setShowInsight(true)
    const timer = setTimeout(() => setShowInsight(false), 2200)
    return () => clearTimeout(timer)
  }, [swipedCount])

  // ── Core swipe handler (called by SwipeCard drag OR buttons) ─────────────
  const handleSwipe = useCallback((direction, card) => {
    addSwipe(card, direction)
    setSwipedCount(prev => prev + 1)
  }, [addSwipe])

  // ── Button tap handler ───────────────────────────────────────────────────
  const handleButtonSwipe = (direction) => {
    if (showInsight || isDone) return
    const card = swipeCards[swipedCount]
    if (card) handleSwipe(direction, card)
  }

  return (
    <div dir="rtl" className="relative w-full h-full min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('brief')}
          className="flex items-center gap-2 transition-colors" style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={18} style={{ transform: 'scaleX(-1)' }} />
          <span className="text-sm tracking-wide">חזור</span>
        </button>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5">
          {swipeCards.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < swipedCount
                  ? 'w-2 h-2 bg-evo-accent'
                  : i === swipedCount
                  ? 'w-2.5 h-2.5 bg-white'
                  : 'w-1.5 h-1.5 bg-evo-dim'
              }`}
            />
          ))}
        </div>

        <span className="text-sm text-evo-muted tabular-nums">
          {Math.min(swipedCount + 1, swipeCards.length)} / {swipeCards.length}
        </span>
      </div>

      {/* Explainer heading */}
      <div className="relative z-10 px-6 mb-4">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          בחר את סגנון האירוע שלך
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 6 }}>
          החלק ימינה על ויברציות שמתאימות לחזון שלך. נשתמש בזה כדי להמליץ על הספקים המתאימים לאירוע שלך.
        </p>
      </div>

      {/* Card stack area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-sm" style={{ height: 480 }}>
          <AnimatePresence>
            {showInsight && (
              <motion.div
                key="insight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 text-center z-20" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(107,95,228,0.1)', border: '1px solid rgba(107,95,228,0.3)' }}>
                  <span className="text-lg font-light" style={{ color: 'var(--primary)' }}>E</span>
                </div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--primary)' }}>
                  EVO לומד
                </p>
                <p className="text-xl font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  הטעם שלך מתגבש.
                </p>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  המשך — התמונה המלאה מתגלה בסוף.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!showInsight && !isDone && visibleCards.length > 0 && (
            <>
              {[...visibleCards].reverse().map((card, reverseIndex) => {
                const stackIndex = visibleCards.length - 1 - reverseIndex
                const isTop = stackIndex === 0
                return (
                  <SwipeCard
                    key={card.id}
                    card={card}
                    onSwipe={handleSwipe}
                    isTop={isTop}
                    stackIndex={stackIndex}
                  />
                )
              })}
            </>
          )}

          {!showInsight && isDone && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-3 h-3 rounded-full mb-6 animate-pulse" style={{ background: 'var(--primary)' }} />
                <p className="text-lg font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  בונה את הפרופיל שלך...
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="relative z-20 flex flex-col items-center pb-12 pt-6">
        <div className="flex items-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('left')}
            disabled={showInsight || isDone}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-30" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <X size={22} className="text-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-evo-border/50 bg-evo-surface flex items-center justify-center opacity-40"
            disabled
          >
            <RotateCcw size={14} className="text-evo-muted" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('right')}
            disabled={showInsight || isDone}
            className="w-16 h-16 rounded-full border border-evo-accent bg-evo-card flex items-center justify-center hover:bg-evo-accent/10 transition-all disabled:opacity-30"
          >
            <Heart size={22} className="text-evo-accent" />
          </motion.button>
        </div>

        <p className="mt-5 text-evo-dim text-xs tracking-widest uppercase">
          Swipe or tap
        </p>

        <button
          onClick={() => navigate('categories')}
          className="mt-4 text-evo-muted text-xs tracking-widest uppercase underline underline-offset-4 opacity-50 hover:opacity-80 transition-opacity"
        >
          Skip
        </button>
      </div>
    </div>
  )
}
