// ============================================================================
// BETTER AUTH CLIENT - Re-export from @adagio/auth
// ============================================================================

/**
 * Better Auth client for Adagio
 *
 * This module re-exports the better-auth client from @adagio/auth package.
 * Better-auth handles:
 * - Email/password authentication
 * - OAuth providers (Google, GitHub)
 * - Session management
 * - Password reset
 *
 * @see packages/auth/src/client.ts for implementation
 */

export { authClient, isAuthenticated, getCurrentUser } from '@adagio/auth/client';

// Re-export types from better-auth for convenience
export type { Session, User } from 'better-auth';
