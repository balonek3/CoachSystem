// SZABLON KONFIGURACJI SUPABASE
// Skopiuj ten plik do: coach-system-app/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

// Te wartości znajdziesz w Supabase w Settings -> API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Typy dla TypeScript (będą używane w całej aplikacji)
export type Profile = {
  id: string
  email: string
  role: 'admin' | 'client'
  created_at: string
}

export type Client = {
  id: string
  user_id: string
  hourly_rate: number | null
  total_hours: number
  remaining_hours: number
  created_at: string
  updated_at: string
}

export type HoursHistory = {
  id: string
  client_id: string
  change_hours: number
  description: string | null
  comment: string | null
  meeting_link: string | null
  notes_link: string | null
  balance_after: number
  created_by: string
  created_at: string
}