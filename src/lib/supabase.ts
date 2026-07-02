import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project values.'
  )
}

// No generated/hand-rolled Database generic — row shapes are typed per-hook
// via src/types/database.ts, which is simpler to keep in sync by hand for
// this small a schema than satisfying supabase-js's full Database contract.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
