import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AngsuranList from '../features/AngsuranList';
import DashboardLayout from '../features/DashboardLayout';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { styles } from './angsuranInputStyles';

export default function AngsuranInput() {
  const [angsuranList, setAngsuranList] = useState<{
    id: number;
    bulan_ke: number;
    nominal_angsuran: number;
    status: string;
  }[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAngsuran = async () => {
      try {
        const response = await api.get('/angsuran/me');
        setAngsuranList(response.data.angsuran || []);
      } catch (error) {
        console.error('[Angsuran] Error fetching:', error);
      }
    };
    fetchAngsuran();
  }, []);

  const handlePay = async () => {
    if (!selectedId) return;
    setShowConfirm(false);
    setLoading(true);
    setMessage('');
    
    try {
      await api.post(`/angsuran/${selectedId}/pay`);
      setMessage('✅ Angsuran berhasil dibayar!');
      
      // Refresh list
      const response = await api.get('/angsuran/me');
      setAngsuranList(response.data.angsuran || []);
      setSelectedId('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; detail?: string } } };
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || 'Gagal bayar';
      setMessage('❌ ' + errorMsg);
      console.error('[Angsuran] Pay error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const selectedAngsuran = angsuranList.find(a => a.id === Number(selectedId));

  return (
    <DashboardLayout 
      title="Bayar Angsuran"

    >
      <div style={styles.header}>
        <h2 style={styles.title}>💰 Bayar Angsuran</h2>
        <p style={styles.subtitle}>Riwayat pembayaran angsuran</p>
      </div>

      <div style={styles.scrollableContent}>
      <AngsuranList 
        angsuranList={angsuranList}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onSubmit={() => setShowConfirm(true)}
        message={message}
      />
      </div>

      <div style={styles.fixedBottom}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={styles.backButton}
          disabled={loading}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Konfirmasi Pembayaran"
        message={selectedAngsuran 
          ? `Anda yakin ingin membayar angsuran bulan ke-${selectedAngsuran.bulan_ke} sebesar Rp ${selectedAngsuran.nominal_angsuran.toLocaleString('id-ID')}?`
          : 'Konfirmasi pembayaran?'
        }
        confirmText="Ya, Bayar"
        cancelText="Batal"
        onConfirm={handlePay}
        onCancel={handleCancel}
        loading={loading}
      />
    </DashboardLayout>
  );
}
