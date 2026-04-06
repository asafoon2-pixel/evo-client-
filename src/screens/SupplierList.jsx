import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ChevronRight, Zap } from 'lucide-react'
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={11}
        className={i < Math.floor(rating) ? 'text-evo-accent fill-evo-accent' : 'text-evo-dim'}
      />
    ))
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'recommended', label: 'Recommended' },
    { key: 'top-rated', label: 'Top Rated' },
  ]

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-evo-black/90 backdrop-blur-md border-b border-evo-border px-6 pt-5 pb-4">
        <div className="flex items-center gap-4 mb-1">
          <button
            onClick={() => navigate('categories')}
            className="text-evo-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-light tracking-wide text-white">
              {cat?.name || 'Suppliers'}
            </h1>
            <p className="text-xs text-evo-muted mt-0.5">
              {catSuppliers.length} suppliers available
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
            className="mb-5 flex items-center gap-3 bg-evo-card border border-evo-border rounded-2xl px-4 py-3"
          >
            <div className="w-6 h-6 rounded-full bg-evo-accent/15 border border-evo-accent/30 flex items-center justify-center shrink-0">
              <Zap size={11} className="text-evo-accent" />
            </div>
            <p className="text-xs text-evo-muted">
              <span className="text-evo-accent font-medium">EVO recommends</span> for your taste →{' '}
              <span className="text-white">{recommended.name}</span>
            </p>
          </motion.div>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                activeFilter === f.key
                  ? 'bg-white text-black'
                  : 'border border-evo-border text-evo-muted hover:border-white/30 hover:text-white'
              }`}
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
                className={`w-full bg-evo-card rounded-2xl border transition-all duration-200 text-left overflow-hidden active:scale-[0.99] ${
                  isSelected ? 'border-evo-accent/50' : 'border-evo-border hover:border-evo-border/70'
                }`}
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-evo-elevated shrink-0">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white text-sm font-medium">{supplier.name}</p>
                        {isEVOPick && (
                          <span className="text-evo-accent text-[10px] tracking-widest uppercase font-medium">
                            EVO Pick
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-evo-dim shrink-0 mt-0.5" />
                    </div>

                    <p className="text-evo-muted text-xs mt-1 font-light leading-relaxed line-clamp-2">
                      {supplier.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">{renderStars(supplier.rating)}</div>
                        <span className="text-xs text-evo-muted">
                          {supplier.rating} ({supplier.reviewCount})
                        </span>
                      </div>
                      <span className="text-xs text-evo-accent font-medium">{supplier.priceRange}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="bg-evo-accent/10 border-t border-evo-accent/20 px-4 py-2">
                    <p className="text-evo-accent text-xs font-medium tracking-wide">Selected for your event</p>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-evo-muted text-sm">No suppliers match this filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
