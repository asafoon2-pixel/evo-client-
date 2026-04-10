import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Clock, Camera, Check, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

export default function SupplierProfile() {
  const { navigate, currentSupplier, currentCategory, selectSupplier, selectedSuppliers } = useApp()
  const [selectedPackage, setSelectedPackage] = useState(null)

  if (!currentSupplier) {
    return (
      <div className="w-full h-screen bg-evo-black flex items-center justify-center">
        <button onClick={() => navigate('supplierList')} className="text-evo-muted">
          <ArrowLeft size={20} />
        </button>
      </div>
    )
  }

  const cat = categories.find(c => c.id === currentCategory)
  const isSelected = selectedSuppliers[currentCategory]?.id === currentSupplier.id

  const handleAddToEvent = () => {
    const supplierWithPackage = {
      ...currentSupplier,
      selectedPackage: selectedPackage || currentSupplier.packages[1],
    }
    selectSupplier(currentCategory, supplierWithPackage)
    navigate('categories')
  }

  const renderStars = (rating, size = 14) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < Math.floor(rating) ? 'text-evo-accent fill-evo-accent' : 'text-evo-dim'}
      />
    ))

  const pkg = selectedPackage || currentSupplier.packages?.[1] || currentSupplier.packages?.[0] || { price: 0, name: 'Standard', features: [] }
  const displayPrice = `₪${pkg.price.toLocaleString()}`

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-28" style={{ background: 'var(--background)' }}>
      {/* Hero image */}
      <div className="relative h-72 shrink-0" style={{ background: 'var(--elevated)' }}>
        <img
          src={currentSupplier.image}
          alt={currentSupplier.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(245,240,232,0.9) 100%)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate('supplierList')}
          className="absolute top-12 right-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <ArrowLeft size={18} className="text-white" style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>

      <div className="px-6 -mt-6 relative z-10">
        {/* Name + category */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{currentSupplier.name}</h1>
            <span className="text-xs font-medium tracking-widest uppercase rounded-full px-3 py-1 inline-block mt-2"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {cat?.name}
            </span>
          </div>
          {isSelected && (
            <div className="mt-1 rounded-full px-3 py-1.5" style={{ background: 'rgba(107,95,228,0.1)', border: '1px solid rgba(107,95,228,0.3)' }}>
              <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--primary)' }}>נבחר</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">{renderStars(currentSupplier.rating)}</div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{currentSupplier.rating}</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({currentSupplier.reviewCount})</span>
          </div>
          {currentSupplier.eventsCount && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Camera size={12} />
              <span>{currentSupplier.eventsCount} אירועים</span>
            </div>
          )}
          {currentSupplier.responseTime && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span>מגיב {currentSupplier.responseTime}</span>
            </div>
          )}
        </div>

        {/* Price range */}
        <div className="mb-6">
          <span className="text-evo-accent text-xl font-light">{currentSupplier.priceRange}</span>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>גלריה</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {(currentSupplier.gallery || [currentSupplier.image, currentSupplier.image, currentSupplier.image]).map((img, i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-xl overflow-hidden bg-evo-card shrink-0"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>אודות</h2>
          <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)' }}>
            {currentSupplier.fullDescription || currentSupplier.shortDescription}
          </p>
        </div>

        {/* Packages */}
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>חבילות</h2>
          <div className="space-y-3">
            {(currentSupplier.packages || []).map((p, i) => {
              const isActive = selectedPackage?.id === p.id || selectedPackage?.name === p.name || (!selectedPackage && i === 1)
              return (
                <motion.button
                  key={p.name}
                  onClick={() => setSelectedPackage(p)}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
                    isActive
                      ? 'border-evo-accent bg-evo-accent/5'
                      : 'border-evo-border bg-evo-card hover:border-evo-border/70'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-white text-sm font-semibold">{p.name || p.label}</span>
                      {i === 1 && (
                        <span className="ml-2 text-[10px] tracking-widest uppercase rounded-full px-2 py-0.5"
                          style={{ color: 'var(--primary)', border: '1px solid rgba(107,95,228,0.4)' }}>
                          פופולרי
                        </span>
                      )}
                    </div>
                    <span className={`text-lg font-light ${isActive ? 'text-evo-accent' : 'text-white'}`}>
                      ₪{p.price.toLocaleString()}
                    </span>
                  </div>
                  {p.features && p.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-evo-muted">
                          <Check size={11} className={`mt-0.5 shrink-0 ${isActive ? 'text-evo-accent' : 'text-evo-dim'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Reviews */}
        {currentSupplier.reviews && currentSupplier.reviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>ביקורות</h2>
          <div className="space-y-4">
            {currentSupplier.reviews.map((r, i) => (
              <div key={i} className="bg-evo-card rounded-2xl border border-evo-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-evo-elevated border border-evo-border flex items-center justify-center">
                      <span className="text-xs text-evo-muted font-medium">{r.author[0]}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{r.author}</span>
                  </div>
                  <div className="flex gap-0.5">{renderStars(r.rating, 11)}</div>
                </div>
                <p className="text-evo-muted text-xs leading-relaxed font-light">{r.text}</p>
                <p className="text-evo-dim text-xs mt-2">{r.date}</p>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>
              חבילת {selectedPackage?.name || 'פרימיום'}
            </p>
            <p className="text-xl font-light" style={{ color: 'var(--primary)' }}>{displayPrice}</p>
          </div>
          <button
            onClick={handleAddToEvent}
            className="flex-1 max-w-xs py-3.5 rounded-full text-white text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98]"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}
          >
            {isSelected ? 'עדכן בחירה' : 'הוסף לאירוע שלי'}
          </button>
        </div>
      </div>
    </div>
  )
}
