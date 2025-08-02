'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type HoursEntry = {
  id: string
  change_hours: number
  description: string
  comment: string
  meeting_link: string
  notes_link: string
  balance_after: number
  created_at: string
}

export default function ClientDashboard() {
  const [clientData, setClientData] = useState<any>(null)
  const [history, setHistory] = useState<HoursEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadClientData()
  }, [])

  const loadClientData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Pobierz dane klienta
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (clientError) throw clientError
      setClientData(client)

      // Pobierz historię godzin
      const { data: historyData, error: historyError } = await supabase
        .from('hours_history')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      if (historyError) throw historyError
      setHistory(historyData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel Klienta</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Wyloguj
        </button>
      </div>

      {/* Podsumowanie godzin */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Podsumowanie Godzin</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Całkowita liczba godzin</p>
            <p className="text-2xl font-bold text-blue-600">
              {clientData?.total_hours.toFixed(2) || '0.00'}h
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Pozostałe godziny</p>
            <p className="text-2xl font-bold text-green-600">
              {clientData?.remaining_hours.toFixed(2) || '0.00'}h
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600">Stawka godzinowa</p>
            <p className="text-2xl font-bold text-yellow-600">
              {clientData?.hourly_rate ? `${clientData.hourly_rate} PLN` : 'Nie ustalono'}
            </p>
          </div>
        </div>
      </div>

      {/* Historia godzin */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historia Wykorzystania Godzin</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zmiana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notatki
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo po
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(entry.created_at).toLocaleDateString('pl-PL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={entry.change_hours > 0 ? 'text-green-600' : 'text-red-600'}>
                      {entry.change_hours > 0 ? '+' : ''}{entry.change_hours.toFixed(2)}h
                    </span>
                  </td>
                  <td className="px-6 py-4">{entry.description || '-'}</td>
                  <td className="px-6 py-4">
                    {entry.notes_link && (
                      <a href={entry.notes_link} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        Link
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.balance_after.toFixed(2)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <p className="text-center py-8 text-gray-500">Brak historii operacji</p>
          )}
        </div>
      </div>
    </div>
  )
}