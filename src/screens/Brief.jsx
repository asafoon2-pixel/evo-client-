import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
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
    if (sc) chips.push({ key: 'scale', label: sc.sublabel + ' guests' })
  }
  if (step > 2 && answers.date) {
    chips.push({ key: 'date', label: answers.date === 'flexible' ? 'Flexible date' : answers.date })
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

const steps = ['type', 'scale', 'date', 'budget']

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function Brief() {
  const { navigate, briefAnswers, updateBrief } = useApp()
  const [step, setStep]                 = useState(0)
  const [justSelected, setJustSelected] = useState(null)

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
      navigate('presummary')
    }, 260)
  }

  const back = () => {
    if (step === 0) navigate('entry')
    else setStep(s => s - 1)
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-20 pt-12 pb-2" style={{ background: 'var(--background)' }}>
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
              <p className="label-overline mb-2">What are we celebrating?</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                Pick your event type
              </h2>

              <button onClick={() => navigate('categories')}
                className="w-full mb-5 py-3.5 text-sm font-bold transition-all active:scale-[0.98]"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(45,27,105,0.06)',
                  border: '1.5px solid rgba(45,27,105,0.18)',
                  color: 'var(--primary)',
                }}>
                I already have an event — add suppliers →
              </button>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {briefEventTypes.map(t => (
                  <OptionCard key={t.id}
                    active={briefAnswers.eventType === t.id}
                    justSelected={justSelected === t.id}
                    onClick={() => selectAndAdvance('eventType', t.id)}
                    style={{ height: 130 }}>
                    <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: briefAnswers.eventType === t.id ? 'rgba(8,10,15,0.3)' : 'rgba(8,10,15,0.55)' }} />
                    <div className="absolute inset-0 flex items-end p-4 justify-between">
                      <span className="text-white text-sm font-semibold">{t.label}</span>
                      {briefAnswers.eventType === t.id && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                          <Check size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Scale */}
          {step === 1 && (
            <motion.div key="scale" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">Guest count</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                How many people?
              </h2>
              <div className="flex flex-col gap-3">
                {briefScales.map(s => (
                  <OptionCard key={s.id}
                    active={briefAnswers.scale === s.id}
                    justSelected={justSelected === s.id}
                    onClick={() => selectAndAdvance('scale', s.id)}
                    style={{ height: 96 }}>
                    <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: briefAnswers.scale === s.id ? 'rgba(8,10,15,0.3)' : 'rgba(8,10,15,0.62)' }} />
                    <div className="absolute inset-0 flex items-center justify-between px-5">
                      <div>
                        <p className="text-white text-base font-semibold">{s.label}</p>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.sublabel} guests</p>
                      </div>
                      {briefAnswers.scale === s.id && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                          <Check size={14} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Date */}
          {step === 2 && (
            <motion.div key="date" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">Event date</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-5" style={{ color: 'var(--text-primary)' }}>
                When is it?
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
                onSelect={d => { updateBrief('date', d); setTimeout(() => setStep(s => s + 1), 200) }}
              />
              <button onClick={() => { updateBrief('date', 'flexible'); setStep(s => s + 1) }}
                className="mt-6 text-sm font-medium text-center py-3 rounded-full transition-all"
                style={{ color: 'var(--primary)', border: '1.5px dashed rgba(45,27,105,0.25)' }}>
                I'm flexible with the date →
              </button>
            </motion.div>
          )}

          {/* STEP 3 — Budget */}
          {step === 3 && (
            <motion.div key="budget" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col px-6 pt-6 pb-6">
              <p className="label-overline mb-2">Budget</p>
              <h2 className="font-display text-[32px] font-light leading-snug mb-6" style={{ color: 'var(--text-primary)' }}>
                What's your range?
              </h2>
              <div className="flex flex-col gap-3">
                {briefBudgetTiers.map(t => (
                  <OptionCard key={t.id}
                    active={briefAnswers.budgetTier === t.id}
                    justSelected={justSelected === t.id}
                    onClick={() => selectAndFinish('budgetTier', t.id)}
                    className="flex items-center justify-between px-5"
                    style={{ height: 88, background: briefAnswers.budgetTier === t.id ? 'rgba(45,27,105,0.06)' : 'var(--surface)' }}>
                    <div className="text-left">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 15 }}>{t.label}</p>
                      <p className="font-bold mt-1" style={{ color: 'var(--primary)', fontSize: 17 }}>{t.range}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: briefAnswers.budgetTier === t.id ? 'var(--primary)' : 'rgba(45,27,105,0.25)',
                        background:  briefAnswers.budgetTier === t.id ? 'var(--primary)' : 'transparent',
                      }}>
                      {briefAnswers.budgetTier === t.id && <Check size={13} color="white" strokeWidth={3} />}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
