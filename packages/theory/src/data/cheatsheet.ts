// ============================================================================
// CHEATSHEET DATA - Antisèche théorique pour guitaristes
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

/**
 * Carte individuelle de l'antisèche
 */
export interface CheatsheetCard {
  id: string;
  title: string;
  content: string;
  example?: string;
  tip?: string;
  degree?: number; // Pour colorisation avec DEGREE_COLORS
}

/**
 * Section de l'antisèche (accordéon)
 */
export interface CheatsheetSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  cards: CheatsheetCard[];
}

/**
 * Catégories de filtre
 */
export type CheatsheetCategory = 'all' | 'scales' | 'tonality' | 'chords' | 'choice' | 'technique';

// ============================================================================
// DATA - GAMMES & MODES
// ============================================================================

const scalesCards: CheatsheetCard[] = [
  {
    id: 'degrees',
    title: 'Penser en degrés',
    content: 'Les degrés (I, II, III...) sont universels. Ils fonctionnent dans toutes les tonalités. Apprenez les "shapes" par degré, pas par position.',
    tip: 'Le degré III vous donne la couleur majeur/mineur de la gamme',
  },
  {
    id: 'pentatonic',
    title: 'Pentatonique mineure',
    content: '5 notes: 1, b3, 4, 5, b7. Base du blues et du rock. La plus utilisée.',
    example: 'En A: A - C - D - E - G',
    degree: 1,
  },
  {
    id: 'pentatonic-major',
    title: 'Pentatonique majeure',
    content: '5 notes: 1, 2, 3, 5, 6. Sonorité country, pop, "happy".',
    example: 'En C: C - D - E - G - A',
    degree: 1,
  },
  {
    id: 'blues-scale',
    title: 'Blues note',
    content: 'Pentatonique mineure + b5 (blue note). Crée la tension blues.',
    example: 'A blues: A - C - D - Eb* - E - G',
    tip: '*La b5 est la "blue note", entre 4 et 5',
  },
  {
    id: '2-4-6-9-11-13',
    title: '2/4/6 = 9/11/13',
    content: 'En ajoutant une 7e: le 2 devient 9, le 4 devient 11, le 6 devient 13. C\'est la même note, une octave plus haut.',
    example: 'C add2 (C-D-E-G) vs C9 (C-E-G-Bb-D)',
  },
  {
    id: 'mode-basics',
    title: 'Les 7 modes',
    content: 'Chacun commence sur un degré différent de la majeure. Ils ont la "coloration" de leur degré de départ.',
    example: 'Ionien (I) → Dorien (II) → Phrygien (III) → Lydien (IV) → Mixolydien (V) → Éolien (VI) → Locrien (VII)',
  },
];

// ============================================================================
// DATA - TONALITÉ & ARMURE
// ============================================================================

const tonalityCards: CheatsheetCard[] = [
  {
    id: 'circle-fifths',
    title: 'Cercle des quintes',
    content: 'Parcourir le cercle dans le sens des aiguilles = +1# à chaque pas. Sens inverse = +1b.',
    tip: 'Pour trouver la tonalité: regardez la dernière altération à la clé',
  },
  {
    id: 'sharps-order',
    title: 'Ordre des dièses',
    content: 'Fa♯ - Do♯ - Sol♯ - Ré♯ - La♯ - Mi♯ - Si♯',
    tip: 'Fat Cats Go Down Alleys Eating Birds (mnémotechnique)',
  },
  {
    id: 'flats-order',
    title: 'Ordre des bémols',
    content: 'Si♭ - Mi♭ - La♭ - Ré♭ - Sol♭ - Do♭ - Fa♭',
    tip: 'Reverse des dièses: BEAD GCF',
  },
  {
    id: 'finding-tonality',
    title: 'Trouver la tonalité',
    content: 'À la clé: le dernier ♯/♭ donne la sensible (VII) pour les ♯, la IV pour les ♭.',
    example: '3♯ (Fa♯, Do♯, Sol♯) → La majeur (Sol♯ = VII)',
  },
  {
    id: 'relative-keys',
    title: 'Tonalités relatives',
    content: 'Même armure, tonique différente (une tierce mineure plus bas pour le mineur).',
    example: 'C majeur / A mineur - même notes, tonique différente',
  },
];

// ============================================================================
// DATA - ACCORDS & HARMONIE
// ============================================================================

const chordsCards: CheatsheetCard[] = [
  {
    id: 'triads',
    title: 'Triades de base',
    content: 'Majeure (1-3-5), Mineure (1-b3-5), Diminuée (1-b3-b5), Augmentée (1-3-#5).',
    example: 'C: C-E-G | Cm: C-Eb-G | C°: C-Eb-Gb | C+: C-E-G#',
  },
  {
    id: 'caged',
    title: 'Système CAGED',
    content: '5 formes qui couvrent tout le manche: C, A, G, E, D. Chaque forme partage des notes avec la suivante.',
    tip: 'Apprenez les 5 formes pour chaque type d\'accord',
    degree: 1,
  },
  {
    id: 'sus2-sus4',
    title: 'Sus2 et Sus4',
    content: 'Sus2 (1-2-5): la tierce est remplacée par la seconde. Sus4 (1-4-5): la tierce est remplacée par la quarte.',
    example: 'Csus2: C-D-G | Csus4: C-F-G',
  },
  {
    id: 'add9',
    title: 'Add9 (pas 7)',
    content: 'Accord + 9e (2e octave). Sans 7e. Sonorité "open", dreamy.',
    example: 'Cadd9: C-E-G-D',
  },
  {
    id: 'chord-substitutions',
    title: 'Substitutions',
    content: 'V peut être remplacé par vii° (partagent la triton). IV peut remplacer II (sous-dominantes).',
    example: 'G7 → B° (partagent F-B si triton) | Dm7 → F (partagent D-F-A)',
  },
  {
    id: 'voice-leading',
    title: 'Voice leading',
    content: 'Garder les notes communes, déplacer les autres le moins possible. Crée des transitions fluides.',
    tip: 'Guide tones: 3 et 7 sont les notes les plus importantes',
  },
];

// ============================================================================
// DATA - CHOIX DE GAMME
// ============================================================================

const choiceCards: CheatsheetCard[] = [
  {
    id: 'iv-dorian',
    title: 'IV → Lydien (pas Dorien)',
    content: 'Sur un accord IV majeur, le Lydien est le choix naturel (mode IV). Le Dorien créerait un conflit avec la 4.',
    example: 'En C majeur, sur F: F Lydien = F G A B C D E (#11 pour couleur)',
    degree: 4,
  },
  {
    id: 'bii-phrygian',
    title: 'bII → Phrygien',
    content: 'Sur un accord bII (Napolitain), le Phrygien (mode III) avec sa b2 crée la tension caractéristique.',
    example: 'En C mineur, sur Db: Db Phrygien = Db Ebb Fb Gb Ab Bbb Cb',
    degree: 2,
  },
  {
    id: 'v-harmonic-minor',
    title: 'V → Mineur Harmonique',
    content: 'Sur un accord V en mineur, la mineur harmonique donne la 7# pour la résolution parfaite vers I.',
    example: 'En A mineur, sur E7: E mineur harm. = E F# G A B C D#',
    degree: 5,
  },
  {
    id: 'chord-scale-matching',
    title: 'Accord → Gamme',
    content: 'Chaque accord a ses gammes "natales". Commencez par celles-ci avant d\'explorer.',
    example: 'Majeur → Ionien/Lydien | Mineur → Dorien/Éolien | 7 → Mixolydien',
  },
];

// ============================================================================
// DATA - TECHNIQUE & MANCHE
// ============================================================================

const techniqueCards: CheatsheetCard[] = [
  {
    id: 'landmarks',
    title: 'Repères manche',
    content: 'Ré (5e corde, 5e case), Sol (3e corde, 12e case), Si (2e corde, 10e case). Points de repère pour navigation.',
    tip: 'La touche 12e = même note que corde à vide, une octave plus haut',
  },
  {
    id: 'b-string-shift',
    title: 'Décalage corde Si',
    content: 'Entre cordes G et B, les motifs se décalent d\'une case vers le haut (à cause de l\'accordage standard).',
    tip: 'Les "box" pentatoniques sont impactées par ce décalage',
  },
  {
    id: 'same-note',
    title: 'Même note',
    content: 'Une note existe sur plusieurs cordes/frettes. Trouvez la position confortable pour le contexte.',
    example: 'Note E: corde à vide E | 2e corde 5e case | 3e corde 9e case | 4e corde 14e case',
  },
  {
    id: 'half-dim-symbol',
    title: 'ø = m7b5',
    content: 'Le symbole ø (demi-diminué) = accord mineur 7 avec quinte diminuée.',
    example: 'Bø = Bm7b5 = B - D - F - A',
  },
  {
    id: 'triad-shapes',
    title: 'Formes triades',
    content: '3 notes: fondation, tierce, quinte. Sur 3 cordes adjacentes. Apprenez sur les groupes 1-2-3, 2-3-4, 3-4-5, 4-5-6.',
    tip: 'Majeur: fondation-tierce-quinte | Mineur: fondation-quinte-tierce (sur le manche)',
  },
  {
    id: 'interval-visualization',
    title: 'Visualiser les intervalles',
    content: 'Apprenez à "voir" les intervalles sur le manche. Tierce mineure = 3 cases, majeure = 4 cases (sur même corde).',
    example: 'C-E (3ce M) = 4 cases | C-Eb (3ce m) = 3 cases',
  },
];

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Toutes les sections de l'antisèche
 */
export const CHEATSHEET_SECTIONS: Record<CheatsheetCategory, CheatsheetSection[]> = {
  all: [
    {
      id: 'scales',
      title: 'Gammes & Modes',
      description: 'Comprendre les gammes et leurs structures',
      icon: 'scales',
      cards: scalesCards,
    },
    {
      id: 'tonality',
      title: 'Tonalité & Armure',
      description: 'Le cercle des quintes et les armures',
      icon: 'circle',
      cards: tonalityCards,
    },
    {
      id: 'chords',
      title: 'Accords & Harmonie',
      description: 'Triades, CAGED et substitutions',
      icon: 'chords',
      cards: chordsCards,
    },
    {
      id: 'choice',
      title: 'Choix de Gamme',
      description: 'Quelle gamme jouer sur quel accord',
      icon: 'modes',
      cards: choiceCards,
    },
    {
      id: 'technique',
      title: 'Technique & Manche',
      description: 'Navigation sur le manche et repères',
      icon: 'fretboard',
      cards: techniqueCards,
    },
  ],
  scales: [{
    id: 'scales',
    title: 'Gammes & Modes',
    description: 'Comprendre les gammes et leurs structures',
    icon: 'scales',
    cards: scalesCards,
  }],
  tonality: [{
    id: 'tonality',
    title: 'Tonalité & Armure',
    description: 'Le cercle des quintes et les armures',
    icon: 'circle',
    cards: tonalityCards,
  }],
  chords: [{
    id: 'chords',
    title: 'Accords & Harmonie',
    description: 'Triades, CAGED et substitutions',
    icon: 'chords',
    cards: chordsCards,
  }],
  choice: [{
    id: 'choice',
    title: 'Choix de Gamme',
    description: 'Quelle gamme jouer sur quel accord',
    icon: 'modes',
    cards: choiceCards,
  }],
  technique: [{
    id: 'technique',
    title: 'Technique & Manche',
    description: 'Navigation sur le manche et repères',
    icon: 'fretboard',
    cards: techniqueCards,
  }],
};

/**
 * Toutes les sections (plat pour iteration)
 */
export const ALL_CHEATSHEET_SECTIONS: CheatsheetSection[] = CHEATSHEET_SECTIONS.all;

/**
 * Toutes les cartes (pour recherche)
 */
export const ALL_CHEATSHEET_CARDS: CheatsheetCard[] = ALL_CHEATSHEET_SECTIONS.flatMap(
  section => section.cards
);

/**
 * Catégories disponibles
 */
export const CHEATSHEET_CATEGORIES: { value: CheatsheetCategory; label: string; icon: string }[] = [
  { value: 'all', label: 'Tout', icon: 'notes' },
  { value: 'scales', label: 'Gammes & Modes', icon: 'scales' },
  { value: 'tonality', label: 'Tonalité', icon: 'circle' },
  { value: 'chords', label: 'Accords', icon: 'chords' },
  { value: 'choice', label: 'Choix de Gamme', icon: 'modes' },
  { value: 'technique', label: 'Technique', icon: 'fretboard' },
];
