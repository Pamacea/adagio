import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@adagio/ui/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-interval-third to-interval-fifth text-white hover:opacity-90 shadow-lg shadow-interval-third/20',
        secondary: 'bg-midnight-800 text-midnight-100 hover:bg-midnight-700 border border-midnight-600',
        ghost: 'bg-transparent hover:bg-midnight-800 text-midnight-300 hover:text-midnight-100',
        outline: 'bg-transparent border border-midnight-600 hover:bg-midnight-800 hover:border-midnight-500 text-midnight-300 hover:text-midnight-100',
        danger: 'bg-gradient-to-r from-interval-root to-interval-altered text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
