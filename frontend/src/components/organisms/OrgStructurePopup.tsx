import React from 'react';
import { X } from 'lucide-react';

interface OrgStructurePopupProps {
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
}

const OrgStructurePopup: React.FC<OrgStructurePopupProps> = ({ showPopup, setShowPopup }) => {
  if (!showPopup) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={() => setShowPopup(false)}
    >
      <div 
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-float"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Struktur Organisasi</h2>
        <div className="space-y-3 text-left">
          <div className="bg-emerald-50 rounded-xl p-3">
            <h3 className="font-semibold text-emerald-800 text-sm">Ketua</h3>
            <p className="text-xs text-gray-600 mt-1">Memimpin dan mengambil keputusan strategis koperasi</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <h3 className="font-semibold text-blue-800 text-sm">Sekretaris</h3>
            <p className="text-xs text-gray-600 mt-1">Mengurus administrasi, dokumentasi, dan korespondensi</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <h3 className="font-semibold text-amber-800 text-sm">Bendahara</h3>
            <p className="text-xs text-gray-600 mt-1">Mengelola keuangan, kas, dan laporan keuangan</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-3">
            <h3 className="font-semibold text-pink-800 text-sm">Admin Sistem</h3>
            <p className="text-xs text-gray-600 mt-1">Mengelola data anggota, transaksi, dan teknologi</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <h3 className="font-semibold text-purple-800 text-sm">Anggota</h3>
            <p className="text-xs text-gray-600 mt-1">Simpan pinjam, pantau saldo, dan SHU</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">Koperasi Mini Syariah - Transparan & Berkah</p>
      </div>
    </div>
  );
};

export default OrgStructurePopup;
