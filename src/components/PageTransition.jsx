import { motion } from 'framer-motion'

// Brief EVO logo flash shown between screens
function EvoFlash() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.96] }}
      transition={{ duration: 0.55, times: [0, 0.25, 0.75, 1], ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'rgba(245, 240, 232, 0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <span style={{
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: '0.22em',
        color: '#2C2016',
        fontFamily: "'Poppins', 'Heebo', sans-serif",
        opacity: 0.9,
      }}>
        EVO
      </span>
    </motion.div>
  )
}

export default function PageTransition({ children }) {
  return (
    <>
      <EvoFlash />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </>
  )
}
