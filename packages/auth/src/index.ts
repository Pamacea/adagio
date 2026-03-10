// ============================================================================
// @adagio/auth - Better Auth Integration for Adagio
// ============================================================================

// Server-side exports
export { auth, handler } from './server';
export type { Session, User } from './server';

// Shared types
export * from './types';

// Note: Client-side exports are available via '@adagio/auth/client'
// import { authClient, useSession } from '@adagio/auth/client'
