// ============================================================================
// SEED DATA - Populate database with initial music theory data
// ============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============ MODES ============
  console.log('  Seeding modes...');

  const modes = [
    {
      slug: 'ionian',
      name: 'Ionien',
      intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
      character: 'Majeur pur / Joyeux',
      sensation: 'Heureux, Lumineux, Naturel',
      feeling: 'Serein, Résolu',
      greekName: 'Ionian',
      relativeTo: 'I in major',
      axisGroup: 'tonic',
      advice: 'La base de la musique majeure. Stable et résolu.',
    },
    {
      slug: 'dorian',
      name: 'Dorien',
      intervals: JSON.stringify(['1', '2', 'b3', '4', '5', '6', 'b7']),
      character: 'Mineur chaud / Jazzy',
      sensation: 'Chaud, Soulful, Sophistiqué',
      feeling: 'Cool, Jazz',
      greekName: 'Dorian',
      relativeTo: 'ii in major',
      axisGroup: 'tonic',
      advice: 'Le b3 et le b7 donnent la couleur mineure, le 6 majeur le rend jazzy.',
    },
    {
      slug: 'phrygian',
      name: 'Phrygien',
      intervals: JSON.stringify(['1', 'b2', 'b3', '4', '5', 'b6', 'b7']),
      character: 'Espagnol / Sombre',
      sensation: 'Espagnol, Exotique, Tension',
      feeling: 'Flamenco, Mystérieux',
      greekName: 'Phrygian',
      relativeTo: 'iii in major',
      axisGroup: 'subdominant',
      advice: 'La b2 (seconde mineure) donne cette couleur espagnole/flamenco.',
    },
    {
      slug: 'lydian',
      name: 'Lydien',
      intervals: JSON.stringify(['1', '2', '3', '#4', '5', '6', '7']),
      character: 'Aérien / Lumineux',
      sensation: 'Rêveur, Féerique, Mystique',
      feeling: 'Dreamy, Ethereal',
      greekName: 'Lydian',
      relativeTo: 'IV in major',
      axisGroup: 'subdominant',
      advice: 'La #4 (quarte augmentée) crée une couleur aérienne et dreamy.',
    },
    {
      slug: 'mixolydian',
      name: 'Mixolydien',
      intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', 'b7']),
      character: 'Majeur bluesy',
      sensation: 'Bluesy, Rock, Dynamique',
      feeling: 'Énergique, Dominant',
      greekName: 'Mixolydian',
      relativeTo: 'V in major',
      axisGroup: 'dominant',
      advice: 'La b7 donne la couleur dominante/blues. Parfait pour le rock!',
    },
    {
      slug: 'aeolian',
      name: 'Éolien',
      intervals: JSON.stringify(['1', '2', 'b3', '4', '5', 'b6', 'b7']),
      character: 'Mineur naturel',
      sensation: 'Mélancolique, Triste, Naturel',
      feeling: 'Sad, Emotional',
      greekName: 'Aeolian',
      relativeTo: 'vi in major',
      axisGroup: 'tonic',
      advice: 'Le mode mineur naturel. Triste et mélancolique.',
    },
    {
      slug: 'locrian',
      name: 'Locrien',
      intervals: JSON.stringify(['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7']),
      character: 'Tension extrême',
      sensation: 'Dissonant, Instable, Tense',
      feeling: 'Inquiet, Suspens',
      greekName: 'Locrain',
      relativeTo: 'vii in major',
      axisGroup: 'dominant',
      advice: 'La b5 (quinte diminuée) crée une forte tension. Rarement utilisé comme tonalité.',
    },
  ];

  for (const mode of modes) {
    await prisma.mode.upsert({
      where: { slug: mode.slug },
      update: {},
      create: mode,
    });
  }

  // ============ SCALES ============
  console.log('  Seeding scales...');

  const scales = [
    {
      slug: 'major-pentatonic',
      name: 'Pentatonique Majeure',
      root: 'C',
      intervals: JSON.stringify(['1', '2', '3', '5', '6']),
      type: 'scale',
      quality: 'pentatonic',
    },
    {
      slug: 'minor-pentatonic',
      name: 'Pentatonique Mineure',
      root: 'A',
      intervals: JSON.stringify(['1', 'b3', '4', '5', 'b7']),
      type: 'scale',
      quality: 'pentatonic',
    },
    {
      slug: 'blues',
      name: 'Blues',
      root: 'A',
      intervals: JSON.stringify(['1', 'b3', '4', '#4', '5', 'b7']),
      type: 'scale',
      quality: 'blues',
    },
    {
      slug: 'chromatic',
      name: 'Chromatique',
      root: 'C',
      intervals: JSON.stringify(['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']),
      type: 'scale',
      quality: 'chromatic',
    },
  ];

  for (const scale of scales) {
    await prisma.scale.upsert({
      where: { slug: scale.slug },
      update: {},
      create: scale,
    });
  }

  // ============ CHORDS ============
  console.log('  Seeding chords...');

  const chords = [
    {
      name: 'C',
      root: 'C',
      quality: '',
      intervals: JSON.stringify(['1', '3', '5']),
      fingerings: [
        { position: 'open', frets: [[0, null], [1, 0], [2, 2], [3, 2], [4, 0], [5, null]] },
      ],
      tension: 'stable',
    },
    {
      name: 'Cm',
      root: 'C',
      quality: 'm',
      intervals: JSON.stringify(['1', 'b3', '5']),
      fingerings: [
        { position: 'open', frets: [[0, null], [1, 0], [2, 1], [3, 0], [4, 0], [5, null]] },
      ],
      tension: 'stable',
    },
    {
      name: 'C7',
      root: 'C',
      quality: '7',
      intervals: JSON.stringify(['1', '3', '5', 'b7']),
      fingerings: [
        { position: 3, frets: [[0, null], [1, 3], [2, 5], [3, 3], [4, 5], [5, null]] },
      ],
      tension: 'dominant',
    },
    {
      name: 'Cmaj7',
      root: 'C',
      quality: 'maj7',
      intervals: JSON.stringify(['1', '3', '5', '7']),
      fingerings: [
        { position: 'open', frets: [[0, null], [1, 0], [2, 0], [3, 0], [4, 2], [5, null]] },
        { position: 3, frets: [[0, null], [1, 3], [2, 4], [3, 4], [4, 5], [5, null]] },
      ],
      tension: 'stable',
    },
    {
      name: 'Cm7',
      root: 'C',
      quality: 'm7',
      intervals: JSON.stringify(['1', 'b3', '5', 'b7']),
      fingerings: [
        { position: 3, frets: [[0, null], [1, 3], [2, 4], [3, 3], [4, 4], [5, null]] },
      ],
      tension: 'stable',
    },
    {
      name: 'Cdim',
      root: 'C',
      quality: 'dim',
      intervals: JSON.stringify(['1', 'b3', 'b5']),
      fingerings: [
        { position: 3, frets: [[0, null], [1, 3], [2, 4], [3, 3], [4, null], [5, null]] },
      ],
      tension: 'dissonant',
    },
  ];

  for (const chord of chords) {
    await prisma.chord.upsert({
      where: { root_quality: { root: chord.root, quality: chord.quality } },
      update: {},
      create: chord,
    });
  }

  // ============ HARMONY RULES ============
  console.log('  Seeding harmony rules...');

  const harmonyRules = [
    {
      degree: 'I',
      tonality: 'major',
      sensation: 'Être content à la maison',
      advice: 'Résolution parfaite. Stable et reposant.',
    },
    {
      degree: 'ii',
      tonality: 'major',
      sensation: 'Départ contraint',
      advice: 'Prépare le V. Utilisez le Dorien pour improviser.',
    },
    {
      degree: 'iii',
      tonality: 'major',
      sensation: 'Nostalgie douce',
      advice: 'Peut remplacer le I. Moins stable que le vi.',
    },
    {
      degree: 'IV',
      tonality: 'major',
      sensation: 'Aventure : Vous quittez la maison',
      advice: 'Sens de départ. Utilisez le Lydien pour une couleur dreamy.',
    },
    {
      degree: 'V',
      tonality: 'major',
      sensation: 'Tension : Le retour est incertain',
      advice: 'Crée une tension qui demande résolution sur le I.',
    },
    {
      degree: 'vi',
      tonality: 'major',
      sensation: 'Tristesse résignée',
      advice: 'La relative mineure du I. Mélancolique mais beau.',
    },
    {
      degree: 'vii°',
      tonality: 'major',
      sensation: 'Suspens dramatique',
      advice: 'Tension maximale. Résolution sur le I ou vi.',
    },
    {
      degree: 'i',
      tonality: 'minor',
      sensation: 'Tristesse résignée',
      advice: 'La base du mineur. Stable mais mélancolique.',
    },
    {
      degree: 'iv',
      tonality: 'minor',
      sensation: 'Lueur d\'espoir',
      advice: 'Moment de soulagement dans la mineur.',
    },
    {
      degree: 'v',
      tonality: 'minor',
      sensation: 'Tension sombre',
      advice: 'Souvent remplacé par le V7 (majeur) pour plus de tension.',
    },
    {
      degree: 'VI',
      tonality: 'minor',
      sensation: 'Évasion momentanée',
      advice: 'La relative majeure. Moment de lumière.',
    },
    {
      degree: 'VII',
      tonality: 'minor',
      sensation: 'Retour à la réalité',
      advice: 'Prépare le retour au i. Plus stable que le ii°.',
    },
  ];

  for (const rule of harmonyRules) {
    await prisma.harmonyRule.upsert({
      where: { degree_tonality: { degree: rule.degree, tonality: rule.tonality } },
      update: {},
      create: rule,
    });
  }

  // ============ AXIS GROUPS ============
  console.log('  Seeding axis groups...');

  const axisGroups = [
    {
      name: 'tonic',
      notes: JSON.stringify(['C', 'Eb', 'Gb', 'A']),
      description: 'Accords de résolution et de repos. Les notes qui permettent de "rentrer à la maison".',
      substitutions: JSON.stringify(['relative-minor', 'relative-major', 'chromatic-mediant']),
    },
    {
      name: 'dominant',
      notes: JSON.stringify(['G', 'B', 'Db', 'E']),
      description: 'Accords de tension qui demandent une résolution. Créent du mouvement et du suspense.',
      substitutions: JSON.stringify(['tritone', 'V7alt', 'diminished']),
    },
    {
      name: 'subdominant',
      notes: JSON.stringify(['F', 'Ab', 'B', 'D']),
      description: 'Accords de départ et de mouvement. Préparent le retour ou le départ.',
      substitutions: JSON.stringify(['ii-V', 'IV-']),
    },
  ];

  for (const group of axisGroups) {
    await prisma.axisGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
  }

  // ============ TECHNIQUES ============
  console.log('  Seeding techniques...');

  const techniques = [
    {
      slug: 'hammer-on',
      name: 'Hammer-on',
      category: 'legato',
      difficulty: 'beginner',
      description: 'Produire une note en frappant fort sur une corde déjà vibrant, sans re-picker.',
      notation: '--4h6--',
      tips: JSON.stringify([
        'Gardez le doigt de la première note enfoncé',
        'Attaquez avec le bout du doigt, pas le côté',
        'Commencez lentement, augmentez la vitesse progressivement',
      ]),
      milestones: JSON.stringify([
        { title: 'Exécution propre à 60 BPM', criteria: 'Son clair, volume équilibré' },
        { title: 'Exécution propre à 100 BPM', criteria: 'Son clair, timing précis' },
        { title: 'Triplets à 120 BPM', criteria: 'Triplets fluides et réguliers' },
      ]),
      estimatedPracticeTime: 5,
    },
    {
      slug: 'pull-off',
      name: 'Pull-off',
      category: 'legato',
      difficulty: 'beginner',
      description: 'Produire une note en tirant sur une corde, laissant le doigt sur la frette suivante sonner.',
      notation: '--6p4--',
      tips: JSON.stringify([
        'Tirez vers le bas, pas vers le haut',
        'Le doigt qui reste doit être bien plaqué avant le pull-off',
        'Évitez de "taper" la corde',
      ]),
      milestones: JSON.stringify([
        { title: 'Exécution propre à 60 BPM', criteria: 'Son clair, volume équilibré' },
        { title: 'Exécution propre à 100 BPM', criteria: 'Son clair, timing précis' },
      ]),
      estimatedPracticeTime: 5,
    },
    {
      slug: 'bend',
      name: 'Bend',
      category: 'bends',
      difficulty: 'intermediate',
      description: 'Pousser la corde sur le manche pour monter la hauteur de la note.',
      notation: '--5b7--',
      tips: JSON.stringify([
        'Utilisez 2 ou 3 doigts pour plus de force',
        'Poussez vers le haut, pas vers le bas (sauf sur la corde de G)',
        'Visez la note cible (ex: 1 ton pour un bend complet)',
      ]),
      milestones: JSON.stringify([
        { title: 'Bend complet précis', criteria: 'Atteint exactement le ton' },
        { title: 'Bend et release', criteria: 'Montée et descente propres' },
        { title: 'Bend prévu (pre-bend)', criteria: 'Bend avant de jouer la note' },
      ]),
      estimatedPracticeTime: 10,
    },
    {
      slug: 'sweep-picking',
      name: 'Sweep Picking',
      category: 'sweep',
      difficulty: 'advanced',
      description: 'Technique de balayage pour jouer des arpèges rapides avec un mouvement continu du médiator.',
      notation: '--5-8-12-8-5--',
      tips: JSON.stringify([
        'Le médiator doit "rouler" sur les cordes',
        'Synchronisez main gauche et main droite',
        'Chaque note doit être distincte, pas "collée"',
        'Mutez les cordes qui ne jouent pas',
      ]),
      milestones: JSON.stringify([
        { title: 'Arpège 3 cordes à 80 BPM', criteria: 'Propre et régulier' },
        { title: 'Arpège 5 cordes à 80 BPM', criteria: 'Toutes les notes claires' },
        { title: 'Arpège 5 cordes à 120 BPM', criteria: 'Rapide et propre' },
      ]),
      estimatedPracticeTime: 30,
    },
    {
      slug: 'tapping',
      name: 'Tapping',
      category: 'tapping',
      difficulty: 'intermediate',
      description: 'Utiliser le médiator ou un doigt de la main droite pour fretter une note.',
      notation: '--t12--',
      tips: JSON.stringify([
        'Utilisez le bout du médiator ou le majeur de la main droite',
        'Tapez fort et relâchez pour laisser la note sonner',
        'Combinez avec hammer-ons et pull-offs',
        'Mutez les cordes adjacentes',
      ]),
      milestones: JSON.stringify([
        { title: 'Tap simple propre', criteria: 'Son clair, volume équilibré' },
        { title: 'Tap avec pull-off', criteria: 'Séquence fluide' },
        { title: 'Multi-finger tapping', criteria: '2 doigts ou plus' },
      ]),
      estimatedPracticeTime: 20,
    },
  ];

  for (const technique of techniques) {
    await prisma.technique.upsert({
      where: { slug: technique.slug },
      update: {},
      create: technique,
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
