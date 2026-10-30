/**
 * ADAGIO - Lesson Detail Page
 * Page individuelle d'une leçon avec contenu interactif
 * Supporte les LessonBlock avec démos, quiz et exercices
 */

'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { MetalNav, MetalFooter, Icons } from '@/components';
import { LessonRenderer, DemoEvent } from '@/components/lessons';
import { getLesson, getAllLessonsMetadata, hasLessonContent } from '@adagio/theory';
import Link from 'next/link';

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

const CATEGORY_LABELS: Record<string, string> = {
  THEORY: 'Théorie',
  FRETBOARD: 'Manche',
  CHORDS: 'Accords',
  NOTATION: 'Notation',
  PROGRESSIONS: 'Progressions',
  COMPOSITION: 'Composition',
};

const LEVEL_BADGE: Record<string, string> = {
  BEGINNER: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500',
  INTERMEDIATE: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
  ADVANCED: 'border-rose-500/40 bg-rose-500/10 text-rose-500',
};

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  // Récupérer la leçon (contenu interactif uniquement)
  const lesson = useMemo(() => {
    return getLesson(lessonId);
  }, [lessonId]);

  // Toutes les leçons pour les suggestions
  const allLessons = useMemo(() => {
    return getAllLessonsMetadata();
  }, []);

  // État de progression
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  // Calcul de la progression
  const progress = useMemo(() => {
    if (!lesson) return 0;
    const quizCount = lesson.blocks.filter((b) => b.type === 'quiz').length;
    const exerciseCount = lesson.blocks.filter((b) => b.type === 'exercise').length;
    const completableCount = quizCount + exerciseCount;
    if (completableCount === 0) return 100;
    return Math.round((completedBlocks.size / completableCount) * 100);
  }, [lesson, completedBlocks]);

  // Gestionnaire d'événements
  const handleBlockComplete = (blockIndex: number) => {
    setCompletedBlocks((prev) => new Set(prev).add(blockIndex));
  };

  const handleDemoEvent = (event: DemoEvent) => {
    console.log('Demo event:', event);
    // Ici on pourrait envoyer des analytics, sauvegarder la progression, etc.
  };

  // Navigation
  const handleNextBlock = () => {
    if (lesson && currentBlockIndex < lesson.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const handleComplete = () => {
    router.push('/lessons');
  };

  // Leçon sans contenu pédagogique : masquée aux utilisateurs
  if (!hasLessonContent(lessonId)) {
    notFound();
  }

  const { metadata, blocks } = lesson!;
  const totalBlocks = blocks.length;
  const isComplete = progress === 100;

  // Leçons similaires
  const relatedLessons = allLessons
    .filter((l) => l.id !== lessonId && l.category === metadata.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-6 pt-28 pb-24">
        <div className="w-full mx-auto space-y-12" style={{ maxWidth: '56rem' }}>
          {/* Retour */}
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-[13px] text-gray transition-colors hover:text-ember"
          >
            <Icons.ArrowLeft size="sm" />
            Retour aux leçons
          </Link>

          {/* Header */}
          <header className="space-y-3">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-gray">
              <span>{CATEGORY_LABELS[metadata.category] ?? metadata.category}</span>
              <span aria-hidden className="text-steelwarm">
                ·
              </span>
              <span
                className={`inline-flex items-center justify-center rounded border px-3 py-0.5 text-[10px] ${
                  LEVEL_BADGE[metadata.level] ?? 'border-steelwarm text-gray'
                }`}
              >
                {LEVEL_LABELS[metadata.level] ?? metadata.level}
              </span>
              <span aria-hidden className="text-steelwarm">
                ·
              </span>
              <span className="font-normal normal-case tracking-normal text-gray">
                {metadata.duration}
              </span>
              <span aria-hidden className="text-steelwarm">
                ·
              </span>
              <span className="font-normal normal-case tracking-normal text-gray">
                +{metadata.xp} XP
              </span>
              {progress > 0 && !isComplete && (
                <>
                  <span aria-hidden className="text-steelwarm">
                    ·
                  </span>
                  <span className="font-normal normal-case tracking-normal text-gray">
                    {progress}% complété
                  </span>
                </>
              )}
            </p>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-metal uppercase tracking-tighter text-white">
                {metadata.title}
              </h1>
              {isComplete && (
                <span className="inline-flex shrink-0 items-center justify-center border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-[11px] uppercase tracking-widest text-emerald-500">
                  Terminée
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-gray">{metadata.description}</p>
          </header>

          {/* Progression */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="text-gray">Progression</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="h-0.5 w-full bg-steelwarm">
              <div className="h-full bg-amber-400" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Topics */}
          {metadata.topics.length > 0 && (
            <p className="text-[13px] text-gray">{metadata.topics.join(' · ')}</p>
          )}

          {/* Navigation par blocs */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-gray">
              Contenu · {totalBlocks} section{totalBlocks > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5">
              {blocks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBlockIndex(i)}
                  aria-label={`Bloc ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === currentBlockIndex
                      ? 'bg-amber-400'
                      : i < currentBlockIndex || completedBlocks.has(i)
                        ? 'bg-amber-400/40'
                        : 'bg-steelwarm'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Contenu */}
          <LessonRenderer
            lesson={lesson!}
            onBlockComplete={handleBlockComplete}
            onDemoEvent={handleDemoEvent}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePreviousBlock}
              disabled={currentBlockIndex === 0}
              className="control px-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icons.ArrowLeft size="sm" />
              Précédent
            </button>

            <span className="text-[13px] text-gray">
              {currentBlockIndex + 1} / {totalBlocks}
            </span>

            <button
              onClick={currentBlockIndex < totalBlocks - 1 ? handleNextBlock : handleComplete}
              className="control px-3"
            >
              {currentBlockIndex < totalBlocks - 1 ? (
                <>
                  Suivant
                  <Icons.ArrowRight size="sm" />
                </>
              ) : (
                <>
                  Terminer
                  <Icons.Check size="sm" />
                </>
              )}
            </button>
          </div>

          {/* Leçons similaires */}
          {relatedLessons.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-sm font-metal uppercase tracking-tighter text-white">
                Leçons similaires
              </h2>
              <div className="space-y-2">
                {relatedLessons.map((relatedLesson) => (
                  <Link
                    key={relatedLesson.id}
                    href={`/lessons/${relatedLesson.id}`}
                    className="panel group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3 transition-colors hover:border-amber-400/50 hover:bg-raised"
                  >
                    <span className="text-[15px] text-white transition-colors group-hover:text-ember">
                      {relatedLesson.title}
                    </span>
                    <span className="shrink-0 text-[12px] text-gray">
                      {relatedLesson.duration} · +{relatedLesson.xp} XP
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
