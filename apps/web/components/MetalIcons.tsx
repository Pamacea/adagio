/**
 * ADAGIO - Custom SVG Icons - Metal Style
 * Icons SVG personnalisés pour le design brutal
 */

export interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  viewBox?: string;
  [key: string]: unknown;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const Icons = {
  // Navigation & Logo
  Logo: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.2"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),

  Menu: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'lg']} ${props.className || ''}`}
      {...props}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),

  Close: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  // Theory Icons
  Chords: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      {/* Guitar headstock shape */}
      <rect x="8" y="2" width="8" height="6" rx="1" />
      {/* Tuning pegs */}
      <circle cx="6" cy="4" r="1.5" fill="currentColor" />
      <circle cx="18" cy="4" r="1.5" fill="currentColor" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      {/* Fretboard */}
      <rect x="10" y="8" width="4" height="12" />
      {/* Frets */}
      <line x1="10" y1="11" x2="14" y2="11" />
      <line x1="10" y1="14" x2="14" y2="14" />
      <line x1="10" y1="17" x2="14" y2="17" />
      {/* Strings */}
      <line x1="11" y1="8" x2="11" y2="20" />
      <line x1="13" y1="8" x2="13" y2="20" />
      {/* Finger dots */}
      <circle cx="12" cy="12.5" r="1" fill="currentColor" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" />
    </svg>
  ),

  Modes: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="2" r="1.5" fill="currentColor" />
      <circle cx="22" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="22" r="1.5" fill="currentColor" />
      <circle cx="2" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),

  Scales: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <path d="M6 9v3M18 9v3M12 15v3" />
    </svg>
  ),

  Circle: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <text x="12" y="7" textAnchor="middle" fontSize="4" fill="currentColor">C</text>
      <text x="17" y="13" textAnchor="middle" fontSize="4" fill="currentColor">G</text>
      <text x="12" y="20" textAnchor="middle" fontSize="4" fill="currentColor">F</text>
      <text x="7" y="13" textAnchor="middle" fontSize="4" fill="currentColor">F#</text>
    </svg>
  ),

  Fretboard: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="14" x2="22" y2="14" />
      <line x1="2" y1="16" x2="22" y2="16" />
      <line x1="6" y1="6" x2="6" y2="18" />
      <line x1="10" y1="6" x2="10" y2="18" />
      <line x1="14" y1="6" x2="14" y2="18" />
      <line x1="18" y1="6" x2="18" y2="18" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="14" cy="12" r="1" fill="currentColor" />
    </svg>
  ),

  Notation: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M4 4h16" />
      <path d="M4 8h16" />
      <path d="M4 12h16" />
      <path d="M4 16h16" />
      <path d="M4 20h16" />
      <circle cx="8" cy="4" r="2" fill="currentColor" />
      <ellipse cx="12" cy="8" rx="2" ry="1.5" fill="currentColor" />
      <circle cx="16" cy="4" r="2" fill="currentColor" />
      <path d="M8 6v10M12 10v6M16 6v10" />
    </svg>
  ),

  Compose: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      <circle cx="19" cy="8" r="1.5" fill="currentColor" />
      <circle cx="19" cy="16" r="1.5" fill="currentColor" />
      <circle cx="12" cy="20" r="1.5" fill="currentColor" />
      <circle cx="5" cy="16" r="1.5" fill="currentColor" />
      <circle cx="5" cy="8" r="1.5" fill="currentColor" />
      <path d="M12 7v3M17 9l-2 2M17 15l-2-2M12 14v3M7 15l2-2M7 9l2 2" />
    </svg>
  ),

  // User & Session Icons
  Warning: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),

  Sessions: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" />
      <circle cx="18" cy="16" r="3" fill="currentColor" />
      <path d="M9 10l12-2" />
    </svg>
  ),

  User: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),

  Settings: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
    </svg>
  ),

  // Music specific
  Play: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),

  Pause: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),

  Stop: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  ),

  ArrowRight: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),

  ArrowLeft: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),

  Check: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),

  X: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  // Fretboard specific
  Tuning: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="18" y2="12" />
    </svg>
  ),

  // Emotion icons for modes
  Sun: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  ),

  Moon: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),

  Fire: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),

  Skull: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),

  // Social login icons
  GitHub: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),

  Discord: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[props.size || 'md']} ${props.className || ''}`}
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};
