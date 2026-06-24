import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { api, streamMessage } from '../lib/api'
import { useUser } from '../lib/userContext'
import '../styles/tokens.css'

const AGENT_COLOURS = {
  General: { bg: 'var(--agent-general-bg)', fg: 'var(--agent-general-fg)' },
  Finance: { bg: 'var(--agent-finance-bg)', fg: 'var(--agent-finance-fg)' },
  HR: { bg: 'var(--agent-hr-bg)', fg: 'var(--agent-hr-fg)' },
  Service: { bg: 'var(--agent-service-bg)', fg: 'var(--agent-service-fg)' },
  Purchase: { bg: 'var(--agent-purchase-bg)', fg: 'var(--agent-purchase-fg)' },
  Business: { bg: 'var(--agent-business-bg)', fg: 'var(--agent-business-fg)' },
  Marketing: { bg: 'var(--agent-marketing-bg)', fg: 'var(--agent-marketing-fg)' },
  'Pre-Sales': { bg: 'var(--agent-presales-bg)', fg: 'var(--agent-presales-fg)' },
}

export default function ChatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  useUser() // ensure context is loaded

  const [conv, setConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState({})

  const bottomRef = useRef(null)

  useEffect(() => {
    api.getChat(id).then(data => {
      if (!data) return
      setConv(data)
      setMessages(data.messages || [])
    })
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const agentColour = conv?.agent
    ? (AGENT_COLOURS[conv.agent.department] || AGENT_COLOURS.General)
    : { bg: 'var(--olive-100)', fg: 'var(--olive-700)' }

  async function send() {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    setStreaming(true)

    const userMsg = { id: `tmp-${Date.now()}`, role: 'user', content: text, citations: [], feedback: null }
    const botId = `bot-${Date.now()}`
    setMessages(prev => [...prev, userMsg, { id: botId, role: 'assistant', content: '', citations: [], feedback: null, streaming: true }])

    try {
      await streamMessage(
        id,
        text,
        (token) => setMessages(prev => prev.map(m => m.id === botId ? { ...m, content: m.content + token } : m)),
        (citations) => setMessages(prev => prev.map(m => m.id === botId ? { ...m, citations } : m)),
        () => {
          setMessages(prev => prev.map(m => m.id === botId ? { ...m, streaming: false } : m))
          setStreaming(false)
          api.getChat(id).then(data => { if (data) { setConv(data); setMessages(data.messages || []) } })
        }
      )
    } catch {
      setMessages(prev => prev.map(m => m.id === botId ? { ...m, content: 'An error occurred. Please try again.', streaming: false } : m))
      setStreaming(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  async function sendFeedback(msgId, value) {
    if (feedbackSent[msgId]) return
    setFeedbackSent(prev => ({ ...prev, [msgId]: value }))
    await api.feedback(id, msgId, value)
  }

  async function doDelete() {
    await api.deleteChat(id)
    navigate('/home')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--canvas)', overflow: 'hidden' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: '1px solid var(--line)', background: 'var(--canvas)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '7px 12px', fontSize: 13, fontWeight: 500, minWidth: 0 }}>
            {conv?.agent && (
              <span style={{ width: 20, height: 20, borderRadius: 6, background: agentColour.bg, display: 'inline-block', flexShrink: 0 }} />
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv?.title || conv?.agent?.name || 'Chat'}</span>
            {conv?.agent && (
              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11.5, color: 'var(--gold-700)', background: 'var(--gold-50)', border: '1px solid var(--gold-200)', borderRadius: 'var(--r-pill)', padding: '3px 10px', fontWeight: 500, flexShrink: 0 }}>
                {conv.agent.name}
              </span>
            )}
          </div>

          <div style={{ marginLeft: 'auto', position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '7px 10px', cursor: 'pointer', color: 'var(--ink-2)', display: 'flex', alignItems: 'center' }}
            >
              <ThreeDotsIcon />
            </button>
            {menuOpen && (
              <div
                style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', boxShadow: 'var(--e2)', zIndex: 100, minWidth: 170 }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => { setMenuOpen(false); setShowPublishModal(true) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2)' }}
                >
                  Publish Chat
                </button>
                <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                <button
                  onClick={() => { setMenuOpen(false); setShowDeleteModal(true) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                >
                  Delete conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 12px' }}>
            {messages.length === 0 && !streaming && (
              <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--ink-3)' }}>
                <p style={{ fontSize: 16, fontFamily: 'var(--font-serif)', fontWeight: 500, color: 'var(--ink-2)' }}>Start the conversation</p>
                <p style={{ fontSize: 14, marginTop: 8 }}>Ask {conv?.agent?.name || 'the assistant'} anything from the knowledge base.</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 22 }}>
                {msg.role === 'user' ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '12px 16px', maxWidth: '78%', fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.55 }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: agentColour.bg, color: agentColour.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: msg.streaming ? 'avatarPulse 1.2s ease-in-out infinite' : 'none' }}>
                      <BotIcon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {msg.content}
                        {msg.streaming && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--olive-600)', marginLeft: 2, animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} />}
                      </p>

                      {msg.citations?.length > 0 && (
                        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {msg.citations.map((c, i) => (
                            <Citation key={i} citation={c} isFinance={conv?.agent?.department === 'Finance'} />
                          ))}
                        </div>
                      )}

                      {!msg.streaming && (
                        <div style={{ display: 'flex', gap: 14, marginTop: 12, color: 'var(--ink-3)' }}>
                          <FeedbackButton type="up" active={feedbackSent[msg.id] === 'up'} disabled={!!feedbackSent[msg.id]} onClick={() => sendFeedback(msg.id, 'up')} />
                          <FeedbackButton type="down" active={feedbackSent[msg.id] === 'down'} disabled={!!feedbackSent[msg.id]} onClick={() => sendFeedback(msg.id, 'down')} />
                          <button
                            onClick={() => navigator.clipboard.writeText(msg.content).catch(() => {})}
                            title="Copy"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, background: 'linear-gradient(to top, var(--canvas) 70%, rgba(243,241,232,0))', padding: '14px 24px 20px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-xl)', padding: '14px 16px', boxShadow: 'var(--e1)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Ask ${conv?.agent?.name || 'the assistant'} anything…`}
              rows={1}
              disabled={streaming}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.55, minHeight: 24, maxHeight: 160, overflow: 'auto', boxSizing: 'border-box' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Enter to send · Shift+Enter for new line</div>
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: 'var(--r-md)', background: (input.trim() && !streaming) ? 'var(--olive-600)' : 'var(--line)', color: '#fff', border: 'none', cursor: (input.trim() && !streaming) ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .12s' }}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 10, color: 'var(--ink)' }}>Delete conversation?</h3>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55, marginBottom: 24 }}>This will permanently delete this conversation and all its messages. The knowledge base is not affected.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowDeleteModal(false)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 14, color: 'var(--ink)' }}>Cancel</button>
            <button onClick={doDelete} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--danger)', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', fontWeight: 500 }}>Delete</button>
          </div>
        </Modal>
      )}

      {showPublishModal && (
        <Modal onClose={() => setShowPublishModal(false)}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 10, color: 'var(--ink)' }}>Community sharing</h3>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55 }}>Community sharing is coming soon. It will be available in Phase 3 of the Athena rollout.</p>
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button onClick={() => setShowPublishModal(false)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--olive-600)', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff' }}>Got it</button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes avatarPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}

function Citation({ citation, isFinance }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 'var(--r-md)', padding: '10px 12px', fontSize: 12.5, background: 'var(--gold-50)', border: '1px solid var(--gold-300)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-700)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: 'var(--gold-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{citation.document_title}</div>
        {citation.version_tag && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold-700)' }}>{citation.version_tag}</div>}
      </div>
      {citation.effective_date && (
        <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: isFinance ? 'var(--gold-600)' : 'var(--olive-600)', borderRadius: 'var(--r-pill)', padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {isFinance ? 'Effective ' : ''}{citation.effective_date}
        </span>
      )}
    </div>
  )
}

function FeedbackButton({ type, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={type === 'up' ? 'Helpful' : 'Not helpful'}
      style={{ background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', padding: 0, color: active ? (type === 'up' ? 'var(--olive-600)' : 'var(--danger)') : 'var(--ink-3)', display: 'flex', alignItems: 'center' }}
    >
      {type === 'up' ? <ThumbUpIcon /> : <ThumbDownIcon />}
    </button>
  )
}

function Modal({ children, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '28px 32px', maxWidth: 420, width: '90%', boxShadow: 'var(--e3)' }}>
        {children}
      </div>
    </div>
  )
}

function BotIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><circle cx="8" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1" fill="currentColor" stroke="none"/></svg>
}
function SendIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
}
function ThreeDotsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
}
function ThumbUpIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
}
function ThumbDownIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
}
function CopyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
}
