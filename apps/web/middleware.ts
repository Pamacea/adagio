/**
 * ADAGIO - Middleware
 * Protection des routes et authentification
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes publiques (ne nécessitent pas d'authentification)
 */
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/warning',
  '/theory',
  '/theory/chords',
  '/theory/modes',
  '/theory/scales',
  '/theory/circle',
  '/fretboard',
  '/notation',
  '/compose',
];

/**
 * Routes protégées (nécessitent une authentification)
 */
const protectedRoutes = [
  '/profile',
  '/sessions',
  '/lessons',
  '/achievements',
  '/settings',
];

/**
 * Routes d'authentification (redirection si déjà connecté)
 */
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Check if user is authenticated
  const isAuthenticated = Boolean(sessionToken);

  // Note: We allow authenticated users to access login/register pages
  // They will see a "You're already logged in" message or logout option

  // Redirect unauthenticated users to login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
