import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhasbnuoppvqksdbqwqj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYXNibnVvcHB2cWtzZGJxd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzU1MzQsImV4cCI6MjA4NjE1MTUzNH0.Trtw4kZHsw6pyWTY6BrEp29Dw8LgceLXxyxV8IhuFvQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'readracing-auth-token' // Должен совпадать с лендингом для общей сессии
  }
})
