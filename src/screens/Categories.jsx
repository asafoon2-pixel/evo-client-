import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

// ── SVG Illustrations ──────────────────────────────────────────────────────
function SoundIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <rect x="8" y="20" width="12" height="20" rx="3" stroke="#6B5FE4" strokeWidth="1.8"/>
      <path d="M20 23L33 14V46L20 37" stroke="#6B5FE4" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M37 23c3 3.5 3 10.5 0 14" stroke="#6B5FE4" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M43 18c5 6 5 18 0 24" stroke="#6B5FE4" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"/>
    </svg>
  )
}

function LightingIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="26" r="9" stroke="#C8973A" strokeWidth="1.8"/>
      <circle cx="30" cy="26" r="4" fill="#C8973A" opacity="0.22"/>
      <path d="M25 35l-2 9h14l-2-9" stroke="#C8973A" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M25 44h10" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M30 7v5" stroke="#C8973A" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
      <path d="M13 13l3.5 3.5M47 13l-3.5 3.5" stroke="#C8973A" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"/>
      <path d="M7 28h5M48 28h5" stroke="#C8973A" strokeWidth="1.4" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

function DecorIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="5" stroke="#4A9E72" strokeWidth="1.8" fill="#4A9E72" fillOpacity="0.18"/>
      <ellipse cx="30" cy="17" rx="4" ry="7.5" stroke="#4A9E72" strokeWidth="1.7"/>
      <ellipse cx="30" cy="43" rx="4" ry="7.5" stroke="#4A9E72" strokeWidth="1.7"/>
      <ellipse cx="17" cy="30" rx="7.5" ry="4" stroke="#4A9E72" strokeWidth="1.7"/>
      <ellipse cx="43" cy="30" rx="7.5" ry="4" stroke="#4A9E72" strokeWidth="1.7"/>
      <ellipse cx="20.5" cy="20.5" rx="4" ry="7" transform="rotate(-45 20.5 20.5)" stroke="#4A9E72" strokeWidth="1.4" opacity="0.5"/>
      <ellipse cx="39.5" cy="39.5" rx="4" ry="7" transform="rotate(-45 39.5 39.5)" stroke="#4A9E72" strokeWidth="1.4" opacity="0.5"/>
    </svg>
  )
}

function BarIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <path d="M12 10h36L30 36V49" stroke="#D4607A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 49h16" stroke="#D4607A" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="38" cy="20" r="3.5" fill="#D4607A" fillOpacity="0.35"/>
      <path d="M36 13l6 13" stroke="#D4607A" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      <path d="M20 24h8" stroke="#D4607A" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

function PhotographyIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <rect x="7" y="20" width="46" height="30" rx="6" stroke="#2C8EBB" strokeWidth="1.8"/>
      <circle cx="30" cy="35" r="9" stroke="#2C8EBB" strokeWidth="1.8"/>
      <circle cx="30" cy="35" r="4.5" fill="#2C8EBB" fillOpacity="0.18"/>
      <path d="M22 20l4-8h8l4 8" stroke="#2C8EBB" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="46" cy="28" r="2.5" fill="#2C8EBB" fillOpacity="0.45"/>
    </svg>
  )
}

function EntertainmentIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <path d="M20 40V20l28-6v20" stroke="#6B5FE4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="42" r="5.5" stroke="#6B5FE4" strokeWidth="1.8"/>
      <circle cx="44" cy="36" r="5.5" stroke="#6B5FE4" strokeWidth="1.8"/>
      <path d="M20 28l28-6" stroke="#6B5FE4" strokeWidth="1.3" opacity="0.35"/>
    </svg>
  )
}

function CateringIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <path d="M8 40h44" stroke="#E8A030" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 40C12 29.5 20.3 21 30 21s18 8.5 18 19" stroke="#E8A030" strokeWidth="1.8"/>
      <path d="M22 21v-4M30 20v-5M38 21v-4" stroke="#E8A030" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M20 49h20" stroke="#E8A030" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 44h28" stroke="#E8A030" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"/>
    </svg>
  )
}

function TransportIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 60 60" fill="none">
      <rect x="4" y="22" width="38" height="24" rx="5" stroke="#7B8FA1" strokeWidth="1.8"/>
      <path d="M42 30h8l5 11v7H42" stroke="#7B8FA1" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="14" cy="47" r="5" stroke="#7B8FA1" strokeWidth="1.8"/>
      <circle cx="44" cy="47" r="5" stroke="#7B8FA1" strokeWidth="1.8"/>
      <rect x="8" y="28" width="14" height="10" rx="2" stroke="#7B8FA1" strokeWidth="1.4" opacity="0.5"/>
      <rect x="26" y="28" width="12" height="10" rx="2" stroke="#7B8FA1" strokeWidth="1.4" opacity="0.5"/>
    </svg>
  )
}

// ── Card metadata ──────────────────────────────────────────────────────────
const CARD_META = {
  sound:         { gradient: 'linear-gradient(145deg, #EEEAF8 0%, #E2DCF6 100%)', Illus: SoundIllus },
  lighting:      { gradient: 'linear-gradient(145deg, #FDF5DF 0%, #F5E6BA 100%)', Illus: LightingIllus },
  decor:         { gradient: 'linear-gradient(145deg, #EEF7F1 0%, #D6EFE0 100%)', Illus: DecorIllus },
  bar:           { gradient: 'linear-gradient(145deg, #FDF0F3 0%, #F5D6DF 100%)', Illus: BarIllus },
  photography:   { gradient: 'linear-gradient(145deg, #EEF5FD 0%, #D4E8F8 100%)', Illus: PhotographyIllus },
  entertainment: { gradient: 'linear-gradient(145deg, #EEEAF8 0%, #DDD8F5 100%)', Illus: EntertainmentIllus },
  catering:      { gradient: 'linear-gradient(145deg, #FDF5E4 0%, #F5E2BC 100%)', Illus: CateringIllus },
  transport:     { gradient: 'linear-gradient(145deg, #F0F2F6 0%, #DDE2EC 100%)', Illus: TransportIllus },
}

export default function Categories() {
  const { navigate, selectedSuppliers, totalBudget, setCurrentCategory, generatedEvent } = useApp()

  const budgetTier = 60000
  const budgetPercent = Math.min((totalBudget / budgetTier) * 100, 100)
  const formatPrice = (n) => `₪${n.toLocaleString()}`

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.08)' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('home')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>בנה את האירוע שלך</h1>
        </div>

        {/* Budget bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>תקציב שנבחר</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
              {totalBudget > 0 ? formatPrice(totalBudget) : '₪0'}
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(44,32,22,0.10)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">

        {/* EVO recommendation card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-2xl p-5 flex gap-3 items-start"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRightWidth: 3,
            borderRightColor: 'var(--primary)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(107,95,228,0.10)', border: '1px solid rgba(107,95,228,0.25)' }}>
            <Zap size={12} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1.5 font-semibold" style={{ color: 'var(--primary)' }}>EVO ממליץ</p>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              על פי הטעם שלך, התחל עם{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>מקום</span>
              {' '}ו{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>אווירה</span>
              {' '}— הם מגדירים את כל השאר.
              {generatedEvent && (
                <span style={{ color: 'var(--text-muted)' }}> עבור "{generatedEvent.name}", אנו ממליצים להתחיל עם חלל ומצב רוח.</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const selected = selectedSuppliers[cat.id]
            const meta = CARD_META[cat.id] || { gradient: 'var(--surface)', Illus: null }
            const { gradient, Illus } = meta

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
                className="relative rounded-2xl overflow-hidden text-right active:scale-[0.98]"
                style={{
                  height: 168,
                  background: gradient,
                  border: selected ? '2px solid var(--primary)' : '1.5px solid rgba(44,32,22,0.07)',
                  boxShadow: selected ? '0 0 0 3px rgba(107,95,228,0.15)' : 'var(--shadow-card)',
                  transition: 'all 0.25s',
                }}
              >
                {/* Illustration */}
                {Illus && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 48 }}>
                    <Illus />
                  </div>
                )}

                {/* Selected badge */}
                {selected && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--primary)' }}>
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  </div>
                )}

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3"
                  style={{ background: 'linear-gradient(to top, rgba(245,240,232,0.92) 60%, transparent 100%)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
                  <p className="text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{cat.description}</p>
                  {selected ? (
                    <p className="text-[11px] mt-1 font-semibold" style={{ color: 'var(--primary)' }}>{selected.name}</p>
                  ) : (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>{cat.count} ספקים</p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {Object.keys(selectedSuppliers).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <button
              onClick={() => navigate('summary')}
              className="w-full py-4 rounded-full text-sm font-semibold tracking-wide"
              style={{ background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}
            >
              סקירת האירוע שלי ({Object.keys(selectedSuppliers).length} נבחרו)
            </button>
          </motion.div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
