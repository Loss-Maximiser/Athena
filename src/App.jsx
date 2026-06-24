import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './lib/userContext'
import AthenaLogin from './components/common/AthenaLogin'
import AuthSuccess from './pages/AuthSuccess'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AthenaLogin />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
