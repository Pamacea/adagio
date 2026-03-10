// ============================================================================
// ACHIEVEMENTS SCREEN - User achievements and badges
// ============================================================================

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '@adagio/api-client';
import type {
  AchievementCategory,
  AchievementRarity,
  UserAchievement,
} from '@adagio/types';

type FilterType = 'all' | AchievementCategory | 'unlocked';

const CATEGORIES: AchievementCategory[] = [
  'progression',
  'discovery',
  'practice',
  'mastery',
  'social',
  'milestone',
];

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  progression: '🎼',
  discovery: '🔍',
  practice: '🎸',
  mastery: '🏆',
  social: '👥',
  milestone: '⭐',
};

const CATEGORY_NAMES: Record<AchievementCategory, string> = {
  progression: 'Progression',
  discovery: 'Discovery',
  practice: 'Practice',
  mastery: 'Mastery',
  social: 'Social',
  milestone: 'Milestone',
};

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#fbbf24',
};

const RARITY_BORDER: Record<AchievementRarity, string> = {
  common: '#6b7280',
  rare: '#2563eb',
  epic: '#7c3aed',
  legendary: '#f59e0b',
};

// Mock achievement data for UI demonstration
const MOCK_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: '1',
    userId: 'user1',
    achievementId: 'first-progression',
    unlockedAt: new Date(),
    progress: 1,
    target: 1,
    achievement: {
      title: 'First Steps',
      description: 'Create your first chord progression',
      icon: '🎵',
      rarity: 'common',
      category: 'progression',
      xp: 10,
    },
  },
  {
    id: '2',
    userId: 'user1',
    achievementId: 'modes-explorer',
    unlockedAt: new Date(),
    progress: 3,
    target: 7,
    achievement: {
      title: 'Modes Explorer',
      description: 'Discover all 7 church modes',
      icon: '🗺️',
      rarity: 'rare',
      category: 'discovery',
      xp: 50,
    },
  },
  {
    id: '3',
    userId: 'user1',
    achievementId: 'week-streak',
    unlockedAt: new Date(),
    progress: 5,
    target: 7,
    achievement: {
      title: 'Dedicated',
      description: 'Practice for 7 days in a row',
      icon: '🔥',
      rarity: 'epic',
      category: 'practice',
      xp: 100,
    },
  },
  {
    id: '4',
    userId: 'user1',
    achievementId: 'circle-master',
    unlockedAt: undefined as unknown as Date,
    progress: 0,
    target: 12,
    achievement: {
      title: 'Circle Master',
      description: 'Master the circle of fifths in all 12 keys',
      icon: '⭕',
      rarity: 'legendary',
      category: 'mastery',
      xp: 500,
    },
  },
];

export default function AchievementsScreen() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<UserAchievement[]>(MOCK_ACHIEVEMENTS);
  const [filtered, setFiltered] = useState<UserAchievement[]>(MOCK_ACHIEVEMENTS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [filter, achievements]);

  async function loadAchievements() {
    setIsLoading(true);
    try {
      // In real app, fetch from API
      // const data = await apiClient.getAchievements();
      // setAchievements(data);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function applyFilters() {
    let result = [...achievements];

    if (filter === 'unlocked') {
      result = result.filter((a) => a.progress >= a.target);
    } else if (filter !== 'all') {
      result = result.filter((a) => a.achievement.category === filter);
    }

    setFiltered(result);
  }

  function getProgressPercentage(item: UserAchievement): number {
    return Math.min(100, Math.round((item.progress / item.target) * 100));
  }

  function getUnlockedCount(): number {
    return achievements.filter((a) => a.progress >= a.target).length;
  }

  function getTotalXP(): number {
    return achievements
      .filter((a) => a.progress >= a.target)
      .reduce((sum, a) => sum + a.achievement.xp, 0);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{getUnlockedCount()}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{achievements.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{getTotalXP()}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <TouchableOpacity
          style={[styles.categoryTab, filter === 'all' && styles.categoryTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.categoryTabText, filter === 'all' && styles.categoryTabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, filter === 'unlocked' && styles.categoryTabActive]}
          onPress={() => setFilter('unlocked')}
        >
          <Text
            style={[styles.categoryTabText, filter === 'unlocked' && styles.categoryTabTextActive]}
          >
            ✓ Unlocked
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryTab, filter === cat && styles.categoryTabActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={styles.categoryTabIcon}>{CATEGORY_ICONS[cat]}</Text>
            <Text
              style={[styles.categoryTabText, filter === cat && styles.categoryTabTextActive]}
            >
              {CATEGORY_NAMES[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>No achievements found</Text>
            <Text style={styles.emptyText}>Try a different filter category</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const isUnlocked = item.progress >= item.target;
            const progress = getProgressPercentage(item);
            const rarity = item.achievement.rarity;

            return (
              <View
                key={item.id}
                style={[
                  styles.achievementCard,
                  isUnlocked && styles.achievementCardUnlocked,
                  { borderColor: RARITY_BORDER[rarity] },
                ]}
              >
                <View style={styles.achievementHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      isUnlocked && styles.iconContainerUnlocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.achievementIcon,
                        !isUnlocked && styles.achievementIconLocked,
                      ]}
                    >
                      {item.achievement.icon}
                    </Text>
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        !isUnlocked && styles.achievementTitleLocked,
                      ]}
                    >
                      {item.achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {item.achievement.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.rarityBadge,
                      { backgroundColor: RARITY_COLORS[rarity] },
                    ]}
                  >
                    <Text style={styles.rarityText}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress}%`, backgroundColor: RARITY_COLORS[rarity] },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {item.progress}/{item.target}
                  </Text>
                </View>

                {/* XP Reward */}
                <View style={styles.xpReward}>
                  <Text style={styles.xpText}>+{item.achievement.xp} XP</Text>
                  {isUnlocked && (
                    <Text style={styles.unlockedText}>✓ Unlocked</Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a05',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#fbbf24',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1a',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fbbf24',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2a2a25',
  },
  categoryScroll: {
    maxHeight: 60,
    marginTop: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1f1f1a',
  },
  categoryTabActive: {
    backgroundColor: '#fbbf24',
  },
  categoryTabIcon: {
    fontSize: 14,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  categoryTabTextActive: {
    color: '#0a0a05',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f3f4f6',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  achievementCard: {
    backgroundColor: '#1f1f1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    opacity: 0.6,
  },
  achievementCardUnlocked: {
    opacity: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2a2a25',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerUnlocked: {
    backgroundColor: '#fbbf24',
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementIconLocked: {
    filter: 'grayscale(100%)',
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#6b7280',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#0a0a05',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  xpReward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  unlockedText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
});
