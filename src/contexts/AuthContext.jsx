import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle email confirmation
      if (event === 'SIGNED_IN' && session?.user) {
        // Refresh user data after sign in
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user)
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        // Provide user-friendly error messages
        let friendlyMessage = error.message
        if (error.message.includes('already registered')) {
          friendlyMessage = 'An account with this email already exists. Please sign in instead.'
        } else if (error.message.includes('Password')) {
          friendlyMessage = 'Password does not meet requirements. Please use a stronger password.'
        } else if (error.message.includes('email')) {
          friendlyMessage = 'Please enter a valid email address.'
        }

        return { data: null, error: { ...error, message: friendlyMessage } }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: { message: 'An unexpected error occurred. Please try again.' },
      }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Provide user-friendly error messages
        let friendlyMessage = error.message
        if (error.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMessage = 'Please verify your email address before signing in. Check your inbox for the confirmation link.'
        } else if (error.message.includes('email')) {
          friendlyMessage = 'Please enter a valid email address.'
        }

        return { data: null, error: { ...error, message: friendlyMessage } }
      }

      // Verify the user's email if they just signed in
      if (data?.user && !data.user.email_confirmed_at) {
        return {
          data: null,
          error: {
            message:
              'Please verify your email address before signing in. Check your inbox for the confirmation link.',
          },
        }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: { message: 'An unexpected error occurred. Please try again.' },
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { error }
      }
      // Clear local state
      setUser(null)
      setSession(null)
      return { error: null }
    } catch (err) {
      return { error: { message: 'Failed to sign out. Please try again.' } }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      )

      if (error) {
        let friendlyMessage = error.message
        if (error.message.includes('email')) {
          friendlyMessage = 'Please enter a valid email address.'
        }
        return { data: null, error: { ...error, message: friendlyMessage } }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: { message: 'Failed to send reset email. Please try again.' },
      }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        let friendlyMessage = error.message
        if (error.message.includes('Password')) {
          friendlyMessage = 'Password does not meet requirements. Please use a stronger password.'
        }
        return { data: null, error: { ...error, message: friendlyMessage } }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: { message: 'Failed to update password. Please try again.' },
      }
    }
  }

  const resendConfirmationEmail = async (email) => {
    try {
      // Supabase resend confirmation email
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: { message: 'Failed to resend confirmation email. Please try again.' },
      }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

