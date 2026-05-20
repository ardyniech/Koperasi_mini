import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SettingsTheme() {
const navigate = useNavigate();
return (
  <>
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Theme Settings</h1>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-slate-500">Theme customization akan segera hadir.</p>
          <p className="text-sm text-slate-400 mt-2">Pilih warna, font, dan efek glassmorphism.</p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Koperasi Mini Syariah. Built with ❤️ by Administrator.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Versi 1.0.0 - No Riba, No Denda
          </p>
        </div>
      </div>
    </div>
  </>
);
}
