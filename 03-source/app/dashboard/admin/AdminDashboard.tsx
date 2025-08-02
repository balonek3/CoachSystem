'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddHoursModal from '@/components/AddHoursModal'
import DeductHoursModal from '@/components/DeductHoursModal'

type ClientData = {
  id: string
  user_id: string
  hourly_rate: number | null
  total_hours: number
  remaining_hours: number
  email: string
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null)
  const router = useRouter()

  // Modale
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddHoursModal, setShowAddHoursModal] = useState(false)
  const [showDeductHoursModal, setShowDeductHoursModal] = useState(false)
  
  // Formularz dodawania klienta
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPassword, setNewClientPassword] = useState('')
  const [newClientHours, setNewClientHours] = useState('')
  const [newClientRate, setNewClientRate] = useState('')
  const [addClientLoading, setAddClientLoading] = useState(false)
  const [addClientError, setAddClientError] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Błąd pobierania danych')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddClientLoading(true)
    setAddClientError('')

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newClientEmail,
          password: newClientPassword,
          initialHours: parseFloat(newClientHours) || 0,
          hourlyRate: parseFloat(newClientRate) || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd dodawania klienta')
      }

      // Reset formularza
      setNewClientEmail('')
      setNewClientPassword('')
      setNewClientHours('')
      setNewClientRate('')
      setShowAddModal(false)
      
      // Odśwież listę
      loadClients()
    } catch (error: any) {
      setAddClientError(error.message)
    } finally {
      setAddClientLoading(false)
    }
  }

  const openAddHours = (client: ClientData) => {
    setSelectedClient(client)
    setShowAddHoursModal(true)
  }

  const openDeductHours = (client: ClientData) => {
    setSelectedClient(client)
    setShowDeductHoursModal(true)
  }

  const handleHoursSuccess = () => {
    loadClients()
    setShowAddHoursModal(false)
    setShowDeductHoursModal(false)
    setSelectedClient(null)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel Administratora</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Wyloguj
        </button>
      </div>

      {/* Progress bar kontekstu */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          🟢 Kontekst: [████░░░░░░░░░░░░░░░░] 35% | Wszystko OK ✅
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista Klientów ({clients.length})</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Dodaj Klienta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stawka (PLN/h)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Godziny Łącznie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Godziny Pozostałe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.hourly_rate ? `${client.hourly_rate} PLN` : 'Nie ustalono'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.total_hours.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={client.remaining_hours < 5 ? 'text-red-600 font-semibold' : ''}>
                      {client.remaining_hours.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => router.push(`/dashboard/admin/client/${client.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Szczegóły
                    </button>
                    <button 
                      onClick={() => openAddHours(client)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      + Godziny
                    </button>
                    <button 
                      onClick={() => openDeductHours(client)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      - Godziny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && (
            <p className="text-center py-8 text-gray-500">Brak klientów. Dodaj pierwszego klienta.</p>
          )}
        </div>
      </div>

      {/* Modal dodawania klienta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Dodaj Nowego Klienta</h3>
            <form onSubmit={handleAddClient}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Klienta
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="klient@example.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło
                </label>
                <input
                  type="password"
                  value={newClientPassword}
                  onChange={(e) => setNewClientPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Minimum 6 znaków"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Początkowe Godziny (opcjonalnie)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={newClientHours}
                  onChange={(e) => setNewClientHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="np. 10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stawka (PLN/h) - opcjonalnie
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newClientRate}
                  onChange={(e) => setNewClientRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="np. 150"
                />
              </div>

              {addClientError && (
                <div className="mb-4 text-red-600 text-sm">
                  {addClientError}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setAddClientError('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={addClientLoading}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={addClientLoading}
                >
                  {addClientLoading ? 'Dodawanie...' : 'Dodaj Klienta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale godzin */}
      {showAddHoursModal && selectedClient && (
        <AddHoursModal
          client={selectedClient}
          onClose={() => {
            setShowAddHoursModal(false)
            setSelectedClient(null)
          }}
          onSuccess={handleHoursSuccess}
        />
      )}

      {showDeductHoursModal && selectedClient && (
        <DeductHoursModal
          client={selectedClient}
          onClose={() => {
            setShowDeductHoursModal(false)
            setSelectedClient(null)
          }}
          onSuccess={handleHoursSuccess}
        />
      )}
    </div>
  )
}