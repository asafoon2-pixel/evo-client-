import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ArrowLeft, X, Heart, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { swipeCards } from '../data/index'
import SwipeCard from '../components/SwipeCard'

export default function Discover() {
  const { navigate, addSwipe } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedCards, setSwipedCards] = useState([])
  const [showInsight, setShowInsight] = useState(false)
  const [insightShown, setInsightShown] = useState(false)
  const [pendingSwipe, setPendingSwipe] = useState(null)
  const insightTimerRef = useRef(null)

  const handleSwipe = (direction, card) => {
    addSwipe(card, direction)
    setSwipedCards(prev => [...prev, card])

    const nextIndex = currentIndex + 1

    if (nextIndex === 6 && !insightShown) {
      setShowInsight(true)
      setInsightShown(true)
      insightTimerRef.current = setTimeout(() => {
        setShowInsight(false)
        setCurrentIndex(nextIndex)
      }, 2200)
    } else if (nextIndex >= swipeCards.length) {
      setTimeout(() => {
        navigate('brief')
      }, 400)
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  const handleButtonSwipe = (direction) => {
    if (currentIndex >= swipeCards.length) return
    setPendingSwipe({ direction, card: swipeCards[currentIndex] })
  }

  useEffect(() => {
    if (pendingSwipe) {
      handleSwipe(pendingSwipe.direction, pendingSwipe.card)
      setPendingSwipe(null)
    }
  }, [pendingSwipe])

  useEffect(() => {
    return () => {
      if (insightTimerRef.current) clearTimeout(insightTimerRef.current)
    }
  }, [])

  const visibleCards = swipeCards.slice(currentIndex, currentIndex + 3)

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col bg-evo-black overflow-hidden">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('entry')}
          className="flex items-center gap-2 text-evo-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm tracking-wide">Discover</span>
        </button>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5">
          {swipeCards.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'w-2 h-2 bg-evo-accent'
                  : i === currentIndex
                  ? 'w-2.5 h-2.5 bg-white'
                  : 'w-1.5 h-1.5 bg-evo-dim'
              }`}
            />
          ))}
        </div>

        <span className="text-sm text-evo-muted tabular-nums">
          {Math.min(currentIndex + 1, swipeCards.length)} / {swipeCards.length}
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

          {!showInsight && visibleCards.length > 0 && (
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

          {!showInsight && visibleCards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-evo-muted text-sm tracking-wide">Building your profile...</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="relative z-20 flex flex-col items-center pb-12 pt-6">
        <div className="flex items-center gap-6">
          {/* Pass button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('left')}
            disabled={showInsight || currentIndex >= swipeCards.length}
            className="w-16 h-16 rounded-full border border-evo-border bg-evo-card flex items-center justify-center hover:border-white/30 transition-all disabled:opacity-30"
          >
            <X size={22} className="text-white" />
          </motion.button>

          {/* Undo */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-evo-border/50 bg-evo-surface flex items-center justify-center opacity-40"
            disabled
          >
            <RotateCcw size={14} className="text-evo-muted" />
          </motion.button>

          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('right')}
            disabled={showInsight || currentIndex >= swipeCards.length}
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
