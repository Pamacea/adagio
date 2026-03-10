// ============================================================================
// NOTATION SCREEN - Musical notation and sheet music display
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Line, Ellipse, Path, G, Circle, Text as SvgText } from 'react-native-svg';
import {
  NoteIcon,
  MusicIcon,
  MetalCard,
  MetalCardWithHeader,
  ChevronRightIcon,
} from '../../components';
import { Colors, Spacing, Typography, FontWeights, toFrenchNote } from '../../theme';
import type { NoteName } from '@adagio/types';

type NotationView = 'staff' | 'tabs' | 'chords';

const NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const DURATIONS = ['whole', 'half', 'quarter', 'eighth', 'sixteenth'] as const;

interface NoteEvent {
  id: string;
  note: NoteName;
  octave: number;
  duration: (typeof DURATIONS)[number];
  position: number;
}

const DURATION_LABELS = {
  whole: 'RONDE',
  half: 'BLANCHE',
  quarter: 'NOIRE',
  eighth: 'CROCHE',
  sixteenth: 'DOUBLE CROCHE',
};

// Staff SVG Component
function StaffSvg({ notes }: { notes: NoteEvent[] }) {
  // Map notes to staff positions (y-coordinates)
  const getNoteYPosition = (note: NoteName, octave: number): number => {
    // Middle C (C4) = 105 (ledger line)
    const noteOffsets: Partial<Record<NoteName, number>> = {
      'C': 0,   // DO
      'D': 15,  // RE
      'E': 30,  // MI
      'F': 45,  // FA
      'G': 60,  // SOL
      'A': 75,  // LA
      'B': 90,  // SI
      'C#': 7.5,
      'Db': 7.5,
      'D#': 22.5,
      'Eb': 22.5,
      'F#': 37.5,
      'Gb': 37.5,
      'G#': 52.5,
      'Ab': 52.5,
      'A#': 67.5,
      'Bb': 67.5,
    };

    // Base position from C4
    const baseY = 105 - (octave - 4) * 105;
    const noteOffset = noteOffsets[note] ?? 0;
    return baseY - noteOffset;
  };

  const notesOnStaff = notes.map((noteEvent, index) => {
    const y = getNoteYPosition(noteEvent.note, noteEvent.octave);
    const x = 150 + index * 50;

    return {
      x,
      y,
      note: noteEvent.note,
      id: noteEvent.id,
      needsLedger: y >= 105 || y <= 15,
      isOddPosition: Math.abs((y - 60) / 7.5) % 2 === 1,
    };
  });

  return (
    <Svg viewBox="0 0 500 180" height={180} width="100%">
      {/* Staff lines */}
      {[30, 45, 60, 75, 90].map((y, i) => (
        <Line
          key={`line-${i}`}
          x1="80"
          y1={y}
          x2="450"
          y2={y}
          stroke="#2a2a2a"
          strokeWidth="2"
        />
      ))}

      {/* Treble clef */}
      <G transform="translate(85, 75)">
        <Path
          d="M 8 -15 C 15 -20, 20 -10, 15 0 C 10 10, 0 5, -5 0 C -10 -5, -5 -15, 5 -20 L 5 -35"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Line
          x1="5"
          y1="-35"
          x2="5"
          y2="35"
          stroke="#e0e0e0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Circle cx="5" cy="38" r="3" fill="#e0e0e0" />
        <Circle cx="12" cy="-5" r="2" fill="#e0e0e0" />
      </G>

      {/* Notes on staff */}
      {notesOnStaff.map(({ x, y, note, needsLedger }) => (
        <G key={`${note}-${x}`}>
          {/* Ledger line if needed */}
          {needsLedger && y >= 105 && (
            <Line
              x1={x - 20}
              y1={y}
              x2={x + 20}
              y2={y}
              stroke="#3a3a3a"
              strokeWidth="2.5"
            />
          )}
          {needsLedger && y <= 15 && (
            <Line
              x1={x - 20}
              y1={y}
              x2={x + 20}
              y2={y}
              stroke="#3a3a3a"
              strokeWidth="2.5"
            />
          )}

          {/* Note head */}
          <Ellipse
            cx={x}
            cy={y}
            rx={10}
            ry={8}
            fill="#e0e0e0"
            transform={`rotate(-20, ${x}, ${y})`}
          />

          {/* Note stem */}
          <Line
            x1={x + 8}
            y1={y - 2}
            x2={x + 8}
            y2={y - 38}
            stroke="#e0e0e0"
            strokeWidth="2"
          />
        </G>
      ))}

      {/* Note labels */}
      {notesOnStaff.map(({ x, y, note }) => (
        <SvgText
          key={`label-${note}-${x}`}
          x={x}
          y={y + 30}
          fill="#666666"
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
        >
          {toFrenchNote(note)}
        </SvgText>
      ))}
    </Svg>
  );
}

// Note duration symbols SVG
function DurationSymbol({ type }: { type: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' }) {
  if (type === 'whole') {
    return (
      <Svg viewBox="0 0 40 60" height={60} width={40}>
        <Ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
      </Svg>
    );
  }
  if (type === 'half') {
    return (
      <Svg viewBox="0 0 40 60" height={60} width={40}>
        <Ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <Line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
      </Svg>
    );
  }
  if (type === 'quarter') {
    return (
      <Svg viewBox="0 0 40 60" height={60} width={40}>
        <Ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <Line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
        <Ellipse cx="30" cy="10" rx="6" ry="4" fill="#e0e0e0" />
      </Svg>
    );
  }
  if (type === 'eighth') {
    return (
      <Svg viewBox="0 0 40 60" height={60} width={40}>
        <Ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <Line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
        <Ellipse cx="30" cy="10" rx="6" ry="4" fill="#e0e0e0" />
        <Path d="M 30 10 Q 42 18 38 30" fill="#e0e0e0" stroke="#e0e0e0" strokeWidth="2" />
      </Svg>
    );
  }
  // sixteenth
  return (
    <Svg viewBox="0 0 40 60" height={60} width={40}>
      <Ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
      <Line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
      <Ellipse cx="30" cy="10" rx="6" ry="4" fill="#e0e0e0" />
      <Path d="M 30 10 Q 42 18 38 30" fill="#e0e0e0" stroke="#e0e0e0" strokeWidth="2" />
      <Path d="M 30 18 Q 42 26 38 38" fill="#e0e0e0" stroke="#e0e0e0" strokeWidth="2" />
    </Svg>
  );
}

export default function NotationScreen() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<NotationView>('staff');
  const [selectedKey, setSelectedKey] = useState<NoteName>('C');
  const [notes, setNotes] = useState<NoteEvent[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<(typeof DURATIONS)[number]>('quarter');

  const addNote = (note: NoteName) => {
    const id = Date.now().toString();
    const position = notes.length;
    // Calculate octave based on note (simple mapping)
    const octave = note === 'C' ? 4 : 4;
    setNotes([...notes, { id, note, octave, duration: selectedDuration, position }]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const clearNotes = () => {
    setNotes([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MusicIcon size={28} color={Colors.acidGreen} />
        <Text style={styles.headerTitle}>NOTATION</Text>
      </View>

      {/* View Selector */}
      <View style={styles.viewBar}>
        {(['staff', 'tabs', 'chords'] as NotationView[]).map((view) => (
          <TouchableOpacity
            key={view}
            style={[styles.viewTab, activeView === view && styles.viewTabActive]}
            onPress={() => setActiveView(view)}
          >
            <NoteIcon
              size={18}
              color={activeView === view ? Colors.black : Colors.gray400}
            />
            <Text style={[styles.viewTabText, activeView === view && styles.viewTabTextActive]}>
              {view === 'staff' ? 'PORTEE' : view === 'tabs' ? 'TABLATURE' : 'ACCORDS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Key Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TONALITÉ</Text>
          <View style={styles.noteSelector}>
            {NOTES.map((note) => (
              <TouchableOpacity
                key={note}
                style={[
                  styles.noteButton,
                  selectedKey === note && styles.noteButtonActive,
                ]}
                onPress={() => setSelectedKey(note)}
              >
                <Text
                  style={[
                    styles.noteButtonText,
                    selectedKey === note && styles.noteButtonTextActive,
                  ]}
                >
                  {toFrenchNote(note)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Selector with visual symbols */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DURÉE</Text>
          <View style={styles.durationVisualSelector}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationVisualButton,
                  selectedDuration === duration && styles.durationButtonActive,
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <DurationSymbol type={duration} />
                <Text style={[
                  styles.durationButtonText,
                  selectedDuration === duration && styles.durationButtonTextActive
                ]}>
                  {DURATION_LABELS[duration]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Staff Display */}
        <MetalCardWithHeader
          title={`PORTEE - ${toFrenchNote(selectedKey)} MAJEUR`}
          variant="dark"
        >
          <View style={styles.staffContainer}>
            {notes.length === 0 ? (
              <View style={styles.emptyState}>
                <NoteIcon size={32} color={Colors.gray600} />
                <Text style={styles.emptyText}>
                  Appuyez sur les notes pour créer votre mélodie
                </Text>
              </View>
            ) : (
              <>
                <StaffSvg notes={notes} />
                <View style={styles.notesList}>
                  {notes.map((noteEvent, index) => (
                    <TouchableOpacity
                      key={noteEvent.id}
                      style={styles.noteListItem}
                      onLongPress={() => removeNote(noteEvent.id)}
                    >
                      <Text style={styles.noteListText}>
                        {index + 1}. {toFrenchNote(noteEvent.note)} ({noteEvent.octave})
                      </Text>
                      <Text style={styles.noteListDuration}>{DURATION_LABELS[noteEvent.duration]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </MetalCardWithHeader>

        {/* Note Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>AJOUTER DES NOTES</Text>
            {notes.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearNotes}>
                <Text style={styles.clearButtonText}>EFFACER</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.noteGrid}>
            {NOTES.map((note) => (
              <TouchableOpacity
                key={note}
                style={styles.gridNoteButton}
                onPress={() => addNote(note)}
              >
                <Text style={styles.gridNoteButtonText}>{toFrenchNote(note)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GABARITS</Text>
          <View style={styles.templateList}>
            <MetalCardWithHeader
              title="Mélodie Majeure Simple"
              subtitle="Do Ré Mi Fa Sol La Si Do"
              right={<ChevronRightIcon size={20} color={Colors.gray600} />}
              onPress={() => {
                const templateNotes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
                setNotes(
                  templateNotes.map((note, i) => ({
                    id: `template-${i}`,
                    note,
                    octave: note === 'C' && i === 7 ? 5 : 4,
                    duration: 'quarter',
                    position: i,
                  }))
                );
              }}
            />
            <MetalCardWithHeader
              title="Gamme Mineure"
              subtitle="La Si Do Ré Mi Fa Sol La"
              right={<ChevronRightIcon size={20} color={Colors.gray600} />}
              onPress={() => {
                const templateNotes: NoteName[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'];
                setNotes(
                  templateNotes.map((note, i) => ({
                    id: `template-${i}`,
                    note,
                    octave: 4,
                    duration: 'quarter',
                    position: i,
                  }))
                );
              }}
            />
            <MetalCardWithHeader
              title="Arpège de Do Majeur"
              subtitle="Do Mi Sol Do"
              right={<ChevronRightIcon size={20} color={Colors.gray600} />}
              onPress={() => {
                const templateNotes: NoteName[] = ['C', 'E', 'G', 'C'];
                setNotes(
                  templateNotes.map((note, i) => ({
                    id: `template-${i}`,
                    note,
                    octave: i === 3 ? 5 : 4,
                    duration: i === 3 ? 'whole' : 'quarter',
                    position: i,
                  }))
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
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
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  viewBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  viewTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.gray800,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  viewTabActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  viewTabText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
    letterSpacing: 1,
  },
  viewTabTextActive: {
    color: Colors.black,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
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
  durationVisualSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  durationVisualButton: {
    width: 75,
    padding: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  durationButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  durationButtonText: {
    fontSize: Typography.labelSM,
    fontWeight: FontWeights.bold,
    color: Colors.gray400,
    textAlign: 'center',
  },
  durationButtonTextActive: {
    color: Colors.black,
  },
  staffContainer: {
    paddingVertical: Spacing.md,
  },
  notesList: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  noteListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  noteListText: {
    color: Colors.white,
    fontSize: Typography.bodySM,
    fontWeight: FontWeights.bold,
  },
  noteListDuration: {
    color: Colors.gray400,
    fontSize: Typography.labelSM,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.bodySM,
    color: Colors.gray600,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  noteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridNoteButton: {
    width: 72,
    height: 56,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridNoteButtonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.gray300,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  clearButtonText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.danger,
  },
  templateList: {
    gap: Spacing.sm,
  },
});
