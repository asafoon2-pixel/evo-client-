import { motion } from 'framer-motion'
import { ArrowLeft, Edit2, X, Plus, Zap, Star, RefreshCw, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

export default function EventSummary() {
  const {
    navigate,
    eventPackage,
    openSwapSheet,
    totalPrice,
    depositAmount,
    selectedSuppliers,
    removeSupplier,
    totalBudget,
    generatedEvent,
    setCurrentCategory,
    briefAnswers,
  } = useApp()

  // ── Determine which flow we're in ────────────────────────────────────────
  const isAIFlow = !!eventPackage

  // ── AI flow derived data ─────────────────────────────────────────────────
  const aiTotal   = totalPrice
  const aiDeposit = depositAmount

  // ── Manual flow derived data ─────────────────────────────────────────────
  const selectedEntries    = Object.entries(selectedSuppliers)
  const selectedCategoryIds = Object.keys(selectedSuppliers)
  const missingCategories  = categories.filter(c => !selectedCategoryIds.includes(c.id))
  const manualDeposit      = Math.round(totalBudget * 0.2)

  const effectiveTotal   = isAIFlow ? aiTotal   : totalBudget
  const effectiveDeposit = isAIFlow ? aiDeposit : manualDeposit

  const formatPrice = (n) => `₪${n.toLocaleString()}`

  const eventName = isAIFlow
    ? eventPackage.name
    : (generatedEvent?.name || 'Your Curated Evening')

  const guestCount = briefAnswers?.scale
    ? { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }[briefAnswers.scale] || briefAnswers.scale
    : null

  return (
    <div className="w-full min-h-screen flex flex-col overflow-y-auto pb-28" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md border-b px-6 pt-12 pb-4"
        style={{ background: 'rgba(245,245,247,0.95)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(isAIFlow ? 'package' : 'categories')}
            style={{ color: 'var(--text-muted)' }} className="hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide flex-1" style={{ color: 'var(--text-primary)' }}>
            Event Summary
          </h1>
          <button style={{ color: 'var(--text-muted)' }} className="hover:text-white transition-colors">
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">

        {/* Event name + meta */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--primary)' }}>
            EVO Built This For You
          </p>
          <h2 className="text-2xl font-light leading-tight" style={{ color: 'var(--text-primary)' }}>
            {eventName}
          </h2>
          {isAIFlow && (
            <div className="flex flex-wrap gap-2 mt-3">
              {eventPackage.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'rgba(45,27,105,0.12)', color: 'var(--primary)', border: '1px solid rgba(45,27,105,0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Event details (from Brief) */}
        {(briefAnswers?.eventType || briefAnswers?.date || guestCount) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl p-5 grid grid-cols-3 gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {briefAnswers?.eventType && (
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Type</p>
                <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                  {briefAnswers.eventType}
                </p>
              </div>
            )}
            {guestCount && (
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Guests</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{guestCount}</p>
              </div>
            )}
            {briefAnswers?.date && (
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Date</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{briefAnswers.date}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── AI FLOW: Package sections ─────────────────────────────────────── */}
        {isAIFlow && (
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-muted)' }}>
              Your Package
            </h3>
            <div className="space-y-3">
              {eventPackage.sections.map((section, i) => (
                <motion.div key={section.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

                  {/* Section image strip */}
                  <div className="relative w-full overflow-hidden" style={{ height: 120 }}>
                    <img src={section.image} alt={section.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,10,15,0.7) 0%, transparent 60%)' }} />
                    <div className="absolute top-3 left-4">
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'var(--primary)', border: '1px solid rgba(200,169,110,0.3)' }}>
                        {section.label}
                        {section.id === 'venue' && <MapPin size={9} className="inline ml-1 mb-0.5" />}
                      </span>
                    </div>
                  </div>

                  {/* Vendor row */}
                  <div className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {section.vendor.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                          {formatPrice(section.vendor.price)}
                        </span>
                        {section.vendor.rating && (
                          <div className="flex items-center gap-0.5">
                            <Star size={10} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{section.vendor.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.button onClick={() => openSwapSheet(section.id)} whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 text-xs tracking-wide px-3 py-1.5 rounded-full shrink-0 transition-all"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--elevated)' }}>
                      <RefreshCw size={11} />
                      Swap
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── MANUAL FLOW: Selected suppliers ──────────────────────────────── */}
        {!isAIFlow && selectedEntries.length > 0 && (
          <div>
            <h3 className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Your Suppliers
            </h3>
            <div className="space-y-3">
              {selectedEntries.map(([catId, supplier], i) => {
                const cat = categories.find(c => c.id === catId)
                const price = supplier.selectedPackage?.price || supplier.basePrice
                return (
                  <motion.div key={catId}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex gap-4 p-4 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--elevated)' }}>
                        <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{supplier.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cat?.name}</p>
                        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--primary)' }}>
                          {formatPrice(price)} — {supplier.selectedPackage?.name || 'Premium'}
                        </p>
                      </div>
                      <button onClick={() => removeSupplier(catId)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── MANUAL FLOW: Add more categories ─────────────────────────────── */}
        {!isAIFlow && missingCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Add More
            </h3>
            <div className="space-y-2">
              {missingCategories.slice(0, 4).map((cat) => (
                <button key={cat.id}
                  onClick={() => { setCurrentCategory(cat.id); navigate('supplierList') }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                  style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                  <div>
                    <p className="text-sm">{cat.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{cat.description}</p>
                  </div>
                  <Plus size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EVO Note */}
        {isAIFlow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5 flex gap-3 items-start"
            style={{ background: 'var(--surface)', borderLeft: '2px solid var(--primary)', border: '1px solid var(--border)' }}>
            <Zap size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--primary)' }}>EVO Note</p>
              <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Every supplier in this package was matched to your style and budget. You can swap any of them on the previous screen.
              </p>
            </div>
          </motion.div>
        )}

        {/* Totals */}
        {effectiveTotal > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Payment Summary
            </p>
            {isAIFlow && eventPackage.sections.map(s => (
              <div key={s.id} className="flex justify-between py-2.5"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatPrice(s.vendor.price)}
                </span>
              </div>
            ))}
            {!isAIFlow && selectedEntries.map(([catId, supplier]) => {
              const cat = categories.find(c => c.id === catId)
              const price = supplier.selectedPackage?.price || supplier.basePrice
              return (
                <div key={catId} className="flex justify-between py-2.5"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat?.name}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPrice(price)}</span>
                </div>
              )
            })}
            <div className="flex justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Event Value</span>
              <span className="text-xl font-light" style={{ color: 'var(--text-primary)' }}>{formatPrice(effectiveTotal)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Deposit to secure (20%)</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{formatPrice(effectiveDeposit)}</span>
            </div>
            <div className="mt-4 pt-4 flex items-start gap-2" style={{ borderTop: '1px solid var(--border)' }}>
              <Zap size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
              <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                EVO handles all vendor payments. You pay once — we coordinate everything.
              </p>
            </div>
          </motion.div>
        )}

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      {effectiveTotal > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
          style={{ background: 'rgba(245,245,247,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
          <motion.button onClick={() => navigate(isAIFlow ? 'userprofile' : 'eventdetails')} whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all"
            style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-accent)' }}>
            Secure My Event — {formatPrice(effectiveDeposit)}
          </motion.button>
        </div>
      )}
    </div>
  )
}
