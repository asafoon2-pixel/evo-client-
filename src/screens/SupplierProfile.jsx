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
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto pb-28">
      {/* Hero image */}
      <div className="relative h-72 bg-evo-card shrink-0">
        <img
          src={currentSupplier.image}
          alt={currentSupplier.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 50%, var(--background) 100%)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate('supplierList')}
          className="absolute top-12 left-5 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>

      <div className="px-6 -mt-6 relative z-10">
        {/* Name + category */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-evo-text leading-tight">{currentSupplier.name}</h1>
            <span className="text-xs font-medium tracking-widest uppercase text-evo-muted border border-evo-border rounded-full px-3 py-1 inline-block mt-2">
              {cat?.name}
            </span>
          </div>
          {isSelected && (
            <div className="mt-1 bg-evo-accent/10 border border-evo-accent/30 rounded-full px-3 py-1.5">
              <p className="text-evo-accent text-xs font-medium tracking-wide">Selected</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">{renderStars(currentSupplier.rating)}</div>
            <span className="text-sm text-evo-text font-medium">{currentSupplier.rating}</span>
            <span className="text-sm text-evo-muted">({currentSupplier.reviewCount})</span>
          </div>
          {currentSupplier.eventsCount && (
            <div className="flex items-center gap-1.5 text-evo-muted text-xs">
              <Camera size={12} />
              <span>{currentSupplier.eventsCount} events</span>
            </div>
          )}
          {currentSupplier.responseTime && (
            <div className="flex items-center gap-1.5 text-evo-muted text-xs">
              <Clock size={12} />
              <span>Responds {currentSupplier.responseTime}</span>
            </div>
          )}
        </div>

        {/* Price range */}
        <div className="mb-6">
          <span className="text-evo-accent text-xl font-light">{currentSupplier.priceRange}</span>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-3">Gallery</h2>
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
          <h2 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-3">About</h2>
          <p className="text-evo-muted text-sm leading-relaxed font-light">
            {currentSupplier.fullDescription || currentSupplier.shortDescription}
          </p>
        </div>

        {/* Packages */}
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-4">Packages</h2>
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
                      <span className="text-evo-text text-sm font-semibold">{p.name || p.label}</span>
                      {i === 1 && (
                        <span className="ml-2 text-[10px] tracking-widest uppercase text-evo-accent border border-evo-accent/40 rounded-full px-2 py-0.5">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className={`text-lg font-light ${isActive ? 'text-evo-accent' : 'text-evo-text'}`}>
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
          <h2 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-4">Reviews</h2>
          <div className="space-y-4">
            {currentSupplier.reviews.map((r, i) => (
              <div key={i} className="bg-evo-card rounded-2xl border border-evo-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-evo-elevated border border-evo-border flex items-center justify-center">
                      <span className="text-xs text-evo-muted font-medium">{r.author[0]}</span>
                    </div>
                    <span className="text-evo-text text-sm font-medium">{r.author}</span>
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
      <div className="fixed bottom-0 left-0 right-0 bg-evo-black/95 backdrop-blur-md border-t border-evo-border px-6 py-4 z-30">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-evo-muted tracking-wide">
              {selectedPackage?.name || 'Premium'} package
            </p>
            <p className="text-evo-accent text-xl font-light">{displayPrice}</p>
          </div>
          <button
            onClick={handleAddToEvent}
            className="flex-1 max-w-xs py-3.5 rounded-full bg-evo-accent text-white text-sm font-medium tracking-wider uppercase hover:bg-evo-accent/90 transition-all active:scale-[0.98]"
          >
            {isSelected ? 'Update Selection' : 'Add to My Event'}
          </button>
        </div>
      </div>
    </div>
  )
}
