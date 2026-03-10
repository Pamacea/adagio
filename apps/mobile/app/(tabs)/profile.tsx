// ============================================================================
// PROFILE SCREEN - User profile, settings, and achievements
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  TrophyIcon,
  SettingsIcon,
  UserIcon,
  GuitarIcon,
  InfoIcon,
  ChevronRightIcon,
  MetalCard,
  MetalCardWithHeader,
} from '@/components';
import { Colors, Spacing, Typography, FontWeights } from '@/theme';
import { authClient, getCurrentUser, apiClient } from '@adagio/api-client';
import type { User, UserPreferences } from '@adagio/types';

interface MenuItem {
  id: string;
  title: string;
  titleFrench: string;
  icon: React.ReactNode;
  action?: () => void;
  rightElement?: React.ReactNode;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData as unknown as User);
      }
      // Preferences would be loaded from API
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  async function handleLogout() {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await authClient.signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }

  const menuItems: MenuItem[] = [
    {
      id: 'achievements',
      title: 'Achievements',
      titleFrench: 'SUCCÈS',
      icon: <TrophyIcon size={20} color={Colors.acidGreen} />,
      action: () => router.push('/achievements'),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      titleFrench: 'PRÉFÉRENCES',
      icon: <SettingsIcon size={20} color={Colors.acidGreen} />,
      action: () => router.push('/(tabs)/preferences'),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      id: 'theme',
      title: 'Dark Mode',
      titleFrench: 'MODE SOMBRE',
      icon: <InfoIcon size={20} color={Colors.gray500} />,
      rightElement: (
        <View style={styles.toggleIndicator}>
          <View style={styles.toggleDot} />
        </View>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      titleFrench: 'NOTIFICATIONS',
      icon: <InfoIcon size={20} color={Colors.gray500} />,
      rightElement: (
        <View style={styles.toggleIndicator}>
          <View style={styles.toggleDot} />
        </View>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon size={40} color={Colors.black} />
        </View>
        <Text style={styles.name}>
          {user?.name || 'MUSICIEN'}
        </Text>
        <Text style={styles.email}>{user?.email || 'guest@adagio.app'}</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>NIVEAU</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>SÉRIE</Text>
        </View>
      </View>

      {/* Menu Items */}
      <Text style={styles.sectionTitle}>COMPTE</Text>
      {menuItems.map((item) => (
        <MetalCardWithHeader
          key={item.id}
          title={item.titleFrench}
          icon={item.icon}
          right={<ChevronRightIcon size={20} color={Colors.gray600} />}
          onPress={item.action}
          style={styles.menuCard}
        />
      ))}

      {/* Settings */}
      <Text style={styles.sectionTitle}>PARAMÈTRES</Text>
      {settingsItems.map((item) => (
        <View key={item.id} style={styles.settingsItem}>
          <View style={styles.settingsItemLeft}>
            {item.icon}
            <Text style={styles.settingsTitle}>{item.titleFrench}</Text>
          </View>
          {item.rightElement}
        </View>
      ))}

      {/* Info */}
      <Text style={styles.sectionTitle}>À PROPOS</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>Version 0.2.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>ADAGIO - Music Theory for Metalheads</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>DÉCONNEXION</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.acidGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: Typography.bodyMD,
    color: Colors.gray500,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.acidGreen,
  },
  statLabel: {
    fontSize: Typography.labelLG,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray700,
  },
  sectionTitle: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  menuCard: {
    marginBottom: Spacing.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsTitle: {
    fontSize: Typography.bodyMD,
    color: Colors.gray300,
  },
  toggleIndicator: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray800,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.acidGreen,
  },
  infoContainer: {
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoItem: {
    paddingVertical: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.bodySM,
    color: Colors.gray500,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoutButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.danger,
    letterSpacing: 1,
  },
});
