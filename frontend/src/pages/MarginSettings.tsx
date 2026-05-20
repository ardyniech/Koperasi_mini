import { useState, useEffect } from 'react';
import api, { SettingsUpdate } from '../api';
import { AxiosError } from 'axios';
import DashboardLayout from '../features/DashboardLayout';
import { styles } from './marginSettingsStyles';

export default function MarginSettings() {
  const [marginPersen, setMarginPersen] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/settings/admin').then((res) => {
      if (res.data.margin_persen !== undefined) {
        setMarginPersen(res.data.margin_persen.toString());
      }
      setLoading(false);
    }).catch(() => {
      setError('Gagal memuat settings');
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    const margin = Number(marginPersen);

    if (isNaN(margin) || margin < 0 || margin > 100) {
      setError('Margin harus antara 0-100%');
      setSaving(false);
      return;
    }

    try {
      const data: SettingsUpdate = { margin_persen: margin };
      await api.put('/settings/admin', data);
      setSuccess('Margin syariah berhasil diupdate!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof AxiosError ? err.response?.data?.detail || 'Gagal update' : 'Gagal update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><div style={styles.loading}>Memuat...</div></DashboardLayout>;
  
  return (
    <DashboardLayout 
      title="Pengaturan Margin Syariah"

    >
      <div style={styles.scrollableContent}>
        <div style={styles.card}>
          {error && <div style={styles.error}><span style={styles.errorIcon}>⠀️</span> {error}</div>}
          {success && <div style={styles.success}><span style={styles.successIcon}>✅</span> {success}</div>}

          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Margin Syariah (% per tahun)</label>
              <input 
                type="number" 
                value={marginPersen} 
                onChange={(e) => setMarginPersen(e.target.value)} 
                placeholder="Contoh: 5" 
                step="0.1" 
                min="0" 
                max="100" 
                style={styles.input} 
                required 
              />
              <p style={styles.hint}>
                Margin syariah bukan bunga. Nilai: 0-100% per tahun. Default: 5%
              </p>
            </div>

            <div style={styles.infoBox}>
              <h4 style={styles.infoTitle}>📊 Informasi Perhitungan:</h4>
              <p style={styles.infoText}>
                • Margin dihitung: (Nominal × Margin% × Tenor) ÷ (12 × 100)<br/>
                • Contoh: Pinjam Rp10.000.000, margin 5%, tenor 12 bulan<br/>
                • Total margin: (10jt × 5% × 12) ÷ 12 = Rp500.000<br/>
                • Angsuran: (10jt + 500rb) ÷ 12 = Rp875.000/bulan
              </p>
            </div>

            <button 
              onClick={handleSave} 
              disabled={saving} 
              style={saving ? { ...styles.button, opacity: 0.6 } : styles.button}
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
