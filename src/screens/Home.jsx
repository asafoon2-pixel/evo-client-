import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Zap, CalendarDays, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

const f = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const CATEGORIES = ['הכל', 'מידברן', 'תוך 48 שעות', 'חתונות', 'קורפורייט', 'ימי הולדת', 'בר מצווה']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'בוקר טוב'
  if (h < 17) return 'צהריים טובים'
  return 'ערב טוב'
}

export default function Home() {
  const { navigate, currentUser } = useApp()
  const [activeCat, setActiveCat] = useState('הכל')
  const firstName = currentUser?.displayName?.split(' ')[0] || 'Asaf'

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen overflow-y-auto overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #EEF0FF 0%, #F5F5F7 60%, #E8E6F8 100%)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-14 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(238,240,255,0.97) 80%, transparent)' }}
      >
        <motion.div {...f(0)} className="flex items-center justify-between mb-4">
          {/* Left: avatar + lang */}
          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #2D1B69, #FF2D8A)' }}
              onClick={() => navigate('userprofile')}
            >
              {firstName[0].toUpperCase()}
            </button>
            <button
              className="text-xs font-medium tracking-widest px-2.5 py-1 rounded-full border"
              style={{ borderColor: 'rgba(45,27,105,0.2)', color: '#2D1B69', background: 'rgba(255,255,255,0.7)' }}
            >
              ≡ EN
            </button>
          </div>

          {/* Right: greeting + logo + bell */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] tracking-wide" style={{ color: 'rgba(45,27,105,0.5)' }}>{getGreeting()}</p>
              <p className="text-xs font-semibold" style={{ color: '#1E1060' }}>{firstName} 👋</p>
            </div>
            <span
              className="text-xl font-black tracking-[0.3em]"
              style={{ color: '#1E1060', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              EVO
            </span>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <Bell size={16} style={{ color: '#2D1B69' }} />
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.button
          {...f(0.1)}
          onClick={() => navigate('brief')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(45,27,105,0.12)',
            boxShadow: '0 4px 20px rgba(45,27,105,0.08)',
          }}
        >
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2D1B69, #FF2D8A)', color: '#fff' }}
          >
            AI+
          </span>
          <span className="flex-1 text-sm font-light text-right" style={{ color: 'rgba(45,27,105,0.45)' }}>
            איזה אירוע תרצה לבנות?
          </span>
          <Search size={16} style={{ color: 'rgba(45,27,105,0.35)', flexShrink: 0 }} />
        </motion.button>
      </div>

      {/* Category pills */}
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
        {/* Quick actions */}
        <motion.div {...f(0.2)} className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('management')}
            className="flex flex-col items-end p-4 rounded-2xl text-right"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(45,27,105,0.1)',
              boxShadow: '0 2px 12px rgba(45,27,105,0.06)',
            }}
          >
            <CalendarDays size={22} className="mb-2" style={{ color: '#2D1B69' }} />
            <p className="text-sm font-semibold" style={{ color: '#1E1060' }}>האירועים שלי</p>
            <p className="text-xs mt-0.5 font-light" style={{ color: 'rgba(45,27,105,0.5)' }}>נהל הכל</p>
          </button>
          <button
            onClick={() => navigate('brief')}
            className="flex flex-col items-end p-4 rounded-2xl text-right"
            style={{
              background: 'linear-gradient(135deg, #2D1B69, #1E1060)',
              boxShadow: '0 4px 20px rgba(45,27,105,0.3)',
            }}
          >
            <Zap size={22} className="mb-2 text-white" />
            <p className="text-sm font-semibold text-white">בנה אירוע עם AI</p>
            <p className="text-xs mt-0.5 font-light text-white/60">תוך 3 דקות</p>
          </button>
        </motion.div>

        {/* AI promo card */}
        <motion.div
          {...f(0.3)}
          className="rounded-3xl p-6 text-right"
          style={{ background: 'linear-gradient(135deg, #1E1060 0%, #2D1B69 100%)' }}
        >
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            AI EVENT PRODUCTION •
          </p>
          <h2 className="text-xl font-bold text-white leading-tight mb-2">
            EVO בונה לך הכל.
          </h2>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
            ספר לנו על האירוע שלך — ה-AI שלנו יבחר ספקים, יתאם ויבנה עבורך חבילה שלמה.
          </p>
          <button
            onClick={() => navigate('brief')}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            התחל לבנות
            <ChevronLeft size={16} />
          </button>
        </motion.div>

        {/* Midburn promo card */}
        <motion.div
          {...f(0.4)}
          className="relative rounded-3xl overflow-hidden"
          style={{ height: 180 }}
        >
          <img
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
            alt="מידברן"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(30,16,96,0.9) 0%, rgba(30,16,96,0.4) 60%, transparent 100%)' }}
          />
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{ background: '#FF2D8A', color: '#fff' }}
            >
              הזמנה מוקדמת
            </span>
          </div>
          <div className="absolute bottom-0 right-0 left-0 p-5 text-right">
            <p className="text-white text-base font-bold leading-tight">מידברן 2025 – חבילות מלאות לקאמפים</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>צליל · תאורה · בר · קייטרינג · הפקה מלאה</p>
            <button
              onClick={() => navigate('brief')}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: '#FF2D8A' }}
            >
              לכל החבילות
              <ChevronLeft size={14} />
            </button>
          </div>
        </motion.div>

        {/* Why EVO */}
        <motion.div {...f(0.5)}>
          <p className="text-sm font-semibold mb-1 text-right" style={{ color: '#1E1060' }}>למה EVO? ⚡</p>
        </motion.div>
      </div>
    </div>
  )
}
