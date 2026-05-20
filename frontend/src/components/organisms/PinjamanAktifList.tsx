interface Pinjaman {
id: number;
nominal: number;
status: string;
}

interface PinjamanAktifListProps {
pinjaman: Pinjaman[];
}

function PinjamanAktifList({ pinjaman }: PinjamanAktifListProps) {
const activePinjaman = pinjaman.filter(p => p.status !== 'Lunas');

if (activePinjaman.length === 0) {
return <p style={styles.empty}>Tidak ada pinjaman aktif</p>;
}

return (
<div style={styles.section}>
<h3 style={styles.subtitle}>Pinjaman Aktif</h3>
{activePinjaman.map(p => (
<div key={p.id} style={styles.item}>
<div>
<p style={styles.mainText}>Pinjaman #{p.id}</p>
<p style={styles.subText}>Status: {p.status}</p>
</div>
<p style={styles.amount}>Rp{p.nominal.toLocaleString()}</p>
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
amount: {
fontWeight: 600,
color: '#34c759'
}
} as const;

export default PinjamanAktifList;
