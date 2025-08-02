'use client'

import { useState } from 'react'

type DeductHoursModalProps = {
  client: {
    id: string
    email: string
    remaining_hours: number
  }
  onClose: () => void
  onSuccess: () => void
}

export default function DeductHoursModal({ client, onClose, onSuccess }: DeductHoursModalProps) {
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')
  const [notesLink, setNotesLink] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          hours: parseFloat(hours),
          operation: 'deduct',
          description,
          notesLink: notesLink || null,
          meetingLink: meetingLink || null,
          comment
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Wystąpił błąd')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          Odejmij godziny dla {client.email}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Dostępne godziny: <strong>{client.remaining_hours.toFixed(2)}h</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liczba godzin do odjęcia
            </label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              max={client.remaining_hours}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="np. 2.5"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis sesji
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="np. Sesja konsultacyjna - projekt X"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do spotkania (opcjonalnie)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="np. https://meet.google.com/..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do notatek (opcjonalnie)
            </label>
            <input
              type="url"
              value={notesLink}
              onChange={(e) => setNotesLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="np. https://docs.google.com/..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentarz wewnętrzny (opcjonalnie)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Notatki widoczne tylko dla admina"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Odejmowanie...' : 'Odejmij Godziny'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}