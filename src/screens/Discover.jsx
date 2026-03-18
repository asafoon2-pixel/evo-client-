// Enhanced by EVO Agent
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Heart, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { swipeCards } from '../data/index'
import SwipeCard from '../components/SwipeCard'

export default function Discover() {
  const { navigate, addSwipe } = useApp()
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
    navigate('building')
  }, [isDone, navigate])

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
    <div className="relative w-full h-full min-h-screen flex flex-col bg-evo-black overflow-hidden">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('brief')}
          className="flex items-center gap-2 text-evo-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm tracking-wide">Back</span>
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
                className="absolute inset-0 rounded-3xl bg-evo-card border border-evo-border flex flex-col items-center justify-center p-8 text-center z-20"
              >
                <div className="w-10 h-10 rounded-full bg-evo-accent/10 border border-evo-accent/30 flex items-center justify-center mb-6">
                  <span className="text-evo-accent text-lg font-light">E</span>
                </div>
                <p className="text-xs tracking-[0.25em] uppercase text-evo-accent mb-4">
                  EVO is learning
                </p>
                <p className="text-white text-xl font-light leading-relaxed">
                  Your taste is taking shape.
                </p>
                <p className="text-evo-muted text-sm mt-3 leading-relaxed">
                  Keep going — the full picture emerges at the end.
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
                <div className="w-3 h-3 rounded-full bg-evo-accent mb-6 animate-pulse" />
                <p className="text-white text-lg font-light tracking-wide">
                  Building your profile...
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
            className="w-16 h-16 rounded-full border border-evo-border bg-evo-card flex items-center justify-center hover:border-white/30 transition-all disabled:opacity-30"
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
      </div>
    </div>
  )
}
