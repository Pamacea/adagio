// ============================================================================
// SHEET CONTENT — GÉNÉRÉ AUTOMATIQUEMENT, NE PAS ÉDITER À LA MAIN
// Source : docs/csv/*.csv (export Google Sheet "[MUSIC] Guitar")
// Régénérer : pnpm sheet:import
// ============================================================================

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
  | 'modes'
  | 'triades'
  | 'renversement'
  | 'gammes'
  | 'accords'
  | 'progressions'
  | 'techniques'
  | 'composee'
  | 'drive'
  | 'harmonie'
  | 'notes-conseils'
  | 'anti-seche';

export const SHEET_CONTENT: Record<SheetTabId, SheetTabData> = {
  'modes': {
    id: 'modes',
    title: "Modes",
    source: "Guitar  - Modes.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "MODE — GAMME",
          "INTERVALLES",
          "DEGRÉS ALTERÉS",
          "Accord",
          "NOTES (Tonique Do)",
          "Exemple en Do",
          "CARACTERE"
        ],
        "rows": [
          [
            "Ionien",
            "1 – 2 – 3 – 4 – 5 – 6 – 7",
            "—",
            "M7",
            "C – D – E – F – G – A – B",
            "C–D–E–F–G–A–B–C",
            "Gamme “majeure classique”"
          ],
          [
            "Dorien",
            "1 – 2 – ♭3 – 4 – 5 – 6 – ♭7",
            "♭3, ♭7",
            "m7",
            "D – E – F – G – A – B – C",
            "C–D–Eb–F–G–A–Bb–C",
            "Mode mineur “chaud / jazzy”"
          ],
          [
            "Phrygien",
            "1 – ♭2 – ♭3 – 4 – 5 – ♭6 – ♭7",
            "♭2, ♭3, ♭6, ♭7",
            "m7",
            "E – F – G – A – B – C – D",
            "C–Db–Eb–F–G–Ab–Bb–C",
            "Mode “espagnol / sombre”"
          ],
          [
            "Phrygien dominant",
            "1 – ♭2 – 3 – 4 – 5 – ♭6 – ♭7",
            "♭2, ♭6, ♭7",
            "",
            "—",
            "—",
            "Mode \"oriental / espagnol\""
          ],
          [
            "Lydien",
            "1 – 2 – 3 – ♯4 – 5 – 6 – 7",
            "♯4",
            "M7",
            "F – G – A – B – C – D – E",
            "C–D–E–F#–G–A–B–C",
            "Mode “aérien / lumineux”"
          ],
          [
            "Mixolydien",
            "1 – 2 – 3 – 4 – 5 – 6 – ♭7",
            "♭7",
            "7",
            "G – A – B – C – D – E – F",
            "C–D–E–F–G–A–Bb–C",
            "Mode majeur “bluesy / rock”"
          ],
          [
            "Éolien (Mineure naturelle)",
            "1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7",
            "♭3, ♭6, ♭7",
            "m7",
            "A – B – C – D – E – F – G",
            "C–D–Eb–F–G–Ab–Bb–C",
            "Mode mineur “classique”"
          ],
          [
            "Locrien",
            "1 – ♭2 – ♭3 – 4 – ♭5 – ♭6 – ♭7",
            "♭2, ♭3, ♭5, ♭6, ♭7",
            "m7b5",
            "B – C – D – E – F – G – A",
            "C–Db–Eb–F–Gb–Ab–Bb–C",
            "Mode très instable, m7♭5"
          ],
          [
            "Lydien Augmenté",
            "1 – 2 – 3 – ♯4 – ♯5 – 6 – 7",
            "♯4, ♯5",
            "",
            "C – D – E – F# – G# – A – B",
            "C – D – E – F# – G# – A – B",
            "Mode “aérien / lumineux”"
          ]
        ]
      }
    ],
  },
  'triades': {
    id: 'triades',
    title: "Triades",
    source: "Guitar  - Triades.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "TRIADE",
          "INTERVALLES",
          "DEGRÉS ALTERÉS",
          "NOTES",
          "LIENS"
        ],
        "rows": [
          [
            "Triades Majeures",
            "F – 3 – 5",
            "—",
            "—",
            "cf."
          ],
          [
            "Triades Mineures",
            "F – ♭3 – 5",
            "♭3",
            "—",
            "cf."
          ],
          [
            "Triades Diminuées",
            "F – ♭3 – ♭5",
            "♭3, ♭5",
            "—",
            "—"
          ],
          [
            "Triades Augmentées",
            "F – 3 – ♯5",
            "♯5",
            "—",
            "—"
          ]
        ]
      }
    ],
  },
  'renversement': {
    id: 'renversement',
    title: "Renversements",
    source: "Guitar  - Renversement.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "RENVERSEMENT",
          "INTERVALLES",
          "NOTES",
          "LIENS"
        ],
        "rows": [
          [
            "Fondamentale",
            "T – 3 – 5",
            "Accord parfait (fondamental)",
            "cf."
          ],
          [
            "1er renversement",
            "3–T–5 ou 3–5–T",
            "Accord de sixte (6)",
            "cf."
          ],
          [
            "2e renversement",
            "5–T–3 ou 5–3–T",
            "Accord de sixte et quarte (6/4)",
            "—"
          ]
        ]
      }
    ],
  },
  'gammes': {
    id: 'gammes',
    title: "Gammes",
    source: "Guitar  - Gammes.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "GAMME",
          "APPRENTISSAGE ( ⭕ ❌ )",
          "DESCRIPTION",
          "NOTES",
          "LIENS"
        ],
        "rows": [
          [
            "Majeure",
            "⭕",
            "T – T – S – T – T – T – S",
            "1 2 3 4 5 6 7",
            "cf."
          ],
          [
            "Majeure augmentée",
            "⭕",
            "—",
            "1 2 3 4 ♯5 6 7",
            "cf."
          ],
          [
            "Mineur Naturelle",
            "⭕",
            "Le mode particulier issu de la gamme majeure, l'Éolien !",
            "1 2 ♭3 4 5 ♭6 ♭7",
            "cf."
          ],
          [
            "Pentatonique Majeure",
            "⭕",
            "—",
            "1 2 3 5 6",
            "cf."
          ],
          [
            "Pentatonique Mineure",
            "⭕",
            "—",
            "1 ♭3 4 5 ♭7",
            "cf."
          ],
          [
            "Blues",
            "⭕",
            "Ajout de la Blues Note dans la gamme pentatonique mineure entre la 3e et 4e note.",
            "1 ♭3 B 4 5 ♭7",
            "cf."
          ],
          [
            "Harmonique Majeure",
            "⭕",
            "—",
            "1 2 3 4 5 ♭6 7",
            "cf."
          ],
          [
            "Harmonique Mineure",
            "⭕",
            "—",
            "1 2 ♭3 4 5 ♭6 7",
            "cf."
          ],
          [
            "Mineure Mélodique",
            "⭕",
            "—",
            "1 2 ♭3 4 5 6 7",
            "cf."
          ],
          [
            "Napolitain mineur",
            "⭕",
            "dramatique, classique, jazz",
            "1 ♭2 ♭3 4 5 ♭6 7",
            "cf."
          ],
          [
            "Hongrois mineur",
            "⭕",
            "tzigane, dramatique, expressive",
            "1 2 ♭3 ♯4 5 ♭6 7",
            "cf."
          ],
          [
            "Augmentée Symétrique",
            "⭕",
            "—",
            "1 – ♯2/♭3 – 3 – 5 – ♯5/♭6 – 7",
            "cf."
          ],
          [
            "Diminuée(2POS)",
            "⭕",
            "—",
            "T – S – T – S – T – S – T – S",
            "cf."
          ],
          [
            "Chromatique(1POS)",
            "⭕",
            "—",
            "—",
            "cf."
          ]
        ]
      }
    ],
  },
  'accords': {
    id: 'accords',
    title: "Accords",
    source: "Guitar  - Accords.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "Accord(47.)",
          "APPRENTISSAGE ( ⭕ ❌ )",
          "DESCRIPTION",
          "NOTES",
          "LIENS"
        ],
        "rows": [
          [
            "Majeur 7",
            "⭕",
            "—",
            "1 3 5 7",
            "cf."
          ],
          [
            "Mineur 7",
            "⭕",
            "—",
            "1 ♭3 5 ♭7",
            "cf."
          ],
          [
            "7",
            "⭕",
            "—",
            "1 3 5 ♭7",
            "cf."
          ],
          [
            "Mineur 7 ♭5",
            "⭕",
            "—",
            "1 ♭3 ♭5 ♭7",
            "cf."
          ],
          [
            "7 Diminué",
            "⭕",
            "—",
            "1 ♭3 ♭5 ♭♭7",
            "cf."
          ],
          [
            "Majeur 9",
            "⭕",
            "—",
            "1 2 3 4 5 6 7 9",
            "cf."
          ],
          [
            "Mineur 9",
            "⭕",
            "—",
            "1 2 ♭3 4 5 6 ♭7 9",
            "cf."
          ],
          [
            "9",
            "⭕",
            "—",
            "1 2 3 4 5 6 ♭7 9",
            "cf."
          ],
          [
            "Majeur 11",
            "⭕",
            "—",
            "1 2 3 4 5 6 7 9 11",
            "cf."
          ],
          [
            "Mineur 11",
            "⭕",
            "—",
            "1 2 ♭3 4 5 6 ♭7 9 11",
            "cf."
          ],
          [
            "11",
            "⭕",
            "—",
            "1 2 3 4 5 6 ♭7 9 11",
            "cf."
          ],
          [
            "Majeur 13",
            "⭕",
            "—",
            "1 2 3 4 5 6 7 9 11 13",
            "cf."
          ],
          [
            "Mineur 13",
            "⭕",
            "—",
            "1 2 ♭3 4 5 6 ♭7 9 11 13",
            "cf."
          ],
          [
            "13",
            "⭕",
            "—",
            "1 2 3 4 5 6 ♭7 9 11 13",
            "cf."
          ],
          [
            "Suspendu",
            "⭕",
            "Les accords SUS sont des accords à 3 notes, dans lesquels la tierce a été remplacée par une autre note (seconde ou quarte).",
            "1 2 5 | 1 4 5",
            "cf."
          ],
          [
            "Blues",
            "⭕",
            "Ici particulièrement x5 et x6 avec la tonique sur corde Mi g et La ainsi x9, x13 et x13maj sur corde Mi g.",
            "1 – 3 – 5 – ♭7 – 9 – 11 – 13",
            "cf."
          ],
          [
            "Power Chords",
            "⭕",
            "x5",
            "1 – 5  ou  1 – 5 – 1",
            "cf."
          ],
          [
            "Aug",
            "⭕",
            "triade avec quinte augmentée",
            "1 – 3 – #5 1 – 5  ou  1 – 3 – #5 – 1",
            "cf."
          ],
          [
            "Add2",
            "⭕",
            "triade +2",
            "1 – 3 – 5 – 2",
            "cf. AntiSèche"
          ],
          [
            "Add4",
            "⭕",
            "triade + 4e",
            "1 – 3 – 5 – 4",
            "cf. AntiSèche"
          ],
          [
            "Add9",
            "⭕",
            "triade + 2 à l'octave",
            "1 – 3 – 5 – 9",
            "cf. AntiSèche"
          ],
          [
            "6m",
            "⭕",
            "Accord de sixte mineur",
            "1 – ♭3 – 5 – 6",
            "cf. AntiSèche"
          ],
          [
            "6",
            "⭕",
            "—",
            "1 – 3 – 5 – 6",
            "cf. AntiSèche"
          ],
          [
            "6/9",
            "⭕",
            "—",
            "1 – 3 – 5 – 6 – 9",
            "cf. AntiSèche"
          ],
          [
            "6dim7",
            "⭕",
            "—",
            "1 – ♭3 – ♭5 – 6(ou ♭♭7)",
            "cf. AntiSèche"
          ]
        ]
      }
    ],
  },
  'progressions': {
    id: 'progressions',
    title: "Progressions",
    source: "Guitar  - Progressions.csv",
    empty: false,
    sections: [
      {
        "title": "DEGRÉS FONCTIONNELS / NOTES",
        "headers": [
          "Tonique(stabilité)",
          "Pré-dominant(tension préparatoire)",
          "Dominant(tension maximale)",
          "Résolution(relâchement de la tension)",
          "NOTES"
        ],
        "rows": [
          [
            "",
            "",
            "",
            "",
            "1. Fonction tonale\nI : stabilité\nII / IV : préparation\nV : tension / résolution\nVI : couleur mineure stable\nIII : couleur mineure flottante"
          ],
          [
            "(I – III – VI)",
            "(II – IV)",
            "(V – VII)",
            "(I – VI)",
            ""
          ],
          [
            "I",
            "IIm",
            "V7",
            "I",
            ""
          ],
          [
            "I6",
            "IIm7",
            "V9",
            "Imaj7",
            "Conserver note commune entre accords\nDéplacement par demi-ton (chromatisme)\nMélodie d’accords = priorité"
          ],
          [
            "Imaj7",
            "IIm9",
            "V11",
            "Imaj9",
            ""
          ],
          [
            "Imaj9",
            "IIm11",
            "V13",
            "Imaj13",
            ""
          ],
          [
            "Imaj13",
            "IIm7b5",
            "V7b9",
            "I6",
            "2. Variations harmoniques\nSub V : V → ♭II7\nModal interchange : I → ♭VII → IV\nRelative mineure : Imaj → VI-7\nCycle : III-7 → VI-7 → II-7 → V7"
          ],
          [
            "Iadd9",
            "II6/9",
            "V7#9",
            "Iadd9",
            ""
          ],
          [
            "I6/9",
            "IV",
            "V7b13",
            "I6/9",
            ""
          ],
          [
            "Imaj6/9",
            "IVmaj7",
            "VIIm7b5",
            "bVImaj7",
            ""
          ],
          [
            "Im6 (tonique mineure empruntée)",
            "IVmaj9",
            "V7#11",
            "Imaj7(#11)",
            "3. Variations de motif\nGarder la même progression → changer le riff\nGarder le riff → changer l’accord dessous\nVarier : rythme, registre, articulation"
          ],
          [
            "Im7 (tonique modale)",
            "IVmaj13",
            "V7alt (b9/#9/#11/b13)",
            "Im6 (résolution douce)",
            ""
          ],
          [
            "Im9",
            "IVadd9",
            "V7sus4 → V7",
            "Im9",
            ""
          ],
          [
            "Im11",
            "IV6/9",
            "Vdim7 (VII° fonctionnelle)",
            "Imaj9",
            "4. Texture\nVoicings courts (2–3 notes)\nDrop-2 / Drop-3 pour l’ouverture\nDoubler la basse ou la soprano selon l’effet recherché\n\n5. Structure\nA → A’ (variante) → B (modulation / couleur) → A\nRetour du thème pour cohérence"
          ],
          [
            "IIIm7",
            "IIIm7b5 (couleur sombre)",
            "V7(#5)",
            "Imaj7(♯5)",
            ""
          ],
          [
            "IIIadd9",
            "VIm9",
            "V7(b5)",
            "VIm7 (cadence trompeuse)",
            ""
          ],
          [
            "III7sus2",
            "IV(#11) lydien",
            "V7/#V7 triton-sub",
            "Imaj7",
            ""
          ],
          [
            "III7",
            "II7sus4(add9)",
            "VII7",
            "bIIImaj9",
            "Imaj / IV est une superposition de deux accords. On peut superposer deux accords pour former une superposition."
          ],
          [
            "III7b9",
            "IV7sus4",
            "V / bII",
            "VI9",
            ""
          ],
          [
            "VIm7",
            "IVmMaj7",
            "V / II",
            "VImaj7",
            ""
          ],
          [
            "VIm9",
            "IVm6/9",
            "V7 / bVII",
            "VImaj9",
            ""
          ],
          [
            "VIadd9",
            "II / V",
            "",
            "VI13",
            ""
          ],
          [
            "VI7sus4",
            "IV / II",
            "",
            "Iadd4",
            ""
          ],
          [
            "VI11",
            "IVm / bVI",
            "",
            "Isus2 → I",
            ""
          ],
          [
            "VI6/9sus2",
            "II13",
            "",
            "VI7sus4",
            ""
          ],
          [
            "Iadd4",
            "",
            "",
            "I / V",
            ""
          ],
          [
            "I5add9",
            "",
            "",
            "Imaj / bVI",
            ""
          ],
          [
            "Isus2(add6)",
            "",
            "",
            "VI / I",
            ""
          ],
          [
            "Imaj/IV",
            "",
            "",
            "",
            ""
          ]
        ]
      }
    ],
  },
  'techniques': {
    id: 'techniques',
    title: "Techniques",
    source: "Guitar  - Techniques.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "TECHNIQUES",
          "APPRENTISSAGE ( ⭕ ❌ )",
          "DESCRIPTION",
          "NOTES",
          "LIENS"
        ],
        "rows": [
          [
            "Alternate picking",
            "⭕",
            "– attaque alternée haut/bas avec le médiator.",
            "—",
            "cf."
          ],
          [
            "Economy picking",
            "⭕",
            "– variante fluide de l’alternate, en combinant sweeping et alternate.",
            "—",
            "cf."
          ],
          [
            "Down picking",
            "⭕",
            "– uniquement des coups vers le bas (ex : James Hetfield).",
            "—",
            "cf."
          ],
          [
            "Hybrid picking",
            "⭕",
            "– médiator + doigts (très utilisé en country, fusion, rock).",
            "—",
            "cf."
          ],
          [
            "Finger picking",
            "⭕",
            "– jeu aux doigts (sans médiator).",
            "—",
            "cf."
          ],
          [
            "Chicken picking",
            "⭕",
            "– tiré claquant des cordes, souvent country/funk.",
            "—",
            "cf."
          ],
          [
            "Raking",
            "⭕",
            "– balayage de plusieurs cordes mortes ou pour accentuer une note.",
            "—",
            "cf."
          ],
          [
            "Sweep picking",
            "⭕",
            "– balayer plusieurs cordes dans un mouvement fluide (souvent pour les arpèges rapides).",
            "—",
            "cf."
          ],
          [
            "Directional picking",
            "⭕",
            "– semblable à l’economy, accentue le mouvement “naturel” de la main. +On remonte d'une corde alors on upstroke, on descend alors on downstroke.",
            "—",
            "cf."
          ],
          [
            "Slap picking",
            "⭕",
            "– mélange entre un slap alterné plus du finger picking.",
            "—",
            "cf."
          ],
          [
            "Hammer-on",
            "⭕",
            "– enchaîner une note en frappant la corde sans regratter.",
            "—",
            "cf."
          ],
          [
            "Pull-off",
            "⭕",
            "– retirer le doigt pour faire sonner une note inférieure.",
            "—",
            "cf."
          ],
          [
            "Slide",
            "⭕",
            "– faire glisser un doigt d’une case à une autre.",
            "—",
            "cf."
          ],
          [
            "Bend",
            "⭕",
            "– tirer ou pousser une corde pour monter la hauteur du son.",
            "—",
            "cf."
          ],
          [
            "Vibrato",
            "⭕",
            "– faire osciller la note après un bend ou un appui.",
            "—",
            "cf."
          ],
          [
            "Legato",
            "⭕",
            "– jeu fluide combinant hammer-on, pull-off et slides sans attaque.",
            "—",
            "cf."
          ],
          [
            "Trill",
            "⭕",
            "– alternance rapide entre deux notes proches (mini hammer/pull rapides).",
            "—",
            "cf."
          ],
          [
            "Pre-bend / Release bend",
            "⭕",
            "– bend avant de gratter, puis relâcher.",
            "—",
            "cf."
          ],
          [
            "Harmoniques naturelles",
            "⭕",
            "– toucher légèrement une corde sur une frette (5e, 7e, 12e...).",
            "—",
            "cf."
          ],
          [
            "Harmoniques artificielles (pinch)",
            "⭕",
            "– générées avec le pouce du médiator (sons aigus, criards).",
            "—",
            "cf."
          ],
          [
            "Tapped harmonics",
            "⭕",
            "– harmoniques créées par tap sur une case spécifique. Joué fret 5 puis tap 12 ou 17,",
            "—",
            "cf."
          ],
          [
            "Harmoniques à la main droite (touch harmonics)",
            "❌",
            "– touchées avec un doigt pendant le grattage.",
            "—",
            "cf."
          ],
          [
            "Feedback",
            "⭕",
            "– utiliser la résonance de l’ampli pour créer un sustain aigu.",
            "—",
            "cf."
          ],
          [
            "Tapping",
            "⭕",
            "– frapper les cordes avec un ou plusieurs doigts de la main droite.",
            "—",
            "cf."
          ],
          [
            "Two-hand tapping",
            "⭕",
            "– tapping avec les deux mains (Eddie Van Halen).",
            "—",
            "cf."
          ],
          [
            "Palm mute",
            "⭕",
            "– étouffer les cordes avec la paume (metal, rock).",
            "—",
            "cf."
          ],
          [
            "Muted strumming",
            "⭕",
            "– gratter en étouffant les cordes pour un effet percussif.",
            "—",
            "cf."
          ],
          [
            "Tremolo picking",
            "⭕",
            "– attaque ultra rapide d’une même note.",
            "—",
            "cf."
          ],
          [
            "Dead notes / ghost notes",
            "⭕",
            "– notes étouffées percussives.",
            "—",
            "cf."
          ],
          [
            "Whammy bar techniques",
            "⭕",
            "– dive bombs, flutter, vibrato (grâce au vibrato/tremolo arm).",
            "—",
            "cf."
          ],
          [
            "Volume swells",
            "⭕",
            "– utiliser le potard de volume ou une pédale pour un effet violon.",
            "—",
            "cf."
          ],
          [
            "Strumming patterns",
            "⭕❌",
            "– rythmiques variées au médiator.",
            "—",
            "cf."
          ],
          [
            "Syncopation",
            "⭕❌",
            "– accentuation des temps faibles.",
            "—",
            "cf."
          ],
          [
            "Chugging",
            "⭕",
            "– palm mute agressif et rythmique typique du metal.",
            "—",
            "cf."
          ]
        ]
      }
    ],
  },
  'composee': {
    id: 'composee',
    title: "Extensions (gamme composée)",
    source: "Guitar  - Composée.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "Extension",
          "Intervalle \"Simple\"",
          "Équivalence visuelle sur le manche",
          "Couleur sonore"
        ],
        "rows": [
          [
            "9ème",
            "2nde",
            "2 cases au-dessus de la Fondamentale",
            "Ouvert, riche"
          ],
          [
            "11ème",
            "4te",
            "Même case, une corde plus bas (souvent)",
            "Suspendu"
          ],
          [
            "#11ème",
            "4te augm.",
            "Le son \"Lydien\" par excellence",
            "Féerique, instable"
          ],
          [
            "13ème",
            "6te",
            "2 cases en dessous de la 7ème",
            "Jazzy, sophistiqué"
          ],
          [
            "b13ème",
            "6te mineure",
            "3 cases en dessous de la 7ème",
            "Tension (James Bond / Altéré)"
          ]
        ]
      }
    ],
  },
  'drive': {
    id: 'drive',
    title: "Drive (rythme)",
    source: "Guitar  - Drive.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "Division",
          "Nom",
          "Sensation",
          "Subdivision (pour 1 temps)"
        ],
        "rows": [
          [
            "1/4",
            "Noire",
            "La pulsation pure",
            "1"
          ],
          [
            "1/8",
            "Croches",
            "Binaire stable",
            "1 - et"
          ],
          [
            "1/12",
            "Triolets",
            "Balancement (Blues/Jazz)",
            "1 - puis - la"
          ],
          [
            "1/16",
            "Doubles croches",
            "Énergie / Funk",
            "1 - e - et - a"
          ],
          [
            "1/24",
            "Sextolets",
            "Vélocité (Shred)",
            "1-2-3-4-5-6"
          ]
        ]
      }
    ],
  },
  'harmonie': {
    id: 'harmonie',
    title: "Harmonie",
    source: "Guitar  - Harmonie.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "Type d'Accord (Base)",
          "Intervalle de la Triade",
          "Exemple (sur C)",
          "Résultat Sonore (Tensions)",
          "Couleur / Style"
        ],
        "rows": [
          [
            "Dominant (7)",
            "II (2nde Maj)",
            "D / C7",
            "$9, \\sharp 11, 13$",
            "Lydien b7 (Moderne, brillant)"
          ],
          [
            "Dominant (7)",
            "bV (Quinte dim)",
            "Gb / C7",
            "$b5, 7, b9$",
            "Très tendu (Jazz, Altéré)"
          ],
          [
            "Dominant (7)",
            "VI (6te Maj)",
            "A / C7",
            "$13, b9, 3$",
            "Bluesy / Gospel / Diminué"
          ],
          [
            "Dominant (7)",
            "bVI (6te min)",
            "Ab / C7",
            "$b13, \\sharp 9, b9$",
            "Sombre, \"James Bond\" / Altered"
          ],
          [
            "Majeur (Maj7)",
            "V (Quinte)",
            "G / Cmaj7",
            "$5, 7, 9$",
            "Maj9 (Stable et riche)"
          ],
          [
            "Majeur (Maj7)",
            "II (2nde Maj)",
            "D / Cmaj7",
            "$9, \\sharp 11, 6$",
            "Lydien (Féerique / Aérien)"
          ],
          [
            "Mineur (m7)",
            "bIII (3ce min)",
            "Eb / Cm7",
            "$b3, 5, b7, 9$",
            "m9 (Standard Jazz, doux)"
          ]
        ]
      },
      {
        "title": "Axis Theory",
        "headers": [
          "Famille (Fonction)",
          "Accord Principal",
          "Substitut 1 (+ 3 demi-tons)",
          "Substitut 2 (+ 6 demi-tons)",
          "Substitut 3 (+ 9 demi-tons)"
        ],
        "rows": [
          [
            "Axe Tonique (I)",
            "C (ou Am)",
            "Eb (ou Cm)",
            "Gb (ou F#m)",
            "A (ou G#m)"
          ],
          [
            "Axe Dominante (V)",
            "G (ou Em)",
            "Bb (ou Gm)",
            "Db (ou Bm)",
            "E (ou C#m)"
          ],
          [
            "Axe Sous-Dom (IV)",
            "F (ou Dm)",
            "Ab (ou Fm)",
            "B (ou G#m)",
            "D (ou Bm)"
          ]
        ]
      },
      {
        "title": null,
        "headers": [
          "Coltrane",
          "",
          "",
          "",
          "UST",
          ""
        ],
        "rows": [
          [
            "Pôle de Résolution",
            "Substitution de Tierce 1",
            "Substitution de Tierce 2",
            "Formule de Distance (Demi-tons)",
            "Note d'origine (Intervalle)",
            "Note Négative (Résultat)"
          ],
          [
            "I",
            "bVI",
            "III",
            "$0 \\rightarrow +8 \\rightarrow +4$",
            "1 (Tonique)",
            "5 (Quinte)"
          ],
          [
            "V",
            "bIII",
            "VII",
            "$7 \\rightarrow +3 \\rightarrow +11$",
            "2 (2nde Maj)",
            "4 (Quarte)"
          ],
          [
            "IV",
            "bII",
            "VI",
            "$5 \\rightarrow +1 \\rightarrow +9$",
            "3 (3ce mineure)",
            "3 (3ce mineure) - Axe fixe"
          ],
          [
            "",
            "",
            "",
            "",
            "4 (3ce Majeure)",
            "b3 (3ce mineure)"
          ],
          [
            "Rythme harmonique",
            "",
            "",
            "",
            "5 (Quinte)",
            "1 (Tonique)"
          ],
          [
            "Type de Rythme",
            "Fréquence de Changement",
            "Effet Ressenti",
            "Style Associé",
            "7 (7ème Majeure)",
            "b6 (6te mineure)"
          ],
          [
            "Lent (Statique)",
            "1 accord toutes les 4 ou 8 mesures",
            "Hypnotique, spatial, \"Modal\".",
            "Pink Floyd, Miles Davis (Kind of Blue).",
            "",
            ""
          ],
          [
            "Standard",
            "1 accord par mesure (ou toutes les 2)",
            "Équilibré, prévisible.",
            "Pop, Rock, Variété.",
            "Harmonisation parallèle",
            ""
          ],
          [
            "Rapide (Double)",
            "2 accords par mesure",
            "Urgent, virtuose, dense.",
            "Bebop, Jazz Fusion.",
            "Tu prends un type d'accord précis (ex: un $min9$) et tu le déplaces sur une structure mélodique sans changer sa forme, même s'il sort de la gamme.",
            ""
          ],
          [
            "Anticipé (Syncopé)",
            "Changement sur le \"4 et\" (croche avant)",
            "Dynamique, rebondissant.",
            "Funk, Latin Jazz, Bossa Nova.",
            "Exemple : Jouer $Am9 \\rightarrow Gm9 \\rightarrow Bm9$.",
            ""
          ],
          [
            "Lent (Statique)",
            "1 accord toutes les 4 ou 8 mesures",
            "Hypnotique, spatial, \"Modal\".",
            "Pink Floyd, Miles Davis (Kind of Blue).",
            "",
            ""
          ],
          [
            "Standard",
            "1 accord par mesure (ou toutes les 2)",
            "Équilibré, prévisible.",
            "Pop, Rock, Variété.",
            "Lydian Chromatic Concept",
            ""
          ],
          [
            "Rapide (Double)",
            "2 accords par mesure",
            "Urgent, virtuose, dense.",
            "Bebop, Jazz Fusion.",
            "Tout accord peut être classé par son \"degré de brillance\".",
            ""
          ],
          [
            "Anticipé (Syncopé)",
            "Changement sur le \"4 et\" (croche avant)",
            "Dynamique, rebondissant.",
            "Funk, Latin Jazz, Bossa Nova.",
            "Échelle de brillance : Lydien (le plus brillant) > Majeur > Mixolydien > Dorien > Mineur > Phrygien (le plus sombre).",
            ""
          ]
        ]
      },
      {
        "title": null,
        "headers": [
          "Mesure",
          "Temps 1",
          "Temps 2 & (Anticipation)",
          "Temps 3",
          "Temps 4 & (Anticipation)"
        ],
        "rows": [
          [
            "Mesure 1",
            "$I_{maj7}$",
            "$bIII_{7}$",
            "$bVI_{maj7}$",
            "$VII_{7}$"
          ],
          [
            "Mesure 2",
            "$III_{maj7}$",
            "$V_{7}$",
            "$I_{maj7}$",
            "(Silence ou Transition)"
          ]
        ]
      }
    ],
  },
  'notes-conseils': {
    id: 'notes-conseils',
    title: "Notes & Conseils",
    source: "Guitar  - Notes & Conseils.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [
          "GAMMES & MODES",
          "NOTE",
          "INTERVALLES & DEGRÉS",
          "NOTE"
        ],
        "rows": [
          [
            "Gamme majeure",
            "Base des modes : on altère la gamme majeure pour obtenir les 7 modes.",
            "Penser en degrés",
            "Toujours penser en degrés plutôt qu’en notes."
          ],
          [
            "Gammes importantes",
            "Majeure, Mineur Harmonique, Mineur Mélodique, Pentatonique mineure & majeure.",
            "Secondes / Neuvièmes",
            "Même note à l’octave (2 = 9)."
          ],
          [
            "Pentatonique majeure",
            "Même positions que la pentatonique mineure, seule la tonique change.",
            "Extensions",
            "2/4/6 équivalents à 9/11/13."
          ],
          [
            "Modes relatifs",
            "7 positions de la gamme majeure = 7 modes (modes relatifs).",
            "Tierce & Septième",
            "Peuvent être majeures ou mineures."
          ],
          [
            "Modes réels",
            "Modification des intervalles pour créer un “nouveau mode”.",
            "Trouver la b7 et 7",
            "b7 = -1 ton ; 7 = -1/2 ton par rapport à la tonique"
          ],
          [
            "Blues note",
            "Entre la 3e et 4e note de la penta mineure.",
            "TONALITÉ & ARMURE",
            "NOTE"
          ],
          [
            "—",
            "—",
            "Cercle des quintes",
            "Fa Do Sol Ré La Mi Si."
          ],
          [
            "ACCORDS & HARMONIE",
            "NOTE",
            "Tonalité majeure dièses",
            "2 dièses de plus que la dernière."
          ],
          [
            "Triades",
            "Accord F–3–5, extensions possibles.",
            "Tonalité majeure bémols",
            "Prendre l’avant‑dernier."
          ],
          [
            "CAGED",
            "Formes d’accords liées aux positions penta.",
            "Gammes majeures dièses",
            "Sol → Do#."
          ],
          [
            "Accords barrés",
            "Basés sur forme E et Am.",
            "Gammes majeures bémols",
            "Fa → Dob."
          ],
          [
            "Substitution relative",
            "C ↔ Am.",
            "Do majeur",
            "0 altérations."
          ],
          [
            "Substitution tritonique",
            "Deux accords 7e distants d’un triton (trois tons au-dessus ou au-dessous)",
            "Tonalité via penta",
            "Penta donne la relative."
          ],
          [
            "Substitution chromatique",
            "Glissement d’un demi‑ton.",
            "Choisir la gamme en impro",
            "L'accord IV est MAJEUR alors DORIEN. Il y a un accord bII alors PHRYGIEN. L'accord V est MAJEUR (ou 7) alors MINEUR HARMONIQUE."
          ],
          [
            "Substitution fonctionnelle",
            "Tonique : Cmaj7 ↔ Am7, etc.",
            "Choisir la gamme en impro",
            "Si l'accord est majeur, jouer la penta majeure de l'accord. Et inversement."
          ],
          [
            "Accords 7e",
            "7M, 7m, 7 (dominante).",
            "—",
            "—"
          ],
          [
            "Accords sus",
            "Sus2 / Sus4 selon fonction.",
            "—",
            "—"
          ],
          [
            "Quinte",
            "Non essentielle dans 7, maj7, m7.",
            "TECHNIQUE & MANCHE",
            "NOTE"
          ],
          [
            "Augmentés / Diminués",
            "Quinte particulière ou omise.",
            "Repères manche",
            "Cordes Ré–Sol–Si."
          ],
          [
            "Accords 9/11/13",
            "Accords de 7e enrichis.",
            "Corde de Si",
            "+1/2 ton dans les positions."
          ],
          [
            "Emprunt modal",
            "C → Cm (parallèle).",
            "Trouver même note",
            "+5 cases sauf Sol→Si : +4."
          ],
          [
            "Cø",
            "Le symbole ø désigne toujours un accord half-diminished (m7♭5).",
            "—",
            "—"
          ],
          [
            "Retrouvez les triades d'une tonalité",
            "Vous pouvez former des triades à partir d'une tonalité. I -> 1 - 3 - 5; II -> 2 - 4 - 6...",
            "—",
            "—"
          ],
          [
            "—",
            "—",
            "—",
            "—"
          ],
          [
            "—",
            "—",
            "—",
            "—"
          ],
          [
            "—",
            "—",
            "—",
            "—"
          ]
        ]
      }
    ],
  },
  'anti-seche': {
    id: 'anti-seche',
    title: "Anti-sèche",
    source: "Guitar  - Anti-sèche.csv",
    empty: false,
    sections: [
      {
        "title": null,
        "headers": [],
        "rows": [
          [
            "1(Majeur) : Être content à la maison.",
            "4(Majeur) : Partir à l'aventure.",
            "5(Majeur) : Le besoin de revenir à la maison"
          ],
          [
            "6(Mineur) : La déprime à la maison.",
            "2(Mineur) : Départ contraint.",
            "3(Mineur) : Retour vers le passé."
          ],
          [
            "7dim : Suspens.",
            "",
            ""
          ]
        ]
      }
    ],
  },
};

export const SHEET_TAB_IDS = [
  "modes",
  "triades",
  "renversement",
  "gammes",
  "accords",
  "progressions",
  "techniques",
  "composee",
  "drive",
  "harmonie",
  "notes-conseils",
  "anti-seche"
] as const;

/** Récupère un onglet du Sheet (source de vérité). */
export function getSheetTab(id: SheetTabId): SheetTabData {
  return SHEET_CONTENT[id];
}
