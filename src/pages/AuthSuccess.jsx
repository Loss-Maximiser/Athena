import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    api.me()
      .then(u => u ? navigate('/home') : navigate('/'))
      .catch(() => navigate('/'))
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F3F1E8', fontFamily: 'sans-serif', color: '#585C4C' }}>
      Signing in...
    </div>
  )
}
