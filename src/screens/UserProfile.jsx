import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, Mail, Instagram, MessageCircle, PhoneCall, Globe } from 'lucide-react'
import { useApp } from '../context/AppContext'

const CONTACT_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { id: 'call',     label: 'Call',     Icon: PhoneCall },
  { id: 'email',    label: 'Email',    Icon: Mail },
]

const LANG_OPTIONS = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'عربي' },
]

function InputField({ icon: Icon, placeholder, value, onChange, type = 'text', prefix }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused ? 'var(--primary)' : 'var(--text-dim)', transition: 'color 0.2s' }}
        />
      )}
      {prefix && (
        <span
          className="absolute left-11 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          paddingTop: 14, paddingBottom: 14,
          paddingLeft: prefix ? 56 : 44,
          paddingRight: 16,
          borderRadius: 12,
          border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontFamily: 'inherit',
          fontSize: 14,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(45,27,105,0.08)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
    </div>
  )
}

function Label({ children }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-3 mt-6" style={{ color: 'var(--text-dim)' }}>
      {children}
    </p>
  )
}

export default function UserProfile() {
  const { navigate, userProfile, updateProfile, depositAmount, eventPackage } = useApp()
  const isAIFlow = !!eventPackage

  const formatPrice = n => `₪${n.toLocaleString()}`
  const canContinue = userProfile.fullName.trim().length > 1 && userProfile.phone.trim().length > 5

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-12 pb-4" style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(isAIFlow ? 'summary' : 'eventdetails')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>{isAIFlow ? 'Final step' : 'Step 2 of 2'}</p>
            <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Your Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-36">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="pt-6">
          <h2 className="text-[28px] font-light leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            Who should we<br />
            <span style={{ color: 'var(--primary)' }}>be in touch with?</span>
          </h2>
          <p className="text-sm font-light mb-2" style={{ color: 'var(--text-muted)' }}>
            EVO will coordinate everything — we just need to know who you are.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>

          {/* Name + Phone */}
          <Label>Your details</Label>
          <div className="space-y-3">
            <InputField
              icon={User}
              placeholder="Full name"
              value={userProfile.fullName}
              onChange={v => updateProfile('fullName', v)}
            />
            <InputField
              icon={Phone}
              placeholder="Phone / WhatsApp"
              value={userProfile.phone}
              onChange={v => updateProfile('phone', v)}
              type="tel"
            />
            <InputField
              icon={Mail}
              placeholder="Email address"
              value={userProfile.email}
              onChange={v => updateProfile('email', v)}
              type="email"
            />
          </div>

          {/* Contact preference */}
          <Label>Best way to reach you</Label>
          <div className="flex gap-2">
            {CONTACT_OPTIONS.map(({ id, label, Icon }) => {
              const active = userProfile.preferredContact === id
              return (
                <motion.button key={id} whileTap={{ scale: 0.95 }}
                  onClick={() => updateProfile('preferredContact', id)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all"
                  style={{
                    border: active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: active ? 'rgba(45,27,105,0.06)' : 'var(--surface)',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                  <Icon size={18} />
                  {label}
                </motion.button>
              )
            })}
          </div>

          {/* Instagram (optional) */}
          <Label>Instagram (optional)</Label>
          <InputField
            icon={Instagram}
            placeholder="your_handle"
            prefix="@"
            value={userProfile.instagramHandle}
            onChange={v => updateProfile('instagramHandle', v)}
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-dim)' }}>
            We tag you in post-event content
          </p>

          {/* Language */}
          <Label>Preferred language</Label>
          <div className="flex gap-2">
            {LANG_OPTIONS.map(({ id, label }) => {
              const active = userProfile.preferredLanguage === id
              return (
                <motion.button key={id} whileTap={{ scale: 0.95 }}
                  onClick={() => updateProfile('preferredLanguage', id)}
                  className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    border: active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: active ? 'rgba(45,27,105,0.06)' : 'var(--surface)',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                  {label}
                </motion.button>
              )
            })}
          </div>

        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'var(--background)', borderTop: '1px solid var(--border)', maxWidth: 448, margin: '0 auto', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
        <motion.button
          whileTap={canContinue ? { scale: 0.97 } : {}}
          onClick={() => canContinue && navigate('checkout')}
          className="w-full py-4 text-sm font-bold tracking-wider uppercase transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: canContinue ? 'var(--primary)' : 'var(--border)',
            color: canContinue ? '#fff' : 'var(--text-dim)',
            boxShadow: canContinue ? 'var(--shadow-accent)' : 'none',
          }}
        >
          {canContinue
            ? `Secure My Event${depositAmount ? ` — ${formatPrice(depositAmount)}` : ''} →`
            : 'Enter your name and phone to continue'}
        </motion.button>
      </div>
    </div>
  )
}
