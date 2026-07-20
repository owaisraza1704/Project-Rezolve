import { createClient } from '@supabase/supabase-js'

function getRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const supabase = createClient(
  getRequiredEnv('VITE_SUPABASE_URL'),
  getRequiredEnv('VITE_SUPABASE_ANON_KEY'),
)
