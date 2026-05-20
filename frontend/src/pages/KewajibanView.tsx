import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import PinjamanAktifList from '../features/PinjamanAktifList';
import AngsuranBelumBayarList from '../features/AngsuranBelumBayarList';

interface Pinjaman {
  id: number;
  nominal: number;
  status: string;
}

interface Angsuran {
  id: number;
  bulan_ke: number;
  nominal_angsuran: number;
  tanggal_jatuh_tempo: string;
  status: string;
}

function KewajibanView() {
  const [pinjaman, setPinjaman] = useState<Pinjaman[]>([]);
  const [angsuran, setAngsuran] = useState<Angsuran[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pinjamanRes = await api.get('/pinjaman/me');
        setPinjaman(pinjamanRes.data.pinjaman || []);

        const angsuranRes = await api.get('/angsuran/me');
        setAngsuran(angsuranRes.data.angsuran || []);
      } catch {
        setError('Gagal memuat data kewajiban');
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout
      title="Kewajiban Saya"

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
          <PinjamanAktifList pinjaman={pinjaman} />
        </div>
        
        <div className="glass-card rounded-3xl p-3 shadow-sm">
          <AngsuranBelumBayarList angsuran={angsuran} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default KewajibanView;
