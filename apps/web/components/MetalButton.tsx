/**
 * ADAGIO - Boutons Polygonaux Metal
 * Boutons fins (2px) avec design brutal
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface MetalButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'blood' | 'ghost' | 'outline';
  shape?: 'left' | 'right' | 'both' | 'shard' | 'none';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<IconProps>;
  iconPosition?: 'left' | 'right';
  href?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

const shapeClasses = {
  left: 'poly-left',
  right: 'poly-right',
  both: 'poly-both',
  shard: 'poly-shard',
  none: '',
};

export const MetalButton = forwardRef<HTMLButtonElement, MetalButtonProps>(
  (
    {
      children,
      variant = 'primary',
      shape = 'left',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn-poly inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-blackness border-steel hover:bg-toxic hover:border-blood hover:-translate-x-px hover:-translate-y-px',
      blood: 'btn-blood hover:-translate-x-px hover:-translate-y-px',
      ghost: 'bg-transparent border-transparent text-gray hover:text-white hover:bg-void',
      outline: 'bg-transparent border-steel text-white hover:bg-toxic hover:border-blood',
    };

    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${shapeClasses[shape]} ${className}`;

    const iconElement = Icon ? <Icon size="sm" /> : null;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled}
        {...props}
      >
        {Icon && iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

MetalButton.displayName = 'MetalButton';

/**
 * Link button styled as MetalButton
 */
import Link from 'next/link';

interface MetalLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'blood' | 'ghost' | 'outline';
  shape?: 'left' | 'right' | 'both' | 'shard' | 'none';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<IconProps>;
  iconPosition?: 'left' | 'right';
  className?: string;
  external?: boolean;
}

export function MetalLink({
  href,
  children,
  variant = 'primary',
  shape = 'left',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  external = false,
}: MetalLinkProps) {
  const baseClasses = 'btn-poly inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all';

  const variantClasses = {
    primary: 'bg-blackness border-steel hover:bg-toxic hover:border-blood hover:-translate-x-px hover:-translate-y-px',
    blood: 'btn-blood hover:-translate-x-px hover:-translate-y-px',
    ghost: 'bg-transparent border-transparent text-gray hover:text-white hover:bg-void',
    outline: 'bg-transparent border-steel text-white hover:bg-toxic hover:border-blood',
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${shapeClasses[shape]} ${className}`;

  const iconElement = Icon ? <Icon size="sm" /> : null;

  if (external) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {Icon && iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && iconElement}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClasses}>
      {Icon && iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && iconElement}
    </Link>
  );
}

/**
 * Button group for actions
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function ButtonGroup({ children, align = 'left', className = '' }: ButtonGroupProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex flex-wrap gap-2 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
}
