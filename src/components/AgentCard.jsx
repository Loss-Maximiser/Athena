import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

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

export default function AgentCard({ agent }) {
  const navigate = useNavigate()
  const colours = AGENT_COLOURS[agent.department] || AGENT_COLOURS.General
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (loading) return
    setLoading(true)
    try {
      const result = await api.createChat(agent.id)
      if (result?.conversation_id) navigate(`/chat/${result.conversation_id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: 14,
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all .12s',
        position: 'relative',
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--olive-300)'
        e.currentTarget.style.boxShadow = 'var(--e2)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, background: colours.bg, color: colours.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <AgentIcon name={agent.name} fg={colours.fg} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>{agent.description}</div>
      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 600, letterSpacing: '.04em', color: 'var(--olive-700)', background: 'var(--olive-50)', border: '1px solid var(--olive-200)', padding: '2px 7px', borderRadius: 'var(--r-pill)' }}>
        LIVE
      </span>
    </div>
  )
}

function AgentIcon({ name, fg }) {
  const icons = {
    'General Chat': 'M8 12h8M8 8h8M8 16h5',
    Finance: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    'HR Assistant': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    Service: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    Purchase: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
    Business: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
    Marketing: 'M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'Pre-Sales': 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10m14-10v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z',
  }
  const d = icons[name] || 'M8 12h8M8 8h8M8 16h5'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}
