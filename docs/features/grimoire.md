# Feature: The Grimoire

> *Le grimoire de la connaissance — Base de connaissances techniques et système de progression*

---

## Concept

Le **Grimoire** est la base de connaissances d'Adagio. Elle contient toutes les **techniques de guitare**, les **conseils personnels**, et permet de **suivre sa progression** d'apprentissage avec un système gamifié.

---

## User Stories

### En tant qu'étudiant...
> Je veux apprendre de nouvelles techniques de manière structurée, avec des démonstrations visuelles.

### En tant que guitariste autodidacte...
> Je veux avoir une référence fiable avec des conseils pratiques, pas de la théorie abstraite.

### En tant que professeur...
> Je veux recommander à mes élèves une ressource visuelle pour compléter mes cours.

---

## Fonctionnalités

### 1. Wiki des Techniques

**Par quoi ça remplace :** Les vidéos YouTube disperses, les livres de technique

**Approche Adagio :**
- **Organisé par catégorie** : Legato, Sweep, Tapping, Bends, Vibrato...
- **Difficulté progressive** : Beginner → Intermediate → Advanced
- **Démonstrations visuelles** : Diagrammes, GIFs, vidéos courtes
- **Conseils personnels** : Notes issues de votre tableur

**Spécifications :**

```typescript
interface Technique {
  id: string
  slug: string
  name: string                // "Hammer-on", "Sweep Picking"...
  category: TechniqueCategory
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string

  // Visual aids
  diagramUrl: string          // Image/illustration
  videoUrl?: string           // Vidéo courte de démonstration
  audioExample?: string       // Exemple audio

  // Theory
  notation: string            // Tablature ou notation standard
  tips: string[]              // Conseils pratiques

  // Pré-requis
  prerequisites: string[]     // Techniques à connaître avant
  relatedTechniques: string[] // Techniques liées

  // Progression
  estimatedPracticeTime: number // En heures
  milestones: Milestone[]     // Étapes de maîtrise
}

interface TechniqueCategory {
  id: string
  name: string                // "Legato", "Sweep", "Tapping"
  icon: string
  description: string
  techniqueCount: number
}

interface Milestone {
  id: string
  title: string               // "Clean execution at 60 BPM"
  description: string
  bpm?: number
  criteria: string            // Critère de validation
}
```

**Catégories de techniques :**

| Catégorie | Techniques |
|-----------|-------------|
| **Legato** | Hammer-on, Pull-off, Trills, Slurs |
| **Sweep** | Basic Sweep, 5-string Sweep, Economy Picking |
| **Tapping** | Basic Tapping, Tapped Arpeggios, Multi-finger |
| **Bends** | Whole Bend, Pre-bend, Bend/Release, Vibrato Bend |
| **Sliding** | Slide, Glissando, Shifts |
| **Hybrid** | Hybrid Picking, Chicken Pickin' |
| **Rhythm** | Palm Mute, Ghost Notes, Strumming Patterns |
| **Harmonics** | Natural, Artificial, Pinch, Tap |
| **Fingerstyle** | Fingerpicking Patterns, Percussive |

### 2. Système de Progression

**Par quoi ça remplace :** Les feuilles de progression papier

**Approche Adagio :**
- **Gamifié** : XP, badges, niveaux
- **Personnalisé** : Recommandations basées sur votre niveau
- **Social** (optionnel) : Partager ses réussites

**Spécifications :**

```typescript
interface UserProgress {
  userId: string
  techniques: TechniqueProgress[]
  overallLevel: PlayerLevel
  totalXP: number
  currentStreak: number        // Jours consécutifs de pratique
  badges: Badge[]
  achievements: Achievement[]
}

interface TechniqueProgress {
  techniqueId: string
  status: "locked" | "in-progress" | "learned" | "mastered"
  xp: number
  practiceCount: number        // Nombre de sessions
  totalPracticeTime: number    // En minutes
  lastPracticed: DateTime
  milestonesCompleted: string[] // IDs des milestones atteints
  nextMilestone?: string
}

interface PlayerLevel {
  level: number                // 1-10
  title: string               // "Beginner", "Intermediate"...
  xpToNext: number
  totalXP: number
}

interface Badge {
  id: string
  name: string                // "Legato Master"
  description: string
  icon: string
  earnedAt: DateTime
}

interface Achievement {
  id: string
  title: string               // "7-Day Streak"
  description: string
  icon: string
  unlockedAt: DateTime
}
```

**Niveaux de joueur :**

| Niveau | XP Requis | Titre | Compétences typiques |
|--------|-----------|-------|---------------------|
| 1 | 0-100 | Novice | Open chords, basic strumming |
| 2 | 100-300 | Débutant | Power chords, basic bends |
| 3 | 300-600 | Apprenti | Barre chords, hammer-ons |
| 4 | 600-1000 | Intermédiaire | Scales, basic soloing |
| 5 | 1000-1500 | Musicien | Modes, arpeggios |
| 6 | 1500-2500 | Avancé | Sweep, tapping |
| 7 | 2500-4000 | Expert | Complex techniques |
| 8 | 4000-6000 | Maître | Virtuosité |
| 9 | 6000-10000 | Grand Maître | Tout maîtrise |
| 10 | 10000+ | Légende | Inatteignable |

### 3. Recommandations Intelligentes

**Par quoi ça remplace :** Les parcours d'apprentissage génériques

**Approche Adagio :**
- **Basé sur votre niveau** : Techniques appropriées à vos capacités
- **Selon vos intérêts** : Rock, Jazz, Metal, Funk...
- **Adaptatif** : Recommande selon vos réussites

**Spécifications :**

```typescript
interface RecommendationEngine {
  getRecommendations(userId: string): Technique[]
}

interface Recommendation {
  technique: Technique
  reason: string               // "Parce que vous maîtrisez X"
  priority: "high" | "medium" | "low"
  estimatedTime: number        // En heures
}
```

**Logique de recommandation :**
1. Si l'utilisateur maîtrise "Hammer-on" → recommander "Pull-off"
2. Si l'utilisateur aime "Jazz" → recommander "Walking Bass Lines"
3. Si l'utilisateur pratique 7 jours de suite → recommander une technique "Fun"

### 4. Mode Pratique

**Par quoi ça remplace :** Le métronome + feuille de progression

**Approche Adadgio :**
- **Intégré** : Métronome, playback, ralenti
- **Guidé** : La technique affichée pendant la pratique
- **Tracké** : Temps de pratique automatiquement enregistré

**Spécifications :**

```typescript
interface PracticeModeProps {
  technique: Technique
  bpm: number
  settings: PracticeSettings
  onComplete: (result: PracticeResult) => void
}

interface PracticeSettings {
  metronomeEnabled: boolean
  loopPlayback: boolean
  slowdownFactor: number       // 0.5 = demi vitesse
  showFretboard: boolean
}

interface PracticeResult {
  techniqueId: string
  duration: number             // En minutes
  bpm: number
  milestonesCompleted?: string[]
  quality: "needs-work" | "good" | "excellent"
}
```

---

## Architecture Technique

### Frontend (Next.js)

```
features/grimoire/
├── components/
│   ├── TechniqueLibrary.tsx       # Page principale
│   ├── TechniqueCard.tsx          # Carte de technique
│   ├── TechniqueDetail.tsx        # Page détail
│   ├── CategoryFilter.tsx         # Filtre par catégorie
│   ├── DifficultyFilter.tsx       # Filtre par difficulté
│   ├── ProgressOverview.tsx       # Vue d'ensemble progression
│   ├── MilestoneTracker.tsx       # Suivi des milestones
│   ├── PracticeMode.tsx           # Mode pratique
│   ├── Metronome.tsx              # Métronome intégré
│   └── BadgeGallery.tsx           # Galerie des badges
├── hooks/
│   ├── useTechniques.ts           # Fetch techniques
│   ├── useProgress.ts             # Progression utilisateur
│   ├── usePractice.ts             # Mode pratique
│   └── useRecommendations.ts      # Recommandations
├── actions/
│   ├── markPracticed.ts           # Server Action
│   ├── updateProgress.ts           # Server Action
│   └── completeMilestone.ts       # Server Action
└── types.ts
```

### API Endpoints

```
GET    /library/techniques              # Liste des techniques
GET    /library/techniques/:id          # Détail d'une technique
GET    /library/categories              # Liste des catégories
POST   /library/techniques/:id/practice # Marquer comme pratiqué
GET    /users/me/progress               # Progression utilisateur
POST   /users/me/progress/:id/milestone # Compléter un milestone
GET    /users/me/recommendations        # Recommandations
```

### Database Schema

```prisma
model Technique {
  id                  String   @id @default(cuid())
  slug                String   @unique
  name                String
  category            String
  difficulty          String
  description         String   @db.Text

  diagramUrl          String
  videoUrl            String?
  audioExample        String?
  notation            String   @db.Text
  tips                Json     // Array of strings

  prerequisites       Json     // Array of technique IDs
  relatedTechniques   Json     // Array of technique IDs
  estimatedPracticeTime Int

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([category, difficulty])
}

model UserProgress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  techniqueId     String
  status          String   @default("locked") // locked, in-progress, learned, mastered
  xp              Int      @default(0)
  practiceCount   Int      @default(0)
  totalPracticeTime Int    @default(0) // en minutes
  lastPracticed   DateTime?
  milestonesCompleted Json  // Array of milestone IDs

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, techniqueId])
}

model Badge {
  id          String   @id @default(cuid())
  name        String
  description String
  icon        String
  criteria    Json     // Conditions pour débloquer
}
```

---

## UX/UI Details

### Layout

**Desktop :**
```
┌─────────────────────────────────────────────────────────────────┐
│  ≡ The Grimoire                              [Progress] [🔍]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌───────────────────────────────────────────┐ │
│  │ Categories  │  │                                          │ │
│  │             │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐│ │
│  │ 🎸 Legato   │  │  │          │ │          │ │          ││ │
│  │ 🔄 Sweep    │  │  │ Technique│ │ Technique│ │ Technique││ │
│  │ 👆 Tapping  │  │  │   Card   │ │   Card   │ │   Card   ││ │
│  │ 🎵 Bends    │  │  │          │ │          │ │          ││ │
│  │ ⌨️ Hybrid   │  │  │ Hammer-on│ │ Pull-off │ │  Trills  ││ │
│  │ 🎼 Rhythm   │  │  └──────────┘ └──────────┘ └──────────┘│ │
│  │ ✨ Harmonics│  │                                          │ │
│  │             │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐│ │
│  │ Filter:     │  │  │          │ │          │ │          ││ │
│  │ ⭐ Beginner │  │  │ Technique│ │ Technique│ │ Technique││ │
│  │ ⭐⭐ Interm. │  │  │   Card   │ │   Card   │ │   Card   ││ │
│  │ ⭐⭐⭐ Adv.  │  │  └──────────┘ └──────────┘ └──────────┘│ │
│  └─────────────┘  │                                          │ │
│                  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile :**
```
┌─────────────────────────────┐
│  ≡ Grimoire          [🔍]   │
├─────────────────────────────┤
│  Categories                 │
│  ┌───┬───┬───┬───┐        │
│  │Lega│Swee│Tapp│Bend│        │
│  │tio │p   │ing │s   │        │
│  └───┴───┴───┴───┘        │
│                             │
│  Difficulty: [Intermediate▼]│
│                             │
│  ┌───────────────────────┐  │
│  │  Hammer-on            │  │
│  │  ⭐⭐ Beginner         │  │
│  │  Pratiqué 5x          │  │
│  │  [▓▓▓▓░] 80% mastered │  │
│  │  [Pratiquer]          │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Pull-off             │  │
│  │  ⭐⭐ Intermediate     │  │
│  │  Nouveau!             │  │
│  │  [Découvrir]          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Progress Visualization

**Technique Card :**
```
┌─────────────────────┐
│  Hammer-on          │
│  ⭐⭐ Beginner       │
│                     │
│  ┌───────────────┐  │
│  │    [VIDEO]    │  │
│  │   ▶ Play      │  │
│  └───────────────┘  │
│                     │
│  Lever et faire     │
│  retomber une note  │
│  pour créer une     │
│  liaison fluide.    │
│                     │
│  ┌───────────────┐  │
│  │ ▓▓▓▓▓▓░░ 80%  │  │
│  │ Mastered     │  │
│  └───────────────┘  │
│                     │
│  XP: 80/100          │
│  [Continuer]        │
└─────────────────────┘
```

---

## Gamification

### Badges

| Badge | Condition |
|-------|-----------|
| 🎸 **First Chord** | Apprendre votre première technique |
| 🔥 **On Fire** | 7 jours consécutifs de pratique |
| 🏃 **Speed Demon** | Atteindre 160 BPM sur une technique |
| 🧠 **Theory Master** | Maîtriser 10+ théories |
| 🌟 **Rising Star** | Atteindre le niveau 5 |
| 👑 **Virtuoso** | Maîtriser 50+ techniques |

### XP Rewards

| Action | XP |
|--------|-----|
| Pratiquer une technique | +10 XP |
| Atteindre un milestone | +50 XP |
| Maîtriser une technique | +100 XP |
| Compléter une catégorie | +500 XP |
| 7-day streak | +200 XP |

---

## Cas d'Usage

### Cas 1 : Apprendre une nouvelle technique

1. L'utilisateur ouvre le Grimoire
2. Il filtre par catégorie "Legato" et difficulté "Beginner"
3. Il voit "Hammer-on" avec 80% de progression
4. Il clique pour voir le détail
5. Il regarde la vidéo de démonstration
6. Il lance le "Mode Pratique" avec métronome à 60 BPM
7. Il pratique 10 minutes
8. La progression passe à 85%
9. Il débloque le badge "On Fire" (5ème jour consécutif)

### Cas 2 : Suivre les recommandations

1. L'utilisateur a fini "Hammer-on"
2. Le système recommande "Pull-off" (prochaine logique)
3. Il voit aussi "Trills" (variante intéressante)
4. Il choisit "Pull-off"
5. La fiche explique : "Comme le hammer-on mais inversé"

### Cas 3 : Voir sa progression globale

1. L'utilisateur clique sur "Progress" en haut
2. Il voit :
   - Niveau 4 (Intermediate)
   - 850/1000 XP pour le niveau 5
   - 12 techniques maîtrisées
   - 5 en cours
   - Badges : "First Chord", "On Fire", "Theory Novice"
3. Il se sent motivé pour continuer

---

## Success Metrics

- **Engagement** : 60% des utilisateurs pratiquent une technique/semaine
- **Complétion** : 40% des techniques débutées sont maîtrisées
- **Rétention** : 70% des utilisateurs reviennent dans les 30 jours

---

*Feature specification v1.0 — Dernière mise à jour : 2025-03-02*
