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
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if( pathname.startsWith('/add-apartment')){
    if(!token){
      return NextResponse.redirect(new URL('404', req.url))
    }
  }

  if( pathname.startsWith('/add-land')){
    if(!token){
      return NextResponse.redirect(new URL('404', req.url))
    }
  }

  if( pathname.startsWith('/add-commercial')){
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
    '/add-apartment',
    '/add-land',
    '/add-commercial',
  ],
}
