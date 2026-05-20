import React, { useState, useEffect } from 'react';
import { getAnggotaList, Anggota } from '../../api';

interface PinjamanFormFieldsProps {
form: {
anggota_id: string;
nominal: string;
margin_persen: string;
tenor_bulan: string;
};
handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PinjamanFormFields({ form, handleChange }: PinjamanFormFieldsProps) {
const [members, setMembers] = useState<Anggota[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
const fetchMembers = async () => {
try {
const res = await getAnggotaList();
setMembers(res.data);
} catch (err) {
setError(err instanceof Error ? err.message : 'Gagal memuat daftar anggota');
} finally {
setLoading(false);
}
};
fetchMembers();
}, []);

return (
<>
<div style={styles.inputGroup}>
<label style={styles.label}>ID Anggota</label>
{loading ? (
<div style={{...styles.input, color: '#86868b'}}>Memuat anggota...</div>
) : error ? (
<div style={{...styles.input, color: '#ff3b30'}}>{error}</div>
) : (
<select
name="anggota_id"
value={form.anggota_id}
onChange={handleChange}
style={styles.select}
required
>
<option value="">Pilih Anggota</option>
{members.map((member) => (
<option key={member.id} value={member.id}>
{member.nama} ({member.email})
</option>
))}
</select>
)}
</div>

<div style={styles.inputGroup}>
<label style={styles.label}>Nominal Pinjaman</label>
<input
type="number"
name="nominal"
value={form.nominal}
onChange={handleChange}
style={styles.input}
required
/>
</div>

<div style={styles.inputGroup}>
<label style={styles.label}>Margin Persen (Syariah)</label>
<select 
name="margin_persen" 
value={form.margin_persen} 
onChange={handleChange} 
style={styles.select}
>
<option value="5.0">5.0% (Standard)</option>
<option value="7.5">7.5% (Medium)</option>
<option value="10.0">10.0% (Premium)</option>
</select>
</div>

<div style={styles.inputGroup}>
<label style={styles.label}>Tenor (Bulan)</label>
<input
type="number"
name="tenor_bulan"
value={form.tenor_bulan}
onChange={handleChange}
style={styles.input}
required
/>
</div>
</>
);
}

const styles = {
inputGroup: {
display: 'flex' as const,
flexDirection: 'column' as const,
gap: 8,
marginBottom: 16,
},
label: {
fontSize: 14,
fontWeight: 600,
color: '#1d1d1f',
},
input: {
padding: '14px 16px',
borderRadius: 12,
border: '2px solid #e5e5ea',
fontSize: 16,
backgroundColor: 'white',
color: '#1d1d1f',
outline: 'none',
transition: 'border-color 0.2s',
},
select: {
padding: '14px 16px',
borderRadius: 12,
border: '2px solid #e5e5ea',
fontSize: 16,
backgroundColor: 'white',
color: '#1d1d1f',
outline: 'none',
cursor: 'pointer' as const,
},
};
