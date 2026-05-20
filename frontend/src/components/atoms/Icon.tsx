import { LucideIcon, icons } from 'lucide-react';
interface IconProps {
  name: keyof typeof icons; // Icon name from lucide-react
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 24, color = 'currentColor', className = '', strokeWidth = 2 }: IconProps) {
  const LucideIconComponent = icons[name] as LucideIcon;
  
  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIconComponent
      size={size}
      color={color}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
}
