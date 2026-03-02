# Feature: Harmonic Engine

> *Le cœur musical d'Adagio — Explorer la théorie par l'émotion et la visualisation*

---

## Concept

Le **Harmonic Engine** est le module central d'Adagio. Il permet aux guitaristes d'explorer les modes et gammes non pas par des noms académiques, mais par **sensations** et **visualisations intuitives**.

---

## User Stories

### En tant que guitariste intermédiaire...
> Je veux comprendre quels modes utiliser sur quels accords, sans avoir à mémoriser des tables complexes.

### En tant que compositeur...
> Je veux trouver des couleurs harmoniques qui correspondent à l'ambiance que je cherche à créer.

### En tant qu'étudiant...
> Je veux visualiser les relations entre les notes sur le manche pour développer mon intuition.

---

## Fonctionnalités

### 1. Mode Explorer

**Par quoi ça remplace :** Les tables de modes traditionnelles

**Approche Adagio :**
- Recherche par **sensation** : "Aérien", "Sombre", "Espagnol", "Jazzy"
- Visualisation **comparative** : Voir côte à côte ce qui différencie deux modes
- Fretboard **contextuel** : Les notes s'affichent directement sur le manche

**Spécifications :**

```typescript
interface ModeExplorerProps {
  // Filtres
  feelings: string[]           // Ex: ["Sombre", "Espagnol"]
  tonalities: string[]         // Ex: ["C", "F", "Bb"]

  // Affichage
  viewMode: "list" | "grid" | "fretboard"
  showIntervals: boolean
  showNotes: boolean

  // Sélection
  selectedMode: Mode | null
  selectedTonalities: string[]

  // Callbacks
  onModeSelect: (mode: Mode) => void
  onPlay: (notes: Note[]) => void
}
```

**UX Pattern :**
1. L'utilisateur sélectionne une tonalité (ex: "C")
2. Il voit 7 cartes, une par mode, chacune avec :
   - Nom du mode (ex: "Dorien")
   - Tags émotionnels (ex: "Chaud, Jazzy")
   - Miniature du fretboard
   - Aperçu audio (hover/click)
3. Au clic, le mode s'ouvre en détail avec :
   - Fretboard complet interactif
   - Intervalles colorés
   - Conseils d'utilisation

### 2. Fretboard Interactif

**Par quoi ça remplace :** Les diagrammes statiques de manche

**Approche Adagio :**
- **Multi-couches** : Notes, intervalles, degrés — basculer entre les vues
- **Dynamique** : Change en temps réel selon le mode sélectionné
- **Éducatif** : Les notes de la gamme sont surlignées, les autres grises

**Spécifications :**

```typescript
interface FretboardProps {
  // Configuration
  key: Note                   // Tonalité (ex: "C")
  scale: Scale                // Gamme à afficher
  tuning: Tuning              // Accordage (défaut: EADGBE)
  fretCount: number           // Nombre de frettes (0-24)

  // Affichage
  showNotes: boolean          // Afficher les noms des notes
  showIntervals: boolean      // Afficher les intervalles (1, b3, 5...)
  showDegrees: boolean        // Afficher les degrés (I, ii, III...)
  highlightRoot: boolean      // Surligner la fondamentale

  // Interaction
  onNoteClick?: (note: Note) => void
  onNoteHover?: (note: Note | null) => void
  playOnHover?: boolean       // Jouer la note au survol
}

interface Note {
  name: string               // Ex: "C", "F#"
  octave: number
  string: number             // 0-5 (de la plus grave à la plus aiguë)
  fret: number               // 0-24
  inScale: boolean           // La note est-elle dans la gamme ?
  interval?: string          // Ex: "1", "b3", "#4"
  degree?: string            // Ex: "I", "ii", "bIII"
}
```

**Couleurs par intervalle :**
- Fondamentale (1) : Rouge (`#ef4444`)
- Tierces (3, b3) : Bleu (`#3b82f6`)
- Quintes (5, b5) : Vert (`#22c55e`)
- Septièmes (7, b7) : Jaune (`#eab308`)
- Extensions (9, 11, 13) : Orange (`#f97316`)
- Altérations (#4, b2, etc.) : Violet (`#a855f7`)

**UX Pattern :**
1. Fretboard affiché en permanence sur la droite de l'écran (desktop) ou en haut (mobile)
2. Cliquer sur une note la joue (Tone.js)
3. Hover sur une note affiche ses info-bulles (note, intervalle, degré)
4. Bouton pour verrouiller/déverrouiller l'affichage pendant les changements de mode

### 3. Mode Comparator

**Par quoi ça remplace :** Les comparaisons manuelles de modes

**Approche Adagio :**
- **Côte à côte** : Voir deux modes sur le même manche
- **Différences surlignées** : Les notes altérées clignotent
- **Analyse automatique** : "Le Lydien a un #4 au lieu du 4"

**Spécifications :**

```typescript
interface ModeComparatorProps {
  modeA: Mode
  modeB: Mode
  key: Note

  // Options
  showDifferencesOnly: boolean
  syncView: boolean           // Zoom/pan synchronisé

  // Callbacks
  onSwapModes: () => void
}
```

**UX Pattern :**
1. Sélectionner "Comparer" depuis le Mode Explorer
2. Choisir deux modes à comparer
3. Les fretboards s'affichent côte à côte
4. Les différences sont surlignées en clignotant
5. Un texte explique : "Dorien vs Phrygien : seule la 2ème note change (2 vs b2)"

---

## Architecture Technique

### Frontend (Next.js)

```
features/harmonic-engine/
├── components/
│   ├── ModeExplorer.tsx       # Grille des modes avec filtres
│   ├── ModeCard.tsx           # Carte individuelle de mode
│   ├── Fretboard.tsx          # Composant principal du manche
│   ├── Fret.tsx               # Ligne de frette individuelle
│   ├── String.tsx             # Corde individuelle
│   ├── NoteMarker.tsx         # Marqueur de note sur le manche
│   ├── NoteTooltip.tsx        # Info-bulle au survol
│   ├── ModeComparator.tsx     # Comparaison de deux modes
│   └── IntervalLegend.tsx     # Légende des couleurs d'intervalles
├── hooks/
│   ├── useModes.ts            # Fetch des modes depuis l'API
│   ├── useFretboardNotes.ts   # Calcul des notes sur le manche
│   ├── useModeComparison.ts   # Logique de comparaison
│   └── useFretboardAudio.ts   # Playback audio
├── actions/
│   └── getModeBySlug.ts       # Server Action pour fetch un mode
└── types.ts
```

### API Endpoints

```
GET    /theory/modes           # Liste tous les modes
GET    /theory/modes/:slug     # Détails d'un mode
GET    /theory/keys/:key/modes # Modes pour une tonalité
POST   /theory/compare         # Compare deux modes
```

### Database Schema

```prisma
model Mode {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // ex: "Dorien"
  intervals   String   @db.Text // JSON: [1, 2, b3, 4, 5, 6, b7]

  // Mapping émotionnel
  character   String   @db.Text // ex: "Aérien / Lumineux"
  sensation   String   @db.Text // ex: "Jazzy, Chaud"
  feeling     String?  // ex: "Féerique"

  // Théorie
  greekName   String?  // ex: "Dorian"
  relativeTo  String?  // ex: "ii in major"
  axisGroup   String?  // ex: "Tonique"

  // Conseils
  advice      String?  @db.Text
}
```

---

## UX/UI Details

### Layout

**Desktop :**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Harmonic Engine                    [User] [Settings]    │
├──────────────────────────────────────────────┬─────────────────┤
│                                               │                 │
│  🎵 Key: [C ▼]                                │   ┌───────────┐ │
│                                               │   │           │ │
│  ┌─────────────────────────────────────────┐ │   │  FRETBOARD│ │
│  │  Filtrer par sensation:                │ │   │           │ │
│  │  [Aérien] [Sombre] [Espagnol] [Jazzy]  │ │   │           │ │
│  └─────────────────────────────────────────┘ │   │           │ │
│                                               │   │           │ │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │   │           │ │
│  │IONIEN│ │DORIEN│ │PHRYG.│ │LYDIEN│       │   │           │ │
│  │Maj.  │ │Chaud │ │Espagn│ │Aérien│       │   │           │ │
│  │Joyeux│ │Jazzy │ │      │ │Lum.  │       │   │           │ │
│  └──────┘ └──────┘ └──────┘ └──────┘       │   │           │ │
│                                               │   └───────────┘ │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │                 │
│  │MIXOLY│ │AEOLIEN│ │LOCRIEN│                 │   Legend:       │
│  │Blues │ │Mélanc.│ │Tension│                 │   ■ 1  □ 3     │
│  └──────┘ └──────┘ └──────┘                  │                 │
└──────────────────────────────────────────────┴─────────────────┘
```

**Mobile :**
```
┌─────────────────────────────┐
│  ≡ Harmonic Engine    👤    │
├─────────────────────────────┤
│  🎵 Key: [C ▼]              │
│                             │
│  ┌───────────────────────┐  │
│  │ Filtrer par sensation │  │
│  │ [Aérien] [Sombre]...   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │      FRETBOARD        │  │
│  │                       │  │
│  │                       │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │ ION │ DOR │ PHR │      │
│  └────┘ └────┘ └────┘      │
└─────────────────────────────┘
```

### Animations

- **Transition entre modes** : Les notes glissent vers leurs nouvelles positions (300ms)
- **Nouveau mode sélectionné** : Pulse effect sur les notes altérées
- **Hover sur note** : Scale 1.1 + tooltip fade-in

---

## Cas d'Usage

### Cas 1 : Découvrir les couleurs d'une tonalité

1. L'utilisateur choisit la tonalité "C"
2. Il voit 7 cartes de modes avec leurs sensations
3. Il clique sur "Lydien" (Aérien, Lumineux)
4. Le fretboard affiche les notes avec le #4 en violet (altération)
5. Il clique sur les notes pour entendre la couleur spéciale

### Cas 2 : Choisir un mode pour improviser

1. L'utilisateur a un accord "Am7"
2. Il filtre les modes par "Mineur, Jazzy"
3. Le système recommande : Dorien, Phrygien, Éolien
4. Il compare Dorien vs Éolien sur le fretboard
5. Il voit que Dorien a une 6ème majeure (plus jazzy)
6. Il choisit Dorien

### Cas 3 : Comprendre la différence entre deux modes

1. L'utilisateur sélectionne "Comparer"
2. Il choisit Lydien vs Ionien
3. Les fretboards s'affichent côte à côte
4. Le #4 du Lydien clignotte en violet
5. Un texte explique : "Le Lydien a un #4, créant une couleur aérienne"

---

## Success Metrics

- **Engagement** : Temps passé sur le Harmonic Engine > 5 min / session
- **Compréhension** : Utilisateurs capables d'identifier 3+ modes par oreille après 1 semaine
- **Réutilisation** : 80% des utilisateurs reviennent sur le Harmonic Engine dans les 7 jours

---

*Feature specification v1.0 — Dernière mise à jour : 2025-03-02*
