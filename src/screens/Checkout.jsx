import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, CreditCard, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Checkout() {
  const { navigate, totalBudget, generatedEvent, selectedSuppliers, createEventInDb } = useApp()
  const [saving, setSaving] = useState(false)
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
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-28" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-6 pt-5 pb-4" style={{ background: 'rgba(245,240,232,0.95)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('summary')} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <h1 className="text-lg font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>אבטח את האירוע שלך</h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Event summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--primary)' }}>האירוע שלך</p>
          <p className="font-light text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
            {generatedEvent?.name || 'הערב המיוחד שלך'}
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>תאריך</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>יתואם עם הספקים</span>
            </div>
            <div className="w-px" style={{ background: 'var(--border)' }} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>אורחים</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>אישור עם המקום</span>
            </div>
            <div className="w-px" style={{ background: 'var(--border)' }} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>ספקים</span>
              <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>{supplierCount} נבחרו</span>
            </div>
          </div>
        </motion.div>

        {/* Payment breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>שווי האירוע הכולל</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(totalBudget)}</span>
            </div>
            <div className="h-px" style={{ background: 'var(--border)' }} />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>מקדמה היום</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>20% לאבטחת כל הספקים</p>
              </div>
              <span className="text-2xl font-light" style={{ color: 'var(--primary)' }}>{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>יתרה ביום האירוע</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatPrice(remaining)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed pt-4" style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border)' }}>
            EVO מטפל בכל תשלומי הספקים ישירות. אתה משלם פעם אחת — אנחנו מתאמים הכל.
          </p>
        </motion.div>

        {/* Payment method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            אמצעי תשלום
          </h3>

          {/* Apple Pay */}
          <button className="w-full py-4 bg-white rounded-full flex items-center justify-center gap-3 mb-5 hover:bg-white/90 transition-all active:scale-[0.99]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-black font-semibold text-sm tracking-wide">שלם עם Apple Pay</span>
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>או</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Card fields */}
          <div className="space-y-3">
            <div className="relative">
              <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="מספר כרטיס"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                inputMode="numeric"
              />
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <p className="text-xs leading-relaxed text-center" style={{ color: 'var(--text-dim)' }}>
          בהשלמת המקדמה אתה מסכים ל
          <span className="underline underline-offset-2" style={{ color: 'var(--text-muted)' }}>תנאי השירות</span>
          {' '}של EVO.
          כל המקדמות מוחזקות בנאמנות עד למסירת האירוע.
        </p>

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md px-6 py-4 z-30" style={{ background: 'rgba(245,240,232,0.97)', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={async () => {
            setSaving(true)
            await createEventInDb()
            setSaving(false)
            navigate('confirmation')
          }}
          disabled={saving}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 py-4 rounded-full text-sm font-medium tracking-wider uppercase transition-all active:scale-[0.98]"
          style={{ background: 'var(--primary)', color: '#fff', opacity: saving ? 0.75 : 1 }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
          {saving ? 'שומר...' : `השלם מקדמה — ${formatPrice(deposit)}`}
        </button>
      </div>
    </div>
  )
}
