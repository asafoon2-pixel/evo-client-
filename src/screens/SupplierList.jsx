import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ChevronLeft, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { suppliers, categories } from '../data/index'

export default function SupplierList() {
  const { navigate, currentCategory, setCurrentSupplier, selectedSuppliers } = useApp()
  const [activeFilter, setActiveFilter] = useState('all')

  const cat = categories.find(c => c.id === currentCategory)
  const catSuppliers = suppliers[currentCategory] || []

  const filtered = catSuppliers.filter(s => {
    if (activeFilter === 'recommended') return s.rating >= 4.8
    if (activeFilter === 'top-rated') return s.rating === 4.9
    return true
  })

  const recommended = catSuppliers.reduce((best, s) => (!best || s.rating > best.rating ? s : best), null)
  const currentSelected = selectedSuppliers[currentCategory]

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={11}
        style={i < Math.floor(rating)
          ? { color: 'var(--primary)', fill: 'var(--primary)' }
          : { color: 'rgba(44,32,22,0.2)' }}
      />
    ))

  const filters = [
    { key: 'all', label: 'הכל' },
    { key: 'recommended', label: 'מומלצים' },
    { key: 'top-rated', label: 'מדורגים' },
  ]

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.08)' }}>
        <div className="flex items-center gap-4 mb-1">
          <button onClick={() => navigate('categories')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {cat?.name || 'ספקים'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {catSuppliers.length} ספקים זמינים
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 pb-10">

        {/* EVO recommendation chip */}
        {recommended && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-5 flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(107,95,228,0.10)', border: '1px solid rgba(107,95,228,0.25)' }}>
              <Zap size={11} style={{ color: 'var(--primary)' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>EVO ממליץ</span> בשבילך —{' '}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{recommended.name}</span>
            </p>
          </motion.div>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={activeFilter === f.key
                ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }
                : { border: '1.5px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Supplier list */}
        <div className="space-y-3">
          {filtered.map((supplier, i) => {
            const isEVOPick = supplier.id === recommended?.id
            const isSelected = currentSelected?.id === supplier.id

            return (
              <motion.button
                key={supplier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                onClick={() => {
                  setCurrentSupplier(supplier)
                  navigate('supplierProfile')
                }}
                className="w-full rounded-2xl overflow-hidden text-right active:scale-[0.99] transition-all"
                style={{
                  background: 'var(--surface)',
                  border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  boxShadow: isSelected ? '0 0 0 3px rgba(107,95,228,0.12)' : 'var(--shadow-card)',
                }}
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--border)' }}>
                    <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{supplier.name}</p>
                        {isEVOPick && (
                          <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: 'var(--primary)' }}>
                            בחירת EVO
                          </span>
                        )}
                      </div>
                      <ChevronLeft size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: 2 }} />
                    </div>

                    <p className="text-xs mt-1 font-light leading-relaxed line-clamp-2"
                      style={{ color: 'var(--text-muted)' }}>
                      {supplier.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">{renderStars(supplier.rating)}</div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {supplier.rating} ({supplier.reviewCount})
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{supplier.priceRange}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="px-4 py-2.5" style={{ background: 'rgba(107,95,228,0.07)', borderTop: '1px solid rgba(107,95,228,0.15)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>נבחר לאירוע שלך</p>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>לא נמצאו ספקים</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>נסה קטגוריה אחרת</p>
          </div>
        )}
      </div>
    </div>
  )
}
