import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import SaldoCard from '../features/SaldoCard';
import SimpananList from '../features/SimpananList';

interface Simpanan {
  id: number;
  jenis: string;
  nominal: number;
  created_at: string;
  saldo_setelah: number;
}

function SaldoView() {
  const [simpanan, setSimpanan] = useState<Simpanan[]>([]);
  const [totalSaldo, setTotalSaldo] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const response = await api.get('/simpanan/me');
        setSimpanan(response.data.simpanan || []);
        if (response.data.simpanan && response.data.simpanan.length > 0) {
          const latest = response.data.simpanan[0];
          setTotalSaldo(latest.saldo_setelah || 0);
        }
      } catch {
        setError('Gagal memuat data saldo');
      }
    };
    fetchSaldo();
  }, []);

  return (
    <DashboardLayout
      title="Saldo Saya"

      showBackButton={true}
      onBack={() => navigate('/dashboard')}
    >
      <div className="p-2 space-y-2">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="glass-card rounded-3xl p-3 shadow-sm hover:scale-[1.02] transition-transform duration-200">
          <SaldoCard totalSaldo={totalSaldo} />
        </div>
        
        <div className="glass-card rounded-3xl p-3 shadow-sm">
          <SimpananList simpanan={simpanan} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SaldoView;
