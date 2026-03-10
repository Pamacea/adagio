/**
 * ADAGIO - ChordsSection Component
 * Section ACCORDS: Types d'accords et formules
 */

'use client';

import { CHORD_DEFINITIONS, CHORD_FORMULAS } from '@adagio/theory';

export function ChordsSection() {
  return (
    <div className="space-y-8">
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Types d&apos;Accords
        </h2>
        <p className="text-sm text-gray mb-6">
          Un accord est un ensemble de trois notes minimum jouées simultanément.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHORD_DEFINITIONS.map(chord => (
            <div key={chord.name} className="border-2 border-steel bg-blackness p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-metal text-white">{chord.name}</span>
                <span className="text-xs text-gray uppercase">{chord.fr}</span>
              </div>
              <p className="text-xs text-gray">{chord.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chord formula */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Formules d&apos;Accords
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel">
                <th className="text-left p-3 text-gray uppercase">Accord</th>
                <th className="text-left p-3 text-gray uppercase">Intervalle</th>
                <th className="text-left p-3 text-gray uppercase">Formule</th>
              </tr>
            </thead>
            <tbody>
              {CHORD_FORMULAS.map((formula, i) => (
                <tr key={i} className="border-b border-steel">
                  <td className="p-3 font-bold">{formula.name}</td>
                  <td className="p-3">{formula.intervals}</td>
                  <td className="p-3 text-gray">{formula.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
