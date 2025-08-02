import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jeśli użytkownik nie jest zalogowany i próbuje wejść na chronioną stronę
  if (!user && (req.nextUrl.pathname.startsWith('/dashboard') || 
                req.nextUrl.pathname.startsWith('/api'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Jeśli użytkownik jest zalogowany i próbuje wejść na stronę logowania
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}