/**
 * useConcordiaChord — sélection du diagramme Concordia pour un accord.
 *
 * Parse l'accord (`parseChord` de @adagio/theory), cherche les formes
 * disponibles dans la base Concordia et gère le navigateur ◀ ▶ quand
 * plusieurs voicings existent pour la même racine × qualité.
 */

import { useEffect, useMemo, useState } from 'react';
import { parseChord } from '@adagio/theory';
import { findDiagrams, toChordShape, type ChordShape } from '@/lib/concordia';

export interface UseConcordiaChordResult {
  /** Toutes les formes disponibles (0 = accord inconnu de la base) */
  shapes: ChordShape[];
  /** Index courant (toujours dans les bornes) */
  index: number;
  setIndex: (index: number) => void;
  /** Forme courante, ou null si absent de la base → fallback UI */
  shape: ChordShape | null;
}

export function useConcordiaChord(chord: string): UseConcordiaChordResult {
  const parsed = useMemo(() => parseChord(chord), [chord]);

  const shapes = useMemo(() => {
    if (!parsed) return [];
    return findDiagrams(parsed.root, parsed.quality).map(toChordShape);
  }, [parsed]);

  const [index, setIndex] = useState(0);

  // Un nouvel accord repart à la première forme
  useEffect(() => {
    setIndex(0);
  }, [chord]);

  const safeIndex = index < shapes.length ? index : 0;

  return {
    shapes,
    index: safeIndex,
    setIndex,
    shape: shapes[safeIndex] ?? null,
  };
}
