import React from 'react';

interface KewajibanLayoutProps {
children: React.ReactNode;
title: string;
error?: string;
onBack: () => void;
}

function KewajibanLayout({ children, title, error, onBack }: KewajibanLayoutProps) {
return (
<div style={styles.container}>
{/* Fixed Header */}
<div style={styles.header}>
<h2 style={styles.title}>{title}</h2>
<p style={styles.guideNote}>Daftar kewajiban pinjaman anda, bayar via admin</p>
</div>

{/* Scrollable Content */}
<div style={styles.scrollableContent}>
{error && <p style={styles.error}>{error}</p>}
{children}
</div>

{/* Fixed Bottom */}
<div style={styles.fixedBottom}>
<button onClick={onBack} style={styles.backButton}>
← Kembali ke Dashboard
</button>
</div>
</div>
);
}

const styles = {
container: {
display: 'flex',
flexDirection: 'column' as const,
minHeight: '100vh',
backgroundColor: '#f5f5f7',
fontFamily: 'inherit',
position: 'relative' as const,
},
header: {
padding: '20px 20px 16px',
borderBottom: '1px solid rgba(255,255,255,0.2)',
background: 'rgba(255,255,255,0.8)',
backdropFilter: 'blur(20px)',
position: 'sticky' as const,
top: 0,
zIndex: 10,
},
title: {
fontSize: 24,
fontWeight: 700,
color: '#1d1d1f',
margin: 0,
marginBottom: 4,
},
guideNote: {
fontSize: 12,
color: '#666',
fontStyle: 'italic',
margin: 0,
padding: '8px 12px',
backgroundColor: 'rgba(0,122,255,0.05)',
borderRadius: 8,
borderLeft: '3px solid #007aff',
display: 'inline-block' as const,
},
scrollableContent: {
flex: 1,
overflowY: 'auto' as const,
padding: '20px',
WebkitOverflowScrolling: 'touch' as const,
},
error: {
color: '#ff3b30',
fontSize: 14,
marginBottom: 10,
background: 'rgba(255,59,48,0.1)',
padding: '12px 16px',
borderRadius: 12,
},
fixedBottom: {
position: 'fixed' as const,
bottom: 0,
left: 0,
right: 0,
padding: '16px 20px',
background: 'rgba(255,255,255,0.9)',
backdropFilter: 'blur(20px)',
borderTop: '1px solid rgba(0,0,0,0.05)',
zIndex: 100,
},
backButton: {
background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
color: 'white',
border: 'none',
borderRadius: 24,
padding: '14px 24px',
fontSize: 16,
fontWeight: 600,
cursor: 'pointer',
width: '100%',
boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
},
} as const;

export default KewajibanLayout;
