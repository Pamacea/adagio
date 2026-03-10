// ============================================================================
// BETTER-AUTH CLIENT - Adagio
// ============================================================================
//
// This module exports the Better Auth client for client-side authentication.
//
// Usage:
// ```tsx
// import { authClient, useSession, signIn, signOut } from '@adagio/auth/client';
//
// // In a component
// const { data: session, isPending } = useSession();
//
// // In event handlers
// await signIn.email({ email, password });
// await signOut();
// ```
// ============================================================================

import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client instance for Adagio
 *
 * Uses relative URL on client-side for same-origin requests,
 * and falls back to environment variables on server-side.
 */
export const authClient = createAuthClient({
  baseURL: (() => {
    // @ts-ignore - window exists in web environments
    return typeof window !== 'undefined'
      ? '' // Use relative path on client
      : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  })(),
});

// Export commonly used methods and hooks for convenience
export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;

/**
 * Helper to check if user is authenticated (server-side utility)
 *
 * @example
 * ```ts
 * import { isAuthenticated } from '@adagio/auth/client';
 *
 * const isAuth = await isAuthenticated();
 * ```
 */
export const isAuthenticated = async () => {
  const session = await authClient.getSession();
  return !!session.data;
};

/**
 * Helper to get current user (server-side utility)
 *
 * @example
 * ```ts
 * import { getCurrentUser } from '@adagio/auth/client';
 *
 * const user = await getCurrentUser();
 * ```
 */
export const getCurrentUser = async () => {
  const session = await authClient.getSession();
  return session.data?.user ?? null;
};

// Re-export Session and User types from better-auth for convenience
export type { Session, User } from 'better-auth';
