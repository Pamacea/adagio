'use client';

/**
 * Adagio - API Query Hooks
 * TanStack Query hooks for API endpoints
 */

import { apiClient } from '@adagio/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Theory hooks
export function useModes(feeling?: string) {
  return useQuery({
    queryKey: ['theory', 'modes', feeling],
    queryFn: () => apiClient.get(`/theory/modes${feeling ? `?feeling=${feeling}` : ''}`),
    staleTime: 1000 * 60 * 60, // 1 hour - static data
  });
}

export function useMode(slug: string) {
  return useQuery({
    queryKey: ['theory', 'mode', slug],
    queryFn: () => apiClient.get(`/theory/modes/${slug}`),
    enabled: !!slug,
    staleTime: 1000 * 60 * 60,
  });
}

export function useKeys() {
  return useQuery({
    queryKey: ['theory', 'keys'],
    queryFn: () => apiClient.get('/theory/keys'),
    staleTime: 1000 * 60 * 60,
  });
}

export function useScales() {
  return useQuery({
    queryKey: ['theory', 'scales'],
    queryFn: () => apiClient.get('/theory/scales'),
    staleTime: 1000 * 60 * 60,
  });
}

export function useChords(root?: string, quality?: string) {
  return useQuery({
    queryKey: ['theory', 'chords', root, quality],
    queryFn: () =>
      apiClient.get(
        `/theory/chords${root ? `?root=${root}` : ''}${quality ? `&quality=${quality}` : ''}`
      ),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCircleOfFifths(center?: string) {
  return useQuery({
    queryKey: ['theory', 'circle-of-fifths', center],
    queryFn: () =>
      apiClient.get(`/theory/circle-of-fifths${center ? `?center=${center}` : ''}`),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAxisTheory() {
  return useQuery({
    queryKey: ['theory', 'axis-theory'],
    queryFn: () => apiClient.get('/theory/axis-theory'),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAnalyzeProgression() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { progression: string[]; key?: string }) =>
      apiClient.post('/theory/analyze', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theory'] });
    },
  });
}

// Library hooks
export function useTechniques(category?: string, difficulty?: string) {
  return useQuery({
    queryKey: ['library', 'techniques', category, difficulty],
    queryFn: () =>
      apiClient.get(
        `/library/techniques${category ? `?category=${category}` : ''}${
          difficulty ? `&difficulty=${difficulty}` : ''
        }`
      ),
    staleTime: 1000 * 60 * 30,
  });
}

export function useTechnique(id: string) {
  return useQuery({
    queryKey: ['library', 'technique', id],
    queryFn: () => apiClient.get(`/library/techniques/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

export function useMarkAsLearned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (techniqueId: string) =>
      apiClient.post(`/library/techniques/${techniqueId}/learn`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}

// Progress hooks
export function useSaveProgression() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      key: string;
      timeSignature: string;
      chords: unknown[];
    }) => apiClient.post('/progress/progressions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'progressions'] });
    },
  });
}

export function useCompleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ progressionId, milestoneId }: { progressionId: string; milestoneId: string }) =>
      apiClient.post(`/progress/progressions/${progressionId}/complete-milestone`, { milestoneId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}

// ============================================================================
// LESSONS HOOKS (Internal API hooks - use via use-lessons.ts instead)
// ============================================================================

export interface LessonResponse {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  duration: number;
  xp: number;
  topics?: string[];
  order: number;
  progress?: {
    status: string;
    currentSection: number;
    completedSections: string[];
    xp: number;
    startedAt?: string;
    completedAt?: string;
    lastAccessed?: string;
  } | null;
}

export function useLessonsQuery() {
  return useQuery<LessonResponse[]>({
    queryKey: ['lessons'],
    queryFn: () => apiClient.get<LessonResponse[]>('/lessons'),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useLessonQuery(id: string) {
  return useQuery<LessonResponse>({
    queryKey: ['lessons', id],
    queryFn: () => apiClient.get<LessonResponse>(`/lessons/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useUpdateLessonProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, progress }: { lessonId: string; progress: number }) =>
      apiClient.patch(`/lessons/${lessonId}/progress`, { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}

// ============================================================================
// ACHIEVEMENTS HOOKS (Internal API hooks - use via use-achievements.ts instead)
// ============================================================================

export interface AchievementResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  target: number;
  rarity: string;
  icon?: string;
}

export function useAchievementsQuery() {
  return useQuery<AchievementResponse[]>({
    queryKey: ['achievements'],
    queryFn: () => apiClient.get<AchievementResponse[]>('/achievements'),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export interface UserAchievementResponse {
  id: string;
  progress: number;
  target: number;
  unlockedAt?: string;
  completedAt?: string;
  achievement: AchievementResponse;
}

export function useUserAchievementsQuery() {
  return useQuery<UserAchievementResponse[]>({
    queryKey: ['user', 'achievements'],
    queryFn: () => apiClient.get<UserAchievementResponse[]>('/achievements/user'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUnlockAchievementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievementId: string) =>
      apiClient.post(`/achievements/${achievementId}/unlock`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}

// ============================================================================
// USER PROFILE HOOKS (Internal API hooks - use via use-user.ts instead)
// ============================================================================

export interface UserProfileResponse {
  id: string;
  email: string;
  name?: string;
  image?: string;
  preferences?: {
    theme?: string;
    totalXP?: number;
    level?: number;
  };
}

export function useUserProfileQuery() {
  return useQuery<UserProfileResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.get<UserProfileResponse>('/users/me'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export interface UserStatsResponse {
  xp: {
    total: number;
    level: number;
    currentLevelXP: number;
    xpToNextLevel: number;
    progressPercent: number;
  };
  techniques: {
    total: number;
    learned: number;
    mastered: number;
    inProgress: number;
    completionPercent: number;
  };
  lessons: {
    total: number;
    completed: number;
    inProgress: number;
    completionPercent: number;
  };
  achievements: {
    total: number;
    unlocked: number;
    completionPercent: number;
  };
  practice: {
    totalSessions: number;
    totalHours: number;
    avgSessionMinutes: number;
    streak: number;
    thisWeek: { sessions: number; minutes: number };
    thisMonth: { sessions: number; minutes: number };
  };
}

export function useUserStatsQuery() {
  return useQuery<UserStatsResponse>({
    queryKey: ['user', 'stats'],
    queryFn: () => apiClient.get<UserStatsResponse>('/users/me/stats'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; preferences?: Record<string, unknown> }) =>
      apiClient.patch('/users/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
