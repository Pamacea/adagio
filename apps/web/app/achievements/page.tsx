/**
 * ADAGIO - Achievements Page
 * Systeme de succes et accomplissements
 * Utilise TanStack Query avec fallback sur données hardcodées
 */

'use client';

import { useState, useMemo } from 'react';
import { MetalNav, MetalFooter, MetalCard, StatCard, Icons } from '@/components';
import { useAchievements, useAchievementStats, useUserAchievements } from '@/lib';
import Link from 'next/link';
import type { AchievementCategory, AchievementRarity } from '@adagio/types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  progression: <Icons.Sessions size="sm" />,
  discovery: <Icons.Circle size="sm" />,
  practice: <Icons.Compose size="sm" />,
  mastery: <Icons.Check size="sm" />,
  social: <Icons.User size="sm" />,
  milestone: <Icons.Skull size="sm" />,
};

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useAchievements();
  const { data: userAchievements } = useUserAchievements();
  const stats = useAchievementStats();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'ALL'>('ALL');
  const [filterUnlocked, setFilterUnlocked] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Categories avec labels et couleurs (utilise les types de @adagio/types)
  const CATEGORIES = useMemo(() => ({
    progression: { label: 'Progression', color: 'text-toxic' },
    discovery: { label: 'Decouverte', color: 'text-rust' },
    practice: { label: 'Pratique', color: 'text-blood' },
    mastery: { label: 'Maîtrise', color: 'text-toxic' },
    social: { label: 'Social', color: 'text-rust' },
    milestone: { label: 'Jalon', color: 'text-blood' },
  }), []);

  // Rarete avec labels et couleurs
  const RARITIES = useMemo(() => ({
    common: { label: 'Commun', color: 'text-gray', bg: 'bg-steel', border: 'border-gray' },
    rare: { label: 'Rare', color: 'text-toxic', bg: 'bg-toxic', border: 'border-toxic' },
    epic: { label: 'Epic', color: 'text-rust', bg: 'bg-rust', border: 'border-rust' },
    legendary: { label: 'Legendaire', color: 'text-blood', bg: 'bg-blood', border: 'border-blood' },
  }), []);

  // Filter
  const filteredAchievements = useMemo(() => {
    if (!achievements) return [];

    return achievements.filter(achievement => {
      if (selectedCategory !== 'ALL' && achievement.category !== selectedCategory) return false;
      if (selectedRarity !== 'ALL' && achievement.rarity !== selectedRarity) return false;
      if (filterUnlocked === 'unlocked' && !achievement.unlocked) return false;
      if (filterUnlocked === 'locked' && achievement.unlocked) return false;
      return true;
    });
  }, [achievements, selectedCategory, selectedRarity, filterUnlocked]);

  // Sort: unlocked first, then by rarity (legendary first), then by XP
  const sortedAchievements = useMemo(() => {
    return [...filteredAchievements].sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity] || b.xp - a.xp;
    });
  }, [filteredAchievements]);

  // Loading state
  if (isLoading || !achievements) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="section-frame p-12 text-center">
              <Icons.Check size="lg" />
              <p className="text-gray mt-4">Chargement des succès...</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              SUCCÈS
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Vos accomplissements ADAGIO
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Deverouilles"
              value={`${stats.unlockedAchievements}/${stats.totalAchievements}`}
              icon={<Icons.Check />}
            />
            <StatCard
              label="Completion"
              value={`${stats.completionPercentage}%`}
              icon={<Icons.Sessions />}
            />
            <StatCard
              label="XP Gagnees"
              value={stats.totalXP.toString()}
              icon={<Icons.Compose />}
            />
            <StatCard
              label="XP Restantes"
              value={`${stats.maxXP - stats.totalXP}`}
              icon={<Icons.Stop />}
            />
          </div>

          {/* Global progress */}
          <div className="section-frame p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray uppercase">Progression Globale</span>
              <span className="text-sm text-white font-bold">{stats.completionPercentage}%</span>
            </div>
            <div className="h-4 border-2 border-steel bg-blackness">
              <div
                className="h-full bg-toxic border-r border-blood transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* By category */}
          <div className="section-frame p-4 mb-8">
            <h3 className="text-sm font-bold text-white uppercase mb-4">Progression par Categorie</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(CATEGORIES).map(([key, { label, color }]) => {
                const cat = key as AchievementCategory;
                const categoryStats = stats.byCategory[cat] || { total: 0, unlocked: 0 };
                const pct = categoryStats.total > 0 ? Math.round((categoryStats.unlocked / categoryStats.total) * 100) : 0;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
                    className={`p-3 border-2 text-center transition-all ${
                      selectedCategory === cat
                        ? 'border-blood bg-toxic'
                        : 'border-steel bg-blackness hover:border-white'
                    }`}
                  >
                    <div className={`${color} mb-1`}>{CATEGORY_ICONS[cat]}</div>
                    <div className="text-xs text-white font-bold">{label}</div>
                    <div className="text-xs text-gray">{categoryStats.unlocked}/{categoryStats.total}</div>
                    <div className="h-1 border border-steel bg-blackness mt-1">
                      <div className="h-full bg-toxic" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="section-frame p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rarity */}
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Rarete
                </label>
                <div className="flex flex-wrap gap-1">
                  {(['ALL', ...Object.keys(RARITIES)] as const).map(rarity => (
                    <button
                      key={rarity}
                      onClick={() => setSelectedRarity(rarity === 'ALL' ? 'ALL' : rarity as AchievementRarity)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                        selectedRarity === rarity
                          ? 'border-blood bg-toxic text-white'
                          : 'border-steel bg-abyss text-gray hover:border-white'
                      }`}
                    >
                      {rarity === 'ALL' ? 'Toutes' : RARITIES[rarity as AchievementRarity].label}
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
                    onClick={() => setFilterUnlocked('all')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterUnlocked === 'all'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setFilterUnlocked('unlocked')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterUnlocked === 'unlocked'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Deverouilles
                  </button>
                  <button
                    onClick={() => setFilterUnlocked('locked')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                      filterUnlocked === 'locked'
                        ? 'border-blood bg-toxic text-white'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    Verrouilles
                  </button>
                </div>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedRarity('ALL');
                    setFilterUnlocked('all');
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white"
                >
                  Reset Filtres
                </button>
              </div>
            </div>
          </div>

          {/* Achievements list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAchievements.map(achievement => {
              const rarity = RARITIES[achievement.rarity];
              const category = CATEGORIES[achievement.category];
              const showProgress = !achievement.unlocked && (achievement.progress ?? 0) < (achievement.maxProgress ?? 0);
              const progressPct = showProgress && achievement.maxProgress ? Math.round(((achievement.progress ?? 0) / achievement.maxProgress) * 100) : 0;

              return (
                <MetalCard
                  key={achievement.id}
                  hover
                  className={`${achievement.unlocked ? rarity.border : ''} ${!achievement.unlocked ? 'opacity-60' : ''}`}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Icon */}
                      <div className={`w-12 h-12 flex items-center justify-center text-2xl border-2 ${achievement.unlocked ? rarity.bg + ' ' + rarity.border : 'border-steel bg-blackness'}`}>
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs ${category.color} uppercase`}>
                            {category.label}
                          </span>
                          <span className={`text-xs font-bold uppercase ${rarity.color}`}>
                            {rarity.label}
                          </span>
                        </div>
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-gray mt-0.5">{achievement.description}</p>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <div className={`text-sm font-bold ${achievement.unlocked ? 'text-toxic' : 'text-gray'}`}>
                          +{achievement.xp} XP
                        </div>
                        {achievement.unlockedAt && (
                          <div className="text-xs text-gray">
                            {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress bar (for locked achievements) */}
                    {showProgress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray">Progression</span>
                          <span className="text-xs text-white">{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="h-2 border border-steel bg-blackness">
                          <div
                            className="h-full bg-toxic"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-steel">
                      <div className={`text-xs ${achievement.unlocked ? 'text-toxic' : 'text-gray'}`}>
                        {achievement.unlocked ? '✓ Deverouille' : progressPct > 0 ? `En cours (${progressPct}%)` : 'Verrouille'}
                      </div>

                      {/* CTA */}
                      {!achievement.unlocked && (
                        <Link
                          href="/lessons"
                          className="px-3 py-1 text-xs font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white"
                        >
                          Continuer
                        </Link>
                      )}
                    </div>
                  </div>
                </MetalCard>
              );
            })}
          </div>

          {/* Empty state */}
          {sortedAchievements.length === 0 && (
            <div className="section-frame p-12 text-center">
              <Icons.Check size="lg" />
              <p className="text-gray mt-4">Aucun succes ne correspond a vos filtres.</p>
            </div>
          )}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
