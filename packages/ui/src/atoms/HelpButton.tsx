/**
 * HelpButton - Bouton d'aide réutilisable
 *
 * Bouton '?' stylisé avec animations au hover
 * Charte Adagio : surface noire, filet steelwarm, accent ambre
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@adagio/ui';

const helpButtonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-abyss disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
      variant: {
        default:
          'bg-surface border border-steelwarm text-white hover:border-amber-400 hover:text-amber-400',
        subtle: 'bg-surface border border-steelwarm text-gray hover:border-amber-400 hover:text-amber-400',
        accent: 'bg-amber-400/20 border border-amber-400 text-amber-400 hover:bg-amber-400/30',
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
          <span aria-hidden="true" className="leading-none">
            ?
          </span>
        )}
      </button>
    );
  }
);

HelpButton.displayName = 'HelpButton';
