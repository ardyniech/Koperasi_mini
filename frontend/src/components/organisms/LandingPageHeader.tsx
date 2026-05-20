
interface HeaderProps {
title: string;
onBack: () => void;
}

export default function LandingPageHeader({ title, onBack }: HeaderProps) {
return (
<div style={styles.header}>
<h2 style={styles.title}>{title}</h2>
<button onClick={onBack} style={styles.backButton}>
← Kembali ke Dashboard
</button>
</div>
);
}

const styles = {
header: {
display: 'flex' as const,
justifyContent: 'space-between' as const,
alignItems: 'center' as const,
marginBottom: 20,
},
title: {
fontSize: 24,
fontWeight: 600,
margin: 0,
color: '#1d1d1f',
},
backButton: {
background: 'none' as const,
border: 'none' as const,
color: '#007aff',
fontSize: 14,
cursor: 'pointer' as const,
},
};
