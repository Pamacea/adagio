/**
 * ADAGIO - Lessons Page
 * Catalogue des leçons disponibles
 * Utilise TanStack Query avec fallback sur données hardcodées
 */

'use client';

import { useState, useMemo } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { useLessons } from '@/lib';
import { hasLessonContent } from '@adagio/theory';
import { LESSONS_DATA } from '@/lib/data';
import Link from 'next/link';

const CATEGORIES = [
  'ALL',
  'THEORY',
  'FRETBOARD',
  'CHORDS',
  'NOTATION',
  'PROGRESSIONS',
  'COMPOSITION',
] as const;

const LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

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

// Helpers pour les leçons avec le nouveau format de progress
function isLessonCompleted(lesson: { progress?: { status: string } | null }): boolean {
  return lesson.progress?.status === 'completed';
}

function getLessonProgressPercent(lesson: {
  progress?: { currentSection: number } | null;
}): number {
  if (!lesson.progress) return 0;
  // Approximation: currentSection / 5 * 100 (5 sections par leçon en moyenne)
  return Math.min(Math.round((lesson.progress.currentSection / 5) * 100), 100);
}

export default function LessonsPage() {
  const { data: lessons, isLoading } = useLessons();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Ne garder que les leçons avec du contenu ; repli sur LESSONS_DATA filtré
  // si l'API ne renvoie que des leçons sans contenu.
  const lessonsWithContent = useMemo(() => {
    const withContent = (lessons ?? []).filter((l) => hasLessonContent(l.slug || l.id));
    return withContent.length > 0
      ? withContent
      : LESSONS_DATA.filter((l) => hasLessonContent(l.slug || l.id));
  }, [lessons]);

  // Stats calculées depuis les données affichées
  const stats = useMemo(() => {
    const totalLessons = lessonsWithContent.length;
    const completedLessons = lessonsWithContent.filter((l) => isLessonCompleted(l)).length;
    const totalXP = lessonsWithContent
      .filter((l) => isLessonCompleted(l))
      .reduce((sum, l) => sum + l.xp, 0);
    const totalDuration = lessonsWithContent
      .filter((l) => isLessonCompleted(l))
      .reduce((sum, l) => sum + l.duration, 0);
    const inProgressLessons = lessonsWithContent.filter(
      (l) => l.progress?.status === 'in-progress'
    ).length;

    return { totalLessons, completedLessons, totalXP, totalDuration, inProgressLessons };
  }, [lessonsWithContent]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessonsWithContent.filter((lesson) => {
      if (selectedCategory !== 'ALL' && lesson.category !== selectedCategory) return false;
      if (selectedLevel !== 'ALL' && lesson.level !== selectedLevel) return false;
      if (filterStatus === 'completed' && !isLessonCompleted(lesson)) return false;
      if (filterStatus === 'pending' && isLessonCompleted(lesson)) return false;
      return true;
    });
  }, [lessonsWithContent, selectedCategory, selectedLevel, filterStatus]);

  // Sort by progress (incomplete first, then by progress desc)
  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort((a, b) => {
      const aCompleted = isLessonCompleted(a);
      const bCompleted = isLessonCompleted(b);
      if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
      return getLessonProgressPercent(b) - getLessonProgressPercent(a);
    });
  }, [filteredLessons]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-6 pt-32 pb-24">
          <div className="w-full mx-auto" style={{ maxWidth: '64rem' }}>
            <p className="panel px-5 py-6 text-sm text-gray">Chargement des leçons…</p>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  const globalProgress = Math.round((stats.completedLessons / stats.totalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-6 pt-28 pb-24">
        <div className="w-full mx-auto space-y-12" style={{ maxWidth: '64rem' }}>
          {/* Header */}
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-metal uppercase tracking-tighter text-white">
              Leçons
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray">
              {stats.totalLessons} leçons avec contenu, du premier accord à la composition.
            </p>
          </header>

          {/* Stats */}
          <section className="panel grid grid-cols-2 gap-x-8 gap-y-6 p-5 sm:grid-cols-4">
            <div>
              <p className="field-label">Terminées</p>
              <p className="text-lg text-white">
                {stats.completedLessons}/{stats.totalLessons}
              </p>
            </div>
            <div>
              <p className="field-label">En cours</p>
              <p className="text-lg text-white">{stats.inProgressLessons}</p>
            </div>
            <div>
              <p className="field-label">XP gagnées</p>
              <p className="text-lg text-white">{stats.totalXP} XP</p>
            </div>
            <div>
              <p className="field-label">Temps de pratique</p>
              <p className="text-lg text-white">
                {Math.floor(stats.totalDuration / 60)} h {stats.totalDuration % 60} min
              </p>
            </div>
          </section>

          {/* Global progress */}
          <section className="panel space-y-2 p-5">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="text-gray">Progression globale</span>
              <span className="text-white">{globalProgress}%</span>
            </div>
            <div className="h-0.5 w-full bg-steelwarm">
              <div className="h-full bg-amber-400" style={{ width: `${globalProgress}%` }} />
            </div>
          </section>

          {/* Filters */}
          <section className="panel space-y-5 p-5">
            <div className="space-y-2">
              <span className="field-label">Catégorie</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className="control px-3"
                  >
                    {cat === 'ALL' ? 'Toutes' : CATEGORY_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="field-label">Niveau</span>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    aria-pressed={selectedLevel === level}
                    className="control px-3"
                  >
                    {level === 'ALL' ? 'Tous' : LEVEL_LABELS[level] ?? level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="field-label">Statut</span>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['all', 'Tout'],
                    ['completed', 'Faites'],
                    ['pending', 'À faire'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    aria-pressed={filterStatus === value}
                    className="control px-3"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Lessons list */}
          <section className="space-y-3">
            {sortedLessons.map((lesson) => {
              const completed = isLessonCompleted(lesson);
              const inProgress = lesson.progress?.status === 'in-progress';

              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug || lesson.id}`}
                  className="panel group flex flex-col gap-3 px-5 py-4 transition-colors hover:border-amber-400/50 hover:bg-raised sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                >
                  <div className="min-w-0 space-y-2">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-gray">
                      <span>{CATEGORY_LABELS[lesson.category] ?? lesson.category}</span>
                      <span aria-hidden className="text-steelwarm">
                        ·
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded border px-3 py-0.5 text-[10px] ${
                          LEVEL_BADGE[lesson.level] ?? 'border-steelwarm text-gray'
                        }`}
                      >
                        {LEVEL_LABELS[lesson.level] ?? lesson.level}
                      </span>
                      <span aria-hidden className="text-steelwarm">
                        ·
                      </span>
                      <span className="font-normal normal-case tracking-normal text-gray">
                        {lesson.duration} min
                      </span>
                    </p>
                    <h2 className="text-[17px] text-white transition-colors group-hover:text-ember">
                      {lesson.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-gray">{lesson.description}</p>
                    {!completed && (
                      <div className="h-px w-24 bg-steelwarm">
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${getLessonProgressPercent(lesson)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-baseline gap-4 text-[12px] text-gray">
                    <span>+{lesson.xp} XP</span>
                    <span
                      className={`transition-colors ${
                        completed ? 'text-gray' : 'text-gray group-hover:text-ember'
                      }`}
                    >
                      {completed ? 'Terminée' : inProgress ? 'Continuer' : 'Commencer'} →
                    </span>
                  </div>
                </Link>
              );
            })}

            {sortedLessons.length === 0 && (
              <p className="panel px-5 py-12 text-center text-sm text-gray">
                Aucune leçon ne correspond à ces filtres.
              </p>
            )}
          </section>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
