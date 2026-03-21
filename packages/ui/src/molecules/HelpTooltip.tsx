/**
 * HelpTooltip - Tooltip enrichi pour aide rapide
 *
 * Affiche une info-bulle avec contenu d'aide
 * Positionnement intelligent (top, bottom, left, right)
 */

import { useState, useRef, useEffect, type ReactNode, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@adagio/ui';

const tooltipVariants = cva(
  'absolute z-50 rounded-xl border-2 px-3 py-2 text-sm shadow-guitar pointer-events-none transition-opacity duration-200',
  {
    variants: {
      variant: {
        default: 'border-steel bg-blackness text-gray',
        accent: 'border-blood bg-toxic text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type HelpTooltipVariant = VariantProps<typeof tooltipVariants>['variant'];

export interface HelpTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Contenu de la tooltip */
  content: ReactNode;
  /** Position de la tooltip */
  position?: TooltipPosition;
  /** Variante de style */
  variant?: HelpTooltipVariant;
  /** Délai d'apparition en ms */
  delay?: number;
  /** Enfant qui déclenche la tooltip */
  children: ReactNode;
  /** Label accessible décrivant le contenu de la tooltip */
  ariaLabel?: string;
}

export function HelpTooltip({
  content,
  position = 'top',
  variant = 'default',
  delay = 300,
  children,
  className,
  ariaLabel,
  ...props
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for tooltip ARIA linkage
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 9)}`);

  // Position styles
  const positionStyles: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow styles
  const arrowStyles: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent',
  };

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show immediately on focus (no delay)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    hideTooltip();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Escape to close tooltip
    if (e.key === 'Escape' && isVisible) {
      e.preventDefault();
      hideTooltip();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <span
        className="inline-flex"
        tabIndex={0}
        aria-label={ariaLabel || 'Afficher l\'aide'}
        aria-describedby={isVisible ? tooltipId.current : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          className={cn(tooltipVariants({ variant }), positionStyles[position], className)}
          role="tooltip"
          {...props}
        >
          {content}
          {/* Arrow */}
          <div
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowStyles[position],
              variant === 'accent'
                ? 'border-blood'
                : 'border-steel'
            )}
          />
        </div>
      )}
    </div>
  );
}
