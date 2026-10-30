'use client';

/**
 * useMetronome — métronome Tone.js.
 *
 * Import dynamique de `tone` (aucun AudioContext pendant le SSR) et
 * `Tone.start()` déclenché depuis un geste utilisateur. Les clics sont
 * planifiés par un `Tone.Loop` sur la Transport ; le synthé et la boucle
 * sont libérés au démontage.
 *
 * Synchronisation visuelle : `setTimeout` calé sur l'heure Tone, comme
 * `useComposeAudio` (Tone.Draw perd les callbacks retardés en onglet throttlé).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type ToneModule = typeof import('tone');
type Synth = import('tone').Synth;
type Loop = import('tone').Loop;

export type Subdivision = 1 | 2 | 3 | 4;

export interface MetronomeConfig {
  bpm: number;
  beatsPerMeasure: number;
  /** Pas par temps : 1 = aucune, 2 = croches, 3 = triolets, 4 = doubles croches. */
  subdivision: Subdivision;
  accentFirstBeat: boolean;
  /** 0–100 */
  volume: number;
}

export interface UseMetronomeResult {
  isPlaying: boolean;
  /** Temps courant dans la mesure, -1 à l'arrêt. */
  currentBeat: number;
  start: () => Promise<void>;
  stop: () => void;
}

/** Intervalle Tone pour un pas de subdivision (BPM = noire). */
const STEP_INTERVALS: Record<Subdivision, string> = {
  1: '4n',
  2: '8n',
  3: '8t',
  4: '16n',
};

const volumeToDb = (volume: number): number =>
  volume <= 0 ? -Infinity : 20 * Math.log10(volume / 100);

export function useMetronome(config: MetronomeConfig): UseMetronomeResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);

  const configRef = useRef(config);
  configRef.current = config;

  const toneRef = useRef<ToneModule | null>(null);
  const synthRef = useRef<Synth | null>(null);
  const loopRef = useRef<Loop | null>(null);
  const stepRef = useRef(0);
  const runningRef = useRef(false);
  const runIdRef = useRef(0);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    runningRef.current = false;
    clearTimers();
    loopRef.current?.stop();
    loopRef.current?.dispose();
    loopRef.current = null;
    const tone = toneRef.current;
    if (tone) {
      tone.getTransport().stop();
      tone.getTransport().cancel(0);
    }
    setCurrentBeat(-1);
    setIsPlaying(false);
  }, [clearTimers]);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    const runId = ++runIdRef.current;

    try {
      const tone = toneRef.current ?? (await import('tone'));
      toneRef.current = tone;
      if (runIdRef.current !== runId) return;

      await tone.start();
      if (runIdRef.current !== runId) return;

      if (!synthRef.current) {
        synthRef.current = new tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 },
        }).toDestination();
      }

      const { bpm, subdivision, volume } = configRef.current;
      synthRef.current.volume.value = volumeToDb(volume);

      const transport = tone.getTransport();
      transport.bpm.value = bpm;
      stepRef.current = 0;

      const loop = new tone.Loop((time) => {
        const cfg = configRef.current;
        const step = stepRef.current;
        const isBeat = step % cfg.subdivision === 0;
        const beat = Math.floor(step / cfg.subdivision);
        const accent = cfg.accentFirstBeat && isBeat && beat === 0;

        synthRef.current?.triggerAttackRelease(accent ? 1400 : isBeat ? 950 : 760, '32n', time);

        const delay = Math.max(0, (time - tone.now()) * 1000);
        const timer = setTimeout(() => {
          timersRef.current.delete(timer);
          if (runningRef.current) setCurrentBeat(beat);
        }, delay);
        timersRef.current.add(timer);

        stepRef.current = (step + 1) % (cfg.beatsPerMeasure * cfg.subdivision);
      }, STEP_INTERVALS[subdivision]);

      loopRef.current = loop;
      loop.start(0);
      transport.start();
      setIsPlaying(true);
    } catch {
      runningRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  // Le tempo et le volume s'appliquent en direct, sans redémarrer la boucle.
  useEffect(() => {
    const tone = toneRef.current;
    if (!tone || !runningRef.current) return;
    tone.getTransport().bpm.value = config.bpm;
  }, [config.bpm]);

  useEffect(() => {
    const tone = toneRef.current;
    const synth = synthRef.current;
    if (!tone || !synth) return;
    synth.volume.value = volumeToDb(config.volume);
  }, [config.volume]);

  // Changer de signature ou de subdivision impose un nouvel intervalle de boucle.
  useEffect(() => {
    if (!runningRef.current) return;
    stop();
    void start();
  }, [config.beatsPerMeasure, config.subdivision, start, stop]);

  // Dispose au démontage (pas de setState ici).
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      runIdRef.current += 1;
      runningRef.current = false;
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      loopRef.current?.dispose();
      loopRef.current = null;
      synthRef.current?.dispose();
      synthRef.current = null;
      const tone = toneRef.current;
      tone?.getTransport().stop();
      tone?.getTransport().cancel(0);
    };
  }, []);

  return { isPlaying, currentBeat, start, stop };
}
