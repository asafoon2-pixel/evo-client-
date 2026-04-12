import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { loginWithEmail, registerWithEmail } from '../lib/authService'

const f = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function AuthGate() {
  const { navigate, authIntent } = useApp()
  const isNew = authIntent === 'new'

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('נא למלא אימייל וסיסמה')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isRegister) await registerWithEmail(email, password)
      else            await loginWithEmail(email, password)
      // Navigate based on intent
      navigate(
        authIntent === 'single'   ? 'categories' :
        authIntent === 'new'      ? 'brief' :
        'dashboard'
      )
    } catch (e) {
      setError(
        e.code === 'auth/wrong-password'          ? 'סיסמה שגויה' :
        e.code === 'auth/invalid-credential'      ? 'אימייל או סיסמה שגויים' :
        e.code === 'auth/user-not-found'          ? 'לא נמצא חשבון — להירשם?' :
        e.code === 'auth/email-already-in-use'    ? 'האימייל כבר רשום' :
        e.code === 'auth/invalid-email'           ? 'כתובת אימייל לא תקינה' :
        e.code === 'auth/weak-password'           ? 'סיסמה חלשה מדי (מינימום 6 תווים)' :
        e.code === 'auth/operation-not-allowed'   ? 'התחברות במייל לא מופעלת — פנה לתמיכה' :
        e.code === 'auth/too-many-requests'       ? 'יותר מדי ניסיונות, נסה מאוחר יותר' :
        e.code === 'auth/network-request-failed'  ? 'בעיית רשת, בדוק חיבור לאינטרנט' :
        'משהו השתבש — נסה שוב'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--background)' }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6B5FE4 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #D4607A 0%, transparent 70%)' }} />
      </div>

      {/* Back button */}
      <motion.button {...f(0)}
        onClick={() => navigate('home')}
        className="absolute top-12 right-5 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <ArrowLeft size={18} style={{ color: 'var(--text-muted)', transform: 'scaleX(-1)' }} />
      </motion.button>

      <div className="relative flex flex-col items-center px-6 pt-24 pb-32 flex-1">

        {/* Logo */}
        <motion.div {...f(0.05)} className="mb-8 text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #6B5FE4, #D4607A)', boxShadow: '0 8px 24px rgba(107,95,228,0.35)' }}>
            <span className="text-white font-black text-xl tracking-wider">EVO</span>
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {isRegister ? 'יצירת חשבון' : 'ברוך הבא בחזרה'}
          </h1>
          {isNew && !isRegister && (
            <motion.p
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-sm font-light leading-relaxed mt-2 max-w-xs mx-auto"
              style={{ color: 'var(--text-muted)' }}>
              תן לנו כמה פרטים בסיסיים על האירוע שלך, נתאים לך את הספקים הכי טובים בתחום וניצור את האירוע המדויק עבורך.
            </motion.p>
          )}
        </motion.div>

        {/* Form */}
        <motion.div {...f(0.1)} className="w-full max-w-sm space-y-4">

          {/* Email */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: 'var(--text-muted)' }}>אימייל</p>
            <div className="relative">
              <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: email ? 'var(--primary)' : 'var(--text-dim)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                className="w-full pr-11 pl-4 py-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${email ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: 'var(--text-muted)' }}>סיסמה</p>
            <div className="relative">
              <Lock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: password ? 'var(--primary)' : 'var(--text-dim)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full pr-11 pl-12 py-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${password ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }} />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-dim)' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-center py-2.5 px-4 rounded-xl"
                style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'var(--primary)',
              boxShadow: 'var(--shadow-accent)',
              opacity: loading ? 0.75 : 1,
            }}>
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : isRegister ? 'הרשמה' : 'כניסה'
            }
          </motion.button>

          {/* Toggle register/login */}
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'כבר יש לך חשבון? ' : 'אין לך חשבון עדיין? '}
            <button
              onClick={() => { setIsRegister(v => !v); setError('') }}
              className="font-semibold underline"
              style={{ color: 'var(--primary)' }}>
              {isRegister ? 'כניסה' : 'הרשמה'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
