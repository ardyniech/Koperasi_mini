
interface EmailFieldProps {
email: string;
setEmail: (email: string) => void;
}

export default function EmailField({ email, setEmail }: EmailFieldProps) {
return (
<div style={styles.inputGroup}>
<label htmlFor="email" style={styles.label}>
<span style={styles.labelIcon}>📧</span> Email
</label>
<input
id="email"
type="email"
placeholder="Masukkan email"
value={email}
onChange={e => setEmail(e.target.value)}
style={styles.input}
required
autoFocus
/>
</div>
);
}

const styles = {
inputGroup: {
display: 'flex',
flexDirection: 'column' as const,
gap: 10,
},
label: {
fontSize: 14,
fontWeight: 600,
color: '#1d1d1f',
display: 'flex',
alignItems: 'center',
gap: 8,
},
labelIcon: {
fontSize: 16,
},
input: {
padding: '14px 18px',
borderRadius: 12,
border: '1.5px solid #d1d1d6',
fontSize: 16,
outline: 'none',
transition: 'all 0.2s ease',
backgroundColor: 'white',
fontFamily: 'inherit',
color: '#1d1d1f',
'::placeholder': {
color: '#86868b',
},
},
};