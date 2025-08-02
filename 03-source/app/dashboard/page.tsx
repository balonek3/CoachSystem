import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './admin/page'
import ClientDashboard from './client/page'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Pobierz profil użytkownika
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // Jeśli profil nie istnieje, utwórz go
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email!,
      role: 'client'
    })
    redirect('/dashboard/client')
  }

  // Przekieruj do odpowiedniego panelu
  if (profile.role === 'admin') {
    return <AdminDashboard />
  } else {
    return <ClientDashboard />
  }
}