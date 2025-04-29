// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';
  
  // Check for the dedicated auth-token cookie
  const isAuthenticated = request.cookies.has('auth-token');
  
  console.log('Middleware running for path:', request.nextUrl.pathname);
  console.log('Auth token cookie exists:', isAuthenticated);

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/reports/:path*',
  ]
};