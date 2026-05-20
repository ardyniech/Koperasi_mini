import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import ConfirmDialog from '../components/molecules/ConfirmDialog';

interface PinjamanForm {
  nominal: string;
  tenor_bulan: string;
}

export default function PengajuanPinjaman() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PinjamanForm>({ nominal: '', tenor_bulan: '12' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true); setError(''); setSuccess('');
    const nominal = Number(form.nominal);
    const tenor = Number(form.tenor_bulan);

    if (isNaN(nominal) || nominal <= 0) { setError('Nominal harus >0'); setLoading(false); return; }
    if (isNaN(tenor) || tenor <= 0) { setError('Tenor harus >0'); setLoading(false); return; }

    try {
      await api.post('/pinjaman/pengajuan', { nominal, tenor_bulan: tenor });
      setSuccess('Pengajuan berhasil! Menunggu approval admin.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      try {
        const axiosError = err as { response?: { data?: { message?: string; detail?: string } } };
        const errorMsg = axiosError.response?.data?.message || axiosError.response?.data?.detail || 'Gagal mengajukan';
        setError(errorMsg);
        console.error('[Pinjaman] Apply error:', errorMsg);
      } catch {
        setError('Gagal mengajukan');
      }
    } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <DashboardLayout 
      title="Pengajuan Pinjaman"

      showBackButton={true}
      onBack={() => navigate(-1)}
    >
      <div className="p-2 space-y-2">
        <div className="glass-card rounded-3xl p-3 shadow-sm hover:scale-[1.02] transition-transform duration-200">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3 mb-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg flex items-center gap-3 mb-3">
              <span className="text-xl">✅</span>
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="nominal" className="block text-xs font-medium text-slate-500 mb-1.5">
                Nominal Pinjaman (Rp)
              </label>
              <input 
                id="nominal"
                type="number" 
                value={form.nominal} 
                onChange={(e) => setForm({ ...form, nominal: e.target.value })} 
                placeholder="Contoh: 5000000" 
                min="1" 
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                required 
              />
            </div>

            <div>
              <label htmlFor="tenor" className="block text-xs font-medium text-slate-500 mb-1.5">
                Tenor (bulan)
              </label>
              <input 
                id="tenor"
                type="number" 
                value={form.tenor_bulan} 
                onChange={(e) => setForm({ ...form, tenor_bulan: e.target.value })} 
                placeholder="Contoh: 12" 
                min="1" 
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                required 
              />
            </div>

            <Button 
              variant="silhouette" 
              size="lg" 
              fullWidth 
              loading={loading} 
              type="submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size={16} color="text-white" /> Mengajukan...
                </div>
              ) : '📋 Ajukan Pinjaman'}
            </Button>
          </form>
        </div>

        <Button 
          variant="silhouette" 
          size="lg" 
          fullWidth 
          onClick={() => navigate('/dashboard')}
        >
          ← Kembali ke Dashboard
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Konfirmasi Pengajuan"
        message={`Anda yakin ingin mengajukan pinjaman sebesar Rp ${Number(form.nominal).toLocaleString('id-ID')} untuk ${form.tenor_bulan} bulan?`}
        confirmText="Ya, Ajukan"
        cancelText="Batal"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />
    </DashboardLayout>
  );
}
