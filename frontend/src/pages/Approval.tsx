import { useEffect, useState } from 'react';
import api from '../api';
import { AxiosError } from 'axios';
import DashboardLayout from '../features/DashboardLayout';
import { Pinjaman, Anggota } from './approvalTypes';
import ApprovalCard from './ApprovalCard';
import { styles } from './approvalStyles';

export default function Approval() {
  const [pinjamanList, setPinjamanList] = useState<Pinjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pinjaman/');
        const anggotaRes = await api.get('/anggota/list');
        const anggotaMap = new Map(anggotaRes.data.map((a: Anggota) => [a.id, a.nama]));
        setPinjamanList(res.data.pinjaman.map((p: Pinjaman) => ({
          ...p, anggota_nama: anggotaMap.get(p.anggota_id) || `Anggota ${p.anggota_id}`,
        })));
      } catch { setError('Gagal memuat data pinjaman'); } finally { setLoading(false); }
    };
    fetchData();
  }, [refetch]);

  const handleApprove = async (id: number) => {
    if (!confirm('Setujui pengajuan pinjaman ini?')) return;
    try {
      await api.put(`/pinjaman/${id}/approve`);
      setSuccess('Pinjaman berhasil disetujui!'); setRefetch(prev => prev + 1);
    } catch (err: unknown) {
      setError(err instanceof AxiosError ? err.response?.data?.detail || 'Gagal' : 'Gagal');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Tolak pengajuan pinjaman ini?')) return;
    try {
      await api.put(`/pinjaman/${id}/reject`);
      setSuccess('Pinjaman berhasil ditolak!'); setRefetch(prev => prev + 1);
    } catch (err: unknown) {
      setError(err instanceof AxiosError ? err.response?.data?.detail || 'Gagal' : 'Gagal');
    }
  };

  if (loading) return <DashboardLayout><div style={styles.loading}>Memuat...</div></DashboardLayout>;
  const total = pinjamanList.reduce((sum, p) => sum + p.nominal, 0);
  return (
    <>
      <DashboardLayout 
        title="Approval Pinjaman"

      >
        <div style={styles.header}>
          <h2 style={styles.title}>✅ Approval Pinjaman</h2>
        </div>

        <div style={styles.scrollableContent}>
          {error && <div style={styles.error}><span style={styles.errorIcon}>⚠️</span> {error}</div>}
          {success && <div style={styles.success}><span style={styles.successIcon}>✅</span> {success}</div>}

          <div style={styles.summaryBox}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Diajukan:</span>
              <span style={styles.summaryValue}>{pinjamanList.length} pengajuan</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Nominal:</span>
              <span style={styles.summaryValueHighlight}>Rp{total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {pinjamanList.length === 0 ? (
            <div style={styles.empty}>Tidak ada pengajuan yang menunggu</div>
          ) : (
            <div style={styles.list}>
              {pinjamanList.map((p) => (
                <ApprovalCard key={p.id} pinjaman={p} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
