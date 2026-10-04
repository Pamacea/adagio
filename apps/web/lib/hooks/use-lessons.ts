// ============================================================================
// LESSONS HOOK - TanStack Query with static fallback
// ============================================================================

'use client';

import { useLessonsQuery, useLessonQuery, useUpdateLessonProgressMutation } from './use-query';
import { type Lesson, LESSONS_DATA } from '../data';

/**
 * Hook pour récupérer les leçons
 * Fallback sur les données statiques si l'API échoue ou retourne vide
 */
export function useLessons() {
  const query = useLessonsQuery();

  const data = query.data && query.data.length > 0 ? (query.data as Lesson[]) : LESSONS_DATA;

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
