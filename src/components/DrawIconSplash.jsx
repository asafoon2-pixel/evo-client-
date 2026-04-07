import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ALL_ICONS } from './EvoEventIcons'

export default function DrawIconSplash({ iconIndex = 0, onDone }) {
  const Icon = ALL_ICONS[iconIndex % ALL_ICONS.length]
  const doneRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone() }
    }, 1600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 950,
        background: 'var(--background)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}
      onClick={() => { if (!doneRef.current) { doneRef.current = true; onDone() } }}
    >
      {/* Outer ring pulse */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 1], opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: 160, height: 160,
          borderRadius: '50%',
          border: '2px solid var(--primary)',
        }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Icon size={88} />
      </motion.div>

      {/* EVO text */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.35em',
          color: 'var(--text-dim)',
          fontFamily: "'Poppins', sans-serif",
          textTransform: 'uppercase',
        }}
      >
        EVO
      </motion.span>
    </motion.div>
  )
}
