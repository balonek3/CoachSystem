'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Dodanie debugowania do konsoli
  useEffect(() => {
    console.log('🐛 DEBUG: Strona logowania załadowana')
    console.log('🐛 DEBUG: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🐛 DEBUG: Supabase Anon Key (pierwsze 20 znaków):', 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
    
    // Test połączenia z Supabase
    const testConnection = async () => {
      try {
        console.log('🐛 DEBUG: Testowanie połączenia z Supabase...')
        const { data, error } = await supabase.auth.getSession()
        console.log('🐛 DEBUG: Stan sesji:', data)
        if (error) {
          console.error('🐛 DEBUG: Błąd połączenia:', error)
        } else {
          console.log('🐛 DEBUG: ✅ Połączenie z Supabase działa')
        }
      } catch (err) {
        console.error('🐛 DEBUG: ❌ Krytyczny błąd połączenia:', err)
      }
    }
    
    testConnection()

    // Dodanie globalnej funkcji debugowania
    window.debugLogin = {
      testSupabase: async () => {
        console.log('🔧 TEST: Sprawdzanie konfiguracji Supabase...')
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50) + '...')
        
        try {
          const { data, error } = await supabase.auth.getSession()
          console.log('Sesja:', data)
          console.log('Błąd:', error)
        } catch (e) {
          console.error('Błąd:', e)
        }
      },
      testLogin: async (email = 'admin@example.com', password = 'admin123') => {
        console.log('🔧 TEST: Testowanie logowania...')
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          console.log('Wynik logowania:', { data, error })
        } catch (e) {
          console.error('Błąd logowania:', e)
        }
      },
      checkUser: async () => {
        console.log('🔧 TEST: Sprawdzanie aktualnego użytkownika...')
        try {
          const { data: { user } } = await supabase.auth.getUser()
          console.log('Aktualny użytkownik:', user)
        } catch (e) {
          console.error('Błąd:', e)
        }
      }
    }
    
    console.log('🔧 DOSTĘPNE FUNKCJE DEBUGOWANIA:')
    console.log('• debugLogin.testSupabase() - sprawdza konfigurację')
    console.log('• debugLogin.testLogin() - testuje logowanie')
    console.log('• debugLogin.checkUser() - sprawdza aktualnego użytkownika')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🐛 DEBUG: Rozpoczynanie logowania...')
    console.log('🐛 DEBUG: Email:', email)
    console.log('🐛 DEBUG: Hasło długość:', password.length)
    
    setLoading(true)
    setError('')

    try {
      console.log('🐛 DEBUG: Wywołanie supabase.auth.signInWithPassword...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('🐛 DEBUG: Odpowiedź z Supabase:')
      console.log('🐛 DEBUG: Data:', data)
      console.log('🐛 DEBUG: Error:', error)

      if (error) {
        console.error('🐛 DEBUG: ❌ Błąd logowania:', error.message)
        throw error
      }

      console.log('🐛 DEBUG: ✅ Logowanie udane!')
      console.log('🐛 DEBUG: User ID:', data?.user?.id)
      console.log('🐛 DEBUG: Przekierowanie do /dashboard...')
      
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('🐛 DEBUG: ❌ Catch error:', error)
      setError('Nieprawidłowy email lub hasło')
    } finally {
      setLoading(false)
      console.log('🐛 DEBUG: Logowanie zakończone (loading = false)')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Monitor Godzin Konsultacji
        </h1>
        <h2 className="text-xl text-center mb-6">Logowanie</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logowanie...' : 'Zaloguj'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          <p className="mb-2">Dane testowe:</p>
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>Klient:</strong> client@example.com / client123</p>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800 font-medium mb-1">🐛 DEBUG AKTYWNY</p>
            <p className="text-xs text-yellow-700">
              Otwórz konsolę przeglądarki (F12) dla szczegółów debugowania.
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Dostępne funkcje: debugLogin.testSupabase(), debugLogin.testLogin(), debugLogin.checkUser()
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}