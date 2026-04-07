import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

export default function Categories() {
  const { navigate, selectedSuppliers, totalBudget, setCurrentCategory, generatedEvent } = useApp()

  const budgetTier = 60000
  const budgetPercent = Math.min((totalBudget / budgetTier) * 100, 100)
  const formatPrice = (n) => `₪${n.toLocaleString()}`

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.08)' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('result')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>בנה את האירוע שלך</h1>
        </div>

        {/* Budget bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>תקציב שנבחר</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
              {totalBudget > 0 ? formatPrice(totalBudget) : '₪0'}
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(44,32,22,0.10)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">

        {/* EVO recommendation card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-2xl p-5 flex gap-3 items-start"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRightWidth: 3,
            borderRightColor: 'var(--primary)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(107,95,228,0.10)', border: '1px solid rgba(107,95,228,0.25)' }}>
            <Zap size={12} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1.5 font-semibold" style={{ color: 'var(--primary)' }}>EVO ממליץ</p>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              על פי הטעם שלך, התחל עם{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>מקום</span>
              {' '}ו{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>אווירה</span>
              {' '}— הם מגדירים את כל השאר.
              {generatedEvent && (
                <span style={{ color: 'var(--text-muted)' }}> עבור "{generatedEvent.name}", אנו ממליצים להתחיל עם חלל ומצב רוח.</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const selected = selectedSuppliers[cat.id]
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => {
                  setCurrentCategory(cat.id)
                  navigate('supplierList')
                }}
                className="relative rounded-2xl overflow-hidden text-right active:scale-[0.98]"
                style={{
                  height: 160,
                  border: selected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  boxShadow: selected ? '0 0 0 3px rgba(107,95,228,0.15)' : 'var(--shadow-card)',
                  transition: 'all 0.25s',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.58 }}
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(44,32,22,0.88) 0%, rgba(44,32,22,0.2) 55%, transparent 100%)' }} />

                {selected && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--primary)' }}>
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="text-white text-sm font-semibold">{cat.name}</p>
                  <p className="text-xs mt-0.5 font-light" style={{ color: 'rgba(255,255,255,0.72)' }}>{cat.description}</p>
                  {selected ? (
                    <p className="text-xs mt-1 font-semibold" style={{ color: 'rgba(200,190,255,0.95)' }}>{selected.name}</p>
                  ) : (
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.48)' }}>{cat.count} ספקים</p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {Object.keys(selectedSuppliers).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <button
              onClick={() => navigate('summary')}
              className="w-full py-4 rounded-full text-sm font-semibold tracking-wide"
              style={{ background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}
            >
              סקירת האירוע שלי ({Object.keys(selectedSuppliers).length} נבחרו)
            </button>
          </motion.div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
