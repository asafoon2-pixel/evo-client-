// Enhanced by EVO Agent
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const BUILD_STEPS = [
  'Reading your taste profile',
  'Designing your atmosphere',
  'Selecting your venue',
  'Composing your table',
  'Finding your sound',
  'Balancing your budget',
]

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
]

export default function Building() {
  const { navigate, swipeResults, briefAnswers, buildPackage } = useApp()
  const [stepIndex, setStepIndex]   = useState(0)
  const [budgetPct, setBudgetPct]   = useState(0)
  const [bgIndex, setBgIndex]       = useState(0)
  const [showName, setShowName]     = useState(false)
  const [eventName, setEventName]   = useState('')
  const builtRef = useRef(false)

  useEffect(() => {
    if (builtRef.current) return
    builtRef.current = true

    const pkg = buildPackage(swipeResults, briefAnswers)
    setEventName(pkg.name)

    const stepInterval = setInterval(() => {
      setStepIndex(i => {
        const next = i + 1
        if (next >= BUILD_STEPS.length) { clearInterval(stepInterval); return i }
        return next
      })
    }, 620)

    const budgetInterval = setInterval(() => {
      setBudgetPct(p => {
        if (p >= 100) { clearInterval(budgetInterval); return 100 }
        return p + 3
      })
    }, 55)

    const bgInterval = setInterval(() => {
      setBgIndex(i => (i + 1) % BG_IMAGES.length)
    }, 2000)

    const nameTimer = setTimeout(() => setShowName(true), BUILD_STEPS.length * 620 + 300)
    const navTimer  = setTimeout(() => navigate('package'), BUILD_STEPS.length * 620 + 1800)

    return () => {
      clearInterval(stepInterval)
      clearInterval(budgetInterval)
      clearInterval(bgInterval)
      clearTimeout(nameTimer)
      clearTimeout(navTimer)
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-evo-black flex flex-col items-center justify-center overflow-hidden">
      {/* Crossfading background */}
      <AnimatePresence>
        <motion.img
          key={bgIndex}
          src={BG_IMAGES[bgIndex]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-evo-black/80 via-transparent to-evo-black/80" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-evo-border overflow-hidden">
        <motion.div
          className="h-full bg-evo-accent rounded-full"
          animate={{ width: `${budgetPct}%` }}
          transition={{ duration: 0.2, ease: 'linear' }}
        />
      </div>

      {/* Step counter */}
      <div className="absolute top-4 right-6 z-10">
        <p className="text-evo-dim text-xs tabular-nums">{Math.min(stepIndex + 1, BUILD_STEPS.length)} / {BUILD_STEPS.length}</p>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm w-full">
        <AnimatePresence mode="wait">
          {!showName ? (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Pulsing orb */}
              <div className="relative w-16 h-16 mb-12 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-evo-accent/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-evo-accent/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-evo-accent"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="text-white text-lg font-light tracking-wide"
                >
                  {BUILD_STEPS[stepIndex]}...
                </motion.p>
              </AnimatePresence>

              {/* Step dots */}
              <div className="mt-10 flex gap-2">
                {BUILD_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full bg-evo-accent"
                    animate={{
                      width: i <= stepIndex ? 18 : 4,
                      height: 4,
                      opacity: i <= stepIndex ? 1 : 0.2,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 64, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-px bg-evo-accent mb-8"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] tracking-[0.35em] uppercase text-evo-accent mb-5 font-medium"
              >
                EVO has built your event
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl font-light text-white leading-tight text-center"
              >
                {eventName}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
