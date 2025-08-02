'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import AddHoursModal from '@/components/AddHoursModal'
import DeductHoursModal from '@/components/DeductHoursModal'

type ClientDetails = {
  id: string
  user_id: string
  hourly_rate: number | null
  total_hours: number
  remaining_hours: number
  email: string
}

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

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<ClientDetails | null>(null)
  const [history, setHistory] = useState<HoursEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editRate, setEditRate] = useState(false)
  const [newRate, setNewRate] = useState('')
  const [showAddHours, setShowAddHours] = useState(false)
  const [showDeductHours, setShowDeductHours] = useState(false)

  useEffect(() => {
    loadClientData()
  }, [clientId])

  const loadClientData = async () => {
    try {
      // Pobierz dane klienta
      const clientResponse = await fetch(`/api/clients/${clientId}`)
      if (!clientResponse.ok) throw new Error('Błąd pobierania danych')
      const clientData = await clientResponse.json()
      setClient(clientData)
      setNewRate(clientData.hourly_rate?.toString() || '')

      // Pobierz historię
      const historyResponse = await fetch(`/api/hours/history?clientId=${clientId}`)
      if (!historyResponse.ok) throw new Error('Błąd pobierania historii')
      const historyData = await historyResponse.json()
      setHistory(historyData)
    } catch (error) {
      console.error('Error:', error)
      router.push('/dashboard/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRate = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hourlyRate: parseFloat(newRate) || null
        })
      })

      if (!response.ok) throw new Error('Błąd aktualizacji')
      
      setEditRate(false)
      loadClientData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  if (!client) {
    return <div className="flex justify-center items-center h-screen">Klient nie znaleziony</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Powrót
          </button>
          <h1 className="text-3xl font-bold">Szczegóły Klienta</h1>
        </div>
      </div>

      {/* Informacje o kliencie */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Dane Klienta</h2>
            <p className="mb-2"><strong>Email:</strong> {client.email}</p>
            <div className="mb-2">
              <strong>Stawka godzinowa:</strong> 
              {editRate ? (
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    step="0.01"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded mr-2"
                    style={{ width: '100px' }}
                  />
                  <button
                    onClick={handleUpdateRate}
                    className="text-green-600 hover:text-green-700 mr-2"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setEditRate(false)
                      setNewRate(client.hourly_rate?.toString() || '')
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <span className="ml-2">
                  {client.hourly_rate ? `${client.hourly_rate} PLN/h` : 'Nie ustalono'} 
                  <button
                    onClick={() => setEditRate(true)}
                    className="ml-2 text-blue-600 hover:text-blue-700"
                  >
                    Edytuj
                  </button>
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Podsumowanie Godzin</h2>
            <div className="space-y-2">
              <p><strong>Godziny łącznie:</strong> {client.total_hours.toFixed(2)}h</p>
              <p>
                <strong>Godziny pozostałe:</strong> 
                <span className={client.remaining_hours < 5 ? ' text-red-600 font-semibold' : ''}>
                  {' '}{client.remaining_hours.toFixed(2)}h
                </span>
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setShowAddHours(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  + Dodaj Godziny
                </button>
                <button
                  onClick={() => setShowDeductHours(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  - Odejmij Godziny
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historia godzin */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historia Godzin</h2>
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
                  Komentarz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linki
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
                    {formatDate(entry.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={entry.change_hours > 0 ? 'text-green-600' : 'text-red-600'}>
                      {entry.change_hours > 0 ? '+' : ''}{entry.change_hours.toFixed(2)}h
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {entry.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {entry.comment || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      {entry.meeting_link && (
                        <a href={entry.meeting_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          Spotkanie
                        </a>
                      )}
                      {entry.notes_link && (
                        <a href={entry.notes_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          Notatki
                        </a>
                      )}
                      {!entry.meeting_link && !entry.notes_link && '-'}
                    </div>
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

      {/* Modale */}
      {showAddHours && client && (
        <AddHoursModal
          client={client}
          onClose={() => setShowAddHours(false)}
          onSuccess={() => {
            setShowAddHours(false)
            loadClientData()
          }}
        />
      )}

      {showDeductHours && client && (
        <DeductHoursModal
          client={client}
          onClose={() => setShowDeductHours(false)}
          onSuccess={() => {
            setShowDeductHours(false)
            loadClientData()
          }}
        />
      )}
    </div>
  )
}