import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail } from 'lucide-react'
import { useApp } from '../context/AppContext'

const f = (delay = 0, y = 20) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

const stats = [
  { value: '2,400+', label: 'Events produced' },
  { value: '98%',    label: 'Satisfaction' },
  { value: '< 3min', label: 'To your package' },
]

export default function Entry() {
  const { navigate } = useApp()
  const [showLogin,  setShowLogin]  = useState(false)
  const [loginEmail, setLoginEmail] = useState('')

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden" style={{ background: '#F5F5F7' }}>

      {/* Ambient dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Hero image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80"
          alt="" className="w-full h-full object-cover scale-105 blur-[2px] opacity-15" draggable={false}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(245,245,247,0.55) 0%, rgba(245,245,247,0.15) 40%, rgba(245,245,247,0.97) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 45% at 50% 38%, rgba(45,27,105,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 pt-16 flex flex-col items-center">
        <motion.div {...f(0.1)}>
          <span className="text-[42px] font-light tracking-[0.5em] select-none leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#1E1060' }}>
            EVO
          </span>
        </motion.div>
        <motion.div {...f(0.25)} className="mt-3">
          <div className="h-px w-10 mx-auto" style={{ background: 'var(--primary)', opacity: 0.5 }} />
        </motion.div>
      </div>

      {/* Center hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.p {...f(0.35)} className="label-overline mb-8">AI-Powered Event Production</motion.p>
        <motion.h1 {...f(0.5, 28)} className="font-display text-[44px] sm:text-[56px] leading-[1.05] tracking-tight" style={{ color: '#1A1A2E' }}>
          Your event.<br />
          <span style={{ color: '#FF2D8A', fontStyle: 'italic' }}>Produced.</span>
        </motion.h1>
        <motion.p {...f(0.7)} className="mt-5 text-sm font-light leading-relaxed max-w-[260px]" style={{ color: 'var(--text-muted)' }}>
          Tell us nothing. Show us everything.<br />EVO builds the rest.
        </motion.p>
        <motion.div {...f(0.85)} className="mt-12 flex items-center gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[15px] font-medium leading-none" style={{ color: '#1A1A2E' }}>{s.value}</p>
              <p className="text-[10px] mt-1.5 tracking-wide" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="relative z-10 pb-14 flex flex-col items-center gap-4 w-full px-8">
        <motion.button {...f(1.05)} onClick={() => navigate('brief')} whileTap={{ scale: 0.97 }}
          className="w-full max-w-xs py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200"
          style={{ background: 'var(--primary)', color: '#FFFFFF', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-accent)' }}>
          Start Building
        </motion.button>
        <motion.p {...f(1.2)} className="text-[11px] tracking-widest" style={{ color: 'var(--text-dim)' }}>
          No forms. No search. Just vision.
        </motion.p>
        <motion.button {...f(1.35)} onClick={() => setShowLogin(true)}
          className="mt-2 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Enter existing event →
        </motion.button>
      </div>

      {/* ── Login sheet ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="fixed inset-0 z-40" style={{ background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(6px)' }} />
            <motion.div key="modal"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-6"
              style={{ background: 'var(--surface)', borderRadius: '28px 28px 0 0', boxShadow: '0 -8px 40px rgba(45,27,105,0.15)', maxWidth: 448, margin: '0 auto' }}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border)' }} />
              <button onClick={() => setShowLogin(false)}
                className="absolute top-5 right-6 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--primary)' }}>Welcome back</p>
              <h2 className="text-xl font-light mb-1" style={{ color: 'var(--text-primary)' }}>Sign in to your event</h2>
              <p className="text-sm mb-7 font-light" style={{ color: 'var(--text-muted)' }}>Access your event plan, suppliers, and timeline.</p>
              <button className="w-full flex items-center justify-center gap-3 py-3.5 mb-3 text-sm font-medium transition-all active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', boxShadow: '0 1px 4px rgba(45,27,105,0.06)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.243 14.1 10.211 14.42 9 14.42c-2.392 0-4.417-1.615-5.141-3.786H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.859 10.634A5.4 5.4 0 0 1 3.577 9c0-.562.097-1.11.282-1.634V5.034H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.034l2.902-2.4Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 5.034l2.902 2.332C4.583 5.195 6.608 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>or</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              <div className="relative mb-3">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                <input type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                  style={{ borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--elevated)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <button onClick={() => navigate('management')}
                className="w-full py-3.5 text-sm font-semibold tracking-wide uppercase transition-all active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)', opacity: loginEmail.includes('@') ? 1 : 0.45, pointerEvents: loginEmail.includes('@') ? 'auto' : 'none' }}>
                Continue with email
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
