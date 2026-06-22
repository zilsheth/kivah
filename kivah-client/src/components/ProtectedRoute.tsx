import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  // Wait for auth to load before deciding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-kivah-50 flex items-center justify-center">
        <p className="text-kivah-500 text-sm">Loading...</p>
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in — render the page
  return <>{children}</>
}

export default ProtectedRoute