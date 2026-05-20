
import React from 'react';

interface SubmitButtonProps {
loading: boolean;
onClick: (e?: React.FormEvent) => void;
}

export default function SubmitButton({ loading, onClick }: SubmitButtonProps) {
return (
<button
type="submit"
disabled={loading}
style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
onClick={onClick}
>
<div style={styles.buttonContent}>
{loading ? (
<>
<span style={styles.spinner}>⏳</span>
<span>Memproses...</span>
</>
) : (
<>
<span style={styles.buttonIcon}>🚀</span>
<span>Login</span>
</>
)}
</div>
</button>
);
}

const styles = {
button: {
padding: '16px 24px',
borderRadius: 12,
border: 'none',
background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
color: 'white',
fontSize: 17,
fontWeight: 600,
cursor: 'pointer',
marginTop: 8,
boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)',
transition: 'all 0.2s ease',
fontFamily: 'inherit',
},
buttonDisabled: {
background: 'linear-gradient(135deg, #a2a2a7 0%, #8e8e93 100%)',
cursor: 'not-allowed',
boxShadow: 'none',
},
buttonContent: {
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: 8,
},
buttonIcon: {
fontSize: 20,
},
spinner: {
fontSize: 16,
},
};