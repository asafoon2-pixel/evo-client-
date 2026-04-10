import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const INDOOR_OUTDOOR = [
  { id: 'indoor',  label: 'פנים',     icon: '🏛️' },
  { id: 'outdoor', label: 'חוץ',      icon: '🌿' },
  { id: 'mixed',   label: 'היברידי',  icon: '✨' },
]

const AMENITIES = [
  { id: 'kitchen',    label: 'מטבח מלא' },
  { id: 'bar',        label: 'אזור בר' },
  { id: 'av',         label: 'מערכת קול/מוצג' },
  { id: 'parking',    label: 'חניה במקום' },
  { id: 'accessible', label: 'כניסה נגישה' },
  { id: 'garden',     label: 'גן / מרפסת' },
]

export default function VenueQuestions() {
  const { navigate, updateBrief } = useApp()

  const [form, setForm] = useState({
    venueName:        '',
    venueAddress:     '',
    venueType:        null,        // 'indoor' | 'outdoor' | 'mixed'
    capacity:         '',
    amenities:        [],          // array of ids
    notes:            '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleAmenity = (id) => setForm(f => ({
    ...f,
    amenities: f.amenities.includes(id)
      ? f.amenities.filter(a => a !== id)
      : [...f.amenities, id],
  }))

  const canContinue =
    form.venueName.trim().length > 1 &&
    form.venueAddress.trim().length > 2 &&
    form.venueType !== null

  const handleContinue = () => {
    updateBrief('venueDetails', form)
    navigate('personalquestions')
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md border-b px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('summary')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>
              המקום שלך
            </p>
            <h1 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>
              ספר לנו על המרחב
            </h1>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-glow)' }}>
            <MapPin size={15} style={{ color: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-7">

        {/* Intro */}
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
          מכיוון שיש לך מקום, עזור לנו להבין את המרחב כדי שEVO יוכל להתאים את הספקים הנכונים.
        </motion.p>

        {/* Venue name */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            שם המקום
          </label>
          <input
            value={form.venueName}
            onChange={e => set('venueName', e.target.value)}
            placeholder="לדוגמה: Villa Harmony, The Rooftop at Tel Aviv Port…"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.venueName ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Address */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            כתובת / מיקום
          </label>
          <input
            value={form.venueAddress}
            onChange={e => set('venueAddress', e.target.value)}
            placeholder="כתובת מלאה או שכונה"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.venueAddress ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Indoor / Outdoor / Mixed */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            סוג המרחב
          </label>
          <div className="grid grid-cols-3 gap-2">
            {INDOOR_OUTDOOR.map(opt => {
              const active = form.venueType === opt.id
              return (
                <motion.button key={opt.id} onClick={() => set('venueType', opt.id)} whileTap={{ scale: 0.96 }}
                  className="py-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: active ? 'var(--primary-dim)' : 'var(--surface)',
                    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-medium" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {opt.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Estimated capacity */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            קיבולת משוערת (אורחים)
          </label>
          <input
            type="number"
            value={form.capacity}
            onChange={e => set('capacity', e.target.value)}
            placeholder="לדוגמה: 120"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.capacity ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Amenities */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            מתקנים זמינים
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(a => {
              const active = form.amenities.includes(a.id)
              return (
                <motion.button key={a.id} onClick={() => toggleAmenity(a.id)} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: active ? 'var(--primary-dim)' : 'var(--surface)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: active ? 'var(--primary)' : 'transparent', border: active ? 'none' : '1.5px solid var(--border)' }}>
                    {active && <span className="text-white text-[9px] font-bold">✓</span>}
                  </div>
                  <span className="text-xs" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {a.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>


        {/* Extra notes */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            עוד משהו שכדאי לדעת?
          </label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="מאפיינים ייחודיים, הערות גישה, מידע חניה, כללים מיוחדים…"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none resize-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.notes ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button
          onClick={handleContinue}
          disabled={!canContinue}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: canContinue ? 'var(--primary)' : 'var(--surface)',
            color: canContinue ? '#fff' : 'var(--text-muted)',
            border: canContinue ? 'none' : '1px solid var(--border)',
            boxShadow: canContinue ? 'var(--shadow-accent)' : 'none',
            opacity: canContinue ? 1 : 0.6,
          }}>
          המשך <ArrowRight size={14} style={{ transform: 'scaleX(-1)' }} />
        </motion.button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          כמה שאלות אישיות עכשיו
        </p>
      </div>
    </div>
  )
}
