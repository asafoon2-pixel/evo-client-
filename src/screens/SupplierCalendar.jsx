import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, ChevronLeft, Check, X, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { subscribeAvailability, setAvailability, getVendorById } from '../lib/suppliersService'

const MONTHS_HE = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const DAYS_HE   = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']

function pad(n) { return String(n).padStart(2, '0') }
function toKey(y, m, d) { return `${y}-${pad(m)}-${pad(d)}` }

export default function SupplierCalendar() {
  const { navigate, currentUser } = useApp()

  const today  = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  // { 'YYYY-MM-DD': boolean }  — only dates with an explicit override
  const [availability, setAvailabilityMap] = useState({})
  const [saving,   setSaving]   = useState(null)   // dateStr being saved
  const [vendor,   setVendor]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [notVendor, setNotVendor] = useState(false)

  // Verify current user is a vendor
  useEffect(() => {
    if (!currentUser) { navigate('authgate'); return }
    getVendorById(currentUser.uid).then(v => {
      if (!v) { setNotVendor(true); setLoading(false) }
      else    { setVendor(v);       setLoading(false)  }
    }).catch(() => { setNotVendor(true); setLoading(false) })
  }, [currentUser])

  // Real-time availability listener
  useEffect(() => {
    if (!vendor) return
    const unsub = subscribeAvailability(vendor.id, year, month, setAvailabilityMap)
    return unsub
  }, [vendor, year, month])

  // Calendar grid
  const daysInMonth  = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay() // 0=Sun
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, i) =>
    i < firstWeekday ? null : i - firstWeekday + 1
  )

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleToggle = useCallback(async (day) => {
    if (!vendor || saving) return
    const key = toKey(year, month, day)
    const current = availability[key]
    // Default is available (true). Clicking toggles:
    // undefined/true → false (unavailable), false → true (available)
    const next = current === false ? true : false
    setSaving(key)
    try {
      await setAvailability(vendor.id, key, next)
    } finally {
      setSaving(null)
    }
  }, [vendor, year, month, availability, saving])

  const isPast = (day) => {
    const d = new Date(year, month - 1, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t
  }

  const getStatus = (day) => {
    const key = toKey(year, month, day)
    if (availability[key] === false) return 'unavailable'
    if (availability[key] === true)  return 'available'
    return 'default' // no override — implicitly available
  }

  // Summary counts
  const unavailableCount = Object.values(availability).filter(v => v === false).length
  const availableCount   = daysInMonth - unavailableCount

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  if (notVendor) return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--background)' }}>
      <Calendar size={40} style={{ color: 'var(--text-dim)', marginBottom: 16 }} />
      <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>הדף הזה מיועד לספקים בלבד</p>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>החשבון שלך אינו רשום כספק ב-EVO.</p>
      <button onClick={() => navigate('home')} className="text-sm font-semibold px-6 py-3 rounded-full" style={{ background: 'var(--primary)', color: '#fff' }}>
        חזרה לדף הבית
      </button>
    </div>
  )

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-10 pb-4"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate('userprofile')}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <ArrowLeft size={16} style={{ color: 'var(--text-muted)', transform: 'scaleX(-1)' }} />
          </button>
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>ניהול זמינות</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{vendor?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-5 pb-24">

        {/* Summary chips */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(74,158,114,0.10)', border: '1px solid rgba(74,158,114,0.25)' }}>
            <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>{availableCount}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>ימים פנויים</p>
          </div>
          <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(212,96,122,0.10)', border: '1px solid rgba(212,96,122,0.25)' }}>
            <p className="text-xl font-bold" style={{ color: '#D4607A' }}>{unavailableCount}</p>
            <p className="text-xs mt-0.5" style={{ color: '#D4607A' }}>ימים חסומים</p>
          </div>
        </div>

        {/* Month navigation */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="text-center">
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {MONTHS_HE[month - 1]} {year}
              </p>
            </div>

            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <ChevronLeft size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS_HE.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--text-dim)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 px-3 pb-4">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />

              const past   = isPast(day)
              const status = getStatus(day)
              const key    = toKey(year, month, day)
              const isSaving = saving === key
              const isToday  = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()

              let bg, textColor, border
              if (past) {
                bg = 'transparent'; textColor = 'var(--text-dim)'; border = 'none'
              } else if (status === 'unavailable') {
                bg = 'rgba(212,96,122,0.15)'; textColor = '#D4607A'; border = '1.5px solid rgba(212,96,122,0.35)'
              } else {
                // available (default or explicit)
                bg = 'rgba(74,158,114,0.12)'; textColor = 'var(--success)'; border = '1.5px solid rgba(74,158,114,0.3)'
              }

              if (isToday && !past) {
                border = `1.5px solid var(--primary)`
              }

              return (
                <motion.button
                  key={key}
                  onClick={() => !past && handleToggle(day)}
                  disabled={past || !!saving}
                  whileTap={!past ? { scale: 0.88 } : {}}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center relative transition-colors"
                  style={{ background: bg, border, cursor: past ? 'default' : 'pointer', opacity: past ? 0.35 : 1 }}
                >
                  {isSaving ? (
                    <div className="w-3 h-3 rounded-full border animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  ) : (
                    <>
                      <span className="text-xs font-semibold" style={{ color: past ? 'var(--text-dim)' : textColor }}>
                        {day}
                      </span>
                      {!past && status === 'unavailable' && (
                        <X size={8} style={{ color: '#D4607A', position: 'absolute', bottom: 3 }} strokeWidth={3} />
                      )}
                      {!past && status !== 'unavailable' && (
                        <Check size={8} style={{ color: 'var(--success)', position: 'absolute', bottom: 3 }} strokeWidth={3} />
                      )}
                    </>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md" style={{ background: 'rgba(74,158,114,0.15)', border: '1.5px solid rgba(74,158,114,0.35)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>פנוי</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md" style={{ background: 'rgba(212,96,122,0.15)', border: '1.5px solid rgba(212,96,122,0.35)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>לא פנוי</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md" style={{ border: '1.5px solid var(--primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>היום</span>
          </div>
        </div>

        {/* Tip */}
        <p className="text-xs text-center px-4" style={{ color: 'var(--text-dim)' }}>
          לחץ על תאריך כדי לשנות זמינות — השינויים נשמרים באופן מיידי
        </p>

      </div>
    </div>
  )
}
