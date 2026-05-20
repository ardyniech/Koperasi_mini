import React from 'react';

interface LoginLayoutProps {
children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
return (
<div style={styles.container}>
<div style={styles.card}>
<div style={styles.logoContainer}>
<div style={styles.logo}>🏦</div>
<h1 style={styles.appName}>Koperasi Mini</h1>
<p style={styles.tagline}>Syariah Transparansi</p>
<p style={styles.guideNote}>Gunakan email & password yang diberikan oleh admin koperasi</p>
</div>
{children}
</div>
</div>
);
}

const styles = {
container: {
minHeight: '100vh',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#f5f5f7',
backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(175, 82, 222, 0.05) 0%, transparent 50%)',
padding: 20,
fontFamily: 'inherit',
},
card: {
backgroundColor: 'rgba(255, 255, 255, 0.95)',
borderRadius: 24,
padding: '48px 40px',
maxWidth: 420,
width: '100%',
boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255, 255, 255, 0.18)',
},
logoContainer: {
textAlign: 'center' as const,
marginBottom: 36,
},
logo: {
fontSize: 64,
marginBottom: 16,
},
appName: {
fontSize: 32,
fontWeight: 700,
color: '#1d1d1f',
margin: '0 0 8px 0',
letterSpacing: '-0.5px',
},
tagline: {
fontSize: 15,
color: '#86868b',
margin: 0,
fontWeight: 500,
},
guideNote: {
fontSize: 12,
color: '#666',
fontStyle: 'italic',
marginTop: 8,
marginBottom: 0,
},
} as const;
