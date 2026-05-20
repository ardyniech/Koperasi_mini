import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import FundingForm from '../components/molecules/FundingForm';

export default function FundingInput() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    anggota_id: '',
    nominal: '',
    tujuan_usaha: '',
  });
  const [errors, setErrors] = useState<{ anggota_id?: string; nominal?: string; tujuan_usaha?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { anggota_id?: string; nominal?: string; tujuan_usaha?: string } = {};
    if (!formData.anggota_id) newErrors.anggota_id = 'ID Anggota wajib diisi';
    if (!formData.nominal) newErrors.nominal = 'Nominal wajib diisi';
    if (!formData.tujuan_usaha) newErrors.tujuan_usaha = 'Tujuan usaha wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage('');
    setLoading(true);

    try {
      await api.post('/funding/', {
        anggota_id: Number(formData.anggota_id),
        nominal: Number(formData.nominal),
        tujuan_usaha: formData.tujuan_usaha,
      });
      setMessage('✅ Dana gotong royong berhasil dicatat!');
      setFormData({ anggota_id: '', nominal: '', tujuan_usaha: '' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; detail?: string } } };
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || 'Gagal mencatat';
      setMessage('❌ Error: ' + errorMsg);
      console.error('[Funding] Create error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Input Dana Gotong Royong"
      showBackButton
      onBack={() => navigate('/dashboard')}
    >
      <div className="p-2 space-y-2">
        <div className="glass-card p-3 rounded-3xl shadow-sm">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-slate-800">💰 Input Dana Gotong Royong</h2>
            <p className="text-sm text-slate-500 mt-1">Dana dari anggota untuk usaha bersama</p>
          </div>

          {message && (
            <div className={`p-3 rounded-2xl text-sm font-medium ${
              message.includes('✅') 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <FundingForm
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
