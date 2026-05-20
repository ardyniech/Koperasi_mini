import { useState } from 'react';
import RegisterButton from './RegisterButton';
import { styles } from './registerFormStyles';

interface RegisterFormProps {
  onSubmit: (nama: string, email: string, noWa: string, password: string) => void;
  loading: boolean;
}

function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noWa, setNoWa] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize phone number (consistent with login)
    const cleaned = noWa.replace(/[^0-9]/g, '');
    let normalizedPhone = cleaned;
    if (cleaned.startsWith('0')) {
      normalizedPhone = '62' + cleaned.slice(1);
    } else if (!cleaned.startsWith('62')) {
      normalizedPhone = '62' + cleaned;
    }
    
    onSubmit(nama, email, normalizedPhone, password);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="nama" style={styles.label}>
          <span style={styles.labelIcon}>👤</span> Nama Lengkap
        </label>
        <input
          id="nama"
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          required
          autoFocus
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="email" style={styles.label}>
          <span style={styles.labelIcon}>📧</span> Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
          placeholder="contoh@email.com"
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="noWa" style={styles.label}>
          <span style={styles.labelIcon}>📱</span> No. WhatsApp
        </label>
        <input
          id="noWa"
          type="tel"
          value={noWa}
          onChange={e => setNoWa(e.target.value)}
          style={styles.input}
          placeholder="Contoh: 081234567890"
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="password" style={styles.label}>
          <span style={styles.labelIcon}>🔒</span> Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          placeholder="Minimal 6 karakter"
          required
          minLength={6}
        />
      </div>

      <RegisterButton loading={loading} />
    </form>
  );
}

export default RegisterForm;
