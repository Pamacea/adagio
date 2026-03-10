/**
 * ADAGIO - ProgressionsSection Component
 * Section PROGRESSIONS: Progressions d'accords, cercle, système numéral
 */

'use client';

import { CHORD_PROGRESSIONS, ROMAN_DEGREES_MAJOR, ROMAN_DEGREES_MINOR } from '@adagio/theory';

export function ProgressionsSection() {
  return (
    <div className="space-y-8">
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Progressions d&apos;Accords
        </h2>
        <p className="text-sm text-gray mb-6">
          Une progression est une suite d&apos;accords qui crée un mouvement harmonique.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHORD_PROGRESSIONS.map((prog, i) => (
            <div key={i} className="border-2 border-steel bg-blackness p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-metal text-white">{prog.name}</h3>
                <span className="text-xs text-gray uppercase">{prog.key}</span>
              </div>
              <p className="text-xs text-gray mb-3">{prog.description}</p>

              <div className="flex gap-1 mb-3">
                {prog.chords.map((chord, j) => (
                  <div key={j} className="flex-1 text-center p-2 border border-steel bg-void">
                    <p className="text-sm font-bold text-white">{chord}</p>
                    <p className="text-xs text-gray">{prog.degrees[j]}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray">{prog.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Circle progression */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Progression Circulaire
        </h2>

        <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
          <circle cx="150" cy="150" r="100" fill="none" stroke="#2a2a2a" strokeWidth="2" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="#0a0f0a" strokeWidth="1" />

          {['I', 'IV', 'vii°', 'iii', 'vi', 'ii', 'V', 'I'].map((deg, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x = 150 + 85 * Math.cos(angle);
            const y = 150 + 85 * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#666666"
                fontSize="12"
                fontWeight="bold"
              >
                {deg}
              </text>
            );
          })}

          <path d="M 150 70 Q 200 80 210 120" fill="none" stroke="#8b1a1a" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 210 150 Q 200 190 160 200" fill="none" stroke="#8b1a1a" strokeWidth="2" />
          <path d="M 150 230 Q 100 220 90 180" fill="none" stroke="#8b1a1a" strokeWidth="2" />
          <path d="M 90 150 Q 100 100 140 80" fill="none" stroke="#8b1a1a" strokeWidth="2" />

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b1a1a" />
            </marker>
          </defs>

          <text x="150" y="145" textAnchor="middle" fill="#e0e0e0" fontSize="10" fontFamily="monospace">FIFTHS</text>
          <text x="150" y="158" textAnchor="middle" fill="#666666" fontSize="8" fontFamily="monospace">FALL</text>
        </svg>

        <p className="text-center text-sm text-gray mt-4">
          La chute des quintes (Circle Progression) - un classique
        </p>
      </div>

      {/* Number system */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Système Numéral
        </h2>
        <p className="text-sm text-gray mb-4">
          Les chiffres romains représentent les degrés de la gamme. Les majuscules sont majeurs,
          les minuscules sont mineurs.
        </p>

        <div className="grid grid-cols-7 gap-2">
          {ROMAN_DEGREES_MAJOR.map((deg, i) => {
            const isMinor = [1, 2, 5].includes(i);
            return (
              <div key={deg} className="text-center">
                <div className={`aspect-square border-2 ${isMinor ? 'border-gray' : 'border-steel'} bg-blackness flex items-center justify-center`}>
                  <span className={`text-xl font-metal ${isMinor ? 'text-gray' : 'text-white'}`}>
                    {isMinor ? ROMAN_DEGREES_MINOR[i] : deg}
                  </span>
                </div>
                <p className="text-xs text-gray mt-1">{i + 1}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
