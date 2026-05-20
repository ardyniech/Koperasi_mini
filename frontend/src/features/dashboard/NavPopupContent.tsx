import { LayoutDashboard, Users, ArrowUpFromLine, ArrowDownToLine, Wallet, FileText, X } from 'lucide-react';

interface NavPopupProps {
  onClose: () => void;
  navigate: (path: string) => void;
}

export default function NavPopupContent({ onClose, navigate }: NavPopupProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="glass-card w-11/12 max-w-sm rounded-3xl p-6 morph-from-source"
        style={{ '--morph-origin': 'top left' } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
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

        <nav className="space-y-2 mb-6">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/anggota'); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
            <span className="bg-slate-100/80 p-2 rounded-xl"><Users className="w-5 h-5" /></span> 
            <span>Management Anggota</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pinjaman/approval'); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
            <span className="bg-amber-100/80 p-2 rounded-xl"><ArrowUpFromLine className="w-5 h-5 text-amber-600" /></span> 
            <span>Management Pinjaman</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/simpanan/input'); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
            <span className="bg-emerald-100/80 p-2 rounded-xl"><ArrowDownToLine className="w-5 h-5 text-emerald-600" /></span> 
            <span>Simpanan</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/project'); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
            <span className="bg-violet-100/80 p-2 rounded-xl"><Wallet className="w-5 h-5 text-violet-600" /></span> 
            <span>Dana Patungan</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/riwayat'); }} className="flex items-center space-x-3 text-slate-600 hover:bg-white/70 hover:text-slate-900 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg">
            <span className="bg-slate-100/80 p-2 rounded-xl"><FileText className="w-5 h-5" /></span> 
            <span>Riwayat</span>
          </a>
        </nav>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{userName}</p>
            </div>
          </div>
          <div className="px-4 pb-2 flex flex-col space-y-1">
            <button onClick={() => navigate('/about')} className="text-left text-sm text-slate-600 hover:text-indigo-600 transition">Profil Saya</button>
            <button onClick={() => navigate('/settings')} className="text-left text-sm text-slate-600 hover:text-indigo-600 transition">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
