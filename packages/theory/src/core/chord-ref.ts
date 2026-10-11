// ============================================================================
// CHORD REF — parser unique de symboles d'accords (P1 étape 4)
// ============================================================================
// Point d'entrée unique pour décomposer un symbole d'accord ('Dbmaj7', 'C/E')
// en racine / qualité / basse. Ne gère PAS les degrés romains ('Imaj7') :
// ceux-ci passent par parseDegree (étape 5).

/**
 * Référence d'accord décomposée.
 * - root : racine telle que saisie ('C', 'F#', 'Bb') — les bémols sont préservés
 * - quality : qualité normalisée ('', 'm', 'maj7', '7', 'm7b5', '6/9'…)
 * - bass : basse d'un accord slash ('E' dans 'C/E'), optionnelle
 */
export interface ChordRef {
  root: string;
  quality: string;
  bass?: string;
}

const ROOT_PATTERN = /^[A-G](?:#|b)?$/;
const CHORD_PATTERN = /^([A-G](?:#|b)?)(.*)$/;

/**
 * Normalise les alias de qualité vers la forme canonique du package.
 * '°' est ramené à 'dim' (même comportement que les parsers historiques).
 */
function normalizeQuality(raw: string): string {
  if (raw === 'major' || raw === 'M') return '';
  if (raw === '-' || raw === 'min') return 'm';
  if (raw === '°') return 'dim';
  return raw;
}

/**
 * Parse un symbole d'accord en ChordRef.
 *
 * @returns null si le symbole ne commence pas par une racine valide ([A-G] + dièse/bémol).
 *
 * @example
 * parseChord('Dbmaj7')  // { root: 'Db', quality: 'maj7' }
 * parseChord('C/E')     // { root: 'C', quality: '', bass: 'E' }
 * parseChord('C6/9')    // { root: 'C', quality: '6/9' }  (le '/9' est une qualité, pas une basse)
 */
export function parseChord(sym: string): ChordRef | null {
  const match = sym.trim().match(CHORD_PATTERN);
  if (!match) return null;

  const root = match[1]!;
  let rest = match[2] ?? '';

  // Basse de slash chord : seulement si ce qui suit '/' est une note valide
  let bass: string | undefined;
  const slash = rest.lastIndexOf('/');
  if (slash !== -1) {
    const candidate = rest.slice(slash + 1);
    if (ROOT_PATTERN.test(candidate)) {
      bass = candidate;
      rest = rest.slice(0, slash);
    }
  }

  const quality = normalizeQuality(rest);
  return bass === undefined ? { root, quality } : { root, quality, bass };
}

/**
 * Reformatte un ChordRef en symbole d'accord.
 * Préserve la casse dièse/bémol de l'entrée (aucun enharmonique imposé).
 */
export function formatChord(c: ChordRef): string {
  const base = `${c.root}${c.quality}`;
  return c.bass === undefined ? base : `${base}/${c.bass}`;
}

/**
 * Clé d'indexation stable pour les tables liées aux accords.
 * @example chordKey(parseChord('Dbmaj7')!)  // 'Db|maj7'
 */
export function chordKey(c: ChordRef): string {
  const base = `${c.root}|${c.quality}`;
  return c.bass === undefined ? base : `${base}/${c.bass}`;
}
