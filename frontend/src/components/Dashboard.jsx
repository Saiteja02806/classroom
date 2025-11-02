import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ConnectionTest } from './ConnectionTest'
import { LogOut, User, Mail, Loader } from 'lucide-react'

export const Dashboard = () => {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/login')
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Test */}
        <ConnectionTest />
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to AI Telugu Summarization</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-lg font-medium text-gray-900">{user?.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            {user?.user_metadata?.full_name && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{user.user_metadata.full_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for app content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Telugu Summarization</h2>
          <p className="text-gray-600">
            Your authentication is complete! You can now start building your AI Telugu Summarization features here.
          </p>
        </div>
      </div>
    </div>
  )
}

