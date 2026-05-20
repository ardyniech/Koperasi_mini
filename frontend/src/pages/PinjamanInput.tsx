import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import PinjamanForm from '../components/molecules/PinjamanForm';

export default function PinjamanInput() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    anggota_id: '',
    nominal: '',
    margin_persen: '5',
    tenor_bulan: '12',
  });
  const [errors, setErrors] = useState<{ anggota_id?: string; nominal?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { anggota_id?: string; nominal?: string } = {};
    if (!formData.anggota_id) newErrors.anggota_id = 'ID Anggota wajib diisi';
    if (!formData.nominal) newErrors.nominal = 'Nominal wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage('');
    setLoading(true);

    try {
      await api.post('/pinjaman/', {
        anggota_id: Number(formData.anggota_id),
        nominal: Number(formData.nominal),
        margin_persen: Number(formData.margin_persen),
        tenor_bulan: Number(formData.tenor_bulan),
      });
      setMessage('✅ Pinjaman syariah berhasil dicatat!');
      setFormData({ anggota_id: '', nominal: '', margin_persen: '5', tenor_bulan: '12' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; detail?: string } } };
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || 'Gagal mencatat';
      setMessage('❌ Error: ' + errorMsg);
      console.error('[Pinjaman] Create error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Input Pinjaman"
      showBackButton
      onBack={() => navigate('/dashboard')}
    >
      <div className="p-2 space-y-2">
        <div className="glass-card p-3 rounded-3xl shadow-sm">
          {message && (
            <div className={`p-3 rounded-2xl text-sm font-medium ${
              message.includes('✅') 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <PinjamanForm
            formData={formData}
            errors={errors}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
