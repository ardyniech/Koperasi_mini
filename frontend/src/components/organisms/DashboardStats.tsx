interface DashboardStatsProps {
saldo?: number;
pinjaman_aktif?: number;
angsuran_belum_bayar?: number;
total_funding?: number;
total_members?: number;
budget_persiapan?: number;
total_pinjaman_diajukan?: number;
total_pinjaman_ditolak?: number;
}

export default function DashboardStats({ 
saldo, 
pinjaman_aktif, 
angsuran_belum_bayar, 
total_funding,
total_members,
budget_persiapan,
total_pinjaman_diajukan,
total_pinjaman_ditolak
}: DashboardStatsProps) {
return (
<div style={styles.dashboardGrid}>
{total_members !== undefined && (
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>Total Anggota</h3>
<p style={styles.cardValue}>{total_members}</p>
</div>
)}
<div style={styles.cardSmall}>
        <h3 style={styles.cardTitle}>Saldo Anda</h3>
        <p style={styles.cardValue}>Rp{saldo?.toLocaleString() || 0}</p>
      </div>
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>Pinjaman Aktif</h3>
<p style={styles.cardValue}>{pinjaman_aktif || 0}</p>
</div>
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>Angsuran Belum Bayar</h3>
<p style={styles.cardValue}>{angsuran_belum_bayar || 0}</p>
</div>
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>Dana Funding</h3>
<p style={styles.cardValue}>Rp{total_funding?.toLocaleString() || 0}</p>
</div>
{budget_persiapan !== undefined && (
<div style={{...styles.cardSmall, border: '2px solid #ff9500'}}>
<h3 style={styles.cardTitle}>📊 Budget Persiapan</h3>
<p style={{...styles.cardValue, color: '#ff9500'}}>Rp{budget_persiapan?.toLocaleString() || 0}</p>
<p style={{fontSize: 12, color: '#86868b'}}>Menunggu approval</p>
</div>
)}
{total_pinjaman_diajukan !== undefined && (
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>📋 Diajukan</h3>
<p style={styles.cardValue}>{total_pinjaman_diajukan}</p>
</div>
)}
{total_pinjaman_ditolak !== undefined && (
<div style={styles.cardSmall}>
<h3 style={styles.cardTitle}>❌ Ditolak</h3>
<p style={styles.cardValue}>{total_pinjaman_ditolak}</p>
</div>
)}
</div>
);
}

const styles = {
dashboardGrid: {
display: 'grid' as const,
gridTemplateColumns: 'repeat(2, 1fr)' as const,
gap: 15,
margin: '20px 0' as const,
},
cardSmall: {
background: '#f5f5f7' as const,
borderRadius: 12 as const,
padding: 15 as const,
textAlign: 'left' as const,
},
cardTitle: {
fontSize: 14 as const,
color: '#86868b' as const,
marginBottom: 5 as const,
},
cardValue: {
fontSize: 20 as const,
fontWeight: 600 as const,
color: '#1d1d1f' as const,
},
};
