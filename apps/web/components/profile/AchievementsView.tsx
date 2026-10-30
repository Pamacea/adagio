/**
 * ADAGIO - Achievements View
 * Vue complète des succès (filtres, stats, progression) — intégrée au tab Profil
 */

'use client';

import { useState, useMemo } from 'react';
import { MetalCard, StatCard } from '@/components/MetalCard';
import { Icons } from '@/components/MetalIcons';
import { AchievementIcon } from '@/components/AchievementIcons';
import { useAchievements, useAchievementStats } from '@/lib';
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

export function AchievementsView() {
  const { data: achievements, isLoading } = useAchievements();
  const stats = useAchievementStats();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'ALL'>('ALL');
  const [filterUnlocked, setFilterUnlocked] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Categories avec labels et couleurs (utilise les types de @adagio/types)
  const CATEGORIES = useMemo(
    () => ({
      progression: { label: 'Progression', color: 'text-amber-400' },
      discovery: { label: 'Decouverte', color: 'text-cyan-400' },
      practice: { label: 'Pratique', color: 'text-emerald-500' },
      mastery: { label: 'Maîtrise', color: 'text-violet-400' },
      social: { label: 'Social', color: 'text-blue-400' },
      milestone: { label: 'Jalon', color: 'text-rose-400' },
    }),
    []
  );

  // Rarete avec labels et couleurs
  const RARITIES = useMemo(
    () => ({
      common: { label: 'Commun', color: 'text-gray', bg: 'bg-gray/10', border: 'border-gray' },
      rare: {
        label: 'Rare',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500',
      },
      epic: {
        label: 'Epic',
        color: 'text-violet-400',
        bg: 'bg-violet-400/10',
        border: 'border-violet-400',
      },
      legendary: {
        label: 'Legendaire',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400',
      },
    }),
    []
  );

  // Filter
  const filteredAchievements = useMemo(() => {
    if (!achievements) return [];

    return achievements.filter((achievement) => {
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
      <div className="section-frame p-12 text-center">
        <Icons.Check size="lg" />
        <p className="text-gray mt-4">Chargement des succès...</p>
      </div>
    );
  }

  return (
    <div>
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
        <StatCard label="XP Gagnees" value={stats.totalXP.toString()} icon={<Icons.Compose />} />
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
        <div className="h-4 border border-steelwarm bg-surface">
          <div
            className="h-full bg-amber-400 border-r border-amber-400 transition-all duration-500"
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
            const pct =
              categoryStats.total > 0
                ? Math.round((categoryStats.unlocked / categoryStats.total) * 100)
                : 0;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
                className={`p-3 border text-center transition-all ${
                  selectedCategory === cat
                    ? 'border-amber-400 bg-amber-400/15'
                    : 'border-steelwarm bg-surface hover:border-amber-400/50'
                }`}
              >
                <div className={`${color} mb-1`}>{CATEGORY_ICONS[cat]}</div>
                <div className="text-xs text-white font-bold">{label}</div>
                <div className="text-xs text-gray">
                  {categoryStats.unlocked}/{categoryStats.total}
                </div>
                <div className="h-1 border border-steelwarm bg-surface mt-1">
                  <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
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
            <label className="text-xs text-gray uppercase tracking-wider block mb-2">Rarete</label>
            <div className="flex flex-wrap gap-1">
              {(['ALL', ...Object.keys(RARITIES)] as const).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() =>
                    setSelectedRarity(rarity === 'ALL' ? 'ALL' : (rarity as AchievementRarity))
                  }
                  className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                    selectedRarity === rarity
                      ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                      : 'border-steelwarm bg-surface text-gray hover:border-amber-400/50'
                  }`}
                >
                  {rarity === 'ALL' ? 'Toutes' : RARITIES[rarity as AchievementRarity].label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs text-gray uppercase tracking-wider block mb-2">Statut</label>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterUnlocked('all')}
                className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                  filterUnlocked === 'all'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                    : 'border-steelwarm bg-surface text-gray hover:border-amber-400/50'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setFilterUnlocked('unlocked')}
                className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                  filterUnlocked === 'unlocked'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                    : 'border-steelwarm bg-surface text-gray hover:border-amber-400/50'
                }`}
              >
                Deverouilles
              </button>
              <button
                onClick={() => setFilterUnlocked('locked')}
                className={`flex-1 px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                  filterUnlocked === 'locked'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                    : 'border-steelwarm bg-surface text-gray hover:border-amber-400/50'
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
              className="w-full px-3 py-1.5 text-xs font-bold uppercase border border-steelwarm bg-surface text-gray hover:border-amber-400/50"
            >
              Reset Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Achievements list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAchievements.map((achievement) => {
          const rarity = RARITIES[achievement.rarity];
          const category = CATEGORIES[achievement.category];
          const showProgress =
            !achievement.unlocked && (achievement.progress ?? 0) < (achievement.maxProgress ?? 0);
          const progressPct =
            showProgress && achievement.maxProgress
              ? Math.round(((achievement.progress ?? 0) / achievement.maxProgress) * 100)
              : 0;

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
                  <div
                    className={`w-12 h-12 flex items-center justify-center text-2xl border ${achievement.unlocked ? rarity.bg + ' ' + rarity.border : 'border-steelwarm bg-surface'}`}
                  >
                    {achievement.unlocked ? (
                      <AchievementIcon name={achievement.icon} size={24} className="text-current" />
                    ) : (
                      <Icons.Lock size="sm" />
                    )}
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
                    <h3
                      className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray'}`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray mt-0.5">{achievement.description}</p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${achievement.unlocked ? 'text-amber-400' : 'text-gray'}`}
                    >
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
                      <span className="text-xs text-white">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 border border-steelwarm bg-surface">
                      <div className="h-full bg-amber-400" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-steelwarm">
                  <div className={`text-xs ${achievement.unlocked ? 'text-amber-400' : 'text-gray'}`}>
                    {achievement.unlocked
                      ? '✓ Deverouille'
                      : progressPct > 0
                        ? `En cours (${progressPct}%)`
                        : 'Verrouille'}
                  </div>

                  {/* CTA */}
                  {!achievement.unlocked && (
                    <Link
                      href="/lessons"
                      className="px-3 py-1 text-xs font-bold uppercase border border-steelwarm bg-surface text-gray hover:border-amber-400/50"
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
  );
}
