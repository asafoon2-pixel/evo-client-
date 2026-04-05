import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, Tag } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SUGGESTIONS = [
  'Intimate candlelit dinner',
  'Rooftop party with DJ',
  'Garden wedding',
  'Corporate gala',
  'Live jazz and fine dining',
  'High-energy celebration',
  'Elegant black-tie',
  'Outdoor summer vibes',
]

const PLACEHOLDER = 'e.g. Classy rooftop dinner with live jazz and Italian food for 50 guests...'

export default function AIPrompt() {
  const { navigate, buildPackageFromText, briefAnswers, updateBrief, updateEventDetails, eventDetails } = useApp()
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef           = useRef(null)

  const addSuggestion = (s) => {
    const sep = text.trim() ? ', ' : ''
    setText(t => t.trim() + sep + s.toLowerCase())
    textareaRef.current?.focus()
  }

  const handleBuild = () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setTimeout(() => {
      buildPackageFromText(text, briefAnswers)
      navigate('building')
    }, 600)
  }

  const canSubmit = text.trim().length > 3 && eventDetails.city.trim().length > 1 && briefAnswers.hasVenue !== null

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('presummary')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6">

        {/* Hero text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ color: 'var(--primary)' }}
        >
          AI Event Builder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="text-[34px] font-light leading-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Describe your<br />
          <span style={{ color: 'var(--primary)' }}>perfect event</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-sm font-light mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          Write anything — vibe, food, music, feel. EVO will do the rest.
        </motion.p>

        {/* Text input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-3xl overflow-hidden transition-all"
            style={{
              background: 'var(--surface)',
              border: text
                ? '1.5px solid var(--primary)'
                : '1.5px solid var(--border)',
              boxShadow: text ? 'var(--shadow-feat)' : 'var(--shadow-card)',
              transition: 'border-color 0.25s, box-shadow 0.25s',
            }}
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={5}
              className="w-full px-5 pt-5 pb-3 text-base font-light resize-none outline-none bg-transparent leading-relaxed"
              style={{
                color: 'var(--text-primary)',
                caretColor: 'var(--primary)',
              }}
            />
            <div className="px-5 pb-3 flex justify-end">
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                {text.length > 0 ? `${text.length} chars` : ''}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="mt-5"
        >
          <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.95 }}
                onClick={() => addSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-muted)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* City + event name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 space-y-3"
        >
          <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
            Event details
          </p>

          {/* City */}
          <div className="relative">
            <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Event city (e.g. Tel Aviv)"
              value={eventDetails.city}
              onChange={e => updateEventDetails('city', e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: eventDetails.city ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = eventDetails.city ? 'var(--primary)' : 'var(--border)'}
            />
          </div>

          {/* Event title (optional) */}
          <div className="relative">
            <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Event name (optional)"
              value={eventDetails.title}
              onChange={e => updateEventDetails('title', e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </motion.div>

        {/* Venue question */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 mb-6"
        >
          <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
            Do you have a venue?
          </p>
          <div className="flex gap-3">
            {[
              { value: true,  label: 'Yes, I have a venue',  sub: "I'll fill in the details later" },
              { value: false, label: 'No, I need a venue',   sub: 'EVO will suggest one for you' },
            ].map(opt => {
              const active = briefAnswers.hasVenue === opt.value
              return (
                <motion.button
                  key={String(opt.value)}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateBrief('hasVenue', opt.value)}
                  className="flex-1 flex flex-col items-start px-4 py-3.5 rounded-2xl text-left transition-all"
                  style={{
                    border:     active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: active ? 'rgba(45,27,105,0.06)' : 'var(--surface)',
                    boxShadow:  active ? '0 0 0 3px rgba(45,27,105,0.08)' : 'none',
                  }}
                >
                  <span className="text-sm font-semibold mb-1" style={{ color: active ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] leading-tight" style={{ color: 'var(--text-dim)' }}>
                    {opt.sub}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

      </div>

      {/* CTA — fixed bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pb-10 pt-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}
      >
        <motion.button
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          onClick={handleBuild}
          disabled={!canSubmit || loading}
          className="w-full py-4 rounded-full flex items-center justify-center gap-3 text-sm font-bold tracking-wide uppercase transition-all"
          style={{
            background: canSubmit ? 'var(--primary)' : 'var(--border)',
            color: canSubmit ? '#fff' : 'var(--text-dim)',
            boxShadow: canSubmit ? 'var(--shadow-accent)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }}
                />
                Building your event...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles size={15} />
                Build My Event
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
          EVO will match vendors based on your description
        </p>
      </motion.div>
    </div>
  )
}
