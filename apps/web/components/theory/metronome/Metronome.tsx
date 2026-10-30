'use client';

/**
 * ADAGIO - Metronome
 * Métronome configurable (tempo, signature, subdivision, accent, volume, tap tempo).
 * L'audio est géré par useMetronome — aucun AudioContext au SSR.
 */

import { useRef, useState } from 'react';
import {
  useMetronome,
  type Subdivision,
} from '@/features/theory/hooks/useMetronome';

const MIN_BPM = 30;
const MAX_BPM = 300;

const SIGNATURES = [
  { value: '2/4', beats: 2 },
  { value: '3/4', beats: 3 },
  { value: '4/4', beats: 4 },
  { value: '6/8', beats: 6 },
] as const;

type Signature = (typeof SIGNATURES)[number];

const SUBDIVISIONS: { value: Subdivision; label: string }[] = [
  { value: 1, label: 'Aucune' },
  { value: 2, label: 'Croches' },
  { value: 3, label: 'Triolets' },
  { value: 4, label: 'Doubles croches' },
];

const clampBpm = (value: number): number =>
  Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));

export function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [signature, setSignature] = useState<Signature>(SIGNATURES[2]);
  const [subdivision, setSubdivision] = useState<Subdivision>(1);
  const [accent, setAccent] = useState(true);
  const [volume, setVolume] = useState(70);
  const tapsRef = useRef<number[]>([]);

  const { isPlaying, currentBeat, start, stop } = useMetronome({
    bpm,
    beatsPerMeasure: signature.beats,
    subdivision,
    accentFirstBeat: accent,
    volume,
  });

  const tapTempo = () => {
    const now = performance.now();
    const taps = tapsRef.current;
    // Repart de zéro après une pause de plus de 2 s.
    const previousTap = taps[taps.length - 1];
    if (previousTap !== undefined && now - previousTap > 2000) taps.length = 0;
    taps.push(now);
    if (taps.length > 6) taps.shift();
    if (taps.length < 2) return;

    const intervals = taps.reduce<number[]>((acc, tap, i) => {
      const previous = taps[i - 1];
      if (previous !== undefined) acc.push(tap - previous);
      return acc;
    }, []);
    const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    setBpm(clampBpm(60000 / average));
  };

  return (
    <div className="space-y-8">
      {/* Tempo, signature et pastilles de temps */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-metal tabular-nums text-white">{bpm}</span>
          <span className="text-xs uppercase tracking-widest text-gray">BPM</span>
          <span aria-hidden="true" className="text-steelwarm">
            ·
          </span>
          <span className="text-xl text-gray">{signature.value}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5" aria-hidden="true">
          {Array.from({ length: signature.beats }, (_, beat) => {
            const active = isPlaying && currentBeat === beat;
            const first = beat === 0;
            return (
              <span
                key={beat}
                className={[
                  'h-2.5 w-2.5 rounded-full',
                  active ? 'bg-amber-400' : first ? 'bg-amber-400/60' : 'bg-steelwarm',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {/* Tempo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="metronome-bpm" className="field-label mb-0">
              Tempo
            </label>
            <span className="text-sm tabular-nums text-gray">{bpm} BPM</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBpm((value) => clampBpm(value - 1))}
              aria-label="Diminuer le tempo"
              className="control w-9 shrink-0 px-0"
            >
              −
            </button>
            <input
              id="metronome-bpm"
              type="range"
              min={MIN_BPM}
              max={MAX_BPM}
              step={1}
              value={bpm}
              onChange={(event) => setBpm(Number(event.target.value))}
              className="h-2 w-full min-w-0 flex-1 cursor-pointer accent-amber-400"
            />
            <button
              type="button"
              onClick={() => setBpm((value) => clampBpm(value + 1))}
              aria-label="Augmenter le tempo"
              className="control w-9 shrink-0 px-0"
            >
              +
            </button>
          </div>
        </div>

        {/* Signature */}
        <fieldset className="space-y-2">
          <legend className="field-label">Signature</legend>
          <div className="flex flex-wrap gap-2">
            {SIGNATURES.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={signature.value === item.value}
                onClick={() => setSignature(item)}
                className="control"
              >
                {item.value}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Subdivision */}
        <fieldset className="space-y-2">
          <legend className="field-label">Subdivision</legend>
          <div className="flex flex-wrap gap-2">
            {SUBDIVISIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={subdivision === item.value}
                onClick={() => setSubdivision(item.value)}
                className="control"
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Accent + volume */}
        <div className="space-y-4">
          <button
            type="button"
            aria-pressed={accent}
            onClick={() => setAccent((value) => !value)}
            className="control w-full"
          >
            Accent temps 1 : {accent ? 'on' : 'off'}
          </button>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="metronome-volume" className="field-label mb-0">
                Volume
              </label>
              <span className="text-sm tabular-nums text-gray">{volume}%</span>
            </div>
            <input
              id="metronome-volume"
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => (isPlaying ? stop() : void start())}
          aria-pressed={isPlaying}
          className="control min-h-11 flex-1 px-3 font-bold uppercase tracking-wider"
        >
          {isPlaying ? 'Arrêter' : 'Démarrer'}
        </button>
        <button
          type="button"
          onClick={tapTempo}
          className="control min-h-11 px-3 uppercase tracking-wider"
        >
          Tap tempo
        </button>
      </div>
    </div>
  );
}
