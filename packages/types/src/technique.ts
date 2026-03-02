// ============================================================================
// TECHNIQUE TYPES - Guitar techniques and learning system
// ============================================================================

/**
 * Technique categories
 */
export type TechniqueCategory =
  | 'legato'
  | 'sweep'
  | 'tapping'
  | 'bends'
  | 'sliding'
  | 'hybrid'
  | 'rhythm'
  | 'harmonics'
  | 'fingerstyle'
  | 'vibrato'
  | 'alternate-picking'
  | 'economy-picking';

/**
 * Difficulty levels
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Technique entity
 */
export interface Technique {
  id: string;
  slug: string;
  name: string;
  category: TechniqueCategory;
  difficulty: Difficulty;
  description: string;

  // Visual aids
  diagramUrl: string;
  videoUrl?: string;
  audioExample?: string;

  // Notation
  notation: string; // Tablature or standard notation
  tips: string[];

  // Prerequisites
  prerequisites: string[]; // Technique IDs
  relatedTechniques: string[]; // Technique IDs
  estimatedPracticeTime: number; // in hours

  // Progression milestones
  milestones: Milestone[];

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Learning milestone
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  bpm?: number;
  duration?: number; // in seconds
  criteria: string;
}

/**
 * Practice session result
 */
export interface PracticeResult {
  techniqueId: string;
  duration: number; // in minutes
  bpm: number;
  milestonesCompleted?: string[];
  quality: 'needs-work' | 'good' | 'excellent';
}

/**
 * Practice settings
 */
export interface PracticeSettings {
  metronomeEnabled: boolean;
  loopPlayback: boolean;
  slowdownFactor: number; // 0.5 = half speed
  showFretboard: boolean;
  startBpm: number;
  targetBpm: number;
}

/**
 * Recommendation engine output
 */
export interface Recommendation {
  technique: Technique;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // in hours
}

/**
 * Technique filter options
 */
export interface TechniqueFilter {
  category?: TechniqueCategory[];
  difficulty?: Difficulty[];
  search?: string;
  status?: ProgressStatus;
}

export type ProgressStatus =
  | 'locked'
  | 'in-progress'
  | 'learned'
  | 'mastered';
