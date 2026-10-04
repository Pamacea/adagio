#!/usr/bin/env node
// ============================================================================
// IMPORT SHEET — Pipeline d'import du Google Sheet [MUSIC] Guitar
//
// Source de vérité : docs/csv/*.csv (export des onglets du Sheet)
// Cible            : packages/theory/src/data/sheet-content.ts
//                    + docs/csv/import-report.md (rapport de sync vs seeds DB)
//
// Usage : pnpm sheet:import   (racine du monorepo)
//
// Le Sheet contient des coquilles connues (table CELL_FIXES) et des cellules
// juxtaposées (2 tables côte à côte) : on préserve la fidélité au Sheet
// plutôt que de restructurer — le rendu interprète les sections.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSV_DIR = path.join(ROOT, 'docs', 'csv');
const OUT_TS = path.join(ROOT, 'packages', 'theory', 'src', 'data', 'sheet-content.ts');
const OUT_REPORT = path.join(ROOT, 'docs', 'csv', 'import-report.md');

// ----------------------------------------------------------------------------
// Parseur CSV RFC 4180 (quotes, cellules multi-lignes, CRLF)
// ----------------------------------------------------------------------------
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(cell); cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else cell += c;
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

// ----------------------------------------------------------------------------
// Nettoyage
// ----------------------------------------------------------------------------
const cleanHeader = (h) => h.replace(/\s+/g, ' ').trim();
const cleanCell = (c) => c.replace(/\s+$/m, '').trim();

/** Coquilles du Sheet (match exact sur cellule entière, après trim) */
const CELL_FIXES = new Map([
  ['Éolioen(Mineure Naturel)', 'Éolien (Mineure naturelle)'],
  ['Son mineur “classique”', 'Mode mineur “classique”'],
  ['.Suspendu', 'Suspendu'],
  ['.Blues', 'Blues'],
  ['.Power Chords', 'Power Chords'],
  ['.Aug', 'Aug'],
  ['on desdend alors on downstroke', 'on descend alors on downstroke'],
]);

/** Remplacements partiels (la coquille est au milieu d'une cellule plus longue) */
const SUBSTR_FIXES = [
  ['desdend', 'descend'],
];

function fixCell(c) {
  let t = c.trim();
  if (CELL_FIXES.has(t)) t = CELL_FIXES.get(t);
  for (const [from, to] of SUBSTR_FIXES) t = t.split(from).join(to);
  return t;
}

const isEmptyRow = (row) => row.every((c) => c.trim() === '');
function dropEmptyCols(rows) {
  if (rows.length === 0) return rows;
  const width = Math.max(...rows.map((r) => r.length));
  const keep = [];
  for (let i = 0; i < width; i++) {
    if (rows.some((r) => (r[i] ?? '').trim() !== '')) keep.push(i);
  }
  return rows.map((r) => keep.map((i) => r[i] ?? ''));
}

// ----------------------------------------------------------------------------
// Découpage en sections (blocs séparés par lignes vides)
// Une ligne à cellule unique non vide = titre de section.
// ----------------------------------------------------------------------------
function splitSections(rows, { dropEmptyColsToo = false, noHeader = false } = {}) {
  const blocks = [];
  let cur = [];
  for (const r of rows) {
    if (isEmptyRow(r)) { if (cur.length) blocks.push(cur); cur = []; }
    else cur.push(r);
  }
  if (cur.length) blocks.push(cur);

  const sections = [];
  for (const block of blocks) {
    let title = null;
    let head = block;
    const nonEmptyCount = block[0].filter((c) => c.trim() !== '').length;
    if (nonEmptyCount === 1) {
      title = cleanHeader(block[0].find((c) => c.trim() !== ''));
      head = block.slice(1);
    }
    if (head.length === 0) continue;
    let headers = noHeader ? [] : head[0].map(cleanHeader);
    let dataRows = (noHeader ? head : head.slice(1)).map((r) =>
      r.map((c) => fixCell(cleanCell(c)))
    );
    if (dropEmptyColsToo) {
      const merged = dropEmptyCols(noHeader ? dataRows : [headers, ...dataRows]);
      headers = noHeader ? [] : merged[0];
      dataRows = noHeader ? merged : merged.slice(1);
    }
    sections.push({ title, headers, rows: dataRows });
  }
  return sections;
}

// ----------------------------------------------------------------------------
// Mapping des 12 onglets
// ----------------------------------------------------------------------------
const TABS = [
  { id: 'modes', file: 'Guitar  - Modes.csv', title: 'Modes' },
  { id: 'triades', file: 'Guitar  - Triades.csv', title: 'Triades' },
  { id: 'renversement', file: 'Guitar  - Renversement.csv', title: 'Renversements' },
  { id: 'gammes', file: 'Guitar  - Gammes.csv', title: 'Gammes' },
  { id: 'accords', file: 'Guitar  - Accords.csv', title: 'Accords' },
  { id: 'progressions', file: 'Guitar  - Progressions.csv', title: 'Progressions' },
  { id: 'techniques', file: 'Guitar  - Techniques.csv', title: 'Techniques' },
  { id: 'composee', file: 'Guitar  - Composée.csv', title: 'Extensions (gamme composée)' },
  { id: 'drive', file: 'Guitar  - Drive.csv', title: 'Drive (rythme)' },
  { id: 'harmonie', file: 'Guitar  - Harmonie.csv', title: 'Harmonie' },
  { id: 'notes-conseils', file: 'Guitar  - Notes & Conseils.csv', title: 'Notes & Conseils' },
  { id: 'anti-seche', file: 'Guitar  - Anti-sèche.csv', title: 'Anti-sèche', noHeader: true },
];

function loadTab(tab) {
  const raw = fs.readFileSync(path.join(CSV_DIR, tab.file), 'utf8').replace(/^\uFEFF/, '');
  const parsed = parseCSV(raw).map((r) => r.map((c) => c.replace(/\r\n/g, '\n')));
  if (parsed.every((r) => isEmptyRow(r))) return { ...tab, sections: [], empty: true };

  const opts = {
    // Anti-sèche et Harmonie : colonnes vides de part et d'autre (tableaux juxtaposés)
    dropEmptyColsToo: tab.id === 'anti-seche' || tab.id === 'harmonie',
    noHeader: tab.noHeader === true,
  };
  const sections = splitSections(parsed, opts);

  // Progressions : 1re ligne = bandeau groupé, 2e = vrais en-têtes.
  // La colonne NOTES du 2e niveau contient déjà du contenu → remontée en 1re ligne data.
  if (tab.id === 'progressions' && sections.length > 0 && sections[0].title === null) {
    const s = sections[0];
    s.title = s.headers.filter(Boolean).join(' / ');
    const level2 = s.rows[0];
    const notesCell = level2[4] ?? '';
    s.headers = level2.map(cleanHeader);
    s.headers[4] = 'NOTES';
    s.rows = s.rows.slice(1);
    if (notesCell.trim() !== '') s.rows.unshift(['', '', '', '', notesCell]);
  }

  return { ...tab, sections, empty: false };
}

// ----------------------------------------------------------------------------
// Rapport de sync vs seeds Prisma (lecture regex des fichiers seed)
// ----------------------------------------------------------------------------
function seedNames(seedFile, field = 'name') {
  const p = path.join(ROOT, 'packages', 'database', 'src', 'data', seedFile);
  if (!fs.existsSync(p)) return [];
  const text = fs.readFileSync(p, 'utf8');
  const re = new RegExp(`^\\s*${field}:\\s*'([^']+)'`, 'gm');
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
}

const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();

function syncRow(label, csvNames, dbNames) {
  const dbNorm = dbNames.map(norm);
  const missingInDb = csvNames.filter((n) => !dbNorm.some((d) => d.includes(norm(n)) || norm(n).includes(d)));
  const csvNorm = csvNames.map(norm);
  const missingInCsv = dbNames.filter((n) => !csvNorm.some((c) => c.includes(norm(n)) || norm(n).includes(c)));
  return { label, csvCount: csvNames.length, dbCount: dbNames.length, missingInDb, missingInCsv };
}

function firstCol(tab, sectionIdx = 0) {
  const s = tab.sections[sectionIdx];
  if (!s) return [];
  return s.rows.map((r) => fixCell(cleanCell(r[0] ?? ''))).filter(Boolean);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
const loaded = TABS.map(loadTab);
const emptyTabs = loaded.filter((t) => t.empty);

const syncs = [];
syncs.push(syncRow('Modes', firstCol(loaded.find((t) => t.id === 'modes')), seedNames('modes.seed.ts')));
syncs.push(syncRow('Gammes', firstCol(loaded.find((t) => t.id === 'gammes')), seedNames('scales.seed.ts')));
syncs.push(syncRow('Techniques', firstCol(loaded.find((t) => t.id === 'techniques')), seedNames('techniques.seed.ts')));

// --- Génération du module TypeScript ---
const banner = `// ============================================================================
// SHEET CONTENT — GÉNÉRÉ AUTOMATIQUEMENT, NE PAS ÉDITER À LA MAIN
// Source : docs/csv/*.csv (export Google Sheet "[MUSIC] Guitar")
// Régénérer : pnpm sheet:import
// ============================================================================`;

function obj(value, indent = 0) {
  const json = JSON.stringify(value, null, 2);
  const pad = ' '.repeat(indent);
  return json.replace(/\n/g, `\n${pad}`);
}

let out = `${banner}

/** Une section = un bloc de lignes séparé des autres par une ligne vide. */
export interface SheetSection {
  /** Titre de section (ligne à cellule unique), sinon null */
  title: string | null;
  headers: string[];
  rows: string[][];
}

export interface SheetTabData {
  id: string;
  title: string;
  /** Nom du fichier CSV d'origine */
  source: string;
  /** true si le CSV est vide (onglet sans contenu dans le Sheet) */
  empty: boolean;
  sections: SheetSection[];
}

export type SheetTabId =
${TABS.map((t) => `  | '${t.id}'`).join('\n')};

export const SHEET_CONTENT: Record<SheetTabId, SheetTabData> = {
`;

for (const tab of loaded) {
  out += `  '${tab.id}': {
    id: '${tab.id}',
    title: ${JSON.stringify(tab.title)},
    source: ${JSON.stringify(tab.file)},
    empty: ${tab.empty},
    sections: ${obj(tab.sections, 4)},
  },
`;
}
out += `};

export const SHEET_TAB_IDS = ${obj(TABS.map((t) => t.id))} as const;

/** Récupère un onglet du Sheet (source de vérité). */
export function getSheetTab(id: SheetTabId): SheetTabData {
  return SHEET_CONTENT[id];
}
`;

fs.writeFileSync(OUT_TS, out, 'utf8');

// --- Rapport ---
const reportLines = [
  '# Rapport d\'import Sheet',
  '',
  `Généré par \`pnpm sheet:import\` — ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## Onglets importés',
  '',
  '| Onglet | Sections | Lignes | État |',
  '|---|---|---|---|',
];
for (const t of loaded) {
  const rows = t.sections.reduce((n, s) => n + s.rows.length, 0);
  reportLines.push(
    `| ${t.title} | ${t.sections.length} | ${rows} | ${t.empty ? '**VIDE**' : 'OK'} |`
  );
}
reportLines.push('', '## Sync CSV ↔ seeds Prisma', '');
for (const s of syncs) {
  reportLines.push(`### ${s.label} (CSV: ${s.csvCount} | seed: ${s.dbCount})`);
  if (s.missingInDb.length) {
    reportLines.push(`- Absents du seed DB : ${s.missingInDb.join(', ')}`);
  }
  if (s.missingInCsv.length) {
    reportLines.push(`- Absents du Sheet : ${s.missingInCsv.join(', ')}`);
  }
  if (!s.missingInDb.length && !s.missingInCsv.length) {
    reportLines.push('- Sync complète.');
  }
  reportLines.push('');
}
if (emptyTabs.length) {
  reportLines.push('## Onglets vides', '', ...emptyTabs.map((t) => `- ${t.file}`), '');
}
reportLines.push(
  '> Note : le tab Accords n\'est pas comparé (seed DB indexée root/quality, Sheet indexée par nom d\'accord).',
  '> Note : le tab Harmonie est partiellement modélisé (Axis/Coltrane en DB, sections restantes en contenu statique).',
  ''
);
fs.writeFileSync(OUT_REPORT, reportLines.join('\n'), 'utf8');

const totalRows = loaded.reduce(
  (n, t) => n + t.sections.reduce((m, s) => m + s.rows.length, 0), 0
);
console.log(`✅ sheet:import — ${loaded.length} onglets, ${totalRows} lignes → ${path.relative(ROOT, OUT_TS)}`);
console.log(`📄 rapport → ${path.relative(ROOT, OUT_REPORT)}`);
for (const s of syncs) {
  const flags = [];
  if (s.missingInDb.length) flags.push(`${s.missingInDb.length} absents du seed DB`);
  if (s.missingInCsv.length) flags.push(`${s.missingInCsv.length} absents du Sheet`);
  console.log(`  ${s.label}: CSV ${s.csvCount} / seed ${s.dbCount}${flags.length ? ' — ' + flags.join(', ') : ' — sync OK'}`);
}
