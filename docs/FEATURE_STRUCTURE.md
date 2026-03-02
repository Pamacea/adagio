# Structure Feature-Based — ADAGIO

> *Organisation du code par fonctionnalités, pas par types de fichiers*

---

## Philosophie

Au lieu d'organiser le code par type de fichier (`components/`, `hooks/`, `utils/`), Adagio utilise une **organisation par feature**. Chaque feature est un module autonome contenant tout ce dont elle a besoin.

---

## Pourquoi Feature-Based ?

| ❌ Architecture par Type | ✅ Feature-Based |
|------------------------|-----------------|
| Difficile de trouver ce qui appartient à quoi | Tout ce qui concerne une feature est au même endroit |
| Copier-coller de code entre features | Chaque feature est indépendante |
| Refactoriser = modifier 10 dossiers | Refactoriser = modifier 1 feature |
| Testing dispersé | Tests co-localisés avec le code |

---

## Arborescence Features

```
apps/web/features/
│
├── auth/                           # Module d'authentification
│   ├── components/                  # UI spécifique à l'auth
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── index.ts
│   ├── hooks/                       # Client-side logic
│   │   ├── useAuth.ts
│   │   └── useAuthError.ts
│   ├── actions/                     # Server Actions
│   │   ├── login.ts
│   │   ├── register.ts
│   │   └── resetPassword.ts
│   ├── services/                    # Business logic
│   │   └── auth.service.ts
│   ├── utils/                       # Helpers locaux
│   │   └── validation.ts
│   ├── types.ts                     # Types publics
│   ├── index.ts                     # Barrel export
│   └── __tests__/                   # Tests co-localisés
│       ├──LoginForm.test.tsx
│       └── auth.service.test.ts
│
├── harmonic-engine/                 # Module Harmonic Engine
│   ├── components/
│   │   ├── ModeExplorer.tsx         # Grille des modes
│   │   ├── ModeCard.tsx
│   │   ├── Fretboard.tsx            # Manche de guitare
│   │   ├── NoteMarker.tsx
│   │   ├── ModeComparator.tsx       # Comparaison de modes
│   │   ├── IntervalLegend.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useModes.ts              # Fetch des modes
│   │   ├── useFretboardNotes.ts     # Calcul des notes
│   │   ├── useModeComparison.ts     # Comparaison
│   │   └── useFretboardAudio.ts     # Playback audio
│   ├── actions/
│   │   └── getModeBySlug.ts
│   ├── services/
│   │   ├── fretboard.service.ts     # Logique du manche
│   │   └── mode.service.ts          # Logique des modes
│   ├── utils/
│   │   ├── interval-calculator.ts
│   │   └── note-mapper.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│       ├──ModeExplorer.test.tsx
│       └── Fretboard.test.tsx
│
├── composer-assistant/              # Module Progression Builder
│   ├── components/
│   │   ├── ProgressionBuilder.tsx   # Composant principal
│   │   ├── Timeline.tsx
│   │   ├── ChordCard.tsx
│   │   ├── DegreePalette.tsx        # Palette des degrés
│   │   ├── AnalysisPanel.tsx
│   │   ├── SubstitutionMenu.tsx
│   │   ├── ChordLibrary.tsx
│   │   ├── PlaybackControls.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useProgression.ts
│   │   ├── useProgressionAnalysis.ts
│   │   ├── usePlayback.ts
│   │   ├── useSubstitutions.ts
│   │   └── useChordLibrary.ts
│   ├── actions/
│   │   ├── saveProgression.ts
│   │   └── loadProgression.ts
│   ├── services/
│   │   ├── progression.service.ts
│   │   ├── analysis.service.ts
│   │   └── substitution.service.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│
├── circle-of-fifths/                # Module Cercle des Quintes
│   ├── components/
│   │   ├── CircleOfFifths.tsx       # Composant principal
│   │   ├── NoteSegment.tsx
│   │   ├── AxisOverlay.tsx          # Affichage Axis Theory
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useCircleData.ts
│   │   ├── useCircleRotation.ts
│   │   └── useAxisTheory.ts
│   ├── services/
│   │   ├── circle.service.ts
│   │   └── axis-theory.service.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│
├── grimoire/                        # Module Knowledge Base
│   ├── components/
│   │   ├── TechniqueLibrary.tsx
│   │   ├── TechniqueCard.tsx
│   │   ├── TechniqueDetail.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── ProgressOverview.tsx
│   │   ├── PracticeMode.tsx
│   │   ├── Metronome.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useTechniques.ts
│   │   ├── useProgress.ts
│   │   ├── usePractice.ts
│   │   └── useRecommendations.ts
│   ├── actions/
│   │   ├── markPracticed.ts
│   │   └── completeMilestone.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│
├── user/                            # Module User Profile
│   ├── components/
│   │   ├── ProfilePage.tsx
│   │   ├── PreferencesPanel.tsx
│   │   ├── StatsOverview.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useProfile.ts
│   │   └── usePreferences.ts
│   ├── actions/
│   │   └── updateProfile.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│
└── shared/                          # Shared feature utilities
    ├── components/
    │   ├── ErrorBoundary.tsx
    │   ├── LoadingSpinner.tsx
    │   └── index.ts
    ├── hooks/
    │   ├── useDebounce.ts
    │   └── useMediaQuery.ts
    └── index.ts
```

---

## Règles d'Organisation

### 1. Feature = Responsabilité Unique

Chaque feature correspond à une **responsabilité métier** claire :

| Feature | Responsabilité |
|---------|----------------|
| `auth` | Connexion, inscription, récupération mot de passe |
| `harmonic-engine` | Exploration des modes et gammes |
| `composer-assistant` | Création et analyse de progressions |
| `circle-of-fifths` | Visualisation du cercle des quintes |
| `grimoire` | Base de connaissances techniques |
| `user` | Profil et préférences utilisateur |

### 2. Structure Interne Standard

Chaque feature suit la même structure :

```
feature-name/
├── components/          # Composants UI de la feature
├── hooks/              # Hooks React (client-side)
├── actions/            # Server Actions (mutations)
├── services/           # Business logic pure
├── utils/              # Helpers locaux
├── types.ts            # Types publics de la feature
├── index.ts            # Barrel export
└── __tests__/          # Tests co-localisés
```

### 3. Imports Relatifs

À l'intérieur d'une feature, utiliser des imports relatifs :

```typescript
// ✅ Bon — Import relatif dans la feature
import { ModeCard } from '../components/ModeCard'
import { useModes } from '../hooks/useModes'

// ❌ Mauvais — Import absolu à l'intérieur d'une feature
import { ModeCard } from '@/features/harmonic-engine/components/ModeCard'
```

Entre features, utiliser des imports absolus :

```typescript
// ✅ Bon — Import absolu entre features
import { Fretboard } from '@/features/harmonic-engine'
import { useAuth } from '@/features/auth'

// ❌ Mauvais — Import relatif entre features
import { Fretboard } from '../../harmonic-engine/components/Fretboard'
```

### 4. Barrel Exports

Chaque dossier a un `index.ts` pour simplifier les imports :

```typescript
// features/harmonic-engine/components/index.ts
export { ModeExplorer } from './ModeExplorer'
export { ModeCard } from './ModeCard'
export { Fretboard } from './Fretboard'
export { NoteMarker } from './NoteMarker'

// Utilisation
import { ModeExplorer, Fretboard, ModeCard } from '@/features/harmonic-engine/components'
```

Feature-level barrel :

```typescript
// features/harmonic-engine/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'

// Utilisation
import { Fretboard, useModes, Mode } from '@/features/harmonic-engine'
```

---

## Communication Entre Features

### 1. Via Server Actions

```typescript
// features/grimoire/actions/markPracticed.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/features/auth/services/auth.service'
import { updateProgress } from '@/features/user/services/progress.service'

export async function markPracticed(techniqueId: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await updateProgress(session.user.id, techniqueId)
  revalidatePath('/grimoire')
}
```

### 2. Via Shared Hooks

```typescript
// features/shared/hooks/useCurrentUser.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../services/user.service'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })
}

// Utilisation dans n'importe quelle feature
import { useCurrentUser } from '@/features/shared/hooks/useCurrentUser'
```

### 3. Via Events (Event Bus)

```typescript
// packages/events/index.ts
import { EventEmitter } from 'events'

export const appEvents = new EventEmitter()

// Émettre un événement
appEvents.emit('progression:saved', { id: 'prog123' })

// Écouter un événement
appEvents.on('progression:saved', (data) => {
  console.log('Progression sauvegardée:', data.id)
})
```

---

## Partage de Code

### UI Package (Composants Génériques)

Les composants **réutilisables** vont dans `packages/ui/` :

```
packages/ui/
├── src/
│   ├── atoms/              # Composants atomiques (design system)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── ...
│   ├── molecules/          # Composants composés
│   │   ├── Card/
│   │   ├── Dialog/
│   │   └── ...
│   └── organisms/          # Composants complexes
│       ├── DataTable/
│       └── ...
└── index.ts
```

**Règle :** Si un composant est utilisé par **3+ features**, le déplacer dans `packages/ui/`.

### Theory Package (Logique Métier)

```
packages/theory/
├── src/
│   ├── core/              # Classes de base
│   │   ├── Note.ts
│   │   ├── Interval.ts
│   │   ├── Scale.ts
│   │   └── Chord.ts
│   ├── calculators/       # Fonctions de calcul
│   │   ├── FretboardCalculator.ts
│   │   ├── CircleCalculator.ts
│   │   └── AxisCalculator.ts
│   ├── mappings/          # Data mappings
│   │   ├── emotion-mapping.ts
│   │   └── degree-feelings.ts
│   └── index.ts
```

---

## Exemple Complet

### Feature : Mode Explorer

```typescript
// features/harmonic-engine/components/ModeExplorer.tsx
'use client'

import { useState } from 'react'
import { useModes } from '../hooks/useModes'
import { ModeCard } from './ModeCard'
import { Fretboard } from './Fretboard'

export function ModeExplorer() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const { modes, loading } = useModes()

  if (loading) return <LoadingSpinner />
  if (!modes) return <ErrorState />

  return (
    <div className="mode-explorer">
      <div className="mode-grid">
        {modes.map(mode => (
          <ModeCard
            key={mode.id}
            mode={mode}
            selected={selectedMode?.id === mode.id}
            onSelect={setSelectedMode}
          />
        ))}
      </div>

      {selectedMode && (
        <Fretboard
          key={selectedMode.id}
          mode={selectedMode}
        />
      )}
    </div>
  )
}
```

```typescript
// features/harmonic-engine/hooks/useModes.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { getModes } from '../services/mode.service'

export function useModes() {
  return useQuery({
    queryKey: ['modes'],
    queryFn: getModes,
  })
}
```

```typescript
// features/harmonic-engine/services/mode.service.ts
import { api } from '@adagio/api-client'
import type { Mode } from './types'

export async function getModes(): Promise<Mode[]> {
  const response = await api.get('/theory/modes')
  return response.data.modes
}
```

```typescript
// features/harmonic-engine/types.ts
export interface Mode {
  id: string
  slug: string
  name: string
  intervals: string[]
  character: string
  sensation: string
  feeling?: string
}

export interface ModeFilter {
  feeling?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}
```

```typescript
// features/harmonic-engine/index.ts
export * from './components'
export * from './hooks'
export * from './services'
export * from './types'
```

---

## Avantages

1. **Découverte** : Nouveau développeur ? Allez dans le dossier de la feature.
2. **Refactoring** : Modifier une feature ? Un seul dossier.
3. **Testing** : Tests à côté du code qu'ils testent.
4. **Suppression** : Supprimer une feature ? Un seul dossier.
5. **Autonomie** : Chaque feature peut être travaillée indépendamment.

---

*Documentation v1.0 — Dernière mise à jour : 2025-03-02*
