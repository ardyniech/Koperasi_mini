import { useNavigate } from 'react-router-dom';
import StatCard from '../molecules/StatCard';

interface OperationalHealthProps {
  anggotaBaru: number;
  simpananSukarela: number;
  pendingApprovals: number;
  onNavigate: (path: string) => void;
  onSaldoOpen: () => void;
}

export default function OperationalHealth({ 
  anggotaBaru, 
  simpananSukarela, 
  pendingApprovals, 
  onNavigate,
  onSaldoOpen 
}: OperationalHealthProps) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
        Operational Health
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <StatCard 
          title="Anggota Baru (Mei 2026)" 
          value={anggotaBaru.toLocaleString('id-ID')} 
          variant="emerald" 
          onClick={() => onNavigate('/anggota')} 
        />
        <StatCard 
          title="Simpanan Sukarela (Liquidity)" 
          value={`Rp ${simpananSukarela.toLocaleString('id-ID')}`} 
          variant="emerald" 
          onClick={onSaldoOpen} 
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingApprovals.toLocaleString('id-ID')} 
          variant="amber" 
          onClick={() => onNavigate('/pinjaman/approval')} 
        />
      </div>
    </div>
  );
}
