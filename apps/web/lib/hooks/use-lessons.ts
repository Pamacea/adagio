// ============================================================================
// LESSONS HOOK - TanStack Query with static fallback
// ============================================================================

'use client';

import { useLessonsQuery, useLessonQuery, useUpdateLessonProgressMutation } from './use-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@adagio/api-client';
import { type Lesson, LESSONS_DATA } from '../data';

/**
 * Hook pour récupérer les leçons
 * Fallback sur les données statiques si l'API échoue ou retourne vide
 */
export function useLessons() {
  const query = useLessonsQuery();

  const data = (query.data && query.data.length > 0)
    ? query.data as Lesson[]
    : LESSONS_DATA;

  return {
    ...query,
    data,
    isLoading: query.isLoading && !LESSONS_DATA.length,
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
 * Fallback sur les données statiques
 */
export function useSessions(category?: string, level?: string) {
  return useQuery({
    queryKey: ['lessons', 'with-progress', category, level],
    queryFn: async () => {
      try {
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

        if (lessons.length > 0) {
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
                ? Math.round((lesson.progress.currentSection / 5) * 100)
                : 0,
            lastAccessed: lesson.progress?.lastAccessed,
          }));
        }
      } catch {
        // Fallback below
      }

      // Fallback sur les données statiques
      return LESSONS_DATA
        .filter(l => (!category || l.category === category) && (!level || l.level === level))
        .map(l => ({
          id: l.id,
          title: l.title,
          category: l.category,
          level: l.level,
          duration: `${l.duration} min`,
          xp: l.xp,
          completed: l.progress?.status === 'completed' || false,
          progress: l.progress?.status === 'completed'
            ? 100
            : l.progress?.status === 'in-progress'
              ? Math.round(((l.progress?.currentSection ?? 0) / 5) * 100)
              : 0,
          lastAccessed: l.progress?.lastAccessed,
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
