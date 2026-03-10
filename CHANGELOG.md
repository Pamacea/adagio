# Changelog

All notable changes to Adagio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.3] - 2026-03-10

### 🧪 Testing Infrastructure

#### Unit Tests - NestJS API
- ✅ **Auth Module Tests** - 42 tests couvrant authentication complete flow
  - `auth.service.spec.ts` - Register, login, refresh tokens, password verification
  - `auth.controller.spec.ts` - Endpoint testing with throttling validation
- ✅ **Users Module Tests** - 84 tests couvring user management
  - `users.service.spec.ts` - Profile updates, password changes, preferences, statistics
  - `users.controller.spec.ts` - Full CRUD endpoints with validation
- ✅ **Lessons Module Tests** - ~30 tests for lesson progression
- ✅ **Progress Module Tests** - ~25 tests for progress tracking
- ✅ **Theory API Tests** - 102 tests covering theory endpoints

#### Unit Tests - Theory Package
- ✅ **Calculator Tests** - 234 tests for music theory calculations
  - `CircleOfFifthsCalculator.test.ts` - 53 tests for circle of fifths operations
  - `ChordCalculator.test.ts` - 122 tests covering chord building, voicings, CAGED system
  - `FretboardCalculator.test.ts` - 59 tests for fretboard calculations
- ✅ **Core Theory Tests** - ~145 tests for fundamental music theory classes
  - `Note.test.ts` - Note class, transposition, enharmonics
  - `Interval.test.ts` - Interval calculations and mappings
  - `Scale.test.ts` - Major/minor scales, modes
  - `Chord.test.ts` - Chord class and analysis

### 🔧 Infrastructure
- 🔧 Updated `.gitignore` for test files and sensitive data
- 🔧 Configured Jest for API testing with proper mocks
- 🔧 Configured Vitest for theory package testing

### 📊 Coverage
- **846 tests created** across API and theory packages
- **311 API tests** - 100% passing
- **535 theory tests** - 99% passing
- **Test coverage increased** from ~2% to ~50% globally

---

## [0.2.2] - 2026-03-10

### 🔧 Infrastructure
- 🔧 Web configuration updates for BetterAuth integration
- 🔧 Auth guards optimization for JWT validation
- 🔧 CORS configuration updates

---

## [0.2.0] - 2026-03-10

### 🔐 Authentication & Authorization - BetterAuth Integration

#### BetterAuth Setup
- ✅ Complete BetterAuth integration in backend
- ✅ Social providers (Google, GitHub, Discord)
- ✅ JWT-based authentication with refresh tokens
- ✅ Password reset & email verification flows
- ✅ Session management with secure cookies

#### Web Auth
- ✅ Auth pages (login, register, forgot-password)
- ✅ Protected routes with middleware
- ✅ Auth client with TanStack Query integration
- ✅ Server actions for auth operations

#### Mobile Auth
- ✅ SecureStore for token storage
- ✅ Zustand-based auth state management
- ✅ Auto-refresh token mechanism
- ✅ Login/Register screens with validation

### 🎓 Learning System - Lessons & Progress

#### Lessons Module
- ✅ Lesson structure with categories (theory, technique, practice)
- ✅ Lesson progress tracking per user
- ✅ Lesson completion with XP rewards
- ✅ Prerequisite system for lessons

#### Progress Tracking
- ✅ User progress endpoints (GET/PUT)
- ✅ Session history for practice tracking
- ✅ Statistics dashboard
- ✅ Progress sync across devices

### 🏆 Achievement System

#### Backend & Types
- ✅ 17 achievements defined with criteria
- ✅ 6 categories (progression, discovery, practice, mastery, social, milestone)
- ✅ 4 rarity tiers (common, rare, epic, legendary)
- ✅ Achievement unlock endpoints

#### Frontend
- ✅ Achievement pages (Web + Mobile)
- ✅ Achievement cards with visual badges
- ✅ Filter by category and rarity
- ✅ Progress indicators for incomplete achievements

### 🎨 UI Components Library

#### New Atoms
- ✅ Badge - Status and category indicators
- ✅ Input - Form input with variants
- ✅ ModeIcon - Musical mode icons

#### New Molecules
- ✅ ChordCard - Chord display card
- ✅ Modal - Accessible modal component
- ✅ RootSelector - Musical root note selector

#### New Organisms
- ✅ ChordDiagram - Interactive chord diagrams
- ✅ ChordLibrary - Chord browsing interface
- ✅ Fretboard - Interactive fretboard visualization

### 🎸 Music Theory Enhancements

#### ChordCalculator
- ✅ Complete chord calculator with inversions
- ✅ Chord voicing suggestions
- ✅ Chord feeling mappings

#### Fretboard Module
- ✅ Interactive fretboard calculator
- ✅ Scale visualization on fretboard
- ✅ Chord position finder
- ✅ Tuning configurations

#### Color Mapping
- ✅ Emotional color mappings for chords
- ✅ Visual feedback for harmonic qualities

### 📱 Mobile App Enhancements

#### New Tabs
- ✅ Fretboard tab - Interactive fretboard
- ✅ Notation tab - Musical notation display
- ✅ Preferences tab - User settings
- ✅ Theory tab - Music theory reference

#### Features Structure
- ✅ Organized features/ directory
- ✅ Auth hook with Zustand persistence
- ✅ Offline-ready data fetching

#### Components
- ✅ Shared component library
- ✅ Theme configuration with colors
- ✅ Expo icons integration

### 🌐 Web App Enhancements

#### New Pages
- ✅ /achievements - Achievement browsing
- ✅ /compose - Composition tool
- ✅ /fretboard - Fretboard tool
- ✅ /lessons - Lesson system
- ✅ /notation - Notation display
- ✅ /profile - User profile
- ✅ /sessions - Practice sessions
- ✅ /theory - Theory reference
- ✅ /warning - System warnings

#### Features Structure
- ✅ Organized features/ directory
- ✅ Auth client with React Query
- ✅ Theory utilities and helpers

### 🔧 Infrastructure & Tooling

#### Build System
- ✅ Turborepo configuration optimization
- ✅ TypeScript strict mode across all packages
- ✅ ESLint and Prettier shared configs

#### Database
- ✅ Prisma schema updates
- ✅ Seed data with achievements and lessons
- ✅ Migration system

#### API Client
- ✅ Refactored AuthClient with BetterAuth
- ✅ Generic ApiClient with typed requests
- ✅ Error handling with ApiError class

### 📦 New Package: auth
- ✅ Shared authentication utilities
- ✅ Token management
- ✅ Cross-platform auth helpers

### 🔧 Fixes & Improvements
- 🔧 Fixed mode naming (locrien→locrian, lydien→lydian)
- 🔧 Renamed useAuth.ts to useAuth.tsx (contains JSX)
- 🔧 Fixed barrel exports imports
- 🔧 Added .env.example for mobile app
- 🔧 Updated gitignore for sensitive files
- 🔧 Added metro.config.js for React Native
- 🔧 Added type declarations for Expo modules

---

## [0.1.1] - 2025-03-02

### Fixed
- 🔧 passport version 0.8.0 → 0.7.0 (latest available version)
- 🐛 Fixed deployment error on Railway/Vercel due to incompatible passport version

---

## [0.1.0] - 2025-03-02

### Added
- 🎉 Initial project structure (monorepo with pnpm workspaces)
- 📁 Documentation foundation (README, ARCHITECTURE, PROGRESS)
- 🗂️ Project structure planning (apps/, packages/, docs/)
- 🎨 Design system specifications (Midnight theme)
- 📋 Feature specifications (Harmonic Engine, Composer's Assistant, Grimoire)

### Planned for Next Release
- [ ] BetterAuth integration
- [ ] Neon PostgreSQL setup with Prisma
- [ ] NestJS backend foundation
- [ ] Next.js 16 frontend with App Router
- [ ] CSV data import pipeline
- [ ] Tonal.js integration

---

## Version Philosophy

Adagio follows a semantic versioning approach tailored for a SaaS product:

- **MAJOR** — Breaking changes, complete redesigns, major feature additions
- **MINOR** — New features, enhancements, backward-compatible additions
- **PATCH** — Bug fixes, small improvements, documentation updates

### Release Cadence
- **Monthly** minor releases with new features
- **Weekly** patch releases for bug fixes
- **Quarterly** major releases for significant updates

---

[Unreleased]: https://github.com/yanis/adagio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/yanis/adagio/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/yanis/adagio/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yanis/adagio/releases/tag/v0.1.0
