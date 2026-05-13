import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Cart() {
  const {
    navigate, cart, removeFromCart, updateCartQty,
    cartTotal,
  } = useApp()

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col overflow-y-auto pb-36" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-6 pt-12 pb-4 flex items-center gap-4"
        style={{ background: 'rgba(245,240,232,0.96)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('supplierProfile')} style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1 className="text-lg font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>הסל שלי</h1>
        {cart.length > 0 && (
          <span className="mr-auto text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            {cart.reduce((s, c) => s + c.quantity, 0)} פריטים
          </span>
        )}
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Empty state */}
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart size={48} style={{ color: 'var(--text-dim)', marginBottom: 16 }} />
            <p className="text-base font-light mb-2" style={{ color: 'var(--text-primary)' }}>הסל ריק</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>הוסף מוצרים וחבילות מדפי הספקים</p>
            <button
              onClick={() => navigate('categories')}
              className="py-3 px-6 rounded-full text-sm font-semibold"
              style={{ background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}
            >
              עיין בספקים
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <>
            {/* Cart items */}
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map(c => (
                  <motion.div key={c.cartId}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl p-4"
                    style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
                  >
                    <div className="flex items-start gap-3">
                      {c.item.image && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                          <img src={c.item.image} alt={c.item.label} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.item.label}</p>
                          <span className="text-[10px] rounded-full px-2 py-0.5 shrink-0"
                            style={{ background: c.type === 'package' ? 'rgba(107,95,228,0.08)' : 'rgba(74,158,114,0.08)', color: c.type === 'package' ? 'var(--primary)' : '#4A9E72', border: `1px solid ${c.type === 'package' ? 'rgba(107,95,228,0.3)' : 'rgba(74,158,114,0.3)'}` }}>
                            {c.type === 'package' ? 'חבילה' : 'מוצר'}
                          </span>
                        </div>
                        <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{c.supplierName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                            ₪{((c.item.price || 0) * c.quantity).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(c.cartId, c.quantity - 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                              style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center" style={{ color: 'var(--text-primary)' }}>{c.quantity}</span>
                            <button onClick={() => updateCartQty(c.cartId, c.quantity + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                              style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                              <Plus size={11} />
                            </button>
                            <button onClick={() => removeFromCart(c.cartId)}
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-1 transition-all"
                              style={{ background: 'rgba(220,50,50,0.06)', color: '#DC3232', border: '1.5px solid rgba(220,50,50,0.15)' }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>סיכום הזמנה</p>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>סה"כ</span>
                <span className="text-2xl font-light" style={{ color: 'var(--primary)' }}>₪{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom CTA */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-6 py-4 z-30"
          style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => navigate('quickOrderInfo')}
            className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}
          >
            המשך למילוי פרטים · ₪{cartTotal.toLocaleString()}
          </button>
        </div>
      )}
    </div>
  )
}
