import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { briefEventTypes, briefScales, briefBudgetTiers } from '../data/index'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function CalendarPicker({ selected, onSelect }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const daysInMonth  = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const cells        = Array.from({ length: firstWeekday + daysInMonth }, (_, i) =>
    i < firstWeekday ? null : i - firstWeekday + 1
  )
  const label = `${MONTHS[month - 1]} ${year}`

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
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-sm font-medium tracking-wide" style={{ color: 'var(--text-primary)' }}>{label}</span>
        <button onClick={nextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center rotate-180 transition-colors"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          <ArrowLeft size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs py-1" style={{ color: 'var(--text-dim)' }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const past    = isPast(day)
          const dateStr = `${MONTHS[month - 1]} ${day}, ${year}`
          const active  = selected === dateStr
          return (
            <button
              key={i}
              onClick={() => !past && onSelect(dateStr)}
              disabled={past}
              className="aspect-square rounded-xl text-sm transition-all flex items-center justify-center"
              style={{
                background:  active ? 'var(--primary)' : 'transparent',
                color:       active ? '#FFFFFF' : past ? 'var(--text-dim)' : 'var(--text-muted)',
                fontWeight:  active ? 600 : 400,
                cursor:      past ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const steps = ['type', 'scale', 'date', 'budget']

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

export default function Brief() {
  const { navigate, briefAnswers, updateBrief } = useApp()
  const [step, setStep] = useState(0)

  const canAdvance = () => {
    if (step === 0) return !!briefAnswers.eventType
    if (step === 1) return !!briefAnswers.scale
    if (step === 2) return !!briefAnswers.date
    return !!briefAnswers.budgetTier
  }

  const advance = () => {
    if (step < steps.length - 1) setStep(s => s + 1)
    else navigate('discover')
  }

  const back = () => {
    if (step === 0) navigate('entry')
    else setStep(s => s - 1)
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={back} className="transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5 items-center">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i <= step ? 20 : 6, opacity: i <= step ? 1 : 0.25 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-1.5 rounded-full"
              style={{ background: 'var(--primary)' }}
            />
          ))}
        </div>

        <div className="w-5" />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="type" variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col px-6">
            <p className="label-overline mb-3">Step 1 of 4</p>
            <h2 className="font-display text-[34px] font-light leading-snug mb-8" style={{ color: 'var(--text-primary)' }}>
              What are we<br />celebrating?
            </h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {briefEventTypes.map(t => {
                const active = briefAnswers.eventType === t.id
                return (
                  <button key={t.id} onClick={() => updateBrief('eventType', t.id)}
                    className="relative rounded-[20px] overflow-hidden transition-all duration-200 active:scale-[0.98]"
                    style={{
                      height: 130,
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: active ? 'var(--shadow-ring)' : 'none',
                    }}>
                    <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: active ? 'rgba(8,10,15,0.35)' : 'rgba(8,10,15,0.62)' }} />
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="text-white text-sm font-medium tracking-wide">{t.label}</span>
                    </div>
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="scale" variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col px-6">
            <p className="label-overline mb-3">Step 2 of 4</p>
            <h2 className="font-display text-[34px] font-light leading-snug mb-8" style={{ color: 'var(--text-primary)' }}>
              How many<br />people?
            </h2>
            <div className="flex flex-col gap-3">
              {briefScales.map(s => {
                const active = briefAnswers.scale === s.id
                return (
                  <button key={s.id} onClick={() => updateBrief('scale', s.id)}
                    className="relative rounded-[20px] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                    style={{
                      height: 100,
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: active ? 'var(--shadow-ring)' : 'none',
                    }}>
                    <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: active ? 'rgba(8,10,15,0.38)' : 'rgba(8,10,15,0.65)' }} />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div className="text-left">
                        <p className="text-white text-base font-medium">{s.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sublabel} guests</p>
                      </div>
                      {active && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="date" variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col px-6">
            <p className="label-overline mb-3">Step 3 of 4</p>
            <h2 className="font-display text-[34px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
              When?
            </h2>
            {briefAnswers.date && (
              <div className="mb-4 px-4 py-2 rounded-full inline-flex self-start"
                style={{ background: 'rgba(45,27,105,0.08)', border: '1px solid rgba(45,27,105,0.2)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{briefAnswers.date}</span>
              </div>
            )}
            <CalendarPicker selected={briefAnswers.date} onSelect={d => updateBrief('date', d)} />
            <button onClick={() => { updateBrief('date', 'flexible'); advance() }}
              className="mt-6 text-sm tracking-wide text-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              I'm flexible with the date
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="budget" variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col px-6">
            <p className="label-overline mb-3">Step 4 of 4</p>
            <h2 className="font-display text-[34px] font-light leading-snug mb-8" style={{ color: 'var(--text-primary)' }}>
              Budget range?
            </h2>
            <div className="flex flex-col gap-3">
              {briefBudgetTiers.map(t => {
                const active = briefAnswers.budgetTier === t.id
                return (
                  <button key={t.id} onClick={() => updateBrief('budgetTier', t.id)}
                    className="relative rounded-[20px] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                    style={{
                      height: 110,
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: active ? 'var(--shadow-ring)' : 'none',
                    }}>
                    <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: active ? 'rgba(8,10,15,0.38)' : 'rgba(8,10,15,0.65)' }} />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div className="text-left">
                        <p className="text-white text-base font-medium">{t.label}</p>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--primary)' }}>{t.range}</p>
                      </div>
                      {active && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="px-6 py-8">
        <motion.button
          onClick={advance}
          disabled={!canAdvance()}
          whileTap={canAdvance() ? { scale: 0.97 } : {}}
          className="w-full py-4 text-sm font-semibold tracking-[0.12em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            borderRadius: 'var(--radius-pill)',
            background:  canAdvance() ? 'var(--primary)' : 'transparent',
            color:       canAdvance() ? '#FFFFFF' : 'var(--primary)',
            border:      canAdvance() ? 'none' : '1px solid var(--primary)',
            boxShadow:   canAdvance() ? 'var(--shadow-accent)' : 'none',
            opacity:     canAdvance() ? 1 : 0.4,
            cursor:      canAdvance() ? 'pointer' : 'not-allowed',
          }}
        >
          {step < 3 ? 'Continue' : 'Build My Event'}
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  )
}
