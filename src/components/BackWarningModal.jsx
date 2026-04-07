import { motion } from 'framer-motion'

export default function BackWarningModal({ onDelete, onDraft, onStay }) {
  return (
    <>
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onStay}
        style={{ position: 'fixed', inset: 0, background: 'rgba(44,32,22,0.5)', backdropFilter: 'blur(6px)', zIndex: 9000 }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 448,
          background: 'var(--surface)',
          borderRadius: '28px 28px 0 0',
          padding: '24px 24px 40px',
          zIndex: 9001,
          boxShadow: '0 -8px 40px rgba(44,32,22,0.15)',
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 24px' }} />

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 8 }}>
          רגע לפני
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          לצאת מהתהליך?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
          אחרי שבנינו לך אירוע שלם — אין חזרה אחורה. תוכל למחוק, לשמור כטיוטה, או להמשיך קדימה.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onStay}
            style={{
              width: '100%', padding: '14px', borderRadius: 9999,
              background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 14,
              boxShadow: 'var(--shadow-accent)', border: 'none', cursor: 'pointer',
            }}
          >
            המשך קדימה
          </button>
          <button
            onClick={onDraft}
            style={{
              width: '100%', padding: '14px', borderRadius: 9999,
              background: 'var(--surface)', color: 'var(--primary)', fontWeight: 600, fontSize: 14,
              border: '1.5px solid rgba(107,95,228,0.3)', cursor: 'pointer',
            }}
          >
            שמור כטיוטה
          </button>
          <button
            onClick={onDelete}
            style={{
              width: '100%', padding: '14px', borderRadius: 9999,
              background: 'transparent', color: '#D4607A', fontWeight: 500, fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}
          >
            מחק את האירוע
          </button>
        </div>
      </motion.div>
    </>
  )
}
