import { Menu, ArrowLeft } from 'lucide-react';

interface BannerProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  userName?: string;
  onUserClick?: () => void;
}

export default function Banner({
  title = "Dashboard",
  showBackButton = false,
  onBack,
  onMenuClick,
  userName = 'User',
  onUserClick,
}: BannerProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/75 backdrop-blur-md border-b border-slate-200 h-12 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {showBackButton && onBack ? (
          <button
            onClick={onBack}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      {!showBackButton && onUserClick && (
        <button
          onClick={onUserClick}
          className="flex items-center space-x-2 hover:bg-slate-100 rounded-xl p-1.5 transition"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white shadow-sm flex items-center justify-center text-emerald-800 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{userName}</p>
            </div>
        </button>
      )}
    </header>
  );
}
