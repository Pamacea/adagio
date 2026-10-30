/**
 * ChordDiagram - Diagramme d'accord de guitare (SVG), rendu identique à Concordia.
 *
 * Convention unique : string 0 = mi grave (colonne de gauche),
 * string 5 = mi aigu (colonne de droite). `fret` est absolu :
 * -1 = étouffée, 0 = à vide, >= 1 = case.
 *
 * Géométrie et couleurs reprises de `concordia/src/lib/{geometry,render}` :
 * fond #000000, cordes/frettes blanches, sillet épais, pastilles colorées par
 * intervalle, indicateurs ○/×/R au-dessus du sillet.
 */

import { cn } from '../lib/cn';

export interface ChordFingerPosition {
  string: number; // 0 = mi grave (gauche) … 5 = mi aigu (droite)
  fret: number; // -1 = étouffée, 0 = à vide, 1+ = case absolue
  finger?: number; // 1-4
  note?: string;
  interval?: string;
}

export interface ChordDiagramProps {
  name: string;
  positions: ChordFingerPosition[];
  frets?: number; // Nombre de cases affichées (défaut 4)
  showFretNumbers?: boolean;
  showStringNames?: boolean;
  compact?: boolean;
  className?: string;
}

const STRINGS = 6;

// --- Géométrie (concordia/src/lib/geometry/constants.ts) ---
const OFFSET_X = 65;
const STRING_GAP_MAX = 70;
const STRING_GAP_BASE = 560;
const STRING_GAP_MIN = 40;
const FRET_GAP_MAX = 75;
const MAX_BOARD = 640;
const STRING_TAPER = 0.12;
const TITLE_FIRST_CY = 45;
const TITLE_TO_NUT = 34;
const NUT_TO_BOARD = 25;
const NUT_BAND = 46;
const TITLE_SIZE_MAX = 24;
const TITLE_SIZE_MIN = 16;
const TITLE_LEAD_RATIO = 1.35;
const TITLE_MARGIN = 24;
const RESERVE = 35;
const FRET_NUM_GAP = 40;

// --- Tokens (concordia/src/lib/render/tokens.ts) ---
const C_WHITE = '#ffffff';
const C_ACCENT = '#b84a1a';
const C_ROOT = '#8b1a1a';
const BG = '#000000';
const FONT_SANS = 'sans-serif';
const DOT_R_BASE = 22;
const OPEN_ROOT_R = 16;
const FS_ROOT = 18;
const FS_NOTE = 15;
const FS_OPEN_ROOT_LABEL = 14;
const FS_OPEN_IND = 24;
const FS_NUT_LABEL = 16;
const FS_FRET_NUM = 18;
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

interface IntervalStyle {
  label: string;
  color: string;
  text: string;
}

const UNKNOWN: IntervalStyle = { label: '?', color: '#6b7280', text: C_WHITE };

/** Couleurs d'intervalles Concordia (lib/theory INTERVALS). */
const INTERVALS: Record<string, IntervalStyle> = {
  R: { label: 'R', color: '#8b1a1a', text: C_WHITE },
  b2: { label: 'b2', color: '#f97316', text: C_WHITE },
  '2': { label: '2', color: '#f97316', text: C_WHITE },
  b3: { label: 'b3', color: '#22c55e', text: C_WHITE },
  '3': { label: '3', color: '#22c55e', text: C_WHITE },
  '4': { label: '4', color: '#ec4899', text: C_WHITE },
  b5: { label: 'b5', color: '#0284c7', text: C_WHITE },
  '5': { label: '5', color: '#38bdf8', text: '#000000' },
  b6: { label: 'b6', color: '#a855f7', text: C_WHITE },
  '6': { label: '6', color: '#a855f7', text: C_WHITE },
  b7: { label: 'b7', color: '#eab308', text: '#000000' },
  '7': { label: '7', color: '#eab308', text: '#000000' },
};

function intervalStyle(interval?: string): IntervalStyle {
  if (!interval) return UNKNOWN;
  const key = interval === '1' ? 'R' : interval;
  return INTERVALS[key] ?? { ...UNKNOWN, label: key };
}

/** Espacement des cordes : se resserre quand le nombre de cases augmente. */
const stringGapFor = (frets: number) =>
  Math.max(STRING_GAP_MIN, Math.round(Math.min(STRING_GAP_MAX, STRING_GAP_BASE / Math.max(1, frets))));

/** Écart entre cases : rétrécit quand la table dépasse MAX_BOARD. */
const fretGapFor = (frets: number) =>
  Math.max(30, Math.min(FRET_GAP_MAX, MAX_BOARD / Math.max(1, frets)));

/** Taille de police du titre bornée à [16, 24] selon la largeur disponible. */
function titleSizeFor(text: string, maxWidth: number): number {
  const estimated = text.length * TITLE_SIZE_MAX * 0.6;
  if (estimated <= maxWidth) return TITLE_SIZE_MAX;
  return Math.max(TITLE_SIZE_MIN, Math.floor((maxWidth / estimated) * TITLE_SIZE_MAX));
}

/** Découpe un titre en lignes (estimation largeur, sans dépendre du DOM). */
function wrapTitle(text: string, maxWidth: number, size: number): string[] {
  if (!text) return [];
  const maxChars = Math.max(1, Math.floor(maxWidth / (size * 0.6)));
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    const trial = current ? `${current} ${word}` : word;
    if (trial.length <= maxChars) {
      current = trial;
      continue;
    }
    if (current) lines.push(current);
    current = word.slice(0, maxChars);
  }
  if (current) lines.push(current);
  return lines;
}

export function ChordDiagram({
  name,
  positions,
  frets = 4,
  showFretNumbers = true,
  showStringNames = false,
  compact = false,
  className,
}: ChordDiagramProps) {
  const pressed = positions.filter((p) => p.fret > 0);
  // Case absolue de la première ligne affichée (bornée à 1).
  const startFret = pressed.length > 0 ? Math.max(1, Math.min(...pressed.map((p) => p.fret))) : 1;
  const maxRel = pressed.reduce((max, p) => Math.max(max, p.fret - startFret), 0);
  const rows = Math.max(1, frets, maxRel + 1);

  const gap = fretGapFor(rows);
  const stringGap = stringGapFor(rows);
  const scale = Math.min(1, gap / FRET_GAP_MAX);
  const dotR = DOT_R_BASE * scale;

  const width = 2 * OFFSET_X + 5 * stringGap;
  const titleMaxWidth = width - TITLE_MARGIN;
  const titleSize = name ? titleSizeFor(name, titleMaxWidth) : TITLE_SIZE_MAX;
  const titleLead = titleSize * TITLE_LEAD_RATIO;
  const titleLines = wrapTitle(name, titleMaxWidth, titleSize);
  const titleBottom = titleLines.length
    ? TITLE_FIRST_CY + (titleLines.length - 1) * titleLead + titleLead / 2
    : 0;
  const hasIndicators = positions.some((p) => p.fret <= 0);
  const nutBand = hasIndicators || showStringNames ? NUT_BAND : 0;
  const offsetY = titleBottom + (titleLines.length ? TITLE_TO_NUT : 0) + nutBand + NUT_TO_BOARD;
  const nutZone = offsetY - NUT_TO_BOARD;
  const nutLabelY = nutZone - 34;
  const boardBottom = offsetY + rows * gap;
  const height = boardBottom + RESERVE;

  const xFor = (string: number) => OFFSET_X + string * stringGap;
  const yFor = (relFret: number) => offsetY + relFret * gap + gap / 2;

  const playedCount = positions.filter((p) => p.fret >= 0).length;
  const lastFret = startFret + rows - 1;
  const ariaLabel = `${name ? `Accord ${name}` : "Diagramme d'accord"}, ${playedCount} cordes, cases ${startFret} à ${lastFret}`;

  return (
    <div className={cn('block w-full', compact && 'max-w-[120px]', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="h-auto w-full"
        style={{ maxWidth: '100%' }}
        role="img"
        aria-label={ariaLabel}
      >
        <rect width="100%" height="100%" fill={BG} />

        {/* Titre multi-lignes */}
        {titleLines.map((line, i) => (
          <text
            key={`title-${i}`}
            x={width / 2}
            y={TITLE_FIRST_CY + i * titleLead}
            fill={C_WHITE}
            fontSize={titleSize}
            fontWeight="bold"
            fontFamily={FONT_SANS}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {line}
          </text>
        ))}

        {/* Notes des cordes à vide au-dessus des indicateurs */}
        {showStringNames &&
          STRING_NAMES.map((stringName, i) => (
            <text
              key={`nut-label-${i}`}
              x={xFor(i)}
              y={nutLabelY}
              fill={C_ACCENT}
              fontSize={FS_NUT_LABEL}
              fontWeight="bold"
              fontFamily={FONT_SANS}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {stringName}
            </text>
          ))}

        {/* Indicateurs au sillet : R (racine à vide), ○ (corde ouverte), × (étouffée) */}
        {positions.map((p) => {
          if (p.fret > 0) return null;
          const x = xFor(p.string);
          if (p.fret === 0) {
            if (p.interval === 'R' || p.interval === '1') {
              return (
                <g key={`nut-ind-${p.string}`}>
                  <circle cx={x} cy={nutZone} r={OPEN_ROOT_R} fill={C_ROOT} />
                  <text
                    x={x}
                    y={nutZone}
                    fill={C_WHITE}
                    fontSize={FS_OPEN_ROOT_LABEL}
                    fontWeight="bold"
                    fontFamily={FONT_SANS}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    R
                  </text>
                </g>
              );
            }
            return (
              <text
                key={`nut-ind-${p.string}`}
                x={x}
                y={nutZone}
                fill={C_ACCENT}
                fontSize={FS_OPEN_IND}
                fontWeight="bold"
                fontFamily={FONT_SANS}
                textAnchor="middle"
                dominantBaseline="central"
              >
                ○
              </text>
            );
          }
          return (
            <text
              key={`nut-ind-${p.string}`}
              x={x}
              y={nutZone}
              fill={C_ROOT}
              fontSize={FS_OPEN_IND}
              fontWeight="bold"
              fontFamily={FONT_SANS}
              textAnchor="middle"
              dominantBaseline="central"
            >
              ×
            </text>
          );
        })}

        {/* Cordes (corde 6 la plus épaisse, -12 % par corde) */}
        {Array.from({ length: STRINGS }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={xFor(i)}
            y1={offsetY}
            x2={xFor(i)}
            y2={boardBottom}
            stroke={C_WHITE}
            strokeWidth={Math.max(1, 4 * (1 - i * STRING_TAPER))}
          />
        ))}

        {/* Frettes */}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={OFFSET_X}
            y1={offsetY + i * gap}
            x2={OFFSET_X + 5 * stringGap}
            y2={offsetY + i * gap}
            stroke={C_WHITE}
            strokeWidth={4}
          />
        ))}

        {/* Sillet : 16 px en première position, filet fin sinon */}
        <line
          x1={OFFSET_X}
          y1={offsetY}
          x2={OFFSET_X + 5 * stringGap}
          y2={offsetY}
          stroke={C_WHITE}
          strokeWidth={startFret === 1 ? 16 : Math.max(2, 16 * 0.4)}
        />

        {/* Case de départ à gauche (jamais de boucle de numéros) */}
        {showFretNumbers && startFret > 1 && (
          <text
            x={OFFSET_X - FRET_NUM_GAP}
            y={yFor(0)}
            fill={C_ACCENT}
            fontSize={FS_FRET_NUM}
            fontWeight="bold"
            fontFamily={FONT_SANS}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {startFret}fr
          </text>
        )}

        {/* Pastilles : couleur + label d'intervalle */}
        {pressed.map((p) => {
          const rel = p.fret - startFret;
          if (rel < 0 || rel >= rows) return null;
          const x = xFor(p.string);
          const y = yFor(rel);
          const info = intervalStyle(p.interval);
          const isRoot = p.interval === 'R' || p.interval === '1';
          const label = p.interval ? info.label : p.finger ? String(p.finger) : '';
          return (
            <g key={`note-${p.string}-${p.fret}`}>
              <circle cx={x} cy={y} r={dotR} fill={info.color} />
              {label && (
                <text
                  x={x}
                  y={y}
                  fill={info.text}
                  fontSize={(isRoot ? FS_ROOT : FS_NOTE) * scale}
                  fontWeight="bold"
                  fontFamily={FONT_SANS}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
