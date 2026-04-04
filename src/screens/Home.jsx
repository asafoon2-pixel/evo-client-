import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Sparkles, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

const f = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const CATEGORIES = ['הכל', 'מידברן', 'תוך 48 שעות', 'חתונות', 'קורפורייט', 'ימי הולדת', 'בר מצווה']

const WHY_CARDS = [
  {
    title: 'AI חכם',
    subtitle: 'חבילה מושלמת תוך 3 דקות',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    accent: '#FF2D8A',
  },
  {
    title: 'ספקים מובחרים',
    subtitle: 'רק הטובים ביותר',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    accent: '#2D1B69',
  },
  {
    title: 'הכל במקום אחד',
    subtitle: 'תכנון, תשלום, ניהול',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    accent: '#1E1060',
  },
]

export default function Home() {
  const { navigate } = useApp()
  const [activeCat, setActiveCat] = useState('הכל')

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen overflow-y-auto overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #EEF0FF 0%, #F5F5F7 60%, #E8E6F8 100%)' }}
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 px-5 pt-14 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(238,240,255,0.97) 80%, transparent)' }}>
        <motion.div {...f(0)} className="flex items-center justify-between mb-4">
          {/* Left: avatar */}
          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #2D1B69, #FF2D8A)' }}
              onClick={() => navigate('userprofile')}
            >
              A
            </button>
            <button
              className="text-xs font-medium tracking-widest px-2.5 py-1 rounded-full border"
              style={{ borderColor: 'rgba(45,27,105,0.2)', color: '#2D1B69', background: 'rgba(255,255,255,0.7)' }}
            >
              ≡ EN
            </button>
          </div>

          {/* Right: greeting + logo */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] tracking-wide" style={{ color: 'rgba(45,27,105,0.5)' }}>בוקר טוב</p>
              <p className="text-xs font-semibold" style={{ color: '#1E1060' }}>Asaf 👋</p>
            </div>
            <span
              className="text-xl font-black tracking-[0.3em]"
              style={{ color: '#1E1060', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              EVO
            </span>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.7)' }}>
              <Bell size={16} style={{ color: '#2D1B69' }} />
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.button
          {...f(0.1)}
          onClick={() => navigate('brief')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(45,27,105,0.12)',
            boxShadow: '0 4px 20px rgba(45,27,105,0.08)',
          }}
        >
          <Search size={16} style={{ color: 'rgba(45,27,105,0.35)', flexShrink: 0, marginRight: 'auto', marginLeft: 0 }} />
          <span className="flex-1 text-sm font-light" style={{ color: 'rgba(45,27,105,0.45)' }}>
            איזה אירוע תרצה לבנות?
          </span>
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg, #2D1B69, #FF2D8A)', color: '#fff', flexShrink: 0 }}
          >
            <Sparkles size={10} />
            AI+
          </span>
        </motion.button>
      </div>

      {/* ── Category pills ── */}
      <motion.div {...f(0.15)} className="px-5 mt-2 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ direction: 'rtl' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full transition-all"
              style={
                activeCat === cat
                  ? { background: '#2D1B69', color: '#fff', boxShadow: '0 2px 12px rgba(45,27,105,0.3)' }
                  : { background: 'rgba(255,255,255,0.7)', color: '#2D1B69', border: '1px solid rgba(45,27,105,0.15)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="px-5 space-y-4 pb-24">
        {/* ── Promo card ── */}
        <motion.div
          {...f(0.2)}
          className="relative rounded-3xl overflow-hidden"
          style={{ height: 180 }}
        >
          <img
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
            alt="מידברן"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,16,96,0.85) 0%, rgba(30,16,96,0.3) 60%, transparent 100%)' }} />

          <div className="absolute top-4 right-4">
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{ background: '#FF2D8A', color: '#fff' }}
            >
              הזמנה מוקדמת
            </span>
          </div>

          <div className="absolute bottom-0 right-0 left-0 p-5">
            <p className="text-white text-base font-semibold leading-tight">מידברן 2025</p>
            <p className="text-white/70 text-xs mt-0.5">חבילות מלאות לקאמפים</p>
            <button
              onClick={() => navigate('brief')}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: '#FF2D8A' }}
            >
              בנה חבילה
              <ChevronLeft size={14} />
            </button>
          </div>
        </motion.div>

        {/* ── Quick actions ── */}
        <motion.div {...f(0.3)} className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('management')}
            className="flex flex-col items-end p-4 rounded-2xl text-right"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(45,27,105,0.1)', boxShadow: '0 2px 12px rgba(45,27,105,0.06)' }}
          >
            <span className="text-2xl mb-2">📋</span>
            <p className="text-sm font-semibold" style={{ color: '#1E1060' }}>האירועים שלי</p>
            <p className="text-xs mt-0.5 font-light" style={{ color: 'rgba(45,27,105,0.5)' }}>נהל הזמנות</p>
          </button>
          <button
            onClick={() => navigate('brief')}
            className="flex flex-col items-end p-4 rounded-2xl text-right"
            style={{ background: 'linear-gradient(135deg, #2D1B69, #1E1060)', boxShadow: '0 4px 20px rgba(45,27,105,0.3)' }}
          >
            <span className="text-2xl mb-2">✨</span>
            <p className="text-sm font-semibold text-white">בנה אירוע</p>
            <p className="text-xs mt-0.5 font-light text-white/60">עם AI</p>
          </button>
        </motion.div>

        {/* ── Why EVO ── */}
        <motion.div {...f(0.4)}>
          <p className="text-sm font-semibold mb-3 text-right" style={{ color: '#1E1060' }}>למה EVO?</p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ direction: 'rtl' }}>
            {WHY_CARDS.map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 relative rounded-2xl overflow-hidden"
                style={{ width: 150, height: 120 }}
              >
                <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,16,96,0.85) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 right-0 left-0 p-3">
                  <p className="text-white text-xs font-semibold leading-tight">{card.title}</p>
                  <p className="text-white/60 text-[10px] mt-0.5">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div {...f(0.5)}>
          <button
            onClick={() => navigate('brief')}
            className="w-full py-4 rounded-full text-sm font-semibold tracking-wider uppercase"
            style={{ background: 'linear-gradient(135deg, #2D1B69, #FF2D8A)', color: '#fff', boxShadow: '0 6px 24px rgba(255,45,138,0.3)' }}
          >
            התחל לבנות אירוע
          </button>
        </motion.div>
      </div>
    </div>
  )
}
