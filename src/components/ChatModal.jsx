/* eslint-disable react/prop-types */
import { GoogleGenerativeAI } from '@google/generative-ai'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const initialMessage = {
  role: 'assistant',
  content: "Ask me anything about Aman's work, this portfolio, or the stack behind it.",
}

const monoFont = { fontFamily: 'MartianMono, monospace' }
const interFont = { fontFamily: "'Inter', sans-serif" }

function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([initialMessage])
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const panelRef = useRef(null)
  const scrollRef = useRef(null)

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  const model = useMemo(() => {
    if (!apiKey) {
      return null
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }, [apiKey])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [onClose])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, status])

  const sendPrompt = async (event) => {
    event.preventDefault()

    const question = prompt.trim()
    if (!question) {
      return
    }

    setError('')
    setPrompt('')
    setMessages((prev) => [...prev, { role: 'user', content: question }])

    if (!model) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Missing `VITE_GEMINI_API_KEY`. Add it in `.env` and restart `npm run dev`.',
        },
      ])
      return
    }

    setStatus('loading')
    try {
      const result = await model.generateContent(question)
      const answer = result.response.text().trim() || 'No response text returned.'
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (err) {
      setError(err.message || 'Unknown error while calling Gemini API.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      aria-label="Gemini chat"
      aria-modal="true"
      className="fixed right-4 top-24 z-[9000] w-[min(92vw,380px)]"
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      ref={panelRef}
      role="dialog"
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="rounded-[16px] border-[3px] border-[#2a2a2a] bg-[#515051] p-[5px] shadow-[0_18px_50px_rgba(0,0,0,0.6)]">
        <div className="flex max-h-[70vh] flex-col rounded-[11px] border border-black bg-[#1c1c1c]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                className="h-2 w-2 rounded-full bg-[#ff0000]"
                transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
              />
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d6d6d6]" style={monoFont}>
                Gemini Chat
              </p>
            </div>
            <button
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a2a] text-[#d6d6d6] transition-colors hover:border-[#ff0000] hover:text-[#ff0000]"
              onClick={onClose}
              type="button"
            >
              <span aria-hidden className="text-[14px] leading-none">
                &#10005;
              </span>
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-[160px] flex-1 space-y-3 overflow-y-auto px-4 py-3" ref={scrollRef}>
            {messages.map((message, idx) => (
              <div
                className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-6 border border-[#3a1414] bg-[rgba(255,0,0,0.08)] text-white'
                    : 'mr-6 border border-[#2a2a2a] bg-[#171717] text-[#d6d6d6]'
                }`}
                key={`${message.role}-${idx}`}
                style={interFont}
              >
                <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#8a8a8a]" style={monoFont}>
                  {message.role === 'user' ? 'you' : 'gemini'}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {status === 'loading' && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a8a]" style={monoFont}>
                thinking...
              </p>
            )}
          </div>

          {/* Input */}
          <form className="flex gap-2 border-t border-[#2a2a2a] p-3" onSubmit={sendPrompt}>
            <input
              className="w-full rounded-full border border-[#2a2a2a] bg-[#111] px-4 py-2 text-[12px] text-white outline-none placeholder:text-[#6a6a6a] focus:border-[#ff0000]"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Type a prompt..."
              style={interFont}
              value={prompt}
            />
            <button
              className="shrink-0 rounded-full border border-[#ff0000] px-4 py-2 text-[11px] uppercase text-[#ff8f8f] transition-colors hover:bg-[rgba(255,0,0,0.1)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === 'loading'}
              style={interFont}
              type="submit"
            >
              Send
            </button>
          </form>

          {error && (
            <p className="border-t border-[#2a2a2a] px-4 py-2 text-[11px] text-[#ff6b6b]" style={interFont}>
              {error}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatModal
