import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'emerald' | 'amber' | 'blue';
  onClick?: () => void;
}

const variantTextClasses = {
  default: 'text-slate-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  blue: 'text-blue-700',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, variant = 'default', onClick }) => {
  return (
    <div
      className={`glass-card p-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      {/* Decorative blur circle */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <p className={`text-xs font-medium mb-2 ${variantTextClasses[variant]}`}>{title}</p>
        <div className={`text-lg font-bold ${variantTextClasses[variant]}`}>
          {value}
        </div>
        {subtitle && (
          <p className={`text-xs mt-1 ${variant === 'default' ? 'text-slate-400' : 'text-emerald-600/80'}`}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
