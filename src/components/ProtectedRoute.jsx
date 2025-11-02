import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader } from 'lucide-react'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-primary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if email is verified (optional - uncomment if you want to enforce email verification)
  // if (!user.email_confirmed_at) {
  //   return <Navigate to="/verify-email" replace />
  // }

  return children
}

