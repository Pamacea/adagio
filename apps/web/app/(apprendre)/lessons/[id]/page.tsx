/**
 * ADAGIO - Lesson Detail Page
 * Page individuelle d'une leçon avec contenu interactif
 * Supporte les LessonBlock avec démos, quiz et exercices
 */

'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MetalNav, MetalFooter, MetalCard, Icons } from '@/components';
import { LessonRenderer, DemoEvent } from '@/components/lessons';
import { getLesson, getAllLessonsMetadata } from '@adagio/theory';
import { LESSONS_DATA } from '@/lib/data';
import Link from 'next/link';

// Niveau colors
const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-toxic',
  INTERMEDIATE: 'text-rust',
  ADVANCED: 'text-blood',
};

// Catégorie colors
const _CATEGORY_COLORS: Record<string, string> = {
  THEORY: 'text-toxic',
  TECHNIQUE: 'text-rust',
  EAR_TRAINING: 'text-purple',
  COMPOSITION: 'text-blue',
};

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  // Récupérer la leçon (contenu interactif d'abord, fallback sur données statiques)
  const lesson = useMemo(() => {
    return getLesson(lessonId);
  }, [lessonId]);

  // Fallback: données statiques si pas de contenu interactif
  const staticLesson = useMemo(() => {
    if (lesson) return null;
    return LESSONS_DATA.find((l) => l.slug === lessonId || l.id === lessonId) || null;
  }, [lessonId, lesson]);

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

  // Leçon non trouvée (ni interactive ni statique)
  if (!lesson && !staticLesson) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-metal text-white mb-4">LEÇON NON TROUVÉE</h1>
            <p className="text-gray mb-8">Cette leçon n&apos;existe pas ou a été déplacée.</p>
            <Link
              href="/lessons"
              className="px-6 py-3 border-2 border-blood bg-toxic text-white font-bold uppercase inline-block"
            >
              Retour aux Leçons
            </Link>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  // Leçon statique (sans contenu interactif)
  if (!lesson && staticLesson) {
    const related = LESSONS_DATA.filter(
      (l) => l.slug !== lessonId && l.category === staticLesson.category
    ).slice(0, 3);

    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 text-gray hover:text-white mb-6 transition-colors"
            >
              <Icons.ArrowLeft size="sm" />
              Retour aux Leçons
            </Link>

            {/* Header */}
            <MetalCard className="mb-8">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase border-2 ${
                      staticLesson.level === 'BEGINNER'
                        ? 'border-toxic text-toxic'
                        : staticLesson.level === 'INTERMEDIATE'
                          ? 'border-rust text-rust'
                          : 'border-blood text-blood'
                    }`}
                  >
                    {staticLesson.level}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold uppercase border-2 border-steel text-gray">
                    {staticLesson.category}
                  </span>
                  <span className="text-xs text-gray">{staticLesson.duration} min</span>
                  <span className="text-xs text-toxic">{staticLesson.xp} XP</span>
                </div>
                <h1 className="text-3xl font-metal text-white mb-4">{staticLesson.title}</h1>
                {staticLesson.description && (
                  <p className="text-gray text-lg">{staticLesson.description}</p>
                )}
              </div>
            </MetalCard>

            {/* Topics */}
            {staticLesson.topics && staticLesson.topics.length > 0 && (
              <MetalCard className="mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-metal text-white uppercase mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-toxic" />
                    Sujets abordés
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {staticLesson.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 border border-steel/30 bg-void/30"
                      >
                        <span className="w-2 h-2 bg-toxic" />
                        <span className="text-sm text-gray">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MetalCard>
            )}

            {/* Coming soon */}
            <MetalCard className="mb-8">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-steel flex items-center justify-center">
                  <Icons.Compose size="md" className="text-gray" />
                </div>
                <h2 className="text-xl font-metal text-white mb-2">Contenu en préparation</h2>
                <p className="text-gray text-sm">
                  Le contenu interactif de cette leçon sera bientôt disponible avec des démos, quiz
                  et exercices.
                </p>
              </div>
            </MetalCard>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-metal text-white uppercase mb-4">Leçons Similaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/lessons/${r.slug || r.id}`}
                      className="border-2 border-steel bg-abyss p-4 hover:border-white transition-all"
                    >
                      <p className="text-sm font-bold text-white mb-1">{r.title}</p>
                      <p className="text-xs text-gray">
                        {r.level} - {r.duration} min
                      </p>
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

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-gray hover:text-white mb-6 transition-colors"
          >
            <Icons.ArrowLeft size="sm" />
            <span className="text-sm uppercase">Retour aux Leçons</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray uppercase tracking-wider">
                    {metadata.category}
                  </span>
                  <span className={`text-xs font-bold uppercase ${LEVEL_COLORS[metadata.level]}`}>
                    {metadata.level}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-metal text-white tracking-tighter">
                  {metadata.title}
                </h1>
              </div>
              {isComplete && (
                <div className="icon-box border-toxic">
                  <Icons.Check size="sm" />
                </div>
              )}
            </div>
            <p className="text-gray">{metadata.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-6 mt-4">
              <span className="text-sm text-gray flex items-center gap-2">
                <Icons.Stop size="sm" />
                {metadata.duration}
              </span>
              <span className="text-sm text-rust font-bold">+{metadata.xp} XP</span>
              {progress > 0 && !isComplete && (
                <span className="text-sm text-toxic">{progress}% complété</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 border-2 border-steel bg-blackness">
                <div
                  className="h-full bg-toxic border-r border-blood transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topics tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {metadata.topics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs border border-steel bg-blackness text-gray"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Navigation par blocs */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray uppercase">
              Contenu ({totalBlocks} section{totalBlocks > 1 ? 's' : ''})
            </span>
            <div className="flex items-center gap-1">
              {blocks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBlockIndex(i)}
                  className={`w-3 h-3 rounded-sm transition-all ${
                    i === currentBlockIndex
                      ? 'bg-toxic border border-blood'
                      : i < currentBlockIndex || completedBlocks.has(i)
                        ? 'bg-steel'
                        : 'bg-abyss border border-steel'
                  }`}
                  title={`Bloc ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <MetalCard className="mb-8">
            <div className="p-6">
              {/* Afficher tous les blocs ou seulement le courant */}
              <LessonRenderer
                lesson={lesson!}
                onBlockComplete={handleBlockComplete}
                onDemoEvent={handleDemoEvent}
              />
            </div>
          </MetalCard>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousBlock}
              disabled={currentBlockIndex === 0}
              className={`px-6 py-3 text-sm font-bold uppercase border-2 transition-all flex items-center gap-2 ${
                currentBlockIndex === 0
                  ? 'border-steel bg-blackness text-gray opacity-50 cursor-not-allowed'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              <Icons.ArrowLeft size="sm" />
              Précédent
            </button>

            <span className="text-sm text-gray">
              {currentBlockIndex + 1} / {totalBlocks}
            </span>

            <button
              onClick={currentBlockIndex < totalBlocks - 1 ? handleNextBlock : handleComplete}
              className="px-6 py-3 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white transition-all flex items-center gap-2 poly-right"
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

          {/* Related lessons */}
          {relatedLessons.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-metal text-white uppercase mb-6">Leçons Similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedLessons.map((relatedLesson) => (
                  <Link
                    key={relatedLesson.id}
                    href={`/lessons/${relatedLesson.id}`}
                    className="border-2 border-steel bg-abyss p-4 hover:border-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="icon-box border-steel">
                        <Icons.Modes size="sm" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">{relatedLesson.title}</h3>
                        <p className="text-xs text-gray">
                          {relatedLesson.duration} • +{relatedLesson.xp} XP
                        </p>
                      </div>
                    </div>
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
