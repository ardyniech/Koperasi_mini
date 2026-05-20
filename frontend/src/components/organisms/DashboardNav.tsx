import { useNavigate } from 'react-router-dom';

interface DashboardNavProps {
role: string;
}

export default function DashboardNav({ role }: DashboardNavProps) {
const navigate = useNavigate();

return (
<div style={styles.navContainer}>
<h3 style={styles.navTitle}>Menu</h3>
{role === 'admin' ? (
<div style={styles.navGrid}>
<button onClick={() => navigate('/anggota')} style={{...styles.navButton, backgroundColor: '#ff9500'}}>
👥 Manajemen Anggota
</button>
<button onClick={() => navigate('/pinjaman/approval')} style={{...styles.navButton, backgroundColor: '#ff9500'}}>
✅ Approval Pinjaman
</button>
<button onClick={() => navigate('/simpanan/input')} style={styles.navButton}>
Input Simpanan
</button>
<button onClick={() => navigate('/pinjaman/input')} style={styles.navButton}>
Input Pinjaman Syariah
</button>
<button onClick={() => navigate('/angsuran/input')} style={styles.navButton}>
Update Angsuran
</button>
<button onClick={() => navigate('/funding/input')} style={styles.navButton}>
Input Dana Gotong Royong
</button>
<button onClick={() => navigate('/riwayat')} style={{...styles.navButton, backgroundColor: '#34c759'}}>
📋 Riwayat Transaksi
</button>
<button onClick={() => navigate('/settings')} style={{...styles.navButton, backgroundColor: '#5856d6'}}>
Settings & Branding
</button>
<button onClick={() => navigate('/landing-manage')} style={{...styles.navButton, backgroundColor: '#34c759'}}>
Manage Landing Page
</button>
</div>
) : (
<div style={styles.navGrid}>
<button onClick={() => navigate('/saldo')} style={styles.navButton}>
Lihat Saldo
</button>
<button onClick={() => navigate('/kewajiban')} style={styles.navButton}>
Kewajiban Saya
</button>
<button onClick={() => navigate('/pinjaman/pengajuan')} style={{...styles.navButton, backgroundColor: '#ff9500'}}>
📋 Ajukan Pinjaman
</button>
<button onClick={() => navigate('/riwayat')} style={{...styles.navButton, backgroundColor: '#34c759'}}>
📋 Riwayat Transaksi
</button>
</div>
)}
</div>
);
}

const styles = {
navContainer: {
marginTop: 30,
textAlign: 'left' as const,
},
navTitle: {
fontSize: 18,
fontWeight: 600,
color: '#1d1d1f',
marginBottom: 15,
},
navGrid: {
display: 'grid',
gridTemplateColumns: 'repeat(2, 1fr)',
gap: 10,
},
navButton: {
backgroundColor: '#007aff',
color: 'white',
border: 'none',
borderRadius: 12,
padding: 15,
fontSize: 16,
fontWeight: 600,
cursor: 'pointer',
},
} as const;
