import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DiscoBall, Cocktail, Speaker, Confetti, Microphone, StarIcon } from './EvoEventIcons'

const ICONS = [
  { Component: DiscoBall,   x: '12%', y: '20%', delay: 0.1, float: 'a' },
  { Component: Cocktail,    x: '72%', y: '15%', delay: 0.2, float: 'b' },
  { Component: Speaker,     x: '7%',  y: '56%', delay: 0.15, float: 'a' },
  { Component: Confetti,    x: '76%', y: '54%', delay: 0.25, float: 'b' },
  { Component: Microphone,  x: '18%', y: '72%', delay: 0.2,  float: 'a' },
  { Component: StarIcon,    x: '66%', y: '72%', delay: 0.1,  float: 'b' },
]

export default function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2000)
    const t2 = setTimeout(onDone, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#F5F0E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {ICONS.map(({ Component, x, y, delay, float: ft }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={ft === 'a' ? 'animate-float' : 'animate-float-b'}
              style={{
                position: 'absolute', left: x, top: y,
                animationDelay: `${i * 0.3}s`,
                filter: 'drop-shadow(0 4px 12px rgba(44,32,22,0.08))',
              }}
            >
              <Component />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-center select-none"
          >
            <div className="animate-evo-jump" style={{
              fontSize: 80, fontWeight: 800, letterSpacing: '0.18em',
              color: '#2C2016', fontFamily: "'Poppins', 'Heebo', sans-serif", lineHeight: 1,
            }}>
              EVO
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '0.28em',
                color: 'rgba(44,32,22,0.4)', marginTop: 10, textTransform: 'uppercase',
              }}
            >
              Your Event. Produced.
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
