import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Wallet, Settings, Heart, X } from 'lucide-react';

interface DashboardNavPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentPath?: string;
}

export default function DashboardNavPopup({ isOpen, onClose, userName, currentPath = '' }: DashboardNavPopupProps) {
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/anggota', icon: <Users className="w-5 h-5 text-emerald-600" />, label: 'Management Anggota' },
    { path: '/pinjaman/approval', icon: <FileText className="w-5 h-5 text-amber-600" />, label: 'Management Pinjaman' },
    { path: '/simpanan/input', icon: <Wallet className="w-5 h-5 text-emerald-600" />, label: 'Simpanan' },
    { path: '/project', icon: <Heart className="w-5 h-5 text-rose-600" />, label: 'Dana Patungan' },
    { path: '/settings', icon: <Settings className="w-5 h-5 text-slate-600" />, label: 'Settings' },
  ].filter(item => item.path !== currentPath);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="glass-card w-72 rounded-3xl p-6 float-animation morph-from-source"
        style={{ '--morph-origin': 'top left' } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-100">
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
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

        {/* Navigation Items - PRD Section 0.C */}
        <nav className="space-y-2 mb-6">
          {navItems.map(item => (
            <NavItem 
              key={item.path}
              icon={item.icon} 
              label={item.label} 
              onClick={() => { navigate(item.path); onClose(); }} 
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

function NavItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
      <span className="bg-slate-100/80 p-2 rounded-xl">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
