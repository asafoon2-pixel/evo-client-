import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Loader2, ShieldCheck, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Toast from '../components/Toast'

export default function Checkout() {
  const { navigate, totalBudget, generatedEvent, selectedSuppliers, createEventInDb } = useApp()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const deposit = Math.round(totalBudget * 0.2)
  const remaining = totalBudget - deposit
  const supplierCount = Object.keys(selectedSuppliers).length

  const formatPrice = (n) => `₪${n.toLocaleString()}`

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

        {/* Payment info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(107,95,228,0.1)' }}>
              <MessageCircle size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                תשלום ישיר מול הספק
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                כרגע התשלומים מתבצעים ישירות מול כל ספק בנפרד. לאחר אישור הפנייה, הספק יצור איתך קשר לגבי פרטי התשלום.
              </p>
            </div>
          </div>
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(74,158,114,0.1)' }}>
              <ShieldCheck size={18} style={{ color: '#4A9E72' }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                תשלום מאובטח — בקרוב
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                בקרוב תוכל לשלם בצורה מאובטחת ישירות דרך האפליקציה עם הגנת רוכש מלאה.
              </p>
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

      <Toast message={toast.message} type="success" visible={toast.visible} />

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md px-6 py-4 z-30" style={{ background: 'rgba(245,240,232,0.97)', borderTop: '1px solid var(--border)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <button
          onClick={async () => {
            setSaving(true)
            await createEventInDb()
            setSaving(false)
            setToast({ visible: true, message: 'האירוע נשמר בהצלחה! 🎉' })
            setTimeout(() => navigate('confirmation'), 1500)
          }}
          disabled={saving}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 py-4 rounded-full text-sm font-medium tracking-wider uppercase transition-all active:scale-[0.98]"
          style={{ background: 'var(--primary)', color: '#fff', opacity: saving ? 0.75 : 1 }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
          {saving ? 'שומר...' : 'אשר ושלח פנייה לספקים'}
        </button>
      </div>
    </div>
  )
}
