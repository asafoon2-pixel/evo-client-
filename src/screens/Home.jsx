import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Zap, CalendarDays, ChevronLeft, ChevronRight, Music, Camera, Utensils, Flower2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLanguage, LanguageToggle } from '../context/LanguageContext'

const f = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

function getGreeting(t) {
  const h = new Date().getHours()
  if (h < 12) return t('greeting_morning')
  if (h < 17) return t('greeting_afternoon')
  return t('greeting_evening')
}

const CATEGORY_KEYS = [
  'categories_all',
  'categories_midburn',
  'categories_48h',
  'categories_weddings',
  'categories_corporate',
  'categories_birthdays',
  'categories_barmitzvah',
]

// Vendor category preview cards
const VENDOR_CATEGORIES = [
  {
    key: 'music',
    label_he: 'מוסיקה & DJ',
    label_en: 'Music & DJ',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80',
    Icon: Music,
    color: '#6B5FE4',
  },
  {
    key: 'photo',
    label_he: 'צילום & וידאו',
    label_en: 'Photo & Video',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=400&q=80',
    Icon: Camera,
    color: '#D4607A',
  },
  {
    key: 'catering',
    label_he: 'קייטרינג',
    label_en: 'Catering',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80',
    Icon: Utensils,
    color: '#E8A030',
  },
  {
    key: 'decor',
    label_he: 'עיצוב & פרחים',
    label_en: 'Decor & Flowers',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
    Icon: Flower2,
    color: '#4A9E72',
  },
]

// How it works steps
const HOW_STEPS = [
  {
    num: '01',
    he: { title: 'ספר לנו', body: 'תאר את האירוע שלך ב-30 שניות' },
    en: { title: 'Tell us', body: 'Describe your event in 30 seconds' },
    color: 'rgba(107,95,228,0.12)',
    textColor: '#6B5FE4',
  },
  {
    num: '02',
    he: { title: 'AI בונה', body: 'אנחנו בוחרים ספקים ומתאמים' },
    en: { title: 'AI builds', body: 'We pick vendors & coordinate' },
    color: 'rgba(74,158,114,0.12)',
    textColor: '#4A9E72',
  },
  {
    num: '03',
    he: { title: 'תיהנה', body: 'הכל מוכן. האירוע שלך מחכה' },
    en: { title: 'Enjoy', body: 'All set. Your event awaits' },
    color: 'rgba(232,184,109,0.18)',
    textColor: '#9B6B1A',
  },
]

export default function Home() {
  const { navigate, currentUser } = useApp()
  const { lang, t, isRTL } = useLanguage()
  const [activeCat, setActiveCat] = useState(0)
  const firstName = currentUser?.displayName?.split(' ')[0] || 'Asaf'
  const ChevronNav = isRTL ? ChevronLeft : ChevronRight

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full min-h-screen overflow-y-auto overflow-x-hidden pb-24"
      style={{ background: 'var(--background)' }}
    >
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-5 pt-5 pb-3"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.06)' }}
      >
        <motion.div {...f(0)} className="flex items-center justify-between mb-4">
          {/* Avatar + Language toggle */}
          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6B5FE4, #D4607A)' }}
              onClick={() => navigate('userprofile')}
            >
              {firstName[0]?.toUpperCase()}
            </button>
            <LanguageToggle />
          </div>

          {/* Greeting + EVO + Bell */}
          <div className="flex items-center gap-3">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{getGreeting(t)}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{firstName} 👋</p>
            </div>
            <span
              className="text-xl font-black tracking-[0.3em] shrink-0"
              style={{ color: '#2C2016', fontFamily: "'Poppins', sans-serif" }}
            >
              EVO
            </span>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <Bell size={15} style={{ color: 'var(--primary)' }} />
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.button
          {...f(0.08)}
          onClick={() => navigate('brief')}
          className="w-full flex items-center gap-3 px-4 py-3.5"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid rgba(44,32,22,0.10)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: 'linear-gradient(135deg, #6B5FE4, #D4607A)', color: '#fff' }}
          >
            AI+
          </span>
          <span
            className={`flex-1 text-sm font-light ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {t('home_search_placeholder')}
          </span>
          <Search size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        </motion.button>
      </div>

      {/* ── Category pills ─────────────────────────────────────────────────── */}
      <motion.div {...f(0.12)} className="px-5 mt-4 mb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          {CATEGORY_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => setActiveCat(i)}
              className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all"
              style={
                activeCat === i
                  ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }
                  : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }
              }
            >
              {t(key)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="px-5 space-y-4">

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <motion.div {...f(0.16)} className="grid grid-cols-2 gap-3">
          {/* My Events */}
          <button
            onClick={() => navigate('management')}
            className="flex flex-col p-5 card-hover"
            style={{
              background: 'var(--surface)',
              borderRadius: 24,
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(107,95,228,0.10)' }}>
              <CalendarDays size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('home_my_events')}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('home_my_events_sub')}</p>
          </button>

          {/* Build with AI */}
          <button
            onClick={() => navigate('brief')}
            className="flex flex-col p-5 card-hover"
            style={{
              background: 'linear-gradient(135deg, #6B5FE4 0%, #5A4FD4 100%)',
              borderRadius: 24,
              boxShadow: 'var(--shadow-accent)',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(255,255,255,0.18)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-white">{t('home_build_ai')}</p>
            <p className="text-xs mt-0.5 text-white/60">{t('home_build_ai_sub')}</p>
          </button>
        </motion.div>

        {/* ── AI Promo Card ──────────────────────────────────────────────── */}
        <motion.div
          {...f(0.22)}
          className="rounded-3xl p-7 relative overflow-hidden dot-texture"
          style={{
            background: 'linear-gradient(135deg, #2C2016 0%, #3D2E1A 100%)',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: -30, right: isRTL ? 'auto' : -30, left: isRTL ? -30 : 'auto',
            width: 140, height: 140,
            borderRadius: '50%',
            background: 'rgba(107,95,228,0.25)',
            filter: 'blur(40px)',
          }} />

          <p className="text-[10px] tracking-[0.28em] uppercase mb-3 relative"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            {t('home_ai_label')}
          </p>
          <h2 className="text-xl font-bold text-white leading-tight mb-2.5 relative">
            {t('home_ai_title')}
          </h2>
          <p className="text-sm font-light leading-relaxed mb-6 relative"
            style={{ color: 'rgba(255,255,255,0.60)' }}>
            {t('home_ai_body')}
          </p>
          <button
            onClick={() => navigate('brief')}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-full relative"
            style={{ background: 'rgba(107,95,228,0.9)', color: '#fff', boxShadow: '0 4px 16px rgba(107,95,228,0.4)' }}
          >
            {t('home_start_building')}
            <ChevronNav size={15} />
          </button>
        </motion.div>

        {/* ── How It Works ───────────────────────────────────────────────── */}
        <motion.div {...f(0.28)}>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color: 'var(--text-muted)' }}>
            {lang === 'he' ? 'איך זה עובד?' : 'How it works'}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="flex-shrink-0 p-4 rounded-2xl dot-texture"
                style={{
                  width: 150,
                  background: step.color,
                  border: `1px solid ${step.color.replace('0.12', '0.2').replace('0.18', '0.25')}`,
                }}>
                <p className="text-2xl font-black mb-2" style={{ color: step.textColor, opacity: 0.5 }}>
                  {step.num}
                </p>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'he' ? step.he.title : step.en.title}
                </p>
                <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'he' ? step.he.body : step.en.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Vendor Categories Grid ─────────────────────────────────────── */}
        <motion.div {...f(0.34)}>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color: 'var(--text-muted)' }}>
            {lang === 'he' ? 'קטגוריות ספקים' : 'Vendor Categories'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {VENDOR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => navigate('categories')}
                className="relative rounded-2xl overflow-hidden card-hover"
                style={{ height: 120 }}
              >
                <img src={cat.image} alt={lang === 'he' ? cat.label_he : cat.label_en}
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(44,32,22,0.75) 0%, transparent 50%)' }} />
                <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-1.5`}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: cat.color }}>
                    <cat.Icon size={10} className="text-white" />
                  </div>
                  <p className="text-white text-xs font-semibold">
                    {lang === 'he' ? cat.label_he : cat.label_en}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Midburn Promo ──────────────────────────────────────────────── */}
        <motion.div
          {...f(0.4)}
          className="relative rounded-3xl overflow-hidden card-hover"
          style={{ height: 190 }}
        >
          <img
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
            alt={t('home_midburn')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(44,32,22,0.90) 0%, rgba(44,32,22,0.35) 60%, transparent 100%)' }} />

          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{ background: '#D4607A', color: '#fff' }}>
              {t('home_early_booking')}
            </span>
          </div>

          <div className={`absolute bottom-0 ${isRTL ? 'right-0 left-0 text-right' : 'left-0 right-0 text-left'} p-5`}>
            <p className="text-white text-base font-bold leading-tight">{t('home_midburn')}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('home_midburn_sub')}</p>
            <button
              onClick={() => navigate('brief')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: '#F2C49B' }}
            >
              {t('home_all_packages')}
              <ChevronNav size={13} />
            </button>
          </div>
        </motion.div>

        {/* ── Why EVO ────────────────────────────────────────────────────── */}
        <motion.div {...f(0.46)} className="pb-4">
          <p className="text-sm font-semibold mb-3"
            style={{ color: 'var(--text-primary)', textAlign: isRTL ? 'right' : 'left' }}>
            {t('home_why_evo')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { he: '3 דקות להגדרה', en: '3 min setup', icon: '⚡' },
              { he: 'ספקים מאומתים', en: 'Verified vendors', icon: '✅' },
              { he: 'תשלום אחד', en: 'One payment', icon: '💳' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-2xl text-center dot-texture"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-[10px] font-semibold leading-tight" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'he' ? item.he : item.en}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(44,32,22,0.06)' }}>
        <motion.button
          onClick={() => navigate('brief')}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: 'var(--primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <Zap size={15} />
          {lang === 'he' ? 'בוא נבנה את האירוע שלך →' : "Let's plan your event →"}
        </motion.button>
      </div>
    </div>
  )
}
