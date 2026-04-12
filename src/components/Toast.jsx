import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ message, type = 'success', visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 500,
            zIndex: 999,
            background: type === 'success' ? '#1a1a1a' : '#e63946',
            color: '#fff',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
