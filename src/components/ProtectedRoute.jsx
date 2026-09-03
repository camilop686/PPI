import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, session, profile, adminOnly = false }) {
  if (!session) {
    return <Navigate to="/acceso" replace />
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/inicio" replace />
  }

  return children
}
