import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../features/DashboardLayout';
import api from '../api';

interface LaporanData {
  total_aset: number;
  total_simpanan_wajib: number;
  total_simpanan_sukarela: number;
  total_pinjaman_aktif: number;
  total_anggota: number;
  shu_proyeksi: number;
  angsuran_terbayar: number;
  angsuran_belum_bayar: number;
  overdue_30_hari: number;
  pending_approvals: number;
}

export default function Laporan() {
  const [data, setData] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        console.log('[Laporan] Fetching report data...');
        const res = await api.get('/anggota/admin/dashboard');
        const dashData = res.data;
        
        setData({
          total_aset: dashData.total_saldo || 0,
          total_simpanan_wajib: dashData.simpanan_wajib || 0,
          total_simpanan_sukarela: dashData.simpanan_sukarela || 0,
          total_pinjaman_aktif: dashData.total_pinjaman_aktif || 0,
          total_anggota: dashData.total_members || 0,
          shu_proyeksi: dashData.shu_tahunan || 0,
          angsuran_terbayar: dashData.angsuran_terbayar || 0,
          angsuran_belum_bayar: dashData.total_angsuran_belum_bayar || 0,
          overdue_30_hari: dashData.overdue_angsuran || 0,
          pending_approvals: dashData.pending_approvals || 0,
        });
        setLoading(false);
        console.log('[Laporan] Data loaded successfully');
      } catch (err) {
        console.error('[Laporan] Error:', err);
        setError('Gagal memuat laporan. Pastikan Anda login sebagai admin.');
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  const handlePrint = () => {
    console.log('[Laporan] Printing report...');
    window.print();
  };

  if (loading) return (
    <DashboardLayout title="Laporan">
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-gray-500">Memuat laporan...</span>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout title="Laporan">
      <div className="text-center p-10 text-red-500">{error}</div>
    </DashboardLayout>
  );

  if (!data) return (
    <DashboardLayout title="Laporan">
      <div className="text-center p-10 text-gray-500">Data tidak ditemukan</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Laporan">
      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">📊 Laporan Koperasi</h2>
            <p className="text-sm text-slate-500 mt-1">Laporan lengkap untuk investor & stakeholders</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium text-sm"
          >
            🖨️ Print / Export
          </button>
        </div>

        {/* Financial Summary */}
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">💰 Laporan Keuangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50/50 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 font-medium">Total Aset Koperasi</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.total_aset.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Simpanan Wajib + Sukarela</p>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-4">
              <p className="text-xs text-blue-600 font-medium">Simpanan Wajib</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.total_simpanan_wajib.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Wajib per anggota</p>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-4">
              <p className="text-xs text-amber-600 font-medium">Simpanan Sukarela</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.total_simpanan_sukarela.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Cair 24 jam</p>
            </div>
            <div className="bg-rose-50/50 rounded-2xl p-4">
              <p className="text-xs text-rose-600 font-medium">Pinjaman Outstanding</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.total_pinjaman_aktif.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">0% NPL</p>
            </div>
          </div>
        </div>

        {/* Member & SHU */}
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">👥 Member & SHU</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 rounded-2xl p-4">
              <p className="text-xs text-indigo-600 font-medium">Total Anggota Aktif</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{data.total_anggota.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">+12% MoM</p>
            </div>
            <div className="bg-yellow-50/50 rounded-2xl p-4">
              <p className="text-xs text-yellow-600 font-medium">SHU Proyeksi 2026</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.shu_proyeksi.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">0.0006% dari Aset</p>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 font-medium">Angsuran Terbayar</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">Rp {data.angsuran_terbayar.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Semua angsuran lunas</p>
            </div>
          </div>
        </div>

        {/* Risk & Compliance */}
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">⚠️ Risk & Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50/50 rounded-2xl p-4">
              <p className="text-xs text-red-600 font-medium">Overdue Angsuran (&gt;30 Hari)</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{data.overdue_30_hari.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Kredit macet syariah</p>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-4">
              <p className="text-xs text-amber-600 font-medium">Belum Bayar Angsuran</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{data.angsuran_belum_bayar.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Menunggu pembayaran</p>
            </div>
            <div className="bg-orange-50/50 rounded-2xl p-4">
              <p className="text-xs text-orange-600 font-medium">Pending Approvals</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{data.pending_approvals.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1">Perlu persetujuan admin</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-slate-400 py-4">
          <p>Laporan ini dibuat otomatis oleh sistem Koperasi Mini Syariah</p>
          <p>Transparansi tanpa riba, tanpa denda - Berkah untuk semua</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
