import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dyphuthrtmgvaeoferbm.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30.nyJEhIcGcJiGvACogsZmdzMM3_c1LKqiVMsbTuFa22I'

// Export URL for use in other components
export { supabaseUrl }

export const supabase = createClient(supabaseUrl, supabaseKey)

