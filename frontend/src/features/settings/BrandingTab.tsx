import React from 'react';
import BrandingField from './BrandingField';

interface Settings {
  community_name: string;
  logo_url?: string;
  primary_color: string;
  footer_text: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_website?: string;
}

interface BrandingTabProps {
  settings: Settings;
  handleChange: (field: keyof Settings, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function BrandingTab({ settings, handleChange, handleSubmit }: BrandingTabProps) {
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.subtitle}>Branding</h3>
      
      <BrandingField 
        label="Nama Komunitas" 
        value={settings.community_name} 
        onChange={(val) => handleChange('community_name', val)} 
      />
      <BrandingField 
        label="Logo URL" 
        value={settings.logo_url || ''} 
        onChange={(val) => handleChange('logo_url', val)} 
        placeholder="https://..." 
      />
      <BrandingField 
        label="Primary Color" 
        value={settings.primary_color} 
        onChange={(val) => handleChange('primary_color', val)} 
        type="color" 
      />
      <BrandingField 
        label="Footer Text" 
        value={settings.footer_text} 
        onChange={(val) => handleChange('footer_text', val)} 
      />

      <h3 style={styles.subtitle}>Social Media Links</h3>
      
      <BrandingField 
        label="Instagram URL" 
        value={settings.social_instagram || ''} 
        onChange={(val) => handleChange('social_instagram', val)} 
        placeholder="https://instagram.com/..." 
      />
      <BrandingField 
        label="LinkedIn URL" 
        value={settings.social_linkedin || ''} 
        onChange={(val) => handleChange('social_linkedin', val)} 
        placeholder="https://linkedin.com/in/..." 
      />
      <BrandingField 
        label="Website URL" 
        value={settings.social_website || ''} 
        onChange={(val) => handleChange('social_website', val)} 
        placeholder="https://..." 
      />

      <button type="submit" style={styles.submitButton}>
        Simpan Settings
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1d1d1f',
    marginTop: 0,
    marginBottom: 10,
  },
  submitButton: {
    background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 24,
    padding: '14px 24px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
    marginTop: 10,
  },
};

export default BrandingTab;
