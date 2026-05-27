import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Shield, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'

const trustItems = [
  { icon: Shield,    label: 'SSL מאובטח' },
  { icon: RotateCcw, label: 'החזר תוך 48ש' },
  { icon: Lock,      label: 'מוגן על ידי EVO' },
]

export default function Secure() {
  const { navigate, eventPackage, totalPrice, depositAmount, createEventInDb } = useApp()
  const [saving, setSaving] = useState(false)

  const handlePay = async () => {
    if (saving) return
    setSaving(true)
    try {
      await createEventInDb()
    } catch (e) {
      console.error('createEventInDb error:', e)
    }
    navigate('confirmation')
  }

  const formatPrice = n => `₪${n.toLocaleString()}`

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.08)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('package')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>אבטח את האירוע שלך</h1>
          <div className="mr-auto flex items-center gap-1.5" style={{ color: '#4ADE80' }}>
            <Shield size={13} />
            <span className="text-xs font-medium">מאובטח</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-6">

        {/* Event name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-overline mb-3">האירוע שלך</p>
          <h2 className="font-display text-[26px] font-light leading-tight" style={{ color: 'var(--text-primary)' }}>
            {eventPackage?.name || 'הערב המיוחד שלך'}
          </h2>
          <p className="text-sm mt-2 font-light" style={{ color: 'var(--text-muted)' }}>
            {eventPackage?.sections?.length} ספקים · תיאום מנוהל על ידי EVO
          </p>
        </motion.div>

        {/* Deposit breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>סך עלות האירוע</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(totalPrice)}</span>
            </div>
            <div className="px-5 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>מקדמה לאישור</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>20% · נגבה לאחר אישור נציג EVO</p>
                </div>
                <span className="text-3xl font-light" style={{ color: 'var(--primary)' }}>{formatPrice(depositAmount)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center px-5 py-3" style={{ background: 'rgba(44,32,22,0.04)', borderTop: '1px solid var(--border)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>יתרה ביום האירוע</span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{formatPrice(totalPrice - depositAmount)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-center px-2" style={{ color: 'var(--text-dim)' }}>
            ניתן להחזר תוך 48 שעות · EVO משלם לספקים בשמך
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="flex justify-center gap-6">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <Icon size={15} style={{ color: '#4ADE80' }} />
              </div>
              <span className="text-[10px] tracking-wide" style={{ color: 'var(--text-dim)' }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Payment */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>אמצעי תשלום</p>

          {/* Bit Pay */}
          {(() => {
            const firstVendor = eventPackage?.sections?.[0]?.vendor
            const phone = firstVendor?.phone?.replace(/\D/g, '')
            if (!phone) return null
            const bitUrl = `https://www.bitpay.co.il/app/transfer?phone=${phone}&amount=${depositAmount}&message=${encodeURIComponent('מקדמה לאירוע - EVO')}`
            return (
              <motion.a href={bitUrl} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-3 mb-3 transition-all"
                style={{ background: '#5B2D8E', boxShadow: '0 1px 4px rgba(91,45,142,0.3)', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.15"/>
                  <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B</text>
                </svg>
                <span className="text-white font-semibold text-sm tracking-wide">שלם עם ביט</span>
              </motion.a>
            )
          })()}

          {/* Apple Pay */}
          <div className="relative">
            <motion.button whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all opacity-50 cursor-not-allowed"
              style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
              disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-black font-semibold text-sm tracking-wide">שלם עם Apple Pay</span>
            </motion.button>
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(107,95,228,0.12)', color: 'var(--primary)' }}>
              בקרוב
            </span>
          </div>
        </motion.div>

        <p className="text-xs leading-relaxed text-center pb-2" style={{ color: 'var(--text-dim)' }}>
          נציג EVO יחזור אליך תוך 24 שעות לאישור הבקשה וסגירת התשלום.
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(44,32,22,0.08)' }}>
        <motion.button onClick={handlePay} whileTap={{ scale: 0.98 }} disabled={saving}
          className="w-full flex items-center justify-center gap-3 py-4 text-sm font-semibold tracking-wider uppercase transition-all"
          style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-accent)', opacity: saving ? 0.7 : 1 }}>
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />שומר...</>
            : <><Lock size={14} />שלח בקשה לאישור</>
          }
        </motion.button>
      </div>
    </div>
  )
}
