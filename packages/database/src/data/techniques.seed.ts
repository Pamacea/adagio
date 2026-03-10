// ============================================================================
// SEED DATA - Techniques
// ============================================================================

export const TECHNIQUES_SEED = [
  // === LEGATO ===
  {
    slug: 'hammer-on',
    name: 'Hammer-on',
    category: 'legato',
    difficulty: 'beginner',
    description: 'Frapper une corde pour produire une note sans l\'attaquer à la main droite.',
    notation: 'HO',
    tips: JSON.stringify([
      'Commencez doucement, sans forcer',
      'Gardez le doigt de départ enfoncé',
      'Visez le centre de la frette',
    ]),
    estimatedPracticeTime: 2,
    prerequisites: JSON.stringify([]),
    milestones: JSON.stringify([
      { id: 'first-ho', description: 'Premier hammer-on réussi', xp: 20 },
      { id: 'ho-scale', description: 'Hammer-on une gamme', xp: 50 },
      { id: 'ho-fast', description: 'Hammer-on à 100bpm', xp: 100 },
    ]),
  },
  {
    slug: 'pull-off',
    name: 'Pull-off',
    category: 'legato',
    difficulty: 'beginner',
    description: 'Tirer une corde pour produire une note sans la repiquer à la main droite.',
    notation: 'PO',
    tips: JSON.stringify([
      'Tirez vers le bas (vers le sol)',
      'Gardez le doigt qui reste enfoncé',
      'Relâchez après avoir tiré',
    ]),
    estimatedPracticeTime: 2,
    prerequisites: JSON.stringify([]),
    milestones: JSON.stringify([
      { id: 'first-po', description: 'Premier pull-off réussi', xp: 20 },
      { id: 'po-scale', description: 'Pull-off une gamme', xp: 50 },
      { id: 'po-fast', description: 'Pull-off à 100bpm', xp: 100 },
    ]),
  },
  {
    slug: 'trills',
    name: 'Trilles',
    category: 'legato',
    difficulty: 'intermediate',
    description: 'Alternance rapide entre deux notes adjacentes (HO + PO).',
    notation: 'tr',
    tips: JSON.stringify([
      'Commencez lentement',
      'Commencez avec des intervalles d\'un ton',
      'Gardez la main détendue',
    ]),
    estimatedPracticeTime: 5,
    prerequisites: JSON.stringify(['hammer-on', 'pull-off']),
    milestones: JSON.stringify([
      { id: 'trill-60bpm', description: 'Trille à 60bpm', xp: 50 },
      { id: 'trill-100bpm', description: 'Trille à 100bpm', xp: 100 },
      { id: 'trill-long', description: 'Trille de 10 secondes', xp: 75 },
    ]),
  },

  // === SWEEP ===
  {
    slug: 'sweep-picking',
    name: 'Sweep Picking',
    category: 'sweep',
    difficulty: 'advanced',
    description: 'Technique de médiator où chaque note est jouée sur une corde différente en un seul mouvement continu.',
    notation: 'sweep',
    tips: JSON.stringify([
      'Synchronisez main gauche et droite',
      'La main gauche lève chaque doigt après l\'avoir joué',
      'Commencez lentement avec des arpèges simples',
    ]),
    estimatedPracticeTime: 20,
    prerequisites: JSON.stringify(['hammer-on', 'pull-off']),
    milestones: JSON.stringify([
      { id: 'sweep-3-string', description: 'Sweep 3 cordes propre', xp: 100 },
      { id: 'sweep-5-string', description: 'Sweep 5 cordes propre', xp: 200 },
      { id: 'sweep-arpeggio', description: '5 arpèges sweep en une session', xp: 150 },
    ]),
  },

  // === TAPPING ===
  {
    slug: 'tapping',
    name: 'Tapping',
    category: 'tapping',
    difficulty: 'intermediate',
    description: 'Utiliser le médiator de la main droite pour fretter des notes sur le manche.',
    notation: 'T',
    tips: JSON.stringify([
      'Utilisez le bout de l\'onglet',
      'Tirez légèrement vers le haut après l\'impact',
      'Commencez avec une note simple',
    ]),
    estimatedPracticeTime: 10,
    prerequisites: JSON.stringify(['hammer-on']),
    milestones: JSON.stringify([
      { id: 'tap-basic', description: 'Tapping basique réussi', xp: 50 },
      { id: 'tap-tapped-harmonic', description: 'Tapped harmonic', xp: 75 },
      { id: 'tap-8-fret', description: 'Tapping span de 8 frets', xp: 100 },
    ]),
  },

  // === BENDING ===
  {
    slug: 'bend',
    name: 'Bend',
    category: 'bend',
    difficulty: 'beginner',
    description: 'Pousser une corde pour augmenter sa hauteur.',
    notation: 'b',
    tips: JSON.stringify([
      'Utilisez 2 ou 3 doigts pour plus de force',
      'Contrôlez la hauteur (écoutez!)',
      'Supportez le doigt adjacent pour stabilité',
    ]),
    estimatedPracticeTime: 3,
    prerequisites: JSON.stringify([]),
    milestones: JSON.stringify([
      { id: 'bend-half-step', description: 'Bend d\'un demi-ton', xp: 30 },
      { id: 'bend-whole-step', description: 'Bend d\'un ton entier', xp: 40 },
      { id: 'bend-pitch', description: 'Bend parfaitement juste', xp: 50 },
    ]),
  },
  {
    slug: 'vibrato',
    name: 'Vibrato',
    category: 'bend',
    difficulty: 'intermediate',
    description: 'Oscillation rythmique de la hauteur d\'une note tenue.',
    notation: 'vib',
    tips: JSON.stringify([
      'Utilisez le poignet ou le doigt',
      'Gardez le rythme régulier',
      'N\'en faites pas trop',
    ]),
    estimatedPracticeTime: 5,
    prerequisites: JSON.stringify(['bend']),
    milestones: JSON.stringify([
      { id: 'vibrato-slow', description: 'Vibrato lent', xp: 30 },
      { id: 'vibrato-fast', description: 'Vibrato rapide', xp: 50 },
      { id: 'vibrato-wide', description: 'Vibrato large', xp: 40 },
      { id: 'vibrato-consistent', description: 'Vibrato constant', xp: 75 },
    ]),
  },

  // === ALTERNATE PICKING ===
  {
    slug: 'alternate-picking',
    name: 'Alternate Picking',
    category: 'picking',
    difficulty: 'beginner',
    description: 'Alterner coups de médiator vers le bas et vers le haut.',
    notation: 'alt',
    tips: JSON.stringify([
      'Gardez le mouvement détendu',
      'Commencez très lentement',
      'Utilisez un métronome!',
    ]),
    estimatedPracticeTime: 10,
    prerequisites: JSON.stringify([]),
    milestones: JSON.stringify([
      { id: 'alt-60bpm', description: 'Alternate à 60bpm', xp: 50 },
      { id: 'alt-120bpm', description: 'Alternate à 120bpm', xp: 100 },
      { id: 'alt-16ths', description: 'Double-croches 16ths à 120bpm', xp: 150 },
    ]),
  },

  // === ECONOMY PICKING ===
  {
    slug: 'economy-picking',
    name: 'Economy Picking',
    category: 'picking',
    difficulty: 'intermediate',
    description: 'Utiliser le mouvement le plus économique entre 2 cordes (sweep ou alternate).',
    notation: 'ec',
    tips: JSON.stringify([
      'Analysez le mouvement optimal avant de jouer',
      'Sur cordes adjacentes, faites un sweep',
      'Sur même corde ou saut de corde, alternate',
    ]),
    estimatedPracticeTime: 15,
    prerequisites: JSON.stringify(['alternate-picking', 'sweep-picking']),
    milestones: JSON.stringify([
      { id: 'econ-scales', description: 'Gammes en economy', xp: 100 },
      { id: 'econ-strings', description: '3 cordes sans hésitation', xp: 75 },
      { id: 'econ-fast', description: 'Economy à 140bpm', xp: 150 },
    ]),
  },

  // === HYBRID PICKING ===
  {
    slug: 'hybrid-picking',
    name: 'Hybrid Picking',
    category: 'picking',
    difficulty: 'intermediate',
    description: 'Combiner le médiator et les doigts de la main droite.',
    notation: 'hyb',
    tips: JSON.stringify([
      'Pouce pour corde grave, index/médiator pour aiguës',
      'Ou pouce pour corde aiguë, médiator pour grave',
      'Commencez avec des patterns simples',
    ]),
    estimatedPracticeTime: 10,
    prerequisites: JSON.stringify(['alternate-picking']),
    milestones: JSON.stringify([
      { id: 'hybrid-basic', description: 'Pattern hybride basique', xp: 50 },
      { id: 'hybrid-triplets', description: 'Trioles hybrides', xp: 75 },
      { id: 'hybrid-sixteenths', description: 'Double-croches hybrides', xp: 100 },
    ]),
  },

  // === SLIDE ===
  {
    slug: 'slide',
    name: 'Slide',
    category: 'articulation',
    difficulty: 'beginner',
    description: 'Glisser un doigt le long de la corde pour changer de note.',
    notation: '/',
    tips: JSON.stringify([
      'Gardez la pression sur la corde',
      'Visez la frette d\'arrivée',
      'Peut être lent ou rapide',
    ]),
    estimatedPracticeTime: 1,
    prerequisites: JSON.stringify([]),
    milestones: JSON.stringify([
      { id: 'slide-basic', description: 'Slide basique', xp: 20 },
      { id: 'slide-fast', description: 'Slide rapide', xp: 40 },
    { id: 'slide-long', description: 'Slide span de 12 frets', xp: 50 },
    ]),
  },
];

export const TECHNIQUE_CATEGORIES = [
  'legato',
  'sweep',
  'tapping',
  'bend',
  'picking',
  'articulation',
  'sweep',
  'vibrato',
];
