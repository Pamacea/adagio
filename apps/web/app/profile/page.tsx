/**
 * ADAGIO - Profile Page
 * Profil utilisateur et paramètres
 * Page protégée - nécessite une connexion
 */

'use client';

import { useState } from 'react';
import { MetalNav, MetalFooter, MetalCard, StatCard, MetalButton, Icons, PreferencesSection, AccountActions } from '@/components';
import { MetalLink } from '@/components/MetalButton';
import { useUserProfile, useUserStats, useUserAchievements } from '@/lib';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading, isAuthenticated } = useUserProfile();
  const { data: stats } = useUserStats();
  const { data: achievementsData } = useUserAchievements();

  // Limiter à 6 achievements pour le profil
  const achievements = achievementsData?.slice(0, 6);

  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'achievements' | 'settings'>('profile');
  const [editMode, setEditMode] = useState(false);

  // Si pas connecté, afficher le bouton de connexion
  if (!profileLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="section-frame p-12 border-2 border-steel">
              <Icons.User size="lg" className="mx-auto mb-6" />
              <h1 className="text-3xl font-metal text-white uppercase mb-4">
                Connexion Requise
              </h1>
              <p className="text-gray mb-8">
                Vous devez être connecté pour accéder à votre profil et vos paramètres.
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

  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="section-frame p-12 text-center">
              <Icons.User size="lg" />
              <p className="text-gray mt-4">Chargement du profil...</p>
            </div>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  // Double vérification: si pas de profil (malgré la vérif d'auth), afficher la page de connexion
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="section-frame p-12 border-2 border-steel">
              <Icons.User size="lg" className="mx-auto mb-6" />
              <h1 className="text-3xl font-metal text-white uppercase mb-4">
                Connexion Requise
              </h1>
              <p className="text-gray mb-8">
                Vous devez être connecté pour accéder à votre profil.
              </p>
              <MetalButton
                onClick={() => router.push('/login')}
              >
                SE CONNECTER
              </MetalButton>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              PROFIL
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Votre progression ADAGIO
            </p>
          </div>

          {/* Profile Header Card */}
          <div className="section-frame p-6 mb-8 border-2 border-blood">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 border-4 border-blood bg-toxic flex items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🤘</span>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-metal text-white uppercase mb-1">
                  {profile.username}
                </h2>
                <p className="text-blood font-bold uppercase mb-2">{profile.level}</p>
                <p className="text-sm text-gray">Membre depuis {new Date(profile.joinedAt).toLocaleDateString('fr-FR')}</p>
              </div>

              {/* Level badge */}
              <div className="text-center">
                <div className="text-4xl font-metal text-white">{profile.levelNumber}</div>
                <p className="text-xs text-gray uppercase">Niveau</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              PROFIL
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              STATISTIQUES
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              SUCCES
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              PARAMETRES
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Edit profile form */}
              <div className="section-frame p-6">
                <h3 className="text-lg font-metal text-white uppercase mb-4">
                  Informations Personnelles
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.username}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white disabled:opacity-50 focus:border-blood focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={profile.email}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white disabled:opacity-50 focus:border-blood focus:outline-none"
                    />
                  </div>

                  {/* Instruments */}
                  <div>
                    <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                      Instruments
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Guitare', 'Basse', 'Piano', 'Chant'].map(inst => (
                        <button
                          key={inst}
                          disabled={!editMode}
                          className={`px-4 py-2 text-sm font-bold uppercase border-2 ${
                            inst === 'Guitare'
                              ? 'border-blood bg-toxic text-white'
                              : 'border-steel bg-abyss text-gray'
                          } disabled:opacity-50`}
                        >
                          {inst}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                      Genres preferes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Metal', 'Rock', 'Jazz', 'Blues', 'Classique', 'Funk'].map(genre => (
                        <button
                          key={genre}
                          disabled={!editMode}
                          className={`px-3 py-1 text-xs font-bold uppercase border-2 ${
                            ['Metal', 'Rock', 'Jazz'].includes(genre)
                              ? 'border-blood bg-toxic text-white'
                              : 'border-steel bg-abyss text-gray'
                          } disabled:opacity-50`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  {editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white poly-left"
                      >
                        SAUVEGARDER
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray poly-right"
                      >
                        ANNULER
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white"
                    >
                      MODIFIER
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              {!stats ? (
                <div className="section-frame p-12 text-center">
                  <Icons.Settings size="lg" />
                  <p className="text-gray mt-4">Chargement des statistiques...</p>
                </div>
              ) : (
                <>
                  {/* Quick stats - XP */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="border-2 border-steel bg-blackness p-4 text-center">
                      <p className="text-xs text-gray uppercase mb-1">Niveau</p>
                      <p className="text-3xl font-metal text-white">{stats.xp.level}</p>
                    </div>
                    <div className="border-2 border-steel bg-blackness p-4 text-center">
                      <p className="text-xs text-gray uppercase mb-1">XP Total</p>
                      <p className="text-3xl font-metal text-toxic">{stats.xp.total}</p>
                    </div>
                    <div className="border-2 border-steel bg-blackness p-4 text-center">
                      <p className="text-xs text-gray uppercase mb-1">Leçons</p>
                      <p className="text-3xl font-metal text-white">{stats.lessons.completed}/{stats.lessons.total}</p>
                    </div>
                    <div className="border-2 border-steel bg-blackness p-4 text-center">
                      <p className="text-xs text-gray uppercase mb-1">Techniques</p>
                      <p className="text-3xl font-metal text-white">{stats.techniques.learned}/{stats.techniques.total}</p>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="section-frame p-6 mb-4">
                    <h3 className="text-lg font-metal text-white uppercase mb-4">
                      Progression Niveau {stats.xp.level}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray">{stats.xp.currentLevelXP} XP</span>
                      <span className="text-sm text-toxic font-bold">{stats.xp.xpToNextLevel} XP restants</span>
                    </div>
                    <div className="h-4 border-2 border-steel bg-blackness">
                      <div
                        className="h-full bg-toxic border-r border-blood"
                        style={{ width: `${stats.xp.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Lessons Progress */}
                  <div className="section-frame p-6 mb-4">
                    <h3 className="text-lg font-metal text-white uppercase mb-4">
                      Leçons
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-metal text-toxic">{stats.lessons.completed}</p>
                        <p className="text-xs text-gray">Terminées</p>
                      </div>
                      <div>
                        <p className="text-2xl font-metal text-rust">{stats.lessons.inProgress}</p>
                        <p className="text-xs text-gray">En cours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-metal text-white">{stats.lessons.completionPercent}%</p>
                        <p className="text-xs text-gray">Complétion</p>
                      </div>
                    </div>
                  </div>

                  {/* Techniques Progress */}
                  <div className="section-frame p-6">
                    <h3 className="text-lg font-metal text-white uppercase mb-4">
                      Techniques
                    </h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-metal text-white">{stats.techniques.learned}</p>
                        <p className="text-xs text-gray">Apprises</p>
                      </div>
                      <div>
                        <p className="text-2xl font-metal text-toxic">{stats.techniques.mastered}</p>
                        <p className="text-xs text-gray">Maîtrisées</p>
                      </div>
                      <div>
                        <p className="text-2xl font-metal text-rust">{stats.techniques.inProgress}</p>
                        <p className="text-xs text-gray">En cours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-metal text-white">{stats.techniques.completionPercent}%</p>
                        <p className="text-xs text-gray">Complétion</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              {!achievements || achievements.length === 0 ? (
                <div className="section-frame p-12 text-center">
                  <Icons.Fire size="lg" />
                  <p className="text-gray mt-4">Aucun succès débloqué pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`section-frame p-4 ${achievement.unlocked ? 'border-toxic' : 'border-steel opacity-50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`icon-box ${achievement.unlocked ? 'border-toxic' : 'border-steel'}`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray'}`}>
                          {achievement.title}
                        </h4>
                        {!achievement.unlocked && <span className="text-xs text-blood">VERROUILLE</span>}
                      </div>
                      <p className="text-xs text-gray">{achievement.description}</p>
                    </div>
                  </div>
                </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Preferences */}
              <PreferencesSection />

              {/* Account actions */}
              <AccountActions />

              {/* App info */}
              <div className="section-frame p-6">
                <h3 className="text-lg font-metal text-white uppercase mb-4">
                  Application
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray">Version: 0.1.0</p>
                  <p className="text-gray">Build: 2025.03.06</p>
                  <p className="text-gray">
                    <MetalLink href="/warning" className="text-rust hover:text-white">
                      Avertissements legaux
                    </MetalLink>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
