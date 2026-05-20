interface Angsuran {
id: number;
bulan_ke: number;
nominal_angsuran: number;
tanggal_jatuh_tempo: string;
status: string;
}

interface AngsuranBelumBayarListProps {
angsuran: Angsuran[];
}

function AngsuranBelumBayarList({ angsuran }: AngsuranBelumBayarListProps) {
const now = new Date();
const belumBayar = angsuran.filter(a => a.status === 'Belum Bayar');

if (belumBayar.length === 0) {
return <p style={styles.empty}>Tidak ada angsuran belum bayar</p>;
}

return (
<div style={styles.section}>
<h3 style={styles.subtitle}>Angsuran Belum Bayar</h3>
{belumBayar.map(a => (
<div key={a.id} style={styles.item}>
<div>
<p style={styles.mainText}>Angsuran #{a.id} - Bulan {a.bulan_ke}</p>
<p style={styles.subText}>
Jatuh tempo: {new Date(a.tanggal_jatuh_tempo).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
{new Date(a.tanggal_jatuh_tempo) < now && (
<span style={styles.overdue}> (Telat!)</span>
)}
</p>
</div>
<p style={styles.amount}>Rp{a.nominal_angsuran.toLocaleString()}</p>
</div>
))}
</div>
);
}

const styles = {
section: {
marginBottom: 25
},
subtitle: {
fontSize: 18,
fontWeight: 600,
marginBottom: 15,
color: '#1d1d1f'
},
empty: {
color: '#86868b',
fontStyle: 'italic' as const
},
item: {
display: 'flex' as const,
justifyContent: 'space-between' as const,
alignItems: 'center' as const,
padding: 10,
borderBottom: '1px solid #f5f5f7'
},
mainText: {
fontWeight: 600,
color: '#1d1d1f',
marginBottom: 2
},
subText: {
fontSize: 12,
color: '#86868b'
},
overdue: {
color: '#ff3b30',
fontWeight: 600
},
amount: {
fontWeight: 600,
color: '#34c759'
}
} as const;

export default AngsuranBelumBayarList;
