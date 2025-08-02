import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/clients/[id] - pobierz dane klienta
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
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

  // Pobierz dane klienta
  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      *,
      profiles!inner(email, role)
    `)
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Klient nie znaleziony' }, { status: 404 })
  }

  // Sprawdź uprawnienia
  if (profile?.role !== 'admin' && client.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formattedClient = {
    ...client,
    email: client.profiles.email
  }

  return NextResponse.json(formattedClient)
}

// PATCH /api/clients/[id] - aktualizuj dane klienta (tylko admin)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { hourlyRate, password } = body

  try {
    // Aktualizuj stawkę godzinową
    if (hourlyRate !== undefined) {
      const { error } = await supabase
        .from('clients')
        .update({ hourly_rate: hourlyRate })
        .eq('id', params.id)

      if (error) throw error
    }

    // Aktualizuj hasło jeśli podane
    if (password) {
      // Najpierw pobierz user_id klienta
      const { data: client } = await supabase
        .from('clients')
        .select('user_id')
        .eq('id', params.id)
        .single()

      if (client) {
        const { error } = await supabase.auth.admin.updateUserById(
          client.user_id,
          { password }
        )
        if (error) throw error
      }
    }

    return NextResponse.json({ message: 'Dane zaktualizowane pomyślnie' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/clients/[id] - usuń klienta (tylko admin)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Pobierz user_id klienta
    const { data: client } = await supabase
      .from('clients')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!client) {
      return NextResponse.json({ error: 'Klient nie znaleziony' }, { status: 404 })
    }

    // Usuń użytkownika (kaskadowo usunie też profil, klienta i historię)
    const { error } = await supabase.auth.admin.deleteUser(client.user_id)
    if (error) throw error

    return NextResponse.json({ message: 'Klient usunięty pomyślnie' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}