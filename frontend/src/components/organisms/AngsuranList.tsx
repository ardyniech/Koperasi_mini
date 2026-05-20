interface Angsuran {
id: number;
bulan_ke: number;
nominal_angsuran: number;
status: string;
}

interface AngsuranListProps {
angsuranList: Angsuran[];
selectedId: string;
onSelect: (id: string) => void;
onSubmit: () => void;
message: string;
}

export default function AngsuranList({ 
angsuranList, 
selectedId, 
onSelect, 
onSubmit,
message 
}: AngsuranListProps) {
return (
<form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={styles.form}>
<div style={styles.inputGroup}>
<label style={styles.label}>Pilih Angsuran</label>
<select 
value={selectedId} 
onChange={(e) => onSelect(e.target.value)}
style={styles.input}
required
>
<option value="">-- Pilih Angsuran --</option>
{angsuranList.map(a => (
<option key={a.id} value={a.id}>
Angsuran #{a.id} - Bulan {a.bulan_ke} - Rp{a.nominal_angsuran}
</option>
))}
</select>
</div>
<button type="submit" style={styles.button}>Tandai Lunas</button>
{message && <p style={message.includes('berhasil') ? styles.success : styles.error}>{message}</p>}
</form>
);
}

const styles = {
form: {
display: 'flex' as const,
flexDirection: 'column' as const,
gap: 16,
},
inputGroup: {
display: 'flex' as const,
flexDirection: 'column' as const,
gap: 8,
},
label: {
fontSize: 14 as const,
color: '#3a3a3c' as const,
fontWeight: 500 as const,
},
input: {
padding: '12px 16px' as const,
borderRadius: 12 as const,
border: '1px solid #d2d2d7' as const,
fontSize: 16 as const,
outline: 'none' as const,
},
button: {
backgroundColor: '#007aff' as const,
color: 'white' as const,
border: 'none' as const,
borderRadius: 12 as const,
padding: '14px' as const,
fontSize: 16 as const,
fontWeight: 600 as const,
cursor: 'pointer' as const,
},
success: {
color: '#34c759' as const,
fontSize: 14 as const,
margin: 0 as const,
textAlign: 'center' as const,
},
error: {
color: '#ff3b30' as const,
fontSize: 14 as const,
margin: 0 as const,
textAlign: 'center' as const,
},
};
