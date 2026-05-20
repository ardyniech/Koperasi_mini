import { useNavigate } from 'react-router-dom';
import StatCard from '../molecules/StatCard';

interface ExecutiveSummaryProps {
  kasSimpanan: number;
  totalAnggota: number;
  shuTahunan: number;
  pinjamanAktif: number;
  angsuranBelumBayar: number;
  nplPercentage: number;
  onNavigate: (path: string) => void;
  onShuClick: () => void;
}

export default function ExecutiveSummary({ 
  kasSimpanan, 
  totalAnggota, 
  shuTahunan, 
  pinjamanAktif, 
  angsuranBelumBayar,
  nplPercentage,
  onNavigate,
  onShuClick 
}: ExecutiveSummaryProps) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
        Executive Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="glass-card p-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl"></div>
          <p className="text-emerald-700 text-xs font-medium mb-1 relative z-10">Total Simpanan Anggota</p>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2 relative z-10 text-slate-800">
            <span className="text-lg align-top mr-1">Rp</span>
            {kasSimpanan.toLocaleString('id-ID')}
          </h2>
          <p className="text-[10px] text-slate-500 relative z-10">Total Simpanan Anggota (Wajib + Sukarela)</p>
        </div>
        <StatCard 
          title="Total Anggota Aktif" 
          value={totalAnggota.toLocaleString('id-ID')} 
          subtitle="+12% MoM" 
          variant="emerald" 
          onClick={() => onNavigate('/anggota')} 
        />
        <StatCard 
          title="SHU Proyeksi 2026" 
          value={`Rp ${shuTahunan.toLocaleString('id-ID')}`} 
          subtitle="0.0006% dari Aset" 
          variant="gold" 
          onClick={onShuClick} 
        />
        <StatCard 
          title="Pinjaman Outstanding" 
          value={`Rp ${pinjamanAktif.toLocaleString('id-ID')}`} 
          subtitle={`Sisa pembayaran: Rp ${angsuranBelumBayar.toLocaleString('id-ID')} | ${nplPercentage.toFixed(2)}% NPL`} 
          variant="amber" 
          onClick={() => onNavigate('/pinjaman')} 
        />
      </div>
    </div>
  );
}
