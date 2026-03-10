// ============================================================================
// SHARED AUTH TYPES - Better Auth Integration
// ============================================================================

// ============================================================================
// USER & SESSION TYPES
// ============================================================================

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
};

export interface AuthSession {
  id: string;
  userId: string;
  expires: Date;
  token: string;
  user: AuthUser;
}

// ============================================================================
// TOKENS
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: 'Bearer';
}

// ============================================================================
// CREDENTIALS
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

// ============================================================================
// AUTH RESPONSES
// ============================================================================

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// ============================================================================
// BETTER AUTH ADAPTER TYPES
// ============================================================================

export interface BetterAuthAdapter {
  createUser: (data: CreateUserInput) => Promise<AuthUser>;
  findUserByEmail: (email: string) => Promise<AuthUser | null>;
  findUserById: (id: string) => Promise<AuthUser | null>;
  verifyPassword: (userId: string, password: string) => Promise<boolean>;
  createSession: (data: CreateSessionInput) => Promise<AuthSession>;
  deleteSession: (token: string) => Promise<void>;
  findSessionByToken: (token: string) => Promise<AuthSession | null>;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface CreateSessionInput {
  userId: string;
  expires: Date;
}

// ============================================================================
// PROVIDER TYPES
// ============================================================================

export type OAuthProvider = 'google' | 'github' | 'discord';

export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface OAuthAccount {
  provider: OAuthProvider;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
