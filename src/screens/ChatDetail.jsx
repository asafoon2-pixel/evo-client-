import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { listenToMessages, sendMessage, markMessagesAsRead } from '../lib/leadsService'

export default function ChatDetail() {
  const { currentUser, navigate, chatLead } = useApp()
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!chatLead?.id) return
    markMessagesAsRead(chatLead.id, 'client').catch(() => {})
    const unsub = listenToMessages(chatLead.id, (rawMsgs) => {
      setMsgs(rawMsgs.map(m => ({
        ...m,
        timeStr: m.time?.toDate ? m.time.toDate().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '',
      })))
      markMessagesAsRead(chatLead.id, 'client').catch(() => {})
    })
    return unsub
  }, [chatLead?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  useEffect(() => {
    if (!chatLead) navigate('chatscreen')
  }, [chatLead])

  if (!chatLead) return null

  const send = async () => {
    const t = text.trim()
    if (!t || sending) return
    setSending(true)
    setText('')
    try {
      await sendMessage(chatLead.id, currentUser.uid, currentUser.displayName || 'לקוח', t, 'client')
    } catch (e) {
      console.error('send error:', e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-10 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('chatscreen')} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <ArrowLeft size={16} style={{ color: 'var(--text-muted)', transform: 'scaleX(-1)' }} />
        </button>
        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(107,95,228,0.1)' }}>
          {chatLead.heroImage
            ? <img src={chatLead.heroImage} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center font-bold" style={{ color: 'var(--primary)' }}>
                {chatLead.vendor_name?.[0]?.toUpperCase() || '?'}
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{chatLead.vendor_name}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{chatLead.eventType}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-28">
        {msgs.length === 0 && (
          <p className="text-center text-xs py-8" style={{ color: 'var(--text-dim)' }}>שלח הודעה ראשונה לספק</p>
        )}
        {msgs.map(m => {
          const isMe = m.from === 'client'
          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5" style={{ background: 'rgba(107,95,228,0.1)' }}>
                  {chatLead.heroImage
                    ? <img src={chatLead.heroImage} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: 'var(--primary)' }}>
                        {chatLead.vendor_name?.[0]?.toUpperCase() || '?'}
                      </div>
                  }
                </div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${isMe ? 'text-white' : ''}`}
                style={{
                  background: isMe ? 'var(--primary)' : 'var(--surface)',
                  border: isMe ? 'none' : '1.5px solid var(--border)',
                  boxShadow: isMe ? 'none' : 'var(--shadow-card)',
                }}>
                <p className="text-sm leading-relaxed" style={{ color: isMe ? '#fff' : 'var(--text-primary)' }}>{m.text}</p>
                {m.timeStr && <p className="text-[10px] mt-1" style={{ color: isMe ? 'rgba(255,255,255,0.6)' : 'var(--text-dim)' }}>{m.timeStr}</p>}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 py-4"
        style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-3">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="שלח הודעה..."
            className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button onClick={send} disabled={sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-50"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}>
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
