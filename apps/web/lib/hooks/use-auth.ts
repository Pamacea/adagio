// ============================================================================
// BETTER-AUTH REACT HOOKS - Adagio Web
// ============================================================================
//
// React hooks for authentication using better-auth and TanStack Query.
// These hooks use relative URLs for Next.js same-origin requests.
//
// Usage:
// ```tsx
// import { useUser, useSignIn, useSignOut, useSocialSignIn } from '@/lib/hooks';
//
// const { user, isAuthenticated } = useUser();
// const signIn = useSignIn();
// ```
// ============================================================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authClient } from '@adagio/auth/client';

// ============================================================================
// HOOKS
// ============================================================================

/**
 * useSession - Get current session
 *
 * @example
 * ```tsx
 * const { data: session, isLoading, error } = useSession();
 * ```
 */
export function useSession() {
  return authClient.useSession();
}

/**
 * useUser - Get current user with authentication status
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useUser();
 * ```
 */
export function useUser() {
  const session = useSession();

  return {
    user: session.data?.user,
    isAuthenticated: !!session.data?.user,
    isLoading: session.isPending,
    isRefetching: session.isRefetching,
    error: session.error,
    refetch: session.refetch,
  };
}

/**
 * useSignIn - Sign in with email/password
 *
 * @example
 * ```tsx
 * const signIn = useSignIn();
 *
 * const handleLogin = async () => {
 *   await signIn.mutateAsync({ email, password });
 * };
 * ```
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authClient.signIn.email(credentials);
      if (response.error) {
        throw new Error(response.error.message || 'Sign in failed');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/profile');
    },
  });
}

/**
 * useSignUp - Sign up with email/password
 *
 * @example
 * ```tsx
 * const signUp = useSignUp();
 *
 * const handleRegister = async () => {
 *   await signUp.mutateAsync({ email, password, name });
 * };
 * ```
 */
export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; name?: string }) => {
      const response = await authClient.signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || '',
      });
      if (response.error) {
        throw new Error(response.error.message || 'Sign up failed');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/profile');
    },
  });
}

/**
 * useSignOut - Sign out current user
 *
 * @example
 * ```tsx
 * const signOut = useSignOut();
 *
 * const handleLogout = async () => {
 *   await signOut.mutateAsync();
 * };
 * ```
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await authClient.signOut();
      if (response.error) {
        throw new Error(response.error.message || 'Sign out failed');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/');
    },
  });
}

/**
 * useSocialSignIn - Sign in with OAuth provider (GitHub, Discord)
 *
 * @example
 * ```tsx
 * const socialSignIn = useSocialSignIn();
 *
 * const handleGitHubLogin = () => {
 *   socialSignIn.mutate({ provider: 'github' });
 * };
 * ```
 */
export function useSocialSignIn() {
  return useMutation({
    mutationFn: async ({ provider, callbackURL }: { provider: 'github' | 'discord'; callbackURL?: string }) => {
      const response = await authClient.signIn.social({
        provider,
        callbackURL: callbackURL || window.location.href,
      });
      if (response.error) {
        throw new Error(response.error.message || 'OAuth sign in failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

// ============================================================================
// TYPE RE-EXPORTS
// ============================================================================

export type { Session, User } from 'better-auth';
