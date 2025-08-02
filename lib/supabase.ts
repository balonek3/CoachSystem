// KONFIGURACJA SUPABASE DLA NEXT.JS 13+ APP ROUTER
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'

// Client Component Client (dla 'use client' komponentów)
export function createClient() {
  return createClientComponentClient()
}

// Server Component Client (dla server components)
export function createServerClient() {
  const { cookies } = require('next/headers')
  return createServerComponentClient({ cookies })
}

// Backward compatibility - domyślny export  
export const supabase = createClient()

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