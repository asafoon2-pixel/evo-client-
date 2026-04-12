import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { loginWithEmail, registerWithEmail, loginWithGoogle, resendVerificationEmail } from '../lib/authService'

const f = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function AuthGate() {
  const { navigate, authIntent } = useApp()

  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPass,      setShowPass]      = useState(false)
  const [isRegister,    setIsRegister]    = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState('')
  const [verifyScreen,  setVerifyScreen]  = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDone,    setResendDone]    = useState(false)

  const destAfterAuth =
    authIntent === 'single'   ? 'categories' :
    authIntent === 'new'      ? 'brief' :
    'dashboard'

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('נא למלא אימייל וסיסמה')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await registerWithEmail(email, password)
        setVerifyScreen(true)           // show verify-email screen
      } else {
        await loginWithEmail(email, password)
        navigate(destAfterAuth)
      }
    } catch (e) {
      setError(
        e.code === 'auth/email-not-verified'      ? 'יש לאמת את כתובת המייל לפני הכניסה' :
        e.code === 'auth/wrong-password'          ? 'סיסמה שגויה' :
        e.code === 'auth/invalid-credential'      ? 'אימייל או סיסמה שגויים' :
        e.code === 'auth/user-not-found'          ? 'לא נמצא חשבון — להירשם?' :
        e.code === 'auth/email-already-in-use'    ? 'האימייל כבר רשום — נסה להתחבר' :
        e.code === 'auth/invalid-email'           ? 'כתובת אימייל לא תקינה' :
        e.code === 'auth/weak-password'           ? 'סיסמה חלשה מדי (מינימום 6 תווים)' :
        e.code === 'auth/too-many-requests'       ? 'יותר מדי ניסיונות — נסה מאוחר יותר' :
        e.code === 'auth/network-request-failed'  ? 'בעיית רשת — בדוק חיבור לאינטרנט' :
        'משהו השתבש — נסה שוב'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate(destAfterAuth)
    } catch (e) {
      setError('ההתחברות עם Google נכשלה — נסה שוב')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    try {
      await resendVerificationEmail(email, password)
      setResendDone(true)
    } catch {
      setError('לא הצלחנו לשלוח מחדש — נסה שוב')
    } finally {
      setResendLoading(false)
    }
  }

  // ── Email verification pending screen ─────────────────────────────────────
  if (verifyScreen) {
    return (
      <div dir="rtl" className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ background: 'var(--background)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(107,95,228,0.1)', border: '2px solid rgba(107,95,228,0.2)' }}>
            <Mail size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            בדוק את המייל שלך
          </h2>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
            שלחנו לינק אימות לכתובת
          </p>
          <p className="text-sm font-semibold mb-6" style={{ color: 'var(--primary)' }}>{email}</p>
          <p className="text-xs leading-relaxed mb-8" style={{ color: 'var(--text-dim)' }}>
            לחץ על הלינק במייל כדי לאמת את חשבונך, ואז חזור לכאן להתחבר.
          </p>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setVerifyScreen(false); setIsRegister(false) }}
              className="w-full py-4 rounded-full text-sm font-semibold tracking-wider uppercase text-white"
              style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}>
              כניסה לאחר האימות
            </motion.button>

            <button
              onClick={handleResend}
              disabled={resendLoading || resendDone}
              className="w-full py-3 rounded-full text-sm flex items-center justify-center gap-2"
              style={{ color: resendDone ? '#4A9E72' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {resendLoading
                ? <Loader2 size={14} className="animate-spin" />
                : resendDone
                  ? <><CheckCircle2 size={14} /> נשלח מחדש</>
                  : <><Send size={14} /> שלח מחדש</>
              }
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main auth form ─────────────────────────────────────────────────────────
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
        </motion.div>

        <motion.div {...f(0.1)} className="w-full max-w-sm space-y-4">

          {/* Google sign-in */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{ background: '#fff', border: '1.5px solid rgba(44,32,22,0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {googleLoading
              ? <Loader2 size={16} className="animate-spin" style={{ color: '#4285F4' }} />
              : (
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )
            }
            <span className="text-sm font-medium" style={{ color: '#3c4043' }}>
              {isRegister ? 'הרשמה עם Google' : 'כניסה עם Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>או</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: 'var(--text-muted)' }}>אימייל</p>
            <div className="relative">
              <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: email ? 'var(--primary)' : 'var(--text-dim)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                className="w-full pr-11 pl-4 py-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${email ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text-primary)', fontFamily: 'inherit',
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
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full pr-11 pl-12 py-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${password ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text-primary)', fontFamily: 'inherit',
                }} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-dim)' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-center py-2.5 px-4 rounded-xl"
                style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)', opacity: loading ? 0.75 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : isRegister ? 'הרשמה' : 'כניסה'}
          </motion.button>

          {/* Toggle */}
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'כבר יש לך חשבון? ' : 'אין לך חשבון עדיין? '}
            <button onClick={() => { setIsRegister(v => !v); setError('') }}
              className="font-semibold underline" style={{ color: 'var(--primary)' }}>
              {isRegister ? 'כניסה' : 'הרשמה'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
