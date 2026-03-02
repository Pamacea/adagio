# 🎼 ADAGIO

> **L'atlas harmonique intelligent pour guitaristes** — Une expérience SaaS & Mobile unifiée qui transforme la théorie musicale en intuition visuelle.

**Problème :** Les guitaristes se perdent dans la théorie abstraite. Les sites existants sont soit trop académiques, soit trop austères.
**Solution :** Adagio traduit les émotions en musique via des visualisations interactives et un langage humain.

---

## ✨ Features

### 🔮 Harmonic Engine
- **Fretboard Interactif** — Visualisation des notes, intervalles et degrés sur un manche de guitare dynamique
- **Mapping Émotionnel** — Filtrez les modes par sensation : "Aérien", "Sombre", "James Bond"
- **Axis Theory** — Visualisation des axes de substitution via un cercle des quintes dynamique

### 🎹 Composer's Assistant
- **Smart Progressions** — Glisser-déposer pour créer des suites d'accords
- **Analyse en Temps Réel** — Suggestions de gammes et sensations pour chaque accord
- **Substitutions 1-clic** — Tritonique, relative, diminuable pour pimenter vos progressions

### 📚 The Grimoire
- **Wiki de Poche** — Toutes les techniques (Hammer-on, Sweep, etc.) avec notes personnelles
- **Système de Progression** — Marquez des techniques comme "Appris" avec synchronisation cloud

---

## 🛠️ Stack Technique

| Composant | Technologie | Usage |
|-----------|-------------|-------|
| **Frontend Web** | Next.js 16 + React 19 | App Router, RSC, Server Actions |
| **Mobile** | React Native + Expo | Application native iOS/Android |
| **Backend** | NestJS | API REST modulaire |
| **Base de Données** | Neon (PostgreSQL) | Serverless, branches de développement |
| **Authentification** | BetterAuth | Moderne et flexible |
| **State Management** | TanStack Query + Form | Server state, formulaires |
| **UI Web** | Tailwind CSS + Shadcn/UI | Design system |
| **UI Mobile** | NativeWind | Styling natif avec Tailwind |
| **Théorie Musicale** | Tonal.js | Calculs d'intervalles et gammes |
| **Moteur Audio** | Tone.js | Synthèse polyphonique |

---

## 📁 Structure du Projet

```
adagio/
├── apps/
│   ├── web/              # Next.js 16 (App Router)
│   ├── mobile/           # React Native (Expo)
│   └── api/              # NestJS Backend
├── packages/
│   ├── ui/               # Composants partagés (Shadcn)
│   ├── theory/           # Moteur de théorie musicale
│   ├── database/         # Schéma Prisma + migrations
│   └── config/           # Configuration partagée (ESLint, TSConfig)
├── docs/                 # Documentation complète
└── data/                 # Fichiers CSV source
```

---

## 🚀 Roadmap

- [**Phase 1 : Fondations**] — MVP avec BetterAuth, Neon, import CSV, Fretboard
- [**Phase 2 : Interactivité**] — Cercle des quintes, générateur de progressions
- [**Phase 3 : Mobilité**] — App React Native avec offline mode
- [**Phase 4 : Social**] — Synchronisation cloud, partage de fiches

---

## 📖 Documentation

- [GUIDE.md](./docs/GUIDE.md) — Guide complet de l'architecture
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Architecture détaillée
- [PROGRESS.md](./docs/PROGRESS.md) — Suivi de l'avancement
- [API.md](./docs/API.md) — Documentation de l'API
- [CHANGELOG.md](./CHANGELOG.md) — Historique des versions

---

## 🎨 Design Philosophy

**Thème Midnight** — Fond anthracite, textes crème, accents néons. Adagio n'est pas un dictionnaire d'accords de plus, c'est un traducteur d'émotions en musique.

---

*Nous ne vendons pas la connaissance, nous la transmettons. Découvrez et profitez de toutes les connaissances musicales du monde.*

---

*License MIT — © 2025 Adagio*
