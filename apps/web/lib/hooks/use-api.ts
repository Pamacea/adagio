// ============================================================================
// ADAGIO - API Query Hooks (Barrel Export)
// ============================================================================
//
// Ce fichier ré-exporte tous les hooks TanStack Query pour l'API Adagio.
// Point d'entrée unique pour tous les hooks de data fetching.
//
// Usage:
// ```tsx
// import { useLessons, useAchievements, useUserProfile } from '@/lib/hooks/use-api';
// ```
// ============================================================================

'use client';

// Theory hooks
export {
  useModes,
  useMode,
  useKeys,
  useScales,
  useChords,
  useCircleOfFifths,
  useAxisTheory,
  useAnalyzeProgression,
} from './use-query';

// Library hooks
export {
  useTechniques,
  useTechnique,
  useMarkAsLearned,
} from './use-query';

// Progress hooks
export {
  useSaveProgression,
  useCompleteMilestone,
} from './use-query';

// Lessons hooks
export {
  useLessonsQuery,
  useLessonQuery,
  useUpdateLessonProgressMutation,
} from './use-query';

// Achievements hooks
export {
  useAchievementsQuery,
  useUserAchievementsQuery,
  useUnlockAchievementMutation,
} from './use-query';

// User profile hooks
export {
  useUserProfileQuery,
  useUserStatsQuery,
  useUpdateProfileMutation,
} from './use-query';

// Re-export types from use-query
export type {
  LessonResponse,
  AchievementResponse,
  UserAchievementResponse,
  UserProfileResponse,
  UserStatsResponse,
} from './use-query';
