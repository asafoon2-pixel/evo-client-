import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/index'

export default function ServiceSelector() {
  const { navigate, updateBrief, briefAnswers } = useApp()

  const initial = briefAnswers.selectedCategories || []
  const [selected, setSelected] = useState(new Set(initial))

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleContinue = () => {
    updateBrief('selectedCategories', Array.from(selected))
    navigate('aiprompt')
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-2">
        <button
          onClick={() => navigate('presummary')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-36 overflow-y-auto">

        {/* Hero text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ color: 'var(--primary)' }}
        >
          שירותים לאירוע
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="text-[32px] font-light leading-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          אילו שירותים<br />
          <span style={{ color: 'var(--primary)' }}>תרצה באירוע?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-sm font-light mb-7"
          style={{ color: 'var(--text-muted)' }}
        >
          סמן את כל מה שרלוונטי — EVO יתאים ספקים בהתאם.
        </motion.p>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const active = selected.has(cat.id)
            return (
              <motion.button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-start text-right rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  minHeight: 120,
                  border: active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  boxShadow: active
                    ? '0 0 0 4px rgba(107,95,228,0.1), 0 4px 16px rgba(44,32,22,0.08)'
                    : '0 2px 8px rgba(44,32,22,0.05)',
                  background: active ? 'rgba(107,95,228,0.05)' : 'var(--surface)',
                }}
              >
                {/* Image strip */}
                <div className="w-full overflow-hidden" style={{ height: 64 }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{ transform: active ? 'scale(1.04)' : 'scale(1)' }}
                  />
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: 64, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.35))' }}
                  />
                  {/* Check badge */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(107,95,228,0.4)' }}
                      >
                        <Check size={12} color="white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Icon */}
                  <div className="absolute top-2 right-2 text-lg leading-none">{cat.icon}</div>
                </div>

                {/* Text */}
                <div className="px-3 py-3 w-full">
                  <p
                    className="text-sm font-semibold leading-tight mb-0.5"
                    style={{ color: active ? 'var(--primary)' : 'var(--text-primary)' }}
                  >
                    {cat.name}
                  </p>
                  <p className="text-[10px] leading-snug" style={{ color: 'var(--text-dim)' }}>
                    {cat.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Select all / clear */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={() => setSelected(new Set(categories.map(c => c.id)))}
            className="text-xs font-medium px-4 py-2 rounded-full transition-all"
            style={{ color: 'var(--primary)', border: '1.5px solid rgba(107,95,228,0.25)', background: 'rgba(107,95,228,0.06)' }}
          >
            בחר הכל
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs font-medium px-4 py-2 rounded-full transition-all"
            style={{ color: 'var(--text-muted)', border: '1.5px solid var(--border)', background: 'transparent' }}
          >
            נקה הכל
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-10 pt-4"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}
      >
        {selected.size > 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-xs mb-3 font-medium"
            style={{ color: 'var(--primary)' }}
          >
            {selected.size} שירות{selected.size > 1 ? 'ים' : ''} נבחר{selected.size > 1 ? 'ו' : ''}
          </motion.p>
        )}
        <button
          onClick={handleContinue}
          disabled={selected.size === 0}
          className="w-full py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all"
          style={{
            background: selected.size > 0 ? 'var(--primary)' : 'var(--border)',
            color: selected.size > 0 ? '#fff' : 'var(--text-dim)',
            boxShadow: selected.size > 0 ? 'var(--shadow-accent)' : 'none',
          }}
        >
          המשך לתיאור האירוע ←
        </button>
      </motion.div>
    </div>
  )
}
