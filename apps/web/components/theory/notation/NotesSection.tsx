/**
 * ADAGIO - NotesSection Component
 * Section NOTES: Notation française, portée musicale, figures de notes
 */

'use client';

import { FRENCH_SCALE_NOTES, FRENCH_NOTE_NAMES } from '@adagio/theory';

const ENGLISH_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export function NotesSection() {
  return (
    <div className="space-y-8">
      {/* French notes */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Notation Française
        </h2>
        <p className="text-sm text-gray mb-6">
          En France, les notes sont nommées différemment. Le système français utilise des syllabes
          issues de l&apos;hymne à Saint Jean.
        </p>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {FRENCH_SCALE_NOTES.map((note, i) => (
            <div key={note} className="text-center">
              <div className="aspect-square border-2 border-steel bg-blackness flex items-center justify-center mb-2">
                <span className="text-2xl font-metal text-white">{note}</span>
              </div>
              <p className="text-xs text-gray uppercase">{ENGLISH_NOTES[i]}</p>
            </div>
          ))}
        </div>

        <div className="border-2 border-steel bg-blackness p-4">
          <p className="text-xs text-gray uppercase mb-2">Histoire</p>
          <p className="text-sm text-gray">
            Au XIe siècle, Guido d&apos;Arezzo a créé ce système mnémotechnique en utilisant la première
            syllabe de chaque ligne de l&apos;hymne: <span className="text-white">UT queant laxis</span> (devenu DO),
            <span className="text-white"> RE sonare fibras</span>, <span className="text-white"> MIra gestorum</span>,
            <span className="text-white"> FAmuli tuorum</span>, <span className="text-white"> SOLve polluti</span>,
            <span className="text-white"> LAbii reatum</span>, <span className="text-white"> SI</span> (Sancte Iohannes).
          </p>
        </div>
      </div>

      {/* Stave visualization */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Portée Musicale
        </h2>

        <svg viewBox="0 0 500 180" className="w-full max-w-2xl mx-auto">
          {/* Staff lines - 5 lines with 15px spacing */}
          {[30, 45, 60, 75, 90].map((y, i) => (
            <line key={i} x1="80" y1={y} x2="450" y2={y} stroke="#2a2a2a" strokeWidth="2" />
          ))}

          {/* Treble clef */}
          <g transform="translate(85, 75)">
            <path d="M 8 -15 C 15 -20, 20 -10, 15 0 C 10 10, 0 5, -5 0 C -10 -5, -5 -15, 5 -20 L 5 -35"
              fill="none" stroke="#e0e0e0" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="-35" x2="5" y2="35" stroke="#e0e0e0" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="5" cy="38" r="3" fill="#e0e0e0" />
            <circle cx="12" cy="-5" r="2" fill="#e0e0e0" />
          </g>

          {/* Notes on staff */}
          <g>
            <ellipse cx="150" cy="75" rx="10" ry="8" fill="#e0e0e0" transform="rotate(-20 150 75)" />
            <line x1="158" y1="73" x2="158" y2="35" stroke="#e0e0e0" strokeWidth="2" />
            <text x="150" y="115" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">SOL</text>
          </g>

          <g>
            <ellipse cx="210" cy="67.5" rx="10" ry="8" fill="#e0e0e0" transform="rotate(-20 210 67.5)" />
            <line x1="218" y1="65.5" x2="218" y2="27.5" stroke="#e0e0e0" strokeWidth="2" />
            <text x="210" y="115" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">LA</text>
          </g>

          <g>
            <ellipse cx="270" cy="60" rx="10" ry="8" fill="#e0e0e0" transform="rotate(-20 270 60)" />
            <line x1="278" y1="58" x2="278" y2="20" stroke="#e0e0e0" strokeWidth="2" />
            <text x="270" y="115" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">SI</text>
          </g>

          <g>
            <ellipse cx="330" cy="52.5" rx="10" ry="8" fill="#e0e0e0" transform="rotate(-20 330 52.5)" />
            <line x1="338" y1="50.5" x2="338" y2="12.5" stroke="#e0e0e0" strokeWidth="2" />
            <text x="330" y="115" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">DO</text>
          </g>

          <g>
            <ellipse cx="390" cy="45" rx="10" ry="8" fill="#e0e0e0" transform="rotate(-20 390 45)" />
            <line x1="398" y1="43" x2="398" y2="5" stroke="#e0e0e0" strokeWidth="2" />
            <text x="390" y="115" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">RÉ</text>
          </g>

          {/* Middle C with ledger line */}
          <g>
            <line x1="100" y1="105" x2="140" y2="105" stroke="#3a3a3a" strokeWidth="2.5" />
            <ellipse cx="120" cy="105" rx="8" ry="6" fill="#e0e0e0" transform="rotate(-20 120 105)" />
            <line x1="126" y1="103" x2="126" y2="68" stroke="#e0e0e0" strokeWidth="1.8" />
            <text x="120" y="138" textAnchor="middle" fill="#888888" fontSize="11" fontFamily="monospace">DO</text>
          </g>

          <text x="80" y="160" fill="#666666" fontSize="10" fontFamily="monospace">Clef de SOL</text>
        </svg>
      </div>

      {/* Rhythm notation */}
      <div className="section-frame p-6">
        <h2 className="text-xl font-metal text-white uppercase tracking-wider mb-4">
          Figures de Notes
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {noteFigures.map(note => (
            <div key={note.name} className="border-2 border-steel bg-blackness p-4 text-center">
              <div className="flex items-center justify-center h-16 mb-2">{note.symbol}</div>
              <p className="text-sm font-bold text-white">{note.name}</p>
              <p className="text-xs text-gray">{note.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const noteFigures = [
  {
    name: 'Ronde',
    value: '4 temps',
    symbol: (
      <svg viewBox="0 0 40 60" className="w-12 h-16 mx-auto">
        <ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
      </svg>
    )
  },
  {
    name: 'Blanche',
    value: '2 temps',
    symbol: (
      <svg viewBox="0 0 40 60" className="w-12 h-16 mx-auto">
        <ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
      </svg>
    )
  },
  {
    name: 'Noire',
    value: '1 temps',
    symbol: (
      <svg viewBox="0 0 40 60" className="w-12 h-16 mx-auto">
        <ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
        <ellipse cx="30" cy="10" rx="6" ry="4" fill="#e0e0e0" />
      </svg>
    )
  },
  {
    name: 'Croche',
    value: '1/2 temps',
    symbol: (
      <svg viewBox="0 0 40 60" className="w-12 h-16 mx-auto">
        <ellipse cx="20" cy="45" rx="12" ry="10" fill="#e0e0e0" transform="rotate(-20 20 45)" />
        <line x1="30" y1="43" x2="30" y2="10" stroke="#e0e0e0" strokeWidth="3" />
        <ellipse cx="30" cy="10" rx="6" ry="4" fill="#e0e0e0" />
        <path d="M 30 10 Q 42 18 38 30" fill="#e0e0e0" stroke="#e0e0e0" strokeWidth="2" />
      </svg>
    )
  },
];
