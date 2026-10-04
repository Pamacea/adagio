// ============================================================================
// ADAGIO DESIGN SYSTEM
// ============================================================================
// Musical & Elegant UI Components for Music Theory Learning

// Utilities
export { cn } from './lib/cn';

// Atoms
export { Button } from './atoms/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './atoms/Button';

export { Input } from './atoms/Input';
export type { InputProps } from './atoms/Input';

export { Badge } from './atoms/Badge';
export type { BadgeProps, BadgeVariant } from './atoms/Badge';

export { ModeIcon } from './atoms/ModeIcon';
export type { ModeIconProps } from './atoms/ModeIcon';

export { HelpButton } from './atoms/HelpButton';
export type { HelpButtonProps, HelpButtonSize, HelpButtonVariant } from './atoms/HelpButton';

// Molecules
export { Card } from './molecules/Card';
export type { CardProps } from './molecules/Card';

export { Modal } from './molecules/Modal';
export type { ModalProps } from './molecules/Modal';

export { ChordCard } from './molecules/ChordCard';
export type { ChordCardProps } from './molecules/ChordCard';

export { RootSelector } from './molecules/RootSelector';
export type { RootSelectorProps } from './molecules/RootSelector';

export { HelpTooltip } from './molecules/HelpTooltip';
export type {
  HelpTooltipProps,
  TooltipPosition,
  HelpTooltipVariant,
} from './molecules/HelpTooltip';

export { HelpModal, type HelpTopic, type HelpRelatedTopic } from './molecules/HelpModal';

// Organisms
export { Fretboard } from './organisms/Fretboard';
export type { FretboardProps } from './organisms/Fretboard';

export { ChordDiagram } from './organisms/ChordDiagram';
export type { ChordDiagramProps, ChordFingerPosition } from './organisms/ChordDiagram';

export { ChordLibrary } from './organisms/ChordLibrary';
export type { ChordLibraryProps } from './organisms/ChordLibrary';
