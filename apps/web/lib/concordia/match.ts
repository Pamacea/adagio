/**
 * Index Concordia — matching racine × qualité → diagrammes de manche.
 *
 * `chords.json` (121 diagrammes) est indexé au chargement du module :
 * clé `${pitchClass}|${qualité interne Adagio}`.
 *
 * Les noms Concordia sont libres (« G Majeur (Forme E - Corde 6) »,
 * « Cm6 (Corde 5) », « B m7b5 (Demi-diminué Corde 5) »…) : la racine est
 * extraite par regex, la qualité normalisée vers le format interne produit
 * par `parseChord` de `@adagio/theory` ('', 'm', 'maj7', '6/9'…).
 * Les diagrammes sans qualité reconnue (Power Chord, Octave, renversements
 * « A/C# »…) ne sont pas indexés → `findDiagrams` retourne [] → fallback UI.
 */

import { Note } from '@adagio/theory';
import type { NoteName } from '@adagio/types';
import chordsData from './chords.json';
import type { ChordsFile, Diagram } from './types';

const FILE = chordsData as ChordsFile;

/** Racine musicale suivie du reste du nom (« D#7b5 » → ['D#', '7b5']). */
const ROOT_RE = /^([A-G](?:#|b)?)(.*)$/s;

/** Nom à exclure : pas des accords diatoniques standardisables. */
const EXCLUDED_RE = /power chord|octave|septième/i;

/**
 * Table de normalisation Concordia → qualité interne Adagio.
 * Clé : qualité en minuscules, espaces supprimés, détail « (…) » retiré.
 * Valeur : null = non indexé (aucune entrée null : inconnu → `?? null`).
 */
const QUALITY_ALIASES: Record<string, string> = {
  '': '',
  majeur: '',
  mineur: 'm',
  m: 'm',
  maj7: 'maj7',
  m7: 'm7',
  mmaj7: 'mMaj7', // « m(maj7) » / « m(Maj7) »
  maj7sus4: 'maj7sus4',
  maj7sus2: 'maj7sus2',
  'maj7#11': 'maj7#11', // « maj#11 »
  sus2: 'sus2',
  sus4: 'sus4',
  '7sus2': '7sus2',
  '7sus4': '7sus4',
  '9sus2': '9sus2',
  add9: 'add9',
  add11: 'add11',
  '9': '9',
  m9: 'm9',
  min9: 'm9',
  m11: 'm11',
  min11: 'm11',
  '11': '11',
  '13': '13',
  maj9: 'maj9',
  maj11: 'maj11',
  maj13: 'maj13',
  m13: 'm13',
  '6': '6',
  m6: 'm6',
  '69': '6/9',
  '7': '7',
  dim: 'dim',
  diminuétriade: 'dim',
  dim7: 'dim7',
  dim7b13: 'dim7b13',
  augmenté: 'aug',
  aug: 'aug',
  m7b5: 'm7b5',
  '7b9': '7b9',
  '7#9': '7#9',
  '7#5': '7#5',
  '7b5': '7b5',
  '7b13': '7b13',
  '7alt': '7alt',
  '7#11': '7#11',
  '13b9': '13b9',
  '9#11': '9#11',
  '7#9b13': '7#9b13',
};

/** Classe de hauteur 0-11 d'une racine (enharmoniques unifiés). */
export function pitchClass(root: string): number | null {
  if (!/^[A-G](?:#|b)?$/.test(root)) return null;
  const midi = new Note(root as NoteName, 0).midi;
  return Number.isNaN(midi) ? null : ((midi % 12) + 12) % 12;
}

/**
 * Normalise une qualité extraite d'un nom Concordia vers le format interne.
 * Retourne null si la qualité n'est pas reconnue (diagramme non indexé).
 */
export function normalizeQuality(raw: string): string | null {
  let s = raw.trim();
  // « m(maj7) » est une qualité, pas un détail entre parenthèses
  s = s.replace(/^m\s*\(\s*maj7\s*\)/i, 'mMaj7');
  const paren = s.indexOf('(');
  if (paren !== -1) s = s.slice(0, paren);
  const key = s.trim().toLowerCase().replace(/\s+/g, '');
  return QUALITY_ALIASES[key] ?? null;
}

/** Décompose un nom Concordia. Retourne null si non indexable. */
export function parseChordName(name: string): { root: string; quality: string } | null {
  if (EXCLUDED_RE.test(name)) return null;
  const m = name.match(ROOT_RE);
  if (!m) return null;
  const quality = normalizeQuality(m[2] ?? '');
  if (quality === null) return null;
  return { root: m[1]!, quality };
}

/** Index `${pitchClass}|${quality}` → diagrammes (ordre du fichier source). */
const INDEX: Map<string, Diagram[]> = (() => {
  const index = new Map<string, Diagram[]>();
  for (const d of Object.values(FILE.diagrams)) {
    const parsed = parseChordName(d.name);
    if (!parsed) continue;
    const pc = pitchClass(parsed.root);
    if (pc === null) continue;
    const key = `${pc}|${parsed.quality}`;
    const bucket = index.get(key);
    if (bucket) bucket.push(d);
    else index.set(key, [d]);
  }
  return index;
})();

/**
 * Diagrammes pour une racine + qualité interne ('' = majeur).
 * Les enharmoniques matchent par classe de hauteur (Db ≡ C#).
 * Retourne [] si aucune forme n'existe → fallback UI.
 */
export function findDiagrams(root: string, quality: string): Diagram[] {
  const pc = pitchClass(root);
  if (pc === null) return [];
  return INDEX.get(`${pc}|${quality}`) ?? [];
}
