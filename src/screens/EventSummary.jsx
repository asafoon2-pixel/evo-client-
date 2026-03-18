import { motion } from 'framer-motion'
import { ArrowLeft, Edit2, X, Plus, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

export default function EventSummary() {
  const { navigate, selectedSuppliers, removeSupplier, totalBudget, generatedEvent, setCurrentCategory } = useApp()

  const selectedEntries = Object.entries(selectedSuppliers)
  const selectedCategoryIds = Object.keys(selectedSuppliers)
  const missingCategories = categories.filter(c => !selectedCategoryIds.includes(c.id))

  const deposit = Math.round(totalBudget * 0.2)
  const remaining = totalBudget - deposit

  const formatPrice = (n) => `₪${n.toLocaleString()}`

  const budgetTier = 60000
  const budgetPercent = Math.min((totalBudget / budgetTier) * 100, 100)

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-y-auto pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-evo-black/90 backdrop-blur-md border-b border-evo-border px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('categories')} className="text-evo-muted hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide text-white flex-1">Your Event</h1>
          <button className="text-evo-muted hover:text-white transition-colors">
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Event name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.25em] uppercase text-evo-accent mb-2">Your Event</p>
          <h2 className="text-2xl font-light text-white leading-tight">
            {generatedEvent?.name || 'Your Curated Evening'}
          </h2>
        </motion.div>

        {/* Budget bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-evo-card rounded-2xl border border-evo-border p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-evo-muted">Budget Allocated</span>
            <span className="text-evo-accent font-medium">{formatPrice(totalBudget)}</span>
          </div>
          <div className="h-1 bg-evo-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-evo-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-evo-dim">{selectedEntries.length} suppliers</span>
            <span className="text-xs text-evo-dim">{formatPrice(budgetTier)} est. total</span>
          </div>
        </motion.div>

        {/* Selected suppliers */}
        {selectedEntries.length > 0 && (
          <div>
            <h3 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-3">
              Your Suppliers
            </h3>
            <div className="space-y-3">
              {selectedEntries.map(([catId, supplier], i) => {
                const cat = categories.find(c => c.id === catId)
                const price = supplier.selectedPackage?.price || supplier.basePrice
                return (
                  <motion.div
                    key={catId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-evo-card rounded-2xl border border-evo-border overflow-hidden"
                  >
                    <div className="flex gap-4 p-4 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-evo-elevated shrink-0">
                        <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{supplier.name}</p>
                        <p className="text-evo-muted text-xs mt-0.5">{cat?.name}</p>
                        <p className="text-evo-accent text-xs mt-1 font-medium">
                          {formatPrice(price)} — {supplier.selectedPackage?.name || 'Premium'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeSupplier(catId)}
                        className="w-8 h-8 rounded-full border border-evo-border flex items-center justify-center text-evo-muted hover:text-white hover:border-white/30 transition-all shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Missing categories */}
        {missingCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium tracking-widest uppercase text-evo-muted mb-3">
              Add More
            </h3>
            <div className="space-y-2">
              {missingCategories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentCategory(cat.id)
                    navigate('supplierList')
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-evo-border text-left hover:border-evo-accent/30 transition-all"
                >
                  <div>
                    <p className="text-evo-muted text-sm">{cat.name}</p>
                    <p className="text-evo-dim text-xs mt-0.5">{cat.description}</p>
                  </div>
                  <Plus size={16} className="text-evo-dim" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EVO suggestion */}
        {missingCategories.length > 0 && (
          <div className="bg-evo-card rounded-2xl border-l-2 border-evo-accent p-5 flex gap-3 items-start">
            <Zap size={14} className="text-evo-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs tracking-widest uppercase text-evo-accent mb-1">EVO Suggests</p>
              <p className="text-evo-muted text-sm font-light leading-relaxed">
                You may also need{' '}
                {missingCategories.slice(0, 2).map(c => c.name).join(' and ')}.{' '}
                These are commonly paired with your current selections.
              </p>
            </div>
          </div>
        )}

        {/* Totals */}
        {selectedEntries.length > 0 && (
          <div className="bg-evo-card rounded-2xl border border-evo-border p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-evo-muted">Subtotal</span>
                <span className="text-white">{formatPrice(totalBudget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-evo-muted">Deposit today (20%)</span>
                <span className="text-evo-accent">{formatPrice(deposit)}</span>
              </div>
              <div className="h-px bg-evo-border" />
              <div className="flex justify-between">
                <span className="text-white font-medium">Total Event Value</span>
                <span className="text-white text-xl font-light">{formatPrice(totalBudget)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      {selectedEntries.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-evo-black/95 backdrop-blur-md border-t border-evo-border px-6 py-4 z-30">
          <button
            onClick={() => navigate('checkout')}
            className="w-full max-w-lg mx-auto block py-4 rounded-full bg-evo-accent text-black text-sm font-medium tracking-wider uppercase hover:bg-evo-accent/90 transition-all active:scale-[0.98]"
          >
            Secure My Event
          </button>
        </div>
      )}
    </div>
  )
}
