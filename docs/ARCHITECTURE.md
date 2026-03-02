# Architecture Technique — ADAGIO

> *Architecture Fullstack/Cross-Platform pour l'atlas harmonique intelligent*

---

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Monorepo Structure](#monorepo-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Mobile Architecture](#mobile-architecture)
7. [Shared Packages](#shared-packages)
8. [Deployment](#deployment)

---

## Vue d'Ensemble

### Stack Technique

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Next.js 16     │  │  React Native    │  │    Future        │  │
│  │   (Web App)      │  │    (Expo)        │  │   (Desktop)      │  │
│  │                  │  │                  │  │                  │  │
│  │  • App Router    │  │  • Expo Router   │  │  • Electron      │  │
│  │  • React 19      │  │  • NativeWind    │  │  • Tauri (alt)   │  │
│  │  • RSC           │  │  • Expo SQLite   │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│           │                     │                     │              │
└───────────┼─────────────────────┼─────────────────────┼──────────────┘
            │                     │                     │
            └─────────────────────┴─────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         SHARED LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   UI Package     │  │  Theory Package  │  │   Config Package │  │
│  │                  │  │                  │  │                  │  │
│  │  • Shadcn/UI     │  │  • Tonal.js      │  │  • ESLint        │  │
│  │  • Tailwind      │  │  • Calculs       │  │  • TypeScript     │  │
│  │  • Variants RN   │  │  • Types         │  │  • Vitest        │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                     NestJS Backend                                   │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │    Auth     │  │   Theory    │  │   Users     │  │  Library   │ │
│  │   Module    │  │   Module    │  │   Module    │  │   Module   │ │
│  │             │  │             │  │             │  │            │ │
│  │  BetterAuth │  │  Tonal.js   │  │  Profile    │  │  CSV Data  │ │
│  │  + JWT      │  │  Wrapper    │  │  Progress   │  │  Import    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                      Neon (PostgreSQL)                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Prisma ORM                                │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐    │   │
│  │  │  users  │  │  modes  │  │ chords  │  │ progressions │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────────┘    │   │
│  │                                                                │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐    │   │
│  │  │progress │  │technique│  │ library │  │  sessions    │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Choix Architecturaux

| Décision | Raison | Alternative Rejetée |
|----------|--------|---------------------|
| **Monorepo** | Partage du code (UI, théorie) | Multi-repos (duplication) |
| **Next.js 16** | RSC, App Router, SEO | Vite + React (pas de SSR) |
| **NestJS** | Architecture modulaire, TypeScript | Express (moins structuré) |
| **Neon** | Serverless, branches, scalabilité | Supabase (vendor lock-in) |
| **BetterAuth** | Moderne, flexible, type-safe | NextAuth (moins modulaire) |
| **TanStack Query** | Cache, background refetch | SWR (moins de features) |

---

## Monorepo Structure

### Arborescence Complète

```
adagio/
├── apps/
│   ├── web/                    # Next.js 16 Frontend
│   │   ├── .next/
│   │   ├── app/
│   │   │   ├── (auth)/         # Route group: auth pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/    # Route group: authenticated pages
│   │   │   │   ├── harmonic-engine/
│   │   │   │   ├── composer-assistant/
│   │   │   │   └── grimoire/
│   │   │   ├── api/            # API Routes (webhooks only)
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Home page
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/
│   │   │   ├── fretboard/
│   │   │   ├── circle-of-fifths/
│   │   │   ├── progression-builder/
│   │   │   ├── mode-explorer/
│   │   │   └── grimoire/
│   │   ├── ui/                 # App-specific UI
│   │   ├── lib/
│   │   │   ├── db/             # Database client
│   │   │   └── utils/
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── mobile/                 # React Native (Expo)
│   │   ├── .expo/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/
│   │   │   └── _layout.tsx
│   │   ├── features/
│   │   │   ├── fretboard/
│   │   │   ├── offline/
│   │   │   └── haptic/
│   │   ├── ui/                 # NativeWind components
│   │   ├── assets/
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── auth/
│       │   ├── theory/
│       │   ├── users/
│       │   ├── library/
│       │   ├── progress/
│       │   ├── common/
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       ├── test/
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared Design System
│   │   ├── src/
│   │   │   ├── atoms/          # Button, Input, Badge...
│   │   │   ├── molecules/      # ChordCard, ModeSelector...
│   │   │   ├── organisms/      # FretboardWithControls...
│   │   │   ├── templates/      # Page layouts
│   │   │   └── index.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── theory/                 # Music Theory Engine
│   │   ├── src/
│   │   │   ├── core/           # Note, Interval, Scale classes
│   │   │   ├── calculators/    # Fretboard, Circle of Fifths
│   │   │   ├── mappings/       # Emotion ↔ Mode mappings
│   │   │   ├── tonal.ts        # Tonal.js wrapper
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── database/               # Shared Database Package
│   │   ├── src/
│   │   │   ├── prisma.ts       # Prisma client singleton
│   │   │   ├── seed.ts         # Seed data from CSV
│   │   │   └── migrations/
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Single source of truth
│   │   └── package.json
│   │
│   ├── api-client/             # Typed API Client
│   │   ├── src/
│   │   │   ├── client.ts       # Fetch wrapper
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── theory.ts
│   │   │   │   └── users.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                 # Shared Configuration
│   │   ├── eslint/
│   │   │   ├── base.js
│   │   │   ├── next.js
│   │   │   ├── react.js
│   │   │   └── nestjs.js
│   │   ├── tsconfig/
│   │   │   ├── base.json
│   │   │   ├── next.json
│   │   │   └── nest.json
│   │   └── package.json
│   │
│   └── types/                  # Shared TypeScript Types
│       ├── src/
│       │   ├── music.ts        # Note, Interval, Chord types
│       │   ├── user.ts         # User, Profile types
│       │   ├── progression.ts  # Progression types
│       │   └── index.ts
│       └── package.json
│
├── docs/                       # Documentation
│   ├── GUIDE.md                # Ce fichier
│   ├── ARCHITECTURE.md         # Architecture détaillée
│   ├── PROGRESS.md             # Suivi d'avancement
│   ├── API.md                  # Documentation API
│   └── features/               # Documentation par feature
│
├── data/                       # Source Data (CSV)
│   ├── Modes.csv
│   ├── Gammes.csv
│   ├── Accords.csv
│   ├── Triades.csv
│   ├── Progressions.csv
│   ├── Harmonie.csv
│   ├── Techniques.csv
│   └── Notes & Conseils.csv
│
├── scripts/                    # Utility scripts
│   ├── seed-db.ts
│   ├── csv-to-json.ts
│   └── migrate.ts
│
├── .github/
│   └── workflows/              # CI/CD
│
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo config
├── package.json
├── tsconfig.json
└── README.md
```

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Frontend Architecture

### Next.js 16 App Router

#### Route Structure

```
app/
├── (auth)/                    # Auth route group (no layout)
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── register/
│       └── page.tsx           # Register page
│
├── (dashboard)/               # Dashboard route group
│   ├── layout.tsx             # Dashboard layout (requires auth)
│   ├── page.tsx               # Dashboard home
│   │
│   ├── harmonic-engine/       # Feature: Harmonic Engine
│   │   ├── page.tsx           # Main page (Server Component)
│   │   ├── loading.tsx        # Loading UI
│   │   └── error.tsx          # Error UI
│   │
│   ├── composer-assistant/    # Feature: Progression Builder
│   │   └── ...
│   │
│   └── grimoire/              # Feature: Knowledge Base
│       └── ...
│
├── api/                       # API Routes (webhooks only)
│   ├── webhooks/
│   │   └── stripe/route.ts    # Stripe webhooks
│   └── trpc/[...]/ts          # tRPC endpoint (optional)
│
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page
├── loading.tsx                # Global loading
├── error.tsx                  # Global error
├── not-found.tsx              # 404 page
└── globals.css                # Global styles
```

#### Server vs Client Components

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVER COMPONENTS                         │
│                   (Default Behavior)                         │
├─────────────────────────────────────────────────────────────┤
│ • Data fetching (DB, API)                                    │
│ • Auth checks                                               │
│ • Layout components                                         │
│ • Pages (by default)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CLIENT COMPONENTS                         │
│                  ('use client' directive)                    │
├─────────────────────────────────────────────────────────────┤
│ • Interactive UI (onClick, onChange)                        │
│ • Browser APIs (localStorage, audio)                        │
│ • State (useState, useReducer)                              │
│ • Side effects (useEffect)                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SERVER ACTIONS                            │
│                  ('use server' directive)                    │
├─────────────────────────────────────────────────────────────┤
│ • Mutations (create, update, delete)                        │
│ • Form handling                                             │
│ • Protected operations                                      │
└─────────────────────────────────────────────────────────────┘
```

#### Feature Module Pattern

```typescript
// features/fretboard/components/Fretboard.tsx
'use client'

import { useCallback, useState } from 'react'
import { Note } from '@adagio/types'
import { useFretboardNotes } from '../../hooks/useFretboardNotes'
import { playNote } from '../../lib/audio'

export interface FretboardProps {
  key: string           // Tonalité (ex: "C")
  scale: string[]       // Gamme à afficher
  showIntervals?: boolean
  onNoteClick?: (note: Note) => void
}

export function Fretboard({
  key,
  scale,
  showIntervals = false,
  onNoteClick
}: FretboardProps) {
  const notes = useFretboardNotes(key, scale)
  const [hoveredNote, setHoveredNote] = useState<Note | null>(null)

  const handleNoteClick = useCallback((note: Note) => {
    playNote(note)
    onNoteClick?.(note)
  }, [onNoteClick])

  return (
    <div className="fretboard-container">
      <svg className="fretboard" viewBox="0 0 1200 200">
        {/* Cordes */}
        {[0, 1, 2, 3, 4, 5].map(string => (
          <line
            key={`string-${string}`}
            y1={string * 30 + 20}
            y2={string * 30 + 20}
            x1="0"
            x2="1200"
            className="string"
          />
        ))}
        {/* Frettes */}
        {/* Notes */}
        {notes.map(note => (
          <NoteMarker
            key={`${note.string}-${note.fret}`}
            note={note}
            isHighlighted={scale.includes(note.name)}
            showInterval={showIntervals}
            onClick={handleNoteClick}
            onHover={setHoveredNote}
          />
        ))}
      </svg>
      {hoveredNote && (
        <NoteTooltip note={hoveredNote} />
      )}
    </div>
  )
}
```

```typescript
// features/fretboard/hooks/useFretboardNotes.ts
'use client'

import { useMemo } from 'react'
import { Note } from '@adagio/types'
import { getScaleNotes } from '@adagio/theory'

export function useFretboardNotes(key: string, scale: string[]) {
  return useMemo(() => {
    const scaleNotes = getScaleNotes(key, scale)
    const allNotes: Note[] = []

    // Générer les notes pour toute la grille du manche
    for (let string = 0; string < 6; string++) {
      for (let fret = 0; fret < 24; fret++) {
        const note = calculateNote(string, fret)
        allNotes.push({
          ...note,
          string,
          fret,
          inScale: scaleNotes.includes(note.name)
        })
      }
    }

    return allNotes
  }, [key, scale])
}
```

#### State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVER STATE                              │
│                    (TanStack Query)                          │
├─────────────────────────────────────────────────────────────┤
│ • User profile                                              │
│ • Saved progressions                                         │
│ • Learning progress                                         │
│ • Library data (modes, chords)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓ fetch from API

┌─────────────────────────────────────────────────────────────┐
│                    UI STATE                                  │
│                    (useState / Zustand)                      │
├─────────────────────────────────────────────────────────────┤
│ • Selected key/tonality                                     │
│ • Active mode/scale                                          │
│ • Fretboard view settings                                    │
│ • Current progression (draft)                                │
└─────────────────────────────────────────────────────────────┘
```

```typescript
// features/harmonic-engine/hooks/useHarmonicEngine.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@adagio/api-client'

// Server state avec TanStack Query
export function useModes() {
  return useQuery({
    queryKey: ['modes'],
    queryFn: () => createClient().modes.list()
  })
}

// UI state avec useState
export function useHarmonicEngine() {
  const [selectedKey, setSelectedKey] = useState('C')
  const [selectedMode, setSelectedMode] = useState('ionian')

  return {
    selectedKey,
    setSelectedKey,
    selectedMode,
    setSelectedMode
  }
}
```

---

## Backend Architecture

### NestJS Modular Structure

```typescript
apps/api/src/
├── main.ts                     # Application bootstrap
├── app.module.ts               # Root module
│
├── common/                     # Shared utilities
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── guards/
│   │   ├── jwt.guard.ts
│   │   └── api-key.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── middlewares/
│
├── auth/                       # Authentication Module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── better-auth.strategy.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh.dto.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── theory/                     # Music Theory Module
│   ├── theory.module.ts
│   ├── theory.controller.ts
│   ├── theory.service.ts
│   ├── dto/
│   │   ├── scale-query.dto.ts
│   │   ├── chord-query.dto.ts
│   │   └── progression-create.dto.ts
│   └── calculators/
│       ├── fretboard.calculator.ts
│       ├── circle-of-fifths.calculator.ts
│       └── axis-theory.calculator.ts
│
├── users/                      # Users Module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── update-profile.dto.ts
│   │   └── update-preferences.dto.ts
│   └── entities/
│       └── user.entity.ts
│
├── library/                    # Library Content Module
│   ├── library.module.ts
│   ├── library.controller.ts
│   ├── library.service.ts
│   ├── chords/
│   │   ├── chords.controller.ts
│   │   └── chords.service.ts
│   ├── scales/
│   │   ├── scales.controller.ts
│   │   └── scales.service.ts
│   ├── progressions/
│   │   ├── progressions.controller.ts
│   │   └── progressions.service.ts
│   └── techniques/
│       ├── techniques.controller.ts
│       └── techniques.service.ts
│
├── progress/                   # User Progress Module
│   ├── progress.module.ts
│   ├── progress.controller.ts
│   ├── progress.service.ts
│   ├── dto/
│   │   ├── mark-learned.dto.ts
│   │   └── update-progress.dto.ts
│   └── entities/
│       └── progress.entity.ts
│
├── prisma/                     # Prisma
│   ├── prisma.service.ts
│   └── migrations/
│
└── config/                     # Configuration
    ├── database.config.ts
    ├── jwt.config.ts
    └── better-auth.config.ts
```

### Module Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                         main.ts                              │
│                             ↓                                │
│                       app.module.ts                          │
│                              ↓                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AuthModule  │  │ TheoryModule │  │ UsersModule  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │LibraryModule │  │ProgressModule│  │ PrismaModule │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoint Design

```
API BASE URL: https://api.adagio.com/v1

┌─────────────────────────────────────────────────────────────┐
│ AUTH ENDPOINTS                                               │
├─────────────────────────────────────────────────────────────┤
│ POST   /auth/register          Create account                │
│ POST   /auth/login             Authenticate                  │
│ POST   /auth/logout            End session                   │
│ POST   /auth/refresh           Refresh token                 │
│ POST   /auth/forgot-password   Initiate reset               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ THEORY ENDPOINTS                                             │
├─────────────────────────────────────────────────────────────┤
│ GET    /theory/keys              List all keys               │
│ GET    /theory/keys/:key         Key details                │
│ GET    /theory/modes             List all modes              │
│ GET    /theory/modes/:slug       Mode details               │
│ GET    /theory/keys/:key/modes   Modes for a key            │
│ GET    /theory/scales            List all scales             │
│ GET    /theory/chords            List all chords             │
│ GET    /theory/chords/:id        Chord details              │
│ POST   /theory/analyze           Analyze progression         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ USER ENDPOINTS                                               │
├─────────────────────────────────────────────────────────────┤
│ GET    /users/me                 Current user profile        │
│ PATCH  /users/me                 Update profile              │
│ GET    /users/me/progressions    User's saved progressions  │
│ POST   /users/me/progressions    Save progression           │
│ DELETE /users/me/progressions/:id Delete progression        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LIBRARY ENDPOINTS                                            │
├─────────────────────────────────────────────────────────────┤
│ GET    /library/techniques      List all techniques          │
│ GET    /library/techniques/:id Technique details            │
│ POST   /library/techniques/:id/learn Mark as learned        │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Prisma Schema

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ AUTH & USERS ============

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  progressions  Progression[]
  progress      UserProgress[]
  preferences   UserPreferences?

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============ USER DATA ============

model UserPreferences {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Display preferences
  theme           String   @default("midnight")
  showIntervals   Boolean  @default(true)
  showNotes       Boolean  @default(true)
  showDegrees     Boolean  @default(false)

  // Instrument preferences
  tuning          String   @default("EADGBE")
  fretCount       Int      @default(24)

  // Audio preferences
  volume          Float    @default(0.7)
  metronomeVolume Float    @default(0.5)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("user_preferences")
}

model UserProgress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Progress tracking
  techniqueId     String
  learned         Boolean  @default(false)
  practicedCount  Int      @default(0)
  lastPracticed   DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, techniqueId])
  @@map("user_progress")
}

// ============ MUSIC CONTENT ============

model Mode {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // ex: "Dorien"
  intervals   String   @db.Text // JSON array: [1, 2, b3, 4, 5, 6, b7]

  // Emotional mapping
  character   String   @db.Text // ex: "Aérien / Lumineux"
  sensation   String   @db.Text // ex: "Jazzy, Chaud"
  feeling     String?  // ex: "Féerique, James Bond"

  // Theory
  greekName   String?  // ex: "Dorian"
  relativeTo  String?  // ex: "ii in major"
  axisGroup   String?  // ex: "Tonique"

  // Advice
  advice      String?  @db.Text

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("modes")
}

model Scale {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // ex: "Pentatonique Mineure"
  intervals   String   @db.Text
  type        String   // ex: "scale", "mode"

  @@map("scales")
}

model Chord {
  id          String   @id @default(cuid())
  name        String   // ex: "Cmaj7"
  root        String   // ex: "C"
  quality     String   // ex: "maj7"
  intervals   String   @db.Text
  extensions  String?  @db.Text

  // Fingerings stored as JSON
  fingerings  Json     // Array of fretboard positions

  @@map("chords")
}

model Progression {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String?
  key         String   // ex: "C"
  timeSignature String @default("4/4")
  chords      Json     // Array of chord symbols/degrees
  analysis    Json?    // Analysis results (suggested scales, etc.)

  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("progressions")
}

model Technique {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // ex: "Hammer-on"
  category    String   // ex: "Legato", "Sweep", "Tapping"
  description String?  @db.Text
  difficulty  String   // ex: "beginner", "intermediate", "advanced"

  // Visual aids
  diagramUrl  String?
  videoUrl    String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("techniques")
}

model HarmonyRule {
  id          String   @id @default(cuid())
  degree      String   // ex: "I", "IV", "v"
  tonality    String   // ex: "major", "minor"
  sensation   String   @db.Text // ex: "Être content à la maison"
  advice      String?  @db.Text

  @@unique([degree, tonality])
  @@map("harmony_rules")
}
```

---

## Mobile Architecture

### React Native (Expo)

```
apps/mobile/
├── app/
│   ├── _layout.tsx              # Root layout (provider setup)
│   ├── index.tsx                # Redirect based on auth
│   │
│   ├── (auth)/                  # Auth screens
│   │   ├── _layout.tsx          # No header/tab bar
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── index.tsx            # Tab 1: Harmonic Engine
│   │   ├── composer.tsx         # Tab 2: Progression Builder
│   │   ├── grimoire.tsx         # Tab 3: Knowledge Base
│   │   └── profile.tsx          # Tab 4: Profile
│   │
│   ├── modal.tsx                # Modal screens
│   └── [missing].tsx            # 404
│
├── features/
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── screens/
│   │
│   ├── fretboard/
│   │   ├── components/
│   │   │   ├── Fretboard.tsx        # SVG-based fretboard
│   │   │   ├── Fret.tsx
│   │   │   ├── String.tsx
│   │   │   └── NoteMarker.tsx
│   │   ├── gestures/
│   │   │   ├── useFretboardTap.ts
│   │   │   └── useFretboardZoom.ts
│   │   └── hooks/
│   │
│   ├── offline/
│   │   ├── hooks/
│   │   │   └── useOfflineMode.ts
│   │   ├── storage/
│   │   │   ├── async-storage.ts
│   │   │   └── sync-queue.ts
│   │   └── sync/
│   │       └── sync-manager.ts
│   │
│   └── haptic/
│       └── feedback.tsx         # Haptic helpers
│
├── ui/
│   ├── atoms/                   # NativeWind components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Text.tsx
│   └── molecules/
│       ├── ChordCard.tsx
│       └── ModeSelector.tsx
│
├── lib/
│   ├── audio/
│   │   └── tone-player.ts       # Tone.js wrapper for RN
│   └── api/
│       └── client.ts
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── sounds/
│
├── app.json                     # Expo config
├── tailwind.config.js           # NativeWind config
└── package.json
```

### Offline-First Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      OFFILE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  AsyncStorage                       │    │
│  │  • Cached modes/scales (static data)                │    │
│  │  • User progress (synced on reconnect)              │    │
│  │  • Sync queue (operations to sync)                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ↓                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Sync Manager                       │    │
│  │  • Queue operations when offline                    │    │
│  │  • Batch sync on reconnect                          │    │
│  │  • Conflict resolution (last write wins)            │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ↓                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   API Layer                          │    │
│  │  • Check connectivity before fetch                  │    │
│  │  • Return cached data if offline                    │    │
│  │  • Queue mutations for later sync                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Shared Packages

### UI Package (Design System)

```typescript
// packages/ui/src/atoms/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@adagio/ui/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'button',
          `button--${variant}`,
          `button--${size}`,
          className
        )}
        {...props}
      />
    )
  }
)
```

### Theory Package

```typescript
// packages/theory/src/core/Note.ts
export class Note {
  constructor(
    public readonly name: NoteName,  // C, C#, D, Db...
    public readonly octave: number
  ) {}

  get midi(): number {
    // Convert to MIDI number
  }

  transpose(interval: Interval): Note {
    // Return transposed note
  }

  frequency(a4 = 440): number {
    // Calculate frequency
  }
}

// packages/theory/src/calculators/FretboardCalculator.ts
export class FretboardCalculator {
  static getNotesForKey(key: Note, scale: Scale): FretboardNote[] {
    // Return all notes on the fretboard for this key/scale
  }

  static getIntervals(root: Note, scale: Scale): IntervalMap {
    // Map intervals to fret positions
  }
}
```

---

## Deployment

### Environments

```
┌─────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT                             │
├─────────────────────────────────────────────────────────────┤
│  • Local: localhost:3000 (web), localhost:3001 (api)        │
│  • Database: Neon branch (dev)                              │
│  • Auth: Development BetterAuth                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      STAGING                                 │
├─────────────────────────────────────────────────────────────┤
│  • Web: Vercel (staging.adagio.com)                         │
│  • API: Railway/Fly.io (api-staging.adagio.com)            │
│  • Database: Neon branch (staging)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
├─────────────────────────────────────────────────────────────┤
│  • Web: Vercel (adagio.com)                                 │
│  • API: Railway/Fly.io (api.adagio.com)                     │
│  • Database: Neon branch (production)                       │
│  • CDN: Vercel Edge for static assets                       │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build apps
        run: pnpm build

      - name: Deploy to Vercel (Web)
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Railway (API)
        run: railway deploy --serviceId=${{ secrets.RAILWAY_SERVICE_ID }}
```

---

*Dernière mise à jour : 2025-03-02*
