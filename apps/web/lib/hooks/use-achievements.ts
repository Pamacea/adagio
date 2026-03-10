// ============================================================================
// ACHIEVEMENTS HOOK - TanStack Query - NO FALLBACK
// ============================================================================

'use client';

import { useAchievementsQuery, useUserAchievementsQuery, useUnlockAchievementMutation } from './use-query';
import { type Achievement } from '../data';

/**
 * Hook pour récupérer les définitions d'achievements
 * Pas de fallback - utilise l'API
 */
export function useAchievements() {
  const query = useAchievementsQuery();

  return {
    ...query,
    data: query.data as Achievement[] | undefined,
    isLoading: query.isLoading,
    hasError: query.isError,
  };
}

/**
 * Hook pour récupérer les achievements de l'utilisateur
 * Pas de fallback - utilise l'API
 */
export function useUserAchievements() {
  const query = useUserAchievementsQuery();

  return {
    ...query,
    data: query.data as Achievement[] | undefined,
    isLoading: query.isLoading,
    hasError: query.isError,
  };
}

/**
 * Hook pour débloquer un achievement
 */
export function useUnlockAchievement() {
  return useUnlockAchievementMutation();
}

/**
 * Hook pour récupérer les stats d'achievements
 */
export function useAchievementStats() {
  const { data: achievements } = useAchievements();

  if (!achievements || achievements.length === 0) {
    return {
      totalAchievements: 0,
      unlockedAchievements: 0,
      totalXP: 0,
      maxXP: 0,
      completionPercentage: 0,
      byRarity: {} as Record<string, number>,
      byCategory: {} as Record<string, { total: number; unlocked: number }>,
    };
  }

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const maxXP = achievements.reduce((sum, a) => sum + a.xp, 0);
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  // Count by rarity
  const byRarity = achievements.reduce((acc, a) => {
    acc[a.rarity] = (acc[a.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count by category
  const byCategory = achievements.reduce((acc, a) => {
    const unlocked = a.unlocked ? 1 : 0;
    const cat = acc[a.category] || { total: 0, unlocked: 0 };
    cat.total++;
    cat.unlocked += unlocked;
    acc[a.category] = cat;
    return acc;
  }, {} as Record<string, { total: number; unlocked: number }>);

  return {
    totalAchievements,
    unlockedAchievements,
    totalXP,
    maxXP,
    completionPercentage,
    byRarity,
    byCategory,
  };
}
