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
  /** Masque le titre quand la page le rend déjà dans sa propre section. */
  hideTitle?: boolean;
  /** Libellé lu par les lecteurs d'écran (caption du tableau). */
  caption?: string;
}

export function SheetTable({ section, cfHref, hideTitle, caption }: SheetTableProps) {
  const { title, headers, rows } = section;
  if (rows.length === 0) return null;

  const hasHeaders = headers.some((h) => h.trim() !== '');
  const formattedTitle = formatSheetCell(title ?? '');
  const tableLabel = caption ?? formattedTitle;

  return (
    <div className="mb-8 last:mb-0">
      {title && !hideTitle && (
        <h2 className="mb-3 text-lg font-semibold text-white">{formattedTitle}</h2>
      )}
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full text-left text-sm">
          {tableLabel && <caption className="sr-only">{tableLabel}</caption>}
          {hasHeaders && (
            <thead>
              <tr className="hairline">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-3 py-3 text-[11px] font-bold uppercase tracking-widest text-rust whitespace-normal break-words"
                  >
                    {formatSheetCell(h)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="hairline last:border-b-0">
                {row.map((cell, ci) => {
                  const formatted = formatSheetCell(cell);
                  return (
                    <td
                      key={ci}
                      className={`px-3 py-3 align-top text-gray whitespace-normal break-words ${
                        ci === 0 ? 'font-medium text-white' : ''
                      }`}
                    >
                      {cfHref && formatted === 'cf.' ? (
                        <Link
                          href={cfHref}
                          className="font-semibold text-ember underline decoration-blood underline-offset-4 hover:text-white"
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
