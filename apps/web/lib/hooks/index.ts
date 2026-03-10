// ============================================================================
// HOOKS - Barrel Export
// ============================================================================

// Auth hooks - Uses @adagio/auth/client with relative URLs for Next.js
export {
  useSession,
  useUser,
  useSignIn,
  useSignUp,
  useSignOut,
  useSocialSignIn,
} from './use-auth';
export type { Session, User } from './use-auth';

// Better-auth client and utilities (direct re-export)
export {
  authClient,
  signIn,
  signOut,
  signUp,
  isAuthenticated,
  getCurrentUser,
} from '@adagio/auth/client';

// Profile hooks
export * from './use-profile';

// Preferences hooks (with offline-first fallback)
export * from './use-preferences';

// API Query hooks (TanStack Query)
export * from './use-query';
export * from './use-api';

// User hooks
export * from './use-user';

// Lessons hooks (with fallback)
export * from './use-lessons';

// Achievements hooks (with fallback)
export * from './use-achievements';
