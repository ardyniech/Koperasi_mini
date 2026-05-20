import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 20, 
  color = 'text-indigo-600', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={`animate-spin ${color} ${className}`} 
      size={size} 
    />
  );
}
