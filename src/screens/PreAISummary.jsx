import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, LayoutGrid, Users, Calendar, Wallet } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { briefEventTypes, briefScales, briefBudgetTiers } from '../data/index'

const f = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function PreAISummary() {
  const { navigate, briefAnswers } = useApp()

  const eventType = briefEventTypes.find(t => t.id === briefAnswers.eventType)
  const scale     = briefScales.find(s => s.id === briefAnswers.scale)
  const budget    = briefBudgetTiers.find(b => b.id === briefAnswers.budgetTier)

  const rows = [
    {
      icon: LayoutGrid,
      label: 'סוג אירוע',
      value: eventType?.label || '—',
      image: eventType?.image,
    },
    {
      icon: Users,
      label: 'אורחים',
      value: scale ? `${scale.label} · ${scale.sublabel}` : '—',
    },
    {
      icon: Calendar,
      label: 'תאריך',
      value: briefAnswers.date === 'flexible' ? 'גמיש' : briefAnswers.date || '—',
    },
    {
      icon: Wallet,
      label: 'תקציב',
      value: budget ? `${budget.label} · ${budget.range}` : '—',
    },
  ]

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-6">
        <button onClick={() => navigate('brief')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6">

        {/* Hero label */}
        <motion.p {...f(0.05)} className="label-overline mb-3">הבריף שלך</motion.p>
        <motion.h1 {...f(0.12)} className="font-display text-[36px] font-light leading-tight mb-2"
          style={{ color: 'var(--text-primary)' }}>
          הנה מה<br />שיודעים
        </motion.h1>
        <motion.p {...f(0.18)} className="text-sm mb-8 font-light" style={{ color: 'var(--text-muted)' }}>
          בדוק את הבחירות שלך לפני שנבנה את האירוע.
        </motion.p>

        {/* Summary card */}
        <motion.div {...f(0.25)}
          className="rounded-[24px] overflow-hidden mb-6"
          style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-feat)', border: '1.5px solid var(--border)' }}>

          {/* Hero image strip */}
          {eventType?.image && (
            <div className="relative w-full overflow-hidden" style={{ height: 120 }}>
              <img src={eventType.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.95) 100%)' }} />
            </div>
          )}

          {/* Detail rows */}
          <div className="px-5 pb-2">
            {rows.map((row, i) => {
              const Icon = row.icon
              return (
                <motion.div key={row.label}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 py-3.5"
                  style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(45,27,105,0.07)', border: '1px solid rgba(45,27,105,0.1)' }}>
                    <Icon size={15} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>{row.label}</p>
                    <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{row.value}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Edit link */}
        <motion.button {...f(0.55)} onClick={() => navigate('brief')}
          className="text-xs font-medium text-center mb-8 py-1"
          style={{ color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          ערוך את הבחירות שלי
        </motion.button>

      </div>

      {/* CTA buttons — fixed bottom */}
      <motion.div {...f(0.6)}
        className="px-6 pb-10 pt-4 space-y-3"
        style={{ background: 'var(--background)', borderTop: '1px solid var(--border)' }}>

        <p className="text-xs text-center font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
          איך תרצה לבנות את האירוע?
        </p>

        {/* AI flow */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('aiprompt')}
          className="w-full py-4 flex items-center justify-center gap-3 text-sm font-bold tracking-wide transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: 'var(--primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-accent)',
          }}>
          <Sparkles size={16} />
          תן ל-AI להתאים את ווייב האירוע
        </motion.button>

        {/* Manual flow */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('categories')}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface)',
            color: 'var(--primary)',
            border: '1.5px solid rgba(45,27,105,0.22)',
            boxShadow: '0 1px 4px rgba(45,27,105,0.07)',
          }}>
          <LayoutGrid size={15} />
          בחר ספקים ידנית
        </motion.button>
      </motion.div>
    </div>
  )
}
