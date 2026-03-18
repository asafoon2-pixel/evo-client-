import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SwapSheet() {
  const { eventPackage, swapSheet, closeSwapSheet, swapVendor } = useApp()

  const section = eventPackage?.sections.find(s => s.id === swapSheet.sectionId)

  return (
    <AnimatePresence>
      {swapSheet.open && section && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={closeSwapSheet}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-evo-card rounded-t-3xl border-t border-evo-border px-6 pb-10 pt-6"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-evo-border rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-evo-accent">EVO Alternatives</p>
                <p className="text-white font-light mt-1">{section.label}</p>
              </div>
              <button onClick={closeSwapSheet} className="w-8 h-8 rounded-full border border-evo-border flex items-center justify-center text-evo-muted hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            <p className="text-evo-muted text-xs mb-6 font-light leading-relaxed">
              EVO's other matches for your taste. Current selection stays unless you choose below.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {section.alternatives.map((alt, i) => (
                <motion.button
                  key={alt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => swapVendor(section.id, alt)}
                  className="rounded-2xl border border-evo-border bg-evo-elevated overflow-hidden text-left hover:border-evo-accent/40 transition-all active:scale-[0.98]"
                >
                  <div className="h-28 overflow-hidden bg-evo-card">
                    {alt.image && <img src={alt.image} alt={alt.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium leading-tight">{alt.name}</p>
                    <p className="text-evo-muted text-xs mt-1 leading-relaxed line-clamp-2">{alt.description}</p>
                    <p className="text-evo-accent text-xs font-medium mt-2">₪{(alt.price || 0).toLocaleString()}</p>
                    {alt.evoNote && (
                      <p className="text-evo-dim text-[10px] mt-1 italic leading-relaxed">{alt.evoNote}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={closeSwapSheet}
              className="w-full mt-4 py-3 text-evo-muted text-sm tracking-wide hover:text-white transition-colors"
            >
              Keep EVO's choice
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
