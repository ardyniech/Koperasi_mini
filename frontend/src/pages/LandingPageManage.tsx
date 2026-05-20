import { useState, useEffect } from 'react';
import { getSettingsAdmin, updateSettingsAdmin } from '../api';
import DashboardLayout from '../features/DashboardLayout';
import { styles } from './landingPageManageStyles';

interface Settings {
  landing_headline: string;
  landing_description: string;
  landing_features?: string;
}

export default function LandingPageManage() {
  const [settings, setSettings] = useState<Settings>({
    landing_headline: 'Koperasi Mini Syariah',
    landing_description: 'Sistem transparansi koperasi syariah untuk komunitas kecil.',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSettingsAdmin().then(res => {
      setSettings({
        landing_headline: res.data.landing_headline,
        landing_description: res.data.landing_description,
        landing_features: res.data.landing_features,
      });
    }).catch(() => setError('Gagal memuat settings'));
  }, []);

  const handleChange = (field: keyof Settings, value: string) => 
    setSettings({ ...settings, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await updateSettingsAdmin(settings);
      setMessage('Landing page berhasil diupdate!');
    } catch { setError('Gagal update landing page'); }
  };

  return (
    <DashboardLayout 
      title="Manage Landing Page"

    >
      <div style={styles.header}>
        <h2 style={styles.title}>📝 Manage Landing Page</h2>
      </div>
      <div style={styles.scrollableContent}>
        <div style={styles.card}>
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Headline</label>
              <input 
                type="text" 
                value={settings.landing_headline} 
                onChange={e => handleChange('landing_headline', e.target.value)} 
                style={styles.input} 
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea 
                value={settings.landing_description} 
                onChange={e => handleChange('landing_description', e.target.value)} 
                style={styles.textarea} 
                rows={4} 
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Features (JSON string, optional)</label>
              <textarea 
                value={settings.landing_features || ''} 
                onChange={e => handleChange('landing_features', e.target.value)} 
                style={styles.textarea} 
                rows={3} 
                placeholder='["Fitur 1", "Fitur 2"]' 
              />
            </div>
            <button type="submit" style={styles.submitButton}>Simpan Landing Page</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
