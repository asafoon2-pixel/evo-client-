// Enhanced by EVO Agent
import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Confirmation() {
  const { navigate, eventPackage, depositAmount } = useApp()

  const deposit = depositAmount
  const supplierCount = eventPackage?.sections?.length || 0
  const generatedEvent = eventPackage
  const formatPrice = (n) => `₪${n.toLocaleString()}`

  return (
    <div dir="rtl" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-8" style={{ background: 'var(--background)' }}>
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(45,27,105,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Pulse rings */}
      <motion.div
        className="absolute rounded-full"
        style={{ border: '1px solid rgba(107,95,228,0.12)', top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        initial={{ width: 80, height: 80, opacity: 0.8 }}
        animate={{ width: 400, height: 400, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ border: '1px solid rgba(107,95,228,0.08)', top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        initial={{ width: 80, height: 80, opacity: 0.6 }}
        animate={{ width: 600, height: 600, opacity: 0 }}
        transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: 'easeOut' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Gold line expansion */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-px mb-10"
          style={{ background: 'var(--primary)' }}
        />

        {/* Secured label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs tracking-[0.35em] uppercase mb-6"
          style={{ color: 'var(--primary)' }}
        >
          האירוע שלך מאובטח
        </motion.p>

        {/* Event name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-3xl sm:text-4xl font-light leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {generatedEvent?.name || 'הערב המיוחד שלך'}
        </motion.h1>

        {/* Coordinator message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-sm leading-relaxed font-light mt-6"
          style={{ color: 'var(--text-muted)' }}
        >
          EVO הודיע לכל הספקים והחל בתיאום. תקבל בריף מלא תוך 24 שעות.
        </motion.p>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex gap-6 mt-8 pt-8 w-full justify-center"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>תאריך אירוע</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>TBD</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>ספקים</p>
            <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{supplierCount}</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>מקדמה ששולמה</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(deposit)}</p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="flex flex-col gap-4 mt-10 w-full"
        >
          <motion.button
            onClick={() => navigate('management')}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-[0.12em] uppercase transition-all duration-200"
          style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}
          >
            עבור לאירוע שלי
          </motion.button>
          <button className="flex items-center justify-center gap-2 text-sm tracking-wide py-2" style={{ color: 'var(--text-muted)' }}>
            <Share2 size={14} />
            שתף אירוע
          </button>
        </motion.div>
      </div>
    </div>
  )
}
