import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Users, SlidersHorizontal, Star, ChevronLeft, Loader2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getVenues, VENUE_TYPES, EVENT_TYPES } from '../lib/venuesService'

const CITIES = ['הכל', 'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'הרצליה', 'רמת גן', 'ראשון לציון', 'מודיעין', 'אחר']

const TYPE_LABELS = Object.entries(VENUE_TYPES).map(([id, name]) => ({ id, name }))

function PriceLabel(venue) {
  if (!venue.price_per_event) return null
  const p = venue.price_per_event
  const suffix = venue.price_type === 'per_guest' ? ' / אורח' : venue.price_type === 'hourly' ? ' / שעה' : ''
  return `₪${p.toLocaleString()}${suffix}`
}

function VenueCard({ venue, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      style={{
        background: 'var(--surface)',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      {/* Cover image */}
      <div style={{ height: 180, background: '#e8e2da', position: 'relative', overflow: 'hidden' }}>
        {venue.cover_photo_url ? (
          <img src={venue.cover_photo_url} alt={venue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          </div>
        )}
        {/* Type badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          borderRadius: 99, padding: '4px 10px',
          fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
        }}>
          {VENUE_TYPES[venue.type] || venue.type}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{venue.name}</h3>
          {venue.avg_rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, marginRight: 8 }}>
              <Star size={12} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{venue.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{venue.city}</span>
          <span style={{ color: 'var(--border)', margin: '0 2px' }}>·</span>
          <Users size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {venue.capacity_min}–{venue.capacity_max} אורחים
          </span>
        </div>

        {venue.description ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {venue.description}
          </p>
        ) : null}

        {/* Features */}
        {venue.features?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {venue.features.slice(0, 3).map(f => (
              <span key={f} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99,
                background: 'rgba(107,95,228,0.08)', color: 'var(--primary)', fontWeight: 500,
              }}>{f}</span>
            ))}
            {venue.features.length > 3 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{venue.features.length - 3}</span>
            )}
          </div>
        )}

        {/* Price */}
        {venue.price_per_event > 0 && (
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
            {PriceLabel(venue)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function VenuePicker() {
  const { navigate, briefAnswers, setCurrentVenue } = useApp()

  const [venues,      setVenues]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [city,        setCity]        = useState('הכל')
  const [typeFilter,  setTypeFilter]  = useState('all')

  const guestCount  = briefAnswers?.scale    || 0
  const eventType   = briefAnswers?.eventType || ''

  useEffect(() => {
    setLoading(true)
    getVenues({
      city:       city !== 'הכל' ? city : undefined,
      guestCount: guestCount || undefined,
      eventType:  eventType  || undefined,
    })
      .then(setVenues)
      .catch(() => setError('לא ניתן לטעון חללים'))
      .finally(() => setLoading(false))
  }, [city, guestCount, eventType])

  const filtered = typeFilter === 'all'
    ? venues
    : venues.filter(v => v.type === typeFilter)

  const handleSelect = (venue) => {
    setCurrentVenue(venue)
    navigate('venueDetail')
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-5 pt-5 pb-3"
        style={{ background: 'rgba(245,240,232,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('brief')} style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>בחר חלל לאירוע</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {loading ? 'טוען...' : `${filtered.length} חללים זמינים`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 12,
              background: showFilters ? 'var(--primary)' : 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: showFilters ? '#fff' : 'var(--text-muted)',
            }}>
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* City chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 99, fontSize: 13, fontWeight: 500,
              background: city === c ? 'var(--primary)' : 'var(--surface)',
              color: city === c ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${city === c ? 'var(--primary)' : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Type filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 20px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              סוג חלל
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={() => setTypeFilter('all')} style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                background: typeFilter === 'all' ? 'var(--primary)' : 'transparent',
                color: typeFilter === 'all' ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${typeFilter === 'all' ? 'var(--primary)' : 'var(--border)'}`,
              }}>הכל</button>
              {TYPE_LABELS.map(({ id, name }) => (
                <button key={id} onClick={() => setTypeFilter(id)} style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                  background: typeFilter === id ? 'var(--primary)' : 'transparent',
                  color: typeFilter === id ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${typeFilter === id ? 'var(--primary)' : 'var(--border)'}`,
                }}>{name}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : error ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
            <MapPin size={36} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
              לא נמצאו חללים לפי הפילטרים שבחרת
            </p>
            <button onClick={() => { setCity('הכל'); setTypeFilter('all') }}
              style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
              נקה פילטרים
            </button>
          </div>
        ) : (
          filtered.map((venue, i) => (
            <VenueCard key={venue.id} venue={venue} onSelect={() => handleSelect(venue)} />
          ))
        )}
      </div>

      {/* Skip venue */}
      <div style={{ padding: '0 16px 32px', textAlign: 'center' }}>
        <button onClick={() => navigate('categories')}
          style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'underline' }}>
          עדיין לא בחרתי חלל — עבור לספקים
        </button>
      </div>
    </div>
  )
}
