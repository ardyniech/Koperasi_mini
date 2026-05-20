import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavItem({ icon: Icon, label, path, active = false, onClick }: NavItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200
        ${active 
          ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
          : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 hover:shadow-lg'
        }`}
    >
      <span className={`p-2 rounded-xl ${active ? 'bg-indigo-100' : 'bg-slate-100/80'}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span>{label}</span>
    </button>
  );
}
