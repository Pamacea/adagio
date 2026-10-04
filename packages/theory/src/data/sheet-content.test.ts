// ============================================================================
// TESTS - Sheet content (import du Google Sheet, généré par pnpm sheet:import)
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  SHEET_CONTENT,
  SHEET_TAB_IDS,
  getSheetTab,
  type SheetTabId,
} from './sheet-content';

describe('SHEET_CONTENT', () => {
  it('contient les 12 onglets du Sheet', () => {
    expect(SHEET_TAB_IDS).toHaveLength(12);
    expect(Object.keys(SHEET_CONTENT)).toHaveLength(12);
  });

  it('chaque onglet a ses métadonnées et au moins une section non vide', () => {
    for (const id of SHEET_TAB_IDS) {
      const tab = SHEET_CONTENT[id];
      expect(tab.id).toBe(id);
      expect(tab.source).toMatch(/^Guitar/);
      if (!tab.empty) {
        expect(tab.sections.length).toBeGreaterThan(0);
        const rows = tab.sections.reduce((n, s) => n + s.rows.length, 0);
        expect(rows).toBeGreaterThan(0);
      }
    }
  });

  it('getSheetTab retourne l\'onglet demandé', () => {
    const tab = getSheetTab('modes');
    expect(tab.title).toBe('Modes');
    expect(tab.sections[0]?.rows[0]?.[0]).toBe('Ionien');
  });

  it('les coquilles connues du Sheet sont corrigées', () => {
    const all = JSON.stringify(SHEET_CONTENT);
    expect(all).not.toContain('Éolioen');
    expect(all).not.toContain('.Suspendu');
    expect(all).not.toContain('desdend');
    expect(all).toContain('Éolien (Mineure naturelle)');
  });

  it('l\'onglet Anti-sèche expose les 3 lignes partiellement remplies', () => {
    const tab = getSheetTab('anti-seche');
    expect(tab.empty).toBe(false);
    expect(tab.sections[0]?.headers).toHaveLength(0);
    expect(tab.sections[0]?.rows).toHaveLength(3);
    expect(tab.sections[0]?.rows[0]?.[0]).toContain('1(Majeur)');
  });

  it('l\'onglet Harmonie contient les sections Axis Theory et Coltrane', () => {
    const tab = getSheetTab('harmonie');
    const titles = tab.sections.map((s) => s.title);
    expect(titles).toContain('Axis Theory');
    expect(tab.sections.length).toBeGreaterThanOrEqual(3);
  });

  it('l\'onglet Progressions a le bandeau en titre et une colonne NOTES', () => {
    const tab = getSheetTab('progressions');
    const s = tab.sections[0];
    expect(s).toBeDefined();
    expect(s?.title).toContain('DEGRÉS FONCTIONNELS');
    expect(s?.headers[4]).toBe('NOTES');
    expect(s?.rows.length).toBeGreaterThan(20);
  });

  it('les en-têtes sont nettoyés (pas d\'espaces superflus)', () => {
    for (const id of SHEET_TAB_IDS) {
      for (const section of SHEET_CONTENT[id].sections) {
        for (const h of section.headers) {
          expect(h).toBe(h.replace(/\s+/g, ' ').trim());
        }
      }
    }
  });

  it('SHEET_TAB_IDS et les clés de SHEET_CONTENT coïncident', () => {
    expect([...SHEET_TAB_IDS].sort()).toEqual(Object.keys(SHEET_CONTENT).sort());
    const typed: SheetTabId = 'modes';
    expect(SHEET_CONTENT[typed].id).toBe('modes');
  });
});
