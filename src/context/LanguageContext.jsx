import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  he: {
    // Home
    greeting_morning: 'בוקר טוב',
    greeting_afternoon: 'צהריים טובים',
    greeting_evening: 'ערב טוב',
    home_search_placeholder: 'איזה אירוע תרצה לבנות?',
    home_my_events: 'האירועים שלי',
    home_my_events_sub: 'נהל הכל',
    home_build_ai: 'בנה אירוע עם AI',
    home_build_ai_sub: 'תוך 3 דקות',
    home_ai_label: 'AI EVENT PRODUCTION',
    home_ai_title: 'EVO בונה לך הכל.',
    home_ai_body: 'ספר לנו על האירוע שלך — ה-AI שלנו יבחר ספקים, יתאם ויבנה עבורך חבילה שלמה.',
    home_start_building: 'התחל לבנות',
    home_all_packages: 'לכל החבילות',
    home_why_evo: 'למה EVO? ⚡',
    home_midburn: 'מידברן 2025 – חבילות מלאות לקאמפים',
    home_midburn_sub: 'צליל · תאורה · בר · קייטרינג · הפקה מלאה',
    home_early_booking: 'הזמנה מוקדמת',
    categories_all: 'הכל',
    categories_midburn: 'מידברן',
    categories_48h: 'תוך 48 שעות',
    categories_weddings: 'חתונות',
    categories_corporate: 'קורפורייט',
    categories_birthdays: 'ימי הולדת',
    categories_barmitzvah: 'בר מצווה',
    // General
    continue: 'המשך',
    back: 'חזרה',
    cancel: 'ביטול',
    save: 'שמור',
    confirm: 'אישור',
    skip: 'דלג',
    next: 'הבא',
    loading: 'טוען...',
  },
  en: {
    // Home
    greeting_morning: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    home_search_placeholder: 'What kind of event do you want to build?',
    home_my_events: 'My Events',
    home_my_events_sub: 'Manage all',
    home_build_ai: 'Build with AI',
    home_build_ai_sub: 'In 3 minutes',
    home_ai_label: 'AI EVENT PRODUCTION',
    home_ai_title: 'EVO builds it all for you.',
    home_ai_body: 'Tell us about your event — our AI picks vendors, coordinates, and builds you a complete package.',
    home_start_building: 'Start building',
    home_all_packages: 'All packages',
    home_why_evo: 'Why EVO? ⚡',
    home_midburn: 'Midburn 2025 – Full Camp Packages',
    home_midburn_sub: 'Sound · Lighting · Bar · Catering · Full production',
    home_early_booking: 'Early booking',
    categories_all: 'All',
    categories_midburn: 'Midburn',
    categories_48h: 'Within 48h',
    categories_weddings: 'Weddings',
    categories_corporate: 'Corporate',
    categories_birthdays: 'Birthdays',
    categories_barmitzvah: 'Bar Mitzvah',
    // General
    continue: 'Continue',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    skip: 'Skip',
    next: 'Next',
    loading: 'Loading...',
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('he')
  const isRTL = lang === 'he'

  const t = (key) => translations[lang]?.[key] ?? translations['he']?.[key] ?? key

  // Apply dir and font to document root
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang, isRTL])

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) return { lang: 'he', setLang: () => {}, isRTL: true, t: (k) => k }
  return ctx
}

// Language toggle pill component
export function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()
  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 ${className}`}
      style={{ background: 'rgba(44,32,22,0.08)', border: '1px solid rgba(44,32,22,0.10)' }}
    >
      {['he', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
          style={lang === l ? {
            background: 'var(--primary)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(107,95,228,0.25)',
          } : {
            color: 'var(--text-muted)',
          }}
        >
          {l === 'he' ? 'עב' : 'EN'}
        </button>
      ))}
    </div>
  )
}
