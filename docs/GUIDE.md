# 🎼 ADAGIO — Guide Complet

> *Une promenade architecturale à travers l'atlas harmonique intelligent*

---

## Table des Matières

1. [Introduction](#introduction)
2. [Vision du Produit](#vision-du-produit)
3. [Parcours Utilisateur](#parcours-utilisateur)
4. [Architecture par Couche](#architecture-par-couche)
5. [Patterns & Conventions](#patterns--conventions)
6. [Workflow de Développement](#workflow-de-développement)

---

## Introduction

### Qu'est-ce qu'Adagio ?

Adagio est un **atlas harmonique intelligent** pour guitaristes. Contrairement aux dictionnaires d'accords traditionnels qui présentent l'information de manière statique et académique, Adagio :

- **Traduit les émotions en musique** — "Aérien", "Sombre", "James Bond" comme critères de recherche
- **Visualise les relations** — Cercle des quintes dynamique, Axis Theory interactive
- **Guide la composition** — Assistant de progressions avec suggestions en temps réel

### Pourquoi "Adagio" ?

En musique, *adagio* signifie "lentement, à l'aise" — une approche posée de l'apprentissage. Ce nom reflète notre philosophie :

> La maîtrise ne vient pas de la vitesse, mais de la compréhension profonde et intuitive.

---

## Vision du Produit

### Public Cible

| Profil | Besoin | Solution Adagio |
|--------|--------|-----------------|
| **Guitariste Intermédiaire** | Bloqué sur le manche, veut comprendre les relations | Fretboard interactif + Axis Theory |
| **Compositeur** | Cherche des couleurs harmoniques | Mapping émotionnel des modes |
| **Professeur** | Outil pédagogique visuel | Grimoire avec progression |

### Différenciation

| Concurrent | Approche | Limite | Adagio |
|------------|----------|--------|--------|
| Ultimate Guitar | Base de données d'accords | Statique, non contextuel | Dynamique + suggestions |
| Twelve Assistant | Visualisation moderne | Interface complexe | Parcours guidé + langage humain |
| Musescore | Édition de partition | Trop complexe pour la théorie | Focus sur l'intuition |

---

## Parcours Utilisateur

### Le Workflow Adagio

```
┌─────────────────────────────────────────────────────────────┐
│                    1. CHOISIR UNE TONALITÉ                   │
│                  "Je veux jouer en Mi Mineur"                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               2. EXPLORER PAR SENSATION                      │
│         "Je veux quelque chose de sombre, espagnol"          │
│              → Phrygien recommandé                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              3. VISUALISER SUR LE MANCHE                      │
│        Fretboard interactif avec intervalles colorés         │
└─────────────────────────────────────────────────────────────┐
                              ↓
┌─────────────────────────────────────────────────────────────┐
│             4. CONSTRUIRE UNE PROGRESSION                     │
│         Glisser-déposer : i → IV → v → i7                     │
│         Suggestions : "Utiliser Dorien sur le IV"            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            5. SAUVEGARDER & PRATIQUER                         │
│         Synchronisation cloud sur tous les appareils         │
└─────────────────────────────────────────────────────────────┘
```

### Stories Utilisateur

#### Story 1 : Le Guitariste qui bloque
> *Je connais mes pentes mais je ne sais pas quoi jouer ailleurs.*

**Solution Adagio :**
1. Sélectionner la tonalité
2. Voir tous les modes disponibles sur le fretboard
3. Comprendre visuellement les différences (altérations surlignées)
4. Écouter chaque mode pour développer l'oreille

#### Story 2 : Le Compositeur en panne d'inspiration
> *J'ai mes accords mais ça sonne plat.*

**Solution Adagio :**
1. Entrer sa progression dans le Composer's Assistant
2. Recevoir des suggestions de substitution (tritonique, relative)
3. Explorer les "sensations" associées à chaque degré
4. Tester les alternatives en un clic

#### Story 3 : L'Étudiant qui veut progresser
> *Je veux apprendre de nouvelles techniques de manière structurée.*

**Solution Adagio :**
1. Parcourir le Grimoire (techniques organisées)
2. Voir des démonstrations visuelles sur le fretboard
3. Marquer comme "Appris" pour suivre sa progression
4. Recevoir des recommandations basées sur son niveau

---

## Architecture par Couche

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION                            │
├─────────────────────────────────────────────────────────────────┤
│  Web (Next.js)  │  Mobile (React Native)  │  Future (Desktop)  │
│  App Router     │  Expo                   │  Electron / Tauri  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SHARED UI LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  packages/ui/ — Design System (Shadcn + NativeWind variants)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       STATE & DATA                              │
├─────────────────────────────────────────────────────────────────┤
│  TanStack Query  │  TanStack Form  │  Zustand (UI state)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                             │
├─────────────────────────────────────────────────────────────────┤
│  packages/theory/ — Tonal.js wrapper + Custom calculations      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  NestJS Backend — Auth, Theory, Users, Library modules         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  Neon (PostgreSQL) — Prisma ORM + Drizzle for migrations        │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Web (Next.js 16)

**Architecture :** App Router avec React Server Components

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── harmonic-engine/
│   │   ├── composer-assistant/
│   │   └── grimoire/
│   ├── api/                 # API Routes (webhooks only)
│   └── layout.tsx
├── features/
│   ├── auth/
│   │   ├── components/      # LoginForm, RegisterForm
│   │   ├── hooks/           # useAuth (client)
│   │   └── actions/         # Server Actions (BetterAuth)
│   ├── fretboard/
│   │   ├── components/      # Fretboard, Note, Interval
│   │   └── hooks/           # useFretboardInteraction
│   ├── circle-of-fifths/
│   ├── progression-builder/
│   └── grimoire/
└── ui/
    ├── atoms/               # Button, Input, Badge...
    ├── molecules/           # ChordCard, ModeSelector...
    └── organisms/           # FretboardWithControls...
```

**Règles :**
- ✅ Server Components par défaut
- ✅ Client Components uniquement pour l'interactivité
- ✅ Server Actions pour les mutations
- ✅ TanStack Query pour le data fetching client

### Mobile (React Native + Expo)

**Architecture :** Expo Router avec NativeWind

```
apps/mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── index.tsx        # Harmonic Engine
│   │   ├── composer.tsx     # Progression Builder
│   │   └── grimoire.tsx     # Knowledge Base
│   └── _layout.tsx
├── features/
│   ├── fretboard/
│   │   ├── components/      # RN-specific Fretboard
│   │   └── gestures/        # Touch handling
│   ├── offline/
│   │   └── sync/            # Offline-first storage
│   └── haptic/
│       └── feedback.tsx     # Haptic helpers
└── ui/
    └── components/          # NativeWind variants
```

**Spécificités Mobile :**
- Offline mode avec AsyncStorage
- Haptic feedback sur les interactions
- Gestures natives (pinch to zoom fretboard)
- Synchronisation background avec React Native Queue

### Backend (NestJS)

**Architecture Modulaire :**

```
apps/api/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/      # JWT + BetterAuth integration
│   │   └── guards/
│   ├── theory/
│   │   ├── theory.module.ts
│   │   ├── theory.controller.ts
│   │   ├── theory.service.ts
│   │   └── dto/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── library/
│   │   ├── library.module.ts
│   │   ├── chords/
│   │   ├── scales/
│   │   └── progressions/
│   ├── progress/
│   │   ├── progress.module.ts
│   │   └── progress.service.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
```

**API Design :**

```typescript
// RESTful + WebSocket pour temps réel

GET    /api/v1/modes           // Liste tous les modes
GET    /api/v1/modes/:slug     // Détails d'un mode
GET    /api/v1/keys/:key/modes // Modes d'une tonalité

GET    /api/v1/progressions    // Progressions de l'utilisateur
POST   /api/v1/progressions    // Créer une progression
PATCH  /api/v1/progressions/:id
DELETE /api/v1/progressions/:id

WS     /api/v1/jam             // Session de jam en temps réel
```

---

## Patterns & Conventions

### Conventions de Code

#### TypeScript Strict
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

#### Naming Conventions
```typescript
// Composants : PascalCase
export function Fretboard({ notes }: FretboardProps) { }

// Hooks : camelCase with "use" prefix
export function useFretboardInteraction() { }

// Utils : camelCase
export function calculateInterval(root: Note, target: Note) { }

// Types : PascalCase
export type FretboardProps = { }

// Interfaces : PascalCase with "I" prefix AVOIDED
export interface Chord { }  // ✅ Good
export interface IChord { } // ❌ Avoid
```

#### File Structure
```
feature/
├── components/
│   ├── ComponentName.tsx
│   ├── ComponentName.test.tsx
│   └── index.ts              # Barrel export
├── hooks/
│   └── useFeatureName.ts
├── actions/
│   └── server-action.ts      # Server actions (Next.js)
├── services/
│   └── feature.service.ts    # Business logic
├── types.ts                  # Public types
└── index.ts                  # Feature barrel export
```

### Design Patterns

#### 1. Feature-Based Architecture
Chaque fonctionnalité est un module autonome :

```typescript
// features/fretboard/index.ts
export { Fretboard } from './components/Fretboard'
export { useFretboard } from './hooks/useFretboard'
export type { FretboardProps, NotePosition } from './types'
```

#### 2. Composition Over Inheritance
```typescript
// ❌ Éviter
class MajorChord extends Chord { }

// ✅ Préférer
export function Chord({ quality, extensions }: ChordProps) {
  return <div className={`chord chord-${quality}`}>{...}</div>
}
```

#### 3. Server First, Client Enhanced
```typescript
// ✅ Server Component par défaut
export default async function ModesPage() {
  const modes = await db.mode.findMany()  // Exécuté sur le serveur
  return <ModeList modes={modes} />
}

// ✅ Client Component pour l'interactivité
'use client'
export function ModeSelector({ modes }: { modes: Mode[] }) {
  const [selected, setSelected] = useState(null)
  return <select onChange={(e) => setSelected(e.target.value)}>{...}</select>
}
```

#### 4. Barrel Exports
```typescript
// ui/index.ts
export { Button } from './atoms/Button'
export { Input } from './atoms/Input'
export { Card } from './molecules/Card'

// Usage simplifié
import { Button, Input, Card } from '@/ui'
```

---

## Workflow de Développement

### Git Flow

```
main                ──────●──────●────  (production)
                      │
                      └── develop ●────●────  (intégration)
                                    │
        ┌───────────────────────────┼───────────────────────┐
        │                           │                       │
  feature/fretboard         feature/auth            feature/circle
        │                           │                       │
        ●───────●                   ●───────●               ●───────●
```

### Commit Convention

```
TYPE: PROJECT - vX.Y.Z

- Description du changement

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Types :**
- `RELEASE` — Breaking changes (MAJOR)
- `UPDATE` — Nouvelles fonctionnalités (MINOR)
- `PATCH` — Corrections de bugs (PATCH)

### Processus de Développement

#### 1. Créer une Feature
```bash
git checkout -b feature/fretboard-component
pnpm install
pnpm dev:web
```

#### 2. Développer avec Tests
```bash
# Écrire le test d'abord (TDD)
pnpm test --watch

# Puis implémenter
# apps/web/features/fretboard/components/Fretboard.tsx
```

#### 3. Quality Gates
```bash
# Linting
pnpm lint

# Type checking
pnpm typecheck

# Tests
pnpm test

# Build verification
pnpm build
```

#### 4. Commit & Push
```bash
git add .
git commit -m "UPDATE: Adagio - v0.2.0

- Added: Fretboard component with interactive notes
- Improved: Interval visualization with color coding

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Ressources

### Documentation Interne
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Architecture technique détaillée
- [PROGRESS.md](./PROGRESS.md) — Suivi de l'avancement
- [API.md](./API.md) — Documentation de l'API

### Documentation Externe
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Tonal.js Documentation](https://tonaljs.github.io/tonal/)
- [BetterAuth Documentation](https://www.better-auth.com/docs)

---

*Dernière mise à jour : 2025-03-02*
