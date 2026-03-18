import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Loader, MessageSquare, Send, ChevronRight } from 'lucide-react'
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
  {
    title: 'Event Secured',
    status: 'completed',
    date: 'Today',
    steps: ['Deposit paid', 'Vendors notified', 'EVO brief created'],
  },
  {
    title: 'Vendors Confirmed',
    status: 'in-progress',
    date: 'This week',
    steps: ['Venue ✓', 'Photography ✓', 'DJ — pending', 'Catering — in review'],
  },
  {
    title: 'Briefings Sent',
    status: 'pending',
    date: 'Next week',
    steps: ['Detailed event brief', 'Timeline confirmation', 'Guest count finalized'],
  },
  {
    title: 'Final Details',
    status: 'future',
    date: 'Week before',
    steps: ['Final headcount', 'Dietary requirements', 'Runsheet approved'],
  },
  {
    title: 'Event Day',
    status: 'future',
    date: 'Event day',
    steps: ['Vendor arrival & setup', 'EVO on-site coordinator', 'Your perfect evening'],
  },
]

const chatMessages = [
  { id: 1, from: 'evo', text: "Your event is looking beautiful. I've secured 4 of your 6 vendors and the remaining 2 are in final confirmation.", time: '2h ago' },
  { id: 2, from: 'evo', text: 'The venue sent over a floor plan. I\'ll incorporate this into the lighting and decor briefing.', time: '4h ago' },
  { id: 3, from: 'user', text: 'Can we add a late-night snack station?', time: '1d ago' },
  { id: 4, from: 'evo', text: "Absolutely. I've added this to the catering brief. Atelier Culinaire has a beautiful mezze station option that would fit perfectly.", time: '1d ago' },
]

function StatusIcon({ status }) {
  if (status === 'confirmed') return <Check size={12} className="text-green-400" />
  if (status === 'in-progress') return <Loader size={12} className="text-evo-accent animate-spin" />
  return <Clock size={12} className="text-evo-dim" />
}

export default function EventManagement() {
  const { navigate, eventPackage } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chatMessages)

  const sections = eventPackage?.sections || []
  const totalCells = 9

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: message, time: 'now' }])
    setMessage('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'evo',
        text: "Got it — I'll take care of that and update you shortly.",
        time: 'now',
      }])
    }, 1200)
  }

  const tabs = ['overview', 'timeline', 'messages']

  return (
    <div className="w-full min-h-screen bg-evo-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-evo-black border-b border-evo-border px-6 pt-12 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-evo-accent">EVO</span>
            <h1 className="text-lg font-light text-white mt-0.5 leading-tight">
              {eventPackage?.name || 'Your Event'}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-evo-dim text-xs tracking-wide">Event in</p>
            <p className="text-evo-accent text-3xl font-light leading-none">{DAYS_TO_EVENT}</p>
            <p className="text-evo-muted text-xs mt-0.5">days</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mosaic */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-xs tracking-[0.2em] uppercase text-evo-muted mb-3">Vendor Mosaic</p>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: totalCells }, (_, i) => {
              const section = sections[i]
              if (section) {
                const isConfirmed = i < 2
                return (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-evo-card">
                    <img
                      src={section.image}
                      alt={section.vendor.name}
                      className={`w-full h-full object-cover transition-all ${isConfirmed ? 'opacity-90' : 'opacity-30 blur-sm'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-green-400' : 'bg-evo-accent'}`} />
                        <span className="text-white text-[9px] font-medium leading-tight truncate">
                          {section.vendor.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <div key={i} className="relative aspect-square rounded-xl bg-evo-card border border-dashed border-evo-border flex items-center justify-center">
                  <span className="text-evo-dim text-lg font-light">+</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-6 border-b border-evo-border">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-medium tracking-widest uppercase transition-all capitalize border-b-2 ${
                  activeTab === tab
                    ? 'text-white border-evo-accent'
                    : 'text-evo-muted border-transparent hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-5 space-y-5"
            >
              {/* Upcoming action */}
              <div className="bg-evo-card rounded-2xl border border-evo-accent/20 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-evo-accent/10 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-evo-accent" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Action Required</p>
                  <p className="text-evo-muted text-xs mt-0.5">Final headcount due in 8 days</p>
                </div>
                <ChevronRight size={16} className="text-evo-dim ml-auto" />
              </div>

              {/* Activity feed */}
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-evo-muted mb-4">EVO Activity</p>
                <div className="space-y-4">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-evo-elevated border border-evo-border flex items-center justify-center shrink-0 mt-0.5">
                        <StatusIcon status={item.status} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm leading-relaxed font-light">{item.message}</p>
                        <p className="text-evo-dim text-xs mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview button */}
              <button
                onClick={() => navigate('preview')}
                className="w-full py-3.5 rounded-full border border-evo-border text-evo-muted text-xs font-medium tracking-widest uppercase hover:border-evo-accent/30 hover:text-white transition-all"
              >
                View Event Preview
              </button>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-5"
            >
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-evo-border" />

                <div className="space-y-6">
                  {timelineMilestones.map((m, i) => (
                    <div key={i} className="relative flex gap-5">
                      {/* Status dot */}
                      <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        m.status === 'completed' ? 'border-green-400 bg-green-400/10' :
                        m.status === 'in-progress' ? 'border-evo-accent bg-evo-accent/10' :
                        'border-evo-border bg-evo-black'
                      }`}>
                        {m.status === 'completed' && <Check size={12} className="text-green-400" />}
                        {m.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-evo-accent" />}
                        {(m.status === 'pending' || m.status === 'future') && (
                          <div className={`w-2 h-2 rounded-full ${m.status === 'pending' ? 'bg-evo-muted' : 'bg-evo-dim'}`} />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-medium ${
                            m.status === 'completed' ? 'text-green-400' :
                            m.status === 'in-progress' ? 'text-white' :
                            'text-evo-muted'
                          }`}>{m.title}</p>
                          <span className="text-evo-dim text-xs">{m.date}</span>
                        </div>
                        <div className="space-y-1">
                          {m.steps.map((step, j) => (
                            <p key={j} className="text-evo-dim text-xs leading-relaxed">{step}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col"
              style={{ height: 'calc(100vh - 320px)' }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {[...messages].reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.from === 'evo' && (
                      <div className="w-7 h-7 rounded-full bg-evo-accent/10 border border-evo-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-evo-accent text-xs font-light">E</span>
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.from === 'user'
                        ? 'bg-evo-accent text-black ml-auto'
                        : 'bg-evo-card border border-evo-border text-white'
                    }`}>
                      <p className="text-sm leading-relaxed font-light">{msg.text}</p>
                      <p className={`text-xs mt-1.5 ${msg.from === 'user' ? 'text-black/50' : 'text-evo-dim'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-evo-border bg-evo-black">
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask EVO anything..."
                    className="flex-1 bg-evo-card border border-evo-border rounded-xl px-4 py-3 text-white text-sm placeholder-evo-dim focus:outline-none focus:border-evo-accent/50 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    className="w-10 h-10 rounded-xl bg-evo-accent flex items-center justify-center hover:bg-evo-accent/80 transition-all active:scale-95"
                  >
                    <Send size={15} className="text-black" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
