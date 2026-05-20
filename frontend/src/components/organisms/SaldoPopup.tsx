import { Wallet, X } from 'lucide-react';

interface SaldoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaldoPopup({ isOpen, onClose }: SaldoPopupProps) {
  if (!isOpen) return null;

  // TODO: Replace hardcoded values with actual props/data
  const saldoItems = [
    { label: 'Simpanan Pokok', amount: 'Rp 1,000,000' },
    { label: 'Simpanan Wajib', amount: 'Rp 500,000' },
    { label: 'Simpanan Sukarela', amount: 'Rp 2,000,000' },
    { label: 'Tabungan', amount: 'Rp 5,000,000' },
    { label: 'Dana Patungan', amount: 'Rp 3,000,000' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="glass-card w-11/12 max-w-sm rounded-3xl p-6 float-animation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Detail Saldo</h3>
              <p className="text-xs text-slate-500">Jenis Simpanan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          {saldoItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-white/50 rounded-2xl">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className="text-sm font-bold text-emerald-600">{item.amount}</span>
            </div>
          ))}
        </div>

        {/* Footer Total */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center px-3 py-2">
            <span className="text-sm font-bold text-slate-800">Total Saldo</span>
            <span className="text-lg font-bold text-emerald-600">Rp 11,500,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
