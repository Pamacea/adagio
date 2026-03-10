# ADAGIO - Plan d'Implémentation Complet

> **Version:** 1.0 | **Date:** 2025-03-06
> **Objectif:** Compléter l'application en passant des données hardcodées à une architecture complète avec DB, API et sync.

---

## 📊 Audit Actuel

### Ce qui est marqué "100%" mais N'EST PAS implémenté

| Module | Marqué | Réalité | Gap |
|--------|--------|---------|-----|
| BetterAuth fonctionnel | ✅ | ❌ Package auth inexistant, serveur non configuré | Complet |
| API NestJS connectée | ✅ | ❌ Frontend utilise des données hardcodées | Complet |
| TanStack Query utilisé | ✅ | ❌ Hooks existent mais PAS utilisés dans les pages | Complet |
| Seed Prisma (gammes/modes) | ✅ | ❌ Seed vide/incomplet | Complet |
| Sync Web/Mobile | ✅ | ❌ Aucune synchronisation | Complet |
| Données en DB | ✅ | ❌ Tout est hardcodé dans les composants | Complet |

### Ce qui EXISTE déjà

- ✅ Schéma Prisma complet avec tous les modèles
- ✅ NestJS API structure (contrôleurs créés)
- ✅ TanStack Query installé
- ✅ apiClient package
- ✅ Hook `useQuery` définis mais non utilisés
- ✅ BetterAuth controller proxy (NestJS)

---

## 🎯 Architecture Cible

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ADAGIO ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐                │
│  │   WEB APP   │      │  MOBILE APP │      │   API NES   │                │
│  │  (Next.js)  │◄────► │  (Expo)     │◄────► │   (NestJS)   │                │
│  │             │      │             │      │             │                │
│  │  TanStack   │      │  AsyncStorage│      │  BetterAuth │                │
│  │   Query     │      │   + Sync    │      │  Prisma     │                │
│  │             │      │             │      │             │                │
│  └─────────────┘      └─────────────┘      └──────┬──────┘                │
│                                                    │                        │
│                                                    ▼                        │
│                                              ┌─────────────┐                │
│                                              │  POSTGRES   │                │
│                                              │  DATABASE   │                │
│                                              └─────────────┘                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    DONNÉES HARDCODÉES (BACKUP)                        │ │
│  │  packages/theory/src/data/ - Référence pour seed                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Plan d'Exécution - 5 Modules

### 🔵 MODULE 1: Seed Prisma (P0 - 2-3h)

**Objectif:** Remplir la DB avec toutes les données musicales

#### 1.1 Données à Créer

| Entité | Quantité | Source |
|--------|----------|--------|
| Modes grecs | 7 | `packages/theory/src/data/modes.ts` |
| Gammes | 20+ | `packages/theory/src/data/scales.ts` |
| Accords | 50+ | `packages/theory/src/data/chords.ts` |
| Techniques | 20+ | Nouveau fichier |
| Achievements | 20+ | `apps/web/lib/constants.ts` |
| Règles harmoniques | Axis theory | `packages/theory/src/mappings/` |
| Leçons | 18 | `apps/web/app/lessons/page.tsx` |
| HarmonyRules | 30+ | Nouveau fichier |

#### 1.2 Fichiers à Créer/Modifier

```
packages/database/
├── prisma/
│   └── seed.ts                  ✅ Créer seed complet
├── src/
│   └── data/                    ✅ Créer données de référence
│       ├── modes.seed.ts        ✅
│       ├── scales.seed.ts       ✅
│       ├── chords.seed.ts       ✅
│       ├── techniques.seed.ts   ✅
│       ├── achievements.seed.ts ✅
│       ├── lessons.seed.ts      ✅
│       └── harmony.seed.ts      ✅
└── package.json                 ✅ Ajouter script seed
```

#### 1.3 Script Seed

```bash
# package.json
"scripts": {
  "seed": "tsx src/seed.ts",
  "seed:reset": "prisma migrate reset --force && npm run seed"
}
```

---

### 🔵 MODULE 2: BetterAuth + Prisma (P0 - 2-3h)

**Objectif:** Auth fonctionnelle avec Prisma

#### 2.1 Package Auth à Créer

```
packages/auth/
├── src/
│   ├── index.ts                 ✅ Export BetterAuth config
│   ├── schema.ts                ✅ Schema BetterAuth
│   └── adapter.ts               ✅ Prisma adapter
├── package.json
└── tsconfig.json
```

#### 2.2 Configuration BetterAuth

```typescript
// packages/auth/src/schema.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { prisma } from "@adagio/database"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
})
```

#### 2.3 Endpoints NestJS

```
apps/api/src/
├── better-auth/
│   ├── better-auth.controller.ts  ✅ Déjà existe, vérifier
│   ├── better-auth.module.ts      ✅ Déjà existe
│   └── index.ts                   ✅ Export handler
```

#### 2.4 Client Auth

```typescript
// packages/api-client/src/auth.ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/v1/auth',
})
```

---

### 🔵 MODULE 3: NestJS Endpoints (P0 - 3-4h)

**Objectif:** API complète pour toutes les features

#### 3.1 Contrôleurs à Créer/Compléter

```
apps/api/src/
├── lessons/
│   ├── lessons.controller.ts     ✅ NOUVEAU
│   ├── lessons.module.ts         ✅ NOUVEAU
│   ├── lessons.service.ts        ✅ NOUVEAU
│   └── dto/
│       ├── create-lesson.dto.ts
│       └── update-lesson.dto.ts
│
├── achievements/
│   ├── achievements.controller.ts ✅ NOUVEAU
│   ├── achievements.module.ts    ✅ NOUVEAU
│   ├── achievements.service.ts   ✅ NOUVEAU
│   └── dto/
│       └── unlock-achievement.dto.ts
│
├── user-progress/
│   ├── progress.controller.ts    ✅ RENOMMER depuis "progress"
│   ├── progress.module.ts        ✅ Déjà existe
│   ├── progress.service.ts       ✅ Compléter
│   └── dto/
│       ├── save-progress.dto.ts  ✅ Déjà existe
│       └── complete-lesson.dto.ts ✅ NOUVEAU
│
├── sync/
│   ├── sync.controller.ts        ✅ NOUVEAU
│   ├── sync.module.ts            ✅ NOUVEAU
│   ├── sync.service.ts           ✅ NOUVEAU
│   └── dto/
│       ├── sync-push.dto.ts
│       └── sync-pull.dto.ts
│
└── theory/
    ├── theory.controller.ts      ✅ Déjà existe, COMPLÉTER
    ├── theory.service.ts         ✅ Déjà existe, COMPLÉTER
    └── dto/
        ├── analyze-progression.dto.ts ✅ Déjà existe
```

#### 3.2 Endpoints à Créer

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/lessons` | Liste toutes les leçons |
| GET | `/lessons/:id` | Détail d'une leçon |
| POST | `/lessons/:id/start` | Démarrer une leçon |
| POST | `/lessons/:id/complete` | Marquer comme complète |
| GET | `/achievements` | Liste des achievements |
| GET | `/achievements/user` | Achievements utilisateur |
| POST | `/achievements/:id/unlock` | Déverouiller un achievement |
| GET | `/user/progress` | Progression utilisateur |
| GET | `/user/stats` | Stats utilisateur |
| POST | `/sync/pull` | Pull données |
| POST | `/sync/push` | Push données |

---

### 🔵 MODULE 4: TanStack Query Front (P0 - 4-5h)

**Objectif:** Remplacer les données hardcodées par l'API

#### 4.1 Provider à Ajouter

```typescript
// apps/web/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### 4.2 Hooks à Créer/Utiliser

```typescript
// apps/web/lib/hooks/
├── use-lessons.ts              ✅ NOUVEAU
├── use-achievements.ts         ✅ NOUVEAU
├── use-user-progress.ts        ✅ NOUVEAU
├── use-user-stats.ts           ✅ NOUVEAU
└── use-sync.ts                 ✅ NOUVEAU
```

#### 4.3 Pages à Migrer

| Page | Hook | Migration |
|------|------|-----------|
| `/lessons` | `useLessons()` | Remplacer LESSONS constant |
| `/lessons/[id]` | `useLesson(id)` | Remplacer LESSONS[id] |
| `/achievements` | `useAchievements()` | Remplacer ACHIEVEMENTS constant |
| `/profile` | `useUserProfile()` | Remplacer USER_DATA |
| `/sessions` | `useSessions()` | Remplacer SESSIONS constant |
| `/theory/modes` | `useModes()` | Déjà existe hook |
| `/theory/chords` | `useChords()` | Déjà existe hook |

---

### 🔵 MODULE 5: Sync Web/Mobile (P1 - 4-6h)

**Objectif:** Synchronisation des données entre apps

#### 5.1 Architecture Sync

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SYNC ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐      ┌────────────────┐      ┌────────────────┐  │
│  │   WEB APP      │      │   MOBILE APP   │      │    API        │  │
│  │                │      │                │      │                │  │
│  │  TanStack      │      │  AsyncStorage  │      │   SyncQueue    │  │
│  │   Query        │      │   + Queue      │      │   Service      │  │
│  │                │      │                │      │                │  │
│  │  ↓             │      │  ↓             │      │                │  │
│  │  API Calls     │      │  API Calls     │──────►│                │  │
│  │                │      │                │      │                │  │
│  └────────────────┘      └────────────────┘      └────────┬───────┘  │
│                                                          │             │
│                                                          ▼             │
│                                                    ┌─────────────┐   │
│                                                    │  POSTGRES    │   │
│                                                    │   + Sync     │   │
│                                                    │    Logs      │   │
│                                                    └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 5.2 Service Sync NestJS

```typescript
// apps/api/src/sync/sync.service.ts
@Injectable()
export class SyncService {
  async pull(userId: string, deviceType: string) {
    // Récupérer toutes les données utilisateur
    // - Progressions
    // - Achievements
    // - Preferences
    // - Practice sessions
  }

  async push(userId: string, data: SyncPushDto) {
    // Recevoir les modifications du client
    // - Valider
    // - Fusionner avec DB
    // - Gérer les conflits
  }

  async getSyncLogs(userId: string) {
    // Historique des synchronisations
  }
}
```

#### 5.3 Offline Support Mobile

```typescript
// apps/mobile/lib/services/offlineSync.ts
export const offlineSyncService = {
  async syncWhenOnline() {
    // Envoyer les changements pending
    // Récupérer les nouvelles données
    // Mettre à jour le cache local
  },

  queueChange(action: SyncAction) {
    // Ajouter à la file d'attente
    // Sauvegarder en AsyncStorage
  },
}
```

---

## 📁 Structure Finale des Données

### Données de Référence (Hardcodées)

```
packages/theory/src/data/
├── modes.ts                    ✅ 7 modes grecs + émotions
├── scales.ts                   ✅ 20+ gammes
├── chords.ts                   ✅ 50+ accords + fingerings
├── progressions.ts             ✅ Progressions types
├── intervals.ts                ✅ Intervalles
└── harmony-rules.ts            ✅ Règles harmoniques
```

### Seed (Données injectées en DB)

```
packages/database/src/seed/
├── index.ts                    ✅ Main seed file
├── modes.seed.ts              ✅ Modes depuis theory/data
├── scales.seed.ts             ✅ Gammes depuis theory/data
├── chords.seed.ts             ✅ Accords depuis theory/data
├── techniques.seed.ts         ✅ Techniques
├── achievements.seed.ts       ✅ Achievements système
├── lessons.seed.ts            ✅ Leçons complètes
└── harmony.seed.ts            ✅ Règles harmoniques
```

---

## 🚀 Ordre d'Exécution

1. **MODULE 1: Seed Prisma** (Données en DB = base de tout)
2. **MODULE 2: BetterAuth** (Auth requis pour les endpoints user)
3. **MODULE 3: NestJS Endpoints** (API pour les données)
4. **MODULE 4: TanStack Query** (Frontend utilise l'API)
5. **MODULE 5: Sync** (Synchronisation finale)

---

## ✅ Checklist Validation

### Module 1 - Seed
- [ ] Seed exécute sans erreur
- [ ] Modes (7) créés en DB
- [ ] Gammes (20+) créées en DB
- [ ] Accords (50+) créés en DB
- [ ] Techniques (20+) créées en DB
- [ ] Achievements (20+) créés en DB
- [ ] Leçons (18) créées en DB
- [ ] Harmony rules créées en DB

### Module 2 - BetterAuth
- [ ] Package auth créé
- [ ] better-auth handler configuré
- [ ] Prisma adapter intégré
- [ ] Endpoints /api/v1/auth/* fonctionnels
- [ ] Login/Logout fonctionne
- [ ] Register fonctionne
- [ ] Session persiste

### Module 3 - API
- [ ] LessonsController créé
- [ ] AchievementsController créé
- [ ] UserProgressController complété
- [ ] SyncController créé
- [ ] Tous endpoints retournent JSON valide
- [ ] Guards JWT fonctionnent

### Module 4 - Frontend
- [ ] QueryClientProvider ajouté
- [ ] useLessons hook créé et utilisé
- [ ] useAchievements hook créé et utilisé
- [ : ] useUserProfile hook créé et utilisé
- [ ] Plus de données hardcodées dans les pages
- [ ] Loading states gérés
- [ ] Error states gérés

### Module 5 - Sync
- [ ] SyncController créé
- [ ] Pull endpoint fonctionne
- [ ] Push endpoint fonctionne
- [ ] Sync logs créés
- [ ] Offline queue mobile
- [ ] Conflict resolution

---

*Document créé le 2025-03-06 - Version 1.0*
