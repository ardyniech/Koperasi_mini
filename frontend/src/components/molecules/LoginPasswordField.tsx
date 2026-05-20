
interface PasswordFieldProps {
password: string;
setPassword: (password: string) => void;
}

export default function PasswordField({ password, setPassword }: PasswordFieldProps) {
return (
<div style={styles.inputGroup}>
<label htmlFor="password" style={styles.label}>
<span style={styles.labelIcon}>🔒</span> Password
</label>
<input
id="password"
type="password"
placeholder="Masukkan password"
value={password}
onChange={e => setPassword(e.target.value)}
style={styles.input}
required
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