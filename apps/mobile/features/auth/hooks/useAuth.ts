// ============================================================================
// USE AUTH - Authentication hook for React Native
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { authClient, isAuthenticated, getCurrentUser } from '@adagio/api-client';
import type { User } from '@adagio/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authenticated = await isAuthenticated();
      const user = await getCurrentUser();

      setState({
        user: user as User | null,
        isLoading: false,
        isAuthenticated: authenticated,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to check authentication status',
      });
    }
  }

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        setState({
          ...state,
          isLoading: false,
          error: result.error.message ?? 'Sign in failed',
        });
        return false;
      }

      const user = await getCurrentUser();
      setState({
        user: user as User | null,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return false;
    }
  }, [state]);

  const signUp = useCallback(async (email: string, password: string, name?: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: name || '',
      });

      if (result.error) {
        setState({
          ...state,
          isLoading: false,
          error: result.error.message ?? 'Sign up failed',
        });
        return false;
      }

      const user = await getCurrentUser();
      setState({
        user: user as User | null,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return false;
    }
  }, [state]);

  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authClient.signOut();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      router.replace('/(auth)/login');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to sign out',
      });
    }
  }, [state, router]);

  const refresh = useCallback(async () => {
    await checkAuth();
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refresh,
    clearError,
  };
}
