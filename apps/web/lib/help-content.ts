/**
 * ADAGIO - Contenu d'aide centralisé
 *
 * Définit tous les sujets d'aide disponibles dans l'application
 * Utilisé par HelpButton, HelpTooltip et HelpModal
 */

import type { HelpTopic } from '@adagio/ui';

// ============================================================================
// TYPES
// ============================================================================

export type HelpTopicId =
  | 'compose.degrees'
  | 'compose.progressions'
  | 'compose.variations'
  | 'compose.modulations'
  | 'chords.caged'
  | 'chords.positions'
  | 'chords.voicings'
  | 'chords.inversions'
  | 'circle.fifths'
  | 'circle.modulation'
  | 'circle.intervals'
  | 'scales.modes'
  | 'scales.relative'
  | 'theory.intervals'
  | 'theory.harmony'
  | 'notes.cheatsheet';

// ============================================================================
// HELP CONTENT
// ============================================================================

export const HELP_CONTENT: Record<HelpTopicId, HelpTopic> = {
  // ============================================================================
  // COMPOSE - Degrees & Progressions
  // ============================================================================

  'compose.degrees': {
    id: 'compose.degrees',
    title: 'Les Degrés Diatoniques',
    short: 'Les 7 notes qui construisent une tonalité',
    content: `Dans une tonalité, chaque note porte un numéro appelé "degré" (I à VII). Chaque degré a une fonction harmonique unique :

• **I (Tonique)** - Point de repos, centre gravitationnel
• **ii (Sus-dominante)** - Préparation, mouvement doux
• **iii (Médiante)** - Transition, ambiguïté tonale
• **IV (Sous-dominante)** - Éloignement de la tonique
• **V (Dominante)** - Tension maximale, résolution vers I
• **vi (Relative mineure)** - Émotion mélancolique
• **VII (Sensible)** - Tension forte, monte vers I

Les couleurs utilisées représentent l'émotion associée à chaque degré :
• Fondamentales (I, IV, V) : Couleurs chaudes
• Degrés secondaires : Couleurs plus fraîches`,
    related: [
      { id: 'compose.progressions', title: 'Progressions' },
      { id: 'compose.variations', title: 'Variations d\'accords' },
      { id: 'theory.harmony', title: 'Harmonie' },
    ],
  },

  'compose.progressions': {
    id: 'compose.progressions',
    title: 'Les Progressions d\'Accords',
    short: 'Enchaînements d\'accords qui créent du mouvement',
    content: `Une progression est une suite d'accords qui crée un sens musical. Voici les progressions les plus courantes :

**I - V - vi - IV** (Pop/Rock)
La progression "à succès", utilisée dans des milliers de chansons.

**I - vi - ii - V** (Jazz)
Le "turnaround", base du jazz classique.

**I - IV - V** (Blues/Country)
Simple, efficace, fondamentalement blues.

**ii - V - I** (Jazz)
La cadence parfaite du jazz, résolution satisfaisante.

**I - V - vi - iii - IV - I - IV - V** (Pachelbel)
Progression circulaire utilisée dans de nombreux classiques.

Chaque progression évoque une émotion différente selon les degrés utilisés et leur ordre.`,
    related: [
      { id: 'compose.degrees', title: 'Degrés diatoniques' },
      { id: 'compose.modulations', title: 'Modulations' },
    ],
  },

  'compose.variations': {
    id: 'compose.variations',
    title: 'Variations d\'Accords',
    short: 'Enrichissez vos harmonies avec extensions et substitutions',
    content: `Les accords de base peuvent être transformés pour plus de couleur :

**Extensions**
• 7e : Ajoute de la tension
• 9e, 11e, 13e : Couleurs jazz/modernes
• maj7 : Sonnerie dreamy, sophistiquée

**Substitutions**
• Tritone (V7 → II♭7) : Sonnerie jazz complexe
• Dominante secondaire : Tension vers un degré autre que V
• Diminué passant : Transition entre deux accords

**Accords modaux**
• Sus2, Sus4 : Ambiguïté harmonique
• Add9 : Richesse sans la 7e
• 6/9 : Sonnerie moderne, riche

Cliquez sur un degré pour voir ses variations disponibles !`,
    related: [
      { id: 'compose.degrees', title: 'Degrés diatoniques' },
      { id: 'chords.voicings', title: 'Voicings' },
    ],
  },

  'compose.modulations': {
    id: 'compose.modulations',
    title: 'Modulations',
    short: 'Changez de tonalité pour créer des contrastes',
    content: `La modulation est le changement de tonalité au sein d'un morceau. Techniques principales :

**Tonalité proche (diatonique)**
• Vers la dominante (V) : Montée l'énergie
• Vers la sous-dominante (IV) : Transition douce
• Vers la relative (vi en majeur) : Changement subtil

**Emprunt modal**
Emprunter des accords à la tonalité parallèle (majeur ↔ mineur)
• IV majeur en mineur = sonnerie "belle" (Lydian)
• IV mineur en majeur = sonnerie blues/rock

**Modulation par dominante**
Utiliser V7 de la nouvelle tonalité comme "pivot"

**Modulation directe**
Saut brutal vers une nouvelle tonalité pour un contraste maximal`,
    related: [
      { id: 'circle.fifths', title: 'Cycle des quintes' },
      { id: 'compose.progressions', title: 'Progressions' },
    ],
  },

  // ============================================================================
  // CHORDS - CAGED & Positions
  // ============================================================================

  'chords.caged': {
    id: 'chords.caged',
    title: 'Système CAGED',
    short: 'Les 5 formes qui couvrent tout le manche',
    content: `Le système CAGED organise les accords ouverts en 5 formes qui se connectent sur tout le manche :

• **C** : Forme en C, position 0-3
• **A** : Forme en A, position 0-2
• **G** : Forme en G, position 0-3
• **E** : Forme en E, position 0-3
• **D** : Forme en D, position 0-2

Chaque forme contient les mêmes notes mais à des positions différentes. En les enchaînant, vous couvrez tout le manche pour un accord donné.

**Astuce** : Trouvez la tonique d'un accord, et les formes CAGED vous donnent toutes les positions possibles autour.`,
    related: [
      { id: 'chords.positions', title: 'Positions sur le manche' },
      { id: 'chords.inversions', title: 'Renversements' },
    ],
  },

  'chords.positions': {
    id: 'chords.positions',
    title: 'Positions d\'Accords',
    short: 'Où jouer un accord sur le manche',
    content: `Chaque accord peut se jouer à plusieurs positions sur le manche. Choisir la bonne position dépend de :

**Contexte**
• Position précédente/suivante (économie de mouvement)
• Tessiture requise (aigu vs grave)
• Couleur sonore souhaitée

**Types de positions**
• Cordes à vide : Son ouvert, résonant
• Positions fermées : Son plus compact
• Shape haut du manche : Son plus clair
• Shape bas du manche : Son plus corsé

**Visualisation**
Le diagramme de manche montre les doigts (cercles) et les cordes jouées. Un cercle vide = corde à vide, un cercle plein = doigté.`,
    related: [
      { id: 'chords.caged', title: 'Système CAGED' },
      { id: 'chords.voicings', title: 'Voicings' },
    ],
  },

  'chords.voicings': {
    id: 'chords.voicings',
    title: 'Voicings d\'Accords',
    short: 'Différentes façons de disposer les notes d\'un accord',
    content: `Le "voicing" est l'ordre et la disposition des notes dans un accord. Un même accord peut sonner très différemment selon son voicing :

**Voicings ouverts**
• Notes étalées sur plusieurs octaves
• Son plus large, orchestral
• Typique du piano/guitare jazz

**Voicings fermés**
• Notes regroupées dans une octave
• Son plus compact
• Typique des position "grip"

**Drop voicings**
• "Drop 2" : Descendre la 2ème note la plus aiguë d'une octave
• "Drop 3" : Descendre la 3ème note la plus aiguë d'une octave
• Crée des sonorités riches modernes

**Rootless voicings**
• Sans la fondamentale (jouée par la basse)
• Libère des doigts pour extensions (9, 11, 13)
• Standard en jazz combo`,
    related: [
      { id: 'chords.inversions', title: 'Renversements' },
      { id: 'compose.variations', title: 'Variations d\'accords' },
    ],
  },

  'chords.inversions': {
    id: 'chords.inversions',
    title: 'Renversements d\'Accords',
    short: 'Quand une note autre que la fondamentale est à la basse',
    content: `Un accord est "renversé" quand sa note la plus grave n'est pas la fondamentale :

**Position fondamentale**
• Fondamentale à la basse
• Son stable, ancré
• Ex: Do - Mi - Sol (Do majeur)

**1er renversement**
• 3ème à la basse
• Son plus léger
• Ex: Mi - Sol - Do (Do/E)

**2ème renversement**
• 5ème à la basse
• Son suspendu, instable
• Ex: Sol - Do - Mi (Do/G)

**3ème renversement (accords à 4 sons)**
• 7ème à la basse
• Son très tendu, jazz

Les renversements permettent des basses plus mélodiques et des transitions fluides entre accords.`,
    related: [
      { id: 'chords.caged', title: 'Système CAGED' },
      { id: 'chords.voicings', title: 'Voicings' },
    ],
  },

  // ============================================================================
  // CIRCLE - Cycle des Quintes
  // ============================================================================

  'circle.fifths': {
    id: 'circle.fifths',
    title: 'Cycle des Quintes',
    short: 'La carte des tonalités et leurs relations',
    content: `Le cycle des quintes organise les 12 tonalités en cercle. Chaque tonalité voisine est à une quinte de distance :

**Utilisations**
• Trouver les altérations d'une tonalité
• Identifier les tonalités voisines (modulations faciles)
• Comprendre les relations entre accords

**Lecture**
• Horaires : Ajoute un dièse (#)
• Anti-horaire : Ajoute un bémol (♭)
• Opposé : Enharmonie (même son, nom différent)

**Relations**
• Tonique (centre)
• Dominante (1 pas horaire) : Tension
• Sous-dominante (1 pas anti-horaire) : Détente
• Relative mineure (même tonalité mineure)

Le cycle est la base de la théorie harmonique occidentale.`,
    related: [
      { id: 'circle.modulation', title: 'Modulations' },
      { id: 'circle.intervals', title: 'Intervalles' },
    ],
  },

  'circle.modulation': {
    id: 'circle.modulation',
    title: 'Modulations dans le Cycle',
    short: 'Naviguer entre tonalités proches',
    content: `Le cycle des quintes guide les modulations naturelles :

**Modulations proches (facile)**
• Vers la dominante (1 pas horaire)
• Vers la sous-dominante (1 pas anti-horaire)
• Vers la relative (même armure)

Exemple en Do majeur :
• Vers Sol (V) : montée d'énergie
• Vers Fa (IV) : transition douce
• Vers La mineur (vi) : changement subtil

**Modulations lointaines (dramatique)**
• Sauts de plusieurs pas dans le cycle
• Crée un contraste fort
• Souvent précédé par une dominante secondaire

**Tonalités enharmoniques**
• Fa# = Sol♭, même son
• Permet des modulations "impossibles"
• Utile pour pivoter vers des tonalités éloignées`,
    related: [
      { id: 'circle.fifths', title: 'Cycle des quintes' },
      { id: 'compose.modulations', title: 'Modulations' },
    ],
  },

  'circle.intervals': {
    id: 'circle.intervals',
    title: 'Intervalles dans le Cycle',
    short: 'Distances harmoniques entre les notes',
    content: `Le cycle des quintes révèle les relations intervalliques :

**Quinte juste**
• Distance d'un pas dans le cycle
• Intervalle le plus consonant après l'octave
• Base de l'harmonie occidentale

**Quarte juste**
• Distance de 5 pas (ou -1 pas)
• Renversement de la quinte
• Son "suspendu"

**Tierce**
• Distance de 2 ou 3 pas selon majeur/mineur
• Définit la couleur majeure/mineure

**Seconde**
• Distance de 6 ou 7 pas
• Dissonance, tension

**Triton (quarte augmentée)**
• Distance de 6 pas - demi-tour du cycle !
• Intervalle le plus dissonant
• Au centre de la dominante (7ème)`,
    related: [
      { id: 'circle.fifths', title: 'Cycle des quintes' },
      { id: 'theory.intervals', title: 'Théorie des intervalles' },
    ],
  },

  // ============================================================================
  // SCALES - Modes & Relations
  // ============================================================================

  'scales.modes': {
    id: 'scales.modes',
    title: 'Modes de la gamme majeure',
    short: '7 modes pour 7 ambiances sonores',
    content: `Les modes sont des déclinaisons de la gamme majeure, chacun commençant sur un degré différent :

**Modes majeurs (clairs)**
• Ionien (I) : Majeur standard, bright, happy
• Lydien (IV) : Dreamy, mystique (#11)
• Mixolydien (V) : Bluesy, rock (7ème)

**Modes mineurs (sombre)**
• Dorien (ii) : Jazz mineur, hopeful (♮6)
• Phrygien (iii) : Flamenco, exotique (♭2)
• Éolien (vi) : Mineur naturel, sad
• Locrien (vii) : Tense, instable (♭5)

**Utilisation**
• Jouez la gamme de Do majeur en commençant par Ré = Dorien
• Chaque mode a sa "coloration harmonique" unique
• Les modes changent l'ambiance sans changer la tonalité de base`,
    related: [
      { id: 'compose.variations', title: 'Variations d\'accords' },
      { id: 'scales.relative', title: 'Tonalités relatives' },
    ],
  },

  'scales.relative': {
    id: 'scales.relative',
    title: 'Tonalités Relatives',
    short: 'Même armure, tonalité différente',
    content: `Deux tonalités sont "relatives" quand elles partagent la même armure (altérations) :

**Relation majeur/mineur**
• La relative mineure = VIème degré de la majeure
• La relative majeure = IIIème degré de la mineure
• Exemple: Do majeur et La mineur (pas d'altérations)

**Utilisation**
• Modulation subtile (mêmes notes)
• Change l'ambiance sans changer la gamme
• Très courant en pop/rock

**Différences sonores**
• Majeure : Centre sur I (tonique)
• Mineure : Centre sur vi (degré VI)

**Tonalité parallèle**
À ne pas confondre : même tonique mais armure différente
• Do majeur ↔ Do mineur (différentes altérations)`,
    related: [
      { id: 'scales.modes', title: 'Modes' },
      { id: 'circle.fifths', title: 'Cycle des quintes' },
    ],
  },

  // ============================================================================
  // THEORY - Intervalles & Harmonie
  // ============================================================================

  'theory.intervals': {
    id: 'theory.intervals',
    title: 'Intervalles - Fondamentaux',
    short: 'Distances entre notes, base de toute la musique',
    content: `Un intervalle est la distance entre deux notes. C'est la brique fondamentale de l'harmonie :

**Intervalles justes (consonants)**
• Unisson (1) : Même note
• Octave (8) : Double de fréquence
• Quinte (5) : 3:2, très consonant
• Quarte (4) : 4:3, stable mais suspendu

**Intervalles majeurs/mineurs**
• Seconde (2) : Dissonance
• Tierce (3) : Définit majeur/mineur
• Sixte (6) : Consonance moyennement large
• Septième (7) : Tension (majeure) ou douce (mineure)

**Intervalles altérés**
• Augmenté (+½ ton) : Tension
• Diminué (-½ ton) : Dissonance

**Enharmonie**
• Triton = Quinte augmentée = Quarte diminuée
• Même son, notation différente`,
    related: [
      { id: 'circle.intervals', title: 'Intervalles dans le cycle' },
      { id: 'theory.harmony', title: 'Harmonie' },
    ],
  },

  'theory.harmony': {
    id: 'theory.harmony',
    title: 'Harmonie Diatonique',
    short: 'Les accords formés par les degrés d\'une tonalité',
    content: `L'harmonie diatonique construit des accords en empilant des tierces à partir de chaque degré de la gamme :

**Accords de la gamme majeure**
• I - majeur 7 (Tonique)
• ii - mineur 7 (Sus-dominante)
• iii - mineur 7 (Médiante)
• IV - majeur 7 (Sous-dominante)
• V - 7 (Dominante, la seule 7ème dominante !)
• vi - mineur 7 (Relative)
• vii° - demi-diminué (Sensible)

**Fonctions harmoniques**
• Tonique (I, vi, iii) : Repos, stabilité
• Sous-dominante (IV, ii) : Éloignement, préparation
• Dominante (V, vii°) : Tension, besoin de résoudre

**Analyse**
Ces accords forment la base de 95% de la musique occidentale. Les comprendre permet de composer, improviser et transcrire efficacement.`,
    related: [
      { id: 'compose.degrees', title: 'Degrés diatoniques' },
      { id: 'theory.intervals', title: 'Intervalles' },
    ],
  },

  // ============================================================================
  // NOTES - Cheatsheet
  // ============================================================================

  'notes.cheatsheet': {
    id: 'notes.cheatsheet',
    title: 'Antisèche Théorique',
    short: 'Référence rapide pour guitaristes',
    content: `Cette antisèche regroupe toutes les connaissances essentielles pour guitaristes :

**Organisation**
• **Fretboard** - Notes sur tout le manche, par cordes et par cases
• **Gammes** - Formes majeures, mineures, pentatoniques, modes
• **Accords** - Formes ouvertes, CAGED, diatoniques, extensions
• **Triades** - Majeures, mineures, diminuées, augmentées sur le manche
• **Choix de gamme** - Quelle gamme jouer sur quel accord

**Utilisation**
1. Utilisez les filtres par catégorie (Tout, Fretboard, Gammes, Accords, etc.)
2. La recherche trouve dans tous les contenus instantanément
3. Cliquez sur une section pour l'agrandir/réduire

**Mémorisation**
Commencez par une section à la fois. Le fretboard et les 5 formes de pentatonique sont les bases essentielles.

**Conseil pro**
Apprenez les relations visuelles sur le manche plutôt que des formules abstraites. Votre main retiendra les formes !`,
    related: [
      { id: 'chords.caged', title: 'Système CAGED' },
      { id: 'scales.modes', title: 'Modes de la gamme' },
      { id: 'theory.intervals', title: 'Intervalles' },
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère un sujet d'aide par son ID
 */
export function getHelpTopic(id: string): HelpTopic | null {
  return HELP_CONTENT[id as HelpTopicId] || null;
}

/**
 * Récupère tous les sujets d'aide
 */
export function getAllHelpTopics(): HelpTopic[] {
  return Object.values(HELP_CONTENT);
}

/**
 * Récupère les sujets d'aide filtrés par catégorie
 */
export function getHelpTopicsByCategory(category: 'compose' | 'chords' | 'circle' | 'scales' | 'theory'): HelpTopic[] {
  return Object.values(HELP_CONTENT).filter(topic => topic.id.startsWith(category + '.'));
}

/**
 * Recherche de sujets d'aide
 */
export function searchHelpTopics(query: string): HelpTopic[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(HELP_CONTENT).filter(
    topic =>
      topic.title.toLowerCase().includes(lowerQuery) ||
      (typeof topic.content === 'string' && topic.content.toLowerCase().includes(lowerQuery)) ||
      topic.short?.toLowerCase().includes(lowerQuery)
  );
}
