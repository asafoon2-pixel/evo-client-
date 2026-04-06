import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Plus, Zap, Star, RefreshCw, MapPin, ShieldCheck, ChevronDown, ChevronRight, Image } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

const CATEGORY_META = {
  venue:         { label: 'The Space',      tagline: 'Where the evening begins' },
  catering:      { label: 'The Table',      tagline: 'Food worth lingering over' },
  entertainment: { label: 'The Sound',      tagline: 'Music that moves the room' },
  lighting:      { label: 'The Atmosphere', tagline: 'Light that shapes the mood' },
  decor:         { label: 'The Feeling',    tagline: 'Details that tell your story' },
}

// ── Expandable vendor card ────────────────────────────────────────────────────
function VendorCard({ section, index, openSwapSheet, openProfile }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[section.id] || { label: section.label, tagline: '' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: `1px solid ${expanded ? 'var(--primary)' : 'var(--border)'}`, transition: 'border-color 0.25s' }}
      onClick={() => setExpanded(e => !e)}>

      {/* Image strip */}
      <div className="relative overflow-hidden" style={{ height: 130 }}>
        <img src={section.image} alt={section.label} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.0) 30%, rgba(8,10,15,0.65) 100%)' }} />

        <div className="absolute top-3 left-4">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.3)' }}>
            {meta.label}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white text-sm font-semibold">{section.vendor.name}</p>
          {section.vendor.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} style={{ color: '#C8A96E', fill: '#C8A96E' }} />
              <span className="text-xs text-white opacity-70">{section.vendor.rating}</span>
              {section.vendor.reviewCount && (
                <span className="text-xs text-white opacity-50">· {section.vendor.reviewCount}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collapsed row: price + tagline + chevron */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold" style={{ color: 'var(--primary)' }}>
            ₪{section.vendor.price?.toLocaleString()}
          </span>
          <span className="text-xs font-light italic" style={{ color: 'var(--text-muted)' }}>
            {meta.tagline}
          </span>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden">
            <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border)' }}>

              {section.vendor.description && (
                <p className="text-sm font-light leading-relaxed mt-3 mb-4"
                  style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  {section.vendor.description}
                </p>
              )}

              {section.vendor.whyChosen && (
                <div className="flex gap-2.5 items-start mb-4 p-3 rounded-xl"
                  style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.18)' }}>
                  <Zap size={11} className="shrink-0 mt-0.5" style={{ color: '#C8A96E' }} />
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase mb-0.5 font-semibold" style={{ color: '#C8A96E' }}>
                      Why EVO chose this
                    </p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {section.vendor.whyChosen}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openProfile(section)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ border: '1px solid rgba(45,27,105,0.25)', color: 'var(--primary)', background: 'rgba(45,27,105,0.06)' }}>
                  <ChevronRight size={11} /> View profile
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openSwapSheet(section.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--elevated)' }}>
                  <RefreshCw size={11} /> Swap vendor
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Vendor Profile Sheet ─────────────────────────────────────────────────────
function VendorSheet({ vendor, sectionLabel, sectionId, onClose, onSwap }) {
  const scrollRef = useRef(null)

  // Fake portfolio images — use the vendor image + color placeholders
  const portfolioImages = [
    vendor.image,
    vendor.image,
    vendor.image,
    vendor.image,
  ]

  const fakeReviews = [
    { name: 'Noa K.',    rating: 5, text: 'Absolutely stunning setup — every detail was perfect.', date: 'Mar 2025' },
    { name: 'Oren M.',   rating: 5, text: 'Professional, responsive, and the result was beyond expectations.', date: 'Jan 2025' },
    { name: 'Shira L.',  rating: 4, text: 'Great communication throughout. Highly recommend.', date: 'Dec 2024' },
  ]

  return (
    <AnimatePresence>
      <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />

      <motion.div key="sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          maxHeight: '90vh',
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          border: '1px solid var(--border)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
        }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="overflow-y-auto flex-1 pb-6">

          {/* Hero image */}
          <div className="relative overflow-hidden mx-4 mt-2 rounded-2xl" style={{ height: 200 }}>
            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,15,0.75) 0%, transparent 50%)' }} />
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <X size={14} className="text-white" />
            </button>
            <div className="absolute bottom-4 left-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: 'rgba(200,169,110,0.9)' }}>{sectionLabel}</p>
              <h2 className="text-xl font-semibold text-white">{vendor.name}</h2>
            </div>
          </div>

          {/* Rating + EVO badge row */}
          <div className="flex items-center gap-3 px-5 mt-4">
            {vendor.rating && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={10} style={{ color: '#C8A96E', fill: s <= Math.round(vendor.rating) ? '#C8A96E' : 'none' }} />
                  ))}
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{vendor.rating}</span>
                {vendor.reviewCount && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {vendor.reviewCount} reviews</span>
                )}
              </div>
            )}

            {/* EVO Verified badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(45,27,105,0.08)', border: '1px solid rgba(45,27,105,0.2)' }}>
              <ShieldCheck size={11} style={{ color: 'var(--primary)' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'var(--primary)' }}>EVO Verified</span>
            </div>
          </div>

          {/* Price */}
          <div className="px-5 mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light" style={{ color: 'var(--text-primary)' }}>
                ₪{vendor.price?.toLocaleString()}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>for your event</span>
            </div>
          </div>

          {/* About */}
          <div className="px-5 mt-4">
            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
              {vendor.description}
            </p>
          </div>

          {/* Why EVO chose */}
          {vendor.whyChosen && (
            <div className="mx-5 mt-4 p-4 rounded-2xl flex gap-3 items-start"
              style={{ background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.2)' }}>
              <Zap size={13} className="shrink-0 mt-0.5" style={{ color: '#C8A96E' }} />
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase mb-1 font-semibold" style={{ color: '#C8A96E' }}>
                  Why EVO chose this
                </p>
                <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {vendor.whyChosen}
                </p>
              </div>
            </div>
          )}

          {/* EVO Trust details */}
          <div className="mx-5 mt-4 p-4 rounded-2xl"
            style={{ background: 'rgba(45,27,105,0.05)', border: '1px solid rgba(45,27,105,0.12)' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>
                EVO Verification
              </p>
            </div>
            <div className="space-y-2">
              {[
                'Personally vetted by EVO curators',
                'Business license & insurance verified',
                'Past event references checked',
                'Quality standards confirmed on-site',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(45,27,105,0.1)' }}>
                    <span className="text-[9px] font-bold" style={{ color: 'var(--primary)' }}>✓</span>
                  </div>
                  <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio strip */}
          <div className="mt-5 px-5">
            <div className="flex items-center gap-2 mb-3">
              <Image size={13} style={{ color: 'var(--text-muted)' }} />
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Portfolio
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {portfolioImages.map((img, i) => (
                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden shrink-0"
                  style={{ opacity: 0.85 + i * 0.05 }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-5 px-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Client Reviews
            </p>
            <div className="space-y-3">
              {fakeReviews.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--primary-dim)', color: 'var(--primary)' }}>
                        {r.name[0]}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={9} style={{ color: '#C8A96E', fill: s <= r.rating ? '#C8A96E' : 'none' }} />
                    ))}
                  </div>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <motion.button onClick={onSwap} whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 text-sm font-semibold tracking-wide rounded-full mb-2 flex items-center justify-center gap-2"
            style={{ background: 'var(--elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            <RefreshCw size={13} /> Swap this vendor
          </motion.button>
          <motion.button onClick={onClose} whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase rounded-full"
            style={{ background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}>
            Keep this vendor
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Screen ──────────────────────────────────────────────────────────────
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

  const [profileSection, setProfileSection] = useState(null) // section object for vendor sheet
  const pageRef = useRef(null)

  // Always scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    if (pageRef.current) pageRef.current.scrollTop = 0
  }, [])

  // ── Determine which flow we're in ────────────────────────────────────────
  const isAIFlow = !!eventPackage

  // ── AI flow derived data ─────────────────────────────────────────────────
  const aiTotal   = totalPrice
  const aiDeposit = depositAmount

  // ── Manual flow derived data ─────────────────────────────────────────────
  const selectedEntries     = Object.entries(selectedSuppliers)
  const selectedCategoryIds = Object.keys(selectedSuppliers)
  const missingCategories   = categories.filter(c => !selectedCategoryIds.includes(c.id))
  const manualDeposit       = Math.round(totalBudget * 0.2)

  const effectiveTotal   = isAIFlow ? aiTotal   : totalBudget
  const effectiveDeposit = isAIFlow ? aiDeposit : manualDeposit

  const formatPrice = (n) => `₪${n.toLocaleString()}`

  const eventName = isAIFlow
    ? eventPackage.name
    : (generatedEvent?.name || 'Your Curated Evening')

  const guestCount = briefAnswers?.scale
    ? { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }[briefAnswers.scale] || briefAnswers.scale
    : null

  // CTA navigation: venue questions if hasVenue, else personal questions
  const handleContinue = () => {
    if (briefAnswers?.hasVenue === true) {
      navigate('venuequestions')
    } else {
      navigate('personalquestions')
    }
  }

  return (
    <div ref={pageRef} className="w-full min-h-screen flex flex-col overflow-y-auto pb-28" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md border-b px-6 pt-12 pb-4"
        style={{ background: 'rgba(245,245,247,0.95)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(isAIFlow ? 'package' : 'categories')}
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-light tracking-wide flex-1" style={{ color: 'var(--text-primary)' }}>
            Event Summary
          </h1>
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

        {/* ── AI FLOW: Expandable vendor cards ─────────────────────────────── */}
        {isAIFlow && (
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-4"
              style={{ color: 'var(--text-muted)' }}>
              Tap any card to see what's included
            </p>
            <div className="space-y-3">
              {eventPackage.sections.map((section, i) => (
                <VendorCard
                  key={section.id}
                  section={section}
                  index={i}
                  openSwapSheet={openSwapSheet}
                  openProfile={setProfileSection}
                />
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
                        <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--primary)' }}>
                          {formatPrice(price)} — {supplier.selectedPackage?.name || 'Premium'}
                        </p>
                      </div>
                      <button onClick={() => removeSupplier(catId)}
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
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
                Every vendor here was hand-picked for your event. Tap "View" on any vendor to see their full profile, reviews, and why EVO chose them.
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
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.vendor.name}</span>
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
          <motion.button onClick={handleContinue} whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all"
            style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-accent)' }}>
            Continue to my event →
          </motion.button>
        </div>
      )}

      {/* Vendor Profile Sheet */}
      {profileSection && (
        <VendorSheet
          vendor={profileSection.vendor}
          sectionLabel={profileSection.label}
          sectionId={profileSection.id}
          onClose={() => setProfileSection(null)}
          onSwap={() => { setProfileSection(null); openSwapSheet(profileSection.id) }}
        />
      )}
    </div>
  )
}
