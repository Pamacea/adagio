// ============================================================================
// COMPOSER SCREEN - Chord progression composer and analyzer
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
import { PlusIcon, TrashIcon, SaveIcon, MusicIcon } from '../../components';
import { JaggedButton, MetalCard, NoteCard } from '../../components';
import { Colors, Spacing, Typography, FontWeights, toFrenchNote } from '../../theme';
import { apiClient } from '@adagio/api-client';
import type { NoteName, ProgressionDegree } from '@adagio/types';

const notes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const diatonicMajor: ProgressionDegree[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
const diatonicMinor: ProgressionDegree[] = ['i', 'ii', 'iii', 'iv', 'v', 'VI', 'VII'];
const specialDegrees: ProgressionDegree[] = ['bII', 'bII7', 'bIII', 'bIII7', '#IV', '#iv', 'N6'];

interface ChordItem {
  id: string;
  degree: ProgressionDegree;
  beats: number;
}

const BEAT_OPTIONS = [1, 2, 4];

export default function ComposerScreen() {
  const router = useRouter();
  const [key, setKey] = useState<NoteName>('C');
  const [progression, setProgression] = useState<ChordItem[]>([]);
  const [selectedBeats, setSelectedBeats] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addChord = (degree: ProgressionDegree) => {
    const id = Date.now().toString();
    const beats = selectedBeats[id] || 4;
    setProgression([...progression, { id, degree, beats }]);
  };

  const removeChord = (id: string) => {
    setProgression(progression.filter((chord) => chord.id !== id));
  };

  const updateBeats = (id: string, beats: number) => {
    setProgression(
      progression.map((chord) =>
        chord.id === id ? { ...chord, beats } : chord
      )
    );
    setSelectedBeats({ ...selectedBeats, [id]: beats });
  };

  const clearProgression = () => {
    setProgression([]);
  };

  const analyzeProgression = async () => {
    if (progression.length === 0) {
      Alert.alert('Erreur', 'Ajoutez des accords d\'abord!');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await apiClient.analyzeProgression(
        progression.map((c) => c.degree)
      );

      // Navigate to results or show modal
      Alert.alert(
        'Analyse Terminée',
        JSON.stringify(result, null, 2)
      );
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'analyse');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveProgression = async () => {
    if (progression.length === 0) {
      Alert.alert('Erreur', 'Ajoutez des accords d\'abord!');
      return;
    }

    try {
      await apiClient.saveProgression({
        progression: progression.map((c) => c.degree),
        masteryLevel: 1,
      });
      Alert.alert('Succès', 'Progression sauvegardée!');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la sauvegarde');
      console.error(error);
    }
  };

  const getTotalBeats = () => progression.reduce((sum, chord) => sum + chord.beats, 0);
  const getTotalBars = () => Math.ceil(getTotalBeats() / 4);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <MusicIcon size={28} color={Colors.acidGreen} />
          <Text style={styles.headerTitle}>COMPOSITEUR</Text>
        </View>

        {/* Key Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TONALITÉ</Text>
          <View style={styles.noteSelector}>
            {notes.map((note) => (
              <TouchableOpacity
                key={note}
                style={[
                  styles.noteButton,
                  key === note && styles.noteButtonActive,
                ]}
                onPress={() => setKey(note)}
              >
                <Text
                  style={[
                    styles.noteButtonText,
                    key === note && styles.noteButtonTextActive,
                  ]}
                >
                  {toFrenchNote(note)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progression Display */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>PROGRESSION</Text>
            {progression.length > 0 && (
              <Text style={styles.barCount}>{getTotalBars()} MESURES</Text>
            )}
          </View>

          {progression.length === 0 ? (
            <MetalCard variant="border" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Appuyez sur les accords ci-dessous pour construire votre progression
              </Text>
            </MetalCard>
          ) : (
            <View style={styles.progressionContainer}>
              {progression.map((chord, index) => (
                <TouchableOpacity
                  key={chord.id}
                  style={styles.chordInProgression}
                  onLongPress={() => removeChord(chord.id)}
                >
                  <Text style={styles.chordIndex}>{index + 1}</Text>
                  <Text style={styles.chordDegree}>{chord.degree}</Text>
                  <View style={styles.beatSelector}>
                    {BEAT_OPTIONS.map((beats) => (
                      <TouchableOpacity
                        key={beats}
                        style={[
                          styles.beatOption,
                          chord.beats === beats && styles.beatOptionActive,
                        ]}
                        onPress={() => updateBeats(chord.id, beats)}
                      >
                        <Text
                          style={[
                            styles.beatOptionText,
                            chord.beats === beats && styles.beatOptionTextActive,
                          ]}
                        >
                          {beats}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {progression.length > 0 && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={clearProgression}
              >
                <TrashIcon size={20} color={Colors.danger} />
                <Text style={styles.clearButtonText}>EFFACER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveProgression}
              >
                <SaveIcon size={20} color={Colors.black} />
                <Text style={styles.saveButtonText}>SAUVEGARDER</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Degree Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AJOUTER DES ACCORDS</Text>
          <Text style={styles.hint}>Appui long pour supprimer</Text>

          <Text style={styles.degreeLabel}>DIATONIQUE - MAJEUR</Text>
          <View style={styles.degreeRow}>
            {diatonicMajor.map((deg) => (
              <TouchableOpacity
                key={deg}
                style={styles.degreeButton}
                onPress={() => addChord(deg)}
              >
                <Text style={styles.degreeButtonText}>{deg}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.degreeLabel}>DIATONIQUE - MINEUR</Text>
          <View style={styles.degreeRow}>
            {diatonicMinor.map((deg) => (
              <TouchableOpacity
                key={deg}
                style={styles.degreeButton}
                onPress={() => addChord(deg)}
              >
                <Text style={styles.degreeButtonText}>{deg}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.degreeLabel}>ACCIDENTS & EMPRUNTS</Text>
          <View style={styles.degreeRow}>
            {specialDegrees.map((deg) => (
              <TouchableOpacity
                key={deg}
                style={[styles.degreeButton, styles.specialButton]}
                onPress={() => addChord(deg)}
              >
                <Text style={styles.degreeButtonText}>{deg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Analyze Button */}
        <JaggedButton
          onPress={analyzeProgression}
          disabled={isAnalyzing || progression.length === 0}
          variant="primary"
        >
          {isAnalyzing ? 'ANALYSE...' : 'ANALYSER LA PROGRESSION'}
        </JaggedButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  headerTitle: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  barCount: {
    fontSize: Typography.bodyMD,
    color: Colors.acidGreen,
    fontWeight: FontWeights.bold,
  },
  hint: {
    fontSize: Typography.bodyXS,
    color: Colors.gray500,
    marginBottom: Spacing.md,
  },
  noteSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  noteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  noteButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  noteButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
  },
  noteButtonTextActive: {
    color: Colors.black,
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.bodySM,
    color: Colors.gray500,
    textAlign: 'center',
  },
  progressionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chordInProgression: {
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.sm,
    alignItems: 'center',
    minWidth: 70,
  },
  chordIndex: {
    fontSize: Typography.labelLG,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  chordDegree: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
    marginBottom: Spacing.sm,
  },
  beatSelector: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  beatOption: {
    width: 28,
    height: 28,
    backgroundColor: Colors.gray800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beatOptionActive: {
    backgroundColor: Colors.acidGreen,
  },
  beatOptionText: {
    fontSize: Typography.labelMD,
    color: Colors.gray500,
    fontWeight: FontWeights.bold,
  },
  beatOptionTextActive: {
    color: Colors.black,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  clearButton: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.danger,
  },
  clearButtonText: {
    color: Colors.danger,
    fontWeight: FontWeights.bold,
    fontSize: Typography.labelLG,
  },
  saveButton: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  saveButtonText: {
    color: Colors.black,
    fontWeight: FontWeights.bold,
    fontSize: Typography.labelLG,
  },
  degreeLabel: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  degreeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  degreeButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialButton: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.acidGreen,
    borderWidth: 1,
  },
  degreeButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
  },
});
