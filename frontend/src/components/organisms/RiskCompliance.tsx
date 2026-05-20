import { useNavigate } from 'react-router-dom';
import StatCard from '../molecules/StatCard';

interface RiskComplianceProps {
  overdueAngsuran: number;
  totalTransaksiAudit: number;
  onNavigate: (path: string) => void;
}

export default function RiskCompliance({ 
  overdueAngsuran, 
  totalTransaksiAudit, 
  onNavigate 
}: RiskComplianceProps) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
        Risk & Compliance
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <StatCard 
          title="Overdue Angsuran (>30 Hari)" 
          value={overdueAngsuran.toLocaleString('id-ID')} 
          variant="red" 
          onClick={() => onNavigate('/pinjaman/approval')} 
        />
        <StatCard 
          title="Transaksi Teraudit" 
          value={`${totalTransaksiAudit}%`} 
          variant="emerald" 
          onClick={() => onNavigate('/riwayat')} 
        />
      </div>
    </div>
  );
}
