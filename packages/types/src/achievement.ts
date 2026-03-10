// ============================================================================
// ACHIEVEMENT TYPES - Achievements, badges, and gamification
// ============================================================================

/**
 * Achievement categories
 */
export type AchievementCategory =
  | 'progression'  // Created progressions, composed music
  | 'discovery'    // Discovered modes, scales, chords
  | 'practice'     // Practice consistency, time spent
  | 'mastery'      // Mastered techniques, modes
  | 'social'       // Shared progressions, community
  | 'milestone';   // Special milestones

/**
 * Achievement rarity
 */
export type AchievementRarity =
  | 'common'     // Easy to unlock
  | 'rare'       // Requires some effort
  | 'epic'       // Significant dedication
  | 'legendary'; // Extraordinary achievement

/**
 * Achievement definition (template)
 */
export interface AchievementDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string; // SVG icon or emoji

  // Unlock criteria
  criteria: AchievementCriteria;

  // Rewards
  xp: number;
  badge?: string; // Badge ID to award

  // Metadata
  isHidden: boolean; // Hidden until unlocked
  sortOrder: number;
}

/**
 * Achievement unlock criteria
 */
export interface AchievementCriteria {
  type: 'count' | 'streak' | 'total' | 'boolean' | 'collection';

  // Target value
  target: number;

  // What to measure
  metric: AchievementMetric;

  // Additional filters
  filters?: Record<string, unknown>;
}

/**
 * Measurable metrics for achievements
 */
export type AchievementMetric =
  // Progression
  | 'progressions_created'
  | 'progressions_shared'
  | 'unique_chords_used'

  // Discovery
  | 'modes_discovered'
  | 'scales_learned'
  | 'chords_learned'
  | 'notes_practiced'

  // Practice
  | 'practice_sessions_total'
  | 'practice_days_streak'
  | 'practice_minutes_total'

  // Mastery
  | 'techniques_mastered'
  | 'modes_mastered'
  | 'perfect_scores'

  // Social
  | 'progressions_liked'
  | 'comments_given'

  // Milestones
  | 'achievements_unlocked';

/**
 * User's unlocked achievement
 */
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;

  // Progress for incomplete achievements
  progress: number;
  target: number;

  // Achievement data (denormalized for display)
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: AchievementRarity;
    category: AchievementCategory;
    xp: number;
  };
}

/**
 * Achievement progress for tracking
 */
export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

/**
 * User stats summary for profile
 */
export interface UserStats {
  // Progressions
  progressionsCreated: number;
  progressionsShared: number;
  uniqueChordsUsed: number;

  // Discovery
  modesDiscovered: number;
  scalesLearned: number;
  chordsLearned: number;
  notesPracticed: number;

  // Practice
  practiceSessionsTotal: number;
  practiceDaysStreak: number;
  practiceMinutesTotal: number;

  // Mastery
  techniquesMastered: number;
  modesMastered: number;

  // Achievements
  achievementsUnlocked: number;
  achievementsTotal: number;
  totalXP: number;
}

/**
 * Badge definition
 */
export interface BadgeDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  requiredAchievements: string[]; // Achievement IDs required
}

/**
 * User's earned badge
 */
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;

  // Badge data (denormalized)
  badge: {
    name: string;
    description: string;
    icon: string;
    rarity: AchievementRarity;
  };
}

/**
 * Achievement notification payload
 */
export interface AchievementNotification {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xp: number;
  unlockedAt: Date;
}
