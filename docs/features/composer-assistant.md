# Feature: Composer's Assistant

> *L'assistant de composition — Créez des progressions avec intelligence émotionnelle*

---

## Concept

Le **Composer's Assistant** est un outil de composition assistée qui permet de construire des progressions d'accords via **drag-and-drop**, avec des **suggestions automatiques** de gammes, substitutions et **l'analyse des sensations** associées à chaque degré.

---

## User Stories

### En tant que compositeur...
> Je veux créer des progressions d'accords et voir quelles gammes utiliser pour improviser dessus.

### En tant que guitariste qui bloque...
> Je veux qu'on me propose des substitutions intéressantes pour rendre ma progression plus originale.

### En tant qu'étudiant en harmonie...
> Je veux comprendre l'émotion associée à chaque degré harmonique.

---

## Fonctionnalités

### 1. Progression Builder (Drag-and-Drop)

**Par quoi ça remplace :** Le papier/crayon ou les apps de notation complexes

**Approche Adagio :**
- **Bac à sable visuel** : Glisser-déposer des degrés (I, IV, V, ii...)
- **Résultat audio immédiat** : Entendre la progression en temps réel
- **Auto-complétion intelligente** : Suggestions basées sur la théorie

**Spécifications :**

```typescript
interface ProgressionBuilderProps {
  // État
  progression: ChordProgression
  key: Note
  timeSignature: string       // "4/4", "3/4", "6/8"

  // Configuration
  availableDegrees: Degree[]  // I, ii, iii, IV, V...
  showDegrees: boolean        // Afficher en degrés ou en accord
  showAnalysis: boolean       // Afficher l'analyse

  // Callbacks
  onAddChord: (chord: Chord) => void
  onRemoveChord: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onChordChange: (index: number, chord: Chord) => void
  onSave: () => void
  onPlay: () => void
  onStop: () => void
}

interface ChordProgression {
  id: string
  name?: string
  key: Note
  timeSignature: string
  chords: ProgressionChord[]
  analysis?: ProgressionAnalysis
}

interface ProgressionChord {
  degree: string              // "I", "ii", "IV", "V7", "bII7"...
  actualChord?: string         // "Cmaj7", "Dm7"...
  beats: number               // Durée en temps
  analysis?: {
    scale: string             // "Dorien", "Mixolydien"...
    feeling: string           // "Aventure", "Tension"...
    advice: string            // Conseil personnalisé
  }
}
```

**UX Pattern :**
1. L'utilisateur choisit sa tonalité (ex: "C")
2. Une timeline vide apparaît
3. Il fait glisser des degrés depuis la palette vers la timeline
4. Chaque accord ajouté :
   - Joue son audio
   - Affiche la sensation associée
   - Suggère une gamme pour improviser
5. Il peut réorganiser, supprimer, modifier

### 2. Analyse en Temps Réel

**Par quoi ça remplace :** Les livres d'harmonie complexes

**Approche Adagio :**
- **Mapping émotionnel** : Chaque degré a une "sensation" textuelle
- **Suggestions de gammes** : Pour chaque accord, la gamme à utiliser
- **Visualisation des tensions** : Les notes de tension sont surlignées

**Spécifications :**

```typescript
interface ProgressionAnalysis {
  overall: {
    feeling: string           // Ex: "Mélancolique mais résolu"
    tonality: string          // Ex: "Majeur avec emprunts"
    complexity: "simple" | "intermediate" | "advanced"
  }
  chords: ChordAnalysis[]
  suggestions: string[]       // Idées d'amélioration
}

interface ChordAnalysis {
  chord: ProgressionChord
  scale: Scale                // Gamme suggérée
  feeling: string             // Sensation du degré
  tension: "stable" | "tense" | "restless"
  advice: string              // Conseil d'improvisation
  avoid?: string[]            // Notes à éviter (cas particuliers)
}
```

**Exemple d'analyse :**

| Degré | Accord | Gamme suggérée | Sensation | Conseil |
|-------|--------|----------------|-----------|---------|
| I | Cmaj7 | Ionien | Être content à la maison | Base stable, explorez les positions |
| IV | Fmaj7 | Lydien | Aventure : Vous quittez la maison | Le #4 apporte une couleur rêveuse |
| V | G7 | Mixolydien | Tension : Le retour est incertain | Préparez la résolution sur le I |
| I | Cmaj7 | Ionien | Retour à la maison | Résolution parfaite |

### 3. Substitutions 1-Clic

**Par quoi ça remplace :** Les tables de substitutions complexes

**Approche Adagio :**
- **Clic droit sur accord** : Menu de substitutions
- **Aperçu audio** : Entendre la substitution avant de valider
- **Explication** : Pourquoi cette substitution fonctionne

**Spécifications :**

```typescript
interface Substitution {
  type: "tritone" | "relative" | "secondary-dominant" | "diminished"
  originalChord: ProgressionChord
  substitutedChord: ProgressionChord
  explanation: string        // Pourquoi ça marche
  risk: "safe" | "moderate" | "adventurous"
}

interface SubstitutionMenuProps {
  chord: ProgressionChord
  key: Note
  onSelect: (substitution: Substitution) => void
}
```

**Types de substitutions :**

| Type | Exemple | Explication | Risque |
|------|---------|-------------|--------|
| **Tritonique** | V7 → bII7 | Remplace le V par son tritonique | Modéré |
| **Relative mineure** | I → vi | Accord relative mineur | Safe |
| **Relative majeure** | ii → IV | Accord relative majeure | Safe |
| **Dominante secondaire** | ii → V/ii | Prépare le ii | Modéré |
| **Diminuée** | I → #iv°7 | Transition chromatique | Aventureux |

**UX Pattern :**
1. Utilisateur fait un clic long sur un accord
2. Menu des substitutions apparaît
3. Il sélectionne une substitution
4. L'accord est remplacé avec animation
5. Un tooltip explique : "Le tritonique crée une tension bluesy"

### 4. Bibliothèque d'Accords

**Par quoi ça remplace :** Les dictionnaires d'accords statiques

**Approche Adagio :**
- **Contextuelle** : Les accords suggérés selon la tonalité
- **Renversements** : Voir toutes les positions sur le manche
- **Extensions** : Ajouter des 9, 11, 13 en 1 clic

**Spécifications :**

```typescript
interface ChordLibraryProps {
  key: Note
  filter?: ChordFilter
  onSelect: (chord: Chord) => void
}

interface ChordFilter {
  quality?: ChordQuality[]    // ["maj7", "m7", "7"...]
  hasExtensions?: boolean
  difficulty?: "beginner" | "intermediate" | "advanced"
}

interface Chord {
  id: string
  name: string                // "Cmaj7", "Am9"...
  root: Note
  quality: ChordQuality
  extensions?: string[]       // ["9", "11"]
  fingerings: Fingering[]
  theory: {
    intervals: string[]
    scaleDegrees: string[]
    tension: "stable" | "tense" | "dominant"
  }
}
```

---

## Architecture Technique

### Frontend (Next.js)

```
features/composer-assistant/
├── components/
│   ├── ProgressionBuilder.tsx     # Composant principal
│   ├── Timeline.tsx               # Timeline des accords
│   ├── ChordCard.tsx              # Carte d'accord
│   ├── DegreePalette.tsx          # Palette des degrés
│   ├── AnalysisPanel.tsx          # Panneau d'analyse
│   ├── SubstitutionMenu.tsx       # Menu des substitutions
│   ├── ChordLibrary.tsx           # Bibliothèque d'accords
│   ├── PlaybackControls.tsx       # Play, Stop, BPM...
│   └── SaveDialog.tsx             # Dialogue de sauvegarde
├── hooks/
│   ├── useProgression.ts          # État de la progression
│   ├── useProgressionAnalysis.ts  # Analyse automatique
│   ├── usePlayback.ts             # Contrôle du playback
│   ├── useSubstitutions.ts        # Calcul des substitutions
│   └── useChordLibrary.ts         # Recherche d'accords
├── actions/
│   ├── saveProgression.ts         # Server Action
│   └── loadProgression.ts         # Server Action
└── types.ts
```

### API Endpoints

```
GET    /theory/chords              # Liste des accords
POST   /theory/analyze             # Analyser une progression
GET    /theory/substitutions       # Substitutions possibles
POST   /users/me/progressions      # Sauvegarder
GET    /users/me/progressions      # Charger
```

### Database Schema

```prisma
model Progression {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  name        String?
  key         String
  timeSignature String @default("4/4")
  chords      Json     // Array of chord data
  analysis    Json?    // Cached analysis

  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## UX/UI Details

### Layout

**Desktop :**
```
┌─────────────────────────────────────────────────────────────────┐
│  ≡ Composer's Assistant                    [💾 Save] [▶ Play] │
├─────────────────────────────────────────────────────────────────┤
│  Key: [C ▼]  Time: [4/4 ▼]  BPM: [120]  ▲                      │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Palette des degrés                                      │  │
│  │  [I] [ii] [iii] [IV] [V] [vi] [vii°]                    │  │
│  │  [bII7] [bVII] [N6] [It+6]                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  TIMELINE                                                 │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │  │
│  │  │  I     │ │  IV    │ │  V     │ │  I     │           │  │
│  │  │ Cmaj7  │ │ Fmaj7  │ │  G7    │ │ Cmaj7  │           │  │
│  │  │ Home   │ │Adventure│ │ Tension│ │  Home  │           │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘           │  │
│  │     4 beats     4 beats    4 beats     4 beats           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────┬─────────────────────────────────────┐ │
│  │  Analysis           │  Suggestions                        │ │
│  │  ────────────────   │  ────────────────────────────────   │ │
│  │  Feeling: Joyful    │  • Try tritone sub on V7           │ │
│  │  Complexity: Low    │  • Add a ii before V               │ │
│  │  Tonality: Major    │  • Extend to IV-iii-ii-V-I-vi-ii   │ │
│  └──────────────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile :**
```
┌─────────────────────────────┐
│  ≡ Composer        [💾] [▶] │
├─────────────────────────────┤
│  Key: [C ▼]  4/4  120 BPM  │
│                             │
│  ┌───────────────────────┐  │
│  │   TIMELINE            │  │
│  │  ┌───┐ ┌───┐ ┌───┐    │  │
│  │  │ I │ │IV │ │ V │    │  │
│  │  └───┘ └───┘ └───┘    │  │
│  └───────────────────────┘  │
│                             │
│  [+] Add Chord               │
│                             │
│  ┌───────────────────────┐  │
│  │  Analysis             │  │
│  │  Feeling: Joyful      │  │
│  │  Suggested: Dorien    │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Stop |
| `N` | Nouvelle progression |
| `S` | Sauvegarder |
| `Delete` | Supprimer accord sélectionné |
| `Cmd+Z` | Annuler |
| `Cmd+Shift+Z` | Rétablir |
| `1-7` | Ajouter degré I-vii |

---

## Cas d'Usage

### Cas 1 : Créer une progression jazz

1. L'utilisateur choisit la tonalité "Bb"
2. Il fait glisser : ii → V → I
3. Les accords apparaissent : Cm7 → F7 → Bbmaj7
4. Il voit les suggestions :
   - "Sur Cm7 : Utilisez le Dorien"
   - "Sur F7 : Mixolydien ou Phrygien Dominant"
5. Il ajoute un "vi" avant le ii pour plus de mouvement
6. Il sauvegarde sous "ii-V-I in Bb"

### Cas 2 : Explorer les substitutions

1. L'utilisateur a une progression : I → IV → V → I
2. Il fait un clic long sur le "V"
3. Le menu substitutions apparaît
4. Il clique sur "Tritonique (bII7)"
5. La nouvelle progression joue automatiquement
6. Il aime la couleur bluesy et garde la modification

### Cas 3 : Comprendre les émotions harmoniques

1. L'utilisateur veut créer quelque chose de "mélancolique"
2. Il commence avec une tonalité mineure : "Am"
3. Il ajoute : i → VI → III → iv
4. L'analyse affiche :
   - "i : Tristesse résignée"
   - "VI : Lueur d'espoir"
   - "III : Évasion momentanée"
   - "iv : Retour à la réalité"
5. Il comprend l'arc émotionnel de sa progression

---

## Success Metrics

- **Création** : 70% des utilisateurs créent au moins une progression sauvegardée
- **Exploration** : Moyenne de 3+ substitutions essayées par session
- **Compréhension** : Utilisateurs capables d'identifier la sensation des degrés après 1 semaine

---

*Feature specification v1.0 — Dernière mise à jour : 2025-03-02*
