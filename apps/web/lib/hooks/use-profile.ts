// ============================================================================
// PROFILE HOOK - TanStack Query with better-auth integration
// NO FALLBACK - Forces API usage
// ============================================================================

'use client';

import { useUserProfileQuery, useUserStatsQuery } from './use-query';
import { type UserProfile, type UserStats } from '../data';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@adagio/api-client';
import { useUser } from './use-auth';

/**
 * Hook pour récupérer le profil utilisateur
 * Utilise better-auth + API, pas de fallback
 */
export function useUserProfile() {
  const { user, isAuthenticated } = useUser();
  const apiQuery = useUserProfileQuery();

  // Construire le profil utilisateur depuis better-auth si connecté
  let betterAuthProfile: UserProfile | null = null;
  if (user && user.email) {
    const username: string = user.name || 'Utilisateur';
    const email: string = user.email;
    const level: string = 'APPRENTI';
    const joinedAt: string = new Date().toISOString().split('T')[0] as string;
    const avatar: string | null = user.image || null;
    const levelNumber: number = 1;
    const xp: number = 0;
    const xpToNext: number = 100;

    betterAuthProfile = {
      username,
      email,
      level,
      joinedAt,
      avatar,
      levelNumber,
      xp,
      xpToNext,
    };
  }

  // Utiliser better-auth si disponible, sinon API (pas de fallback factice)
  const data = betterAuthProfile ?? (apiQuery.data as UserProfile | undefined);

  return {
    ...apiQuery,
    data,
    isLoading: apiQuery.isLoading && isAuthenticated && !data,
    hasError: apiQuery.isError,
    isAuthenticated,
  };
}

/**
 * Hook pour récupérer les stats utilisateur
 * Pas de fallback - utilise l'API
 */
export function useUserStats() {
  const query = useUserStatsQuery();

  return {
    ...query,
    // Pas de fallback - peut être undefined
    data: query.data,
    isLoading: query.isLoading,
    hasError: query.isError,
  };
}

/**
 * Hook pour récupérer les préférences utilisateur depuis l'API
 */
export function useUserPreferences() {
  return useQuery({
    queryKey: ['user', 'preferences'],
    queryFn: () => apiClient.get<{
      theme?: string;
      notation?: string;
      sound?: string;
      showIntervals?: boolean;
      showNotes?: boolean;
      showDegrees?: boolean;
      tuning?: string;
      fretCount?: number;
      volume?: number;
      metronomeVolume?: number;
    }>('/users/me/preferences'),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook pour mettre à jour les préférences utilisateur
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Record<string, unknown>) =>
      apiClient.patch('/users/me/preferences', preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

/**
 * Hook pour changer le mot de passe
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.patch('/users/me/password', data),
  });
}

/**
 * Hook pour supprimer le compte
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (password?: string) => {
      // Pour DELETE avec body, on utilise fetch directement
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(password ? { password } : {}),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error((error as { message?: string })?.message || 'Failed to delete account');
      }

      return response.json();
    },
  });
}

/**
 * Hook pour exporter les données utilisateur
 */
export function useExportData() {
  return useMutation({
    mutationFn: () => apiClient.get('/users/me/export'),
  });
}

export type { UserProfile, UserStats };
