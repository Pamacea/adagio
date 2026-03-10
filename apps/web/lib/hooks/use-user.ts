'use client';

/**
 * Adagio - User Hook
 * User profile and preferences management
 */

import { apiClient } from '@adagio/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserProfileQuery, useUserStatsQuery, useUpdateProfileMutation } from './use-query';

/**
 * Get user profile
 */
export function useProfile() {
  return useUserProfileQuery();
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  return useUpdateProfileMutation();
}

/**
 * Get user stats (including XP, level, practice time)
 */
export function useStats() {
  return useUserStatsQuery();
}

/**
 * Get user progress
 */
export function useProgress() {
  return useQuery<{
    xp?: number;
    practiceCount?: number;
    totalPracticeTime?: number;
    milestonesCompleted?: string[];
  }>({
    queryKey: ['user', 'progress'],
    queryFn: () => apiClient.get('/users/me/progress'),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get user saved progressions
 */
export function useProgressions() {
  return useQuery<Array<{
    id: string;
    name?: string;
    key: string;
    timeSignature: string;
    chords: unknown[];
    isFavorite?: boolean;
    createdAt: string | Date;
  }>>({
    queryKey: ['user', 'progressions'],
    queryFn: () => apiClient.get('/users/me/progressions'),
    staleTime: 1000 * 60 * 5,
  });
}
