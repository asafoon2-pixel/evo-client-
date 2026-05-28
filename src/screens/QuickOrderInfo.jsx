import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { createOrder } from '../lib/ordersService'
import { createLead } from '../lib/leadsService'

const EVENT_TYPES = [
  { key: 'wedding',     label: 'חתונה' },
  { key: 'bar_mitzvah', label: 'בר / בת מצווה' },
  { key: 'birthday',    label: 'יומולדת' },
  { key: 'corporate',   label: 'אירוע חברה' },
  { key: 'other',       label: 'אחר' },
]

export default function QuickOrderInfo() {
  const { navigate, cart, clearCart, cartTotal, currentUser, firestoreUser } = useApp()

  const [name,       setName]       = useState(firestoreUser?.full_name || currentUser?.displayName || '')
  const [phone,      setPhone]      = useState(firestoreUser?.phone || '')
  const [eventDate,  setEventDate]  = useState('')
  const [eventType,  setEventType]  = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [notes,      setNotes]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState('')

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !eventDate) {
      setError('יש למלא שם, טלפון ותאריך האירוע')
      return
    }
    setError('')
    setLoading(true)
    try {
      await createOrder({
        clientUid:   currentUser?.uid || null,
        clientName:  name,
        clientPhone: phone,
        eventDate,
        notes,
        items: cart,
        total: cartTotal,
      })

      // Create a lead for each unique vendor in the cart
      const vendorIds = [...new Set(cart.map(c => c.supplierId))]
      const clientUser = currentUser || { uid: null, displayName: name, email: '', photoURL: '' }
      const briefAnswers = { eventType, date: eventDate, guestCount: guestCount || '', scale: '', budgetTier: '', city: '' }

      await Promise.all(vendorIds.map(vid => {
        const vendorName = cart.find(c => c.supplierId === vid)?.supplierName || ''
        const vendor = { id: vid, name: vendorName, category: '', image: '' }
        return createLead(clientUser, vendor, briefAnswers, null, cart)
          .catch(err => console.error('createLead failed for', vid, err))
      }))

      clearCart()
      setDone(true)
    } catch (e) {
      console.error(e)
      setError('שגיאה בשליחת הבקשה, נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div dir="rtl" className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ background: 'var(--background)' }}>
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
        </motion.div>
        <h1 className="text-2xl font-light mb-3" style={{ color: 'var(--text-primary)' }}>הפנייה נשלחה!</h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
          הספק יצור איתך קשר בהקדם לאישור הפרטים.
        </p>
        <button
          onClick={() => navigate('categories')}
          className="py-3 px-8 rounded-full text-sm font-semibold tracking-wide"
          style={{ background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}
        >
          המשך לגלוש
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-32"
      style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-6 pt-5 pb-4 flex items-center gap-4"
        style={{ background: 'rgba(245,240,232,0.96)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('cart')} style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <div>
          <h1 className="text-lg font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>פרטי הבקשה</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>כך הספק יוכל להתחיל לתכנן</p>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-5">

        {/* Required fields */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
            פרטי יצירת קשר
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="שם מלא *"
            className="w-full rounded-xl px-4 py-3.5 text-sm"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="טלפון *"
            type="tel"
            className="w-full rounded-xl px-4 py-3.5 text-sm"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        {/* Date */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
            תאריך האירוע *
          </p>
          <input
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            type="date"
            className="w-full rounded-xl px-4 py-3.5 text-sm"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: eventDate ? 'var(--text-primary)' : 'var(--text-dim)', outline: 'none' }}
          />
        </div>

        {/* Event type */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
            סוג האירוע <span className="normal-case font-normal">· אופציונלי</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map(et => (
              <button
                key={et.key}
                onClick={() => setEventType(prev => prev === et.key ? '' : et.key)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={eventType === et.key
                  ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }
                  : { border: '1.5px solid var(--border)', color: 'var(--text-muted)', background: 'var(--background)' }}
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guest count + notes */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
            פרטים נוספים <span className="normal-case font-normal">· אופציונלי</span>
          </p>
          <input
            value={guestCount}
            onChange={e => setGuestCount(e.target.value)}
            placeholder="כמות אורחים משוערת"
            type="number"
            min="1"
            className="w-full rounded-xl px-4 py-3.5 text-sm"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="הערות לספק — כל פרט שיכול לעזור"
            rows={3}
            className="w-full rounded-xl px-4 py-3.5 text-sm resize-none"
            style={{ background: 'var(--background)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)', opacity: loading ? 0.75 : 1 }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : `שלח פנייה לספק · ₪${cartTotal.toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}
