import { Button } from '../atoms/Button';

interface DashboardHeaderProps {
nama: string;
email: string;
role: string;
status: string;
onLogout?: () => void;
}

export default function DashboardHeader({ nama, email, role, status, onLogout }: DashboardHeaderProps) {
// Get greeting based on time
const getGreeting = () => {
const hour = new Date().getHours();
if (hour < 12) return 'Selamat pagi';
if (hour < 15) return 'Selamat siang';
if (hour < 18) return 'Selamat sore';
return 'Selamat malam';
};

return (
<div style={styles.headerRow}>
<div>
<h2 style={styles.greeting}>{getGreeting()}, <strong>{nama}</strong> 👋</h2>
<p style={styles.subtitle}>Selamat datang di Dashboard Koperasi Mini Syariah</p>
<div style={styles.info}>
<p style={styles.infoItem}>Email: {email}</p>
<p style={styles.infoItem}>Role: {role} | Status: {status}</p>
</div>
</div>
{onLogout && (
<Button variant="silhouette" onClick={onLogout}>
🚪 Logout
</Button>
)}
</div>
);
}

const styles = {
headerRow: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: 20,
},
greeting: {
color: '#1d1d1f',
marginBottom: '8px',
fontSize: 24,
fontWeight: 600,
},
subtitle: {
color: '#86868b',
marginBottom: 20,
fontSize: 14,
},
info: {
display: 'flex',
flexDirection: 'column' as const,
gap: 4,
marginTop: 15,
},
infoItem: {
color: '#3a3a3c',
fontSize: 14,
margin: 0,
},
} as const;
