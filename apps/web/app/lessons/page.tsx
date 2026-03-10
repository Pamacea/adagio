/**
 * ADAGIO - Lessons Page
 * Catalogue des leçons disponibles
 * Utilise TanStack Query avec fallback sur données hardcodées
 */

'use client';

import { useState, useMemo } from 'react';
import { MetalNav, MetalFooter, MetalCard, StatCard, Icons } from '@/components';
import { useLessons } from '@/lib';
import Link from 'next/link';
import type { LessonCategory, LessonLevel } from '@/lib';

const CATEGORIES = ['ALL', 'THEORY', 'FRETBOARD', 'CHORDS', 'NOTATION', 'PROGRESSIONS', 'COMPOSITION'] as const;

const LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-toxic',
  INTERMEDIATE: 'text-rust',
  ADVANCED: 'text-blood',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  THEORY: <Icons.Modes size="sm" />,
  FRETBOARD: <Icons.Fretboard size="sm" />,
  CHORDS: <Icons.Chords size="sm" />,
  NOTATION: <Icons.Notation size="sm" />,
  PROGRESSIONS: <Icons.Compose size="sm" />,
  COMPOSITION: <Icons.Compose size="sm" />,
};

// Helpers pour les leçons avec le nouveau format de progress
function isLessonCompleted(lesson: { progress?: { status: string } | null }): boolean {
  return lesson.progress?.status === 'completed';
}

function getLessonProgressPercent(lesson: { progress?: { currentSection: number } | null }): number {
  if (!lesson.progress) return 0;
  // Approximation: currentSection / 5 * 100 (5 sections par leçon en moyenne)
  return Math.min(Math.round((lesson.progress.currentSection / 5) * 100), 100);
}

export default function LessonsPage() {
  const { data: lessons, isLoading } = useLessons();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Stats calculées depuis les données (API ou fallback)
  const stats = useMemo(() => {
    if (!lessons) return null;

    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(l => isLessonCompleted(l)).length;
    const totalXP = lessons.filter(l => isLessonCompleted(l)).reduce((sum, l) => sum + l.xp, 0);
    const totalDuration = lessons.filter(l => isLessonCompleted(l)).reduce((sum, l) => sum + l.duration, 0);
    const inProgressLessons = lessons.filter(l => l.progress?.status === 'in-progress').length;

    return { totalLessons, completedLessons, totalXP, totalDuration, inProgressLessons };
  }, [lessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    if (!lessons) return [];

    return lessons.filter(lesson => {
      if (selectedCategory !== 'ALL' && lesson.category !== selectedCategory) return false;
      if (selectedLevel !== 'ALL' && lesson.level !== selectedLevel) return false;
      if (filterStatus === 'completed' && !isLessonCompleted(lesson)) return false;
      if (filterStatus === 'pending' && isLessonCompleted(lesson)) return false;
      return true;
    });
  }, [lessons, selectedCategory, selectedLevel, filterStatus]);

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
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="section-frame p-12 text-center">
              <Icons.Sessions size="lg" />
              <p className="text-gray mt-4">Chargement des leçons...</p>
            </div>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              LEÇONS
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Catalogue complet des cours
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Leçons Completees"
                value={`${stats.completedLessons}/${stats.totalLessons}`}
                icon={<Icons.Check />}
              />
              <StatCard
                label="En Cours"
                value={stats.inProgressLessons.toString()}
                icon={<Icons.Sessions />}
              />
              <StatCard
                label="XP Gagnees"
                value={`${stats.totalXP} XP`}
                icon={<Icons.Compose />}
              />
              <StatCard
                label="Temps de Pratique"
                value={`${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m`}
                icon={<Icons.Stop />}
              />
            </div>
          )}

          {/* Global progress */}
          {stats && (
            <div className="section-frame p-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray uppercase">Progression Globale</span>
                <span className="text-sm text-white font-bold">{Math.round((stats.completedLessons / stats.totalLessons) * 100)}%</span>
              </div>
              <div className="h-4 border-2 border-steel bg-blackness">
                <div
                  className="h-full bg-toxic border-r border-blood transition-all duration-500"
                  style={{ width: `${(stats.completedLessons / stats.totalLessons) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="section-frame p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Categorie
                </label>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all flex items-center gap-1 ${
                        selectedCategory === cat
                          ? 'border-blood bg-toxic text-white'
                          : 'border-steel bg-abyss text-gray hover:border-white'
                      }`}
                    >
                      {cat !== 'ALL' && CATEGORY_ICONS[cat]}
                      {cat === 'ALL' ? 'Toutes' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Niveau
                </label>
                <div className="flex flex-wrap gap-1">
                  {LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                        selectedLevel === level
                          ? 'border-blood bg-toxic text-white'
                          : 'border-steel bg-abyss text-gray hover:border-white'
                      }`}
                    >
                      {level === 'ALL' ? 'Tous' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Statut
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterStatus === 'all'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterStatus === 'completed'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Fait
                  </button>
                  <button
                    onClick={() => setFilterStatus('pending')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterStatus === 'pending'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    A faire
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons list */}
          <div className="space-y-4">
            {sortedLessons.map(lesson => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="block"
              >
                <MetalCard hover className={`${isLessonCompleted(lesson) ? 'border-toxic' : ''} ${lesson.progress?.status === 'in-progress' ? 'border-rust' : ''}`}>
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray uppercase tracking-wider flex items-center gap-1">
                            {CATEGORY_ICONS[lesson.category]}
                            {lesson.category}
                          </span>
                          <span className={`text-xs font-bold uppercase ${LEVEL_COLORS[lesson.level]}`}>
                            {lesson.level}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                        <p className="text-sm text-gray mt-1">{lesson.description}</p>
                      </div>
                      {isLessonCompleted(lesson) && (
                        <div className="icon-box border-toxic ml-4">
                          <Icons.Check size="sm" />
                        </div>
                      )}
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lesson.topics.slice(0, 4).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs border border-steel bg-blackness text-gray"
                        >
                          {topic}
                        </span>
                      ))}
                      {lesson.topics.length > 4 && (
                        <span className="px-2 py-0.5 text-xs border border-steel bg-blackness text-gray">
                          +{lesson.topics.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray flex items-center gap-1">
                          <Icons.Stop size="sm" />
                          {lesson.duration} min
                        </span>
                        <span className="text-xs text-rust font-bold">
                          +{lesson.xp} XP
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Progress for incomplete lessons */}
                        {!isLessonCompleted(lesson) && (
                          <div className="w-24">
                            <div className="h-2 border border-steel bg-blackness">
                              <div
                                className="h-full bg-toxic"
                                style={{ width: `${getLessonProgressPercent(lesson)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <span className={`px-4 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                          isLessonCompleted(lesson)
                            ? 'border-toxic bg-toxic text-white'
                            : lesson.progress?.status === 'in-progress'
                              ? 'border-steel bg-void text-gray'
                              : 'border-blood bg-blackness text-white'
                        }`}>
                          {isLessonCompleted(lesson) ? 'REFAIRE' : lesson.progress?.status === 'in-progress' ? 'CONTINUER' : 'COMMENCER'}
                        </span>
                      </div>
                    </div>
                  </div>
                </MetalCard>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {sortedLessons.length === 0 && (
            <div className="section-frame p-12 text-center">
              <Icons.Modes size="lg" />
              <p className="text-gray mt-4">Aucune leçon ne correspond à vos filtres.</p>
            </div>
          )}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
