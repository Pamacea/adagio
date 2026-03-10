// ============================================================================
// GRIMOIRE SCREEN - Personal library of saved progressions and favorites
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  LibraryIcon,
  FolderIcon,
  MusicIcon,
  TrashIcon,
  EditIcon,
  PlusIcon,
  ChevronRightIcon,
  SearchIcon,
  MetalCard,
  MetalCardWithHeader,
} from '../../components';
import { Colors, Spacing, Typography, FontWeights } from '../../theme';
import { apiClient } from '@adagio/api-client';
import type { SavedProgression } from '@adagio/types';

interface SavedProgressionWithId extends SavedProgression {
  id: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

// Mock data - replace with real data from API
const MOCK_FOLDERS: Folder[] = [
  { id: '1', name: 'Favoris', count: 12 },
  { id: '2', name: 'Jazz', count: 8 },
  { id: '3', name: 'Rock', count: 15 },
  { id: '4', name: 'Classique', count: 5 },
];

type LibraryTab = 'all' | 'folders' | 'favorites';

export default function GrimoireScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [progressions, setProgressions] = useState<SavedProgressionWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setIsLoading(true);
    try {
      const data = await apiClient.getLibrary();
      setProgressions((data as SavedProgressionWithId[]) || []);
    } catch (error) {
      console.error('Failed to load library:', error);
      // Use mock data if API fails
      setProgressions([
        {
          id: '1',
          userId: 'mock',
          name: 'II-V-I Jazz',
          key: 'C',
          timeSignature: '4/4',
          chords: [{ degree: 'ii', beats: 4 }, { degree: 'V', beats: 4 }, { degree: 'I', beats: 4 }],
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'mock',
          name: 'Blues en 12 mesures',
          key: 'A',
          timeSignature: '4/4',
          chords: [
            { degree: 'I', beats: 4 },
            { degree: 'I', beats: 4 },
            { degree: 'I', beats: 4 },
            { degree: 'I', beats: 4 },
            { degree: 'IV', beats: 4 },
            { degree: 'IV', beats: 4 },
            { degree: 'I', beats: 4 },
            { degree: 'I', beats: 4 },
          ],
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProgressions = progressions.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteProgression = (id: string) => {
    setProgressions(progressions.filter((p) => p.id !== id));
  };

  const createNewFolder = () => {
    // TODO: Implement folder creation
    console.log('Create new folder');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.acidGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LibraryIcon size={28} color={Colors.acidGreen} />
        <Text style={styles.headerTitle}>GRIMOIRE</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={Colors.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor={Colors.gray600}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabBar}>
        {(['all', 'folders', 'favorites'] as LibraryTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? 'TOUT' : tab === 'folders' ? 'DOSSIERS' : 'FAVORIS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'folders' && (
          <>
            {/* Create New Folder */}
            <TouchableOpacity style={styles.createFolderButton} onPress={createNewFolder}>
              <PlusIcon size={20} color={Colors.acidGreen} />
              <Text style={styles.createFolderText}>NOUVEAU DOSSIER</Text>
            </TouchableOpacity>

            {/* Folders List */}
            <Text style={styles.sectionLabel}>DOSSIERS</Text>
            {folders.map((folder) => (
              <MetalCardWithHeader
                key={folder.id}
                title={folder.name}
                subtitle={`${folder.count} progressions`}
                icon={<FolderIcon size={24} color={Colors.gray500} />}
                right={<ChevronRightIcon size={20} color={Colors.gray600} />}
                onPress={() => console.log('Open folder', folder.id)}
              />
            ))}
          </>
        )}

        {activeTab === 'all' && (
          <>
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progressions.length}</Text>
                <Text style={styles.statLabel}>SAUVEGARDÉS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{folders.length}</Text>
                <Text style={styles.statLabel}>DOSSIERS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>PARTAGÉS</Text>
              </View>
            </View>

            {/* Recent Progressions */}
            <Text style={styles.sectionLabel}>PROGRESSIONS RÉCENTES</Text>
            {filteredProgressions.length === 0 ? (
              <MetalCard variant="border" style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <MusicIcon size={32} color={Colors.gray700} />
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'Aucun résultat' : 'Aucune progression sauvegardée'}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => router.push('/(tabs)/composer')}
                  >
                    <Text style={styles.emptyButtonText}>CRÉER UNE PROGRESSION</Text>
                  </TouchableOpacity>
                </View>
              </MetalCard>
            ) : (
              filteredProgressions.map((progression) => (
                <MetalCardWithHeader
                  key={progression.id}
                  title={progression.name || 'Sans titre'}
                  subtitle={`${progression.key} • ${progression.timeSignature}`}
                  right={
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => console.log('Edit', progression.id)}
                      >
                        <EditIcon size={18} color={Colors.gray600} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => deleteProgression(progression.id)}
                      >
                        <TrashIcon size={18} color={Colors.danger} />
                      </TouchableOpacity>
                    </View>
                  }
                  onPress={() => console.log('Open progression', progression.id)}
                >
                  <View style={styles.chordRow}>
                    {progression.chords.map((chord, index) => (
                      <View key={index} style={styles.chordBadge}>
                        <Text style={styles.chordText}>{chord.degree}</Text>
                      </View>
                    ))}
                  </View>
                </MetalCardWithHeader>
              ))
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            <Text style={styles.sectionLabel}>FAVORIS</Text>
            <MetalCard variant="border" style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <MusicIcon size={32} color={Colors.gray700} />
                <Text style={styles.emptyText}>
                  Appuyez sur l'étoile pour ajouter aux favoris
                </Text>
              </View>
            </MetalCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.bodyMD,
    color: Colors.white,
    paddingVertical: Spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    alignItems: 'center',
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
  sectionLabel: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    marginBottom: Spacing.lg,
  },
  createFolderText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray700,
  },
  emptyCard: {
    padding: Spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.bodySM,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  emptyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.green,
    borderWidth: 1,
    borderColor: Colors.acidGreen,
  },
  emptyButtonText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.black,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chordBadge: {
    backgroundColor: Colors.gray800,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chordText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
  },
});
