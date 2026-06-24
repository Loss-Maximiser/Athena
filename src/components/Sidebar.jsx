import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useUser } from '../lib/userContext'

export default function Sidebar() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { id: activeId } = useParams()
  const [history, setHistory] = useState({ today: [], previous_7_days: [], previous_month: [], older: [] })
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    api.chats().then(h => { if (h) setHistory(h) })
  }, [activeId])

  const initials = user?.display_name
    ? user.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const groups = [
    { label: 'Today', items: history.today || [] },
    { label: 'Previous 7 days', items: history.previous_7_days || [] },
    { label: 'Previous month', items: history.previous_month || [] },
    { label: 'Older', items: history.older || [] },
  ].filter(g => g.items.length > 0)

  if (collapsed) {
    return (
      <div style={{ width: 48, flexShrink: 0, background: 'var(--forest)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0' }}>
        <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', color: 'var(--on-forest-3)', cursor: 'pointer', padding: 8 }}>
          <CollapseIcon />
        </button>
      </div>
    )
  }

  return (
    <aside style={{ width: 248, flexShrink: 0, background: 'var(--forest)', color: 'var(--on-forest)', display: 'flex', flexDirection: 'column', padding: '16px 14px', overflowY: 'auto', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 16px' }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--olive-600)', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', inset: 7, borderRadius: '50%', background: 'var(--gold-300)' }} />
        </span>
        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 17, color: '#fff' }}>Ingsol AI</span>
        <button onClick={() => setCollapsed(true)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--on-forest-3)', cursor: 'pointer', padding: 0 }}>
          <CollapseIcon />
        </button>
      </div>

      {/* New chat */}
      <button
        onClick={() => navigate('/home')}
        style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--olive-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '9px 14px', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <PlusIcon /> New chat
      </button>

      {/* History groups */}
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--on-forest-3)', margin: '18px 6px 6px', fontWeight: 600 }}>{g.label}</div>
            {g.items.map(item => (
              <Link
                key={item.id}
                to={`/chat/${item.id}`}
                style={{
                  display: 'block',
                  fontSize: 13.5,
                  color: item.id === activeId ? 'var(--on-forest)' : 'var(--on-forest-2)',
                  padding: '8px 10px',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textDecoration: 'none',
                  background: item.id === activeId ? 'var(--forest-2)' : 'transparent',
                }}
              >
                {item.title || 'New conversation'}
              </Link>
            ))}
          </div>
        ))}
        {groups.length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--on-forest-3)', padding: '18px 10px', textAlign: 'center', lineHeight: 1.6 }}>
            No conversations yet.<br />Start a chat from the home screen.
          </div>
        )}

        {/* Community stub */}
        <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--on-forest-3)', margin: '18px 6px 6px', fontWeight: 600 }}>Community chat</div>
        <div style={{ fontSize: 13, color: 'var(--on-forest-3)', padding: '8px 10px', lineHeight: 1.5 }}>No community chats yet.</div>
      </div>

      {/* Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderTop: '1px solid var(--forest-line)', marginTop: 8, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--olive-400)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.display_name || ''}</div>
          <div style={{ fontSize: 11.5, color: 'var(--on-forest-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
        </div>
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ fontSize: 11, color: 'var(--gold-300)', textDecoration: 'none', flexShrink: 0 }}>Admin</Link>
        )}
      </div>
    </aside>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4v16h7M14 4h6v16h-6" />
    </svg>
  )
}
