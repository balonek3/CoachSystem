import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware for static files and API routes that don't need auth
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api/auth') ||
      req.nextUrl.pathname.includes('.')) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthPage = req.nextUrl.pathname === '/login'
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard')

    // Redirect to login if accessing protected page without session
    if (isProtectedPage && !session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Redirect to dashboard if logged in user tries to access login page
    if (isAuthPage && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    // If middleware fails, allow the request to continue
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}