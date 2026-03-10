// ============================================================================
// LESSONS HOOK - TanStack Query - NO FALLBACK
// ============================================================================

'use client';

import { useLessonsQuery, useLessonQuery, useUpdateLessonProgressMutation } from './use-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@adagio/api-client';
import { type Lesson } from '../data';

/**
 * Hook pour récupérer les leçons
 * Pas de fallback - utilise l'API
 */
export function useLessons() {
  const query = useLessonsQuery();

  return {
    ...query,
    data: query.data as Lesson[] | undefined,
    isLoading: query.isLoading,
    hasError: query.isError,
  };
}

/**
 * Hook pour récupérer une leçon spécifique
 */
export function useLesson(id: string) {
  const query = useLessonQuery(id);

  return {
    ...query,
    data: query.data as Lesson | undefined,
  };
}

/**
 * Hook pour mettre à jour la progression d'une leçon
 */
export function useUpdateLessonProgress() {
  return useUpdateLessonProgressMutation();
}

/**
 * Hook pour récupérer les sessions (leçons avec progression)
 * Format compatible avec la page sessions
 * Pas de fallback - utilise l'API
 */
export function useSessions(category?: string, level?: string) {
  return useQuery({
    queryKey: ['lessons', 'with-progress', category, level],
    queryFn: async () => {
      // Récupérer les leçons filtrées
      const lessons = await apiClient.get<{
        id: string;
        slug: string;
        title: string;
        description?: string;
        category: string;
        level: string;
        duration: number;
        xp: number;
        progress?: {
          status: string;
          currentSection: number;
          completedSections: string[];
          xp: number;
          startedAt?: string;
          completedAt?: string;
          lastAccessed?: string;
        } | null;
      }[]>(`/lessons${category ? `?category=${category}` : ''}${level ? `&level=${level}` : ''}`);

      // Transformer au format attendu par la page sessions
      return lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        category: lesson.category,
        level: lesson.level,
        duration: `${lesson.duration} min`,
        xp: lesson.xp,
        completed: lesson.progress?.status === 'completed',
        progress: lesson.progress?.status === 'completed'
          ? 100
          : lesson.progress?.status === 'in-progress'
            ? Math.round((lesson.progress.currentSection / 5) * 100) // Estimation
            : 0,
        lastAccessed: lesson.progress?.lastAccessed,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook pour récupérer les stats de sessions (XP total, temps, etc.)
 */
export function useSessionsStats() {
  return useQuery({
    queryKey: ['user', 'sessions-stats'],
    queryFn: () => apiClient.get('/users/me/stats'),
    staleTime: 1000 * 60 * 5,
  });
}
