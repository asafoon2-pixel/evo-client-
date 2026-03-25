// Enhanced by EVO Agent
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Loader, Send, ChevronRight, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'

const DAYS_TO_EVENT = 47

const activityFeed = [
  { id: 1, message: 'Venue confirmed your booking — The Pearl House is secured.', time: '2 hours ago', status: 'confirmed' },
  { id: 2, message: 'Catering brief sent to Atelier Culinaire — reply expected Thursday.', time: '5 hours ago', status: 'in-progress' },
  { id: 3, message: 'EVO is following up on entertainment contract with Noa Ben David.', time: '1 day ago', status: 'in-progress' },
  { id: 4, message: 'Photography package confirmed with Studio Lev.', time: '1 day ago', status: 'confirmed' },
  { id: 5, message: 'Lighting consultation scheduled for next Tuesday at 3pm.', time: '2 days ago', status: 'pending' },
  { id: 6, message: 'Deposit processed and distributed to vendors.', time: '2 days ago', status: 'confirmed' },
]

const timelineMilestones = [
  { title: 'Event Secured', status: 'completed', date: 'Today', steps: ['Deposit paid', 'Vendors notified', 'EVO brief created'] },
  { title: 'Vendors Confirmed', status: 'in-progress', date: 'This week', steps: ['Venue ✓', 'Photography ✓', 'DJ — pending', 'Catering — in review'] },
  { title: 'Briefings Sent', status: 'pending', date: 'Next week', steps: ['Detailed event brief', 'Timeline confirmation', 'Guest count finalized'] },
  { title: 'Final Details', status: 'future', date: 'Week before', steps: ['Final headcount', 'Dietary requirements', 'Runsheet approved'] },
  { title: 'Event Day', status: 'future', date: 'Event day', steps: ['Vendor arrival & setup', 'EVO on-site coordinator', 'Your perfect evening'] },
]

const chatMessages = [
  { id: 1, from: 'evo', text: "Your event is looking beautiful. I've secured 4 of your 6 vendors and the remaining 2 are in final confirmation.", time: '2h ago' },
  { id: 2, from: 'evo', text: "The venue sent over a floor plan. I'll incorporate this into the lighting and decor briefing.", time: '4h ago' },
  { id: 3, from: 'user', text: 'Can we add a late-night snack station?', time: '1d ago' },
  { id: 4, from: 'evo', text: "Absolutely. I've added this to the catering brief. Atelier Culinaire has a beautiful mezze station option that would fit perfectly.", time: '1d ago' },
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

const TABS = ['overview', 'timeline', 'messages']

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
        text: "Got it — I'll take care of that and update you shortly.",
        time: 'now',
      }])
    }, 1200)
  }

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, activeTab])

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-evo-black border-b border-evo-border px-6 pt-12 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-evo-accent font-medium">EVO</span>
            <h1 className="text-lg font-light text-white mt-0.5 leading-tight">
              {eventPackage?.name || 'Your Event'}
            </h1>
          </div>
          <div className="flex items-end gap-3">
            <button className="w-9 h-9 rounded-full border border-evo-border flex items-center justify-center text-evo-muted hover:text-white transition-colors">
              <Bell size={15} />
            </button>
            <div className="text-right">
              <p className="text-evo-dim text-[10px] tracking-wide uppercase">Days left</p>
              <p className="text-evo-accent text-3xl font-light leading-none">{DAYS_TO_EVENT}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Vendor mosaic */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-[10px] tracking-[0.25em] uppercase text-evo-muted mb-3">Vendor Status</p>
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
                          <span className="text-evo-accent text-[8px] uppercase tracking-widest">Pending</span>
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
        <div className="px-6 border-b border-evo-border">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`relative py-3 px-4 text-xs font-medium tracking-widest uppercase transition-all capitalize ${
                  activeTab === tab ? 'text-white' : 'text-evo-muted hover:text-white/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-evo-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-5 space-y-5"
            >
              {/* Action required */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="bg-evo-accent/5 border border-evo-accent/20 rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-evo-accent/10 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-evo-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">Action Required</p>
                  <p className="text-evo-muted text-xs mt-0.5">Final headcount due in 8 days</p>
                </div>
                <ChevronRight size={16} className="text-evo-dim shrink-0" />
              </motion.div>

              {/* Activity feed */}
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-evo-muted mb-4">EVO Activity</p>
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
                        <p className="text-white text-sm leading-relaxed font-light">{item.message}</p>
                        <p className="text-evo-dim text-xs mt-1">{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => navigate('preview')}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full border border-evo-border text-evo-muted text-xs font-medium tracking-widest uppercase hover:border-evo-accent/30 hover:text-white transition-all"
              >
                View Event Preview
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
                          <p className={`text-sm font-medium ${
                            m.status === 'completed'   ? 'text-green-400' :
                            m.status === 'in-progress' ? 'text-white' : 'text-evo-muted'
                          }`}>{m.title}</p>
                          <span className="text-evo-dim text-xs">{m.date}</span>
                        </div>
                        <div className="space-y-1">
                          {m.steps.map((step, j) => (
                            <p key={j} className="text-evo-dim text-xs leading-relaxed">{step}</p>
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

              <div className="px-6 py-4 border-t border-evo-border bg-evo-black shrink-0">
                <div className="flex gap-3 items-center">
                  <input type="text" value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask EVO anything..."
                    className="flex-1 bg-evo-card border border-evo-border rounded-xl px-4 py-3 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent/50 transition-colors"
                  />
                  <motion.button onClick={sendMessage} whileTap={{ scale: 0.92 }}
                    className="w-10 h-10 rounded-xl bg-evo-accent flex items-center justify-center hover:bg-[#1E1060] transition-all">
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
