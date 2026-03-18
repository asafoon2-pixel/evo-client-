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
      setBudgetPct(p => Math.min(p + 4, 100))
    }, 60)

    const bgInterval = setInterval(() => {
      setBgIndex(i => (i + 1) % BG_IMAGES.length)
    }, 2000)

    const nameTimer = setTimeout(() => setShowName(true), BUILD_STEPS.length * 620 + 300)
    const navTimer  = setTimeout(() => navigate('package'), BUILD_STEPS.length * 620 + 1600)

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
          animate={{ opacity: 0.08 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-evo-black/70 via-transparent to-evo-black/70" />

      {/* Budget bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-evo-border">
        <motion.div
          className="h-full bg-evo-accent"
          style={{ width: `${budgetPct}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm w-full">
        <AnimatePresence mode="wait">
          {!showName ? (
            <motion.div
              key="building"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full border border-evo-accent/30 bg-evo-accent/5 flex items-center justify-center mb-10">
                <motion.div
                  className="w-3 h-3 rounded-full bg-evo-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-white text-lg font-light tracking-wide"
                >
                  {BUILD_STEPS[stepIndex]}...
                </motion.p>
              </AnimatePresence>

              <div className="mt-10 flex gap-2">
                {BUILD_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full bg-evo-accent"
                    animate={{ width: i <= stepIndex ? 16 : 4, height: 4, opacity: i <= stepIndex ? 1 : 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 56, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-px bg-evo-accent mb-8"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-5"
              >
                EVO has built your event
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
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
