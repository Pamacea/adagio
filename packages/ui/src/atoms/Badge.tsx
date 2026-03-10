/**
 * Badge - Musical Mode & Degree Indicator
 *
 * Used for:
 * - Greek mode indicators (ionian, dorian, etc.)
 * - Scale degrees (I, ii, iii, etc.)
 * - Status indicators
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        // Mode variants - Greek mode colors
        ionian: 'bg-mode-ionian/20 text-mode-ionian border border-mode-ionian/30',
        dorian: 'bg-mode-dorian/20 text-mode-dorian border border-mode-dorian/30',
        phrygian: 'bg-mode-phrygian/20 text-mode-phrygian border border-mode-phrygian/30',
        lydian: 'bg-mode-lydian/20 text-mode-lydian border border-mode-lydian/30',
        mixolydian: 'bg-mode-mixolydian/20 text-mode-mixolydian border border-mode-mixolydian/30',
        aeolian: 'bg-mode-aeolian/20 text-mode-aeolian border border-mode-aeolian/30',
        locrian: 'bg-mode-locrian/20 text-mode-locrian border border-mode-locrian/30',

        // Degree variants - Scale degree colors
        'degree-I': 'bg-degree-I/20 text-degree-I border border-degree-I/30',
        'degree-ii': 'bg-degree-ii/20 text-degree-ii border border-degree-ii/30',
        'degree-iii': 'bg-degree-iii/20 text-degree-iii border border-degree-iii/30',
        'degree-IV': 'bg-degree-IV/20 text-degree-IV border border-degree-IV/30',
        'degree-V': 'bg-degree-V/20 text-degree-V border border-degree-V/30',
        'degree-vi': 'bg-degree-vi/20 text-degree-vi border border-degree-vi/30',
        'degree-vii': 'bg-degree-vii/20 text-degree-vii border border-degree-vii/30',

        // Semantic variants
        primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
        accent: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
        success: 'bg-success-500/20 text-success-400 border border-success-500/30',
        warning: 'bg-warning-500/20 text-warning-400 border border-warning-500/30',
        error: 'bg-error-500/20 text-error-400 border border-error-500/30',

        // Neutral variants
        neutral: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
        ghost: 'bg-transparent text-neutral-400',
        outline: 'bg-transparent border border-neutral-600 text-neutral-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
