import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STEPS = [
  {
    id: 'chat',
    emoji: '💬',
    label: 'Chat',
    title: 'Talk to every vendor — instantly',
    desc: 'Each vendor in your event has a dedicated chat. Ask questions, share references, confirm details — all in one thread, never lost in email.',
    color: '#2D1B69',
    bg: 'rgba(45,27,105,0.07)',
    preview: [
      { from: 'vendor', name: 'The Pearl House', msg: 'Hi! Looking forward to hosting your event 🎉', time: '10:42' },
      { from: 'user', msg: "Can we do a site visit next Thursday?", time: '10:45' },
      { from: 'vendor', name: 'The Pearl House', msg: 'Absolutely — does 3pm work for you?', time: '10:46' },
    ],
  },
  {
    id: 'timeline',
    emoji: '📅',
    label: 'Timeline',
    title: 'Your event, mapped from today',
    desc: 'Every milestone, deposit date, vendor meeting, and task — laid out in a clear timeline so nothing falls through the cracks.',
    color: '#1A6969',
    bg: 'rgba(26,105,105,0.07)',
    preview: [
      { date: 'Today', label: 'Event confirmed', type: 'done' },
      { date: 'Apr 12', label: 'Venue deposit due', type: 'payment' },
      { date: 'Apr 18', label: 'Catering tasting', type: 'meeting' },
      { date: 'May 3',  label: 'Final guest count', type: 'task' },
    ],
  },
  {
    id: 'vendors',
    emoji: '⭐',
    label: 'Vendors',
    title: 'Every vendor, at a glance',
    desc: 'See ratings, portfolios, and status for every vendor in your event. Swap, review, or message them from one place.',
    color: '#6B1F6B',
    bg: 'rgba(107,31,107,0.07)',
    preview: [
      { name: 'The Pearl House', cat: 'Venue', rating: 4.9, status: 'Confirmed' },
      { name: 'Atelier Culinaire', cat: 'Catering', rating: 4.8, status: 'Confirmed' },
      { name: 'Noir Sound', cat: 'Music', rating: 4.7, status: 'Pending' },
    ],
  },
  {
    id: 'addons',
    emoji: '✨',
    label: 'Add-ons',
    title: 'Upgrade your event',
    desc: 'Browse curated extras — custom florals, photo booths, late-night bites, surprise performers — and add them to your event in one tap.',
    color: '#1A6940',
    bg: 'rgba(26,105,64,0.07)',
    preview: [
      { name: 'Floral arch', price: '₪2,400', tag: 'Popular' },
      { name: 'Photo booth', price: '₪1,800', tag: 'New' },
      { name: 'Late-night bar', price: '₪3,200', tag: '' },
    ],
  },
  {
    id: 'payments',
    emoji: '💳',
    label: 'Payments',
    title: 'Payments, totally under control',
    desc: "All deposits, payment schedules, and balances in one transparent view. You'll always know what's paid, what's due, and what's next.",
    color: '#6B4A1A',
    bg: 'rgba(107,74,26,0.07)',
    preview: [
      { vendor: 'Venue', amount: '₪2,800', status: 'Due Apr 12', paid: false },
      { vendor: 'Catering', amount: '₪3,600', status: 'Due Apr 20', paid: false },
      { vendor: 'Music', amount: '₪1,400', status: 'Paid ✓', paid: true },
    ],
  },
]

function ChatPreview({ items }) {
  return (
    <div className="space-y-2">
      {items.map((m, i) => (
        <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-[80%]">
            {m.from === 'vendor' && (
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-dim)' }}>{m.name}</p>
            )}
            <div
              className="px-3 py-2 rounded-2xl text-xs leading-relaxed"
              style={{
                background: m.from === 'user' ? 'var(--primary)' : 'var(--elevated)',
                color: m.from === 'user' ? '#fff' : 'var(--text-primary)',
                borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              }}
            >
              {m.msg}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelinePreview({ items }) {
  const typeColor = { done: '#22c55e', payment: '#f59e0b', meeting: 'var(--primary)', task: '#64748b' }
  const typeIcon  = { done: '✓', payment: '₪', meeting: '📍', task: '○' }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: typeColor[item.type] + '22', color: typeColor[item.type] }}>
            {typeIcon[item.type]}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function VendorPreview({ items }) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{v.cat} · ⭐ {v.rating}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
            style={{
              background: v.status === 'Confirmed' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
              color: v.status === 'Confirmed' ? '#16a34a' : '#d97706',
            }}>
            {v.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function AddonsPreview({ items }) {
  return (
    <div className="space-y-2">
      {items.map((a, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
            {a.tag && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(45,27,105,0.1)', color: 'var(--primary)' }}>{a.tag}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{a.price}</p>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary)', color: '#fff' }}>+</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PaymentsPreview({ items }) {
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.vendor}</p>
            <p className="text-[11px]" style={{ color: p.paid ? '#16a34a' : 'var(--text-dim)' }}>{p.status}</p>
          </div>
          <p className="text-sm font-bold" style={{ color: p.paid ? '#16a34a' : 'var(--text-primary)' }}>{p.amount}</p>
        </div>
      ))}
    </div>
  )
}

const PREVIEWS = {
  chat:     ChatPreview,
  timeline: TimelinePreview,
  vendors:  VendorPreview,
  addons:   AddonsPreview,
  payments: PaymentsPreview,
}

export default function AppTour() {
  const { navigate } = useApp()
  const [step, setStep] = useState(0)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const Preview = PREVIEWS[current.id]

  const next = () => isLast ? navigate('dashboard') : setStep(s => s + 1)
  const back = () => step > 0 && setStep(s => s - 1)

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <motion.p
          key={step}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[10px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: current.color }}
        >
          {step + 1} of {STEPS.length}
        </motion.p>
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <X size={11} /> Skip tour
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 px-6 mb-6">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === step ? 24 : 6, background: i <= step ? current.color : 'var(--border)' }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {/* Emoji + label */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: current.bg, border: `1.5px solid ${current.color}22` }}
              >
                {current.emoji}
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: current.color }}>
                  {current.label}
                </p>
                <h2 className="text-xl font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {current.title}
                </h2>
              </div>
            </div>

            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {current.desc}
            </p>

            {/* Live preview card */}
            <div
              className="rounded-2xl p-4 flex-1"
              style={{
                background: 'var(--surface)',
                border: `1.5px solid ${current.color}22`,
                boxShadow: `0 4px 24px ${current.color}12`,
              }}
            >
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: current.color }}>
                Preview
              </p>
              <Preview items={current.preview} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-6 flex items-center gap-3">
        {step > 0 ? (
          <button
            onClick={back}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
          </button>
        ) : <div className="w-12" />}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all"
          style={{
            background: current.color,
            color: '#fff',
            boxShadow: `0 4px 20px ${current.color}40`,
          }}
        >
          {isLast ? 'Go to my event dashboard' : (
            <>Next: {STEPS[step + 1].label} <ArrowRight size={15} /></>
          )}
        </motion.button>
      </div>
    </div>
  )
}
