import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, Instagram, Phone, Mail, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { updateUser } from '../lib/usersService'

const GENDER_OPTIONS = [
  { id: 'female', label: 'נקבה' },
  { id: 'male',   label: 'זכר' },
  { id: 'other',  label: 'אחר' },
]

const CONTACT_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { id: 'call',     label: 'שיחה',     Icon: Phone },
  { id: 'sms',      label: 'SMS',      Icon: Phone },
  { id: 'email',    label: 'מייל',     Icon: Mail },
]

const LANGUAGE_OPTIONS = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'عربي' },
]


export default function PersonalQuestions() {
  const { navigate, updateBrief, briefAnswers, currentUser, setFirestoreUser } = useApp()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    full_name:          '',
    email:              '',
    phone:              '',
    whatsapp_number:    '',
    alternate_phone:    '',
    age:                '',
    gender:             null,
    city:               '',
    instagram_handle:   '',
    preferred_language: null,
    preferred_contact:  null,
    profile_photo_url:  null,
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (file) set('profile_photo_url', URL.createObjectURL(file))
  }

  const canContinue = form.full_name.trim().length > 1 && form.phone.trim().length > 5

  const handleContinue = async () => {
    updateBrief('clientDetails', form)
    if (currentUser) {
      try {
        const data = {
          full_name:          form.full_name,
          email:              form.email,
          phone:              form.phone,
          whatsapp_number:    form.whatsapp_number,
          alternate_phone:    form.alternate_phone,
          age:                form.age ? Number(form.age) : null,
          gender:             form.gender             || '',
          city:               form.city,
          instagram_handle:   form.instagram_handle,
          preferred_language: form.preferred_language || 'he',
          preferred_contact:  form.preferred_contact  || '',
        }
        await updateUser(currentUser.uid, data)
        setFirestoreUser(prev => ({ ...prev, ...data }))
      } catch (e) {
        console.error('updateUser failed:', e)
      }
    }
    navigate('tour')
  }

  const field = (key) => ({
    background: 'var(--surface)',
    border: `1px solid ${form[key] ? 'var(--primary)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    outline: 'none',
  })

  const label = (text, optional) => (
    <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
      {text}{optional && <span className="font-light normal-case tracking-normal opacity-60 ml-1">— אופציונלי</span>}
    </p>
  )

  return (
    <div dir="rtl" className="w-full min-h-screen overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4 backdrop-blur-md"
        style={{ background: 'rgba(245,240,232,0.95)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(briefAnswers?.hasVenue === true ? 'venuequestions' : 'summary')}
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>עליך</p>
            <h1 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>הפרטים שלך</h1>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-8">

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pt-2">
          <button onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden transition-all"
            style={{
              background: form.profile_photo_url ? 'transparent' : 'var(--surface)',
              border: `2px dashed ${form.profile_photo_url ? 'var(--primary)' : 'var(--border)'}`,
            }}>
            {form.profile_photo_url
              ? <img src={form.profile_photo_url} alt="" className="w-full h-full object-cover" />
              : <Camera size={18} style={{ color: 'var(--text-muted)' }} />
            }
          </button>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>הוסף תמונה</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </motion.div>

        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          {label('שם מלא')}
          <input value={form.full_name} onChange={e => set('full_name', e.target.value)}
            placeholder="השם שלך"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
            style={field('full_name')} />
        </motion.div>

        {/* Gender */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          {label('מגדר')}
          <div className="flex gap-2">
            {GENDER_OPTIONS.map(g => {
              const active = form.gender === g.id
              return (
                <motion.button key={g.id} whileTap={{ scale: 0.97 }} onClick={() => set('gender', g.id)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: active ? 'rgba(45,27,105,0.08)' : 'var(--surface)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                  {g.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Age + City */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="grid grid-cols-2 gap-3">
          <div>
            {label('גיל')}
            <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
              placeholder="—"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
              style={field('age')} />
          </div>
          <div>
            {label('עיר')}
            <input value={form.city} onChange={e => set('city', e.target.value)}
              placeholder="תל אביב…"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
              style={field('city')} />
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Email */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {label('אימייל')}
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
            style={field('email')} />
        </motion.div>

        {/* Phone */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          {label('טלפון')}
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
            placeholder="+972 5x xxx xxxx"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
            style={field('phone')} />
        </motion.div>

        {/* WhatsApp */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
          {label('וואטסאפ', true)}
          <input type="tel" value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)}
            placeholder="+972 5x xxx xxxx"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
            style={field('whatsapp_number')} />
        </motion.div>

        {/* Alternate phone */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          {label('טלפון נוסף', true)}
          <input type="tel" value={form.alternate_phone} onChange={e => set('alternate_phone', e.target.value)}
            placeholder="+972 5x xxx xxxx"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-light transition-all"
            style={field('alternate_phone')} />
        </motion.div>

        {/* Preferred contact */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {label('הדרך הטובה ביותר להגיע אליך')}
          <div className="grid grid-cols-2 gap-2">
            {CONTACT_OPTIONS.map(({ id, label: l, Icon }) => {
              const active = form.preferred_contact === id
              return (
                <motion.button key={id} whileTap={{ scale: 0.97 }} onClick={() => set('preferred_contact', id)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: active ? 'rgba(45,27,105,0.08)' : 'var(--surface)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  <Icon size={13} style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{l}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          {label('שפה מועדפת')}
          <div className="flex gap-2">
            {LANGUAGE_OPTIONS.map(l => {
              const active = form.preferred_language === l.id
              return (
                <motion.button key={l.id} whileTap={{ scale: 0.97 }} onClick={() => set('preferred_language', l.id)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: active ? 'rgba(45,27,105,0.08)' : 'var(--surface)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                  {l.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Instagram */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          {label('אינסטגרם', true)}
          <div className="relative">
            <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: form.instagram_handle ? 'var(--primary)' : 'var(--text-muted)' }} />
            <input value={form.instagram_handle} onChange={e => set('instagram_handle', e.target.value)}
              placeholder="@handle"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-light transition-all"
              style={field('instagram_handle')} />
          </div>
        </motion.div>

        <div className="h-2" />
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button onClick={handleContinue} disabled={!canContinue}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: canContinue ? 'var(--primary)' : 'var(--surface)',
            color: canContinue ? '#fff' : 'var(--text-muted)',
            border: canContinue ? 'none' : '1px solid var(--border)',
            opacity: canContinue ? 1 : 0.55,
            boxShadow: canContinue ? 'var(--shadow-accent)' : 'none',
          }}>
          המשך <ArrowRight size={14} style={{ transform: 'scaleX(-1)' }} />
        </motion.button>
      </div>
    </div>
  )
}
