/**
 * ADAGIO - Auth Module Barrel Export
 */

export { AuthProvider, useAuth } from './hooks/useAuth';

// Re-export User type from better-auth
export type { Session } from 'better-auth/types';
export type { User } from 'better-auth';
