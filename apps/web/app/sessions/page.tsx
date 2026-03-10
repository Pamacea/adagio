/**
 * ADAGIO - Sessions Page
 * Liste des sessions d'apprentissage
 * Progression utilisateur
 * Page protégée - nécessite une connexion
 */

'use client';

import { useState } from 'react';
import { MetalNav, MetalFooter, MetalCard, StatCard, Icons, MetalButton } from '@/components';
import Link from 'next/link';
import { useSessions, useSessionsStats, useUserProfile } from '@/lib';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['ALL', 'THEORY', 'FRETBOARD', 'PROGRESSIONS', 'NOTATION', 'CHORDS', 'COMPOSITION'];

const LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-toxic',
  INTERMEDIATE: 'text-rust',
  ADVANCED: 'text-blood',
};

export default function SessionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'pending'>('all');

  // Si pas connecté, afficher le bouton de connexion
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="section-frame p-12 border-2 border-steel">
              <Icons.Sessions size="lg" className="mx-auto mb-6" />
              <h1 className="text-3xl font-metal text-white uppercase mb-4">
                Connexion Requise
              </h1>
              <p className="text-gray mb-8">
                Vous devez être connecté pour accéder à vos sessions d'apprentissage et suivre votre progression.
              </p>
              <div className="flex gap-4 justify-center">
                <MetalButton
                  onClick={() => router.push('/login')}
                >
                  SE CONNECTER
                </MetalButton>
                <MetalButton
                  onClick={() => router.push('/register')}
                  variant="outline"
                >
                  S'INSCRIRE
                </MetalButton>
              </div>
            </div>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  // Récupérer les sessions et stats depuis l'API (seulement si connecté)
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions(
    selectedCategory === 'ALL' ? undefined : selectedCategory,
    selectedLevel === 'ALL' ? undefined : selectedLevel
  );
  const { data: stats } = useSessionsStats();

  // Stats calculées depuis les données réelles
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalXP = sessions.filter(s => s.completed).reduce((sum, s) => sum + s.xp, 0);
  const totalDuration = sessions.reduce((sum, s) => {
    const mins = parseInt(s.duration) || 0;
    return sum + mins;
  }, 0);

  // Filter sessions localement pour le statut
  const filteredSessions = sessions.filter(session => {
    if (filterCompleted === 'completed' && !session.completed) return false;
    if (filterCompleted === 'pending' && session.completed) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              SESSIONS
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Vos sessions d'apprentissage
            </p>
          </div>

          {/* Loading state */}
          {sessionsLoading && (
            <div className="section-frame p-12 text-center mb-8">
              <Icons.Sessions size="lg" />
              <p className="text-gray mt-4">Chargement des sessions...</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Sessions Completees"
              value={`${completedSessions}/${sessions.length}`}
              icon={<Icons.Check />}
            />
            <StatCard
              label="Experience Totale"
              value={`${totalXP} XP`}
              icon={<Icons.Sessions />}
            />
            <StatCard
              label="Temps de Pratique"
              value={`${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`}
              icon={<Icons.Stop />}
            />
          </div>

          {/* Progress bar */}
          <div className="section-frame p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray uppercase">Progression Globale</span>
              <span className="text-sm text-white font-bold">{sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%</span>
            </div>
            <div className="h-4 border-2 border-steel bg-blackness">
              <div
                className="h-full bg-toxic border-r border-blood"
                style={{ width: `${sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="section-frame p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                        selectedCategory === cat
                          ? 'border-blood bg-toxic text-white'
                          : 'border-steel bg-abyss text-gray hover:border-white'
                      }`}
                    >
                      {cat === 'ALL' ? 'Tout' : cat}
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
                    onClick={() => setFilterCompleted('all')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterCompleted === 'all'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setFilterCompleted('completed')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterCompleted === 'completed'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Fini
                  </button>
                  <button
                    onClick={() => setFilterCompleted('pending')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterCompleted === 'pending'
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

          {/* Sessions list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map(session => (
              <MetalCard key={session.id} hover className={session.completed ? 'border-toxic' : ''}>
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray uppercase tracking-wider">{session.category}</span>
                      <h3 className="text-lg font-bold text-white">{session.title}</h3>
                    </div>
                    {session.completed && (
                      <div className="icon-box border-toxic">
                        <Icons.Check size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold uppercase ${LEVEL_COLORS[session.level]}`}>
                      {session.level}
                    </span>
                    <span className="text-xs text-gray">•</span>
                    <span className="text-xs text-gray">{session.duration}</span>
                    <span className="text-xs text-gray">•</span>
                    <span className="text-xs text-rust">+{session.xp} XP</span>
                  </div>

                  {/* Progress */}
                  {!session.completed && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray uppercase">Progression</span>
                        <span className="text-xs text-white">{session.progress}%</span>
                      </div>
                      <div className="h-2 border border-steel bg-blackness">
                        <div
                          className="h-full bg-toxic"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <Link
                    href={`/sessions/${session.id}`}
                    className={`w-full px-4 py-2 text-sm font-bold uppercase border-2 text-center transition-all block ${
                      session.completed
                        ? 'border-toxic bg-toxic text-white'
                        : session.progress > 0
                          ? 'border-steel bg-void text-gray hover:border-white'
                          : 'border-blood bg-blackness text-white hover:bg-toxic'
                    } ${session.progress === 0 ? 'poly-left' : ''}`}
                  >
                    {session.completed ? 'REFAIRE' : session.progress > 0 ? 'CONTINUER' : 'COMMENCER'}
                  </Link>
                </div>
              </MetalCard>
            ))}
          </div>

          {/* Empty state */}
          {filteredSessions.length === 0 && (
            <div className="section-frame p-12 text-center">
              <Icons.Sessions size="lg" />
              <p className="text-gray mt-4">Aucune session ne correspond a vos filtres.</p>
            </div>
          )}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
