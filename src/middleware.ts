import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  if (pathname === '/login' && token) {
    // Redirect authenticated users trying to access the login page to the dashboard
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/add-apartment')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if (pathname.startsWith('/add-land')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if (pathname.startsWith('/edit-apartment')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/edit-land')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/edit-commercial')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if (pathname.startsWith('/add-commercial')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/metros')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/districts')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/users')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/info')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if(pathname.startsWith('/change-log')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  // Allow requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/login',
    '/add-apartment/:path*', // Matches /add-apartment and any subpaths
    '/add-land/:path*',      // Matches /add-land and any subpaths
    '/add-commercial/:path*', // Matches /add-commercial and any subpaths
    '/edit-apartment/:path*', // Matches /edit-apartment and any subpaths
    '/edit-land/:path*', // Matches /edit-land and any subpaths
    '/edit-commercial/:path*', // Matches /edit-commercial and any subpaths
    '/metros/:path*', // Matches /metros and any subpaths
    '/districts/:path*', // Matches /districts and any subpaths
    '/users/:path*', // Matches /users and any subpaths
    '/info/:path*', // Matches /info and any subpaths
    '/change-log/:path*', // Matches /change-log and any subpaths
  ],
};
