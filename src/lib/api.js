async function req(method, path, body, isFormData = false) {
  const opts = {
    method,
    credentials: 'include',
  }
  if (body && !isFormData) {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(body)
  } else if (isFormData) {
    opts.body = body
  }
  const resp = await fetch(path, opts)
  if (resp.status === 401) {
    window.location.href = '/auth/login'
    return null
  }
  if (resp.status === 204) return null
  return resp.json()
}

export const api = {
  me: () => req('GET', '/api/me'),
  agents: () => req('GET', '/api/agents'),
  chats: () => req('GET', '/api/chats'),
  getChat: (id) => req('GET', `/api/chat/${id}`),
  createChat: (agentId) => req('POST', '/api/chat', { agent_id: agentId }),
  deleteChat: (id) => req('DELETE', `/api/chat/${id}`),
  feedback: (convId, msgId, value) =>
    req('POST', `/api/chat/${convId}/message/${msgId}/feedback`, { feedback: value }),
  adminUsers: () => req('GET', '/api/admin/users'),
  patchUser: (id, data) => req('PATCH', `/api/admin/users/${id}`, data),
  deleteUser: (id) => req('DELETE', `/api/admin/users/${id}`),
  adminDocs: () => req('GET', '/api/admin/documents'),
  uploadDoc: (formData) => req('POST', '/api/admin/documents', formData, true),
  deleteDoc: (versionId) => req('DELETE', `/api/admin/documents/${versionId}`),
}

export async function streamMessage(convId, content, onToken, onCitations, onDone) {
  const resp = await fetch(`/api/chat/${convId}/message`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!resp.ok) {
    if (resp.status === 401) window.location.href = '/auth/login'
    throw new Error(`Stream failed: ${resp.status}`)
  }
  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') { onDone(); return }
      if (data.startsWith('[CITATIONS]')) {
        try { onCitations(JSON.parse(data.slice(11)).citations) } catch {}
      } else {
        onToken(data)
      }
    }
  }
  onDone()
}
