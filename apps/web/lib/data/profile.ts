// ============================================================================
// PROFILE DATA - Fallback data for user profile
// ============================================================================

export interface UserProfile {
  username: string;
  email: string;
  level: string;
  joinedAt: string;
  avatar: string | null;
  levelNumber: number;
  xp: number;
  xpToNext: number;
}

export interface UserStats {
  label: string;
  value: number;
  unit: string;
}

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface UserPreference {
  id: string;
  label: string;
  value: string;
  options: string[];
}

// Donnees factices utilisateur
export const USER_PROFILE_DATA: UserProfile = {
  username: 'MetalShredder666',
  email: 'shredder@adagio.music',
  level: 'GUITAR HERO',
  joinedAt: '2024-01-15',
  avatar: null,
  levelNumber: 42,
  xp: 3420,
  xpToNext: 580,
};

// Stats utilisateur
export const USER_STATS_DATA: UserStats[] = [
  { label: 'Sessions', value: 24, unit: 'completees' },
  { label: 'Temps', value: 47, unit: 'heures' },
  { label: 'XP', value: 3420, unit: '' },
  { label: 'Streak', value: 12, unit: 'jours' },
];

// Accomplissements
export const USER_ACHIEVEMENTS_DATA: UserAchievement[] = [
  { id: 1, title: 'Premier Riff', description: 'Completez votre premiere session', unlocked: true, icon: '🎸' },
  { id: 2, title: 'Theoricien', description: 'Maitrisez les 7 modes grecs', unlocked: true, icon: '📚' },
  { id: 3, title: 'Circle Master', description: 'Naviguez le cercle des quintes', unlocked: true, icon: '⭕' },
  { id: 4, title: 'Fretboard Explorer', description: 'Decouvrez toutes les positions', unlocked: false, icon: '🗺️' },
  { id: 5, title: 'Jazz Cat', description: 'Maitrisez le ii-V-I', unlocked: false, icon: '🎷' },
  { id: 6, title: 'Metal God', description: 'Atteignez le niveau maximum', unlocked: false, icon: '🤘' },
];

// Preferences disponibles (fallback data)
export const USER_PREFERENCES_DATA: UserPreference[] = [
  { id: 'notation', label: 'Notation', value: 'french', options: ['french', 'english'] },
  { id: 'sound', label: 'Sons', value: 'on', options: ['on', 'off'] },
  { id: 'theme', label: 'Theme', value: 'metal', options: ['metal', 'brutal'] },
];
