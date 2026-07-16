import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../lib/authService'

const EVENT_TYPES = ['חתונה', 'בר מצווה', 'יום הולדת', 'השקת מוצר', 'מסיבה', 'אירוע חברה', 'בת מצווה']

function EventIllustration() {
  return (
    <svg viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-72">

      {/* ── Background blob ── */}
      <ellipse cx="170" cy="175" rx="148" ry="128" fill="#EDE8DF" opacity="0.7"/>

      {/* ── Disco ball ── */}
      <circle cx="170" cy="52" r="30" fill="#6B5FE4"/>
      <circle cx="170" cy="52" r="30" fill="url(#disco)" opacity="0.6"/>
      <line x1="140" y1="52" x2="200" y2="52" stroke="white" strokeWidth="1.5" opacity="0.35"/>
      <line x1="170" y1="22" x2="170" y2="82" stroke="white" strokeWidth="1.5" opacity="0.35"/>
      <ellipse cx="170" cy="52" rx="30" ry="14" stroke="white" strokeWidth="1.5" opacity="0.25"/>
      <line x1="170" y1="82" x2="170" y2="104" stroke="#2C2016" strokeWidth="1.5" opacity="0.18"/>
      {/* sparkles */}
      <circle cx="118" cy="38" r="4" fill="#E8B86D"/>
      <circle cx="224" cy="44" r="3" fill="#F2C49B"/>
      <circle cx="108" cy="72" r="2.5" fill="#6B5FE4" opacity="0.5"/>
      <circle cx="232" cy="70" r="2.5" fill="#E8B86D" opacity="0.7"/>

      <defs>
        <radialGradient id="disco" cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── Person head ── */}
      <circle cx="170" cy="138" r="30" fill="#F2C49B"/>
      {/* hair */}
      <path d="M140 128 Q170 106 200 128 Q200 112 170 108 Q140 112 140 128Z" fill="#2C2016" opacity="0.65"/>
      {/* eyes */}
      <circle cx="160" cy="136" r="3.5" fill="#2C2016" opacity="0.65"/>
      <circle cx="180" cy="136" r="3.5" fill="#2C2016" opacity="0.65"/>
      {/* blush */}
      <ellipse cx="153" cy="144" rx="6" ry="4" fill="#F2A0B0" opacity="0.4"/>
      <ellipse cx="187" cy="144" rx="6" ry="4" fill="#F2A0B0" opacity="0.4"/>
      {/* smile */}
      <path d="M158 148 Q170 157 182 148" stroke="#2C2016" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>

      {/* ── Body ── */}
      <path d="M144 163 Q132 178 130 222 L210 222 Q208 178 196 163 Q182 152 158 152Z" fill="#6B5FE4"/>
      {/* collar V */}
      <path d="M158 163 L170 178 L182 163" stroke="white" strokeWidth="2" fill="none" opacity="0.45"/>

      {/* ── Left arm → holding clipboard ── */}
      <path d="M132 178 Q112 192 106 210" stroke="#F2C49B" strokeWidth="13" strokeLinecap="round"/>
      {/* clipboard */}
      <rect x="88" y="203" width="32" height="40" rx="6" fill="white" stroke="#E8B86D" strokeWidth="1.5"/>
      <line x1="94" y1="215" x2="114" y2="215" stroke="#6B5FE4" strokeWidth="1.5" opacity="0.4"/>
      <line x1="94" y1="223" x2="114" y2="223" stroke="#6B5FE4" strokeWidth="1.5" opacity="0.4"/>
      <line x1="94" y1="231" x2="106" y2="231" stroke="#6B5FE4" strokeWidth="1.5" opacity="0.4"/>
      <rect x="96" y="199" width="20" height="8" rx="4" fill="#E8B86D"/>

      {/* ── Right arm → raised with star ── */}
      <path d="M208 178 Q228 162 232 144" stroke="#F2C49B" strokeWidth="13" strokeLinecap="round"/>
      {/* star */}
      <path d="M232 130 L235.5 140 L246 140 L238 146.5 L241 157 L232 151 L223 157 L226 146.5 L218 140 L228.5 140Z" fill="#E8B86D"/>

      {/* ── Legs ── */}
      <path d="M152 220 Q148 244 144 264" stroke="#4A3FA0" strokeWidth="13" strokeLinecap="round"/>
      <path d="M188 220 Q192 244 196 264" stroke="#4A3FA0" strokeWidth="13" strokeLinecap="round"/>
      {/* shoes */}
      <ellipse cx="140" cy="268" rx="16" ry="7" fill="#2C2016" opacity="0.55"/>
      <ellipse cx="200" cy="268" rx="16" ry="7" fill="#2C2016" opacity="0.55"/>

      {/* ── Balloon (left) ── */}
      <circle cx="68" cy="142" r="20" fill="#F2A0B0" opacity="0.85"/>
      <path d="M68 162 Q65 172 70 178" stroke="#F2A0B0" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="62" cy="136" rx="5" ry="7" fill="white" opacity="0.3" transform="rotate(-30 62 136)"/>

      {/* ── Camera (top right) ── */}
      <rect x="242" y="105" width="44" height="32" rx="7" fill="#E8B86D"/>
      <circle cx="261" cy="121" r="10" fill="white" opacity="0.85"/>
      <circle cx="261" cy="121" r="6" fill="#E8B86D" opacity="0.7"/>
      <rect x="272" y="107" width="9" height="6" rx="2" fill="#F2C49B"/>
      <circle cx="261" cy="121" r="3" fill="#2C2016" opacity="0.3"/>

      {/* ── Music note (right) ── */}
      <path d="M292 192 L292 175 L302 173 L302 190" stroke="#6B5FE4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="290" cy="193" r="5" fill="#6B5FE4" opacity="0.7"/>
      <circle cx="300" cy="191" r="5" fill="#6B5FE4" opacity="0.7"/>

      {/* ── Mini cake (bottom left) ── */}
      <rect x="36" y="246" width="36" height="22" rx="5" fill="#F2C49B"/>
      <rect x="38" y="238" width="32" height="12" rx="4" fill="#F2A0B0" opacity="0.8"/>
      {/* candle */}
      <rect x="52" y="230" width="4" height="10" rx="2" fill="#E8B86D"/>
      <circle cx="54" cy="229" r="3" fill="#E8B86D" opacity="0.8"/>
      {/* stripe */}
      <line x1="36" y1="252" x2="72" y2="252" stroke="white" strokeWidth="1.5" opacity="0.5"/>

      {/* ── Confetti ── */}
      <circle cx="244" cy="258" r="5" fill="#E8B86D" opacity="0.8"/>
      <rect x="86" y="295" width="8" height="8" rx="1" fill="#6B5FE4" opacity="0.35" transform="rotate(30 90 299)"/>
      <circle cx="298" cy="245" r="4" fill="#4A9E72" opacity="0.55"/>
      <rect x="250" cy="295" width="7" height="7" rx="1" fill="#F2A0B0" opacity="0.5" transform="rotate(-20 254 298)"/>
      <circle cx="44" cy="295" r="3.5" fill="#E8B86D" opacity="0.6"/>
      <circle cx="310" cy="170" r="3" fill="#F2A0B0" opacity="0.6"/>
      <circle cx="30" cy="200" r="3" fill="#4A9E72" opacity="0.5"/>
    </svg>
  )
}

export default function Entry() {
  const { navigate } = useApp()
  const [typeIndex, setTypeIndex]  = useState(0)
  const [showLogin,  setShowLogin]  = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass,  setLoginPass]  = useState('')
  const [isLoading,  setIsLoading]  = useState(false)
  const [authError,  setAuthError]  = useState('')
  const [isRegister, setIsRegister] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTypeIndex(i => (i + 1) % EVENT_TYPES.length), 2200)
    return () => clearInterval(t)
  }, [])

  async function handleGoogle() {
    setIsLoading(true); setAuthError('')
    try { await loginWithGoogle(); navigate('home') }
    catch { setAuthError('Google login failed.') }
    finally { setIsLoading(false) }
  }

  async function handleEmail() {
    setIsLoading(true); setAuthError('')
    try {
      if (isRegister) await registerWithEmail(loginEmail, loginPass)
      else            await loginWithEmail(loginEmail, loginPass)
      navigate('home')
    } catch (e) {
      setAuthError(
        e.code === 'auth/wrong-password'      ? 'סיסמה שגויה' :
        e.code === 'auth/user-not-found'      ? 'משתמש לא נמצא' :
        e.code === 'auth/email-already-in-use'? 'האימייל כבר רשום' : 'שגיאה, נסה שנית'
      )
    }
    finally { setIsLoading(false) }
  }

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden" style={{ background: 'var(--background)', direction: 'rtl' }}>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 shrink-0">
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: 2, color: 'var(--text-primary)' }}>
          EVO
        </span>
        <button
          onClick={() => setShowLogin(true)}
          className="text-sm font-medium transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-muted)' }}>
          כניסה
        </button>
      </div>

      {/* ── Illustration ── */}
      <div className="relative z-10 flex justify-center items-center px-8 shrink-0" style={{ height: '42vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full flex items-center justify-center">
          <EventIllustration />
        </motion.div>
      </div>

      {/* ── Rotating text ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-14 gap-6">
        <div className="text-center" style={{ minHeight: 80 }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={typeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Heebo', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2.6rem, 12vw, 4rem)',
                color: 'var(--primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
              {EVENT_TYPES[typeIndex]}?
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => navigate('brief')}
          whileTap={{ scale: 0.96 }}
          className="px-10 py-4 text-sm font-semibold tracking-widest uppercase transition-all"
          style={{
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-accent)',
            letterSpacing: '0.12em',
          }}>
          התחל לבנות
        </motion.button>
      </div>

      {/* ── Login sheet ── */}
      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div key="scrim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(26,26,46,0.4)', backdropFilter: 'blur(6px)' }} />

            <motion.div key="sheet"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-6"
              style={{ background: 'var(--surface)', borderRadius: '28px 28px 0 0', boxShadow: '0 -8px 40px rgba(45,27,105,0.15)', maxWidth: 448, margin: '0 auto', direction: 'rtl' }}>

              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border)' }} />
              <button onClick={() => setShowLogin(false)}
                className="absolute top-5 left-6 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>

              <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: 'var(--primary)' }}>
                {isRegister ? 'הרשמה' : 'ברוך הבא'}
              </p>
              <h2 className="text-xl font-light mb-5" style={{ color: 'var(--text-primary)' }}>
                {isRegister ? 'יצירת חשבון' : 'כניסה לאירוע שלך'}
              </h2>

              {authError && <p className="text-xs text-red-500 mb-3 text-center">{authError}</p>}

              <button onClick={handleGoogle} disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 mb-3 text-sm font-medium transition-all active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.243 14.1 10.211 14.42 9 14.42c-2.392 0-4.417-1.615-5.141-3.786H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.859 10.634A5.4 5.4 0 0 1 3.577 9c0-.562.097-1.11.282-1.634V5.034H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.034l2.902-2.4Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 5.034l2.902 2.332C4.583 5.195 6.608 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                המשך עם Google
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>או</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              <div className="relative mb-3">
                <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                <input type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pr-11 pl-4 py-3.5 text-sm outline-none transition-all"
                  style={{ borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--elevated)', color: 'var(--text-primary)', fontFamily: 'inherit', direction: 'ltr', textAlign: 'right' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div className="relative mb-4">
                <input type="password" placeholder="סיסמה" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                  className="w-full px-4 py-3.5 text-sm outline-none transition-all"
                  style={{ borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--elevated)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>

              <button onClick={handleEmail} disabled={isLoading || !loginEmail.includes('@') || loginPass.length < 6}
                className="w-full py-3.5 text-sm font-semibold tracking-wide uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)', opacity: loginEmail.includes('@') && loginPass.length >= 6 ? 1 : 0.45 }}>
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : (isRegister ? 'יצירת חשבון' : 'כניסה')}
              </button>

              <button onClick={() => { setIsRegister(r => !r); setAuthError('') }}
                className="w-full mt-3 text-xs text-center" style={{ color: 'var(--text-dim)' }}>
                {isRegister ? 'כבר יש לך חשבון? כנס' : 'אין לך חשבון? הירשם'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
