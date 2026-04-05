import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Calendar, Star, Sparkles, CreditCard,
  ChevronRight, Plus, Bell, Settings, MapPin, Users,
  Clock, CheckCircle2, AlertCircle, Circle, FileText,
  ChevronDown, Send,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₪${Number(n).toLocaleString()}`

function daysUntil(dateStr) {
  const parts = dateStr?.split(' ')
  if (!parts || parts.length < 3) return null
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const d = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]))
  return Math.ceil((d - new Date()) / 86400000)
}

// ── sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, accent, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: accent + '18' }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {action && (
        <button onClick={onAction} className="text-[11px] font-semibold flex items-center gap-1"
          style={{ color: accent }}>
          {action} <ChevronRight size={11} />
        </button>
      )}
    </div>
  )
}

// ── CHAT PANEL ────────────────────────────────────────────────────────────────
function ChatsPanel({ vendors }) {
  const [open, setOpen] = useState(null)
  const [msg, setMsg] = useState('')
  const ACCENT = '#2D1B69'

  const chats = vendors.map((v, i) => ({
    id: v.vendor.id,
    name: v.vendor.name,
    category: v.label,
    last: i === 0 ? 'Looking forward to hosting your event! 🎉' : i === 1 ? 'Menu tasting confirmed for Apr 18' : 'We will send the playlist draft tomorrow',
    time: ['10:42', '09:15', 'Yesterday'][i] || '—',
    unread: [2, 0, 1][i] || 0,
    messages: [
      { from: 'vendor', text: i === 0 ? 'Hi! Looking forward to hosting your event 🎉' : i === 1 ? 'Menu tasting confirmed for Apr 18' : 'We will send the playlist draft tomorrow', time: ['10:42','09:15','Yesterday'][i] },
      { from: 'user', text: 'Thank you!', time: '10:45' },
    ],
  }))

  const activeChat = chats.find(c => c.id === open)

  return (
    <div id="chat">
      <SectionHeader icon={MessageCircle} title="Vendor Chats" accent={ACCENT}
        action="All chats" onAction={() => {}} />
      <div className="space-y-2">
        {chats.map(c => (
          <motion.button key={c.id} whileTap={{ scale: 0.99 }} onClick={() => setOpen(open === c.id ? null : c.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
            style={{ background: 'var(--surface)', border: open === c.id ? '1.5px solid var(--primary)' : '1.5px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
              style={{ background: 'rgba(45,27,105,0.1)', color: 'var(--primary)' }}>
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                <p className="text-[10px] shrink-0 ml-2" style={{ color: 'var(--text-dim)' }}>{c.time}</p>
              </div>
              <div className="flex items-center justify-between mt-0.5">
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

      {/* Inline chat expand */}
      <AnimatePresence>
        {activeChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)' }}
          >
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              {activeChat.messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="px-3 py-2 rounded-2xl text-xs max-w-[80%]"
                    style={{
                      background: m.from === 'user' ? 'var(--primary)' : 'var(--elevated)',
                      color: m.from === 'user' ? '#fff' : 'var(--text-primary)',
                      borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 pb-4">
              <input
                value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm px-3 py-2 rounded-full outline-none"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
              <button className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary)' }}>
                <Send size={13} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── TIMELINE ──────────────────────────────────────────────────────────────────
function Timeline({ eventDate }) {
  const ACCENT = '#1A6969'
  const today = new Date()

  const items = [
    { date: 'Today', label: 'Event confirmed by EVO', type: 'done', done: true },
    { date: 'Apr 12', label: 'Venue deposit due — ₪2,800', type: 'payment', done: false },
    { date: 'Apr 18', label: 'Catering tasting at Atelier Culinaire', type: 'meeting', done: false },
    { date: 'Apr 25', label: 'Send guest list to venue', type: 'task', done: false },
    { date: 'May 3',  label: 'Final vendor confirmations', type: 'task', done: false },
    { date: 'May 10', label: 'Music briefing with Noir Sound', type: 'meeting', done: false },
    { date: eventDate || 'Event Day', label: '🎉 Your event!', type: 'event', done: false },
  ]

  const typeStyle = {
    done:    { color: '#22c55e', icon: CheckCircle2, bg: 'rgba(34,197,94,0.1)' },
    payment: { color: '#f59e0b', icon: CreditCard,   bg: 'rgba(245,158,11,0.1)' },
    meeting: { color: '#6366f1', icon: MapPin,        bg: 'rgba(99,102,241,0.1)' },
    task:    { color: '#64748b', icon: Circle,         bg: 'rgba(100,116,139,0.1)' },
    event:   { color: '#ec4899', icon: Star,           bg: 'rgba(236,72,153,0.1)' },
  }

  return (
    <div id="timeline">
      <SectionHeader icon={Calendar} title="Event Timeline" accent={ACCENT} action="Full view" onAction={() => {}} />
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
        <div className="space-y-4">
          {items.map((item, i) => {
            const s = typeStyle[item.type]
            const Icon = s.icon
            return (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{ background: s.bg, border: `2px solid ${item.done ? s.color : 'var(--border)'}` }}>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── VENDOR CARDS ──────────────────────────────────────────────────────────────
function VendorCards({ sections }) {
  const ACCENT = '#6B1F6B'
  return (
    <div id="vendors">
      <SectionHeader icon={Star} title="Your Vendors" accent={ACCENT} action="View all" onAction={() => {}} />
      <div className="space-y-3">
        {sections.map((s, i) => (
          <motion.div key={s.id} whileTap={{ scale: 0.99 }}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              {s.image
                ? <img src={s.image} alt={s.vendor.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(45,27,105,0.08)' }}>
                    {['🏛','🍽','🎵','💡','🌸'][i] || '✨'}
                  </div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.vendor.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{s.label}</span>
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>·</span>
                <span className="text-[11px]" style={{ color: '#f59e0b' }}>⭐ {s.vendor.rating}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>Confirmed</span>
              <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{fmt(s.vendor.price)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── ADD-ONS ───────────────────────────────────────────────────────────────────
function AddOns() {
  const ACCENT = '#1A6940'
  const [added, setAdded] = useState([])
  const items = [
    { id: 1, name: 'Floral arch & centerpieces', price: 2400, tag: 'Popular', emoji: '🌸' },
    { id: 2, name: 'Photo booth experience',     price: 1800, tag: 'New',     emoji: '📸' },
    { id: 3, name: 'Late-night bar extension',   price: 3200, tag: '',        emoji: '🍹' },
    { id: 4, name: 'Custom neon sign',           price: 1200, tag: '',        emoji: '💡' },
    { id: 5, name: 'Live caricature artist',     price: 2000, tag: 'Loved',   emoji: '🎨' },
  ]

  return (
    <div id="addons">
      <SectionHeader icon={Sparkles} title="Add-ons & Upgrades" accent={ACCENT} action="Browse all" onAction={() => {}} />
      <div className="space-y-2">
        {items.map(item => {
          const isAdded = added.includes(item.id)
          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
              style={{ background: isAdded ? 'rgba(26,105,64,0.06)' : 'var(--surface)',
                       border: isAdded ? '1.5px solid rgba(26,105,64,0.3)' : '1.5px solid var(--border)' }}>
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  {item.tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(45,27,105,0.1)', color: 'var(--primary)' }}>{item.tag}</span>
                  )}
                </div>
                <p className="text-xs font-semibold mt-0.5" style={{ color: ACCENT }}>{fmt(item.price)}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => setAdded(a => isAdded ? a.filter(x => x !== item.id) : [...a, item.id])}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg font-bold transition-all"
                style={{ background: isAdded ? ACCENT : 'rgba(26,105,64,0.12)', color: isAdded ? '#fff' : ACCENT }}>
                {isAdded ? '✓' : '+'}
              </motion.button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
function Payments({ sections }) {
  const ACCENT = '#6B4A1A'
  const total = sections.reduce((s, sec) => s + sec.vendor.price, 0)
  const deposit = Math.round(total * 0.2)

  const rows = sections.map((s, i) => ({
    name: s.vendor.name,
    cat:  s.label,
    deposit: Math.round(s.vendor.price * 0.2),
    due: ['Apr 12', 'Apr 20', 'Apr 28', 'May 5', 'May 10'][i] || 'TBD',
    paid: false,
  }))

  return (
    <div id="payments">
      <SectionHeader icon={CreditCard} title="Payments & Deposits" accent={ACCENT} />

      {/* Summary */}
      <div className="flex gap-3 mb-4">
        {[
          { label: 'Total event', value: fmt(total) },
          { label: 'Total deposits', value: fmt(deposit) },
        ].map(card => (
          <div key={card.label} className="flex-1 px-4 py-3 rounded-2xl text-center"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-dim)' }}>{card.label}</p>
            <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="px-4 py-3 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
              <p className="text-xs font-bold" style={{ color: r.paid ? '#16a34a' : ACCENT }}>{fmt(r.deposit)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{r.cat} · Deposit due {r.due}</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: r.paid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                         color: r.paid ? '#16a34a' : '#d97706' }}>
                {r.paid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <motion.button whileTap={{ scale: 0.97 }}
        className="w-full mt-4 py-3.5 rounded-full text-sm font-bold tracking-wide text-center"
        style={{ background: ACCENT, color: '#fff', boxShadow: `0 4px 16px ${ACCENT}40` }}>
        Pay deposits — {fmt(deposit)}
      </motion.button>
    </div>
  )
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function EventDashboard() {
  const { navigate, eventPackage, briefAnswers, totalPrice } = useApp()

  const sections = eventPackage?.sections || []
  const eventName = eventPackage?.name || 'Your Event'
  const eventDate = briefAnswers?.date !== 'flexible' ? briefAnswers?.date : null
  const days = eventDate ? daysUntil(eventDate) : null
  const guestMap = { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }
  const guests = briefAnswers?.scale ? guestMap[briefAnswers.scale] : null

  const tabs = [
    { id: 'chat',     label: 'Chat',     icon: MessageCircle },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'vendors',  label: 'Vendors',  icon: Star },
    { id: 'addons',   label: 'Add-ons',  icon: Sparkles },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ]
  const [activeTab, setActiveTab] = useState('chat')

  const scrollTo = (id) => {
    setActiveTab(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-1" style={{ color: 'var(--primary)' }}>
              Your Event
            </p>
            <h1 className="text-xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {eventName}
            </h1>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
            <Bell size={15} style={{ color: 'var(--text-muted)' }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
          </button>
        </div>

        {/* Event meta chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {eventDate && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(45,27,105,0.08)', border: '1px solid rgba(45,27,105,0.15)' }}>
              <Calendar size={11} style={{ color: 'var(--primary)' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'var(--primary)' }}>{eventDate}</span>
            </div>
          )}
          {days !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
              <Clock size={11} style={{ color: '#ec4899' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#ec4899' }}>
                {days > 0 ? `${days} days to go` : 'Today!'}
              </span>
            </div>
          )}
          {guests && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(26,105,64,0.08)', border: '1px solid rgba(26,105,64,0.15)' }}>
              <Users size={11} style={{ color: '#1A6940' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#1A6940' }}>{guests} guests</span>
            </div>
          )}
          {totalPrice > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(107,74,26,0.08)', border: '1px solid rgba(107,74,26,0.15)' }}>
              <CreditCard size={11} style={{ color: '#6B4A1A' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#6B4A1A' }}>{fmt(totalPrice)}</span>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => scrollTo(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold shrink-0 transition-all"
                style={{
                  background: active ? 'var(--primary)' : 'var(--elevated)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  border: active ? 'none' : '1px solid var(--border)',
                }}>
                <Icon size={12} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 pb-20">

        <ChatsPanel vendors={sections.length > 0 ? sections : [
          { vendor: { id: 'v1', name: 'The Pearl House', rating: 4.9, price: 14000 }, label: 'Venue' },
          { vendor: { id: 'v2', name: 'Atelier Culinaire', rating: 4.8, price: 18000 }, label: 'Catering' },
          { vendor: { id: 'v3', name: 'Noir Sound', rating: 4.7, price: 6000 }, label: 'Music' },
        ]} />

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <Timeline eventDate={eventDate} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <VendorCards sections={sections.length > 0 ? sections : [
            { id: 'venue', label: 'Venue', image: null, vendor: { name: 'The Pearl House', rating: 4.9, price: 14000 } },
            { id: 'catering', label: 'Catering', image: null, vendor: { name: 'Atelier Culinaire', rating: 4.8, price: 18000 } },
            { id: 'music', label: 'Music', image: null, vendor: { name: 'Noir Sound', rating: 4.7, price: 6000 } },
          ]} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <AddOns />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <Payments sections={sections.length > 0 ? sections : [
            { label: 'Venue',    vendor: { name: 'The Pearl House',   price: 14000 } },
            { label: 'Catering', vendor: { name: 'Atelier Culinaire', price: 18000 } },
            { label: 'Music',    vendor: { name: 'Noir Sound',         price: 6000  } },
          ]} />
        </div>

      </div>
    </div>
  )
}
