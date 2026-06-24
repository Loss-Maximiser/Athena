import { useUser } from '../lib/userContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useUser()

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F3F1E8' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #D9B85E', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/home" replace />
  return children
}
