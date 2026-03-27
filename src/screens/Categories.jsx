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
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-evo-black/90 backdrop-blur-md border-b border-evo-border px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('result')}
            className="text-evo-muted hover:text-evo-text transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide text-evo-text">Build Your Event</h1>
        </div>

        {/* Budget bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-evo-muted tracking-wide">Event Budget</span>
            <span className="text-xs text-evo-accent font-medium">
              {totalBudget > 0 ? formatPrice(totalBudget) : '₪0'} selected
            </span>
          </div>
          <div className="h-0.5 bg-evo-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-evo-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">
        {/* EVO message card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 bg-evo-card rounded-2xl p-5 border-l-2 border-evo-accent flex gap-4 items-start"
        >
          <div className="w-6 h-6 rounded-full bg-evo-accent/10 border border-evo-accent/40 flex items-center justify-center shrink-0 mt-0.5">
            <Zap size={12} className="text-evo-accent" />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-evo-accent mb-1.5">EVO Recommends</p>
            <p className="text-evo-text text-sm font-light leading-relaxed">
              Based on your taste, start with a{' '}
              <span className="text-evo-accent">venue</span> and{' '}
              <span className="text-evo-accent">atmosphere</span> — they define everything else.
              {generatedEvent && (
                <span className="text-evo-muted"> For "{generatedEvent.name}", we suggest leading with space and mood.</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Grid */}
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
                className="relative rounded-2xl overflow-hidden bg-evo-card border border-evo-border hover:border-evo-accent/40 transition-all duration-300 text-left active:scale-[0.98]"
                style={{ height: 160 }}
              >
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Selected badge */}
                {selected && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-6 h-6 bg-evo-accent rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="text-white text-sm font-medium tracking-wide">{cat.name}</p>
                  <p className="text-evo-muted text-xs mt-0.5 font-light">{cat.description}</p>
                  {selected ? (
                    <p className="text-evo-accent text-xs mt-1 font-medium truncate">{selected.name}</p>
                  ) : (
                    <p className="text-evo-dim text-xs mt-1">{cat.count} suppliers</p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* CTA if any selected */}
        {Object.keys(selectedSuppliers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              onClick={() => navigate('summary')}
              className="w-full py-4 rounded-full bg-evo-accent text-white text-sm font-medium tracking-wider uppercase hover:bg-evo-accent/90 transition-all active:scale-98"
            >
              Review My Event ({Object.keys(selectedSuppliers).length} selected)
            </button>
          </motion.div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
