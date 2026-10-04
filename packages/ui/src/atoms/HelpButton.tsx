/**
 * HelpButton - Bouton d'aide réutilisable
 *
 * Bouton '?' stylisé avec animations au hover
 * Design System Metal: abyss, blood, toxic, steel
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@adagio/ui';

const helpButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-abyss disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
      variant: {
        default:
          'bg-steel border-2 border-blood text-white hover:bg-blood hover:border-toxic hover:shadow-glow',
        subtle: 'bg-blackness border border-steel text-gray hover:border-toxic hover:text-toxic',
        accent: 'bg-toxic border-2 border-blood text-white hover:bg-blood hover:shadow-glow',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export type HelpButtonSize = VariantProps<typeof helpButtonVariants>['size'];
export type HelpButtonVariant = VariantProps<typeof helpButtonVariants>['variant'];

export interface HelpButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label'
> {
  size?: HelpButtonSize;
  variant?: HelpButtonVariant;
  /** Topic ID for help content lookup */
  topic?: string;
  /** Custom accessible label. Defaults to "Aide" or "Aide : {topic}" if topic is provided */
  ariaLabel?: string;
  /** ID of an element that describes this button */
  ariaDescribedBy?: string;
}

export const HelpButton = forwardRef<HTMLButtonElement, HelpButtonProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      topic,
      ariaLabel,
      ariaDescribedBy,
      children,
      ...props
    },
    ref
  ) => {
    // Generate accessible label based on topic or custom ariaLabel
    const ariaLabelValue = ariaLabel ?? (topic ? `Aide : ${topic}` : 'Aide');

    // Keyboard handler for explicit Enter/Space activation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!props.disabled) {
          e.preventDefault();
          e.currentTarget.click();
        }
      }
      props.onKeyDown?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={0}
        className={cn(helpButtonVariants({ size, variant }), className)}
        aria-label={ariaLabelValue}
        aria-describedby={ariaDescribedBy}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children || (
          <svg
            className="h-[0.6em] w-[0.6em]"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    );
  }
);

HelpButton.displayName = 'HelpButton';
