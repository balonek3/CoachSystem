import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/clients - pobierz listę klientów (tylko admin)
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Sprawdź autoryzację
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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Pobierz listę klientów
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      *,
      profiles!inner(email)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Formatuj dane
  const formattedClients = clients?.map(client => ({
    ...client,
    email: client.profiles.email
  }))

  return NextResponse.json(formattedClients)
}

// POST /api/clients - dodaj nowego klienta (tylko admin)
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Sprawdź autoryzację
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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Pobierz dane z requestu
  const body = await request.json()
  const { email, password, initialHours, hourlyRate } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email i hasło są wymagane' }, { status: 400 })
  }

  try {
    // Utwórz użytkownika w Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) throw authError

    // Profil i klient zostaną utworzone automatycznie przez trigger
    // Ale musimy zaktualizować dane
    if (initialHours || hourlyRate) {
      // Poczekaj chwilę aż trigger się wykona
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Zaktualizuj dane klienta
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          total_hours: initialHours || 0,
          remaining_hours: initialHours || 0,
          hourly_rate: hourlyRate
        })
        .eq('user_id', authData.user.id)

      if (updateError) throw updateError

      // Dodaj wpis do historii jeśli były początkowe godziny
      if (initialHours > 0) {
        await supabase
          .from('hours_history')
          .insert({
            client_id: authData.user.id,
            change_hours: initialHours,
            description: 'Początkowe przypisanie godzin',
            balance_after: initialHours,
            created_by: user.id
          })
      }
    }

    return NextResponse.json({ 
      message: 'Klient utworzony pomyślnie',
      userId: authData.user.id 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}