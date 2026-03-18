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
    <div className="relative w-full min-h-screen bg-evo-black flex flex-col items-center justify-center overflow-hidden px-8">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,169,110,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Pulse rings */}
      <motion.div
        className="absolute rounded-full border border-evo-accent/10"
        initial={{ width: 80, height: 80, opacity: 0.8 }}
        animate={{ width: 400, height: 400, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
      />
      <motion.div
        className="absolute rounded-full border border-evo-accent/8"
        initial={{ width: 80, height: 80, opacity: 0.6 }}
        animate={{ width: 600, height: 600, opacity: 0 }}
        transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: 'easeOut' }}
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Gold line expansion */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-px bg-evo-accent mb-10"
        />

        {/* Secured label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs tracking-[0.35em] uppercase text-evo-accent mb-6"
        >
          Your Event Is Secured
        </motion.p>

        {/* Event name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-3xl sm:text-4xl font-light text-white leading-tight"
        >
          {generatedEvent?.name || 'Your Curated Evening'}
        </motion.h1>

        {/* Coordinator message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-evo-muted text-sm leading-relaxed font-light mt-6"
        >
          EVO has notified all vendors and begun coordination. You'll receive a full brief within 24 hours.
        </motion.p>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex gap-6 mt-8 pt-8 border-t border-evo-border w-full justify-center"
        >
          <div className="text-center">
            <p className="text-evo-dim text-xs mb-1">Event Date</p>
            <p className="text-white text-sm font-medium">TBD</p>
          </div>
          <div className="w-px bg-evo-border" />
          <div className="text-center">
            <p className="text-evo-dim text-xs mb-1">Suppliers</p>
            <p className="text-evo-accent text-sm font-medium">{supplierCount}</p>
          </div>
          <div className="w-px bg-evo-border" />
          <div className="text-center">
            <p className="text-evo-dim text-xs mb-1">Deposit Paid</p>
            <p className="text-white text-sm font-medium">{formatPrice(deposit)}</p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="flex flex-col gap-4 mt-10 w-full"
        >
          <button
            onClick={() => navigate('management')}
            className="w-full py-4 rounded-full border border-evo-accent text-evo-accent text-sm font-medium tracking-[0.12em] uppercase hover:bg-evo-accent hover:text-black transition-all duration-300"
          >
            Go to My Event
          </button>
          <button className="flex items-center justify-center gap-2 text-evo-muted text-sm tracking-wide hover:text-white transition-colors py-2">
            <Share2 size={14} />
            Share Event
          </button>
        </motion.div>
      </div>
    </div>
  )
}
