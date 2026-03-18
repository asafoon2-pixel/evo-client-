// Enhanced by EVO Agent
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
  const isPast = (d) => {
    const sel = new Date(year, month - 1, d)
    return sel <= today
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="w-8 h-8 rounded-full border border-evo-border flex items-center justify-center text-evo-muted hover:text-white transition-colors">
          <ArrowLeft size={14} />
        </button>
        <span className="text-white text-sm font-medium tracking-wide">{label}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full border border-evo-border flex items-center justify-center text-evo-muted hover:text-white transition-colors rotate-180">
          <ArrowLeft size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-evo-dim text-xs py-1">{d}</div>)}
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
              className={`aspect-square rounded-lg text-sm transition-all flex items-center justify-center ${
                active   ? 'bg-evo-accent text-black font-semibold' :
                past     ? 'text-evo-border cursor-not-allowed' :
                'text-evo-muted hover:text-white hover:bg-evo-elevated'
              }`}
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
    else navigate('building')
  }

  const back = () => {
    if (step === 0) navigate('discover')
    else setStep(s => s - 1)
  }

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={back} className="text-evo-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${i <= step ? 'w-5 h-1.5 bg-evo-accent' : 'w-1.5 h-1.5 bg-evo-border'}`} />
          ))}
        </div>
        <div className="w-5" />
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0 — Event type */}
        {step === 0 && (
          <motion.div key="type" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28 }}
            className="flex-1 flex flex-col px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-3">Step 1 of 4</p>
            <h2 className="text-3xl font-light text-white mb-8 leading-snug">What are we<br />celebrating?</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {briefEventTypes.map(t => (
                <button key={t.id} onClick={() => updateBrief('eventType', t.id)}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.98] ${briefAnswers.eventType === t.id ? 'border-evo-accent' : 'border-evo-border'}`}
                  style={{ height: 130 }}>
                  <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-all ${briefAnswers.eventType === t.id ? 'bg-evo-black/40' : 'bg-evo-black/60'}`} />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="text-white text-sm font-medium tracking-wide">{t.label}</span>
                  </div>
                  {briefAnswers.eventType === t.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-evo-accent flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1 — Scale */}
        {step === 1 && (
          <motion.div key="scale" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28 }}
            className="flex-1 flex flex-col px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-3">Step 2 of 4</p>
            <h2 className="text-3xl font-light text-white mb-8 leading-snug">How many<br />people?</h2>
            <div className="flex flex-col gap-3">
              {briefScales.map(s => (
                <button key={s.id} onClick={() => updateBrief('scale', s.id)}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.99] ${briefAnswers.scale === s.id ? 'border-evo-accent' : 'border-evo-border'}`}
                  style={{ height: 100 }}>
                  <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${briefAnswers.scale === s.id ? 'bg-evo-black/40' : 'bg-evo-black/65'}`} />
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="text-left">
                      <p className="text-white text-base font-medium">{s.label}</p>
                      <p className="text-evo-muted text-xs mt-0.5">{s.sublabel} guests</p>
                    </div>
                    {briefAnswers.scale === s.id && (
                      <div className="w-6 h-6 rounded-full bg-evo-accent flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Date */}
        {step === 2 && (
          <motion.div key="date" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28 }}
            className="flex-1 flex flex-col px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-3">Step 3 of 4</p>
            <h2 className="text-3xl font-light text-white mb-6 leading-snug">When?</h2>
            {briefAnswers.date && (
              <div className="mb-4 px-4 py-2 bg-evo-accent/10 border border-evo-accent/30 rounded-full inline-flex self-start">
                <span className="text-evo-accent text-sm font-medium">{briefAnswers.date}</span>
              </div>
            )}
            <CalendarPicker selected={briefAnswers.date} onSelect={d => updateBrief('date', d)} />
            <button onClick={() => { updateBrief('date', 'flexible'); advance() }}
              className="mt-6 text-evo-muted text-sm tracking-wide hover:text-white transition-colors text-center">
              I'm flexible with the date
            </button>
          </motion.div>
        )}

        {/* STEP 3 — Budget */}
        {step === 3 && (
          <motion.div key="budget" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28 }}
            className="flex-1 flex flex-col px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-evo-accent mb-3">Step 4 of 4</p>
            <h2 className="text-3xl font-light text-white mb-8 leading-snug">Budget range?</h2>
            <div className="flex flex-col gap-3">
              {briefBudgetTiers.map(t => (
                <button key={t.id} onClick={() => updateBrief('budgetTier', t.id)}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.99] ${briefAnswers.budgetTier === t.id ? 'border-evo-accent' : 'border-evo-border'}`}
                  style={{ height: 110 }}>
                  <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${briefAnswers.budgetTier === t.id ? 'bg-evo-black/40' : 'bg-evo-black/65'}`} />
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="text-left">
                      <p className="text-white text-base font-medium">{t.label}</p>
                      <p className="text-evo-accent text-sm mt-0.5">{t.range}</p>
                    </div>
                    {briefAnswers.budgetTier === t.id && (
                      <div className="w-6 h-6 rounded-full bg-evo-accent flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
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
          className={`w-full py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            canAdvance()
              ? 'bg-evo-accent text-black shadow-[0_4px_24px_rgba(201,169,110,0.25)] hover:bg-[#B8946A]'
              : 'border border-evo-accent text-evo-accent'
          }`}
        >
          {step < 3 ? 'Continue' : 'Build My Event'}
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  )
}
