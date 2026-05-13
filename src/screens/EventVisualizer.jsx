import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RefreshCw, Download, Sparkles, ImageIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateEventImage, buildImagePrompt, collectSupplierImages } from '../lib/imageGenService'

export default function EventVisualizer() {
  const { navigate, briefAnswers, eventDetails, selectedSuppliers, cart } = useApp()
  const [imageUrl, setImageUrl]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const eventType  = briefAnswers?.eventType || null
  const guestCount = briefAnswers?.scale     || null
  const vibe       = briefAnswers?.vibe      || null
  const city       = eventDetails?.city      || null

  const supplierImages = collectSupplierImages(selectedSuppliers, cart)
  const supplierList   = Object.values(selectedSuppliers || {})
  const hasSuppliers   = supplierList.length > 0 || cart.length > 0

  async function handleGenerate() {
    setError(null)
    setLoading(true)
    setImageUrl(null)
    try {
      const prompt = buildImagePrompt({ eventType, guestCount, vibe, city, selectedSuppliers, cart })
      const url = await generateEventImage(prompt)
      setImageUrl(url)
    } catch (err) {
      setError(err.message || 'שגיאה לא ידועה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col pb-10" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-6"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('summary')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ border: '1px solid var(--border)' }}>
          <ArrowRight size={18} style={{ color: 'var(--text-primary)' }} />
        </button>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            דמיין את האירוע שלך ✨
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {hasSuppliers ? `מבוסס על ${supplierList.length} ספקים שבחרת` : 'AI יוצר עבורך תמונה ייחודית'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 space-y-6">

        {/* Supplier mood board */}
        {supplierImages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
              הציוד שבחרת
            </p>
            <div className="grid grid-cols-3 gap-2">
              {supplierImages.slice(0, 6).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: '1/1', background: 'var(--border)' }}
                >
                  <img src={img.url} alt={img.label}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-1.5 right-1.5 left-1.5 text-white text-[9px] font-semibold truncate leading-tight">
                    {img.label}
                  </p>
                </motion.div>
              ))}
            </div>
            {supplierImages.length > 6 && (
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
                +{supplierImages.length - 6} פריטים נוספים
              </p>
            )}
          </motion.div>
        )}

        {/* No suppliers nudge */}
        {!hasSuppliers && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(107,95,228,0.07)', border: '1px dashed rgba(107,95,228,0.25)' }}>
            <ImageIcon size={16} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              טרם בחרת ספקים — ה-AI ייצור תמונה לפי סוג האירוע שלך.{' '}
              <button onClick={() => navigate('categories')}
                className="font-semibold underline" style={{ color: 'var(--primary)' }}>
                הוסף ספקים
              </button>{' '}
              לתמונה מדויקת יותר.
            </p>
          </motion.div>
        )}

        {/* Selected suppliers list */}
        {supplierList.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              ספקים שנבחרו
            </p>
            {supplierList.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}>
                {s.image && (
                  <img src={s.image} alt={s.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.category} · {s.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={loading}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full py-4 rounded-full text-sm font-semibold tracking-[0.08em] flex items-center justify-center gap-2"
          style={{
            background: loading ? 'rgba(107,95,228,0.3)' : 'var(--primary)',
            color: loading ? 'rgba(255,255,255,0.5)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <Sparkles size={15} />
          {loading ? 'יוצר תמונה...' : imageUrl ? 'צור תמונה חדשה' : 'צור תמונה לאירוע'}
        </motion.button>

        {/* Loading shimmer */}
        <AnimatePresence>
          {loading && (
            <motion.div key="shimmer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full rounded-2xl overflow-hidden"
              style={{ aspectRatio: '16/9', background: 'rgba(107,95,228,0.08)' }}>
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <motion.div animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 rounded-full"
                  style={{ border: '2px solid transparent', borderTopColor: 'var(--primary)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  מייצר תמונה מבוססת הספקים שלך...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.25)' }}>
              <p className="text-xs" style={{ color: '#E05555' }}>שגיאה: {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated image */}
        <AnimatePresence>
          {imageUrl && !loading && (
            <motion.div key="image"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3">
              <p className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                הדמיית האירוע שלך
              </p>
              <div className="w-full overflow-hidden rounded-2xl"
                style={{ border: '1px solid var(--border)' }}>
                <img src={imageUrl} alt="הדמיית האירוע"
                  className="w-full object-cover" style={{ display: 'block' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleGenerate}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <RefreshCw size={14} /> נסה שוב
                </button>
                <a href={imageUrl} download="event.jpg" target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium"
                  style={{ background: 'var(--primary)', color: '#fff' }}>
                  <Download size={14} /> שמור
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
