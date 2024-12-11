import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const { pathname } = req.nextUrl

  if (pathname === '/login' && token) {
    // Redirect authenticated users trying to access the login page to the dashboard
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (
    (pathname === '/') && !token
  ) {
    // Redirect unauthenticated users trying to access protected routes to the login page
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if( pathname.startsWith('/add-property')){
    if(!token){
      return NextResponse.redirect(new URL('404', req.url))
    }
  }

  // Allow requests to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', 
    '/login',
    '/add-property', 
  ],
}
