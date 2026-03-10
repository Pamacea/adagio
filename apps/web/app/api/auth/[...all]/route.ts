// ============================================================================
// BETTER-AUTH API HANDLER - Next.js App Router
// ============================================================================
//
// This route handles all Better Auth requests using the Next.js App Router
// pattern. All authentication endpoints are proxied through this handler.
//
// Endpoints include:
// - POST   /api/auth/sign-up/email     - Register with email/password
// - POST   /api/auth/sign-in/email     - Login with email/password
// - POST   /api/auth/sign-out          - Logout
// - GET    /api/auth/get-session       - Get current session
// - POST   /api/auth/reset-password    - Request password reset
// - GET    /api/auth/oauth/*           - OAuth flows
// ============================================================================

import { auth } from '@adagio/auth';

/**
 * Handler for GET requests
 */
export async function GET(request: Request) {
  return auth.handler(request);
}

/**
 * Handler for POST requests
 */
export async function POST(request: Request) {
  return auth.handler(request);
}
