/**
 * ADAGIO - SheetTable
 * Rend génériquement une section du Sheet importé (SHEET_CONTENT)
 * Source : Google Sheet "[MUSIC] Guitar" → scripts/import-sheet.mjs
 */

import Link from 'next/link';
import type { SheetSection } from '@adagio/theory';

/** Nettoie le contenu cellule : formules $...$, LaTeX (\sharp, _{maj7}) → texte lisible. */
export function formatSheetCell(cell: string): string {
  if (!cell) return '';
  return cell
    .replace(/\$([^$]*)\$/g, '$1')
    .replace(/\\sharp/g, '♯')
    .replace(/\\flat/g, '♭')
    .replace(/\\rightarrow/g, '→')
    .replace(/_\{([^}]*)\}/g, '$1')
    .replace(/\\text\{([^}]*)\}/g, '$1');
}

interface SheetTableProps {
  section: SheetSection;
  /** Si une cellule vaut « cf. », la transformer en lien vers cette page */
  cfHref?: string;
}

export function SheetTable({ section, cfHref }: SheetTableProps) {
  const { title, headers, rows } = section;
  if (rows.length === 0) return null;

  const hasHeaders = headers.some((h) => h.trim() !== '');

  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-xl font-metal text-white uppercase tracking-tight mb-3">
          {formatSheetCell(title)}
        </h2>
      )}
      <div className="overflow-x-auto border-2 border-steel/30 bg-blackness/80">
        <table className="w-full text-left text-sm">
          {hasHeaders && (
            <thead>
              <tr className="border-b-2 border-steel/30 bg-abyss">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-xs font-semibold text-gray uppercase tracking-widest whitespace-nowrap"
                  >
                    {formatSheetCell(h)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-steel/20 last:border-b-0 even:bg-abyss/40"
              >
                {row.map((cell, ci) => {
                  const formatted = formatSheetCell(cell);
                  return (
                    <td key={ci} className="px-3 py-2 text-gray-300 align-top">
                      {cfHref && formatted === 'cf.' ? (
                        <Link
                          href={cfHref}
                          className="text-toxic hover:underline uppercase tracking-widest text-xs"
                        >
                          cf. → voir
                        </Link>
                      ) : (
                        formatted
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SheetTabTablesProps {
  sections: SheetSection[];
  cfHref?: string;
}

/** Rend toutes les sections d'un onglet du Sheet. */
export function SheetTabTables({ sections, cfHref }: SheetTabTablesProps) {
  return (
    <>
      {sections.map((section, i) => (
        <SheetTable key={i} section={section} cfHref={cfHref} />
      ))}
    </>
  );
}
