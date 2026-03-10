// ============================================================================
// HOME SCREEN - Main dashboard showing progress and quick actions
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MusicIcon,
  UserIcon,
  GuitarIcon,
  LibraryIcon,
  NoteIcon,
  TrophyIcon,
  ChevronRightIcon,
  MetalCard,
  MetalCardWithHeader,
} from '@/components';
import { Colors, Spacing, Typography, FontWeights } from '@/theme';
import { getCurrentUser } from '@adagio/api-client';
import { apiClient } from '@adagio/api-client';

const { width } = Dimensions.get('window');

interface ProgressData {
  xp: number;
  level: number;
  streak: number;
  sessionsThisWeek: number;
  minutesPracticed: number;
}

interface QuickAction {
  id: string;
  title: string;
  titleFrench: string;
  route: string;
  icon: React.ReactNode;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Explore Modes',
    titleFrench: 'MODES',
    route: '/(tabs)/theory',
    icon: <MusicIcon size={28} color={Colors.acidGreen} />,
  },
  {
    id: '2',
    title: 'Compose',
    titleFrench: 'COMPOSITEUR',
    route: '/(tabs)/composer',
    icon: <NoteIcon size={28} color={Colors.acidGreen} />,
  },
  {
    id: '3',
    title: 'Fretboard',
    titleFrench: 'MANCHE',
    route: '/(tabs)/fretboard',
    icon: <GuitarIcon size={28} color={Colors.acidGreen} />,
  },
  {
    id: '4',
    title: 'Library',
    titleFrench: 'GRIMOIRE',
    route: '/(tabs)/grimoire',
    icon: <LibraryIcon size={28} color={Colors.acidGreen} />,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [progress, setProgress] = useState<ProgressData>({
    xp: 0,
    level: 1,
    streak: 0,
    sessionsThisWeek: 0,
    minutesPracticed: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      // Load progress data
      const progressData = await apiClient.getProgress();
      if (progressData) {
        setProgress(progressData as ProgressData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  const xpToNextLevel = progress.level * 100;
  const xpProgress = (progress.xp / xpToNextLevel) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            {user?.name ? `SALUT ${user.name.split(' ')[0]?.toUpperCase() || ''}!` : 'SALUT!'}
          </Text>
          <Text style={styles.subtitle}>PRÊT À PRATIQUER?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <UserIcon size={20} color={Colors.gray400} />
        </TouchableOpacity>
      </View>

      {/* Level Card */}
      <MetalCard variant="accent" style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelLabel}>NIVEAU ACTUEL</Text>
            <Text style={styles.levelNumber}>{progress.level}</Text>
          </View>
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>
              {progress.xp} / {xpToNextLevel} XP
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
        </View>
      </MetalCard>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>🔥</Text>
          </View>
          <Text style={styles.statValue}>{progress.streak}</Text>
          <Text style={styles.statLabel}>SÉRIE</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📅</Text>
          </View>
          <Text style={styles.statValue}>{progress.sessionsThisWeek}</Text>
          <Text style={styles.statLabel}>SEMAINE</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>⏱️</Text>
          </View>
          <Text style={styles.statValue}>{progress.minutesPracticed}</Text>
          <Text style={styles.statLabel}>MINUTES</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>ACCÈS RAPIDE</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.actionIconContainer}>{action.icon}</View>
            <Text style={styles.actionTitle}>{action.titleFrench}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Challenge */}
      <Text style={styles.sectionTitle}>DÉFI QUOTIDIEN</Text>
      <MetalCardWithHeader
        title="II-V-I dans toutes les tonalités"
        subtitle="Progression: 3/12"
        right={<TrophyIcon size={20} color={Colors.acidGreen} />}
        onPress={() => router.push('/(tabs)/composer')}
      >
        <View style={styles.challengeProgress}>
          <View style={styles.challengeProgressBar}>
            <View style={styles.challengeProgressFill} />
          </View>
          <Text style={styles.challengeProgressText}>25% complété</Text>
        </View>
      </MetalCardWithHeader>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>CONTINUER L'APPRENTISSAGE</Text>
      <MetalCardWithHeader
        title="Modes de la gamme majeure"
        subtitle="En cours • 60%"
        right={<ChevronRightIcon size={20} color={Colors.gray600} />}
        onPress={() => router.push('/(tabs)/theory')}
      />

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>ADAGIO</Text>
        <Text style={styles.footerSubtext}>Music Theory for Metalheads</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: Typography.bodyMD,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  profileButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCard: {
    marginBottom: Spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelLabel: {
    fontSize: Typography.labelLG,
    color: Colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levelNumber: {
    fontSize: 36,
    fontWeight: FontWeights.black,
    color: Colors.black,
  },
  xpContainer: {
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  xpText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.black,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: Spacing.xs,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  statLabel: {
    fontSize: Typography.labelLG,
    color: Colors.gray500,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  actionIconContainer: {
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
    textAlign: 'center',
  },
  challengeProgress: {
    marginTop: Spacing.sm,
  },
  challengeProgressBar: {
    height: 4,
    backgroundColor: Colors.gray800,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  challengeProgressFill: {
    width: '25%',
    height: '100%',
    backgroundColor: Colors.acidGreen,
  },
  challengeProgressText: {
    fontSize: Typography.labelLG,
    color: Colors.gray500,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.black,
    color: Colors.gray800,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  footerSubtext: {
    fontSize: Typography.bodySM,
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
});
