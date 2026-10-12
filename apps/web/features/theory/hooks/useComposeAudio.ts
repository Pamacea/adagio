/**
 * useComposeAudio — audio Tone.js pour la page Compose.
 *
 * Import dynamique de `tone` : le bundle n'est chargé qu'au premier play
 * (aucun coût au premier rendu). PolySynth paresseux, `dispose` au démontage.
 *
 * Interruption : chaque lancement (ou `stop()`) invalide la génération
 * `runId` et recrée le synthé — les callbacks différés et les notes
 * schedulées d'une séquence précédente sont ainsi neutralisés, y compris
 * en cas de « stop puis play immédiat ».
 *
 * Synchronisation UI : `setTimeout` plutôt que `Tone.Draw` (rAF) — Draw
 * supprime silencieusement tout callback retardé de plus de 250 ms, ce qui
 * perd les étapes en cas de rAF throttled (onglet en arrière-plan).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type ToneModule = typeof import('tone');
type Synth = import('tone').PolySynth;

export interface UseComposeAudioResult {
  /** Accord simultané */
  playChord: (notes: string[], duration?: string) => void;
  /** Gamme en montage */
  playScale: (notes: string[]) => void;
  /**
   * Séquence d'accords — `onStep(i)` est appelé à chaque changement d'accord
   * et `onDone()` à la fin (timers synchronisés sur l'horloge Tone).
   */
  playProgression: (
    chords: string[][],
    onStep?: (index: number) => void,
    onDone?: () => void
  ) => void;
  /** Coupe tout (sons + séquences) */
  stop: () => void;
  isPlaying: boolean;
}

const CHORD_DURATION = '2n';
const SCALE_NOTE_DURATION = '8n';
const PROGRESSION_STEP = '2n';

/**
 * Tone.Frequency exige une octave (`C4`) — les données theory renvoient des
 * nus sans octave (`C`, `Bb`) et Tone rejette alors le scheduling.
 */
const toToneNote = (note: string): string => (/\d$/.test(note) ? note : `${note}4`);

export function useComposeAudio(): UseComposeAudioResult {
  const toneRef = useRef<ToneModule | null>(null);
  const synthRef = useRef<Synth | null>(null);
  /** Génération courante — les callbacks différés capturés avant sont ignorés */
  const runIdRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dispose au démontage
  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, []);

  const ensureReady = useCallback(async (): Promise<{ tone: ToneModule; synth: Synth } | null> => {
    if (!toneRef.current) {
      toneRef.current = await import('tone');
    }
    const tone = toneRef.current;
    if (!synthRef.current) {
      const synth = new tone.PolySynth(tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.15, sustain: 0.5, release: 0.6 },
      });
      synth.volume.value = -8;
      synthRef.current = synth;
    }
    if (tone.getDestination().volume.value === -Infinity) {
      tone.getDestination().volume.value = -4;
    }
    await tone.start();
    return { tone, synth: synthRef.current };
  }, []);

  /** Invalide la séquence en cours : callbacks + notes schedulées (nouveau synthé) */
  const invalidate = useCallback(() => {
    runIdRef.current += 1;
    synthRef.current?.dispose();
    synthRef.current = null;
  }, []);

  const stop = useCallback(() => {
    invalidate();
    setIsPlaying(false);
  }, [invalidate]);

  const playChord = useCallback(
    (notes: string[], duration = CHORD_DURATION) => {
      invalidate();
      const runId = runIdRef.current;
      void (async () => {
        const ready = await ensureReady();
        if (!ready || notes.length === 0 || runIdRef.current !== runId) return;
        const { tone, synth } = ready;
        synth.triggerAttackRelease(notes.map(toToneNote), duration, tone.now());
        setIsPlaying(true);
        const endMs = tone.Time(duration).toSeconds() * 1000;
        setTimeout(() => {
          if (runIdRef.current === runId) setIsPlaying(false);
        }, endMs);
      })();
    },
    [ensureReady, invalidate]
  );

  const playScale = useCallback(
    (notes: string[]) => {
      invalidate();
      const runId = runIdRef.current;
      void (async () => {
        const ready = await ensureReady();
        if (!ready || notes.length === 0 || runIdRef.current !== runId) return;
        const { tone, synth } = ready;
        const now = tone.now();
        notes.forEach((note, i) => {
          synth.triggerAttackRelease(toToneNote(note), SCALE_NOTE_DURATION, now + i * 0.28);
        });
        setIsPlaying(true);
        const totalMs = (notes.length * 0.28 + 0.4) * 1000;
        setTimeout(() => {
          if (runIdRef.current === runId) setIsPlaying(false);
        }, totalMs);
      })();
    },
    [ensureReady, invalidate]
  );

  const playProgression = useCallback(
    (chords: string[][], onStep?: (index: number) => void, onDone?: () => void) => {
      invalidate();
      const runId = runIdRef.current;
      void (async () => {
        const ready = await ensureReady();
        if (!ready || chords.length === 0 || runIdRef.current !== runId) return;
        const { tone, synth } = ready;
        const stepSeconds = tone.Time(PROGRESSION_STEP).toSeconds();
        const now = tone.now();
        const isCurrent = () => runIdRef.current === runId;

        setIsPlaying(true);
        chords.forEach((notes, i) => {
          const time = now + i * stepSeconds;
          if (notes.length > 0)
            synth.triggerAttackRelease(notes.map(toToneNote), PROGRESSION_STEP, time);
          if (onStep) {
            setTimeout(
              () => {
                if (isCurrent()) onStep(i);
              },
              i * stepSeconds * 1000
            );
          }
        });
        setTimeout(
          () => {
            if (!isCurrent()) return;
            setIsPlaying(false);
            onDone?.();
          },
          chords.length * stepSeconds * 1000
        );
      })();
    },
    [ensureReady, invalidate]
  );

  return { playChord, playScale, playProgression, stop, isPlaying };
}
