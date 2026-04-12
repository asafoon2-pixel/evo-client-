import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Building2, TreePine } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { briefEventTypes, briefScales, briefBudgetTiers } from '../data/index'

const HOURS = [
  '07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00',
  '23:00','00:00','01:00','02:00',
]

function TimeWheel({ value, onChange, label }) {
  const ref = useRef(null)
  const ITEM_H = 52

  useEffect(() => {
    const idx = HOURS.indexOf(value)
    if (ref.current && idx >= 0) {
      ref.current.scrollTop = idx * ITEM_H
    }
  }, []) // eslint-disable-line

  const handleScroll = () => {
    if (!ref.current) return
    const idx = Math.round(ref.current.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(HOURS.length - 1, idx))
    if (HOURS[clamped] !== value) onChange(HOURS[clamped])
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <style>{`.tw-no-scrollbar::-webkit-scrollbar{display:none}`}</style>
      {label && (
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{label}</p>
      )}
      <div className="relative" style={{ width: 88 }}>
        {/* Selection highlight band */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-10 rounded-xl"
          style={{
            top: ITEM_H,
            height: ITEM_H,
            background: 'rgba(45,27,105,0.08)',
            border: '1px solid rgba(45,27,105,0.22)',
          }}
        />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="tw-no-scrollbar"
          style={{
            height: ITEM_H * 3,
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div style={{ height: ITEM_H }} />
          {HOURS.map((h) => (
            <div
              key={h}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className="flex items-center justify-center"
            >
              <span
                style={{
                  fontSize: h === value ? 20 : 15,
                  fontWeight: h === value ? 600 : 300,
                  color: h === value ? 'var(--primary)' : 'var(--text-dim)',
                  transition: 'all 0.15s',
                  letterSpacing: h === value ? '0.02em' : 0,
                }}
              >
                {h}
              </span>
            </div>
          ))}
          <div style={{ height: ITEM_H }} />
        </div>
      </div>
    </div>
  )
}

const MONTHS = ['ינו','פבר','מרץ','אפר','מאי','יוני','יולי','אוג','ספט','אוק','נוב','דצמ']
const DAYS   = ['א','ב','ג','ד','ה','ו','ש']

function CalendarPicker({ selected, onSelect }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const daysInMonth  = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const cells        = Array.from({ length: firstWeekday + daysInMonth }, (_, i) =>
    i < firstWeekday ? null : i - firstWeekday + 1
  )

  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }
  const prevMonth = () => {
    const now = new Date()
    if (year === now.getFullYear() && month === now.getMonth() + 1) return
    if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const isPast = (d) => new Date(year, month - 1, d) <= today

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} />
        </button>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {MONTHS[month - 1]} {year}
        </span>
        <button onClick={nextMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center rotate-180 transition-colors"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs py-1 font-medium" style={{ color: 'var(--text-dim)' }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const past    = isPast(day)
          const dateStr = `${MONTHS[month - 1]} ${day}, ${year}`
          const active  = selected === dateStr
          return (
            <button key={i} onClick={() => !past && onSelect(dateStr)} disabled={past}
              className="aspect-square rounded-xl text-sm transition-all flex items-center justify-center font-medium"
              style={{
                background: active ? 'var(--primary)' : 'transparent',
                color:      active ? '#fff' : past ? 'var(--text-dim)' : 'var(--text-muted)',
                boxShadow:  active ? '0 0 0 3px rgba(45,27,105,0.15)' : 'none',
                cursor:     past ? 'not-allowed' : 'pointer',
              }}>
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Progress summary chips ────────────────────────────────────────────────────
function SummaryChips({ answers, step }) {
  const chips = []

  if (step > 0 && answers.eventType) {
    const et = briefEventTypes.find(t => t.id === answers.eventType)
    if (et) chips.push({ key: 'type', label: et.label })
  }
  if (step > 1 && answers.scale) {
    const sc = briefScales.find(s => s.id === answers.scale)
    if (sc) chips.push({ key: 'scale', label: sc.sublabel + ' אורחים' })
  }
  if (step > 2 && answers.date) {
    chips.push({ key: 'date', label: answers.date === 'flexible' ? 'תאריך גמיש' : answers.date })
  }

  if (chips.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 px-6 pb-3">
        {chips.map(chip => (
          <motion.div key={chip.key}
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(45,27,105,0.08)', border: '1px solid rgba(45,27,105,0.15)' }}>
            <Check size={10} style={{ color: 'var(--primary)' }} strokeWidth={3} />
            <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{chip.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Option card with selection flash ─────────────────────────────────────────
function OptionCard({ active, justSelected, onClick, children, style = {}, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
      style={{
        border:     active ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
        boxShadow:  active ? '0 0 0 4px rgba(45,27,105,0.12)' : '0 1px 4px rgba(45,27,105,0.05)',
        borderRadius: 'var(--radius)',
        ...style,
      }}>
      {/* Selection flash overlay */}
      <AnimatePresence>
        {justSelected && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0.35 }} animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: 'var(--primary)' }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

// ── Inline SVG illustrations (EVO warm palette, stroke-based) ────────────────
function BirthdayIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <rect x="9" y="38" width="44" height="18" rx="5" fill="#E8B86D" opacity="0.75"/>
      <path d="M9 38 Q16 31 22 38 Q28 31 34 38 Q40 31 46 38 Q52 31 53 38" stroke="#FDFAF5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <rect x="15" y="25" width="32" height="15" rx="4" fill="#F2C49B" opacity="0.8"/>
      <path d="M15 25 Q21 19 27 25 Q33 19 39 25 Q45 19 47 25" stroke="#FDFAF5" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="22" y="13" width="4" height="14" rx="2" fill="#D4607A" opacity="0.85"/>
      <rect x="30" y="11" width="4" height="16" rx="2" fill="#6B5FE4" opacity="0.8"/>
      <rect x="38" y="13" width="4" height="14" rx="2" fill="#E8A030" opacity="0.85"/>
      <ellipse cx="24" cy="11" rx="2.5" ry="3.5" fill="#FFE090" opacity="0.9"/>
      <ellipse cx="32" cy="9" rx="2.5" ry="3.5" fill="#FFE090" opacity="0.9"/>
      <ellipse cx="40" cy="11" rx="2.5" ry="3.5" fill="#FFE090" opacity="0.9"/>
      <circle cx="7" cy="30" r="2" fill="#D4607A" opacity="0.35"/>
      <circle cx="55" cy="28" r="1.5" fill="#E8B86D" opacity="0.4"/>
    </svg>
  )
}

function WeddingIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <circle cx="24" cy="34" r="13" stroke="#C8A96E" strokeWidth="4" fill="rgba(200,169,110,0.08)"/>
      <circle cx="39" cy="34" r="13" stroke="#E8B86D" strokeWidth="4" fill="rgba(232,184,109,0.08)"/>
      <polygon points="31.5,12 34.5,19 31.5,26 28.5,19" fill="#9B8FD4" opacity="0.8"/>
      <polygon points="28.5,19 34.5,19 31.5,26" fill="#6B5FE4" opacity="0.6"/>
      <circle cx="10" cy="20" r="3.5" fill="#D4607A" opacity="0.55"/>
      <circle cx="10" cy="20" r="1.5" fill="#FDFAF5" opacity="0.9"/>
      <circle cx="52" cy="20" r="3.5" fill="#D4607A" opacity="0.55"/>
      <circle cx="52" cy="20" r="1.5" fill="#FDFAF5" opacity="0.9"/>
      <path d="M52 10 L53.5 14 L57 15.5 L53.5 17 L52 21 L50.5 17 L47 15.5 L50.5 14 Z" fill="#E8B86D" opacity="0.65"/>
    </svg>
  )
}

function CorporateIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <rect x="8" y="20" width="20" height="34" rx="2" stroke="#8B7A65" strokeWidth="1.8" fill="rgba(139,122,101,0.06)"/>
      <rect x="18" y="10" width="16" height="44" rx="2" stroke="#5A5040" strokeWidth="2" fill="rgba(90,80,64,0.09)"/>
      <rect x="36" y="26" width="18" height="28" rx="2" stroke="#8B7A65" strokeWidth="1.5" fill="rgba(139,122,101,0.05)"/>
      <rect x="22" y="15" width="5" height="6" rx="1" fill="#E8B86D" opacity="0.55"/>
      <rect x="29" y="15" width="5" height="6" rx="1" fill="#E8B86D" opacity="0.4"/>
      <rect x="10" y="27" width="5" height="5" rx="1" fill="#6B5FE4" opacity="0.35"/>
      <rect x="22" y="25" width="5" height="5" rx="1" fill="#6B5FE4" opacity="0.45"/>
      <rect x="29" y="25" width="5" height="5" rx="1" fill="#4A9E72" opacity="0.4"/>
      <rect x="22" y="34" width="5" height="5" rx="1" fill="#E8B86D" opacity="0.4"/>
      <rect x="38" y="33" width="5" height="5" rx="1" fill="#6B5FE4" opacity="0.35"/>
      <rect x="46" y="33" width="5" height="5" rx="1" fill="#4A9E72" opacity="0.35"/>
      <line x1="4" y1="54" x2="58" y2="54" stroke="#8B7A65" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

function SocialIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <rect x="6" y="10" width="9" height="9" rx="2.5" fill="#E8B86D" opacity="0.8" transform="rotate(15 10 14)"/>
      <rect x="45" y="7" width="7" height="7" rx="2" fill="#D4607A" opacity="0.7" transform="rotate(-20 48 10)"/>
      <rect x="46" y="30" width="8" height="8" rx="2.5" fill="#6B5FE4" opacity="0.65" transform="rotate(25 50 34)"/>
      <rect x="5" y="34" width="7" height="7" rx="2" fill="#4A9E72" opacity="0.65" transform="rotate(-10 8 37)"/>
      <path d="M27 42 L31 24 L36 42 Z" stroke="#C8A96E" strokeWidth="2" fill="rgba(200,169,110,0.15)" strokeLinejoin="round"/>
      <line x1="31" y1="42" x2="31" y2="54" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"/>
      <line x1="25" y1="54" x2="37" y2="54" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="30" cy="35" r="2" fill="#FDFAF5" opacity="0.85"/>
      <circle cx="32" cy="29" r="1.2" fill="#FDFAF5" opacity="0.7"/>
      <path d="M8 20 Q14 15 12 24 Q7 28 14 30" stroke="#E8A030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M50 14 Q46 21 53 24" stroke="#D4607A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M52 8 L53.5 12 L57 13 L53.5 14 L52 18 L50.5 14 L47 13 L50.5 12 Z" fill="#E8B86D" opacity="0.75"/>
    </svg>
  )
}

function PrivateIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <path d="M36 7 Q50 14 50 29 Q50 44 36 51 Q22 46 20 38 Q14 26 22 17 Q27 9 36 7 Z" stroke="#9B8FD4" strokeWidth="2" fill="rgba(155,143,212,0.1)"/>
      <path d="M34 11 Q45 17 45 29 Q45 40 34 46 Q23 42 21 34 Q16 24 24 17 Q27 12 34 11 Z" fill="rgba(155,143,212,0.08)"/>
      <circle cx="10" cy="13" r="2.5" fill="#E8B86D" opacity="0.9"/>
      <circle cx="50" cy="11" r="2" fill="#E8B86D" opacity="0.7"/>
      <circle cx="54" cy="32" r="2.5" fill="#9B8FD4" opacity="0.75"/>
      <circle cx="8" cy="42" r="2" fill="#E8B86D" opacity="0.6"/>
      <path d="M50 19 L52 24 L50 29 L48 24 Z" fill="#E8B86D" opacity="0.6"/>
      <path d="M12 27 L13.5 31 L12 35 L10.5 31 Z" fill="#9B8FD4" opacity="0.65"/>
      <circle cx="40" cy="42" r="1.5" fill="#B0A8E0" opacity="0.6"/>
      <circle cx="47" cy="47" r="1" fill="#B0A8E0" opacity="0.5"/>
      <line x1="40" y1="42" x2="47" y2="47" stroke="#B0A8E0" strokeWidth="0.8" opacity="0.4"/>
    </svg>
  )
}

function OtherIllus() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <path d="M31 7 L33.5 20 L46 17 L37 27 L46 31 L33.5 34 L36 47 L31 37 L26 47 L28.5 34 L16 31 L25 27 L16 17 L28.5 20 Z" stroke="#E8B86D" strokeWidth="1.8" fill="rgba(232,184,109,0.1)" strokeLinejoin="round"/>
      <path d="M52 12 L54 17 L52 22 L50 17 Z" fill="#6B5FE4" opacity="0.55"/>
      <path d="M11 17 L12.5 21 L11 25 L9.5 21 Z" fill="#4A9E72" opacity="0.55"/>
      <path d="M52 40 L54 45 L52 50 L50 45 Z" fill="#D4607A" opacity="0.5"/>
      <path d="M9 38 L10.5 42 L9 46 L7.5 42 Z" fill="#E8B86D" opacity="0.5"/>
      <circle cx="46" cy="28" r="3.5" stroke="#E8B86D" strokeWidth="1.5" fill="rgba(232,184,109,0.1)"/>
      <circle cx="16" cy="34" r="3" stroke="#6B5FE4" strokeWidth="1.5" fill="rgba(107,95,228,0.08)"/>
      <circle cx="31" cy="27" r="2.5" fill="#E8B86D" opacity="0.65"/>
    </svg>
  )
}

const ILLUS_MAP = {
  birthday:  BirthdayIllus,
  wedding:   WeddingIllus,
  corporate: CorporateIllus,
  social:    SocialIllus,
  private:   PrivateIllus,
  other:     OtherIllus,
}

// ── Graphics for event types ──────────────────────────────────────────────────
const EVENT_GRAPHICS = {
  birthday:  { gradient: 'linear-gradient(150deg, #FFF0E8 0%, #F5D8C0 100%)' },
  wedding:   { gradient: 'linear-gradient(150deg, #FDF5E4 0%, #F0E0C4 100%)' },
  corporate: { gradient: 'linear-gradient(150deg, #EEEAE0 0%, #DDD5C8 100%)' },
  social:    { gradient: 'linear-gradient(150deg, #FFF4E0 0%, #F5E0B8 100%)' },
  private:   { gradient: 'linear-gradient(150deg, #F0EEF8 0%, #E0D8F0 100%)' },
  other:     { gradient: 'linear-gradient(150deg, #EEF5E8 0%, #D8ECCC 100%)' },
}

const SCALE_GRAPHICS = {
  intimate: { gradient: 'linear-gradient(150deg, #F2EFF8 0%, #E4DCF0 100%)', accent: '#6B5FE4' },
  medium:   { gradient: 'linear-gradient(150deg, #EEF5E8 0%, #D8ECCC 100%)', accent: '#4A9E72' },
  grand:    { gradient: 'linear-gradient(150deg, #FFF4E0 0%, #F5E0B8 100%)', accent: '#C8763A' },
}

const BUDGET_GRAPHICS = {
  essential: { gradient: 'linear-gradient(150deg, #F5EDE0 0%, #EDD8C0 100%)', accent: '#8B6A3A' },
  elevated:  { gradient: 'linear-gradient(150deg, #EEEAE0 0%, #E0D5C8 100%)', accent: '#5A5040' },
  signature: { gradient: 'linear-gradient(150deg, #FDF5E4 0%, #F0E0B8 100%)', accent: '#C8A96E' },
}

function EventTypeCard({ t, active, justSelected, onClick }) {
  const g = EVENT_GRAPHICS[t.id] || EVENT_GRAPHICS.other
  const Illus = ILLUS_MAP[t.id] || OtherIllus
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="relative overflow-hidden transition-all duration-200"
      style={{
        height: 130,
        borderRadius: 'var(--radius)',
        border:    active ? '2px solid var(--primary)' : '1.5px solid rgba(44,32,22,0.08)',
        boxShadow: active
          ? '0 0 0 3px rgba(107,95,228,0.12), 0 4px 16px rgba(44,32,22,0.1)'
          : '0 2px 8px rgba(44,32,22,0.07)',
        background: g.gradient,
      }}>
      {/* Selection flash */}
      <AnimatePresence>
        {justSelected && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0.3 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ background: 'var(--primary)' }} />
        )}
      </AnimatePresence>
      {/* Illustration */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 28 }}>
        <Illus />
      </div>
      {/* Bottom label strip */}
      <div className="absolute bottom-0 inset-x-0 px-3 py-2.5 flex items-center justify-between"
        style={{
          background: 'rgba(253,250,245,0.88)',
          backdropFilter: 'blur(6px)',
          borderTop: '1px solid rgba(44,32,22,0.06)',
        }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--primary)' }}>
              <Check size={11} color="white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

function ScaleCard({ s, active, justSelected, onClick }) {
  const g = SCALE_GRAPHICS[s.id] || SCALE_GRAPHICS.medium
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden transition-all duration-200 w-full"
      style={{
        height: 88,
        borderRadius: 'var(--radius)',
        border:    active ? '2px solid var(--primary)' : '1.5px solid rgba(44,32,22,0.08)',
        boxShadow: active
          ? '0 0 0 3px rgba(107,95,228,0.12), 0 4px 12px rgba(44,32,22,0.08)'
          : '0 2px 8px rgba(44,32,22,0.06)',
        background: g.gradient,
      }}>
      {/* Selection flash */}
      <AnimatePresence>
        {justSelected && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0.3 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ background: 'var(--primary)' }} />
        )}
      </AnimatePresence>
      {/* Accent circle bg */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{ width: 64, height: 64, background: g.accent }} />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: g.accent, opacity: 0.85 }} />
            <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
          </div>
          <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>{s.sublabel} אורחים</p>
        </div>
        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            borderColor: active ? 'var(--primary)' : 'rgba(44,32,22,0.2)',
            background: active ? 'var(--primary)' : 'transparent',
          }}>
          {active && <Check size={13} color="white" strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  )
}

const steps = ['type', 'scale', 'date', 'budget', 'setting']

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function Brief() {
  const { navigate, briefAnswers, updateBrief } = useApp()
  const [step, setStep]                 = useState(0)
  const [justSelected, setJustSelected] = useState(null)
  const [startTime, setStartTime]       = useState(briefAnswers.startTime || '19:00')
  const [endTime, setEndTime]           = useState(briefAnswers.endTime   || '23:00')
  const [customBudget, setCustomBudget] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const selectAndAdvance = (key, value) => {
    updateBrief(key, value)
    setJustSelected(value)
    setTimeout(() => {
      setJustSelected(null)
      setStep(s => s + 1)
    }, 260)
  }

  const selectAndFinish = (key, value) => {
    updateBrief(key, value)
    setJustSelected(value)
    setTimeout(() => {
      setJustSelected(null)
      setStep(s => s + 1)
    }, 260)
  }

  const finishBrief = (key, value) => {
    updateBrief(key, value)
    setJustSelected(value)
    setTimeout(() => {
      setJustSelected(null)
      navigate('presummary')
    }, 260)
  }

  const back = () => {
    if (step === 0) navigate('home')
    else setStep(s => s - 1)
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Subtle animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {[
          { x: '8%',  y: '18%', size: 180, color: 'rgba(107,95,228,0.045)', dur: 9,  d: 0 },
          { x: '68%', y: '12%', size: 120, color: 'rgba(232,184,109,0.055)', dur: 11, d: 1 },
          { x: '15%', y: '62%', size: 150, color: 'rgba(74,158,114,0.04)',   dur: 13, d: 2 },
          { x: '72%', y: '65%', size: 100, color: 'rgba(212,96,122,0.04)',   dur: 10, d: 1.5 },
        ].map((b, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ left: b.x, top: b.y, width: b.size, height: b.size, background: b.color, filter: 'blur(40px)' }}
            animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
          />
        ))}
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-20 pt-5 pb-2" style={{ background: 'var(--background)' }}>
        <div className="flex items-center justify-between px-6 mb-3">
          <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
          </button>

          {/* Step progress bar */}
          <div className="flex gap-1.5 items-center">
            {steps.map((_, i) => (
              <motion.div key={i}
                animate={{ width: i < step ? 24 : i === step ? 16 : 6, opacity: i <= step ? 1 : 0.2 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-1.5 rounded-full"
                style={{ background: 'var(--primary)' }}
              />
            ))}
          </div>

          <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {step + 1} / {steps.length}
          </span>
        </div>

        {/* Accumulated selection chips */}
        <SummaryChips answers={briefAnswers} step={step} />

        {/* Separator */}
        <div className="h-px mx-6" style={{ background: 'var(--border)' }} />
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">

          {/* STEP 0 — Event type */}
          {step === 0 && (
            <motion.div key="type" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">מה אנחנו חוגגים?</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                בחר סוג אירוע
              </h2>

              <button onClick={() => navigate('categories')}
                className="w-full mb-5 py-3.5 text-sm font-bold transition-all active:scale-[0.98]"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(45,27,105,0.06)',
                  border: '1.5px solid rgba(45,27,105,0.18)',
                  color: 'var(--primary)',
                }}>
                יש לי אירוע — הוסף ספקים ←
              </button>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {briefEventTypes.map(t => (
                  <EventTypeCard key={t.id}
                    t={t}
                    active={briefAnswers.eventType === t.id}
                    justSelected={justSelected === t.id}
                    onClick={() => selectAndAdvance('eventType', t.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Scale */}
          {step === 1 && (
            <motion.div key="scale" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">מספר אורחים</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                כמה אנשים?
              </h2>
              <div className="flex flex-col gap-3">
                {briefScales.map(s => (
                  <ScaleCard key={s.id}
                    s={s}
                    active={briefAnswers.scale === s.id}
                    justSelected={justSelected === s.id}
                    onClick={() => selectAndAdvance('scale', s.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Date + Time */}
          {step === 2 && (
            <motion.div key="date" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6 overflow-y-auto">
              <p className="label-overline mb-2">תאריך ושעה</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-5" style={{ color: 'var(--text-primary)' }}>
                מתי זה?
              </h2>
              {briefAnswers.date && briefAnswers.date !== 'flexible' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 px-4 py-2 rounded-full inline-flex self-start items-center gap-2"
                  style={{ background: 'rgba(45,27,105,0.08)', border: '1.5px solid rgba(45,27,105,0.2)' }}>
                  <Check size={11} style={{ color: 'var(--primary)' }} strokeWidth={3} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{briefAnswers.date}</span>
                </motion.div>
              )}
              <CalendarPicker
                selected={briefAnswers.date}
                onSelect={d => updateBrief('date', d)}
              />
              <button onClick={() => updateBrief('date', 'flexible')}
                className="mt-4 text-sm font-medium text-center py-2.5 rounded-full transition-all"
                style={{
                  color: briefAnswers.date === 'flexible' ? 'var(--primary)' : 'var(--text-muted)',
                  border: briefAnswers.date === 'flexible' ? '1.5px solid rgba(45,27,105,0.4)' : '1.5px dashed rgba(45,27,105,0.2)',
                  background: briefAnswers.date === 'flexible' ? 'rgba(45,27,105,0.06)' : 'transparent',
                }}>
                {briefAnswers.date === 'flexible' ? '✓ תאריך גמיש' : 'אני גמיש עם התאריך'}
              </button>

              {/* Time pickers */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs tracking-widest uppercase text-center mb-4" style={{ color: 'var(--text-muted)' }}>
                  שעות האירוע
                </p>
                <div className="flex items-center justify-center gap-6">
                  <TimeWheel label="התחלה" value={startTime} onChange={setStartTime} />
                  <div className="text-2xl font-light" style={{ color: 'var(--text-dim)', marginTop: 20 }}>→</div>
                  <TimeWheel label="סיום" value={endTime} onChange={setEndTime} />
                </div>
              </div>

              {/* Continue */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  updateBrief('startTime', startTime)
                  updateBrief('endTime', endTime)
                  setStep(s => s + 1)
                }}
                className="mt-6 w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--primary)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-accent)',
                  opacity: briefAnswers.date ? 1 : 0.45,
                }}>
                המשך ←
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3 — Budget */}
          {step === 3 && (
            <motion.div key="budget" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">תקציב</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                מה הטווח שלך?
              </h2>
              <div className="flex flex-col gap-3">
                {briefBudgetTiers.map(t => {
                  const g = BUDGET_GRAPHICS[t.id] || BUDGET_GRAPHICS.elevated
                  const active = briefAnswers.budgetTier === t.id
                  return (
                    <motion.button key={t.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowCustomInput(false); selectAndFinish('budgetTier', t.id) }}
                      className="relative overflow-hidden transition-all duration-200"
                      style={{
                        height: 96,
                        borderRadius: 'var(--radius)',
                        border: active ? '2px solid var(--primary)' : '1.5px solid rgba(44,32,22,0.08)',
                        boxShadow: active
                          ? '0 0 0 3px rgba(107,95,228,0.12), 0 4px 12px rgba(44,32,22,0.08)'
                          : '0 2px 8px rgba(44,32,22,0.06)',
                        background: g.gradient,
                      }}>
                      <div className="absolute right-0 top-0 bottom-0 w-28 opacity-30"
                        style={{ background: `linear-gradient(to left, ${g.accent}40, transparent)` }} />
                      <div className="absolute inset-0 flex items-center justify-between px-5">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: g.accent, opacity: 0.9 }} />
                            <p className="font-semibold" style={{ fontSize: 15, color: 'var(--text-primary)' }}>{t.label}</p>
                          </div>
                          <p className="font-bold mt-0.5" style={{ color: g.accent, fontSize: 18 }}>{t.range}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            borderColor: active ? 'var(--primary)' : 'rgba(44,32,22,0.2)',
                            background: active ? 'var(--primary)' : 'transparent',
                          }}>
                          {active && <Check size={13} color="white" strokeWidth={3} />}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}

                {/* Custom "אחר" option */}
                <motion.div
                  className="relative overflow-hidden transition-all duration-200"
                  style={{
                    borderRadius: 'var(--radius)',
                    border: showCustomInput ? '2px solid var(--primary)' : '1.5px solid rgba(44,32,22,0.08)',
                    boxShadow: showCustomInput
                      ? '0 0 0 3px rgba(107,95,228,0.12), 0 4px 12px rgba(44,32,22,0.08)'
                      : '0 2px 8px rgba(44,32,22,0.06)',
                    background: 'linear-gradient(150deg, #F2EFF8 0%, #E8E3F5 100%)',
                  }}>
                  {!showCustomInput ? (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowCustomInput(true)}
                      className="w-full flex items-center justify-between px-5"
                      style={{ height: 96 }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)', opacity: 0.9 }} />
                          <p className="font-semibold" style={{ fontSize: 15, color: 'var(--text-primary)' }}>אחר</p>
                        </div>
                        <p className="font-light mt-0.5" style={{ color: 'var(--text-muted)', fontSize: 14 }}>הזן סכום מותאם אישית</p>
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: 'rgba(44,32,22,0.2)' }} />
                    </motion.button>
                  ) : (
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--primary)' }}>הזן תקציב בשקלים</p>
                      <div className="flex gap-3 items-center">
                        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(107,95,228,0.3)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>₪</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="50,000"
                            value={customBudget}
                            onChange={e => setCustomBudget(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent outline-none text-right font-semibold"
                            style={{ fontSize: 18, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!customBudget) return
                            updateBrief('budgetCustomAmount', Number(customBudget))
                            selectAndFinish('budgetTier', 'custom')
                          }}
                          className="px-5 py-3 rounded-xl font-semibold text-sm text-white"
                          style={{
                            background: customBudget ? 'var(--primary)' : 'rgba(107,95,228,0.35)',
                            opacity: customBudget ? 1 : 0.6,
                          }}>
                          המשך
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Indoor / Outdoor */}
          {step === 4 && (
            <motion.div key="setting" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">הגדרת האירוע</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                פנים או חוץ?
              </h2>
              <div className="flex flex-col gap-4 flex-1">
                {[
                  {
                    id: 'indoor',
                    label: 'פנים',
                    sublabel: 'מקום ממוזג, שליטה מלאה על האווירה',
                    Icon: Building2,
                    gradient: 'linear-gradient(to bottom, #7B6FE8, #9B8FD4)',
                  },
                  {
                    id: 'outdoor',
                    label: 'חוץ',
                    sublabel: 'אוויר פתוח, אור טבעי, גן או גג',
                    Icon: TreePine,
                    gradient: 'linear-gradient(to bottom, #5AB484, #4A9E72)',
                  },
                  {
                    id: 'hybrid',
                    label: 'היברידי',
                    sublabel: 'טקס בפנים, קבלת פנים בחוץ — או להפך',
                    Icon: null,
                    gradient: 'linear-gradient(to bottom, #E8B86D, #C8A056)',
                  },
                ].map(opt => {
                  const active = briefAnswers.indoorOutdoor === opt.id
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => finishBrief('indoorOutdoor', opt.id)}
                      className="relative flex-1 rounded-2xl overflow-hidden text-left transition-all"
                      style={{
                        minHeight: 110,
                        border: active ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                        boxShadow: active ? '0 0 0 4px rgba(45,27,105,0.12)' : '0 1px 4px rgba(45,27,105,0.05)',
                        background: 'var(--surface)',
                      }}
                    >
                      {/* Color accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: opt.gradient }} />
                      <div className="flex items-center justify-between px-5 py-5 pl-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            {opt.Icon && <opt.Icon size={18} style={{ color: 'var(--primary)' }} />}
                            {!opt.Icon && <span style={{ fontSize: 18 }}>🌿</span>}
                            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
                          </div>
                          <p className="text-sm font-light leading-snug" style={{ color: 'var(--text-muted)' }}>{opt.sublabel}</p>
                        </div>
                        <div className="ml-4 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            borderColor: active ? 'var(--primary)' : 'rgba(45,27,105,0.25)',
                            background: active ? 'var(--primary)' : 'transparent',
                          }}>
                          {active && <Check size={13} color="white" strokeWidth={3} />}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
