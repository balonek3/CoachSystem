import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// POST /api/hours - dodaj lub odejmij godziny
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Sprawdź czy to admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Tylko admin może zarządzać godzinami' }, { status: 403 })
  }

  const body = await request.json()
  const { 
    clientId, 
    hours, 
    operation, // 'add' lub 'deduct'
    description, 
    comment,
    meetingLink,
    notesLink 
  } = body

  // Walidacja
  if (!clientId || !hours || !operation) {
    return NextResponse.json({ 
      error: 'Wymagane: clientId, hours, operation (add/deduct)' 
    }, { status: 400 })
  }

  if (hours <= 0 || hours % 0.25 !== 0) {
    return NextResponse.json({ 
      error: 'Godziny muszą być dodatnie i w wielokrotności 0.25' 
    }, { status: 400 })
  }

  try {
    // Pobierz aktualne dane klienta
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Klient nie znaleziony' }, { status: 404 })
    }

    // Oblicz zmianę
    const changeHours = operation === 'add' ? hours : -hours
    const newRemainingHours = client.remaining_hours + changeHours
    const newTotalHours = operation === 'add' 
      ? client.total_hours + hours 
      : client.total_hours

    // Sprawdź czy nie będzie ujemnych godzin
    if (newRemainingHours < 0) {
      return NextResponse.json({ 
        error: `Niewystarczająca liczba godzin. Dostępne: ${client.remaining_hours}h` 
      }, { status: 400 })
    }

    // Rozpocznij transakcję
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        total_hours: newTotalHours,
        remaining_hours: newRemainingHours
      })
      .eq('id', clientId)

    if (updateError) throw updateError

    // Dodaj wpis do historii
    const { error: historyError } = await supabase
      .from('hours_history')
      .insert({
        client_id: clientId,
        change_hours: changeHours,
        description: description || (operation === 'add' ? 'Dodano godziny' : 'Sesja konsultacyjna'),
        comment: comment || '',
        meeting_link: meetingLink || null,
        notes_link: notesLink || null,
        balance_after: newRemainingHours,
        created_by: user.id
      })

    if (historyError) throw historyError

    return NextResponse.json({
      message: 'Godziny zaktualizowane pomyślnie',
      operation,
      hours,
      newBalance: newRemainingHours
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/hours/history - pobierz historię godzin
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pobierz profil użytkownika
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  try {
    let query = supabase
      .from('hours_history')
      .select(`
        *,
        clients!inner(
          user_id,
          profiles!inner(email)
        )
      `)
      .order('created_at', { ascending: false })

    // Jeśli podano clientId, filtruj po nim
    if (clientId) {
      query = query.eq('client_id', clientId)
      
      // Sprawdź uprawnienia - klient może widzieć tylko swoją historię
      if (profile?.role !== 'admin') {
        const { data: client } = await supabase
          .from('clients')
          .select('user_id')
          .eq('id', clientId)
          .single()

        if (client?.user_id !== user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
    } else {
      // Jeśli nie podano clientId i nie jest adminem, pokaż tylko swoją historię
      if (profile?.role !== 'admin') {
        const { data: myClient } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (myClient) {
          query = query.eq('client_id', myClient.id)
        }
      }
    }

    const { data: history, error } = await query

    if (error) throw error

    // Formatuj dane
    const formattedHistory = history?.map(entry => ({
      ...entry,
      clientEmail: entry.clients.profiles.email
    }))

    return NextResponse.json(formattedHistory || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}