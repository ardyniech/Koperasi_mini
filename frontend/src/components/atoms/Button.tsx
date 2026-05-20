import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'silhouette' | 'glass-gold';
  size?: string;
  fullWidth?: boolean;
  loading?: boolean;
  floating?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  children,
  icon,
  variant = 'silhouette',
  className = '',
  fullWidth = false,
  loading = false,
  disabled,
  floating = false,
  ...props
}) => {
  const baseClasses = `relative group flex items-center justify-center gap-2.5 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ease-out overflow-hidden active:scale-95 border-2 text-center whitespace-nowrap text-base ${floating ? 'animate-float' : 'translate-y-0 hover:scale-[1.02] hover:shadow-lg'}`;

  const variantClasses = variant === 'glass-gold'
    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white border-amber-400/60 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.9)] hover:border-yellow-300/80'
    : 'bg-white/80 backdrop-blur-xl text-slate-700 border-slate-300/50 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.15)] hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-600 hover:to-blue-500 hover:text-white hover:border-blue-300/60 hover:shadow-[0_20px_40px_-15px_rgba(0,122,255,0.7)]';

  const widthClass = fullWidth ? 'w-full' : '';
  const displayText = label || children;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Glare effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      {loading && <LoadingSpinner size={18} color="text-current" className="mr-2" />}
      {icon && !loading && <span className="relative z-10 transition-transform group-hover:rotate-12 group-hover:scale-110">{icon}</span>}
      <span className="relative z-10 tracking-wide">{displayText}</span>
    </button>
  );
};

export default Button;
