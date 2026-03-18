// Enhanced by EVO Agent
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Secure() {
  const { navigate, eventPackage, totalPrice, depositAmount } = useApp()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry]         = useState('')
  const [cvv, setCvv]               = useState('')

  const formatCard   = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0,2) + ' / ' + d.slice(2) : d }
  const formatPrice  = n => `₪${n.toLocaleString()}`

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-evo-black/90 backdrop-blur-md border-b border-evo-border px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('package')} className="text-evo-muted hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide text-white">Secure Your Event</h1>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8">
        {/* Event name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 border-b border-evo-border">
          <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-3">Your Event</p>
          <h2 className="text-2xl font-light text-white leading-tight">
            {eventPackage?.name || 'Your Curated Evening'}
          </h2>
          <p className="text-evo-muted text-sm mt-3 font-light">
            EVO will secure all {eventPackage?.sections.length} vendors and manage coordination from here.
          </p>
        </motion.div>

        {/* Deposit breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-evo-card rounded-2xl border border-evo-border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-evo-muted text-sm">Total Event Value</span>
              <span className="text-white text-sm">{formatPrice(totalPrice)}</span>
            </div>
            <div className="h-px bg-evo-border mb-4" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Deposit Today</p>
                <p className="text-evo-muted text-xs mt-0.5">20% — secures all vendors</p>
              </div>
              <span className="text-evo-accent text-3xl font-light">{formatPrice(depositAmount)}</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-evo-border">
              <span className="text-evo-muted text-sm">Remaining on event day</span>
              <span className="text-evo-muted text-sm">{formatPrice(totalPrice - depositAmount)}</span>
            </div>
            <p className="mt-4 text-evo-dim text-xs leading-relaxed">
              Fully refundable within 48 hours. EVO distributes to vendors — you never pay them directly.
            </p>
          </div>
        </motion.div>

        {/* Payment */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs font-medium tracking-widest uppercase text-evo-muted mb-4">Payment Method</p>

          {/* Apple Pay */}
          <button className="w-full py-4 bg-white rounded-full flex items-center justify-center gap-3 mb-5 hover:bg-white/90 transition-all active:scale-[0.99]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-black font-semibold text-sm tracking-wide">Pay with Apple Pay</span>
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-evo-border" />
            <span className="text-evo-dim text-xs">or</span>
            <div className="flex-1 h-px bg-evo-border" />
          </div>

          <div className="space-y-3">
            <input type="text" placeholder="Card number" value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))} inputMode="numeric"
              className="w-full bg-evo-card border border-evo-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="MM / YY" value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))} inputMode="numeric"
                className="w-full bg-evo-card border border-evo-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors" />
              <input type="text" placeholder="CVV" value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} inputMode="numeric"
                className="w-full bg-evo-card border border-evo-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors" />
            </div>
          </div>
        </motion.div>

        <p className="text-evo-dim text-xs leading-relaxed text-center">
          By completing this deposit you agree to EVO's Terms of Service.
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-evo-black/95 backdrop-blur-md border-t border-evo-border px-6 py-4 z-30">
        <button onClick={() => navigate('confirmation')}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-evo-accent text-black text-sm font-medium tracking-wider uppercase hover:bg-evo-accent/90 transition-all active:scale-[0.98]">
          <Lock size={14} />
          Complete Deposit — {formatPrice(depositAmount)}
        </button>
      </div>
    </div>
  )
}
