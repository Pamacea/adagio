// ============================================================================
// BETTER-AUTH SERVER CONFIGURATION
// ============================================================================
//
// This module configures Better Auth for server-side usage with Prisma.
// It provides the auth instance, handler, and type inference.
//
// Usage:
// ```ts
// import { auth } from '@adagio/auth';
// ```
// ============================================================================

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@adagio/database';

/**
 * Better Auth server instance configuration
 *
 * Features:
 * - Email/password authentication
 * - OAuth providers (Google, GitHub) - optional
 * - Session management (7-day expiration)
 * - Password reset flows (email sending to be implemented)
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Base URL for the application
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL || 'http://localhost:3000',

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      // TODO: Implement email sending logic (e.g., Resend, SendGrid)
      console.log('Verification email:', { email: user.email, url });
    },
    sendResetPasswordEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      // TODO: Implement email sending logic
      console.log('Reset password email:', { email: user.email, url });
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Advanced options
  advanced: {
    generateId: () => {
      // Use UUID for consistent ID generation
      return crypto.randomUUID();
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Social providers - GitHub, Discord (enabled when env vars are set)
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    },
  },

  // Security - trusted origins for CORS
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.WEB_URL || '',
    process.env.MOBILE_URL || '',
  ].filter(Boolean) as string[],
});

// ============================================================================
// HANDLER EXPORT
// ============================================================================

/**
 * Better Auth handler for API routes
 *
 * The handler is a function that handles all auth requests.
 *
 * Usage in Next.js:
 * ```ts
 * // app/api/auth/[...all]/route.ts
 * import { auth } from '@adagio/auth';
 * export const { GET, POST } = auth.handler;
 * ```
 */
export const handler = auth.handler;
export const authHandler = auth.handler;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Infer Session and User types from Better Auth
 */
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
