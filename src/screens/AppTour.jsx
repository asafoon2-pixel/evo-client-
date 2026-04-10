import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { X, Star, Zap, ArrowRight, RefreshCw, MessageCircle, Calendar, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ── Simulated tap indicator ──────────────────────────────────────────────────
function TapRipple({ x, y, onDone }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.9 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onAnimationComplete={onDone}
      className="absolute pointer-events-none rounded-full"
      style={{
        width: 40, height: 40,
        left: x - 20, top: y - 20,
        background: 'rgba(255,255,255,0.35)',
        border: '1.5px solid rgba(255,255,255,0.6)',
        zIndex: 100,
      }}
    />
  )
}

// ── Typing animation for chat ─────────────────────────────────────────────────
function TypedText({ text, delay = 0, speed = 28, style, className }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    let timeout
    const start = setTimeout(() => {
      const step = () => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i < text.length) timeout = setTimeout(step, speed)
        else setDone(true)
      }
      step()
    }, delay)
    return () => { clearTimeout(start); clearTimeout(timeout) }
  }, [text, delay, speed])
  return <span className={className} style={style}>{displayed}{!done && <span className="opacity-60">|</span>}</span>
}

// ── SCENE 1: Chat ─────────────────────────────────────────────────────────────
function SceneChat({ active }) {
  const [phase, setPhase] = useState(0) // 0=idle, 1=typing, 2=sent, 3=reply
  const [tapPos, setTapPos] = useState(null)

  useEffect(() => {
    if (!active) { setPhase(0); return }
    const t1 = setTimeout(() => setTapPos({ x: 200, y: 300 }), 600)
    const t2 = setTimeout(() => setTapPos(null), 1100)
    const t3 = setTimeout(() => setPhase(1), 1000)
    const t4 = setTimeout(() => setPhase(2), 3200)
    const t5 = setTimeout(() => setPhase(3), 4400)
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout)
  }, [active])

  const messages = [
    { from: 'vendor', name: 'The Pearl House', msg: 'היי! מצפה לאירוע שלך 🎉', time: '10:42' },
    { from: 'vendor', name: 'The Pearl House', msg: 'הגג יהיה מוכן משעה 18:00.', time: '10:43' },
  ]

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <div className="w-full h-full" style={{ background: 'var(--primary-dim)' }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>The Pearl House</p>
          <p className="text-[10px]" style={{ color: '#22c55e' }}>מחובר</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-hidden">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 + 0.2 }}
            className="flex justify-start">
            <div>
              <p className="text-[10px] font-semibold mb-1 ml-1" style={{ color: 'var(--text-muted)' }}>{m.name}</p>
              <div className="px-3 py-2 rounded-2xl text-xs max-w-[75%]"
                style={{ background: 'var(--elevated)', color: 'var(--text-primary)', borderRadius: '4px 18px 18px 18px' }}>
                {m.msg}
              </div>
            </div>
          </motion.div>
        ))}

        {/* User typing */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-end">
              <div className="px-3 py-2 rounded-2xl text-xs"
                style={{ background: 'var(--primary)', color: '#fff', borderRadius: '18px 18px 4px 18px', maxWidth: '75%' }}>
                {phase === 1 ? (
                  <TypedText text="אפשר לעשות ביקור אתר ביום חמישי הקרוב?" speed={32} />
                ) : (
                  'אפשר לעשות ביקור אתר ביום חמישי הקרוב?'
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vendor reply */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div key="reply" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex justify-start">
              <div>
                <p className="text-[10px] font-semibold mb-1 ml-1" style={{ color: 'var(--text-muted)' }}>The Pearl House</p>
                <div className="px-3 py-2 rounded-2xl text-xs"
                  style={{ background: 'var(--elevated)', color: 'var(--text-primary)', borderRadius: '4px 18px 18px 18px', maxWidth: '75%' }}>
                  בהחלט — 15:00 מתאים? 😊
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <motion.div animate={{ y: phase >= 1 ? 0 : 4, opacity: phase >= 1 ? 1 : 0.5 }}
        className="flex items-center gap-2 px-3 py-2 mx-3 mb-3 rounded-full"
        style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
        <div className="flex-1 text-xs py-1" style={{ color: phase < 1 ? 'var(--text-muted)' : 'transparent' }}>
          {phase < 1 ? 'הודעה...' : ''}
        </div>
        <motion.div animate={{ scale: phase === 2 ? [1, 1.2, 1] : 1 }}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'var(--primary)' }}>
          <ArrowRight size={12} className="text-white" />
        </motion.div>
      </motion.div>

      {tapPos && <TapRipple x={tapPos.x} y={tapPos.y} onDone={() => {}} />}
    </div>
  )
}

// ── SCENE 2: Timeline ─────────────────────────────────────────────────────────
function SceneTimeline({ active }) {
  const [checked, setChecked] = useState([])
  const [tapPos, setTapPos] = useState(null)

  const items = [
    { id: 'confirm', date: 'היום',   label: 'אירוע אושר',          type: 'done',    locked: true },
    { id: 'dep1',    date: '12/4',   label: 'מקדמת מקום לתשלום',  type: 'payment', amount: '₪2,800' },
    { id: 'taste',   date: '18/4',   label: 'טעימת קייטרינג',      type: 'meeting' },
    { id: 'guests',  date: '3/5',    label: 'ספירת אורחים סופית',  type: 'task' },
  ]

  const typeStyle = {
    done:    { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',    icon: '✓' },
    payment: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',   icon: '₪' },
    meeting: { color: 'var(--primary)', bg: 'var(--primary-dim)', icon: '📍' },
    task:    { color: '#64748b', bg: 'rgba(100,116,139,0.15)',  icon: '○' },
  }

  useEffect(() => {
    if (!active) { setChecked([]); return }
    const t1 = setTimeout(() => setTapPos({ x: 30, y: 210 }), 800)
    const t2 = setTimeout(() => { setTapPos(null); setChecked(['guests']) }, 1300)
    const t3 = setTimeout(() => setTapPos({ x: 30, y: 155 }), 2400)
    const t4 = setTimeout(() => { setTapPos(null); setChecked(['guests', 'taste']) }, 2900)
    return () => [t1,t2,t3,t4].forEach(clearTimeout)
  }, [active])

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--background)' }}>

      <div className="px-4 py-3 shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>ציר זמן</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>מפת הדרך של האירוע</p>
      </div>

      <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
        {items.map((item, i) => {
          const s = typeStyle[item.type]
          const isDone = item.locked || checked.includes(item.id)
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              onClick={() => !item.locked && setChecked(c => c.includes(item.id) ? c.filter(x => x !== item.id) : [...c, item.id])}
              className="flex items-center gap-3">
              <motion.div
                animate={{ scale: isDone ? [1, 1.15, 1] : 1, background: isDone ? s.color : s.bg }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ color: isDone ? '#fff' : s.color }}>
                {isDone ? '✓' : s.icon}
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone && !item.locked ? 'line-through' : 'none' }}>
                  {item.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.date}</p>
                  {item.amount && <p className="text-[10px] font-semibold" style={{ color: s.color }}>{item.amount}</p>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {tapPos && <TapRipple x={tapPos.x} y={tapPos.y} onDone={() => {}} />}
    </div>
  )
}

// ── SCENE 3: Vendors ──────────────────────────────────────────────────────────
function SceneVendors({ active }) {
  const [expanded, setExpanded] = useState(null)
  const [tapPos, setTapPos] = useState(null)

  const vendors = [
    { name: 'The Pearl House',    cat: 'מקום',     rating: 4.9, status: 'מאושר',   color: '#22c55e' },
    { name: 'Atelier Culinaire',  cat: 'קייטרינג', rating: 4.8, status: 'מאושר',   color: '#22c55e' },
    { name: 'Noir Sound',         cat: 'מוזיקה',   rating: 4.7, status: 'ממתין',   color: '#f59e0b' },
  ]

  useEffect(() => {
    if (!active) { setExpanded(null); return }
    const t1 = setTimeout(() => setTapPos({ x: 200, y: 80 }), 700)
    const t2 = setTimeout(() => { setTapPos(null); setExpanded(0) }, 1200)
    const t3 = setTimeout(() => setExpanded(null), 3200)
    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [active])

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--background)' }}>

      <div className="px-4 py-3 shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>ספקים</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>הצוות שלך</p>
      </div>

      <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
        {vendors.map((v, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <motion.div
              onClick={() => setExpanded(expanded === i ? null : i)}
              animate={{ borderColor: expanded === i ? 'var(--primary)' : 'var(--border)' }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{v.cat} · ⭐ {v.rating}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: v.color + '20', color: v.color }}>{v.status}</span>
              </div>

              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden px-3 pb-3">
                    <div className="flex gap-2 pt-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold"
                        style={{ background: 'var(--elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        <ShieldCheck size={9} style={{ color: 'var(--primary)' }} /> מאומת EVO
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold"
                        style={{ background: 'var(--elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        <MessageCircle size={9} /> הודעה
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold"
                        style={{ background: 'var(--elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        <RefreshCw size={9} /> החלף
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {tapPos && <TapRipple x={tapPos.x} y={tapPos.y} onDone={() => {}} />}
    </div>
  )
}

// ── SCENE 4: Add-ons ──────────────────────────────────────────────────────────
function SceneAddons({ active }) {
  const [added, setAdded] = useState([])
  const [tapPos, setTapPos] = useState(null)

  const addons = [
    { name: 'קשת פרחים',   price: '₪2,400', tag: 'פופולרי', emoji: '🌸' },
    { name: 'פינת צילום',  price: '₪1,800', tag: 'חדש',     emoji: '📷' },
    { name: 'בר לילה',     price: '₪3,200', tag: '',        emoji: '🍹' },
  ]

  useEffect(() => {
    if (!active) { setAdded([]); return }
    const t1 = setTimeout(() => setTapPos({ x: 280, y: 105 }), 800)
    const t2 = setTimeout(() => { setTapPos(null); setAdded([0]) }, 1300)
    const t3 = setTimeout(() => setTapPos({ x: 280, y: 165 }), 2200)
    const t4 = setTimeout(() => { setTapPos(null); setAdded([0, 1]) }, 2700)
    return () => [t1,t2,t3,t4].forEach(clearTimeout)
  }, [active])

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--background)' }}>

      <div className="px-4 py-3 shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>תוספות</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>שדרג את האירוע שלך</p>
      </div>

      <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
        {addons.map((a, i) => {
          const isAdded = added.includes(i)
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setAdded(arr => arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i])}
              className="flex items-center justify-between px-3 py-3 rounded-2xl cursor-pointer"
              style={{
                background: isAdded ? 'var(--primary-dim)' : 'var(--surface)',
                border: `1px solid ${isAdded ? 'var(--primary)' : 'var(--border)'}`,
              }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{a.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold" style={{ color: isAdded ? 'var(--primary)' : 'var(--text-primary)' }}>{a.name}</p>
                    {a.tag && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(45,27,105,0.1)', color: 'var(--primary)' }}>{a.tag}</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--primary)' }}>{a.price}</p>
                </div>
              </div>
              <motion.div animate={{ scale: isAdded ? [1, 1.25, 1] : 1, background: isAdded ? '#22c55e' : 'var(--primary)' }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {isAdded ? '✓' : '+'}
              </motion.div>
            </motion.div>
          )
        })}

        {/* Running total */}
        <AnimatePresence>
          {added.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="flex justify-between items-center px-3 py-2 rounded-xl mt-1"
              style={{ background: 'rgba(45,27,105,0.06)', border: '1px solid rgba(45,27,105,0.12)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{added.length} תוספ{added.length > 1 ? 'ות' : 'ת'} נבחרו</p>
              <p className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                ₪{[2400, 1800, 3200].filter((_, i) => added.includes(i)).reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {tapPos && <TapRipple x={tapPos.x} y={tapPos.y} onDone={() => {}} />}
    </div>
  )
}

// ── SCENE 5: Payments ─────────────────────────────────────────────────────────
function ScenePayments({ active }) {
  const [paid, setPaid] = useState([])
  const [tapPos, setTapPos] = useState(null)

  const payments = [
    { vendor: 'מקום',     amount: '₪2,800', due: 'לתשלום 12/4' },
    { vendor: 'קייטרינג', amount: '₪3,600', due: 'לתשלום 20/4' },
    { vendor: 'מוזיקה',   amount: '₪1,400', due: 'לתשלום 25/4' },
  ]

  useEffect(() => {
    if (!active) { setPaid([]); return }
    const t1 = setTimeout(() => setTapPos({ x: 200, y: 120 }), 700)
    const t2 = setTimeout(() => { setTapPos(null); setPaid([0]) }, 1200)
    return () => [t1,t2].forEach(clearTimeout)
  }, [active])

  const totalPaid = payments.filter((_, i) => paid.includes(i)).reduce((a, p) => a + parseInt(p.amount.replace(/[₪,]/g, '')), 0)
  const totalDue  = payments.filter((_, i) => !paid.includes(i)).reduce((a, p) => a + parseInt(p.amount.replace(/[₪,]/g, '')), 0)

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--background)' }}>

      {/* Summary bar */}
      <div className="px-4 py-3 shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex gap-4">
          <div>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>שולם</p>
            <p className="text-sm font-bold" style={{ color: '#22c55e' }}>₪{totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>לתשלום</p>
            <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>₪{totalDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
        {payments.map((p, i) => {
          const isPaid = paid.includes(i)
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between px-3 py-3 rounded-2xl"
              style={{
                background: isPaid ? 'rgba(34,197,94,0.06)' : 'var(--surface)',
                border: `1px solid ${isPaid ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
              }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.vendor}</p>
                <p className="text-[10px] mt-0.5" style={{ color: isPaid ? '#22c55e' : 'var(--text-muted)' }}>
                  {isPaid ? 'שולם ✓' : p.due}
                </p>
              </div>
              <p className="text-sm font-bold" style={{ color: isPaid ? '#22c55e' : 'var(--text-primary)' }}>
                {p.amount}
              </p>
            </motion.div>
          )
        })}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-start gap-2 px-3 py-2.5 rounded-2xl mt-1"
          style={{ background: 'rgba(45,27,105,0.05)', border: '1px solid rgba(45,27,105,0.1)' }}>
          <Zap size={11} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
          <p className="text-[10px] font-light" style={{ color: 'var(--text-muted)' }}>
            EVO מטפל בכל התשלומים. אתה משלם פעם אחת — אנחנו מתאמים.
          </p>
        </motion.div>
      </div>

      {tapPos && <TapRipple x={tapPos.x} y={tapPos.y} onDone={() => {}} />}
    </div>
  )
}

// ── STEPS CONFIG ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'chat',
    emoji: '💬',
    label: 'צ׳אט',
    color: '#2D1B69',
    bg: 'rgba(45,27,105,0.08)',
    title: 'שוחח עם כל ספק — מיידית',
    desc: 'לכל ספק יש שרשור צ׳אט ייעודי. שאל שאלות, אשר פרטים, שתף מראות — ללא אבדן במיילים.',
    Scene: SceneChat,
  },
  {
    id: 'timeline',
    emoji: '📅',
    label: 'ציר זמן',
    color: '#1A6969',
    bg: 'rgba(26,105,105,0.08)',
    title: 'כל אבן דרך ממופה',
    desc: 'תאריכי מקדמות, טעימות, פגישות ומשימות — מסודרות כדי שלא יפול דבר בין הכסאות.',
    Scene: SceneTimeline,
  },
  {
    id: 'vendors',
    emoji: '⭐',
    label: 'ספקים',
    color: '#6B1F6B',
    bg: 'rgba(107,31,107,0.08)',
    title: 'צוות הספקים שלך, במבט אחד',
    desc: 'ראה דירוגים, אימות ותיק עבודות. החלף או שלח הודעה לכל ספק ממקום אחד.',
    Scene: SceneVendors,
  },
  {
    id: 'addons',
    emoji: '✨',
    label: 'תוספות',
    color: '#1A6940',
    bg: 'rgba(26,105,64,0.08)',
    title: 'שדרג כל רגע',
    desc: 'עיין בתוספות נבחרות — פרחים, פינת צילום, הפתעות לילה — והוסף בנגיעה אחת.',
    Scene: SceneAddons,
  },
  {
    id: 'payments',
    emoji: '💳',
    label: 'תשלומים',
    color: '#7C4A1A',
    bg: 'rgba(124,74,26,0.08)',
    title: 'תשלומים, תחת שליטה מלאה',
    desc: 'כל המקדמות, היתרות והלוחות בתצוגה אחת. תמיד תדע מה שולם ומה הבא.',
    Scene: ScenePayments,
  },
]

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function AppTour() {
  const { navigate } = useApp()
  const [step, setStep]         = useState(0)
  const [direction, setDirection] = useState(1)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const Scene   = current.Scene

  const go = (next) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const next = () => isLast ? navigate('dashboard') : go(step + 1)
  const back = () => step > 0 && go(step - 1)

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[10px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: current.color }}>
          {step + 1} / {STEPS.length}
        </motion.p>
        <button onClick={() => navigate('dashboard')}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <X size={11} /> דלג על הסיור
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 px-6 mb-4">
        {STEPS.map((s, i) => (
          <motion.div key={i}
            animate={{ width: i === step ? 24 : 6, background: i <= step ? current.color : 'var(--border)' }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full cursor-pointer"
            onClick={() => go(i)}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col">

            {/* Label + title */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                key={step}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: current.bg, border: `1.5px solid ${current.color}22` }}>
                {current.emoji}
              </motion.div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: current.color }}>
                  {current.label}
                </p>
                <h2 className="text-lg font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {current.title}
                </h2>
              </div>
            </div>

            <p className="text-sm font-light leading-relaxed mb-4" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
              {current.desc}
            </p>

            {/* Live simulation card */}
            <div className="flex-1 rounded-2xl overflow-hidden relative"
              style={{
                border: `1.5px solid ${current.color}25`,
                boxShadow: `0 4px 32px ${current.color}14`,
                minHeight: 260,
                maxHeight: 320,
              }}>
              {/* "LIVE" badge */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
                <span className="text-[9px] font-bold text-white tracking-wider">LIVE</span>
              </div>
              <Scene active={true} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-5 flex items-center gap-3">
        {step > 0 ? (
          <motion.button whileTap={{ scale: 0.96 }} onClick={back}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            ←
          </motion.button>
        ) : <div className="w-12" />}

        <motion.button whileTap={{ scale: 0.97 }} onClick={next}
          className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide"
          style={{ background: current.color, color: '#fff', boxShadow: `0 4px 24px ${current.color}40` }}>
          <AnimatePresence mode="wait">
            <motion.span key={step}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}>
              {isLast ? 'עבור ללוח הבקרה שלי' : `הבא: ${STEPS[step + 1].label}`}
            </motion.span>
          </AnimatePresence>
          {!isLast && <ArrowRight size={15} />}
        </motion.button>
      </div>
    </div>
  )
}
