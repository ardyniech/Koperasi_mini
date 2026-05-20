import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Wallet, 
  Settings, Heart, X, User 
} from 'lucide-react';
import { playWhooshSound } from '../../utils/sound';

interface NavPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function NavPopup({ isOpen, onClose, userRole = 'member' }: NavPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSaldoPopup, setShowSaldoPopup] = useState(false);

  const handleNavigate = (path: string) => {
    playWhooshSound();
    onClose();
    navigate(path);
  };

  const navItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dasbor', 
      show: userRole === 'admin' ? false : true // Hide Dasbor for admin (post-login default)
    },
    { path: '/anggota', icon: Users, label: 'Anggota', show: true },
    { path: '/pinjaman/approval', icon: FileText, label: 'Pinjaman Aktif', show: true },
    { path: '/simpanan/input', icon: Wallet, label: 'Simpanan', show: true },
    { 
      path: '#saldo', 
      icon: Wallet, 
      label: 'Saldo', 
      show: true,
      onClick: () => {
        setShowSaldoPopup(true);
        onClose();
      }
    },
    { path: '/project', icon: Heart, label: 'Dana Patungan', show: true },
    { path: '/settings', icon: Settings, label: 'Settings', show: true },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="glass-card w-11/12 max-w-sm rounded-3xl p-6 float-animation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Navigasi</h3>
              <p className="text-xs text-slate-500">Koperasi Mini</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 mb-6">
          {navItems.filter(item => item.show).map((item) => (
            <button
              key={item.path}
              onClick={() => item.onClick ? item.onClick() : handleNavigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg
                ${location.pathname === item.path 
                  ? 'bg-indigo-50/90 text-indigo-600 backdrop-blur-sm' 
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
            >
              <span className={`p-2 rounded-xl ${location.pathname === item.path ? 'bg-indigo-100/80' : 'bg-slate-100/80'}`}>
                <item.icon className="w-5 h-5" />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={() => handleNavigate('/about')}
            className="w-full text-left px-4 py-3 rounded-2xl font-medium text-sm text-slate-600 hover:bg-white/70 hover:text-indigo-600 transition flex items-center space-x-3"
          >
            <span className="bg-slate-100/80 p-2 rounded-xl"><User className="w-5 h-5" /></span>
            <span>Profil Saya</span>
          </button>
          <button 
            onClick={() => handleNavigate('/settings/theme')}
            className="w-full text-left px-4 py-3 rounded-2xl font-medium text-sm text-slate-600 hover:bg-white/70 hover:text-indigo-600 transition flex items-center space-x-3"
          >
            <span className="bg-slate-100/80 p-2 rounded-xl"><Settings className="w-5 h-5" /></span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Saldo Popup (simplified, actual SaldoLayout will be opened) */}
      {showSaldoPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Saldo Anda</h3>
            <p className="text-slate-600 mb-4">Silakan cek saldo melalui menu Saldo di dasbor.</p>
            <button 
              onClick={() => setShowSaldoPopup(false)}
              className="w-full py-2 bg-indigo-600 text-white rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
