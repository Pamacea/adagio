// ============================================================================
// THEORY SCREEN - Music theory explorer (modes, scales, circle of fifths)
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useState } from 'react';
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
  getCircleOfFifths,
  getRelativeMinor,
  getRelativeMajor,
  getEmotionForMode,
  getDegreeColor,
  getDegreeEmotion,
  getChordVisualStyle,
  getModeColor,
  getContrastTextColor,
} from '@adagio/theory';
import type { NoteName, ModeName } from '@adagio/types';
import {
  MetalCard,
  MetalCardWithHeader,
  NoteCard,
  ChevronRightIcon,
  ModeIcon,
  CircleIcon,
  ScaleIcon
} from '../../components';
import { Colors, Spacing, Typography, FontWeights, BorderRadius, toFrenchNote } from '../../theme';

const { width } = Dimensions.get('window');

type TheoryTab = 'modes' | 'circle' | 'scales';

// Modes with emotional data - colors from getModeColor()
const MODE_NAMES: { name: string; greekName: ModeName }[] = [
  { name: 'Ionien', greekName: 'ionian' },
  { name: 'Dorien', greekName: 'dorian' },
  { name: 'Phrygien', greekName: 'phrygian' },
  { name: 'Lydien', greekName: 'lydian' },
  { name: 'Mixolydien', greekName: 'mixolydian' },
  { name: 'Éolien', greekName: 'aeolian' },
  { name: 'Locrien', greekName: 'locrian' },
];

// Roman numerals for degrees
const MAJOR_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const MINOR_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

// Get major scale notes
function getMajorScale(key: NoteName): NoteName[] {
  const chromatic: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keyIndex = chromatic.indexOf(key);
  const intervals = [0, 2, 4, 5, 7, 9, 11];
  return intervals.map(i => chromatic[(keyIndex + i) % 12]!);
}

// Get minor scale notes (natural minor)
function getMinorScale(root: NoteName): NoteName[] {
  const majorKey = getRelativeMajor(root);
  const majorScale = getMajorScale(majorKey);
  return [...majorScale.slice(5), ...majorScale.slice(0, 5)] as NoteName[];
}

// Get major key diatonic chords
function getMajorChords(key: NoteName): string[] {
  const scale = getMajorScale(key);
  return [
    scale[0]!,           // I
    scale[1]! + 'm',     // ii
    scale[2]! + 'm',     // iii
    scale[3]!,           // IV
    scale[4]!,           // V
    scale[5]! + 'm',     // vi
    scale[6]! + 'dim',   // vii°
  ];
}

// Get minor key diatonic chords
function getMinorChords(root: NoteName): string[] {
  const scale = getMinorScale(root);
  return [
    scale[0]! + 'm',     // i
    scale[1]! + 'dim',   // ii°
    scale[2]!,           // III
    scale[3]! + 'm',     // iv
    scale[4]! + 'm',     // v
    scale[5]!,           // VI
    scale[6]!,           // VII
  ];
}

// Helper to convert chord symbol to French notation
function toFrenchChord(chord: string): string {
  const noteMatch = chord.match(/^[A-G][#b]?/);
  if (!noteMatch) return chord;

  const note = noteMatch[0];
  const suffix = chord.slice(note.length);

  return toFrenchNote(note) + suffix;
}

export default function TheoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TheoryTab>('modes');
  const [selectedNote, setSelectedNote] = useState<NoteName>('C');

  const circleData = getCircleOfFifths(selectedNote);

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabBar}>
        {(['modes', 'circle', 'scales'] as TheoryTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            {tab === 'modes' && <ModeIcon size={20} color={activeTab === tab ? Colors.black : Colors.gray400} />}
            {tab === 'circle' && <CircleIcon size={20} color={activeTab === tab ? Colors.black : Colors.gray400} />}
            {tab === 'scales' && <ScaleIcon size={20} color={activeTab === tab ? Colors.black : Colors.gray400} />}
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'modes' ? 'MODES' : tab === 'circle' ? 'CERCLE' : 'GAMMES'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'modes' && <ModesContent />}
        {activeTab === 'circle' && (
          <CircleContent
            circleData={circleData}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
          />
        )}
        {activeTab === 'scales' && (
          <ScalesContent selectedNote={selectedNote} onSelectNote={setSelectedNote} />
        )}
      </ScrollView>
    </View>
  );
}

function ModesContent() {
  return (
    <>
      <Text style={styles.sectionTitle}>LES 7 MODES</Text>
      <Text style={styles.sectionSubtitle}>
        Chaque mode possède une caractère émotionnel unique. Explorez-les pour trouver votre son.
      </Text>
      {MODE_NAMES.map((mode) => {
        const emotionInfo = getEmotionForMode(mode.greekName);
        const modeColor = getModeColor(mode.greekName);

        return (
          <MetalCardWithHeader
            key={mode.name}
            title={mode.name}
            subtitle={mode.greekName}
            variant="default"
            style={styles.modeCard as any}
          >
            <View style={styles.modeCharacterContainer}>
              <View style={[styles.modeColorDot, { backgroundColor: modeColor }]} />
              <Text style={[styles.modeCharacter, { color: modeColor }]}>
                {emotionInfo.character}
              </Text>
            </View>
            <Text style={styles.modeSensation}>{emotionInfo.sensation}</Text>
            {emotionInfo.feeling && (
              <Text style={styles.modeFeeling}>{emotionInfo.feeling}</Text>
            )}
          </MetalCardWithHeader>
        );
      })}
    </>
  );
}

function CircleContent({
  circleData,
  selectedNote,
  onSelectNote,
}: {
  circleData: ReturnType<typeof getCircleOfFifths>;
  selectedNote: NoteName;
  onSelectNote: (note: NoteName) => void;
}) {
  const relativeMinor = getRelativeMinor(selectedNote);

  // Get diatonic chords for major key
  const majorScale = getMajorScale(selectedNote);
  const majorChords = getMajorChords(selectedNote);

  return (
    <>
      <Text style={styles.sectionTitle}>CERCLE DES QUINTES</Text>

      {/* Key Info with emotional color */}
      <View style={styles.keyInfo}>
        <View style={[styles.keyInfoItem, styles.keyInfoItemWithBorder]}>
          <Text style={styles.keyInfoLabel}>TONALITÉ</Text>
          <Text style={styles.keyInfoValue}>{toFrenchNote(selectedNote)} Majeur</Text>
          <Text style={styles.keyInfoEmotion}>{getEmotionForMode('ionian').character}</Text>
        </View>
        <View style={[styles.keyInfoItem, styles.keyInfoItemWithBorder]}>
          <Text style={styles.keyInfoLabel}>RELATIF MINEUR</Text>
          <Text style={styles.keyInfoValue}>{toFrenchNote(relativeMinor)}</Text>
          <Text style={styles.keyInfoEmotion}>{getEmotionForMode('aeolian').character}</Text>
        </View>
      </View>

      {/* Note Selector */}
      <Text style={styles.subsectionTitle}>SÉLECTIONNEZ LA TONALITÉ</Text>
      <View style={styles.noteSelector}>
        {circleData.circle.map((entry) => (
          <NoteCard
            key={entry.note}
            note={entry.note}
            frenchNote={toFrenchNote(entry.note)}
            isRoot={entry.note === selectedNote}
            inScale={true}
            onPress={() => onSelectNote(entry.note)}
          />
        ))}
      </View>

      {/* Diatonic Chords with Emotional Colors */}
      <Text style={styles.subsectionTitle}>ACCORDS DIATONIQUES</Text>
      <Text style={styles.sectionSubtitle}>
        Couleurs basées sur l&apos;émotion de chaque degré
      </Text>
      <View style={styles.chordsContainer}>
        {majorChords.map((chord, index) => {
          const colorInfo = getDegreeColor(index, 'major');
          const chordStyle = getChordVisualStyle(chord);
          const roman = MAJOR_NUMERALS[index];
          const emotion = getDegreeEmotion(index, 'major');
          const note = majorScale[index];

          if (!note) return null;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.chordCard, { borderColor: colorInfo.primary }]}
              onPress={() => onSelectNote(note)}
              activeOpacity={0.7}
            >
              {/* Roman numeral with emotional color */}
              <View style={[styles.chordRomanContainer, { backgroundColor: colorInfo.primary }]}>
                <Text style={[styles.chordRoman, { color: getContrastTextColor(colorInfo.primary) }]}>
                  {roman}
                </Text>
              </View>

              {/* Chord quality indicator */}
              {chordStyle.icon && (
                <View style={[styles.chordQualityBadge, { backgroundColor: chordStyle.borderColor }]}>
                  <Text style={[styles.chordQualityIcon, { color: getContrastTextColor(chordStyle.borderColor) }]}>
                    {chordStyle.icon}
                  </Text>
                </View>
              )}

              {/* Chord name */}
              <Text style={styles.chordName}>{toFrenchChord(chord)}</Text>

              {/* Scale degree note */}
              <Text style={styles.chordNote}>({toFrenchNote(note)})</Text>

              {/* Emotion label */}
              <Text style={[styles.chordEmotion, { color: colorInfo.primary }]} numberOfLines={2}>
                {emotion}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Interval info */}
      <MetalCardWithHeader title="Intervalles depuis la tonique" variant="dark">
        {circleData.circle.slice(0, 7).map((entry, index) => {
          const intervalNames = [
            'Unisson',
            'Quinte',
            'Seconde',
            'Sixte',
            'Tierce',
            'Septième',
            'Quarte',
          ];
          return (
            <View key={entry.note} style={styles.intervalRow}>
              <Text style={styles.intervalNote}>{toFrenchNote(entry.note)}</Text>
              <Text style={styles.intervalName}>{intervalNames[index]}</Text>
              <Text style={styles.intervalValue}>+{entry.interval} demi-tons</Text>
            </View>
          );
        })}
      </MetalCardWithHeader>
    </>
  );
}

function ScalesContent({
  selectedNote,
  onSelectNote,
}: {
  selectedNote: NoteName;
  onSelectNote: (note: NoteName) => void;
}) {
  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const scales = [
    {
      name: 'Majeur',
      frenchName: 'Majeure',
      intervals: ['1', '2', '3', '4', '5', '6', '7'] as const,
    },
    {
      name: 'Minor',
      frenchName: 'Mineure naturelle',
      intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] as const,
    },
    {
      name: 'Pentatonic Major',
      frenchName: 'Pentatonique majeure',
      intervals: ['1', '2', '3', '5', '6'] as const,
    },
    {
      name: 'Pentatonic Minor',
      frenchName: 'Pentatonique mineure',
      intervals: ['1', 'b3', '4', '5', 'b7'] as const,
    },
    {
      name: 'Blues',
      frenchName: 'Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'] as const,
    },
  ];

  return (
    <>
      <Text style={styles.sectionTitle}>EXPLORATEUR DE GAMMES</Text>

      {/* Root Note Selector */}
      <Text style={styles.subsectionTitle}>TONIQUE: {toFrenchNote(selectedNote)}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.horizontalNotes}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note}
              style={[
                styles.horizontalNoteButton,
                note === selectedNote && styles.horizontalNoteButtonActive,
              ]}
              onPress={() => onSelectNote(note)}
            >
              <Text
                style={[
                  styles.horizontalNoteText,
                  note === selectedNote && styles.horizontalNoteTextActive,
                ]}
              >
                {toFrenchNote(note)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Scales List */}
      {scales.map((scale) => (
        <MetalCardWithHeader
          key={scale.name}
          title={`${toFrenchNote(selectedNote)} ${scale.frenchName}`}
          variant="default"
        >
          <View style={styles.intervalsContainer}>
            {scale.intervals.map((interval, i) => (
              <View key={interval} style={styles.intervalBadge}>
                <Text style={styles.intervalBadgeText}>{interval}</Text>
              </View>
            ))}
          </View>
        </MetalCardWithHeader>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 2,
    backgroundColor: Colors.gray800,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  activeTab: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  tabText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
    letterSpacing: 1,
  },
  activeTabText: {
    color: Colors.black,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  sectionSubtitle: {
    fontSize: Typography.bodySM,
    color: Colors.gray500,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  subsectionTitle: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeCard: {
    marginBottom: Spacing.md,
  },
  modeCharacterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modeColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  modeCharacter: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
  },
  modeSensation: {
    fontSize: Typography.bodySM,
    color: Colors.gray400,
  },
  modeFeeling: {
    fontSize: Typography.bodyXS,
    color: Colors.gray500,
    marginTop: 2,
    fontStyle: 'italic',
  },
  keyInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  keyInfoItem: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.md,
    alignItems: 'center',
  },
  keyInfoItemWithBorder: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.acidGreen,
  },
  keyInfoLabel: {
    fontSize: Typography.labelLG,
    color: Colors.gray500,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  keyInfoValue: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
  },
  keyInfoEmotion: {
    fontSize: Typography.labelSM,
    color: Colors.gray500,
    marginTop: 4,
    textAlign: 'center',
  },
  noteSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  intervalNote: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    width: 40,
  },
  intervalName: {
    fontSize: Typography.bodySM,
    color: Colors.gray400,
    flex: 1,
  },
  intervalValue: {
    fontSize: Typography.bodySM,
    color: Colors.gray500,
  },
  horizontalScroll: {
    marginBottom: Spacing.lg,
  },
  horizontalNotes: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xs,
    gap: Spacing.sm,
  },
  horizontalNoteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  horizontalNoteButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  horizontalNoteText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
  },
  horizontalNoteTextActive: {
    color: Colors.black,
  },
  intervalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  intervalBadge: {
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray600,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  intervalBadgeText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
  },
  // Chord cards with emotional colors
  chordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chordCard: {
    width: (width - Spacing.md * 2 - Spacing.sm * 6) / 4,
    backgroundColor: Colors.darkGreen,
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  chordRomanContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  chordRoman: {
    fontSize: Typography.bodyLG,
    fontWeight: FontWeights.bold,
  },
  chordQualityBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chordQualityIcon: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  chordName: {
    fontSize: Typography.bodySM,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginTop: 2,
  },
  chordNote: {
    fontSize: Typography.labelSM,
    color: Colors.gray500,
  },
  chordEmotion: {
    fontSize: Typography.labelSM,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: FontWeights.medium,
  },
});
