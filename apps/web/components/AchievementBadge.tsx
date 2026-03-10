/**
 * ADAGIO - AchievementBadge Component
 * Badge pour afficher les succès/achievements
 */

import { Icons } from './MetalIcons';

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progress?: number;
  maxProgress?: number;
  className?: string;
}

const RARITY_STYLES = {
  common: {
    border: 'border-gray',
    bg: 'bg-gray/20',
    glow: '',
  },
  rare: {
    border: 'border-toxic',
    bg: 'bg-toxic/20',
    glow: 'shadow-toxic',
  },
  epic: {
    border: 'border-rust',
    bg: 'bg-rust/20',
    glow: 'shadow-rust',
  },
  legendary: {
    border: 'border-blood',
    bg: 'bg-blood/20',
    glow: 'shadow-blood',
  },
};

const SIZE_STYLES = {
  sm: {
    container: 'w-10 h-10',
    icon: 'text-lg',
    text: 'text-xs',
  },
  md: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    text: 'text-sm',
  },
  lg: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    text: 'text-base',
  },
};

export function AchievementBadge({
  title,
  description,
  icon,
  rarity = 'common',
  unlocked = true,
  size = 'md',
  showProgress = false,
  progress = 0,
  maxProgress = 100,
  className = '',
}: AchievementBadgeProps) {
  const rarityStyle = RARITY_STYLES[rarity];
  const sizeStyle = SIZE_STYLES[size];

  const progressPercentage = maxProgress > 0 ? Math.round((progress / maxProgress) * 100) : 0;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {/* Badge Icon */}
      <div
        className={`
          ${sizeStyle.container} ${rarityStyle.border} ${rarityStyle.bg}
          border-2 flex items-center justify-center
          ${unlocked ? rarityStyle.glow : 'opacity-50 grayscale'}
          transition-all duration-300
        `}
      >
        {unlocked ? (
          <span className={sizeStyle.icon}>{icon || <Icons.Check />}</span>
        ) : (
          <span className={`${sizeStyle.icon} text-gray`}>🔒</span>
        )}
      </div>

      {/* Badge Info (for md and lg sizes) */}
      {(size === 'md' || size === 'lg') && (
        <div className="text-center">
          <div className={`${sizeStyle.text} font-bold text-white uppercase`}>
            {title}
          </div>
          {description && size === 'lg' && (
            <div className="text-xs text-gray max-w-[150px]">{description}</div>
          )}
        </div>
      )}

      {/* Progress Bar (optional) */}
      {showProgress && !unlocked && (
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-gray mb-1">
            <span>Progression</span>
            <span>{progress}/{maxProgress}</span>
          </div>
          <div className="h-1.5 border border-steel bg-blackness w-full">
            <div
              className="h-full bg-toxic"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked indicator */}
      {unlocked && (
        <div className="flex items-center gap-1 text-xs text-toxic">
          <Icons.Check size="sm" />
          <span>Deverouille</span>
        </div>
      )}
    </div>
  );
}

/**
 * AchievementBadgeList - Grid of badges
 */
interface AchievementBadgeListProps {
  achievements: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  columns?: 2 | 3 | 4 | 6;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadgeList({
  achievements,
  columns = 4,
  size = 'md',
}: AchievementBadgeListProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          {...achievement}
          size={size}
          showProgress
          progress={achievement.progress}
          maxProgress={achievement.maxProgress}
        />
      ))}
    </div>
  );
}

/**
 * AchievementCompact - Compact badge for small spaces
 */
interface AchievementCompactProps {
  title: string;
  icon?: string;
  unlocked?: boolean;
  onClick?: () => void;
}

export function AchievementCompact({
  title,
  icon = '🏆',
  unlocked = true,
  onClick,
}: AchievementCompactProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 border-2 transition-all
        ${unlocked ? 'border-toxic bg-toxic/10 hover:bg-toxic/20' : 'border-steel bg-blackness opacity-50'}
      `}
    >
      <span className="text-lg">{unlocked ? icon : '🔒'}</span>
      <span className={`text-xs font-bold uppercase ${unlocked ? 'text-white' : 'text-gray'}`}>
        {title}
      </span>
    </button>
  );
}
