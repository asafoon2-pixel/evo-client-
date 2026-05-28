import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, MessageCircle, Calendar, CreditCard, User,
  Bell, ChevronRight, Send, Plus, X, Check,
  CheckCircle2, Circle, MapPin, Users, Clock,
  Camera, Edit2, Instagram, Sparkles, Percent, Tag, ArrowLeft, Star,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { listenToClientLeads, listenToMessages, sendMessage } from '../lib/leadsService'
import { submitReview } from '../lib/reviewsService'

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
function HomeTab({ eventName, eventDate, days, guests, leads, navigate }) {
  const realTotal = leads.reduce((sum, l) => sum + (l.order_total || 0), 0)
  const vendorImages = leads.map(l => l.heroImage).filter(Boolean)

  return (
    <div className="flex flex-col pb-4">

      {/* Back button */}
      <div className="px-6 pt-5">
        <button onClick={() => navigate('myEvents')}
          className="flex items-center gap-2 text-sm mb-4"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} style={{ transform: 'scaleX(-1)' }} />
          חזרה לדף הבית
        </button>
      </div>

      {/* Event header */}
      <div className="px-6 pb-6">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--primary)' }}>
          האירוע שלך
        </p>
        <h1 className="text-2xl font-semibold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>
          {eventName}
        </h1>
        <div className="flex flex-wrap gap-2">
          {eventDate && <Chip icon={<Calendar size={11} />} label={eventDate} color="#2D1B69" />}
          {days !== null && <Chip icon={<Clock size={11} />} label={days > 0 ? `עוד ${days} ימים` : 'היום!'} color="#ec4899" />}
          {guests && <Chip icon={<Users size={11} />} label={`${guests} אורחים`} color="#1A6940" />}
          {realTotal > 0 && <Chip icon={<CreditCard size={11} />} label={fmt(realTotal)} color="#6B4A1A" />}
        </div>
      </div>

      {/* Suppliers gallery — real images from leads */}
      <div className="px-6 mb-6">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
          הספקים שלי
        </p>
        {leads.length === 0 ? (
          <div className="rounded-2xl py-10 text-center"
            style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>עדיין לא הוספת ספקים לאירוע</p>
            <button onClick={() => navigate('categories')}
              className="mt-3 text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              חפש ספקים
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {leads.map((lead, i) => (
              <div key={lead.id} className="relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: i === 0 && leads.length > 1 ? '16/10' : '1', gridColumn: i === 0 && leads.length > 1 ? 'span 2' : 'span 1' }}>
                {lead.heroImage ? (
                  <img src={lead.heroImage} alt={lead.vendor_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'rgba(107,95,228,0.1)' }}>
                    <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                      {lead.vendor_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
                <div className="absolute bottom-2 right-2 left-2">
                  <p className="text-white text-xs font-semibold truncate">{lead.vendor_name}</p>
                  <p className="text-white/70 text-[10px]">{lead.category}</p>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: lead.status === 'booked' ? 'rgba(74,158,114,0.85)' : 'rgba(245,158,11,0.85)',
                      color: '#fff',
                    }}>
                    {lead.status === 'booked' ? 'מאושר' : 'ממתין'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order items per supplier */}
      {leads.some(l => l.order_items?.length > 0) && (
        <div className="px-6 mb-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
            פירוט הזמנות
          </p>
          <div className="space-y-2">
            {leads.filter(l => l.order_items?.length > 0).map(lead => (
              <div key={lead.id} className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lead.vendor_name}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                    {fmt(lead.order_total || lead.order_items.reduce((s, i) => s + (i.price||0)*(i.quantity||1), 0))}
                  </p>
                </div>
                {lead.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: 'rgba(107,95,228,0.1)', color: 'var(--primary)' }}>
                        {item.type === 'package' ? 'חבילה' : 'מוצר'}
                      </span>
                      <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{item.item_name}</p>
                    </div>
                    <p className="text-xs font-semibold shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                      {item.quantity > 1 ? `x${item.quantity} · ` : ''}{fmt((item.price||0)*(item.quantity||1))}
                    </p>
                  </div>
                ))}
              </div>
            ))}
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
const CHAT_COLORS = ['#2D1B69','#1A6940','#6B1F6B','#6B4A1A','#2C5F8A','#7A3F1A']

function ChatThread({ lead, currentUser, onBack }) {
  const [messages, setMessages] = useState([])
  const [msg, setMsg] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    const unsub = listenToMessages(lead.id, msgs => {
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
    return unsub
  }, [lead.id])

  const doSend = async () => {
    if (!msg.trim()) return
    const text = msg.trim()
    setMsg('')
    try {
      await sendMessage(lead.id, currentUser.uid, currentUser.displayName || 'לקוח', text, 'client')
    } catch (e) { console.error(e) }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 pt-5 pb-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>←</button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
          style={{ background: 'rgba(107,95,228,0.12)', color: 'var(--primary)' }}>
          {lead.vendor_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lead.vendor_name}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{lead.category}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>הפנייה נשלחה לספק. הוא יחזור אליך בקרוב.</p>
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.from === 'client'
          return (
            <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div>
                <div className="px-4 py-2.5 text-sm leading-relaxed max-w-[75vw]"
                  style={{
                    background: isMe ? 'var(--primary)' : 'var(--surface)',
                    color: isMe ? '#fff' : 'var(--text-primary)',
                    borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    border: !isMe ? '1px solid var(--border)' : 'none',
                  }}>
                  {m.text}
                </div>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-right' : ''}`} style={{ color: 'var(--text-dim)' }}>
                  {m.sender_name} {m.time?.toDate ? new Date(m.time.toDate()).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-6 pt-3 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
        <input value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSend()}
          placeholder="הודעה לספק..."
          className="flex-1 px-4 py-3 text-sm rounded-full outline-none"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={doSend}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: msg.trim() ? 'var(--primary)' : 'var(--border)' }}>
          <Send size={14} color={msg.trim() ? '#fff' : 'var(--text-dim)'} />
        </motion.button>
      </div>
    </div>
  )
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => onChange(s)}>
          <Star size={22} style={{ color: '#C8A96E', fill: s <= value ? '#C8A96E' : 'none', transition: 'fill 0.1s' }} />
        </button>
      ))}
    </div>
  )
}

function ReviewModal({ lead, currentUser, onClose }) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!rating || saving) return
    setSaving(true)
    try {
      await submitReview(lead.vendor_id, lead.id, currentUser.uid, currentUser.displayName || 'לקוח', rating, text)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-10" style={{ background: 'var(--surface)' }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />
        <p className="text-base font-semibold mb-1 text-right" style={{ color: 'var(--text-primary)' }}>דרג את {lead.vendor_name}</p>
        <p className="text-xs mb-5 text-right" style={{ color: 'var(--text-muted)' }}>כיצד היה השירות?</p>
        <div className="flex justify-center mb-4">
          <StarRating value={rating} onChange={setRating} />
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="שתף/י את החוויה שלך (אופציונלי)..."
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none mb-4"
          style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', resize: 'none', direction: 'rtl' }}
        />
        <button onClick={submit} disabled={!rating || saving}
          className="w-full py-3.5 rounded-full text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: 'var(--primary)' }}>
          {saving ? 'שולח...' : 'שלח ביקורת'}
        </button>
      </div>
    </div>
  )
}

function ChatTab() {
  const { currentUser, navigate, setCurrentCategory } = useApp()
  const [leads, setLeads] = useState([])
  const [activeLead, setActiveLead] = useState(null)
  const [reviewLead, setReviewLead] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    const unsub = listenToClientLeads(currentUser.uid, setLeads)
    return unsub
  }, [currentUser])

  if (activeLead) {
    return <ChatThread lead={activeLead} currentUser={currentUser} onBack={() => setActiveLead(null)} />
  }

  return (
    <div className="px-6 pt-8 pb-4">
      {reviewLead && <ReviewModal lead={reviewLead} currentUser={currentUser} onClose={() => setReviewLead(null)} />}
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>שיחות</h2>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>השיחות שלך עם ספקים</p>

      {!currentUser && (
        <div className="py-12 text-center rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-3xl mb-3">🔒</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>יש להתחבר כדי לראות שיחות</p>
        </div>
      )}

      {currentUser && leads.length === 0 && (
        <div className="py-12 text-center rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-3xl mb-3">💬</p>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>אין שיחות עדיין</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>בחר ספקים מהקטגוריות ושלח פנייה</p>
        </div>
      )}

      <div className="space-y-2">
        {leads.map((lead, i) => (
          <div key={lead.id}>
            <motion.button whileTap={{ scale: 0.99 }} onClick={() => setActiveLead(lead)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right"
              style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                style={{ background: CHAT_COLORS[i % CHAT_COLORS.length] + '18', color: CHAT_COLORS[i % CHAT_COLORS.length] }}>
                {lead.vendor_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{lead.vendor_name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {lead.last_message || (lead.status === 'new' ? 'פנייה נשלחה — ממתין לתגובה' : lead.status)}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: lead.status === 'booked' ? 'var(--success-dim)' : lead.status === 'new' ? 'rgba(245,158,11,0.12)' : lead.status === 'declined' ? 'rgba(239,68,68,0.1)' : 'var(--elevated)',
                  color: lead.status === 'booked' ? 'var(--success)' : lead.status === 'new' ? '#d97706' : lead.status === 'declined' ? '#EF4444' : 'var(--text-dim)',
                }}>
                {lead.status === 'new' ? 'ממתין' : lead.status === 'booked' ? 'מאושר' : lead.status === 'declined' ? 'נדחה' : lead.status}
              </span>
            </motion.button>
            {lead.status === 'booked' && !lead.reviewed && (
              <button onClick={() => setReviewLead(lead)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl mt-1"
                style={{ background: 'rgba(200,169,110,0.1)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.2)' }}>
                <Star size={12} style={{ fill: '#C8A96E', color: '#C8A96E' }} />
                דרג את {lead.vendor_name}
              </button>
            )}
            {lead.status === 'declined' && (
              <div className="mt-1 rounded-xl overflow-hidden"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                {lead.decline_reason && (
                  <p className="px-3 pt-2.5 pb-1 text-xs" style={{ color: '#EF4444' }}>
                    סיבה: {lead.decline_reason}
                  </p>
                )}
                <button onClick={() => { setCurrentCategory(lead.category?.toLowerCase()); navigate('supplierList') }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold"
                  style={{ color: 'var(--primary)' }}>
                  מצא ספק חלופי ←
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TIMELINE TAB ──────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  done:    { color: '#22c55e', icon: CheckCircle2, label: 'הושלם' },
  payment: { color: '#f59e0b', icon: CreditCard,   label: 'תשלום' },
  meeting: { color: '#6366f1', icon: MapPin,        label: 'פגישה' },
  task:    { color: '#64748b', icon: Circle,         label: 'משימה' },
  event:   { color: '#ec4899', icon: Sparkles,       label: 'אירוע' },
}

// vendorStatus: 'confirmed' | 'awaiting' | 'cancelled'
function buildTimelineItems(selectedSuppliers, briefDate) {
  const base = [
    { id: 1, date: 'היום', label: 'אירוע נפתח ב-EVO', type: 'done', done: true, vendorStatus: 'confirmed', vendorName: 'EVO' },
  ]
  let id = 2
  Object.entries(selectedSuppliers).forEach(([catId, supplier]) => {
    base.push({
      id: id++,
      date: '—',
      label: `אישור ספק — ${supplier.name}`,
      type: 'task',
      done: false,
      vendorStatus: 'awaiting',
      vendorName: supplier.name,
    })
  })
  base.push({ id: id++, date: '—', label: 'שלח רשימת אורחים סופית', type: 'task', done: false })
  base.push({ id: id++, date: '—', label: 'אישורי ספקים אחרונים', type: 'task', done: false })
  if (briefDate && briefDate !== 'flexible') {
    base.push({ id: id++, date: briefDate, label: '🎉 יום האירוע שלך!', type: 'event', done: false })
  } else {
    base.push({ id: id++, date: 'תאריך גמיש', label: '🎉 יום האירוע שלך!', type: 'event', done: false })
  }
  return base
}

const VENDOR_STATUS_STYLE = {
  confirmed: { label: '✅ מאושר',  bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  awaiting:  { label: '⏳ ממתין',  bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  cancelled: { label: '❌ בוטל',   bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
}

const TIMELINE_KEY = 'evo_timeline_items'

function TimelineTab() {
  const { selectedSuppliers, briefAnswers, currentEventId } = useApp()
  const storageKey = currentEventId ? `${TIMELINE_KEY}_${currentEventId}` : TIMELINE_KEY

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return buildTimelineItems(selectedSuppliers, briefAnswers?.date)
  })
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ date: '', label: '', type: 'task' })

  const persist = (next) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch (_) {}
    return next
  }

  const toggle = (id) => setItems(prev => persist(prev.map(i => i.id === id ? { ...i, done: !i.done } : i)))

  const addItem = () => {
    if (!newItem.label.trim() || !newItem.date.trim()) return
    setItems(prev => persist([...prev, { ...newItem, id: Date.now(), done: false }]))
    setNewItem({ date: '', label: '', type: 'task' })
    setAdding(false)
  }

  return (
    <div className="px-6 pt-8 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>ציר זמן</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAdding(a => !a)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: adding ? 'var(--primary)' : 'rgba(45,27,105,0.08)', color: adding ? '#fff' : 'var(--primary)' }}>
          <Plus size={12} /> הוסף פריט
        </motion.button>
      </div>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>המסע המלא של האירוע שלך</p>

      {/* Add item form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden mb-5">
            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>פריט חדש</p>
              <input value={newItem.label} onChange={e => setNewItem(n => ({ ...n, label: e.target.value }))}
                placeholder="מה קורה?" className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              <div className="flex gap-2">
                <input value={newItem.date} onChange={e => setNewItem(n => ({ ...n, date: e.target.value }))}
                  placeholder="תאריך (למשל 5/5)" className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none"
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
                  style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}>ביטול</button>
                <button onClick={addItem} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--primary)', color: '#fff' }}>הוסף</button>
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
function PaymentsTab({ sections, totalPrice, leads }) {
  const { selectedSuppliers } = useApp()

  // Prefer real leads from Firestore
  const leadRows = (leads || []).map((l, i) => ({
    label: l.category || l.vendor_name,
    vendor: { name: l.vendor_name, price: l.order_total || 0 },
    dep: Math.round((l.order_total || 0) * 0.2),
    due: ['12/4', '20/4', '28/4', '5/5'][i] || 'בהמשך',
    paid: l.status === 'booked',
  }))

  const supplierRows = Object.entries(selectedSuppliers).map(([catId, s], i) => ({
    label: catId,
    vendor: { name: s.name, price: s.selectedPackage?.price || 0 },
    dep: Math.round((s.selectedPackage?.price || 0) * 0.2),
    due: 'בהמשך',
    paid: false,
  }))

  const rows = leadRows.length > 0
    ? leadRows
    : supplierRows.length > 0
    ? supplierRows
    : sections.map((s, i) => ({
        ...s,
        dep: Math.round((s.vendor?.price || 0) * 0.2),
        due: ['12/4', '20/4', '28/4', '5/5'][i] || 'בהמשך',
        paid: false,
      }))

  const realTotal  = leadRows.length > 0
    ? leadRows.reduce((s, r) => s + r.vendor.price, 0)
    : (totalPrice || 0)
  const totalDep   = rows.reduce((s, r) => s + r.dep, 0)
  const paidAmount = rows.filter(r => r.paid).reduce((s, r) => s + r.dep, 0)
  const pending    = totalDep - paidAmount

  return (
    <div className="px-6 pt-8 pb-4">
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>תשלומים</h2>
      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>כל המקדמות והיתרות</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'פר"ך אירוע', value: fmt(realTotal), sub: '' },
          { label: 'שולם',      value: fmt(paidAmount), sub: 'מקדמות' },
          { label: 'ממתין',     value: fmt(pending),    sub: 'מקדמות' },
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
        לוח מקדמות
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
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{r.label} · לתשלום {r.due}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: r.paid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                         color: r.paid ? '#16a34a' : '#d97706' }}>
                {r.paid ? '✓ שולם' : 'ממתין'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <motion.button whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full text-sm font-bold tracking-wide"
          style={{ background: '#6B4A1A', color: '#fff', boxShadow: '0 4px 16px rgba(107,74,26,0.35)' }}>
          שלם מקדמות ממתינות — {fmt(pending)}
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
    { key: 'fullName',  label: 'שם מלא',        placeholder: 'השם שלך', icon: User,      multiline: false },
    { key: 'instagram', label: 'Instagram',      placeholder: '@handle',  icon: Instagram,  multiline: false },
    { key: 'bio',       label: 'אודותיך',        placeholder: 'מבוא קצר — מי אתה כמארח אירוע?', icon: Edit2, multiline: true },
    { key: 'vibe',      label: 'ויב האירוע שלך', placeholder: 'תאר את הטעם והסגנון שלך כדי שהספקים יבינו אותך...', icon: Sparkles, multiline: true },
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
          {local.fullName || 'השם שלך'}
        </p>
        {local.instagram && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{local.instagram}</p>
        )}
        <p className="text-[11px] mt-2 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(45,27,105,0.07)', color: 'var(--primary)' }}>
          גלוי לספקים שלך
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
                  {isEditing ? 'שמור' : 'ערוך'}
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

// ── DEALS ─────────────────────────────────────────────────────────────────────
const DEALS = [
  {
    id: 1,
    vendor: 'Studio One',
    category: 'צילום',
    discount: '15%',
    description: 'חבילת צילום + וידאו — תקף ל-30 יום',
    emoji: '📸',
    color: '#6B5FE4',
  },
  {
    id: 2,
    vendor: 'Lumière Studio',
    category: 'תאורה',
    discount: '10%',
    description: 'עיצוב תאורה מלא לאירועים עד 150 אורחים',
    emoji: '💡',
    color: '#C8A96E',
  },
  {
    id: 3,
    vendor: 'The Craft Bar',
    category: 'בר',
    discount: '12%',
    description: 'חבילת פרמיום כולל ציוד ואנשי צוות',
    emoji: '🍹',
    color: 'var(--success)',
  },
  {
    id: 4,
    vendor: 'Wild Botanica',
    category: 'עיצוב',
    discount: '20%',
    description: 'עיצוב פרחוני לשולחנות ומרכזי חלל',
    emoji: '🌸',
    color: '#D4607A',
  },
]

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'home',     label: 'בית',      Icon: Home },
  { id: 'chat',     label: 'צ׳אט',     Icon: MessageCircle },
  { id: 'timeline', label: 'ציר זמן',  Icon: Calendar },
  { id: 'payments', label: 'תשלומים',  Icon: CreditCard },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function EventDashboard() {
  const { eventPackage, briefAnswers, totalPrice, selectedSuppliers, currentUser, navigate, generatedEvent } = useApp()
  const [tab, setTab] = useState('home')
  const [showDeals, setShowDeals] = useState(false)
  const [leads, setLeads] = useState([])
  const dealsCount = DEALS.length

  // Payment modal state
  const [payLead, setPayLead] = useState(null)
  const [payDone, setPayDone] = useState(new Set())
  const [paySuccess, setPaySuccess] = useState(false)
  const prevStatuses = useRef({})

  useEffect(() => {
    if (!currentUser) return
    const unsub = listenToClientLeads(currentUser.uid, setLeads)
    return unsub
  }, [currentUser])

  // Detect newly booked leads and show payment modal
  useEffect(() => {
    leads.forEach(lead => {
      const prev = prevStatuses.current[lead.id]
      if (lead.status === 'booked' && prev !== undefined && prev !== 'booked' && !payDone.has(lead.id)) {
        setPayLead(lead)
      }
      prevStatuses.current[lead.id] = lead.status
    })
  }, [leads, payDone])

  const sections  = eventPackage?.sections || []
  const eventName = eventPackage?.name || generatedEvent?.name || 'האירוע שלי'
  const eventDate = briefAnswers?.date !== 'flexible' ? briefAnswers?.date : null
  const days      = eventDate ? daysUntil(eventDate) : null
  const guestMap  = { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }
  const guests    = briefAnswers?.scale ? guestMap[briefAnswers.scale] : null

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Subtle animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {[
          { x: '5%',  y: '20%', size: 200, color: 'rgba(107,95,228,0.035)', dur: 12, d: 0 },
          { x: '65%', y: '8%',  size: 140, color: 'rgba(232,184,109,0.04)', dur: 14, d: 2 },
          { x: '70%', y: '55%', size: 120, color: 'rgba(74,158,114,0.035)', dur: 10, d: 1 },
        ].map((b, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ left: b.x, top: b.y, width: b.size, height: b.size, background: b.color, filter: 'blur(50px)' }}
            animate={{ y: [0, -15, 0], x: [0, 6, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
          />
        ))}
      </div>

      {/* Top bar — minimal, just notification bell */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {tab === 'home' ? eventName
           : tab === 'chat' ? 'שיחות'
           : tab === 'timeline' ? 'ציר זמן'
           : tab === 'payments' ? 'תשלומים'
           : 'פרופיל'}
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
                days={days} guests={guests}
                leads={leads} navigate={navigate}
              />
            )}
            {tab === 'chat'     && <ChatTab />}
            {tab === 'timeline' && <TimelineTab />}
            {tab === 'payments' && <PaymentsTab sections={sections} totalPrice={totalPrice || 0} leads={leads} />}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating deals button + panel — contained within max-w-md column */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none"
        style={{ paddingBottom: 88 }}>

        {/* Deals panel */}
        <AnimatePresence>
          {showDeals && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-4 mb-3 rounded-3xl overflow-hidden pointer-events-auto"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E8A030, #C8763A)' }}>
                    <Percent size={14} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>מבצעים עבורך</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{DEALS.length} הצעות זמינות</p>
                  </div>
                </div>
                <button onClick={() => setShowDeals(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--surface)' }}>
                  <X size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              {/* Deals list */}
              <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto">
                {DEALS.map(deal => (
                  <div key={deal.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{ background: deal.color + '14' }}>
                      {deal.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{deal.vendor}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: deal.color + '18', color: deal.color }}>-{deal.discount}</span>
                      </div>
                      <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{deal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating button */}
        <div className="flex justify-end px-5 pointer-events-auto">
          <motion.button
            onClick={() => setShowDeals(s => !s)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative"
            style={{ background: 'linear-gradient(135deg, #E8A030, #C8763A)', boxShadow: '0 8px 24px rgba(200,118,58,0.45)' }}
            whileTap={{ scale: 0.92 }}
            animate={{ scale: showDeals ? 0.9 : 1 }}
          >
            <Percent size={22} color="white" />
            {!showDeals && dealsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'var(--primary)', color: '#fff', border: '2px solid var(--background)' }}>
                {dealsCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
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

      {/* Payment / deposit modal */}
      <AnimatePresence>
        {payLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center"
            style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.55)' }}
          >
            <motion.div
              dir="rtl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-full max-w-md rounded-t-3xl overflow-hidden"
              style={{ background: 'var(--background)', boxShadow: '0 -20px 60px rgba(0,0,0,0.25)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
              </div>

              {/* Header */}
              <div className="px-6 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  ✅ {payLead.vendor_name} אישר את ההזמנה!
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  כדי לאשר את ההזמנה, שלם מקדמה של 20%
                </p>
              </div>

              {/* Order items */}
              {payLead.order_items?.length > 0 && (
                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
                    פירוט הזמנה
                  </p>
                  <div className="space-y-2">
                    {payLead.order_items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                            style={{ background: 'rgba(107,95,228,0.1)', color: 'var(--primary)' }}>
                            {item.type === 'package' ? 'חבילה' : 'מוצר'}
                          </span>
                          <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.item_name}</p>
                        </div>
                        <p className="text-sm font-semibold shrink-0 mr-2" style={{ color: 'var(--text-muted)' }}>
                          {item.quantity > 1 ? `x${item.quantity} · ` : ''}{fmt((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total + deposit */}
              <div className="px-6 py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>סה״כ הזמנה</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(payLead.order_total || 0)}</p>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(107,95,228,0.1)', border: '1.5px solid rgba(107,95,228,0.25)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>מקדמה (20%)</p>
                  <p className="text-base font-bold" style={{ color: 'var(--primary)' }}>
                    {fmt(Math.round((payLead.order_total || 0) * 0.2))}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-10 pt-2 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setPayDone(prev => new Set([...prev, payLead.id]))
                    setPayLead(null)
                    setPaySuccess(true)
                    setTimeout(() => setPaySuccess(false), 2000)
                  }}
                  className="w-full py-4 rounded-full text-base font-bold"
                  style={{ background: 'var(--primary)', color: '#fff', boxShadow: '0 6px 20px rgba(107,95,228,0.4)' }}
                >
                  שלם מקדמה — {fmt(Math.round((payLead.order_total || 0) * 0.2))}
                </motion.button>
                <button
                  onClick={() => setPayLead(null)}
                  className="w-full text-sm py-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  אחר כך
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment success toast */}
      <AnimatePresence>
        {paySuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 20px rgba(22,163,74,0.4)', whiteSpace: 'nowrap' }}
          >
            ✓ מקדמה שולמה בהצלחה!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
