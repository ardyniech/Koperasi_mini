import { useEffect, useState } from 'react';
import api from '../api';
import DashboardLayout from '../features/DashboardLayout';
import TransactionCard from '../components/atoms/TransactionCard';
import { Transaction, CurrentUser, SimpananData, PinjamanData, AngsuranData, FundingData } from './riwayatTypes';

export default function Riwayat() {
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

useEffect(() => {
api.get('/auth/me').then(({ data: user }) => {
setCurrentUser(user);
const isAdmin = user.role === 'admin';
Promise.all([
api.get(isAdmin ? '/simpanan/' : '/simpanan/me'),
api.get(isAdmin ? '/pinjaman/' : '/pinjaman/me'),
api.get(isAdmin ? '/angsuran/' : '/angsuran/me'),
api.get(isAdmin ? '/funding/' : '/funding/me')
]).then(([simpananRes, pinjamanRes, angsuranRes, fundingRes]) => {
const allTx: Transaction[] = [
...(simpananRes.data.simpanan || []).map((s: SimpananData) => ({
  id: s.id, type: 'simpanan' as const, amount: s.nominal, date: s.created_at, status: s.status,
  description: `Simpanan ${s.jenis?.toString().toLowerCase().trim() === 'wajib' ? 'Wajib' : s.jenis?.toString().toLowerCase().trim() === 'sukarela' ? 'Sukarela' : 'Pokok'}: Rp ${s.nominal.toLocaleString('id-ID')} (Anggota: ${s.anggota_id || user.id})`
})),
...(pinjamanRes.data.pinjaman || []).map((p: PinjamanData) => ({
id: p.id, type: 'pinjaman' as const, amount: p.nominal, date: p.created_at, status: p.status,
description: `Pinjaman: Rp ${p.nominal.toLocaleString('id-ID')} (${p.tenor_bulan || 0} bulan) (Anggota: ${p.anggota_id || user.id})`
})),
...(angsuranRes.data.angsuran || []).map((a: AngsuranData) => ({
id: a.id, type: 'angsuran' as const, amount: a.nominal_angsuran, date: a.tanggal_bayar || '', status: a.status,
description: `Angsuran ${a.bulan_ke}: Rp ${a.nominal_angsuran.toLocaleString('id-ID')} (Anggota: ${a.anggota_id || user.id})`
})),
...(fundingRes.data.funding || []).map((f: FundingData) => ({
id: f.id, type: 'funding' as const, amount: f.nominal, date: f.created_at, status: f.status,
description: `Dana Gotong Royong: Rp ${f.nominal.toLocaleString('id-ID')} - ${f.tujuan_usaha} (Anggota: ${f.anggota_id || user.id})`
}))
];
allTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
setTransactions(allTx);
}).catch(() => setError('Gagal memuat riwayat transaksi'))
.finally(() => setLoading(false));
}).catch(() => { setError('Gagal memuat user info'); setLoading(false); });
}, []);

if (loading) return <DashboardLayout><div style={styles.loading}>Memuat...</div></DashboardLayout>;
return (
  <>
    <DashboardLayout 
      title="Riwayat Transaksi"

    >
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Riwayat Transaksi</h2>
        <p style={styles.subtitle}>
          {currentUser?.role === 'admin' ? 'Semua transaksi (admin view)' : 'Riwayat transaksi Anda'}
        </p>
      </div>

      <div style={styles.scrollableContent}>
        {error && <p style={styles.error}>{error}</p>}
        {transactions.length === 0 ? (
          <div style={styles.empty}>Belum ada transaksi</div>
        ) : (
          <div style={styles.list}>
            {transactions.map((tx) => (
              <TransactionCard key={`${tx.type}-${tx.id}`} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  </>
);
}

const styles = {
header: {
padding: '20px 20px 16px',
borderBottom: '1px solid rgba(255,255,255,0.2)',
},
title: {
fontSize: 24,
fontWeight: 700,
color: '#1d1d1f',
margin: 0,
marginBottom: 4,
},
subtitle: {
fontSize: 14,
color: '#86868b',
margin: 0,
},
scrollableContent: {
flex: 1,
overflowY: 'auto' as const,
padding: '20px',
WebkitOverflowScrolling: 'touch' as const,
},
loading: {
textAlign: 'center' as const,
padding: 40,
color: '#86868b',
fontSize: 16,
},
error: {
background: 'rgba(255,59,48,0.1)',
color: '#ff3b30',
padding: '12px 16px',
borderRadius: 12,
marginBottom: 16,
fontSize: 14,
},
empty: {
textAlign: 'center' as const,
padding: 40,
color: '#86868b',
fontSize: 16,
},
list: {
display: 'flex',
flexDirection: 'column' as const,
gap: 12,
},
};
