import { useEffect, useRef } from 'react';

interface ShuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  shuTahunan: number;
  totalAset: number;
}

export default function ShuPopup({ isOpen, onClose, shuTahunan, totalAset }: ShuPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        ref={popupRef}
        className="glass-card rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">SHU Proyeksi 2026</h2>
            <p className="text-[10px] text-slate-500 mt-1">Sisa Hasil Usaha (Syariah)</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-center py-6 border-y border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Estimasi SHU Tahunan</p>
          <h1 className="text-4xl font-extrabold text-emerald-600 mb-2">
            <span className="text-2xl align-top mr-1">Rp</span>
            {shuTahunan.toLocaleString('id-ID')}
          </h1>
          <div className="inline-flex items-center gap-1 bg-emerald-50 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-medium text-emerald-700">0.0006% dari Total Aset</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Total Aset Koperasi</span>
            <span className="font-semibold text-slate-700">Rp {totalAset.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-3">
            <p className="text-[10px] text-amber-800 leading-relaxed">
              <span className="font-bold">📊 Formula:</span> Total Aset × 0,0006% (Rp {totalAset.toLocaleString('id-ID')} × 0,000006)
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3">
            <p className="text-[10px] text-blue-800 leading-relaxed">
              <span className="font-bold">💡 Catatan:</span> SHU akan dibagikan kepada anggota sesuai porsi simpanan masing-masing berdasarkan prinsip Syariah (Non-ribawi).
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
