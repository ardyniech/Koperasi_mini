import { Link } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { styles } from './registerLayoutStyles';

interface RegisterLayoutProps {
  children: React.ReactNode;
  error: string;
  success?: string;
}

function RegisterLayout({ children, error, success }: RegisterLayoutProps) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{...styles.headerIcon, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <FileText size={48} />
        </div>
        <h2 style={styles.title}>Buat Akun Baru</h2>
        <p style={styles.subtitle}>Bergabunglah dengan Koperasi Mini Syariah</p>
        <p style={styles.guideNote}>Silakan isi data lengkap untuk mendaftar sebagai anggota koperasi.</p>
        
        {error && (
          <div style={styles.error}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        {success && (
          <div style={styles.success}>
            <CheckCircle size={18} />
            {success}
          </div>
        )}
        
        {children}
        
        <div style={styles.divider}>
          <span style={styles.dividerText}>atau</span>
        </div>

        <p style={styles.switchText}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.link}>Login di sini →</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterLayout;
