import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Illustrated SVG Icons ─────────────────────────────────────────────────
const DiscoBall = () => (
  <svg width="44" height="54" viewBox="0 0 44 54" fill="none">
    <line x1="22" y1="0" x2="22" y2="8" stroke="#6B5FE4" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="22" cy="26" r="14" stroke="#6B5FE4" strokeWidth="2"/>
    <ellipse cx="22" cy="26" rx="7" ry="14" stroke="#6B5FE4" strokeWidth="1.5"/>
    <line x1="8" y1="26" x2="36" y2="26" stroke="#6B5FE4" strokeWidth="1.5"/>
    <line x1="9" y1="19" x2="35" y2="19" stroke="#6B5FE4" strokeWidth="1"/>
    <line x1="9" y1="33" x2="35" y2="33" stroke="#6B5FE4" strokeWidth="1"/>
    <rect x="18" y="5" width="8" height="5" rx="2" fill="none" stroke="#6B5FE4" strokeWidth="1.5"/>
    <circle cx="8" cy="20" r="2" fill="#E8B86D"/>
    <circle cx="36" cy="32" r="2" fill="#F2C49B"/>
    <circle cx="10" cy="34" r="1.5" fill="#6B5FE4"/>
  </svg>
)

const Cocktail = () => (
  <svg width="40" height="52" viewBox="0 0 40 52" fill="none">
    <path d="M4 6 L20 26 L36 6 Z" stroke="#E8B86D" strokeWidth="2" strokeLinejoin="round" fill="rgba(232,184,109,0.12)"/>
    <line x1="20" y1="26" x2="20" y2="44" stroke="#E8B86D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="44" x2="28" y2="44" stroke="#E8B86D" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="28" cy="14" r="3" fill="#D4607A" opacity="0.8"/>
    <circle cx="14" cy="11" r="2.5" fill="#4A9E72" opacity="0.8"/>
    <path d="M30 8 Q35 4 32 10" stroke="#4A9E72" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
)

const Speaker = () => (
  <svg width="42" height="48" viewBox="0 0 42 48" fill="none">
    <rect x="6" y="4" width="30" height="40" rx="6" stroke="#6B5FE4" strokeWidth="2" fill="rgba(107,95,228,0.06)"/>
    <circle cx="21" cy="28" r="9" stroke="#6B5FE4" strokeWidth="2"/>
    <circle cx="21" cy="28" r="4" stroke="#6B5FE4" strokeWidth="1.5" fill="rgba(107,95,228,0.12)"/>
    <rect x="15" y="10" width="12" height="6" rx="3" stroke="#E8B86D" strokeWidth="1.5" fill="rgba(232,184,109,0.15)"/>
  </svg>
)

const Confetti = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="8" height="8" rx="2" fill="#6B5FE4" opacity="0.8" transform="rotate(15 12 16)"/>
    <rect x="30" y="6" width="6" height="6" rx="1.5" fill="#E8B86D" opacity="0.9" transform="rotate(-20 33 9)"/>
    <rect x="34" y="28" width="7" height="7" rx="2" fill="#D4607A" opacity="0.75" transform="rotate(30 37 31)"/>
    <rect x="6" y="30" width="5" height="5" rx="1.5" fill="#4A9E72" opacity="0.8" transform="rotate(-10 8 32)"/>
    <circle cx="24" cy="24" r="3" fill="#F2C49B"/>
    <circle cx="38" cy="14" r="2.5" fill="#6B5FE4" opacity="0.6"/>
    <circle cx="10" cy="42" r="2" fill="#E8B86D" opacity="0.7"/>
    <line x1="20" y1="8" x2="24" y2="4" stroke="#6B5FE4" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="40" y1="22" x2="44" y2="18" stroke="#D4607A" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="14" y1="38" x2="10" y2="42" stroke="#4A9E72" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const Microphone = () => (
  <svg width="36" height="54" viewBox="0 0 36 54" fill="none">
    <rect x="10" y="2" width="16" height="26" rx="8" stroke="#2C2016" strokeWidth="2" fill="rgba(44,32,22,0.06)"/>
    <rect x="13" y="8" width="3" height="3" rx="1.5" fill="#6B5FE4"/>
    <rect x="20" y="8" width="3" height="3" rx="1.5" fill="#6B5FE4"/>
    <rect x="13" y="14" width="3" height="3" rx="1.5" fill="#6B5FE4"/>
    <rect x="20" y="14" width="3" height="3" rx="1.5" fill="#6B5FE4"/>
    <rect x="13" y="20" width="3" height="3" rx="1.5" fill="#E8B86D"/>
    <rect x="20" y="20" width="3" height="3" rx="1.5" fill="#E8B86D"/>
    <path d="M6 22 Q6 36 18 36 Q30 36 30 22" stroke="#2C2016" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <line x1="18" y1="36" x2="18" y2="48" stroke="#2C2016" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="48" x2="26" y2="48" stroke="#2C2016" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const Star = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 4 L24.9 14.8 L36.3 14.8 L27.2 21.6 L30.6 32.4 L21 25.6 L11.4 32.4 L14.8 21.6 L5.7 14.8 L17.1 14.8 Z"
      stroke="#E8B86D" strokeWidth="2" strokeLinejoin="round" fill="rgba(232,184,109,0.18)"/>
    <circle cx="21" cy="20" r="3" fill="#E8B86D" opacity="0.5"/>
  </svg>
)

const ICONS = [
  { Component: DiscoBall, x: '12%', y: '18%', delay: 0.1, float: 'a' },
  { Component: Cocktail,  x: '72%', y: '14%', delay: 0.2, float: 'b' },
  { Component: Speaker,   x: '6%',  y: '55%', delay: 0.15, float: 'a' },
  { Component: Confetti,  x: '76%', y: '52%', delay: 0.25, float: 'b' },
  { Component: Microphone,x: '18%', y: '70%', delay: 0.2,  float: 'a' },
  { Component: Star,      x: '66%', y: '70%', delay: 0.1,  float: 'b' },
]

export default function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 2000)
    const t2 = setTimeout(onDone, 2600)
    return () => { clearTimeout(t); clearTimeout(t2) }
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
          {/* Floating icons */}
          {ICONS.map(({ Component, x, y, delay, float: floatType }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={floatType === 'a' ? 'animate-float' : 'animate-float-b'}
              style={{
                position: 'absolute',
                left: x, top: y,
                animationDelay: `${i * 0.3}s`,
                filter: 'drop-shadow(0 4px 12px rgba(44,32,22,0.08))',
              }}
            >
              <Component />
            </motion.div>
          ))}

          {/* EVO Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-center select-none"
          >
            <div
              className="animate-evo-jump"
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: '#2C2016',
                fontFamily: "'Poppins', 'Heebo', sans-serif",
                lineHeight: 1,
              }}
            >
              EVO
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.28em',
                color: 'rgba(44,32,22,0.45)',
                marginTop: 8,
                textTransform: 'uppercase',
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
