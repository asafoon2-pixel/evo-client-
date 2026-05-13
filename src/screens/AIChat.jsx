import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { sendMessage } from '../lib/chatbotService'

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'assistant',
  content: 'שלום! אני EVO AI, העוזר שלך לתכנון אירועים 🎉 במה אוכל לעזור לך היום?',
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end">
      {/* AI avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B5FE4, #3D2B7A)' }}
      >
        <Sparkles size={12} className="text-white" />
      </div>

      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-1"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--text-muted)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function AIChat() {
  const { navigate, briefAnswers, eventDetails, selectedSuppliers, cart, firestoreUser } = useApp()
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const apiKeyMissing = !import.meta.env.VITE_GROQ_API_KEY

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build history for API (exclude the local init message id)
    const history = [...messages, userMsg]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content }))

    const appCtx = { briefAnswers, eventDetails, selectedSuppliers, cart, firestoreUser }
    const reply = await sendMessage(history, appCtx)

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), role: 'assistant', content: reply },
    ])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen flex flex-col"
      style={{ background: 'var(--background)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-10 pb-3 flex items-center gap-3"
        style={{
          background: 'rgba(245,240,232,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => navigate('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #6B5FE4, #3D2B7A)' }}
        >
          <Sparkles size={18} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            EVO AI
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            עוזר תכנון אירועים
          </p>
        </div>

        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(74,158,114,0.12)', color: '#4A9E72' }}
        >
          מחובר
        </span>
      </div>

      {/* API key notice */}
      {apiKeyMissing && (
        <div
          className="mx-5 mt-4 rounded-2xl px-4 py-3 text-sm text-center"
          style={{
            background: 'rgba(232,160,48,0.12)',
            border: '1.5px solid rgba(232,160,48,0.3)',
            color: '#9B6B1A',
          }}
        >
          שירות ה-AI אינו מוגדר. הגדר <code className="font-mono text-xs">VITE_GROQ_API_KEY</code> ב-.env
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* AI avatar for assistant messages */}
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6B5FE4, #3D2B7A)' }}
                  >
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}

                <div
                  className="max-w-[78%] rounded-2xl px-4 py-3"
                  style={{
                    background: isUser ? 'var(--primary)' : 'var(--surface)',
                    border: isUser ? 'none' : '1.5px solid var(--border)',
                    boxShadow: isUser ? 'var(--shadow-accent)' : 'var(--shadow-card)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: isUser ? '#fff' : 'var(--text-primary)' }}
                  >
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 py-4"
        style={{
          background: 'rgba(245,240,232,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שאל אותי על האירוע שלך..."
            rows={1}
            disabled={loading}
            className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none leading-relaxed disabled:opacity-60"
            style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
              minHeight: 46,
              maxHeight: 120,
            }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-accent)' }}
          >
            <Send size={16} className="text-white" style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
