// ============================================================================
// CHORD FEELINGS - Emotional associations for chords
// ============================================================================

import type { ChordQuality, ChordFunction } from '@adagio/types';

export interface ChordFeeling {
  quality: ChordQuality;
  function?: ChordFunction;
  name: string;
  feeling: string;
  moods: string[];
  styles: string[];
  advice: string;
  substitutions?: string[];
}

/**
 * Bibliothèque de sentiments associés aux types d'accords
 */
export const CHORD_FEELINGS: ChordFeeling[] = [
  // === MAJOR CHORDS ===
  {
    quality: '',
    function: 'tonic',
    name: 'Major',
    feeling: 'Stabilité, joie pure, triomphe',
    moods: ['happy', 'triumphant', 'stable', 'optimistic'],
    styles: ['all'],
    advice: 'La base de la musique occidentale. Parfait pour les conclusions, les thèmes principaux.',
    substitutions: ['6', 'add9', 'maj7'],
  },
  {
    quality: '6',
    function: 'tonic',
    name: 'Major 6th',
    feeling: 'Nostalgie douce, jazz cool, années 50',
    moods: ['nostalgic', 'cool', 'warm', 'gentle'],
    styles: ['jazz', 'bossa-nova', 'doo-wop'],
    advice: 'Plus doux que la majeure. Idéal pour les finitions enlevées, passages jazz.',
    substitutions: ['maj7', 'add9'],
  },
  {
    quality: 'add9',
    function: 'tonic',
    name: 'Add9',
    feeling: 'Folk, ouverture, rêveur',
    moods: ['dreamy', 'open', 'gentle', 'hopeful'],
    styles: ['folk', 'pop', 'ambient'],
    advice: 'Très populaire dans le folk moderne. Apporte une touche de couleur sans tension.',
    substitutions: ['maj7', ''],
  },
  {
    quality: 'maj7',
    function: 'tonic',
    name: 'Major 7th',
    feeling: 'Luxe, sophistication, smooth jazz',
    moods: ['sophisticated', 'romantic', 'dreamy', 'warm'],
    styles: ['jazz', 'r&b', 'neo-soul', 'bossa-nova'],
    advice: 'L\'accord "à million de dollars". Sensuel et raffiné. Évitez la fondamentale à la basse pour un effet plus subtil.',
    substitutions: ['6', 'add9', '9'],
  },

  // === MINOR CHORDS ===
  {
    quality: 'm',
    function: 'tonic',
    name: 'Minor',
    feeling: 'Tristesse, mélancolie, gravité',
    moods: ['sad', 'serious', 'melancholic', 'dark'],
    styles: ['all'],
    advice: 'La base de la musique mineure. Exprime la tristesse, l\'introspection.',
    substitutions: ['m6', 'madd9', 'm7'],
  },
  {
    quality: 'm6',
    function: 'tonic',
    name: 'Minor 6th',
    feeling: 'Mélancolie dansante, jazz manouche',
    moods: ['melancholic', 'dancing', 'nostalgic'],
    styles: ['jazz', 'gypsy-jazz', 'bossa-nova'],
    advice: 'Plus lumineux que le mineur standard. Très utilisé dans le jazz manouche.',
    substitutions: ['m7', 'madd9'],
  },
  {
    quality: 'madd9',
    function: 'tonic',
    name: 'Minor add9',
    feeling: 'Tristesse lumineuse, espérance',
    moods: ['hopeful', 'gentle-sadness', 'tender'],
    styles: ['folk', 'pop', 'ambient'],
    advice: 'Adoucit la tristesse du mineur. Très utilisé dans la ballade moderne.',
    substitutions: ['m7', 'm9'],
  },
  {
    quality: 'm7',
    function: 'subdominant',
    name: 'Minor 7th',
    feeling: 'Douceur, jazz cool, intimité',
    moods: ['gentle', 'intimate', 'cool', 'relaxed'],
    styles: ['jazz', 'r&b', 'soul', 'neo-soul'],
    advice: 'Plus doux que le majeur. L\'accord de base du jazz moderne.',
    substitutions: ['m9', 'm11', 'm6'],
  },

  // === DOMINANT CHORDS ===
  {
    quality: '7',
    function: 'dominant',
    name: 'Dominant 7th',
    feeling: 'Tension, blues, résolution nécessaire',
    moods: ['tense', 'bluesy', 'urgent', 'expectant'],
    styles: ['blues', 'jazz', 'rock', 'funk'],
    advice: 'Crée une tension qui demande résolution. La base du blues et du jazz.',
    substitutions: ['9', '13', '7sus4'],
  },
  {
    quality: '9',
    function: 'dominant',
    name: '9th',
    feeling: 'Tension colorée, funk, smooth',
    moods: ['groovy', 'sophisticated-tension', 'funky'],
    styles: ['jazz', 'funk', 'r&b'],
    advice: 'Plus coloré que le 7. La 9ème apporte une belle couleur sans trop de tension.',
    substitutions: ['13', '7', '9#11'],
  },
  {
    quality: '13',
    function: 'dominant',
    name: '13th',
    feeling: 'Tension riche, couleur luxueuse',
    moods: ['rich', 'sophisticated', 'warm-tension'],
    styles: ['jazz', 'bossa-nova'],
    advice: 'L\'accord le plus coloré du dominant. Utilisez-le pour les finitions riches.',
    substitutions: ['9', '7', '9#11'],
  },

  // === SUSPENDED CHORDS ===
  {
    quality: 'sus2',
    function: 'tonic',
    name: 'Suspended 2nd',
    feeling: 'Incertain, flottant, folk',
    moods: ['floating', 'uncertain', 'open', 'folk'],
    styles: ['folk', 'pop', 'ambient'],
    advice: 'L\'accord sans tierce. Sens de flottement avant résolution.',
    substitutions: ['sus4', 'add9'],
  },
  {
    quality: 'sus4',
    function: 'dominant',
    name: 'Suspended 4th',
    feeling: 'Suspense, rock classique',
    moods: ['suspense', 'anticipation', 'dramatic'],
    styles: ['rock', 'pop', 'classical'],
    advice: 'Crée une forte tension avant résolution sur la tierce. Très utilisé dans le rock.',
    substitutions: ['sus2', '7sus4'],
  },
  {
    quality: '7sus4',
    function: 'dominant',
    name: '7sus4',
    feeling: 'Tension moderne, fusion, ambient',
    moods: ['modern', 'floating-tension', 'ambiguous'],
    styles: ['jazz', 'fusion', 'ambient', 'pop'],
    advice: 'L\'accord flottant par excellence. Très moderne, sans résolution obligatoire.',
    substitutions: ['sus4', '11'],
  },

  // === DIMINISHED CHORDS ===
  {
    quality: 'dim',
    function: 'dominant',
    name: 'Diminished',
    feeling: 'Angoisse, effroi, compression',
    moods: ['anxious', 'compressed', 'dramatic', 'scary'],
    styles: ['classical', 'horror', 'jazz'],
    advice: 'Tension intense avec mouvement chromatique. Utilisé comme accord de passage.',
    substitutions: ['dim7', 'm7b5'],
  },
  {
    quality: 'dim7',
    function: 'dominant',
    name: 'Diminished 7th',
    feeling: 'Cauchemar, suspense, expressionniste',
    moods: ['nightmare', 'suspense', 'expressionist'],
    styles: ['classical', 'horror', 'silent-film'],
    advice: 'L\'accord du suspense maximal. Peut moduler par tons entiers.',
    substitutions: ['7b9', 'm7b5'],
  },
  {
    quality: 'm7b5',
    function: 'dominant',
    name: 'Half-diminished (m7b5)',
    feeling: 'Tension sombre, jazz moderne',
    moods: ['dark-tension', 'sophisticated', 'mysterious'],
    styles: ['jazz', 'bossa-nova'],
    advice: 'Le vii en majeur. Accord de passage sophistiqué dans le jazz.',
    substitutions: ['dim7', 'm9'],
  },

  // === AUGMENTED CHORDS ===
  {
    quality: 'aug',
    function: 'dominant',
    name: 'Augmented',
    feeling: 'Dérangement, onirique, instable',
    moods: ['dreamy-scary', 'unstable', 'surreal'],
    styles: ['classical', 'film-score', 'jazz'],
    advice: 'Tension symétrique. Sens de flottement instable.',
    substitutions: ['aug7', '7#5'],
  },
  {
    quality: 'aug7',
    function: 'dominant',
    name: 'Augmented 7th',
    feeling: 'Tension exotique, romantique',
    moods: ['exotic', 'romantic-tension', 'spicy'],
    styles: ['jazz', 'latin', 'film-score'],
    advice: 'Dominant altéré classique. Résolution chromatique élégante.',
    substitutions: ['7alt', '7b13'],
  },

  // === EXTENSIONS ===
  {
    quality: 'm9',
    function: 'subdominant',
    name: 'Minor 9th',
    feeling: 'Intimité, nocturne, r&b',
    moods: ['intimate', 'nocturnal', 'sensual', 'sad-beautiful'],
    styles: ['jazz', 'r&b', 'neo-soul', 'lo-fi'],
    advice: 'Un des plus beaux accords. Très expressif et émotionnel.',
    substitutions: ['m11', 'm7'],
  },
  {
    quality: 'm11',
    function: 'subdominant',
    name: 'Minor 11th',
    feeling: 'Ambient, espace, mystère',
    moods: ['mysterious', 'spacious', 'atmospheric'],
    styles: ['jazz', 'ambient', 'neo-soul'],
    advice: 'L\'accord le plus "aérien". Parfait pour les ambiances.',
    substitutions: ['m7', 'm9'],
  },
  {
    quality: '11',
    function: 'subdominant',
    name: '11th (lydian)',
    feeling: 'Rêve flottant, lumineux, spirituel',
    moods: ['dreamy', 'spiritual', 'floating', 'heavenly'],
    styles: ['jazz', 'gospel', 'ambient'],
    advice: 'Souvent avec la quarte augmentée (#11) pour l\'effet Lydien. Ethéré.',
    substitutions: ['maj7#11', '9'],
  },
  {
    quality: 'm13',
    function: 'tonic',
    name: 'Minor 13th',
    feeling: 'Mélancolie riche, profonde',
    moods: ['deep-sadness', 'rich', 'poignant'],
    styles: ['jazz', 'bossa-nova'],
    advice: 'L\'accord mineur le plus complet. Très expressif.',
    substitutions: ['m9', 'm11'],
  },
];

/**
 * Get feeling for a chord quality
 */
export function getChordFeeling(quality: ChordQuality): ChordFeeling | undefined {
  return CHORD_FEELINGS.find(f => f.quality === quality);
}

/**
 * Get suggested substitutions for a chord quality
 */
export function getChordSubstitutions(quality: ChordQuality): string[] {
  const feeling = getChordFeeling(quality);
  return feeling?.substitutions || [];
}

/**
 * Get chords by mood
 */
export function getChordsByMood(mood: string): ChordFeeling[] {
  return CHORD_FEELINGS.filter(f =>
    f.moods.some(m => m.toLowerCase().includes(mood.toLowerCase()))
  );
}

/**
 * Get chords by style
 */
export function getChordsByStyle(style: string): ChordFeeling[] {
  return CHORD_FEELINGS.filter(f =>
    f.styles.some(s =>
      s.toLowerCase().includes(style.toLowerCase()) || style.toLowerCase().includes(s.toLowerCase())
    )
  );
}

/**
 * Map chord function to French description
 */
export function getChordFunctionDescription(fn: ChordFunction): string {
  const descriptions: Record<ChordFunction, string> = {
    'tonic': 'Repos, stabilité, résolution',
    'subdominant': 'Préparation, départ, éloignement',
    'dominant': 'Tension, mouvement vers résolution',
    'substitute-dominant': 'Substitution tritonique, tension colorée',
    'modal-interchange': 'Emprunt modal, couleur exotique',
    'secondary-dominant': 'Dominant secondaire, tension temporaire',
    'passing': 'Accord de passage, transition fluide',
    'augmented-sixth': 'Sixte augmentée, tension classique',
    'neapolitan': 'Napolitain, couleur dramatique',
  };
  return descriptions[fn] || '';
}
