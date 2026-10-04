/**
 * ADAGIO - Fretboard Chord Diagram
 * Diagramme d'accord vertical (style page chords) + calcul des positions de doigts
 * Extrait de app/(composer)/compose/page.tsx
 */

export function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Professional chord diagram component (vertical, matching chords page style)
export function FretboardChord({ chord }: { chord: string; width?: number; height?: number }) {
  const positions = getChordPositions(chord);

  const W = 240;
  const H = 280;
  const MARGIN_LEFT = 35;
  const MARGIN_TOP = 55;
  const STRING_SPACING = 30;
  const FRET_HEIGHT = 34;
  const NUM_FRETS = 5;
  const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];

  const pressedFrets = positions.filter((p) => p && p.fret > 0).map((p) => p!.fret);
  const minFret = pressedFrets.length > 0 ? Math.min(...pressedFrets) : 1;
  const startFret = minFret > 3 ? minFret : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="composeDiagramBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1814" />
          <stop offset="100%" stopColor="#0f0d0a" />
        </linearGradient>
        <radialGradient id="composeNoteFill" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
      </defs>

      {/* Fond */}
      <rect x="0" y="0" width={W} height={H} fill="#0a0908" rx="4" />
      <rect x="3" y="3" width={W - 6} height={H - 6} fill="url(#composeDiagramBg)" rx="3" />
      <rect
        x="3"
        y="3"
        width={W - 6}
        height={H - 6}
        fill="none"
        stroke="#333"
        strokeWidth={1}
        rx="3"
      />

      {/* Nom de l'accord */}
      <text
        x={W / 2}
        y={32}
        fill="#e5e5e5"
        fontSize={22}
        fontWeight="bold"
        textAnchor="middle"
        className="font-metal"
      >
        {chord}
      </text>

      {/* Indicateur de frette de départ */}
      {startFret > 1 && (
        <text
          x={MARGIN_LEFT - 12}
          y={MARGIN_TOP + FRET_HEIGHT / 2 + 4}
          fill="#888"
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
        >
          {startFret}
        </text>
      )}

      {/* DIAGRAMME */}
      <g transform={`translate(${MARGIN_LEFT}, ${MARGIN_TOP})`}>
        {/* Sillet */}
        {startFret === 1 && (
          <line
            x1={0}
            y1={0}
            x2={STRING_SPACING * 5}
            y2={0}
            stroke="#8b1a1a"
            strokeWidth={6}
            strokeLinecap="butt"
          />
        )}

        {/* Cordes verticales */}
        {STRING_NAMES.map((_, i) => (
          <line
            key={`s-${i}`}
            x1={i * STRING_SPACING}
            y1={0}
            x2={i * STRING_SPACING}
            y2={FRET_HEIGHT * NUM_FRETS}
            stroke="#555"
            strokeWidth={i === 0 || i === 5 ? 2.5 : 1.8}
            opacity={0.8}
          />
        ))}

        {/* Frettes horizontales */}
        {Array.from({ length: NUM_FRETS + 1 }).map((_, i) => (
          <line
            key={`f-${i}`}
            x1={0}
            y1={i * FRET_HEIGHT}
            x2={STRING_SPACING * 5}
            y2={i * FRET_HEIGHT}
            stroke="#555"
            strokeWidth={i === 0 && startFret === 1 ? 0 : 1.8}
            opacity={0.7}
          />
        ))}

        {/* Cordes à vide / étouffées */}
        {positions.map((pos, i) => {
          if (!pos) {
            // Corde non jouée (muted)
            const x = i * STRING_SPACING;
            const size = 6;
            return (
              <g key={`m-${i}`}>
                <line
                  x1={x - size}
                  y1={-18 - size}
                  x2={x + size}
                  y2={-18 + size}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <line
                  x1={x + size}
                  y1={-18 - size}
                  x2={x - size}
                  y2={-18 + size}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </g>
            );
          }
          if (pos.fret === 0) {
            const x = pos.string * STRING_SPACING;
            return (
              <circle
                key={`o-${i}`}
                cx={x}
                cy={-18}
                r={7}
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
              />
            );
          }
          return null;
        })}

        {/* Positions des doigts */}
        {positions.map((pos, i) => {
          if (!pos || pos.fret <= 0) return null;
          const relativeFret = pos.fret - startFret;
          if (relativeFret < 0 || relativeFret >= NUM_FRETS) return null;

          const x = pos.string * STRING_SPACING;
          const y = relativeFret * FRET_HEIGHT + FRET_HEIGHT / 2;

          return (
            <g key={`p-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="url(#composeNoteFill)"
                stroke="#8b1a1a"
                strokeWidth={2.5}
              />
              <text
                x={x}
                y={y + 1}
                fill="#e0e0e0"
                fontSize={11}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {pos.fret}
              </text>
            </g>
          );
        })}
      </g>

      {/* Labels des cordes en bas */}
      <g transform={`translate(${MARGIN_LEFT}, ${MARGIN_TOP + FRET_HEIGHT * NUM_FRETS + 18})`}>
        {STRING_NAMES.map((name, i) => (
          <text
            key={`l-${i}`}
            x={i * STRING_SPACING}
            y={0}
            fill="#555"
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
          >
            {name}
          </text>
        ))}
      </g>

      {/* Numéros de frettes sur le côté */}
      <g transform={`translate(${MARGIN_LEFT + STRING_SPACING * 5 + 10}, ${MARGIN_TOP})`}>
        {Array.from({ length: NUM_FRETS }, (_, i) => (
          <text
            key={`fn-${i}`}
            x={0}
            y={i * FRET_HEIGHT + FRET_HEIGHT / 2 + 4}
            fill="#555"
            fontSize={10}
            fontWeight="500"
            textAnchor="start"
          >
            {startFret + i}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function getChordPositions(chordName: string): ({ fret: number; string: number } | null)[] {
  // Parser l'accord
  const isMinor = chordName.endsWith('m') && !chordName.includes('aj');
  const isSeventh = chordName.includes('7') && !chordName.includes('maj');
  const isMajorSeventh = chordName.includes('maj7');
  const isMinorSeventh = isMinor && chordName.includes('7');
  const isDiminished = chordName.includes('dim') || chordName.includes('°');
  const isHalfDiminished = chordName.includes('m7b5') || chordName.includes('m7°');
  const isAdd9 = chordName.includes('add9') || chordName.includes('9');
  const isSus2 = chordName.includes('sus2');
  const isSus4 = chordName.includes('sus4');

  // Extraire la racine
  let root = chordName
    .replace('maj7', '')
    .replace('7', '')
    .replace('m7b5', '')
    .replace('add9', '')
    .replace('sus2', '')
    .replace('sus4', '')
    .replace('dim', '')
    .replace('°', '')
    .replace('m', '');

  // Positions de base pour accord ouvert (E shape)
  // Format: [Mi, La, Ré, Sol, Si, Mi] - de la corde 6 (Mi grave) à la corde 1 (Mi aigu)
  const getBasePositions = () => {
    if (isMinorSeventh) {
      // Am7: x02010
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 0, string: 3 },
        { fret: 1, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    if (isMajorSeventh) {
      // Amaj7: x02010
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 0, string: 3 },
        { fret: 0, string: 4 },
        { fret: 2, string: 5 },
      ];
    }
    if (isSeventh) {
      // A7: x02020
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 0, string: 3 },
        { fret: 2, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    if (isDiminished || isHalfDiminished) {
      // Adim / Adim7: xx0232
      return [
        { fret: null, string: 0 },
        { fret: null, string: 1 },
        { fret: 0, string: 2 },
        { fret: 2, string: 3 },
        { fret: 3, string: 4 },
        { fret: 2, string: 5 },
      ];
    }
    if (isAdd9) {
      // Aadd9: x02420
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 4, string: 3 },
        { fret: 2, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    if (isSus2) {
      // Asus2: x02200
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 2, string: 3 },
        { fret: 0, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    if (isSus4) {
      // Asus4: x02230
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 2, string: 3 },
        { fret: 3, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    // Accord mineur par défaut
    if (isMinor) {
      // Am: x02210
      return [
        { fret: null, string: 0 },
        { fret: 0, string: 1 },
        { fret: 2, string: 2 },
        { fret: 2, string: 3 },
        { fret: 1, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    // Accord majeur par défaut
    // A: x02220
    return [
      { fret: null, string: 0 },
      { fret: 0, string: 1 },
      { fret: 2, string: 2 },
      { fret: 2, string: 3 },
      { fret: 2, string: 4 },
      { fret: 0, string: 5 },
    ];
  };

  // Offsets pour chaque corde selon la note racine
  // Pour position ouverte en tonique A
  const rootOffsets: Record<string, number[]> = {
    C: [3, 3, 0, 0, 0, 3], // C shape décalé
    'C#': [4, 4, 1, 1, 1, 4],
    Db: [4, 4, 1, 1, 1, 4],
    D: [0, 0, 0, 2, 2, 2], // D shape
    'D#': [1, 1, 1, 3, 3, 3],
    Eb: [1, 1, 1, 3, 3, 3],
    E: [0, 2, 2, 2, 2, 0], // E shape (ouverte)
    F: [1, 1, 2, 3, 3, 1], // F shape barré
    'F#': [2, 2, 3, 4, 4, 2],
    Gb: [2, 2, 3, 4, 4, 2],
    G: [3, 3, 4, 5, 5, 3],
    'G#': [4, 4, 5, 6, 6, 4],
    Ab: [4, 4, 5, 6, 6, 4],
    A: [0, 0, 2, 2, 2, 0], // A shape (ouverte)
    'A#': [1, 1, 3, 3, 3, 1],
    Bb: [1, 1, 3, 3, 3, 1],
    B: [0, 2, 4, 4, 4, 2], // B shape
  };

  // Positions spécifiques pour certains accords
  const getSpecificPositions = () => {
    if (root === 'F' && isMajorSeventh) {
      // Fmaj7: 133210
      return [
        { fret: 1, string: 0 },
        { fret: 3, string: 1 },
        { fret: 3, string: 2 },
        { fret: 2, string: 3 },
        { fret: 1, string: 4 },
        { fret: 0, string: 5 },
      ];
    }
    if (root === 'F' && isSeventh) {
      // F7: 131211
      return [
        { fret: 1, string: 0 },
        { fret: 3, string: 1 },
        { fret: 1, string: 2 },
        { fret: 2, string: 3 },
        { fret: 1, string: 4 },
        { fret: 1, string: 5 },
      ];
    }
    if (root === 'F' && isMinor) {
      // Fm: 133111
      return [
        { fret: 1, string: 0 },
        { fret: 3, string: 1 },
        { fret: 3, string: 2 },
        { fret: 3, string: 3 },
        { fret: 1, string: 4 },
        { fret: 1, string: 5 },
      ];
    }
    if (root === 'F' && isMinorSeventh) {
      // Fm7: 131111
      return [
        { fret: 1, string: 0 },
        { fret: 3, string: 1 },
        { fret: 1, string: 2 },
        { fret: 1, string: 3 },
        { fret: 1, string: 4 },
        { fret: 1, string: 5 },
      ];
    }
    if (root === 'B' && isSeventh) {
      // B7: x21202 (x = corde non jouée)
      return [
        null,
        { fret: 2, string: 1 },
        { fret: 1, string: 2 },
        { fret: 2, string: 3 },
        { fret: 0, string: 4 },
        { fret: 2, string: 5 },
      ];
    }
    if (root === 'B' && isMajorSeventh) {
      // Bmaj7: x24342 (x = corde non jouée)
      return [
        null,
        { fret: 2, string: 1 },
        { fret: 4, string: 2 },
        { fret: 3, string: 3 },
        { fret: 4, string: 4 },
        { fret: 2, string: 5 },
      ];
    }
    return null;
  };

  const specificPositions = getSpecificPositions();
  if (specificPositions) {
    return specificPositions;
  }

  const basePositions = getBasePositions();
  const offsets = rootOffsets[root] ?? rootOffsets['A']!;

  return basePositions.map((pos, i) => {
    if (!pos || pos.fret === null) return null;
    return { fret: pos.fret + (offsets[i] || 0), string: pos.string };
  });
}
