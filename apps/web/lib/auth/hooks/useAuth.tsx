/**
 * ADAGIO - useAuth Hook
 * Hook de gestion d'authentification client (BetterAuth)
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut, signUp } from '@adagio/auth/client';
import type { User, Session } from '@adagio/auth';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const user = session?.user ?? null;

  const login = async (email: string, password: string) => {
    await signIn.email({ email, password });
  };

  const register = async (email: string, password: string, name?: string) => {
    // Better-auth requires name, so we use email as fallback if not provided
    const userName = name || email.split('@')[0] || email;
    await signUp.email({ email, password, name: userName });
  };

  const logout = async () => {
    await signOut();
  };

  const value: AuthContextValue = {
    user,
    session: session ?? null,
    isLoading: isPending,
    isAuthenticated: Boolean(user),
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Export User type for convenience
export type { User };
