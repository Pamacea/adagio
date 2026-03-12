/**
 * ADAGIO - Proxy Next.js 16
 *
 * Next.js 16 remplace middleware.ts par proxy.js
 * Ce fichier gère:
 * 1. L'authentification et la protection des routes
 * 2. Le proxy vers le backend NestJS
 * 3. Les headers de sécurité
 *
 * Avantages de proxy.js vs middleware.ts:
 * - Meilleure sémantique (reflète le pattern de proxy)
 * - Support natif pour le proxying vers backends externes
 * - Gestion unifiée des interceptions
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// CONFIGURATION
// ============================================================================

const BACKEND_URL = process.env.NESTJS_API_URL || 'http://localhost:3001';

/**
 * Routes publiques (ne nécessitent pas d'authentification)
 */
const publicRoutes = new Set([
  '/',
  '/login',
  '/register',
  '/warning',
  '/theory',
  '/theory/chords',
  '/theory/modes',
  '/theory/scales',
  '/theory/circle',
  '/theory/triades',
  '/fretboard',
  '/notation',
  '/compose',
]);

/**
 * Routes protégées (nécessitent une authentification)
 */
const protectedRoutes = new Set([
  '/profile',
  '/sessions',
  '/lessons',
  '/achievements',
  '/settings',
]);

/**
 * Routes exclues du proxy (gérées par better-auth ou fichiers statiques)
 */
const excludedRoutes = [
  '/api/auth', // better-auth gère ses propres routes
  '/_next', // fichiers Next.js
];

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Vérifie si un chemin est exclu du proxy
 */
function isExcluded(pathname: string): boolean {
  return excludedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route est protégée
 */
function isProtectedRoute(pathname: string): boolean {
  return Array.from(protectedRoutes).some(route => pathname.startsWith(route));
}

/**
 * Vérifie si c'est une requête API vers le backend NestJS
 */
function isBackendProxy(pathname: string): boolean {
  return pathname.startsWith('/api/v1/');
}

/**
 * Vérifie si c'est un fichier statique
 */
function isStaticAsset(pathname: string): boolean {
  return pathname.includes('.');
}

// ============================================================================
// PROXY VERS LE BACKEND NESTJS
// ============================================================================

/**
 * Proxy les requêtes /api/v1/* vers le backend NestJS
 */
async function proxyToBackend(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname}${url.search}`;

  // Cloner les headers et ajouter des headers de forwarding
  const headers = new Headers(request.headers);
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

  try {
    // Forwarder la requête au backend NestJS
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      // @ts-ignore - duplex est requis pour Node 18+ avec streaming
      duplex: 'half',
    });

    // Cloner les headers de réponse
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('X-Forwarded-By', 'Next.js 16 Proxy');

    // Retourner la réponse
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Backend unavailable' },
      { status: 503 }
    );
  }
}

// ============================================================================
// AUTHENTIFICATION ET PROTECTION DES ROUTES
// ============================================================================

/**
 * Vérifie l'authentification et redirige si nécessaire
 */
function handleAuthentication(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const isAuthenticated = Boolean(sessionToken);

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null; // Pas de redirection nécessaire
}

// ============================================================================
// HEADERS DE SÉCURITÉ
// ============================================================================

/**
 * Ajoute les headers de sécurité à la réponse
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  return response;
}

// ============================================================================
// PROXY PRINCIPAL (Next.js 16)
// ============================================================================

/**
 * Point d'entrée principal du proxy Next.js 16
 *
 * Cette fonction remplace le middleware.ts de Next.js 15
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclure les fichiers statiques et routes gérées ailleurs
  if (isStaticAsset(pathname) || isExcluded(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // 2. Proxy vers le backend NestJS pour /api/v1/*
  if (isBackendProxy(pathname)) {
    return proxyToBackend(request);
  }

  // 3. Vérifier l'authentification pour les routes protégées
  const authRedirect = handleAuthentication(request);
  if (authRedirect) {
    return authRedirect;
  }

  // 4. Continuer normalement avec headers de sécurité
  return addSecurityHeaders(NextResponse.next());
}

// ============================================================================
// CONFIGURATION DU PROXY
// ============================================================================

/**
 * Configuration du proxy
 *
 * Définit les routes pour lesquelles le proxy s'exécute.
 * Next.js 16 détecte automatiquement cette configuration.
 */
export const config = {
  /*
   * Match toutes les routes sauf:
   * - _next/static (fichiers statiques Next.js)
   * - _next/image (optimisation d'images)
   * - favicon.ico (favicon)
   * - fichiers avec extensions (images, fonts, etc.)
   */
  route: '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
};
