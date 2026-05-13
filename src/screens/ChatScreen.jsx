import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { listenToClientLeads } from '../lib/leadsService'

export default function ChatScreen() {
  const { currentUser, navigate, setChatLead } = useApp()
  const [leads, setLeads] = useState([])

  useEffect(() => {
    if (!currentUser) return
    const unsub = listenToClientLeads(currentUser.uid, setLeads)
    return unsub
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--background)' }}>
        <MessageCircle size={40} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: 12 }} />
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>כניסה נדרשת</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>התחבר כדי לראות את הצ׳אט</p>
        <button onClick={() => navigate('authgate')} className="px-5 py-2.5 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--primary)' }}>התחבר</button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-10 pb-4"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('home')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <ChevronLeft size={16} style={{ color: 'var(--text-muted)', transform: 'scaleX(-1)' }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>הודעות</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>שיחות עם הספקים שלך</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-20 space-y-3">
        {leads.length === 0 && (
          <div className="text-center py-20">
            <MessageCircle size={40} style={{ color: 'var(--text-dim)', opacity: 0.3, margin: '0 auto 12px' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>אין שיחות עדיין</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>כשתיצור קשר עם ספק תוכל לשלוח לו הודעה</p>
          </div>
        )}

        {leads.map((lead, i) => (
          <motion.button
            key={lead.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { setChatLead(lead); navigate('chatdetail') }}
            className="w-full text-right rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
          >
            {/* Vendor avatar */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(107,95,228,0.1)' }}>
              {lead.heroImage
                ? <img src={lead.heroImage} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-bold text-lg" style={{ color: 'var(--primary)' }}>
                    {lead.vendor_name?.[0]?.toUpperCase() || '?'}
                  </div>
              }
            </div>

            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  {lead.status === 'booked' ? '✓ הוזמן' : lead.status === 'new' ? 'חדש' : lead.status === 'declined' ? 'נדחה' : ''}
                </p>
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{lead.vendor_name}</p>
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {lead.last_message || `${lead.eventType || ''} · ${lead.date || ''}`}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
