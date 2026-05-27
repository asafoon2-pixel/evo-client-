import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, CalendarDays, Users, ChevronLeft, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { listenToUserEvents } from '../lib/eventsService'

const f = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
})

const STATUS_STYLE = {
  active:     { label: 'פעיל',   bg: 'rgba(107,95,228,0.12)', color: '#6B5FE4' },
  draft:      { label: 'טיוטה',  bg: 'rgba(232,160,48,0.12)', color: '#E8A030' },
  completed:  { label: 'הסתיים', bg: 'rgba(74,158,114,0.12)', color: '#4A9E72' },
  cancelled:  { label: 'בוטל',   bg: 'rgba(212,96,122,0.12)', color: '#D4607A' },
}

const EVENT_TYPE_LABEL = {
  wedding: 'חתונה', birthday: 'יום הולדת', corporate: 'אירוע עסקי',
  bar_mitzvah: 'בר/בת מצווה', private: 'מסיבה פרטית', other: 'אחר',
}

export default function MyEvents() {
  const { currentUser, navigate, resetForNewEvent, loadEvent } = useApp()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    setError(null)
    const unsub = listenToUserEvents(currentUser.uid, evts => {
      setEvents(evts)
      setLoading(false)
    })
    return unsub
  }, [currentUser])

  const load = () => {} // kept for refresh button compatibility

  const startNew = () => {
    resetForNewEvent()
    navigate('brief')
  }

  return (
    <div className="w-full min-h-screen pb-28" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>האירועים שלי</h1>
          <button
            onClick={load}
            disabled={loading}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">

        {/* New event button */}
        <motion.button
          {...f(0)}
          onClick={startNew}
          className="w-full flex items-center gap-4 p-5 rounded-3xl transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #6B5FE4 0%, #5A4FD4 100%)',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)' }}>
            <Plus size={22} className="text-white" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-white text-sm font-bold">צור אירוע חדש</p>
            <p className="text-white/65 text-xs mt-0.5">בנה את האירוע הבא שלך עם AI</p>
          </div>
        </motion.button>

        {/* Divider */}
        {events.length > 0 && (
          <motion.p {...f(0.05)} className="text-xs font-semibold tracking-[0.2em] uppercase pt-2"
            style={{ color: 'var(--text-muted)' }}>
            אירועים קיימים
          </motion.p>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 flex items-center justify-center">
            <RefreshCw size={20} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div {...f(0.1)} className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(212,96,122,0.08)', border: '1px solid rgba(212,96,122,0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: '#D4607A' }}>{error}</p>
            <button onClick={load} className="text-xs mt-2 underline" style={{ color: '#D4607A' }}>נסה שנית</button>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <motion.div {...f(0.1)} className="rounded-3xl p-10 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <CalendarDays size={36} className="mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>עדיין אין אירועים</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>לחץ על "צור אירוע חדש" כדי להתחיל</p>
          </motion.div>
        )}

        {/* Event cards */}
        {!loading && events.map((evt, i) => {
          const status = STATUS_STYLE[evt.status] || STATUS_STYLE.draft
          const typeLabel = EVENT_TYPE_LABEL[evt.type] || evt.type || 'אירוע'
          return (
            <motion.button
              key={evt.id}
              {...f(0.05 + i * 0.05)}
              onClick={() => loadEvent(evt)}
              className="w-full rounded-3xl p-5 text-right transition-all active:scale-[0.98]"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(107,95,228,0.1)' }}>
                  <CalendarDays size={20} style={{ color: 'var(--primary)' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {evt.title || typeLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {evt.date && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{evt.date}</span>
                    )}
                    {evt.guest_count && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Users size={10} />
                        {evt.guest_count}
                      </span>
                    )}
                    {evt.city && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{evt.city}</span>
                    )}
                  </div>
                  {evt.budget_exact > 0 && (
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--primary)' }}>
                      ₪{evt.budget_exact?.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
