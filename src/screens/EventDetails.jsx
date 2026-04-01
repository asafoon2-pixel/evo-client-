import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Building2, Navigation, Car, FileText, Lock, Unlock } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Field({ icon: Icon, placeholder, value, onChange, type = 'text', multiline = false }) {
  const [focused, setFocused] = useState(false)
  const baseStyle = {
    borderRadius: 12,
    border: focused ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(45,27,105,0.08)' : 'none',
  }

  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-4 pointer-events-none"
          style={{
            color: focused ? 'var(--primary)' : 'var(--text-dim)',
            top: multiline ? 16 : '50%',
            transform: multiline ? 'none' : 'translateY(-50%)',
            transition: 'color 0.2s',
          }}
        />
      )}
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, padding: '14px 16px 14px 44px', resize: 'none', lineHeight: 1.5 }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, padding: '14px 16px 14px 44px' }}
        />
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-3 mt-6" style={{ color: 'var(--text-dim)' }}>
      {children}
    </p>
  )
}

export default function EventDetails() {
  const { navigate, eventDetails, updateEventDetails } = useApp()

  const parkingOptions = [
    { id: true,  label: 'Yes',     emoji: '✅' },
    { id: false, label: 'No',      emoji: '🚫' },
    { id: null,  label: 'Unknown', emoji: '❓' },
  ]

  const canContinue = eventDetails.venueName.trim().length > 1 || eventDetails.fullAddress.trim().length > 5

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-12 pb-4" style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('summary')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>Step 1 of 2</p>
            <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Event Location</h1>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-36">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="pt-6">
          <h2 className="text-[28px] font-light leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            Where is it<br />
            <span style={{ color: 'var(--primary)' }}>happening?</span>
          </h2>
          <p className="text-sm font-light mb-6" style={{ color: 'var(--text-muted)' }}>
            Vendors need the exact location to plan logistics.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>

          {/* Venue */}
          <SectionLabel>Venue</SectionLabel>
          <div className="space-y-3">
            <Field
              icon={Building2}
              placeholder="Venue / place name"
              value={eventDetails.venueName}
              onChange={v => updateEventDetails('venueName', v)}
            />
            <Field
              icon={MapPin}
              placeholder="Full address"
              value={eventDetails.fullAddress}
              onChange={v => updateEventDetails('fullAddress', v)}
              multiline
            />
          </div>

          {/* Access */}
          <SectionLabel>Access for vendors</SectionLabel>
          <div className="space-y-3">
            <Field
              icon={Navigation}
              placeholder="Floor / building entrance"
              value={eventDetails.floor}
              onChange={v => updateEventDetails('floor', v)}
            />
            <Field
              icon={FileText}
              placeholder="Entrance notes (gate code, service entrance...)"
              value={eventDetails.entranceNotes}
              onChange={v => updateEventDetails('entranceNotes', v)}
              multiline
            />
          </div>

          {/* Parking */}
          <SectionLabel>Parking</SectionLabel>
          <div className="flex gap-2 mb-3">
            {parkingOptions.map(opt => {
              const active = eventDetails.parkingAvailable === opt.id
              return (
                <motion.button
                  key={String(opt.id)}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateEventDetails('parkingAvailable', opt.id)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all"
                  style={{
                    border: active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: active ? 'rgba(45,27,105,0.06)' : 'var(--surface)',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                  {opt.label}
                </motion.button>
              )
            })}
          </div>
          {eventDetails.parkingAvailable === true && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Field
                icon={Car}
                placeholder="Parking details (lots, floors, cost...)"
                value={eventDetails.parkingNotes}
                onChange={v => updateEventDetails('parkingNotes', v)}
                multiline
              />
            </motion.div>
          )}

          {/* Special requests */}
          <SectionLabel>Special requests</SectionLabel>
          <Field
            icon={FileText}
            placeholder="Anything vendors should know..."
            value={eventDetails.specialRequests}
            onChange={v => updateEventDetails('specialRequests', v)}
            multiline
          />

          {/* Private event toggle */}
          <SectionLabel>Privacy</SectionLabel>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => updateEventDetails('isPrivate', !eventDetails.isPrivate)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
            style={{
              border: eventDetails.isPrivate ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: eventDetails.isPrivate ? 'rgba(45,27,105,0.06)' : 'var(--surface)',
            }}
          >
            <div className="flex items-center gap-3">
              {eventDetails.isPrivate
                ? <Lock size={16} style={{ color: 'var(--primary)' }} />
                : <Unlock size={16} style={{ color: 'var(--text-muted)' }} />
              }
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: eventDetails.isPrivate ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {eventDetails.isPrivate ? 'Private event' : 'Public / semi-public'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {eventDetails.isPrivate ? 'Vendors will sign an NDA' : 'Tap to make private'}
                </p>
              </div>
            </div>
            <div
              className="w-11 h-6 rounded-full transition-all relative"
              style={{ background: eventDetails.isPrivate ? 'var(--primary)' : 'var(--border)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: eventDetails.isPrivate ? 'calc(100% - 22px)' : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              />
            </div>
          </motion.button>

        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'var(--background)', borderTop: '1px solid var(--border)', maxWidth: 448, margin: '0 auto', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
        <motion.button
          whileTap={canContinue ? { scale: 0.97 } : {}}
          onClick={() => canContinue && navigate('userprofile')}
          className="w-full py-4 text-sm font-bold tracking-wider uppercase transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: canContinue ? 'var(--primary)' : 'var(--border)',
            color: canContinue ? '#fff' : 'var(--text-dim)',
            boxShadow: canContinue ? 'var(--shadow-accent)' : 'none',
          }}
        >
          Next — Contact Info →
        </motion.button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-dim)' }}>
          Venue name or address required to continue
        </p>
      </div>
    </div>
  )
}
