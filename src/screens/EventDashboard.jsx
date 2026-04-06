import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, MessageCircle, Calendar, CreditCard, User,
  Bell, ChevronRight, Send, Plus, X, Check,
  CheckCircle2, Circle, MapPin, Users, Clock,
  Camera, Edit2, Instagram, Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// ── utils ─────────────────────────────────────────────────────────────────────
const fmt = n => `₪${Number(n).toLocaleString()}`

function daysUntil(dateStr) {
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const p = dateStr?.split(' ')
  if (!p || p.length < 3) return null
  const d = new Date(parseInt(p[2]), months[p[0]], parseInt(p[1]))
  return Math.ceil((d - new Date()) / 86400000)
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
const MOOD_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
]

const INITIAL_SUGGESTIONS = [
  { id: 1, icon: '📸', title: 'Add a photographer', body: "You haven't booked a photographer yet. Capture every moment.", cta: 'Browse photographers' },
  { id: 2, icon: '🎂', title: 'Upgrade your catering', body: 'Add a dessert station or welcome drinks to elevate the experience.', cta: 'See upgrades' },
  { id: 3, icon: '📋', title: 'Set your final guest count', body: 'Your vendors need a confirmed headcount 3 weeks before the event.', cta: 'Update count' },
  { id: 4, icon: '🎨', title: 'Share your mood board', body: 'Help your vendors understand your vision. Upload references or images.', cta: 'Add photos' },
]

function HomeTab({ eventName, eventDate, days, guests, totalPrice, heroImage }) {
  const [dismissed, setDismissed] = useState([])
  const suggestions = INITIAL_SUGGESTIONS.filter(s => !dismissed.includes(s.id))

  return (
    <div className="flex flex-col pb-4">

      {/* Event header */}
      <div className="px-6 pt-8 pb-6">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--primary)' }}>
          Your Event
        </p>
        <h1 className="text-2xl font-semibold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>
          {eventName}
        </h1>
        <div className="flex flex-wrap gap-2">
          {eventDate && (
            <Chip icon={<Calendar size={11} />} label={eventDate} color="#2D1B69" />
          )}
          {days !== null && (
            <Chip icon={<Clock size={11} />} label={days > 0 ? `${days} days to go` : 'Today!'} color="#ec4899" />
          )}
          {guests && (
            <Chip icon={<Users size={11} />} label={`${guests} guests`} color="#1A6940" />
          )}
          {totalPrice > 0 && (
            <Chip icon={<CreditCard size={11} />} label={fmt(totalPrice)} color="#6B4A1A" />
          )}
        </div>
      </div>

      {/* Mood gallery */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--text-dim)' }}>
            Event Mood
          </p>
          <button className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--primary)' }}>
            <Plus size={11} /> Add photos
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MOOD_IMAGES.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: i === 0 ? '16/10' : '1', gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />
            </div>
          ))}
          <div className="rounded-2xl flex items-center justify-center"
            style={{ aspectRatio: '1', background: 'var(--surface)', border: '1.5px dashed var(--border)' }}>
            <div className="flex flex-col items-center gap-1">
              <Camera size={20} style={{ color: 'var(--text-dim)' }} />
              <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Add photo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart suggestions */}
      {suggestions.length > 0 && (
        <div className="px-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
            Suggestions
          </p>
          <div className="space-y-3">
            <AnimatePresence>
              {suggestions.map(s => (
                <motion.div key={s.id}
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl px-4 py-4"
                    style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                        <p className="text-xs font-light leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
                        <button className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                          {s.cta} →
                        </button>
                      </div>
                      <button onClick={() => setDismissed(d => [...d, s.id])}
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{ background: 'var(--elevated)', color: 'var(--text-dim)' }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ icon, label, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: color + '14', border: `1px solid ${color}28` }}>
      <span style={{ color }}>{icon}</span>
      <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

// ── CHAT TAB ──────────────────────────────────────────────────────────────────
const MOCK_CHATS = [
  {
    id: 'pearl',
    name: 'The Pearl House',
    cat: 'Venue',
    avatar: 'P',
    color: '#2D1B69',
    unread: 2,
    time: '10:42',
    last: 'Looking forward to hosting your event! 🎉',
    messages: [
      { from: 'vendor', text: 'Hi! So excited to be part of your event 🎉', time: '10:30' },
      { from: 'user',   text: 'Thanks! Can we schedule a site visit?', time: '10:38' },
      { from: 'vendor', text: 'Of course — does Thursday 3pm work?', time: '10:40' },
      { from: 'vendor', text: 'Looking forward to hosting your event! 🎉', time: '10:42' },
    ],
  },
  {
    id: 'atelier',
    name: 'Atelier Culinaire',
    cat: 'Catering',
    avatar: 'A',
    color: '#1A6940',
    unread: 0,
    time: '09:15',
    last: 'Menu tasting confirmed for Apr 18 ✓',
    messages: [
      { from: 'vendor', text: 'Your menu options are ready to review!', time: '08:50' },
      { from: 'user',   text: 'Great, can we do a tasting?', time: '09:10' },
      { from: 'vendor', text: 'Menu tasting confirmed for Apr 18 ✓', time: '09:15' },
    ],
  },
  {
    id: 'noir',
    name: 'Noir Sound',
    cat: 'Music',
    avatar: 'N',
    color: '#6B1F6B',
    unread: 1,
    time: 'Yesterday',
    last: 'Playlist draft incoming tomorrow 🎶',
    messages: [
      { from: 'vendor', text: 'We have some playlist ideas for you', time: 'Yesterday' },
      { from: 'vendor', text: 'Playlist draft incoming tomorrow 🎶', time: 'Yesterday' },
    ],
  },
]

function ChatTab() {
  const [activeId, setActiveId] = useState(null)
  const [msg, setMsg] = useState('')
  const [chatData, setChatData] = useState(MOCK_CHATS)

  const activeChat = chatData.find(c => c.id === activeId)

  const sendMsg = () => {
    if (!msg.trim() || !activeId) return
    setChatData(prev => prev.map(c =>
      c.id !== activeId ? c : {
        ...c,
        messages: [...c.messages, { from: 'user', text: msg.trim(), time: 'now' }],
        last: msg.trim(),
      }
    ))
    setMsg('')
  }

  if (activeChat) {
    return (
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <button onClick={() => setActiveId(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            ←
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
            style={{ background: activeChat.color + '18', color: activeChat.color }}>
            {activeChat.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activeChat.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{activeChat.cat}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {activeChat.messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div>
                <div className="px-4 py-2.5 text-sm leading-relaxed max-w-[75vw]"
                  style={{
                    background: m.from === 'user' ? 'var(--primary)' : 'var(--surface)',
                    color: m.from === 'user' ? '#fff' : 'var(--text-primary)',
                    borderRadius: m.from === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    border: m.from !== 'user' ? '1px solid var(--border)' : 'none',
                  }}>
                  {m.text}
                </div>
                <p className={`text-[10px] mt-1 ${m.from === 'user' ? 'text-right' : ''}`}
                  style={{ color: 'var(--text-dim)' }}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 pb-6 pt-3 flex items-center gap-2"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
          <input
            value={msg} onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
            placeholder="Message..."
            className="flex-1 px-4 py-3 text-sm rounded-full outline-none"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={sendMsg}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: msg.trim() ? 'var(--primary)' : 'var(--border)' }}>
            <Send size={14} color={msg.trim() ? '#fff' : 'var(--text-dim)'} />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pt-8 pb-4">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Chats</h2>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>Your vendor conversations</p>
      <div className="space-y-2">
        {chatData.map(c => (
          <motion.button key={c.id} whileTap={{ scale: 0.99 }} onClick={() => setActiveId(c.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: c.color + '18', color: c.color }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                <p className="text-[10px] shrink-0 ml-2" style={{ color: 'var(--text-dim)' }}>{c.time}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.last}</p>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ml-2"
                    style={{ background: 'var(--primary)', color: '#fff' }}>{c.unread}</span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── TIMELINE TAB ──────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  done:    { color: '#22c55e', icon: CheckCircle2, label: 'Done' },
  payment: { color: '#f59e0b', icon: CreditCard,   label: 'Payment' },
  meeting: { color: '#6366f1', icon: MapPin,        label: 'Meeting' },
  task:    { color: '#64748b', icon: Circle,         label: 'Task' },
  event:   { color: '#ec4899', icon: Sparkles,       label: 'Event' },
}

// vendorStatus: 'confirmed' | 'awaiting' | 'cancelled'
const DEFAULT_ITEMS = [
  { id: 1,  date: 'Today',  label: 'Event confirmed by EVO',                type: 'done',    done: true,  vendorStatus: 'confirmed', vendorName: 'EVO' },
  { id: 2,  date: 'Apr 12', label: 'Venue deposit due — ₪2,800',           type: 'payment', done: false, vendorStatus: 'confirmed', vendorName: 'The Pearl House' },
  { id: 3,  date: 'Apr 18', label: 'Catering tasting at Atelier Culinaire', type: 'meeting', done: false, vendorStatus: 'confirmed', vendorName: 'Atelier Culinaire' },
  { id: 4,  date: 'Apr 25', label: 'Send final guest list to venue',        type: 'task',    done: false },
  { id: 5,  date: 'May 3',  label: 'Final vendor confirmations',            type: 'task',    done: false },
  { id: 6,  date: 'May 10', label: 'Music briefing with Noir Sound',        type: 'meeting', done: false, vendorStatus: 'awaiting',   vendorName: 'Noir Sound' },
  { id: 7,  date: 'May 20', label: 'Catering balance payment',              type: 'payment', done: false, vendorStatus: 'confirmed',  vendorName: 'Atelier Culinaire' },
  { id: 8,  date: 'Jun 1',  label: '🎉 Your Event Day!',                   type: 'event',   done: false },
]

const VENDOR_STATUS_STYLE = {
  confirmed: { label: '✅ Confirmed', bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  awaiting:  { label: '⏳ Awaiting',  bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  cancelled: { label: '❌ Cancelled', bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
}

function TimelineTab() {
  const [items, setItems] = useState(DEFAULT_ITEMS)
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ date: '', label: '', type: 'task' })

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))

  const addItem = () => {
    if (!newItem.label.trim() || !newItem.date.trim()) return
    setItems(prev => [...prev, { ...newItem, id: Date.now(), done: false }])
    setNewItem({ date: '', label: '', type: 'task' })
    setAdding(false)
  }

  return (
    <div className="px-6 pt-8 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Timeline</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAdding(a => !a)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: adding ? 'var(--primary)' : 'rgba(45,27,105,0.08)', color: adding ? '#fff' : 'var(--primary)' }}>
          <Plus size={12} /> Add item
        </motion.button>
      </div>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>Your full event journey</p>

      {/* Add item form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden mb-5">
            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>New item</p>
              <input value={newItem.label} onChange={e => setNewItem(n => ({ ...n, label: e.target.value }))}
                placeholder="What's happening?" className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              <div className="flex gap-2">
                <input value={newItem.date} onChange={e => setNewItem(n => ({ ...n, date: e.target.value }))}
                  placeholder="Date (e.g. May 5)" className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                <select value={newItem.type} onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))}
                  className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                  {Object.entries(TYPE_STYLE).filter(([k]) => k !== 'done' && k !== 'event').map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAdding(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}>Cancel</button>
                <button onClick={addItem} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--primary)', color: '#fff' }}>Add</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
        <div className="space-y-5">
          {items.map(item => {
            const s = TYPE_STYLE[item.type]
            const Icon = s.icon
            return (
              <motion.div key={item.id} layout className="flex items-start gap-4 relative">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggle(item.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all"
                  style={{
                    background: item.done ? s.color + '22' : 'var(--surface)',
                    border: `2px solid ${item.done ? s.color : 'var(--border)'}`,
                  }}>
                  <Icon size={14} style={{ color: item.done ? s.color : 'var(--text-dim)' }} />
                </motion.button>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold leading-snug"
                    style={{ color: item.done ? 'var(--text-dim)' : 'var(--text-primary)',
                             textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.label}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: s.color + '18', color: s.color }}>{s.label}</span>
                    {item.vendorStatus && VENDOR_STATUS_STYLE[item.vendorStatus] && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: VENDOR_STATUS_STYLE[item.vendorStatus].bg,
                          color: VENDOR_STATUS_STYLE[item.vendorStatus].color,
                        }}>
                        {VENDOR_STATUS_STYLE[item.vendorStatus].label}
                        {item.vendorName && ` · ${item.vendorName}`}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── PAYMENTS TAB ──────────────────────────────────────────────────────────────
function PaymentsTab({ sections, totalPrice }) {
  const deposit = Math.round(totalPrice * 0.2)

  const rows = (sections.length > 0 ? sections : [
    { label: 'Venue',    vendor: { name: 'The Pearl House',    price: 14000 } },
    { label: 'Catering', vendor: { name: 'Atelier Culinaire',  price: 18000 } },
    { label: 'Music',    vendor: { name: 'Noir Sound',          price: 6000  } },
    { label: 'Lighting', vendor: { name: 'Lumière Studio',      price: 5500  } },
  ]).map((s, i) => ({
    ...s,
    dep: Math.round(s.vendor.price * 0.2),
    due: ['Apr 12', 'Apr 20', 'Apr 28', 'May 5'][i] || 'TBD',
    paid: i === 2,
  }))

  const totalDep   = rows.reduce((s, r) => s + r.dep, 0)
  const paidAmount = rows.filter(r => r.paid).reduce((s, r) => s + r.dep, 0)
  const pending    = totalDep - paidAmount

  return (
    <div className="px-6 pt-8 pb-4">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Payments</h2>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>All deposits and balances</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'Total event', value: fmt(totalPrice || 43500), sub: '' },
          { label: 'Paid',        value: fmt(paidAmount),           sub: 'deposits' },
          { label: 'Pending',     value: fmt(pending),              sub: 'deposits' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl px-3 py-3 text-center"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <p className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>{c.label}</p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
            {c.sub && <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* Deposit rows */}
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
        Deposit schedule
      </p>
      <div className="space-y-2 mb-6">
        {rows.map((r, i) => (
          <div key={i} className="px-4 py-3.5 rounded-2xl"
            style={{ background: r.paid ? 'rgba(34,197,94,0.04)' : 'var(--surface)',
                     border: `1.5px solid ${r.paid ? 'rgba(34,197,94,0.2)' : 'var(--border)'}` }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.vendor.name}</p>
              <p className="text-sm font-bold" style={{ color: r.paid ? '#16a34a' : 'var(--text-primary)' }}>{fmt(r.dep)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{r.label} · Due {r.due}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: r.paid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                         color: r.paid ? '#16a34a' : '#d97706' }}>
                {r.paid ? '✓ Paid' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <motion.button whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full text-sm font-bold tracking-wide"
          style={{ background: '#6B4A1A', color: '#fff', boxShadow: '0 4px 16px rgba(107,74,26,0.35)' }}>
          Pay pending deposits — {fmt(pending)}
        </motion.button>
      )}
    </div>
  )
}

// ── PROFILE TAB ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const { userProfile, updateProfile } = useApp()
  const [editing, setEditing] = useState(null)
  const [local, setLocal] = useState({
    fullName: userProfile?.fullName || '',
    instagram: userProfile?.instagramHandle || '',
    bio: userProfile?.bio || '',
    vibe: userProfile?.vibe || '',
  })

  const save = (field) => {
    updateProfile && updateProfile(field, local[field])
    setEditing(null)
  }

  const fields = [
    { key: 'fullName',  label: 'Full Name',          placeholder: 'Your name', icon: User,      multiline: false },
    { key: 'instagram', label: 'Instagram',           placeholder: '@handle',   icon: Instagram,  multiline: false },
    { key: 'bio',       label: 'About you',           placeholder: 'A short intro — who are you as an event host?', icon: Edit2, multiline: true },
    { key: 'vibe',      label: 'Your event vibe',     placeholder: 'Describe your taste and style so vendors understand you before working with you...', icon: Sparkles, multiline: true },
  ]

  return (
    <div className="px-6 pt-8 pb-4">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
            style={{ background: 'rgba(45,27,105,0.1)', color: 'var(--primary)' }}>
            {local.fullName ? local.fullName[0].toUpperCase() : '?'}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary)', border: '2px solid var(--background)' }}>
            <Camera size={12} color="white" />
          </button>
        </div>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {local.fullName || 'Your Name'}
        </p>
        {local.instagram && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{local.instagram}</p>
        )}
        <p className="text-[11px] mt-2 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(45,27,105,0.07)', color: 'var(--primary)' }}>
          Visible to your vendors
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {fields.map(f => {
          const Icon = f.icon
          const isEditing = editing === f.key
          return (
            <div key={f.key} className="rounded-2xl px-4 py-3.5 transition-all"
              style={{ background: 'var(--surface)', border: isEditing ? '1.5px solid var(--primary)' : '1.5px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: isEditing ? 'var(--primary)' : 'var(--text-dim)' }} />
                  <p className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: isEditing ? 'var(--primary)' : 'var(--text-dim)' }}>{f.label}</p>
                </div>
                <button onClick={() => isEditing ? save(f.key) : setEditing(f.key)}
                  className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditing ? (
                f.multiline ? (
                  <textarea value={local[f.key]} onChange={e => setLocal(l => ({ ...l, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} rows={3}
                    className="w-full text-sm outline-none resize-none bg-transparent mt-1"
                    style={{ color: 'var(--text-primary)', caretColor: 'var(--primary)', fontFamily: 'inherit', lineHeight: 1.6 }} />
                ) : (
                  <input value={local[f.key]} onChange={e => setLocal(l => ({ ...l, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full text-sm outline-none bg-transparent mt-1"
                    style={{ color: 'var(--text-primary)', caretColor: 'var(--primary)', fontFamily: 'inherit' }} />
                )
              ) : (
                <p className="text-sm mt-1 leading-relaxed"
                  style={{ color: local[f.key] ? 'var(--text-primary)' : 'var(--text-dim)' }}>
                  {local[f.key] || f.placeholder}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'chat',     label: 'Chat',     Icon: MessageCircle, badge: 3 },
  { id: 'timeline', label: 'Timeline', Icon: Calendar },
  { id: 'payments', label: 'Payments', Icon: CreditCard },
  { id: 'profile',  label: 'Profile',  Icon: User },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function EventDashboard() {
  const { eventPackage, briefAnswers, totalPrice } = useApp()
  const [tab, setTab] = useState('home')

  const sections  = eventPackage?.sections || []
  const eventName = eventPackage?.name || 'Your Curated Event'
  const eventDate = briefAnswers?.date !== 'flexible' ? briefAnswers?.date : null
  const days      = eventDate ? daysUntil(eventDate) : null
  const guestMap  = { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }
  const guests    = briefAnswers?.scale ? guestMap[briefAnswers.scale] : null

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Top bar — minimal, just notification bell */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {tab === 'home' ? eventName
           : tab === 'chat' ? 'Chats'
           : tab === 'timeline' ? 'Timeline'
           : tab === 'payments' ? 'Payments'
           : 'Profile'}
        </p>
        <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
          <Bell size={15} style={{ color: 'var(--text-muted)' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            {tab === 'home' && (
              <HomeTab
                eventName={eventName} eventDate={eventDate}
                days={days} guests={guests} totalPrice={totalPrice || 43500}
                heroImage={eventPackage?.heroImage}
              />
            )}
            {tab === 'chat'     && <ChatTab />}
            {tab === 'timeline' && <TimelineTab />}
            {tab === 'payments' && <PaymentsTab sections={sections} totalPrice={totalPrice || 43500} />}
            {tab === 'profile'  && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40"
        style={{ background: 'rgba(245,245,247,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center px-2 pb-6 pt-2">
          {NAV_TABS.map(({ id, label, Icon, badge }) => {
            const active = tab === id
            return (
              <button key={id} onClick={() => setTab(id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 relative transition-all">
                <div className="relative">
                  <Icon size={22} style={{ color: active ? 'var(--primary)' : 'var(--text-dim)',
                                           transition: 'color 0.2s' }} strokeWidth={active ? 2.5 : 1.8} />
                  {badge && !active && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: '#ef4444', color: '#fff' }}>{badge}</span>
                  )}
                </div>
                <span className="text-[10px] font-semibold transition-colors"
                  style={{ color: active ? 'var(--primary)' : 'var(--text-dim)' }}>
                  {label}
                </span>
                {active && (
                  <motion.div layoutId="tab-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'var(--primary)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
