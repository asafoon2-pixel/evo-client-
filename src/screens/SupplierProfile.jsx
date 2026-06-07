import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Clock, Camera, MessageCircle,
  Phone, MapPin, Globe, Instagram,
  ChevronDown, ChevronUp, ShoppingCart, Plus, Check as CheckIcon, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'
import { getVendorPackages, getVendorProducts } from '../lib/suppliersService'
import { track } from '../lib/analyticsService'

const PRICE_TYPE_LABEL = {
  fixed:     '',
  per_hour:  ' / שעה',
  per_guest: ' / אורח',
}

export default function SupplierProfile() {
  const {
    navigate, currentSupplier, currentCategory,
    addToCart, cart, cartCount,
    selectedSuppliers,
  } = useApp()

  const isSelected = selectedSuppliers?.[currentCategory]?.id === currentSupplier?.id

  const [selectedPackage, setSelectedPackage] = useState(null)
  const [packages,        setPackages]        = useState([])
  const [products,        setProducts]        = useState([])
  const [pkgLoading,      setPkgLoading]      = useState(true)
  const [prodLoading,     setProdLoading]     = useState(true)
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState(null)

  // Track supplier view on mount
  useEffect(() => {
    if (!currentSupplier?.id) return
    track.viewSupplier(currentSupplier.id, currentSupplier.category)
  }, [currentSupplier?.id])

  // Load packages
  useEffect(() => {
    if (!currentSupplier?.id) return
    setPkgLoading(true)
    getVendorPackages(currentSupplier.id)
      .then(pkgs => {
        setPackages(pkgs)
        if (pkgs.length > 0) setSelectedPackage(pkgs[0])
      })
      .catch(console.error)
      .finally(() => setPkgLoading(false))
  }, [currentSupplier?.id])

  // Load products
  useEffect(() => {
    if (!currentSupplier?.id) return
    setProdLoading(true)
    getVendorProducts(currentSupplier.id)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setProdLoading(false))
  }, [currentSupplier?.id])

  if (!currentSupplier) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <button onClick={() => navigate('supplierList')} style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={20} />
        </button>
      </div>
    )
  }

  const cat = categories.find(c => c.id === currentCategory)

  const renderStars = (rating, size = 14) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        style={i < Math.floor(rating)
          ? { color: 'var(--primary)', fill: 'var(--primary)' }
          : { color: 'rgba(44,32,22,0.2)' }}
      />
    ))

  const pkg = selectedPackage || packages[0] || null
  const displayPrice = pkg ? `₪${pkg.price.toLocaleString()}${PRICE_TYPE_LABEL[pkg.priceType] || ''}` : '—'

  const visibleProducts = showAllProducts ? products : products.slice(0, 3)

  const instagramHandle = currentSupplier.instagram?.replace('@', '') || ''
  const websiteUrl = currentSupplier.website
    ? (currentSupplier.website.startsWith('http') ? currentSupplier.website : `https://${currentSupplier.website}`)
    : ''

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-28" style={{ background: 'var(--background)' }}>
      {/* Hero image */}
      <div className="relative h-[52vw] min-h-[200px] max-h-72 shrink-0" style={{ background: 'var(--elevated)' }}>
        {currentSupplier.image ? (
          <img
            src={currentSupplier.image}
            alt={currentSupplier.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            <Camera size={40} style={{ color: 'var(--text-dim)' }} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(245,240,232,0.9) 100%)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate(currentCategory ? 'supplierList' : 'allSuppliersMap')}
          className="absolute top-12 right-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <ArrowLeft size={18} className="text-white" style={{ transform: 'scaleX(-1)' }} />
        </button>

        {/* Cart count badge — shown in hero only when cart has items, navigates to cart */}
        {cartCount > 0 && (
          <button
            onClick={() => navigate('cart')}
            className="absolute top-12 left-5 h-10 px-3 rounded-full flex items-center gap-1.5"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <ShoppingCart size={15} className="text-white" />
            <span className="text-white text-xs font-bold">{cartCount}</span>
          </button>
        )}
      </div>

      <div className="px-6 -mt-6 relative z-10">
        {/* Name + category */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {currentSupplier.name}
            </h1>
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
          {currentSupplier.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">{renderStars(currentSupplier.rating)}</div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{currentSupplier.rating}</span>
              {currentSupplier.reviewCount > 0 && (
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({currentSupplier.reviewCount})</span>
              )}
            </div>
          )}
          {currentSupplier.eventsCount > 0 && (
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
          {currentSupplier.yearsExperience > 0 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Star size={12} />
              <span>{currentSupplier.yearsExperience}+ שנות ניסיון</span>
            </div>
          )}
        </div>

        {/* Price range */}
        {currentSupplier.priceRange && (
          <div className="mb-6">
            <span className="text-evo-accent text-xl font-light">{currentSupplier.priceRange}</span>
          </div>
        )}

        {/* About */}
        <div className="mb-8">
          <h2 className="section-title mb-3">אודות</h2>
          <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)' }}>
            {currentSupplier.fullDescription || currentSupplier.shortDescription}
          </p>
        </div>

        {/* Packages */}
        <div className="mb-8">
          <h2 className="section-title mb-4">חבילות</h2>
          {pkgLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            </div>
          ) : packages.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>אין חבילות זמינות</p>
          ) : (
            <div className="space-y-3">
              {packages.map((p) => {
                const isActive = selectedPackage?.id === p.id
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => setSelectedPackage(p)}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-right rounded-evo transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(107,95,228,0.07)' : 'var(--surface)',
                      border: isActive ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Package image */}
                    {p.image && (
                      <div
                        className="w-full h-32 overflow-hidden"
                        onClick={e => { e.stopPropagation(); setLightboxUrl(p.image) }}
                      >
                        <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                          {p.badge === 'most_popular' && (
                            <span className="text-[10px] tracking-widest uppercase rounded-full px-2 py-0.5"
                              style={{ color: 'var(--primary)', border: '1px solid rgba(107,95,228,0.4)' }}>פופולרי</span>
                          )}
                          {p.badge === 'best_value' && (
                            <span className="text-[10px] tracking-widest uppercase rounded-full px-2 py-0.5"
                              style={{ color: 'var(--success)', border: '1px solid var(--success-border)' }}>משתלם</span>
                          )}
                          {p.badge === 'evo_recommended' && (
                            <span className="text-[10px] tracking-widest uppercase rounded-full px-2 py-0.5"
                              style={{ color: '#E8884F', border: '1px solid rgba(232,136,79,0.4)' }}>מומלץ EVO</span>
                          )}
                        </div>
                        <div className="text-left shrink-0">
                          <span className="text-lg font-light" style={{ color: isActive ? 'var(--primary)' : 'var(--text-primary)' }}>
                            ₪{p.price.toLocaleString()}
                          </span>
                          {PRICE_TYPE_LABEL[p.priceType] && (
                            <span className="text-[10px] mr-1" style={{ color: 'var(--text-dim)' }}>{PRICE_TYPE_LABEL[p.priceType]}</span>
                          )}
                        </div>
                      </div>
                      {p.description && (
                        <p className="text-xs leading-relaxed text-right mb-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                      )}
                      {/* Guest / hour info */}
                      {(p.minGuests > 0 || p.maxGuests > 0 || p.minHours > 0) && (
                        <div className="flex gap-3 flex-wrap mt-2">
                          {(p.minGuests > 0 || p.maxGuests > 0) && (
                            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                              {p.minGuests}–{p.maxGuests} אורחים
                            </span>
                          )}
                          {p.minHours > 0 && (
                            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                              {p.minHours}+ שעות
                            </span>
                          )}
                        </div>
                      )}
                      {/* Add-ons */}
                      {p.addOns && p.addOns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.addOns.map((ao, i) => (
                            <span key={i} className="text-[10px] rounded-full px-2 py-0.5"
                              style={{ background: 'var(--elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                              + {ao}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Add to cart */}
                      {(() => {
                        const inCart = cart.some(c => c.cartId === `${currentSupplier.id}_package_${p.id}`)
                        return (
                          <button
                            onClick={e => { e.stopPropagation(); addToCart(currentSupplier.id, currentSupplier.name, 'package', p) }}
                            className="mt-3 w-full py-2 rounded-evo-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                            style={inCart
                              ? { background: 'var(--success-dim)', color: 'var(--success)', border: '1.5px solid var(--success-border)' }
                              : { background: 'rgba(107,95,228,0.07)', color: 'var(--primary)', border: '1.5px solid rgba(107,95,228,0.25)' }
                            }
                          >
                            {inCart ? <><CheckIcon size={12} /> בסל</> : <><Plus size={12} /> הוסף לסל</>}
                          </button>
                        )
                      })()}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Gallery — moved after packages so the commercial decision comes first */}
        <div className="mb-8">
          <h2 className="section-title mb-3">גלריה</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {currentSupplier.image && (
              <button onClick={() => setLightboxUrl(currentSupplier.image)} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 active:scale-95 transition-transform" style={{ background: 'var(--border)' }}>
                <img src={currentSupplier.image} alt="" className="w-full h-full object-cover" />
              </button>
            )}
            {(currentSupplier.gallery || []).map((img, i) => (
              <button key={i} onClick={() => setLightboxUrl(img)} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 active:scale-95 transition-transform" style={{ background: 'var(--border)' }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {packages.filter(p => p.image).slice(0, 3).map(p => (
              <button key={`pkg-${p.id}`} onClick={() => setLightboxUrl(p.image)} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative active:scale-95 transition-transform" style={{ background: 'var(--border)' }}>
                <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
                  <p className="text-[10px] text-white text-center truncate leading-tight">{p.label}</p>
                </div>
              </button>
            ))}
            {products.filter(p => p.image).slice(0, 3).map(p => (
              <button key={`prod-${p.id}`} onClick={() => setLightboxUrl(p.image)} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative active:scale-95 transition-transform" style={{ background: 'var(--border)' }}>
                <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
                  <p className="text-[10px] text-white text-center truncate leading-tight">{p.label}</p>
                </div>
              </button>
            ))}
            {!currentSupplier.image && packages.every(p => !p.image) && products.every(p => !p.image) && (
              <div className="w-24 h-24 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Camera size={20} style={{ color: 'var(--text-dim)' }} />
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="section-title mb-4">מוצרים בודדים</h2>
          {prodLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>אין מוצרים בודדים זמינים</p>
          ) : (
            <div className="space-y-3">
              {visibleProducts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-evo overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
                  >
                    {p.image && (
                      <button onClick={() => setLightboxUrl(p.image)} className="w-full h-28 overflow-hidden block">
                        <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                      </button>
                    )}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.label}</p>
                          {p.description && (
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                          )}
                          {p.maxGuests > 0 && (
                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>עד {p.maxGuests} אורחים</p>
                          )}
                        </div>
                        <div className="text-left shrink-0 mr-3">
                          <span className="text-base font-light" style={{ color: 'var(--text-primary)' }}>
                            ₪{p.price.toLocaleString()}
                          </span>
                          {PRICE_TYPE_LABEL[p.priceType] && (
                            <span className="text-[10px] block" style={{ color: 'var(--text-dim)' }}>{PRICE_TYPE_LABEL[p.priceType].trim()}</span>
                          )}
                        </div>
                      </div>
                      {(() => {
                        const inCart = cart.some(c => c.cartId === `${currentSupplier.id}_product_${p.id}`)
                        return (
                          <button
                            onClick={() => addToCart(currentSupplier.id, currentSupplier.name, 'product', p)}
                            className="w-full py-2.5 rounded-evo-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                            style={inCart
                              ? { background: 'var(--success-dim)', color: 'var(--success)', border: '1.5px solid var(--success-border)' }
                              : { background: 'transparent', color: 'var(--primary)', border: '1.5px solid rgba(107,95,228,0.35)' }
                            }
                          >
                            {inCart
                              ? <><CheckIcon size={12} /> נוסף לסל</>
                              : <><Plus size={12} /> הוסף לסל · ₪{(p.price || 0).toLocaleString()}</>
                            }
                          </button>
                        )
                      })()}
                    </div>
                  </div>
                ))}
                {products.length > 3 && (
                  <button
                    onClick={() => setShowAllProducts(v => !v)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--primary)' }}
                  >
                    {showAllProducts ? (
                      <><ChevronUp size={14} /> הצג פחות</>
                    ) : (
                      <><ChevronDown size={14} /> הצג עוד {products.length - 3} מוצרים</>
                    )}
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Contact info */}
        {(currentSupplier.phone || currentSupplier.whatsapp || currentSupplier.city || currentSupplier.instagram || currentSupplier.website) && (
          <div className="mb-8 rounded-evo p-4 space-y-3" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>פרטי קשר</p>
            {currentSupplier.city && (
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{currentSupplier.city}</span>
              </div>
            )}
            {currentSupplier.phone && (
              <a href={`tel:${currentSupplier.phone}`} className="flex items-center gap-2">
                <Phone size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{currentSupplier.phone}</span>
              </a>
            )}
            {currentSupplier.whatsapp && (
              <a
                href={`https://wa.me/${currentSupplier.whatsapp.replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle size={14} style={{ color: '#25D366' }} />
                <span className="text-sm font-medium" style={{ color: '#25D366' }}>וואטסאפ</span>
              </a>
            )}
            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram size={14} style={{ color: '#E1306C' }} />
                <span className="text-sm font-medium" style={{ color: '#E1306C' }}>@{instagramHandle}</span>
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Globe size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                  {currentSupplier.website.replace(/^https?:\/\//, '')}
                </span>
              </a>
            )}
          </div>
        )}

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.93)' }}
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-12 left-5 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <X size={18} className="text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              src={lightboxUrl}
              alt=""
              className="max-w-full max-h-[80vh] rounded-2xl object-contain px-4"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        {pkg && (
          <p className="text-center text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {pkg.label} · <span style={{ color: 'var(--primary)' }}>{displayPrice}</span>
          </p>
        )}
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(currentCategory ? 'supplierList' : 'categories')}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <ArrowLeft size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
          {/* Add selected package to cart, or go to cart if already added */}
          {(() => {
            const pkgInCart = pkg && cart.some(c => c.cartId === `${currentSupplier.id}_package_${pkg.id}`)
            return (
              <button
                onClick={() => {
                  if (pkgInCart) navigate('cart')
                  else if (pkg) addToCart(currentSupplier.id, currentSupplier.name, 'package', pkg)
                }}
                className="flex-1 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  background: pkgInCart ? 'var(--success)' : pkg ? 'var(--primary)' : 'var(--surface)',
                  color: pkgInCart || pkg ? '#fff' : 'var(--text-muted)',
                  border: pkg ? 'none' : '1.5px solid var(--border)',
                  boxShadow: pkg ? 'var(--shadow-accent)' : 'none',
                }}
              >
                {pkgInCart
                  ? <><CheckIcon size={15} /> עבור לסל</>
                  : pkg
                    ? <><ShoppingCart size={15} /> הוסף לסל · {displayPrice}</>
                    : 'בחר חבילה'
                }
              </button>
            )
          })()}
          <button
            onClick={() => navigate('cart')}
            className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: cartCount > 0 ? 'var(--primary)' : 'var(--surface)', border: cartCount > 0 ? 'none' : '1.5px solid var(--border)' }}>
            <ShoppingCart size={16} style={{ color: cartCount > 0 ? '#fff' : 'var(--text-muted)' }} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--success)' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
