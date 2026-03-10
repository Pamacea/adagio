// ============================================================================
// PREFERENCES SCREEN - User preferences and settings
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useState } from 'react';
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
  SettingsIcon,
  BackIcon,
  CheckIcon,
  MetalCard,
  MetalCardWithHeader,
} from '../../components';
import { Toggle } from '../../components';
import { Colors, Spacing, Typography, FontWeights } from '../../theme';
import type { Tuning } from '@adagio/types';

const TUNINGS: Tuning[] = [
  'EADGBE', // Standard
  'DADGBE', // Drop D
  'DADGAD', // DADGAD
  'DGDGBD', // Open G
  'DADF#AD', // Open D
  'CGCGCE', // Open C
  'BEADGB', // Baritone
];

const TUNING_NAMES: Record<Tuning, string> = {
  'EADGBE': 'Standard',
  'DADGBE': 'Drop D',
  'DADGAD': 'DADGAD',
  'DGDGBD': 'Open G',
  'DADF#AD': 'Open D',
  'CGCGCE': 'Open C',
  'BEADGB': 'Baritone',
};

interface Preferences {
  theme: 'midnight' | 'light' | 'auto';
  showIntervals: boolean;
  showNotes: boolean;
  showDegrees: boolean;
  tuning: Tuning;
  fretCount: number;
  volume: number;
  metronomeVolume: number;
}

export default function PreferencesScreen() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'midnight',
    showIntervals: true,
    showNotes: true,
    showDegrees: false,
    tuning: 'EADGBE',
    fretCount: 24,
    volume: 0.7,
    metronomeVolume: 0.5,
  });

  const [hasChanges, setHasChanges] = useState(false);

  function updatePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  function handleSave() {
    // Save to API
    console.log('Saving preferences:', preferences);
    Alert.alert('Succès', 'Préférences sauvegardées!');
    setHasChanges(false);
    router.back();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon size={24} color={Colors.gray400} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <SettingsIcon size={20} color={Colors.gray600} />
          <Text style={styles.headerTitle}>PRÉFÉRENCES</Text>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerButton, hasChanges && styles.headerButtonActive]}>
            SAUVER
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Display Section */}
        <Text style={styles.sectionTitle}>AFFICHAGE</Text>
        <MetalCard variant="default">
          <SettingRow
            label="Mode Sombre"
            value={preferences.theme === 'midnight'}
            onValueChange={(v) => updatePreference('theme', v ? 'midnight' : 'light')}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Afficher les Intervalles"
            value={preferences.showIntervals}
            onValueChange={(v) => updatePreference('showIntervals', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Afficher les Noms de Notes"
            value={preferences.showNotes}
            onValueChange={(v) => updatePreference('showNotes', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Afficher les Degrés"
            value={preferences.showDegrees}
            onValueChange={(v) => updatePreference('showDegrees', v)}
          />
        </MetalCard>

        {/* Instrument Section */}
        <Text style={styles.sectionTitle}>INSTRUMENT</Text>
        <MetalCard variant="default">
          <Text style={styles.selectorLabel}>ACCORDAGE</Text>
          <View style={styles.tuningGrid}>
            {TUNINGS.map((tuning) => (
              <TouchableOpacity
                key={tuning}
                style={[
                  styles.tuningButton,
                  preferences.tuning === tuning && styles.tuningButtonActive,
                ]}
                onPress={() => updatePreference('tuning', tuning)}
              >
                <Text
                  style={[
                    styles.tuningCode,
                    preferences.tuning === tuning && styles.tuningCodeActive,
                  ]}
                >
                  {tuning}
                </Text>
                <Text
                  style={[
                    styles.tuningName,
                    preferences.tuning === tuning && styles.tuningNameActive,
                  ]}
                >
                  {TUNING_NAMES[tuning]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.selectorLabel}>NOMBRE DE FRETS</Text>
          <View style={styles.fretOptions}>
            {[12, 15, 17, 21, 24].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.fretOption,
                  preferences.fretCount === count && styles.fretOptionActive,
                ]}
                onPress={() => updatePreference('fretCount', count)}
              >
                <Text
                  style={[
                    styles.fretOptionText,
                    preferences.fretCount === count && styles.fretOptionTextActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MetalCard>

        {/* Audio Section */}
        <Text style={styles.sectionTitle}>AUDIO</Text>
        <MetalCard variant="default">
          <Text style={styles.volumeLabel}>
            VOLUME PRINCIPAL: {Math.round(preferences.volume * 100)}%
          </Text>
          <View style={styles.volumeSlider}>
            {[0, 0.25, 0.5, 0.75, 1].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.volumeStep,
                  preferences.volume >= val && styles.volumeStepActive,
                ]}
                onPress={() => updatePreference('volume', val)}
              >
                <Text
                  style={[
                    styles.volumeStepText,
                    preferences.volume >= val && styles.volumeStepTextActive,
                  ]}
                >
                  {Math.round(val * 100)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.volumeLabel}>
            MÉTRONOME: {Math.round(preferences.metronomeVolume * 100)}%
          </Text>
          <View style={styles.volumeSlider}>
            {[0, 0.25, 0.5, 0.75, 1].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.volumeStep,
                  preferences.metronomeVolume >= val && styles.volumeStepActive,
                ]}
                onPress={() => updatePreference('metronomeVolume', val)}
              >
                <Text
                  style={[
                    styles.volumeStepText,
                    preferences.metronomeVolume >= val && styles.volumeStepTextActive,
                  ]}
                >
                  {Math.round(val * 100)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MetalCard>

        {/* Reset Section */}
        <Text style={styles.sectionTitle}>DONNÉES</Text>
        <MetalCard variant="border">
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Réinitialiser',
                'Êtes-vous sûr de vouloir réinitialiser toutes les préférences?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: () => {
                      setPreferences({
                        theme: 'midnight',
                        showIntervals: true,
                        showNotes: true,
                        showDegrees: false,
                        tuning: 'EADGBE',
                        fretCount: 24,
                        volume: 0.7,
                        metronomeVolume: 0.5,
                      });
                      setHasChanges(true);
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.resetButtonText}>RÉINITIALISER</Text>
          </TouchableOpacity>
        </MetalCard>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>ADAGIO v0.1.0</Text>
          <Text style={styles.appSubtext}>Music Theory for Metalheads</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Toggle
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.gray800, true: Colors.acidGreen }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerButton: {
    fontSize: Typography.bodyMD,
    color: Colors.gray600,
    fontWeight: FontWeights.bold,
  },
  headerButtonActive: {
    color: Colors.acidGreen,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray700,
    marginVertical: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingLabel: {
    fontSize: Typography.bodyMD,
    color: Colors.gray300,
  },
  selectorLabel: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
    marginBottom: Spacing.md,
  },
  tuningGrid: {
    gap: Spacing.sm,
  },
  tuningButton: {
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tuningButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  tuningCode: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
  },
  tuningCodeActive: {
    color: Colors.black,
  },
  tuningName: {
    fontSize: Typography.bodySM,
    color: Colors.gray600,
  },
  tuningNameActive: {
    color: Colors.black,
  },
  fretOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  fretOption: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fretOptionActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  fretOptionText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
  },
  fretOptionTextActive: {
    color: Colors.black,
  },
  volumeLabel: {
    fontSize: Typography.labelLG,
    color: Colors.gray400,
    marginBottom: Spacing.sm,
  },
  volumeSlider: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  volumeStep: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    alignItems: 'center',
  },
  volumeStepActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  volumeStepText: {
    fontSize: Typography.labelLG,
    color: Colors.gray600,
    fontWeight: FontWeights.bold,
  },
  volumeStepTextActive: {
    color: Colors.black,
  },
  resetButton: {
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.danger,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.danger,
    letterSpacing: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appVersion: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray600,
  },
  appSubtext: {
    fontSize: Typography.bodySM,
    color: Colors.gray700,
    marginTop: Spacing.xs,
  },
});
