import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-midnight-500',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-95',
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          // Variants
          {
            'bg-gradient-to-r from-interval-third to-interval-fifth text-white hover:opacity-90 shadow-lg shadow-interval-third/20':
              variant === 'primary',
            'bg-midnight-800 text-midnight-100 hover:bg-midnight-700 border border-midnight-600':
              variant === 'secondary',
            'bg-transparent hover:bg-midnight-800 text-midnight-300 hover:text-midnight-100':
              variant === 'ghost',
            'bg-transparent border border-midnight-600 hover:bg-midnight-800 hover:border-midnight-500 text-midnight-300 hover:text-midnight-100':
              variant === 'outline',
            'bg-gradient-to-r from-interval-root to-interval-altered text-white hover:opacity-90':
              variant === 'danger',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
