/**
 * ADAGIO - Metal Card Components
 * Cartes avec design brutal pour contenu
 */

interface MetalCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blood' | 'toxic';
  hover?: boolean;
}

export function MetalCard({
  children,
  className = '',
  variant = 'default',
  hover = false,
}: MetalCardProps) {
  const variantClasses = {
    default: 'border-steel',
    blood: 'border-blood',
    toxic: 'border-toxic',
  };

  const hoverClass = hover ? 'hover:border-blood hover:bg-void transition-all cursor-pointer' : '';

  return (
    <div className={`section-frame ${variantClasses[variant]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card with header
 */
interface MetalCardWithHeaderProps extends MetalCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function MetalCardWithHeader({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
  variant = 'default',
}: MetalCardWithHeaderProps) {
  return (
    <MetalCard className={className} variant={variant}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-steel">
        <div className="flex items-center gap-3">
          {icon && <div className="icon-box">{icon}</div>}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </MetalCard>
  );
}

/**
 * Grid of cards
 */
interface MetalCardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetalCardGrid({
  children,
  cols = 3,
  className = '',
}: MetalCardGridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClasses[cols]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Compact card for lists
 */
interface CompactCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: 'white' | 'blood' | 'rust' | 'gray';
}

export function CompactCard({
  title,
  value,
  unit,
  color = 'white',
}: CompactCardProps) {
  const colorClasses = {
    white: 'text-white',
    blood: 'text-blood',
    rust: 'text-rust',
    gray: 'text-gray',
  };

  return (
    <div className="border-2 border-steel bg-blackness p-3">
      <p className="text-xs text-gray uppercase tracking-wider mb-1">{title}</p>
      <p className={`text-xl font-metal ${colorClasses[color]}`}>
        {value}
        {unit && <span className="text-sm text-gray ml-1">{unit}</span>}
      </p>
    </div>
  );
}

/**
 * Stat card with icon
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="border-2 border-steel bg-blackness p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-metal text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-toxic' : 'text-blood'}`}>
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && <div className="icon-box">{icon}</div>}
      </div>
    </div>
  );
}
