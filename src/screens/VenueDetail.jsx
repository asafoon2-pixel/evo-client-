import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, MapPin, Users, ChevronLeft, ChevronRight,
  Calendar, Phone, MessageCircle, Check, X, Loader2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { VENUE_TYPES, subscribeVenueAvailability, submitVenueInquiry } from '../lib/venuesService'

const HEBREW_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const DAYS_HE = ['א','ב','ג','ד','ה','ו','ש']

function CalendarView({ venueId, onDateSelect, selectedDate }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [avail, setAvail] = useState({})

  useEffect(() => {
    if (!venueId) return
    return subscribeVenueAvailability(venueId, year, month, setAvail)
  }, [venueId, year, month])

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={nextMonth} style={{ color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          {HEBREW_MONTHS[month - 1]} {year}
        </span>
        <button onClick={prevMonth} style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft size={18} style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAYS_HE.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isPast  = new Date(year, month - 1, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isUnavail = avail[dateStr] === false
          const isSel     = selectedDate === dateStr
          const disabled  = isPast || isUnavail

          return (
            <button key={day} disabled={disabled}
              onClick={() => !disabled && onDateSelect(dateStr)}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 8, fontSize: 13,
                fontWeight: isSel ? 700 : 400,
                background: isSel ? 'var(--primary)' : isUnavail ? 'rgba(44,32,22,0.04)' : 'transparent',
                color: isSel ? '#fff' : disabled ? 'rgba(44,32,22,0.2)' : 'var(--text-primary)',
                border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                textDecoration: isUnavail && !isPast ? 'line-through' : 'none',
              }}>
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function VenueDetail() {
  const { navigate, currentVenue, setSelectedVenue, currentUser, briefAnswers } = useApp()
  const venue = currentVenue

  const [tab,           setTab]          = useState('info')    // info | calendar | book
  const [selectedDate,  setSelectedDate] = useState(null)
  const [lightboxIdx,   setLightboxIdx]  = useState(null)

  // Inquiry form
  const [form,        setForm]        = useState({ name: currentUser?.displayName || '', phone: '', message: '' })
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  if (!venue) { navigate('venuePicker'); return null }

  const gallery = venue.gallery?.length ? venue.gallery : venue.cover_photo_url ? [venue.cover_photo_url] : []
  const priceStr = venue.price_per_event
    ? `₪${venue.price_per_event.toLocaleString()}${venue.price_type === 'per_guest' ? ' / אורח' : venue.price_type === 'hourly' ? ' / שעה' : ''}`
    : null

  const handleBook = () => {
    setSelectedVenue({ ...venue, selected_date: selectedDate })
    navigate('categories')
  }

  const handleSubmitInquiry = async () => {
    if (!form.phone) return
    setSubmitting(true)
    try {
      await submitVenueInquiry({
        venueId:      venue.id,
        venueName:    venue.name,
        clientUid:    currentUser?.uid || null,
        clientName:   form.name,
        clientPhone:  form.phone,
        eventDate:    selectedDate,
        guestCount:   briefAnswers?.scale || 0,
        eventType:    briefAnswers?.eventType || '',
        message:      form.message,
        budget:       briefAnswers?.budget || 0,
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Cover image / gallery */}
      <div style={{ height: 260, background: '#e8e2da', position: 'relative', overflow: 'hidden' }}>
        {gallery.length > 0 ? (
          <img src={gallery[lightboxIdx ?? 0]} alt={venue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={48} style={{ color: 'var(--text-muted)', opacity: 0.2 }} />
          </div>
        )}
        {/* Back button */}
        <button onClick={() => navigate('venuePicker')}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: 99,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}>
          <ArrowLeft size={18} style={{ transform: 'scaleX(-1)', color: 'var(--text-primary)' }} />
        </button>
        {/* Gallery dots */}
        {gallery.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 5,
          }}>
            {gallery.map((_, i) => (
              <button key={i} onClick={() => setLightboxIdx(i)} style={{
                width: i === (lightboxIdx ?? 0) ? 18 : 6, height: 6, borderRadius: 99,
                background: 'rgba(255,255,255,0.9)', border: 'none', padding: 0,
                transition: 'width 0.2s', cursor: 'pointer',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', flex: 1 }}>{venue.name}</h1>
          {venue.avg_rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <Star size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{venue.avg_rating.toFixed(1)}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({venue.total_reviews})</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{venue.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {venue.capacity_min}–{venue.capacity_max} אורחים
            </span>
          </div>
          {priceStr && (
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{priceStr}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', margin: '0 20px' }}>
        {[['info','פרטים'], ['calendar','זמינות'], ['book','הזמנה']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px 0', fontSize: 14, fontWeight: tab === key ? 700 : 400,
            color: tab === key ? 'var(--primary)' : 'var(--text-muted)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${tab === key ? 'var(--primary)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ flex: 1, padding: '20px 20px 120px' }}>

          {/* ── INFO ── */}
          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {venue.description && (
                <div>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)' }}>{venue.description}</p>
                </div>
              )}

              {/* Type + indoor/outdoor */}
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: 'rgba(107,95,228,0.1)', color: 'var(--primary)',
                }}>{VENUE_TYPES[venue.type] || venue.type}</span>
                <span style={{
                  padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: 'rgba(46,158,114,0.1)', color: '#2E9E72',
                }}>
                  {venue.indoor_outdoor === 'indoor' ? '🏠 פנים' : venue.indoor_outdoor === 'outdoor' ? '🌿 חוץ' : '🌿🏠 פנים + חוץ'}
                </span>
              </div>

              {/* Features */}
              {venue.features?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>מתקנים ושירותים</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {venue.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Check size={13} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event types */}
              {venue.event_types?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>מתאים לאירועים</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {venue.event_types.map(et => (
                      <span key={et} style={{
                        padding: '4px 10px', borderRadius: 99, fontSize: 12,
                        background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)',
                      }}>{et}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              {venue.full_address && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>כתובת</p>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)' }}>{venue.full_address}</p>
                </div>
              )}
            </div>
          )}

          {/* ── CALENDAR ── */}
          {tab === 'calendar' && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center' }}>
                בחר תאריך לאירוע
              </p>
              <CalendarView venueId={venue.id} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 20, padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(107,95,228,0.08)', border: '1px solid rgba(107,95,228,0.2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
                    תאריך נבחר: {selectedDate}
                  </span>
                  <button onClick={() => setSelectedDate(null)}>
                    <X size={16} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* ── BOOK ── */}
          {tab === 'book' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 99, background: 'rgba(46,158,114,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={28} style={{ color: '#2E9E72' }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>הפניה נשלחה!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>בית העסק יצור איתך קשר בהקדם</p>
                </motion.div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    שלח פניה לחלל — הם יחזרו אליך תוך 24 שעות
                  </p>
                  {selectedDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(107,95,228,0.08)' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>תאריך: {selectedDate}</span>
                    </div>
                  )}
                  {[
                    { key: 'name',    label: 'שם מלא',        type: 'text',  ph: 'ישראל ישראלי' },
                    { key: 'phone',   label: 'טלפון',          type: 'tel',   ph: '05X-XXXXXXX' },
                    { key: 'message', label: 'הערות / פרטים נוספים', type: 'textarea', ph: 'כמות אורחים, סוג האירוע, דרישות מיוחדות...' },
                  ].map(({ key, label, type, ph }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {label}
                      </label>
                      {type === 'textarea' ? (
                        <textarea rows={3} placeholder={ph} value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
                            border: '1.5px solid var(--border)', background: 'var(--surface)',
                            color: 'var(--text-primary)', resize: 'none', outline: 'none',
                            fontFamily: 'inherit', direction: 'rtl',
                          }} />
                      ) : (
                        <input type={type} placeholder={ph} value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
                            border: '1.5px solid var(--border)', background: 'var(--surface)',
                            color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
                          }} />
                      )}
                    </div>
                  ))}
                  <button disabled={!form.phone || submitting} onClick={handleSubmitInquiry}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                      background: form.phone ? 'var(--primary)' : 'rgba(44,32,22,0.1)',
                      color: form.phone ? '#fff' : 'var(--text-muted)',
                      border: 'none', cursor: form.phone ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.15s',
                    }}>
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'שלח פניה'}
                  </button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Sticky bottom CTA */}
      {tab !== 'book' && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 448, padding: '12px 16px 28px',
          background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setTab('book')} style={{
              flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer',
            }}>
              שלח פניה
            </button>
            {selectedDate && (
              <button onClick={handleBook} style={{
                flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: '#2E9E72', color: '#fff', border: 'none', cursor: 'pointer',
              }}>
                בחר חלל זה ←
              </button>
            )}
          </div>
          {!selectedDate && (
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              בחר תאריך ב"זמינות" כדי לאשר את החלל
            </p>
          )}
        </div>
      )}
    </div>
  )
}
