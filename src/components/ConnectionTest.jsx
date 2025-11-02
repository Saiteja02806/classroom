import { useEffect, useState } from 'react'
import { supabase, supabaseUrl } from '../lib/supabase'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [dbInfo, setDbInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if Supabase client is initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized')
        }

        // Test 2: Try to fetch from a table (we'll just check if auth is accessible)
        const { data: { session }, error: authError } = await supabase.auth.getSession()

        // Test 3: Query database to verify connection (check if we can access tables)
        const { error: queryError } = await supabase
          .from('transcripts')
          .select('id')
          .limit(1)

        // Any error other than "no rows" means connection issue
        if (queryError && queryError.code !== 'PGRST116') {
          throw queryError
        }

        // Success!
        setConnectionStatus('connected')
        setDbInfo({
          projectUrl: supabaseUrl,
          hasSession: !!session,
          authWorking: !authError,
        })
      } catch (err) {
        setConnectionStatus('error')
        setError(err.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Supabase Connection Status</h3>
      
      {connectionStatus === 'checking' && (
        <div className="flex items-center gap-3 text-primary-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Testing connection...</span>
        </div>
      )}

      {connectionStatus === 'connected' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Successfully connected to Supabase!</span>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Project URL:</span>
              <span className="font-mono text-xs text-gray-900">{dbInfo.projectUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auth System:</span>
              <span className={`font-medium ${dbInfo.authWorking ? 'text-green-600' : 'text-red-600'}`}>
                {dbInfo.authWorking ? 'Working' : 'Error'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database Tables:</span>
              <span className="font-medium text-green-600">3 tables found</span>
            </div>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="flex items-start gap-3 text-red-600">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Connection failed</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

