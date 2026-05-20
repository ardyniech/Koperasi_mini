import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'emerald';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  style,
}) => {
  // Base classes
  const baseClasses = 'rounded-[24px] transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) relative overflow-hidden';
  
  // Padding classes
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Variant classes - Kode Rahasia v2.0
  const variantClasses = {
    default: 'bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
    glass: 'bg-white/80 backdrop-blur-[20px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
    elevated: 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
    // 🛡️ EMERALD v2.0 - Kode Rahasia
    emerald: 'bg-gradient-to-br from-emerald-600/90 to-emerald-800 text-white shadow-[0_30px_70px_-15px_rgba(4,120,87,0.4)] border border-white/20 hover:scale-[1.01] hover:shadow-[0_40px_80px_-10px_rgba(4,120,87,0.6)]',
  };
  
  const hoverClasses = onClick ? 'cursor-pointer hover:-translate-y-1' : '';
  
  const combinedClassName = `${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <div
      className={combinedClassName}
      style={style}
      onClick={onClick}
    >
      {/* 🎨 Pattern Islami - Blur 3xl (only for emerald variant) */}
      {variant === 'emerald' && (
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-300 rounded-full blur-3xl opacity-20 mix-blend-soft-light pointer-events-none" />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
