import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Anggota } from '../api';
import DashboardLayout from '../features/DashboardLayout';
import SimpananForm from '../components/molecules/SimpananForm';

interface SimpananFormData {
  anggota_id: string;
  jenis: string;
  nominal: string;
  keterangan: string;
}

export default function SimpananInput() {
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<SimpananFormData>({
    anggota_id: '',
    jenis: 'Pokok',
    nominal: '',
    keterangan: ''
  });
  const [errors, setErrors] = useState<{ anggota_id?: string; nominal?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/anggota/list')
      .then(res => {
        console.log('[Simpanan] Anggota list loaded:', res.data?.length || 0);
        setAnggotaList(res.data || []);
      })
      .catch((err) => {
        const errMsg = err?.response?.data?.detail || err?.message || 'Gagal memuat daftar anggota';
        console.error('[Simpanan] Load anggota error:', errMsg);
        setMessage('❌ ' + errMsg);
      });
  }, []);

  const validate = () => {
    const newErrors: { anggota_id?: string; nominal?: string } = {};
    if (!formData.anggota_id || formData.anggota_id === '') newErrors.anggota_id = 'Anggota wajib dipilih';
    if (!formData.nominal) newErrors.nominal = 'Nominal wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setMessage('');
    setLoading(true);
    
    // OPTIMISTIC UI: Langsung update UI detik itu juga
    const savedData = { ...formData }; // Backup untuk rollback
    setMessage('✅ Simpanan berhasil dicatat!');
    setFormData({ anggota_id: '', jenis: 'Pokok', nominal: '', keterangan: '' });
    
    try {
      await api.post('/simpanan/', {
        anggota_id: Number(savedData.anggota_id),
        jenis: savedData.jenis,
        nominal: Number(savedData.nominal),
        keterangan: savedData.keterangan,
      });
      // Success - biarin success message tetep tampil
    } catch (error: unknown) {
      // ROLLBACK: API gagal, kembalikan state
      setFormData(savedData);
      try {
        const axiosError = error as { response?: { data?: { message?: string; detail?: string } } };
        const errorMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || 'Gagal mencatat';
        setMessage('❌ Error: ' + errorMsg);
        console.error('[Simpanan] Create error:', errorMsg);
      } catch {
        setMessage('❌ Error: Gagal mencatat');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout
      title="Input Simpanan"

      showBackButton={true}
      onBack={() => navigate(-1)}
    >
      <div className="p-2 space-y-2">
        <div className="glass-card rounded-3xl p-3 shadow-sm">
          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-3 mb-3 ${message.includes('✅') ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
              <span className="text-xl">{message.includes('✅') ? '✅' : '⚠️'}</span>
              <p className={`text-sm ${message.includes('✅') ? 'text-emerald-700' : 'text-red-700'}`}>{message}</p>
            </div>
          )}

          <SimpananForm
            formData={formData}
            errors={errors}
            loading={loading}
            showConfirm={showConfirm}
            anggotaList={anggotaList}
            onSubmit={handleSubmit}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
            onChange={handleChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
