// ============================================================================
// FRETBOARD SCREEN - Interactive guitar fretboard
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getFretboardNotesForMobile, getIntervalColor } from '@adagio/theory';
import type { NoteName, Interval } from '@adagio/types';
import { MetalCard, GuitarIcon } from '../../components';
import { Colors, Spacing, Typography, FontWeights, toFrenchNote } from '../../theme';

const { width } = Dimensions.get('window');

const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES: Record<string, Interval[]> = {
  Majeur: ['1', '2', '3', '4', '5', '6', '7'],
  Mineur: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  'Pentatonique Majeur': ['1', '2', '3', '5', '6'],
  'Pentatonique Mineur': ['1', 'b3', '4', '5', 'b7'],
  Blues: ['1', 'b3', '4', 'b5', '5', 'b7'],
};

// String names in French
const STRING_NAMES = ['Mi', 'Si', 'Sol', 'Ré', 'La', 'Mi']; // High to low
const STRING_NAMES_EN = ['E', 'B', 'G', 'D', 'A', 'E'];

export default function FretboardScreen() {
  const [selectedKey, setSelectedKey] = useState<NoteName>('C');
  const [selectedScale, setSelectedScale] = useState<string>('Majeur');
  const [showAllNotes, setShowAllNotes] = useState(false);

  const fretboardData = useMemo(() => {
    const intervals = SCALES[selectedScale];
    if (!intervals) return [];
    return getFretboardNotesForMobile(selectedKey, intervals);
  }, [selectedKey, selectedScale]);

  const currentIntervals = SCALES[selectedScale] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GuitarIcon size={24} color={Colors.acidGreen} />
        <Text style={styles.headerTitle}>MANCHE DE GUITARE</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>TONALITÉ</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.keyScroll}
          contentContainerStyle={styles.keyScrollContent}
        >
          {NOTES.map((note) => (
            <TouchableOpacity
              key={note}
              style={[styles.keyButton, selectedKey === note && styles.keyButtonActive]}
              onPress={() => setSelectedKey(note)}
            >
              <Text
                style={[styles.keyButtonText, selectedKey === note && styles.keyButtonTextActive]}
              >
                {toFrenchNote(note)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Scale Selector */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>GAMME</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scaleScroll}
          contentContainerStyle={styles.scaleScrollContent}
        >
          {Object.keys(SCALES).map((scale) => (
            <TouchableOpacity
              key={scale}
              style={[styles.scaleButton, selectedScale === scale && styles.scaleButtonActive]}
              onPress={() => setSelectedScale(scale)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  selectedScale === scale && styles.scaleButtonTextActive,
                ]}
              >
                {scale}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Info Card */}
      <MetalCard variant="accent" style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tonalité</Text>
          <Text style={styles.infoValue}>
            {toFrenchNote(selectedKey)} {selectedScale}
          </Text>
        </View>
      </MetalCard>

      {/* Toggle All Notes */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowAllNotes(!showAllNotes)}
      >
        <Text style={styles.toggleButtonText}>
          {showAllNotes ? 'MASQUER HORS GAMME' : 'AFFICHER TOUTES LES NOTES'}
        </Text>
      </TouchableOpacity>

      {/* Fretboard */}
      <ScrollView
        style={styles.fretboardContainer}
        contentContainerStyle={styles.fretboardContent}
      >
        {/* Fret Numbers */}
        <View style={styles.fretNumbers}>
          <View style={styles.fretNumberPlaceholder} />
          {Array.from({ length: 13 }, (_, i) => (
            <View key={i} style={styles.fretNumber}>
              <Text style={styles.fretNumberText}>{i}</Text>
            </View>
          ))}
        </View>

        {/* Strings */}
        {STRING_NAMES.map((stringName, stringIndex) => (
          <View key={stringName} style={styles.stringRow}>
            {/* String Label */}
            <View style={styles.stringLabel}>
              <Text style={styles.stringLabelText}>{stringName}</Text>
            </View>

            {/* Frets */}
            {Array.from({ length: 13 }, (_, fretIndex) => {
              const noteData = fretboardData.find(
                (n) => n.string === stringIndex && n.fret === fretIndex
              );

              if (!noteData) return <View key={fretIndex} style={styles.fretCell} />;

              const isInScale = noteData.inScale;
              const interval = noteData.interval;
              const bgColor = isInScale && interval ? getIntervalColor(interval) : Colors.gray800;
              const shouldShow = showAllNotes || isInScale;

              return (
                <TouchableOpacity
                  key={fretIndex}
                  style={[
                    styles.fretCell,
                    fretIndex === 0 && styles.nut,
                    isInScale && styles.fretCellInScale,
                  ]}
                >
                  {shouldShow && (
                    <View style={[styles.noteDot, { backgroundColor: bgColor }]}>
                      <Text style={[styles.noteText, isInScale && styles.noteTextInScale]}>
                        {toFrenchNote(noteData.name)}
                      </Text>
                      {interval && isInScale && (
                        <Text style={styles.intervalText}>{interval}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>COULEURS D'INTERVALLES</Text>
        <View style={styles.legendRow}>
          {currentIntervals.map((interval) => (
            <View key={interval} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: getIntervalColor(interval) }]}
              />
              <Text style={styles.legendText}>{interval}</Text>
            </View>
          ))}
        </View>
      </View>
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
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  headerTitle: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  controlsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
    paddingBottom: Spacing.sm,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  controlLabel: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  keyScroll: {
    maxHeight: 50,
    paddingHorizontal: Spacing.md,
  },
  keyScrollContent: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  keyButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    marginRight: Spacing.sm,
  },
  keyButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  keyButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
  },
  keyButtonTextActive: {
    color: Colors.black,
  },
  scaleScroll: {
    maxHeight: 50,
    paddingHorizontal: Spacing.md,
  },
  scaleScrollContent: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  scaleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    marginRight: Spacing.sm,
  },
  scaleButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  scaleButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
  },
  scaleButtonTextActive: {
    color: Colors.black,
  },
  infoCard: {
    margin: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: Typography.labelLG,
    color: Colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.black,
  },
  toggleButton: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray600,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fretboardContainer: {
    flex: 1,
  },
  fretboardContent: {
    padding: Spacing.md,
  },
  fretNumbers: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  fretNumberPlaceholder: {
    width: 32,
  },
  fretNumber: {
    flex: 1,
    alignItems: 'center',
  },
  fretNumberText: {
    fontSize: Typography.labelLG,
    color: Colors.gray600,
  },
  stringRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  stringLabel: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stringLabelText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
  },
  fretCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  nut: {
    marginLeft: 0,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gray600,
  },
  fretCellInScale: {
    backgroundColor: Colors.darkGreen,
  },
  noteDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.gray600,
  },
  noteTextInScale: {
    color: Colors.white,
  },
  intervalText: {
    fontSize: 8,
    color: Colors.white,
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray700,
    padding: Spacing.md,
  },
  legendTitle: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: Typography.labelLG,
    color: Colors.gray400,
  },
});
