// Enhanced by EVO Agent
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Loader, Send, ChevronRight, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'

const DAYS_TO_EVENT = 47

const activityFeed = [
  { id: 1, message: 'המקום אישר את ההזמנה שלך — The Pearl House מאובטח.', time: 'לפני שעתיים', status: 'confirmed' },
  { id: 2, message: 'בריף קייטרינג נשלח ל-Atelier Culinaire — תגובה צפויה ביום חמישי.', time: 'לפני 5 שעות', status: 'in-progress' },
  { id: 3, message: 'EVO עוקב אחר חוזה הבידור עם נועה בן דוד.', time: 'לפני יום', status: 'in-progress' },
  { id: 4, message: 'חבילת צילום אושרה עם Studio Lev.', time: 'לפני יום', status: 'confirmed' },
  { id: 5, message: 'ייעוץ תאורה נקבע לשלישי הקרוב בשעה 15:00.', time: 'לפני יומיים', status: 'pending' },
  { id: 6, message: 'מקדמה עובדה והופצה לספקים.', time: 'לפני יומיים', status: 'confirmed' },
]

const timelineMilestones = [
  { title: 'אירוע מאובטח', status: 'completed', date: 'היום', steps: ['מקדמה שולמה', 'ספקים קיבלו הודעה', 'בריף EVO נוצר'] },
  { title: 'ספקים אושרו', status: 'in-progress', date: 'השבוע', steps: ['מקום ✓', 'צילום ✓', 'DJ — ממתין', 'קייטרינג — בבדיקה'] },
  { title: 'בריפים נשלחו', status: 'pending', date: 'שבוע הבא', steps: ['בריף אירוע מפורט', 'אישור לוח זמנים', 'מספר אורחים סופי'] },
  { title: 'פרטים אחרונים', status: 'future', date: 'שבוע לפני', steps: ['ספירת ראשים סופית', 'דרישות תזונה', 'רשימת ריצה אושרה'] },
  { title: 'יום האירוע', status: 'future', date: 'יום האירוע', steps: ['הגעת ספקים ותפאורה', 'רכז EVO באתר', 'הערב המושלם שלך'] },
]

const chatMessages = [
  { id: 1, from: 'evo', text: 'האירוע שלך נראה נפלא. אבטחתי 4 מתוך 6 ספקים והשניים הנותרים בשלב אישור סופי.', time: 'לפני 2ש' },
  { id: 2, from: 'evo', text: 'המקום שלח תוכנית קומה. אשלב אותה בבריף התאורה והעיצוב.', time: 'לפני 4ש' },
  { id: 3, from: 'user', text: 'אפשר להוסיף תחנת נשנושים לילית?', time: 'לפני יום' },
  { id: 4, from: 'evo', text: 'בהחלט. הוספתי זאת לבריף הקייטרינג. ל-Atelier Culinaire יש אפשרות מזה נהדרת שתתאים בול.', time: 'לפני יום' },
]

const STATUS_CONFIG = {
  confirmed:   { icon: Check,   color: 'text-green-400',    bg: 'bg-green-400/10 border-green-400/30' },
  'in-progress': { icon: Loader, color: 'text-evo-accent animate-spin', bg: 'bg-evo-accent/10 border-evo-accent/30' },
  pending:     { icon: Clock,   color: 'text-evo-muted',    bg: 'bg-evo-elevated border-evo-border' },
}

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
      <Icon size={11} className={cfg.color} />
    </div>
  )
}

const TABS = ['סקירה', 'ציר זמן', 'הודעות']
const TAB_KEYS = ['overview', 'timeline', 'messages']

export default function EventManagement() {
  const { navigate, eventPackage } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chatMessages)
  const messagesEndRef = useRef(null)

  const sections = eventPackage?.sections || []

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: message, time: 'now' }])
    setMessage('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'evo',
        text: 'הבנתי — אטפל בזה ואעדכן אותך בקרוב.',
        time: 'עכשיו',
      }])
    }, 1200)
  }

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, activeTab])

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4 shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--primary)' }}>EVO</span>
            <h1 className="text-lg font-light mt-0.5 leading-tight" style={{ color: 'var(--text-primary)' }}>
              {eventPackage?.name || 'האירוע שלך'}
            </h1>
          </div>
          <div className="flex items-end gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <Bell size={15} />
            </button>
            <div className="text-left">
              <p className="text-[10px] tracking-wide uppercase" style={{ color: 'var(--text-dim)' }}>ימים נותרו</p>
              <p className="text-3xl font-light leading-none" style={{ color: 'var(--primary)' }}>{DAYS_TO_EVENT}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Vendor mosaic */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>סטטוס ספקים</p>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }, (_, i) => {
              const section = sections[i]
              if (section) {
                const isConfirmed = i < 2
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22,1,0.36,1] }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-evo-card"
                  >
                    <img src={section.image} alt={section.vendor.name}
                      className={`w-full h-full object-cover transition-all ${isConfirmed ? 'opacity-90' : 'opacity-25 blur-[2px]'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConfirmed ? 'bg-green-400' : 'bg-evo-accent'}`} />
                      <span className="text-white text-[9px] font-medium leading-tight truncate">
                        {section.vendor.name.split(' ')[0]}
                      </span>
                    </div>
                    {!isConfirmed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 rounded-full px-2 py-0.5">
                          <span className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--primary)' }}>ממתין</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              }
              return (
                <div key={i} className="relative aspect-square rounded-xl bg-evo-card border border-dashed border-evo-border/50 flex items-center justify-center">
                  <span className="text-evo-border text-xl font-light">+</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex gap-0">
            {TABS.map((tab, idx) => (
              <button key={tab} onClick={() => setActiveTab(TAB_KEYS[idx])}
                className="relative py-3 px-4 text-xs font-medium tracking-widest uppercase transition-all"
                style={{ color: activeTab === TAB_KEYS[idx] ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {tab}
                {activeTab === TAB_KEYS[idx] && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--primary)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && ( // eslint-disable-line
            <motion.div key="overview"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-5 space-y-5"
            >
              {/* Action required */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                style={{ background: 'rgba(107,95,228,0.05)', border: '1px solid rgba(107,95,228,0.2)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(107,95,228,0.1)' }}>
                  <Clock size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>נדרשת פעולה</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>ספירת ראשים סופית תוך 8 ימים</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} className="shrink-0" />
              </motion.div>

              {/* Activity feed */}
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>פעילות EVO</p>
                <div className="space-y-4">
                  {activityFeed.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 items-start"
                    >
                      <StatusDot status={item.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--text-primary)' }}>{item.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => navigate('preview')}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full text-xs font-medium tracking-widest uppercase transition-all"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                צפה בתצוגה מקדימה
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div key="timeline"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-5"
            >
              <div className="relative">
                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-evo-border" />
                <div className="space-y-6">
                  {timelineMilestones.map((m, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="relative flex gap-5"
                    >
                      <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        m.status === 'completed'   ? 'border-green-400 bg-green-400/10' :
                        m.status === 'in-progress' ? 'border-evo-accent bg-evo-accent/10' :
                        'border-evo-border bg-evo-black'
                      }`}>
                        {m.status === 'completed'   && <Check size={12} className="text-green-400" />}
                        {m.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-evo-accent" />}
                        {(m.status === 'pending' || m.status === 'future') && (
                          <div className={`w-2 h-2 rounded-full ${m.status === 'pending' ? 'bg-evo-muted' : 'bg-evo-dim'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium" style={{ color: m.status === 'completed' ? '#22c55e' : m.status === 'in-progress' ? 'var(--text-primary)' : 'var(--text-muted)' }}>{m.title}</p>
                          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{m.date}</span>
                        </div>
                        <div className="space-y-1">
                          {m.steps.map((step, j) => (
                            <p key={j} className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{step}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div key="messages"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col" style={{ height: 'calc(100vh - 320px)' }}
            >
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 flex flex-col-reverse">
                <div ref={messagesEndRef} />
                {[...messages].reverse().map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.from === 'evo' && (
                      <div className="w-7 h-7 rounded-full bg-evo-accent/10 border border-evo-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-evo-accent text-xs font-medium">E</span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.from === 'user'
                          ? 'bg-evo-accent text-white'
                          : 'bg-evo-card border border-evo-border text-evo-text'
                      }`}
                    >
                      <p className="text-sm leading-relaxed font-light">{msg.text}</p>
                      <p className={`text-xs mt-1.5 ${msg.from === 'user' ? 'text-white/50' : 'text-evo-dim'}`}>{msg.time}</p>
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
                <div className="flex gap-3 items-center">
                  <input type="text" value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="שאל את EVO כל דבר..."
                    className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                  <motion.button onClick={sendMessage} whileTap={{ scale: 0.92 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'var(--primary)' }}>
                    <Send size={15} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
