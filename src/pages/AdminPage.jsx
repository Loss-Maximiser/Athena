import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import { useUser } from '../lib/userContext'
import Sidebar from '../components/Sidebar'
import '../styles/tokens.css'

export default function AdminPage() {
  useUser()
  const [tab, setTab] = useState('users')

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--canvas)', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>Admin</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>Manage users and knowledge base documents.</p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--olive-50)', border: '1px solid var(--olive-200)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 18, fontSize: 12.5, color: 'var(--olive-800)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--olive-600)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span><b>Identity is Zoho OAuth only.</b> There are no passwords in this system. User actions set role and active status only.</span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['users', 'chat', 'datasync'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ fontSize: 13, color: tab === t ? '#fff' : 'var(--ink-2)', background: tab === t ? 'var(--forest)' : 'var(--surface)', border: `1px solid ${tab === t ? 'var(--forest)' : 'var(--line)'}`, borderRadius: 'var(--r-pill)', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {{ users: 'Manage Users', chat: 'Manage Chat', datasync: 'Data Sync' }[t]}
              </button>
            ))}
          </div>

          {tab === 'users' && <UsersTab />}
          {tab === 'chat' && (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-3)' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--ink-2)' }}>Coming soon</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>Chat moderation tools will be available in a future release.</p>
            </div>
          )}
          {tab === 'datasync' && <DataSyncTab />}
        </div>
      </main>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const roleRef = useRef(null)

  useEffect(() => {
    api.adminUsers().then(u => { if (u) setUsers(Array.isArray(u) ? u : []) })
  }, [])

  const filtered = users.filter(u =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRoleChange(userId) {
    const role = roleRef.current?.value
    if (!role) return
    const updated = await api.patchUser(userId, { role })
    if (updated) setUsers(prev => prev.map(u => u.id === userId ? updated : u))
    setEditUser(null)
  }

  async function handleDeactivate(userId) {
    await api.deleteUser(userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u))
    setDeleteUser(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '8px 14px', fontSize: 13, color: 'var(--ink-3)', width: 260 }}>
          <SearchIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: 'var(--ink)', width: '100%' }}
          />
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-3)' }}>{filtered.length} users</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Name', 'Employee ID', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 11.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600, padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr
                key={u.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--olive-100)', color: 'var(--olive-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      {u.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{u.display_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-2)' }}>{u.zoho_id}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 500, padding: '3px 11px', borderRadius: 'var(--r-pill)',
                    ...(u.role === 'admin'
                      ? { background: 'var(--gold-50)', color: 'var(--gold-700)', border: '1px solid var(--gold-200)' }
                      : { background: 'var(--olive-50)', color: 'var(--olive-700)', border: '1px solid var(--olive-200)' })
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--ink-2)' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.is_active ? 'var(--olive-500)' : 'var(--ink-3)' }} />
                    {u.is_active ? 'Active' : 'Deactivated'}
                  </div>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <button
                      onClick={() => setEditUser(u)} title="Edit role"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--olive-600)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => setDeleteUser(u)} title="Deactivate"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editUser && (
        <Modal onClose={() => setEditUser(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>Edit {editUser.display_name}</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 20 }}>Change role. No password fields — identity is Zoho OAuth only.</p>
          <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: 'var(--ink)' }}>Role</label>
          <select
            ref={roleRef}
            defaultValue={editUser.role}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button onClick={() => setEditUser(null)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => handleRoleChange(editUser.id)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--olive-600)', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', fontWeight: 500, fontFamily: 'inherit' }}>Save</button>
          </div>
        </Modal>
      )}

      {deleteUser && (
        <Modal onClose={() => setDeleteUser(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 10, color: 'var(--ink)' }}>Deactivate {deleteUser.display_name}?</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 24 }}>The user will no longer be able to access Ingsol AI. Their chat history is preserved. This does not erase any records.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteUser(null)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => handleDeactivate(deleteUser.id)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--danger)', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', fontWeight: 500, fontFamily: 'inherit' }}>Deactivate</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function DataSyncTab() {
  const [docs, setDocs] = useState({})
  const [showUpload, setShowUpload] = useState(false)
  const [deleteVersion, setDeleteVersion] = useState(null)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    api.adminDocs().then(d => { if (d && typeof d === 'object') setDocs(d) })
  }, [])

  async function handleDelete(versionId) {
    await api.deleteDoc(versionId)
    setDeleteVersion(null)
    api.adminDocs().then(d => { if (d) setDocs(d) })
  }

  function refreshDocs() {
    api.adminDocs().then(d => { if (d) setDocs(d) })
  }

  const categories = Object.keys(docs)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>Knowledge base documents</h2>
        <button
          onClick={() => setShowUpload(true)}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, background: 'var(--olive-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '9px 16px', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + Add document
        </button>
      </div>

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--ink-2)' }}>No documents yet</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Upload your first document to start building the knowledge base.</p>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', marginBottom: 12, overflow: 'hidden' }}>
          <button
            onClick={() => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }))}
            style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
          >
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{cat}</span>
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--ink-3)', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: '2px 8px' }}>{docs[cat].length}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--ink-3)', fontSize: 18 }}>{expanded[cat] ? '−' : '+'}</span>
          </button>

          {expanded[cat] && docs[cat].map(doc => (
            <div key={doc.document_id} style={{ borderTop: '1px solid var(--line)', padding: '14px 18px' }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 10, color: 'var(--ink)' }}>{doc.title}</div>
              {doc.versions.map((v, i) => (
                <div key={v.version_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none', fontSize: 13 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-700)', background: 'var(--gold-50)', border: '1px solid var(--gold-200)', borderRadius: 'var(--r-pill)', padding: '2px 8px', flexShrink: 0 }}>{v.version_tag}</span>
                  <span style={{ color: 'var(--ink-2)' }}>{v.uploader_display_name}</span>
                  <span style={{ color: 'var(--ink-3)' }}>Effective {v.effective_date}</span>
                  <span style={{
                    fontSize: 11.5, fontWeight: 500, padding: '2px 9px', borderRadius: 'var(--r-pill)', flexShrink: 0,
                    ...(v.status === 'active'
                      ? { background: 'var(--success-bg)', color: 'var(--success)' }
                      : { background: 'var(--surface-2)', color: 'var(--ink-3)' })
                  }}>
                    {v.status}
                  </span>
                  <button
                    onClick={() => setDeleteVersion(v)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 0, flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); refreshDocs() }}
          existingDocs={docs}
        />
      )}

      {deleteVersion && (
        <Modal onClose={() => setDeleteVersion(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 10, color: 'var(--ink)' }}>Delete version {deleteVersion.version_tag}?</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 24 }}>This will tombstone the version. Existing chunks will be marked superseded and excluded from all future retrievals. This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteVersion(null)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => handleDelete(deleteVersion.version_id)} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--danger)', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', fontWeight: 500, fontFamily: 'inherit' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function UploadModal({ onClose, onSuccess, existingDocs }) {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [versionTag, setVersionTag] = useState('')
  const [supersedesId, setSupersedesId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const CATEGORIES = ['HR', 'Finance', 'Service', 'Purchase', 'Business', 'General', 'Marketing', 'Pre-Sales']
  const allVersions = Object.values(existingDocs).flat().flatMap(doc =>
    (doc.versions || []).map(v => ({ ...v, docTitle: doc.title }))
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file || !category || !effectiveDate || !versionTag) { setError('All required fields must be filled.'); return }
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    fd.append('department_scope', category)
    fd.append('effective_date', effectiveDate)
    fd.append('version_tag', versionTag)
    if (supersedesId) fd.append('supersedes_version_id', supersedesId)
    try {
      const result = await api.uploadDoc(fd)
      setUploading(false)
      if (result) onSuccess()
      else setError('Upload failed. Check file size and format.')
    } catch {
      setUploading(false)
      setError('Upload failed. Check file size and format.')
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const labelStyle = { fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6, color: 'var(--ink)' }

  return (
    <Modal onClose={onClose} wide>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 20, marginBottom: 20, color: 'var(--ink)' }}>Add document</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>File <span style={{ color: 'var(--danger)' }}>*</span></label>
          <div
            onClick={() => fileRef.current.click()}
            style={{ padding: '20px', border: '1px dashed var(--line-2)', borderRadius: 'var(--r-md)', textAlign: 'center', cursor: 'pointer', fontSize: 13, color: file ? 'var(--olive-700)' : 'var(--ink-2)', background: file ? 'var(--olive-50)' : 'transparent' }}
          >
            {file ? file.name : 'Click to select PDF, DOCX, PPTX, XLSX (max 25 MB)'}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.xlsx,.xls" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Category <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Version tag <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input value={versionTag} onChange={e => setVersionTag(e.target.value)} placeholder="e.g. v1" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Effective date <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Supersedes version (optional)</label>
          <select value={supersedesId} onChange={e => setSupersedesId(e.target.value)} style={inputStyle}>
            <option value="">None</option>
            {allVersions.map(v => <option key={v.version_id} value={v.version_id}>{v.docTitle} — {v.version_tag}</option>)}
          </select>
        </div>
        {error && <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 14 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>Cancel</button>
          <button type="submit" disabled={uploading} style={{ padding: '9px 18px', borderRadius: 'var(--r-pill)', background: 'var(--olive-600)', border: 'none', cursor: uploading ? 'wait' : 'pointer', fontSize: 14, color: '#fff', fontWeight: 500, opacity: uploading ? 0.7 : 1, fontFamily: 'inherit' }}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Modal({ children, onClose, wide }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '28px 32px', maxWidth: wide ? 520 : 420, width: '92%', boxShadow: 'var(--e3)', maxHeight: '90vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
}
function EditIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
function TrashIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
}
