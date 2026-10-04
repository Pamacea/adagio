/**
 * ADAGIO - Achievement Icons Component
 * SVG icons pour les achievements (remplacement des emojis)
 */

import { SVGProps } from 'react';

export interface AchievementIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// Guitare - Premier Riff
export function GuitarIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 5l-3-1" />
      <path d="M9 9l-3-1" />
      <path d="M9 13l-3-1" />
    </svg>
  );
}

// Livre - Theoricien, Bibliothécaire
export function BookIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h6" />
      <path d="M8 11h6" />
    </svg>
  );
}

// Cercle - Circle Master
export function CircleIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Carte - Fretboard Explorer
export function MapIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

// Saxophone/Jazz - Jazz Cat
export function JazzIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 20h12" />
      <path d="M10 20V8a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v8" />
      <circle cx="10" cy="20" r="2" fill="currentColor" />
      <path d="M14 12h4" />
      <path d="M14 16h4" />
    </svg>
  );
}

// Main metal - Metal God
export function MetalIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// Feu - Streak
export function FireIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

// Eclair - Mois Ininterrompu
export function BoltIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// Graphique - Millefeuille XP
export function ChartIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

// Couronne - Maître XP
export function CrownIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

// Partition - Collectionneur de Gamme
export function MusicSheetIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 5l-3-1" />
      <path d="M9 9l-3-1" />
      <path d="M9 13l-3-1" />
    </svg>
  );
}

// Chronomètre - Heure de Pratique
export function TimerIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="10" y1="2" x2="14" y2="2" />
      <circle cx="12" cy="14" r="8" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Cible - Dix Heures
export function TargetIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

// 100 - Centenaire, Perfection
export function HundredIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9h2" />
      <path d="M9 12v3" />
      <path d="M13 9h2" />
      <path d="M13 12v3" />
      <path d="M9 15h6" />
    </svg>
  );
}

// Note de musique - Metronome Perfection
export function MusicNoteIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// Cerveau - Theoricien
export function BrainIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

// Oreille - Oreille Absolue
export function EarIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 14a5 5 0 0 0 5 5" />
      <path d="M9 14v3" />
      <path d="M12 14a5 5 0 0 0-5-5" />
      <path d="M12 14V9a5 5 0 0 1 5-5" />
      <path d="M12 19a5 5 0 0 1-5-5" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
    </svg>
  );
}

// Yeux - Lecture à Vue
export function EyeIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Piano - Improvisateur
export function PianoIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 6v12" />
      <path d="M10 6v12" />
      <path d="M14 6v12" />
      <path d="M18 6v12" />
      <path d="M8 6v4" />
      <path d="M12 6v4" />
      <path d="M16 6v4" />
    </svg>
  );
}

// Envoi - Partageur
export function SendIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// Personnes - Sociable
export function PeopleIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Poignée - Mentor
export function HandshakeIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.9 0-1.75.34-2.4.9L2 16a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l5-4" />
      <path d="M20 9a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v6h4" />
    </svg>
  );
}

// Micro - Chef de Groupe
export function MicIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

// Etoile - Apprenti Confirmé
export function StarIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Etoile brillante - Musicien
export function StarBrightIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Gemme - Expert
export function GemIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 3h12l4 6-10 13L2 9z" />
    </svg>
  );
}

// Trophee - Maître
export function TrophyIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

// Temple - Fondations Solides
export function TempleIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 22h16" />
      <path d="M2 22h20" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4 7l8-5 8 5" />
      <path d="M4 7v4" />
      <path d="M20 7v4" />
      <path d="M9 12v10" />
      <path d="M15 12v10" />
    </svg>
  );
}

// Cadenas - Achievement verrouillé
export function LockIcon({ size = 24, className = '', ...props }: AchievementIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

// Mapping des icones par nom
export const ACHIEVEMENT_ICONS: Record<string, React.FC<AchievementIconProps>> = {
  guitar: GuitarIcon,
  book: BookIcon,
  circle: CircleIcon,
  map: MapIcon,
  jazz: JazzIcon,
  metal: MetalIcon,
  fire: FireIcon,
  bolt: BoltIcon,
  chart: ChartIcon,
  crown: CrownIcon,
  music_sheet: MusicSheetIcon,
  timer: TimerIcon,
  target: TargetIcon,
  hundred: HundredIcon,
  music_note: MusicNoteIcon,
  brain: BrainIcon,
  ear: EarIcon,
  eye: EyeIcon,
  piano: PianoIcon,
  send: SendIcon,
  people: PeopleIcon,
  handshake: HandshakeIcon,
  mic: MicIcon,
  star: StarIcon,
  star_bright: StarBrightIcon,
  gem: GemIcon,
  trophy: TrophyIcon,
  temple: TempleIcon,
  lock: LockIcon,
};

// Composant wrapper pour récupérer l'icône par nom
export function AchievementIcon({
  name,
  size = 24,
  className = '',
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const IconComponent = ACHIEVEMENT_ICONS[name] || StarIcon;
  return <IconComponent size={size} className={className} {...props} />;
}
