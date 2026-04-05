import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const INDOOR_OUTDOOR = [
  { id: 'indoor',  label: 'Indoor',  icon: '🏛️' },
  { id: 'outdoor', label: 'Outdoor', icon: '🌿' },
  { id: 'mixed',   label: 'Mixed',   icon: '✨' },
]

const AMENITIES = [
  { id: 'kitchen',    label: 'Full kitchen' },
  { id: 'bar',        label: 'Bar area' },
  { id: 'av',         label: 'AV / sound system' },
  { id: 'parking',    label: 'On-site parking' },
  { id: 'accessible', label: 'Accessible entrance' },
  { id: 'garden',     label: 'Garden / terrace' },
]

export default function VenueQuestions() {
  const { navigate, updateBrief } = useApp()

  const [form, setForm] = useState({
    venueName:        '',
    venueAddress:     '',
    venueType:        null,        // 'indoor' | 'outdoor' | 'mixed'
    capacity:         '',
    amenities:        [],          // array of ids
    noiseRestriction: null,        // true | false
    coordinator:      null,        // true | false
    vendorRestrictions: null,      // true | false
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
    <div className="w-full min-h-screen flex flex-col overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md border-b px-6 pt-12 pb-4"
        style={{ background: 'rgba(245,245,247,0.95)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('summary')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>
              Your Venue
            </p>
            <h1 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>
              Tell us about the space
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
          Since you already have a venue, help us understand the space so EVO can match the right vendors and logistics to it perfectly.
        </motion.p>

        {/* Venue name */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Venue Name
          </label>
          <input
            value={form.venueName}
            onChange={e => set('venueName', e.target.value)}
            placeholder="e.g. Villa Harmony, The Rooftop at Tel Aviv Port…"
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
            Address / Location
          </label>
          <input
            value={form.venueAddress}
            onChange={e => set('venueAddress', e.target.value)}
            placeholder="Full address or neighborhood"
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
            Space Type
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
            Estimated Capacity (guests)
          </label>
          <input
            type="number"
            value={form.capacity}
            onChange={e => set('capacity', e.target.value)}
            placeholder="e.g. 120"
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
            Available Amenities
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

        {/* Yes/No questions */}
        {[
          { key: 'noiseRestriction', label: 'Noise or time restrictions?', sub: 'Curfew, noise limits, neighbour rules' },
          { key: 'coordinator',      label: 'Venue coordinator on-site?',  sub: 'Day-of venue manager available' },
          { key: 'vendorRestrictions', label: 'Vendor restrictions?',       sub: 'Must use approved vendor list' },
        ].map(({ key, label, sub }, idx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.04 }}>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              {label}
            </label>
            {sub && <p className="text-xs mb-3 font-light" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{sub}</p>}
            <div className="flex gap-3">
              {[{ val: true, l: 'Yes' }, { val: false, l: 'No' }].map(({ val, l }) => {
                const active = form[key] === val
                return (
                  <motion.button key={l} onClick={() => set(key, val)} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}>
                    {l}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Extra notes */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Anything else we should know?
          </label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="Unique quirks, access notes, parking info, special rules…"
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
        style={{ background: 'rgba(245,245,247,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
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
          Continue <ArrowRight size={14} />
        </motion.button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          A few personal questions next
        </p>
      </div>
    </div>
  )
}
