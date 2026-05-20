import { useEffect, useState } from 'react';
import api, { getAnggotaList, Anggota } from '../api';
import DashboardLayout from '../features/DashboardLayout';
import AnggotaTable from '../features/anggota/AnggotaTable';
import AnggotaEditModal from '../features/anggota/AnggotaEditModal';

export default function AnggotaManage() {
  const [members, setMembers] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{
    nama: string; email: string; role: string;
  } | null>(null);
  const [editAnggota, setEditAnggota] = useState<Anggota | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMembers = async () => {
    try {
      const membersRes = await getAnggotaList();
      setMembers(membersRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data anggota');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/anggota/me');
        setUser(res.data);
        if (res.data.role !== 'admin') {
          setError('Akses ditolak. Hanya admin yang dapat mengakses halaman ini.');
          setLoading(false);
          return;
        }
        await fetchMembers();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data anggota');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number, nama: string) => {
    if (!window.confirm(`Hapus anggota ${nama}?`)) return;
    try {
      await api.delete(`/anggota/${id}`);
      setMembers(members.filter(m => m.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus anggota');
    }
  };

  const handleEdit = (anggota: Anggota) => {
    setEditAnggota(anggota);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditAnggota(null);
  };

  const handleSaveEdit = async () => {
    await fetchMembers();
  };

  if (loading) return <DashboardLayout><div style={styles.loading}>Memuat...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div style={styles.error}>{error}</div></DashboardLayout>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <DashboardLayout 
        title="Manajemen Anggota"
      >
        <div style={styles.scrollableContent}>
          <div style={styles.card}>
            <AnggotaTable members={members} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>
        {showModal && editAnggota && (
          <AnggotaEditModal
            anggota={editAnggota}
            onClose={handleCloseModal}
            onSave={handleSaveEdit}
          />
        )}
      </DashboardLayout>
    </>
  );
}

const styles = {
  scrollableContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '8px',
    WebkitOverflowScrolling: 'touch' as const,
  },
  card: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    padding: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid rgba(255,255,255,0.3)',
    marginTop: 8,
  },
  loading: {
    textAlign: 'center' as const,
    padding: 20,
    color: '#86868b',
    fontSize: 14,
  },
  error: {
    background: 'rgba(255,59,48,0.1)',
    color: '#ff3b30',
    padding: '8px 12px',
    borderRadius: 10,
    margin: 12,
    fontSize: 13,
  },
};
