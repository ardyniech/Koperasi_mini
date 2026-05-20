import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../features/DashboardLayout';
import Button from '../components/atoms/Button';
import DashboardNavPopup from '../features/DashboardNavPopup';
import SaldoPopup from '../features/SaldoPopup';
import DashboardTransactions from '../features/DashboardTransactions';
import ExecutiveSummary from '../features/ExecutiveSummary';
import OperationalHealth from '../features/OperationalHealth';
import RiskCompliance from '../features/RiskCompliance';
import ShuPopup from '../features/ShuPopup';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import api from '../api';

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  saldo?: number;
  total_anggota?: number;
  kas_simpanan?: number;
  pinjaman_aktif?: number;
  angsuran_belum_bayar?: number;
  shu_tahunan?: number;
  npl_percentage?: number;
  anggota_baru_bulan_ini?: number;
  simpanan_sukarela?: number;
  pending_approvals?: number;
  overdue_angsuran?: number;
  total_transaksi_audit?: number;
}

interface Transaction {
  nama: string;
  jenis: string;
  tanggal: string;
  jumlah: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transaksi, setTransaksi] = useState<Transaction[]>([]);
  const [navOpen, setNavOpen] = useState(false);
  const [showSaldoPopup, setShowSaldoPopup] = useState(false);
  const [showShuPopup, setShowShuPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data;
        setUser(userData);
        
        const dashEndpoint = userData.role === 'admin' ? '/anggota/admin/dashboard' : '/anggota/me/dashboard';
        const dashRes = await api.get(dashEndpoint);
        const dashData = dashRes.data;
        const isAdmin = userData.role === 'admin';
        
        setUser((prev: User | null) => {
          if (!prev) return null;
          return {
            ...prev,
            saldo: isAdmin ? dashData.total_saldo : (dashData.saldo || 0),
            total_anggota: isAdmin ? dashData.total_members : 0,
            kas_simpanan: isAdmin ? dashData.total_saldo : (dashData.saldo || 0),
            pinjaman_aktif: isAdmin ? dashData.total_pinjaman_aktif : (dashData.pinjaman_aktif || 0),
            angsuran_belum_bayar: isAdmin ? dashData.total_angsuran_belum_bayar : (dashData.angsuran_belum_bayar || 0),
            shu_tahunan: isAdmin ? dashData.shu_tahunan || 0 : 0,
            npl_percentage: isAdmin ? dashData.npl_percentage || 0 : 0,
            anggota_baru_bulan_ini: isAdmin ? dashData.anggota_baru_bulan_ini || 0 : 0,
            simpanan_sukarela: isAdmin ? dashData.simpanan_sukarela || 0 : 0,
            pending_approvals: isAdmin ? dashData.pending_approvals || 0 : 0,
            overdue_angsuran: isAdmin ? dashData.overdue_angsuran || 0 : 0,
            total_transaksi_audit: isAdmin ? dashData.total_transaksi_audit || 100 : 0,
          };
        });
        
        try {
          const txRes = await api.get('/simpanan/');
          const txData = Array.isArray(txRes.data) ? txRes.data : [];
          const recentTx = txData.slice(0, 5).map((tx: any) => ({
            nama: tx.anggota_nama || 'Anggota',
            jenis: tx.jenis || 'Simpanan',
            tanggal: new Date(tx.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            jumlah: tx.nominal || 0,
          }));
          setTransaksi(recentTx);
        } catch (txErr) {
          console.error('[Dashboard] Failed to load transactions:', txErr);
        }
        
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timeout. Periksa koneksi backend.');
        } else {
          setError('Failed to load data. Silakan login ulang.');
          localStorage.removeItem('token');
        }
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSaldoOpen = () => { setShowSaldoPopup(true); };
  const handleShuOpen = () => { setShowShuPopup(true); };
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  if (loading) return <DashboardLayout title="Dashboard"><div className="flex justify-center items-center p-10"><LoadingSpinner size={32} /> <span className="ml-2 text-gray-500">Memuat...</span></div></DashboardLayout>;
  if (error) return <DashboardLayout title="Dashboard"><div className="text-center p-10 text-red-500">{error}</div></DashboardLayout>;
  if (!user) return <DashboardLayout title="Dashboard"><div className="text-center p-10 text-red-500">User not found</div></DashboardLayout>;

  const isAdmin = user.role === 'admin';

  return (
    <>
      <DashboardNavPopup isOpen={navOpen} onClose={() => setNavOpen(false)} userName={user.nama} currentPath={location.pathname} />
      <SaldoPopup isOpen={showSaldoPopup} onClose={() => setShowSaldoPopup(false)} />
      <ShuPopup 
        isOpen={showShuPopup} 
        onClose={() => setShowShuPopup(false)} 
        shuTahunan={user.shu_tahunan || 0}
        totalAset={user.kas_simpanan || 0}
      />

      <DashboardLayout title="Dashboard">
        <div className="p-2 space-y-4">
          {isAdmin && (
            <>
              <ExecutiveSummary 
                kasSimpanan={user.kas_simpanan || 0}
                totalAnggota={user.total_anggota || 0}
                shuTahunan={user.shu_tahunan || 0}
                pinjamanAktif={user.pinjaman_aktif || 0}
                angsuranBelumBayar={user.angsuran_belum_bayar || 0}
                nplPercentage={user.npl_percentage || 0}
                onNavigate={(path) => navigate(path)}
                onShuClick={handleShuOpen}
              />
              <OperationalHealth 
                anggotaBaru={user.anggota_baru_bulan_ini || 0}
                simpananSukarela={user.simpanan_sukarela || 0}
                pendingApprovals={user.pending_approvals || 0}
                onNavigate={(path) => navigate(path)}
                onSaldoOpen={handleSaldoOpen}
              />
              <RiskCompliance 
                overdueAngsuran={user.overdue_angsuran || 0}
                totalTransaksiAudit={user.total_transaksi_audit || 0}
                onNavigate={(path) => navigate(path)}
              />
            </>
          )}

          {!isAdmin && (
            <div className="glass-card p-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/5 rounded-full blur-3xl"></div>
              <p className="text-emerald-700 text-sm font-medium mb-1 relative z-10">Total Saldo Simpanan</p>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4 relative z-10 text-slate-800">
                <span className="text-xl align-top mr-1">Rp</span>
                {(user.saldo || 0).toLocaleString('id-ID')}
              </h2>
              <div className="inline-flex items-center gap-2 bg-emerald-100/50 backdrop-blur-md border border-emerald-200/30 rounded-full px-3 py-1.5 w-max relative z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide text-emerald-700">Verified Member</span>
              </div>
            </div>
          )}

          <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between bg-white/30">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Transaksi Terbaru</h2>
              <button onClick={() => navigate('/riwayat')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                Lihat Semua <span className="inline-block ml-1">→</span>
              </button>
            </div>
            <DashboardTransactions transactions={transaksi} />
          </div>

          <div className="space-y-2">
            <Button label="💰 Input Simpanan" variant="glass-gold" fullWidth onClick={() => navigate('/simpanan-input')} />
            {isAdmin && (
              <Button label="📊 Lihat Laporan" variant="glass-emerald" fullWidth onClick={() => navigate('/laporan')} />
            )}
            <Button label="Logout" variant="silhouette" fullWidth onClick={handleLogout} />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
