// ============================================================================
// METAL ICONS - SVG icons for ADAGIO (no emojis)
// ============================================================================
//
// Icônes géométriques angulaires style metal/brutal
// ============================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polygon, Ellipse } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = '#00ff00';

// ============================================================================
// MUSIC ICONS
// ============================================================================

export function MusicIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M9 18V5l12-2v13"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Circle cx="6" cy="18" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="16" r="3" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function GuitarIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1" />
      <Line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="1" />
      <Line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth="1" />
      <Line x1="4" y1="14" x2="20" y2="14" stroke={color} strokeWidth="1" />
      <Circle cx="9" cy="18" r="1.5" fill={color} />
      <Circle cx="15" cy="18" r="1.5" fill={color} />
    </Svg>
  );
}

export function NoteIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function ChordIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Rect x="2" y="8" width="20" height="8" rx="1" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="6" y1="8" x2="6" y2="16" stroke={color} strokeWidth="2" />
      <Line x1="10" y1="8" x2="10" y2="16" stroke={color} strokeWidth="2" />
      <Line x1="14" y1="8" x2="14" y2="16" stroke={color} strokeWidth="2" />
      <Line x1="18" y1="8" x2="18" y2="16" stroke={color} strokeWidth="2" />
      <Circle cx="8" cy="12" r="1.5" fill={color} />
      <Circle cx="12" cy="10" r="1.5" fill={color} />
      <Circle cx="16" cy="14" r="1.5" fill={color} />
    </Svg>
  );
}

// ============================================================================
// NAVIGATION ICONS
// ============================================================================

export function HomeIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Line x1="9" y1="22" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="15" y1="22" x2="15" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function SettingsIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M9 18l6-6-6-6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function BackIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function CloseIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

// ============================================================================
// ACTION ICONS
// ============================================================================

export function PlusIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function MinusIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function TrashIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function EditIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function SaveIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Path d="M17 21v-8H7v8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Path d="M7 3v5h8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function PlayIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Polygon points="5,3 19,12 5,21" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="miter" />
    </Svg>
  );
}

export function PauseIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Line x1="6" y1="4" x2="6" y2="20" stroke={color} strokeWidth="3" strokeLinecap="square" />
      <Line x1="18" y1="4" x2="18" y2="20" stroke={color} strokeWidth="3" strokeLinecap="square" />
    </Svg>
  );
}

// ============================================================================
// UI ICONS
// ============================================================================

export function SearchIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function FilterIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="miter" />
    </Svg>
  );
}

export function CheckIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function WarningIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Circle cx="12" cy="17" r="1" fill={color} />
    </Svg>
  );
}

export function InfoIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function StarIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps, filled = false) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function StarFilledIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return StarIcon({ size, color, style }, true);
}

export function HeartIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps, filled = false) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function HeartFilledIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return HeartIcon({ size, color, style }, true);
}

// ============================================================================
// LIBRARY ICONS
// ============================================================================

export function LibraryIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function FolderIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function UserIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function TrophyIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M8 21h8M12 17v4M7 4h10M5 9v2a7 7 0 0 0 7 7 7 7 0 0 0 7-7V9M5 9a2 2 0 0 1 0-4M19 9a2 2 0 0 0 0-4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

// ============================================================================
// THEORY ICONS
// ============================================================================

export function CircleIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="3" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="12" y1="19" x2="12" y2="21" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="21" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <Line x1="5" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </Svg>
  );
}

export function ScaleIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="2" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="6" r="2" fill={color} />
      <Circle cx="18" cy="12" r="2" fill={color} />
      <Circle cx="12" cy="18" r="2" fill={color} />
      <Circle cx="6" cy="12" r="2" fill={color} />
    </Svg>
  );
}

export function ModeIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Rect x="3" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="14" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="14" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="3" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// ============================================================================
// MISC ICONS
// ============================================================================

export function RefreshIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M23 4v6h-6M1 20v-6h6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Path
        d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

export function ShareIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx="18" cy="5" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="6" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="19" r="3" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth="2" />
      <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// Export all icons as object
export const Icons = {
  // Music
  music: MusicIcon,
  guitar: GuitarIcon,
  note: NoteIcon,
  chord: ChordIcon,

  // Navigation
  home: HomeIcon,
  settings: SettingsIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,
  back: BackIcon,
  close: CloseIcon,

  // Actions
  plus: PlusIcon,
  minus: MinusIcon,
  trash: TrashIcon,
  edit: EditIcon,
  save: SaveIcon,
  play: PlayIcon,
  pause: PauseIcon,

  // UI
  search: SearchIcon,
  filter: FilterIcon,
  check: CheckIcon,
  warning: WarningIcon,
  info: InfoIcon,
  star: StarIcon,
  starFilled: StarFilledIcon,
  heart: HeartIcon,
  heartFilled: HeartFilledIcon,

  // Library
  library: LibraryIcon,
  folder: FolderIcon,
  user: UserIcon,
  trophy: TrophyIcon,

  // Theory
  circle: CircleIcon,
  scale: ScaleIcon,
  mode: ModeIcon,

  // Misc
  refresh: RefreshIcon,
  share: ShareIcon,
};

export type IconName = keyof typeof Icons;
