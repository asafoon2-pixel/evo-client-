import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, CreditCard } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Checkout() {
  const { navigate, totalBudget, generatedEvent, selectedSuppliers } = useApp()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const deposit = Math.round(totalBudget * 0.2)
  const remaining = totalBudget - deposit
  const supplierCount = Object.keys(selectedSuppliers).length

  const formatPrice = (n) => `₪${n.toLocaleString()}`

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2)
    return digits
  }

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-evo-black/90 backdrop-blur-md border-b border-evo-border px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('summary')} className="text-evo-muted hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide text-white">Secure Your Event</h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Event summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-evo-card rounded-2xl border border-evo-border p-5"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-evo-accent mb-3">Your Event</p>
          <p className="text-white font-light text-lg leading-tight">
            {generatedEvent?.name || 'Your Curated Evening'}
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-evo-dim text-xs">Date</span>
              <span className="text-evo-muted text-xs">TBD with vendors</span>
            </div>
            <div className="w-px bg-evo-border" />
            <div className="flex flex-col gap-0.5">
              <span className="text-evo-dim text-xs">Guests</span>
              <span className="text-evo-muted text-xs">Confirm with venue</span>
            </div>
            <div className="w-px bg-evo-border" />
            <div className="flex flex-col gap-0.5">
              <span className="text-evo-dim text-xs">Vendors</span>
              <span className="text-evo-accent text-xs font-medium">{supplierCount} selected</span>
            </div>
          </div>
        </motion.div>

        {/* Payment breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-evo-card rounded-2xl border border-evo-border p-5"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-evo-muted text-sm">Total Event Value</span>
              <span className="text-white text-sm font-medium">{formatPrice(totalBudget)}</span>
            </div>
            <div className="h-px bg-evo-border" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Deposit Today</p>
                <p className="text-evo-muted text-xs mt-0.5">20% to secure all vendors</p>
              </div>
              <span className="text-evo-accent text-2xl font-light">{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-evo-muted text-sm">Remaining on event day</span>
              <span className="text-evo-muted text-sm">{formatPrice(remaining)}</span>
            </div>
          </div>

          <p className="mt-4 text-evo-dim text-xs leading-relaxed border-t border-evo-border pt-4">
            EVO handles all vendor payments directly. You pay once — we coordinate everything.
          </p>
        </motion.div>

        {/* Payment method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-4">
            Payment Method
          </h3>

          {/* Apple Pay */}
          <button className="w-full py-4 bg-white rounded-full flex items-center justify-center gap-3 mb-5 hover:bg-white/90 transition-all active:scale-[0.99]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-black font-semibold text-sm tracking-wide">Pay with Apple Pay</span>
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-evo-border" />
            <span className="text-evo-dim text-xs">or</span>
            <div className="flex-1 h-px bg-evo-border" />
          </div>

          {/* Card fields */}
          <div className="space-y-3">
            <div className="relative">
              <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-evo-dim" />
              <input
                type="text"
                placeholder="Card number"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full bg-evo-card border border-evo-border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="w-full bg-evo-card border border-evo-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors"
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full bg-evo-card border border-evo-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent transition-colors"
                inputMode="numeric"
              />
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <p className="text-evo-dim text-xs leading-relaxed text-center">
          By completing this deposit you agree to EVO's{' '}
          <span className="text-evo-muted underline underline-offset-2">Terms of Service</span>.
          All deposits are held in escrow until event delivery.
        </p>

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-evo-black/95 backdrop-blur-md border-t border-evo-border px-6 py-4 z-30">
        <button
          onClick={() => navigate('confirmation')}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 py-4 rounded-full bg-evo-accent text-black text-sm font-medium tracking-wider uppercase hover:bg-evo-accent/90 transition-all active:scale-[0.98]"
        >
          <Lock size={14} />
          Complete Deposit — {formatPrice(deposit)}
        </button>
      </div>
    </div>
  )
}
