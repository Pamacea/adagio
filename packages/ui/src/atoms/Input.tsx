/**
 * Input - Musical & Elegant Input Component
 *
 * Clean inputs with subtle musical theming in focus states
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, id, type = 'text', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-xl border border-neutral-700 bg-neutral-900/50 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500',
            // Focus states
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            // Error states
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className
          )}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'text-xs',
              error ? 'text-error-400' : 'text-neutral-500'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
