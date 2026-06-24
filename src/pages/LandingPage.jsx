import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AgentCard from '../components/AgentCard'
import { api } from '../lib/api'
import { useUser } from '../lib/userContext'
import '../styles/tokens.css'

function greeting(name) {
  const h = new Date().getHours()
  const time = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${time}, ${name}`
}

export default function LandingPage() {
  const { user } = useUser()
  const [agents, setAgents] = useState([])

  useEffect(() => {
    api.agents().then(a => { if (a) setAgents(a) })
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--canvas)' }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 36px 56px' }}>
          {/* Hero */}
          <section style={{ textAlign: 'center', padding: '14px 0 32px' }}>
            {/* Athena mark */}
            <div style={{ width: 64, height: 64, margin: '0 auto 20px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 46%, rgba(217,184,94,.4), rgba(217,184,94,0) 62%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(217,184,94,.25)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-300)', boxShadow: '0 0 16px rgba(217,184,94,.7)' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 38, letterSpacing: '-.01em', color: 'var(--ink)' }}>
              {user ? greeting(user.display_name.split(' ')[0]) : 'Good morning'}
            </h1>
            <p style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 16 }}>How can I help you today?</p>
          </section>

          {/* Agent grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
            {agents.length === 0 && Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 110, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', opacity: 0.6 }} />
            ))}
          </div>

          {/* Community stub */}
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: 20, marginTop: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 19, color: 'var(--ink)' }}>Community chat</h3>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '7px 14px', fontSize: 12.5, color: 'var(--ink-3)', cursor: 'default' }}>
                  + Publish chat
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-3)', fontSize: 14 }}>
              No community chats yet. Community sharing arrives in Phase 3.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
