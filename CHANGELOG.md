# Changelog

All notable changes to Adagio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[Unreleased]: https://github.com/yanis/adagio/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/yanis/adagio/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yanis/adagio/releases/tag/v0.1.0
