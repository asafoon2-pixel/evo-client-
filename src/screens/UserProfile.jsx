import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, Instagram, Phone, Mail, MessageCircle, PhoneCall, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const VIBE_TAGS = [
  'Intimate', 'Glamorous', 'Minimal', 'Bold',
  'Romantic', 'Outdoor', 'Classic', 'Electric',
  'Boho', 'Modern', 'Luxurious', 'Playful',
]

const COLOR_OPTIONS = [
  { id: 'black_gold',  label: 'Black & Gold',  colors: ['#0A0A0A', '#C8A96E'] },
  { id: 'white_blush', label: 'White & Blush', colors: ['#FAFAFA', '#E8B4B8'] },
  { id: 'deep_purple', label: 'Deep Purple',   colors: ['#2D1B69', '#8B5CF6'] },
  { id: 'forest',      label: 'Forest & Sage', colors: ['#1A3D2B', '#6B8F71'] },
  { id: 'terracotta',  label: 'Terracotta',    colors: ['#C17A50', '#E8C5A0'] },
  { id: 'navy_silver', label: 'Navy & Silver', colors: ['#1B2A4A', '#C0C8D0'] },
]

const STYLE_OPTIONS = [
  { id: 'modern',        label: 'Modern',        emoji: '◻️' },
  { id: 'classic',       label: 'Classic',        emoji: '🏛️' },
  { id: 'boho',          label: 'Boho',           emoji: '🌿' },
  { id: 'industrial',    label: 'Industrial',     emoji: '⚙️' },
  { id: 'mediterranean', label: 'Mediterranean',  emoji: '🌊' },
  { id: 'maximalist',    label: 'Maximalist',     emoji: '✨' },
]

const GENDER_OPTIONS = [
  { id: 'female', label: 'Female' },
  { id: 'male',   label: 'Male' },
  { id: 'other',  label: 'Other' },
]

const CONTACT_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { id: 'call',     label: 'Call',     Icon: PhoneCall },
  { id: 'sms',      label: 'SMS',      Icon: Phone },
  { id: 'email',    label: 'Email',    Icon: Mail },
]

const LANGUAGE_OPTIONS = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'عربي' },
]

function SectionLabel({ step, title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold tracking-[0.28em] uppercase mb-1" style={{ color: 'var(--primary)' }}>
        {step}
      </p>
      <h2 className="text-2xl font-light leading-snug" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm font-light mt-1.5" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function Divider() {
  return <div className="my-10 h-px" style={{ background: 'var(--border)' }} />
}

export default function UserProfile() {
  const { navigate, userProfile, updateProfile, depositAmount, eventPackage } = useApp()
  const isAIFlow = !!eventPackage
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    full_name:          userProfile?.fullName          || '',
    email:              userProfile?.email             || '',
    phone:              userProfile?.phone             || '',
    whatsapp_number:    userProfile?.whatsappNumber    || '',
    alternate_phone:    userProfile?.alternatePhone    || '',
    age:                userProfile?.age               || '',
    gender:             userProfile?.gender            || null,
    city:               userProfile?.city              || '',
    instagram_handle:   userProfile?.instagramHandle   || '',
    preferred_language: userProfile?.preferredLanguage || null,
    preferred_contact:  userProfile?.preferredContact  || null,
    vibe_tags:          userProfile?.vibeTags          || [],
    preferred_colors:   userProfile?.preferredColors   || null,
    preferred_styles:   userProfile?.preferredStyles   || [],
    energy_level:       userProfile?.energyLevel       || 3,
    profile_photo_url:  userProfile?.photoUrl          || null,
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleArr = (key, id) => setForm(f => ({
    ...f,
    [key]: f[key].includes(id) ? f[key].filter(x => x !== id) : [...f[key], id],
  }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('profile_photo_url', URL.createObjectURL(file))
  }

  const canContinue = form.full_name.trim().length > 1 && form.phone.trim().length > 5

  const handleSave = () => {
    if (!canContinue) return
    updateProfile('fullName',          form.full_name)
    updateProfile('email',             form.email)
    updateProfile('phone',             form.phone)
    updateProfile('whatsappNumber',    form.whatsapp_number)
    updateProfile('alternatePhone',    form.alternate_phone)
    updateProfile('age',               form.age)
    updateProfile('gender',            form.gender)
    updateProfile('city',              form.city)
    updateProfile('instagramHandle',   form.instagram_handle)
    updateProfile('preferredLanguage', form.preferred_language)
    updateProfile('preferredContact',  form.preferred_contact)
    updateProfile('vibeTags',          form.vibe_tags)
    updateProfile('preferredColors',   form.preferred_colors)
    updateProfile('preferredStyles',   form.preferred_styles)
    updateProfile('energyLevel',       form.energy_level)
    updateProfile('photoUrl',          form.profile_photo_url)
    navigate('checkout')
  }

  const formatPrice = n => `₪${n.toLocaleString()}`
  const inputStyle = (filled) => ({
    background: 'var(--surface)',
    border: `1px solid ${filled ? 'var(--primary)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
  })
  const energyLabels = ['Very calm', 'Calm', 'Balanced', 'Energetic', 'Electric']

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-12 pb-4 backdrop-blur-md"
        style={{ background: 'rgba(245,245,247,0.95)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(isAIFlow ? 'summary' : 'eventdetails')}
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>
              {isAIFlow ? 'Final step' : 'About you'}
            </p>
            <h1 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>Your Profile</h1>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative px-6 pt-10 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(45,27,105,0.1) 0%, transparent 70%)' }} />
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-[26px] font-light leading-tight" style={{ color: 'var(--text-primary)' }}>
          Let's get to know you
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-sm font-light mt-2" style={{ color: 'var(--text-muted)' }}>
          EVO uses this to personalise every detail of your event.
        </motion.p>
      </div>

      <div className="px-6">

        {/* ── 01 Identity ──────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionLabel step="01" title="Who are you?" />

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: form.profile_photo_url ? 'transparent' : 'var(--surface)',
                border: `2px dashed ${form.profile_photo_url ? 'var(--primary)' : 'var(--border)'}`,
              }}>
              {form.profile_photo_url ? (
                <img src={form.profile_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera size={20} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[9px] tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>Photo</span>
                </div>
              )}
              {form.profile_photo_url && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <Camera size={16} className="text-white" />
                </div>
              )}
            </motion.button>
            <p className="text-xs mt-2 font-light" style={{ color: 'var(--text-muted)' }}>Tap to add a photo</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Full name */}
          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Full name
            </label>
            <input value={form.full_name} onChange={e => set('full_name', e.target.value)}
              placeholder="Your name…"
              className="w-full px-4 py-4 rounded-2xl text-xl font-light outline-none transition-all"
              style={inputStyle(form.full_name)} />
          </div>

          {/* Gender */}
          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Gender
            </label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map(g => {
                const active = form.gender === g.id
                return (
                  <motion.button key={g.id} whileTap={{ scale: 0.97 }} onClick={() => set('gender', g.id)}
                    className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}>
                    {g.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Age + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Age</label>
              <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
                placeholder="—"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.age)} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                placeholder="Tel Aviv…"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.city)} />
            </div>
          </div>
        </motion.div>

        <Divider />

        {/* ── 02 Contact ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionLabel step="02" title="How do we reach you?"
            subtitle="Only used to coordinate your event — never shared without permission." />

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.email)} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+972 5x xxx xxxx"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.phone)} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
                WhatsApp <span className="font-light normal-case tracking-normal opacity-60">— if different</span>
              </label>
              <input type="tel" value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)}
                placeholder="+972 5x xxx xxxx"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.whatsapp_number)} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
                Alternate phone <span className="font-light normal-case tracking-normal opacity-60">— optional</span>
              </label>
              <input type="tel" value={form.alternate_phone} onChange={e => set('alternate_phone', e.target.value)}
                placeholder="+972 5x xxx xxxx"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.alternate_phone)} />
            </div>
          </div>

          {/* Preferred contact */}
          <div className="mt-6">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Best way to reach you
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONTACT_OPTIONS.map(({ id, label, Icon }) => {
                const active = form.preferred_contact === id
                return (
                  <motion.button key={id} whileTap={{ scale: 0.97 }} onClick={() => set('preferred_contact', id)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    }}>
                    <Icon size={14} style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Language */}
          <div className="mt-6">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Preferred language
            </label>
            <div className="flex gap-2">
              {LANGUAGE_OPTIONS.map(l => {
                const active = form.preferred_language === l.id
                return (
                  <motion.button key={l.id} whileTap={{ scale: 0.97 }} onClick={() => set('preferred_language', l.id)}
                    className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}>
                    {l.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Instagram */}
          <div className="mt-6">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Instagram <span className="font-light normal-case tracking-normal opacity-60">— optional</span>
            </label>
            <div className="relative">
              <Instagram size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: form.instagram_handle ? 'var(--primary)' : 'var(--text-muted)' }} />
              <input value={form.instagram_handle} onChange={e => set('instagram_handle', e.target.value)}
                placeholder="@handle"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-light outline-none transition-all"
                style={inputStyle(form.instagram_handle)} />
            </div>
          </div>
        </motion.div>

        <Divider />

        {/* ── 03 Taste ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionLabel step="03" title="Your taste"
            subtitle="EVO uses this to curate vendors that match your style." />

          {/* Vibe tags */}
          <div className="mb-7">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Vibes that speak to you
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_TAGS.map(tag => {
                const active = form.vibe_tags.includes(tag)
                return (
                  <motion.button key={tag} whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArr('vibe_tags', tag)}
                    className="px-4 py-2 rounded-full text-sm font-light transition-all"
                    style={{
                      background: active ? 'var(--primary)' : 'var(--surface)',
                      color: active ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    }}>
                    {tag}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Colour palette */}
          <div className="mb-7">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Colour palette
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {COLOR_OPTIONS.map(c => {
                const active = form.preferred_colors === c.id
                return (
                  <motion.button key={c.id} whileTap={{ scale: 0.97 }}
                    onClick={() => set('preferred_colors', c.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    }}>
                    <div className="flex gap-1 shrink-0">
                      {c.colors.map((col, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border"
                          style={{ background: col, borderColor: 'rgba(255,255,255,0.15)' }} />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {c.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Event style */}
          <div className="mb-7">
            <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Event style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map(s => {
                const active = form.preferred_styles.includes(s.id)
                return (
                  <motion.button key={s.id} whileTap={{ scale: 0.96 }}
                    onClick={() => toggleArr('preferred_styles', s.id)}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    }}>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-xs font-medium" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {s.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Energy level */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
              Event energy
            </label>
            <p className="text-xs mb-4 font-light" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              How lively do you want the atmosphere?
            </p>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(n => (
                <motion.button key={n} whileTap={{ scale: 0.92 }}
                  onClick={() => set('energy_level', n)}
                  className="flex-1 h-2.5 rounded-full transition-all"
                  style={{ background: form.energy_level >= n ? 'var(--primary)' : 'var(--border)' }} />
              ))}
            </div>
            <div className="flex justify-between">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Mellow</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                {energyLabels[form.energy_level - 1]}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Electric</span>
            </div>
          </div>
        </motion.div>

        {/* Trust note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="mt-10 p-5 rounded-3xl flex gap-3 items-start"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Zap size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
          <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
            Your details are private and only used to personalise your EVO experience. We never share your information with vendors without your permission.
          </p>
        </motion.div>

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,245,247,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button
          onClick={handleSave}
          disabled={!canContinue}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: canContinue ? 'var(--primary)' : 'var(--surface)',
            color: canContinue ? '#fff' : 'var(--text-muted)',
            border: canContinue ? 'none' : '1px solid var(--border)',
            boxShadow: canContinue ? 'var(--shadow-accent)' : 'none',
            opacity: canContinue ? 1 : 0.55,
          }}>
          {canContinue
            ? <>Secure my event{depositAmount ? ` — ${formatPrice(depositAmount)}` : ''} <ArrowRight size={14} /></>
            : 'Enter your name and phone to continue'
          }
        </motion.button>
      </div>
    </div>
  )
}
