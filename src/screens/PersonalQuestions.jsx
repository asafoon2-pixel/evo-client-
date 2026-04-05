import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
// Note: if hasVenue is false, user skipped VenueQuestions and came from summary

const FEELINGS = [
  { id: 'intimate',    label: 'Intimate & warm',    emoji: '🕯️' },
  { id: 'glamorous',   label: 'Glamorous & grand',  emoji: '✨' },
  { id: 'playful',     label: 'Fun & playful',       emoji: '🎉' },
  { id: 'minimal',     label: 'Clean & minimal',     emoji: '◻️' },
  { id: 'romantic',    label: 'Romantic & soft',     emoji: '🌸' },
  { id: 'bold',        label: 'Bold & dramatic',     emoji: '🔥' },
]

const MUST_HAVES = [
  { id: 'live_music',    label: 'Live music' },
  { id: 'photobooth',    label: 'Photo booth' },
  { id: 'open_bar',      label: 'Open bar' },
  { id: 'gourmet_food',  label: 'Gourmet food' },
  { id: 'dancing',       label: 'Dance floor' },
  { id: 'outdoor',       label: 'Outdoor area' },
  { id: 'dj',            label: 'DJ' },
  { id: 'lounge',        label: 'Lounge seating' },
]

export default function PersonalQuestions() {
  const { navigate, updateBrief, briefAnswers } = useApp()

  const [form, setForm] = useState({
    purpose:        '',
    feeling:        null,
    mustHaves:      [],
    mustAvoids:     '',
    considerations: '',
    contact:        '',
    freeform:       '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleMustHave = (id) => setForm(f => ({
    ...f,
    mustHaves: f.mustHaves.includes(id)
      ? f.mustHaves.filter(m => m !== id)
      : [...f.mustHaves, id],
  }))

  const canContinue = form.purpose.trim().length > 1 && form.feeling !== null

  const handleContinue = () => {
    updateBrief('personalDetails', form)
    navigate('tour')
  }

  return (
    <div className="w-full min-h-screen flex flex-col overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md border-b px-6 pt-12 pb-4"
        style={{ background: 'rgba(245,245,247,0.95)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(briefAnswers?.hasVenue === true ? 'venuequestions' : 'summary')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>
              About You
            </p>
            <h1 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>
              A few personal touches
            </h1>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-glow)' }}>
            <Sparkles size={15} style={{ color: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-7">

        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
          These answers help EVO understand the soul of your event — not just the logistics.
        </motion.p>

        {/* Purpose / occasion */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            What's the occasion?
          </label>
          <input
            value={form.purpose}
            onChange={e => set('purpose', e.target.value)}
            placeholder="Birthday, anniversary, product launch, proposal…"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.purpose ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Desired feeling */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            How should guests feel?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FEELINGS.map(f => {
              const active = form.feeling === f.id
              return (
                <motion.button key={f.id} onClick={() => set('feeling', f.id)} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: active ? 'var(--primary-dim)' : 'var(--surface)',
                    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  <span className="text-lg">{f.emoji}</span>
                  <span className="text-xs font-medium leading-tight" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {f.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Must-haves */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
            Must-haves
          </label>
          <p className="text-xs mb-3 font-light" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            Non-negotiables for your event
          </p>
          <div className="flex flex-wrap gap-2">
            {MUST_HAVES.map(m => {
              const active = form.mustHaves.includes(m.id)
              return (
                <motion.button key={m.id} onClick={() => toggleMustHave(m.id)} whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--primary)' : 'var(--surface)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  {m.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Must-avoids */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Anything to avoid?
          </label>
          <textarea
            value={form.mustAvoids}
            onChange={e => set('mustAvoids', e.target.value)}
            rows={2}
            placeholder="Things you absolutely don't want — music genres, food types, style elements…"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none resize-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.mustAvoids ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Cultural / dietary / religious */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
            Cultural, dietary or religious considerations
          </label>
          <p className="text-xs mb-2 font-light" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            Kosher, halal, vegan, cultural customs…
          </p>
          <textarea
            value={form.considerations}
            onChange={e => set('considerations', e.target.value)}
            rows={2}
            placeholder="Share anything that matters to you and your guests"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none resize-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.considerations ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Day-of contact */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.21 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Day-of contact name & phone
          </label>
          <input
            value={form.contact}
            onChange={e => set('contact', e.target.value)}
            placeholder="Who vendors should call on the day"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.contact ? 'var(--primary)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </motion.div>

        {/* Free-form final */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Anything else?
          </label>
          <textarea
            value={form.freeform}
            onChange={e => set('freeform', e.target.value)}
            rows={3}
            placeholder="A story, a vision, something that matters — the more EVO knows, the better your event will be."
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light outline-none resize-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${form.freeform ? 'var(--primary)' : 'var(--border)'}`,
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
          See my event app <ArrowRight size={14} />
        </motion.button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          Your answers are saved to your event
        </p>
      </div>
    </div>
  )
}
