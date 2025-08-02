import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './admin/page'
import ClientDashboard from './client/page'

export default async function DashboardPage() {
  console.log('🔍 DASHBOARD DEBUG: Rozpoczynam sprawdzanie użytkownika...')
  
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  console.log('🔍 DASHBOARD DEBUG: Wynik getUser():', { user: user?.email, error: userError })
  
  if (!user) {
    console.log('🔍 DASHBOARD DEBUG: ❌ Brak użytkownika - przekierowanie do /login')
    redirect('/login')
  }

  console.log('🔍 DASHBOARD DEBUG: ✅ Użytkownik znaleziony:', user.email)

  // Pobierz profil użytkownika
  console.log('🔍 DASHBOARD DEBUG: Sprawdzam profil dla user.id:', user.id)
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  console.log('🔍 DASHBOARD DEBUG: Wynik profiles query:', { profile, error: profileError })

  if (!profile) {
    console.log('🔍 DASHBOARD DEBUG: ❌ Brak profilu - tworzę nowy...')
    // Jeśli profil nie istnieje, utwórz go
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email!,
      role: 'client'
    })
    
    console.log('🔍 DASHBOARD DEBUG: Wynik insert profilu:', { error: insertError })
    
    if (!insertError) {
      console.log('🔍 DASHBOARD DEBUG: ✅ Profil utworzony - przekierowanie do /dashboard/client')
      redirect('/dashboard/client')
    }
    
    // Jeśli wystąpił błąd przy tworzeniu profilu, przekieruj do logowania
    console.log('🔍 DASHBOARD DEBUG: ❌ Błąd przy tworzeniu profilu - przekierowanie do /login')
    redirect('/login')
  }

  console.log('🔍 DASHBOARD DEBUG: ✅ Profil znaleziony, rola:', profile.role)

  // Przekieruj do odpowiedniego panelu
  if (profile.role === 'admin') {
    console.log('🔍 DASHBOARD DEBUG: Renderuję AdminDashboard')
    return <AdminDashboard />
  } else {
    console.log('🔍 DASHBOARD DEBUG: Renderuję ClientDashboard')
    return <ClientDashboard />
  }
}