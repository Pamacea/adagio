# Rapport d'import Sheet

Généré par `pnpm sheet:import` — 2026-10-04

## Onglets importés

| Onglet | Sections | Lignes | État |
|---|---|---|---|
| Modes | 1 | 9 | OK |
| Triades | 1 | 4 | OK |
| Renversements | 1 | 3 | OK |
| Gammes | 1 | 14 | OK |
| Accords | 1 | 25 | OK |
| Progressions | 1 | 29 | OK |
| Techniques | 1 | 34 | OK |
| Extensions (gamme composée) | 1 | 5 | OK |
| Drive (rythme) | 1 | 5 | OK |
| Harmonie | 4 | 27 | OK |
| Notes & Conseils | 1 | 26 | OK |
| Anti-sèche | 1 | 3 | OK |

## Sync CSV ↔ seeds Prisma

### Modes (CSV: 9 | seed: 7)
- Sync complète.

### Gammes (CSV: 14 | seed: 24)
- Absents du seed DB : Majeure augmentée, Mineur Naturelle, Harmonique Majeure, Harmonique Mineure, Napolitain mineur, Hongrois mineur, Augmentée Symétrique, Diminuée(2POS)
- Absents du Sheet : Gamme Mineure Naturelle, Mineure Harmonique, Dorien, Phrygien, Lydien, Mixolydien, Jazz Mineur Mélodique, Lydien Dominant, Locrien, Double Harmonique, Phrygien Dominant, Enigmatique, Pentatonique Japonaise, Pentatonique Égyptienne, Diminué Ton/Demi-ton, Demi-ton/Ton Diminuée, Octatonique

### Techniques (CSV: 34 | seed: 11)
- Absents du seed DB : Down picking, Finger picking, Chicken picking, Raking, Directional picking, Slap picking, Legato, Harmoniques naturelles, Harmoniques artificielles(pinch), Tapped harmonics, Harmoniques à la main droite (touch harmonics), Feedback, Palm mute, Muted strumming, Tremolo picking, Dead notes / ghost notes, Whammy bar techniques, Volume swells, Strumming patterns, Syncopation, Chugging

> Note : le tab Accords n'est pas comparé (seed DB indexée root/quality, Sheet indexée par nom d'accord).
> Note : le tab Harmonie est partiellement modélisé (Axis/Coltrane en DB, sections restantes en contenu statique).
