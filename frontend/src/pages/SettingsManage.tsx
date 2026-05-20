import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettingsAdmin, updateSettingsAdmin, resetDatabaseAdmin } from '../api';
import BrandingTab from '../features/settings/BrandingTab';
import DatabaseTab from '../features/settings/DatabaseTab';
import CommunityTab from '../features/settings/CommunityTab';
import SettingsTabBar, { TabType } from '../features/settings/SettingsTabBar';
import DashboardLayout from '../features/DashboardLayout';

interface Settings {
  community_name: string;
  logo_url?: string;
  primary_color: string;
  footer_text: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_website?: string;
}

interface CommunityStructure {
  ketua: string;
  bendahara: string;
  sekretaris: string;
}

function SettingsManage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('branding');
  const [settings, setSettings] = useState<Settings>({
    community_name: 'Koperasi Mini Syariah',
    primary_color: '#007aff',
    footer_text: 'Powered by Ardyniech',
  });
  const [community, setCommunity] = useState<CommunityStructure>({
    ketua: '', bendahara: '', sekretaris: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSettingsAdmin().then(res => setSettings(res.data)).catch(() => setError('Gagal memuat settings'));
  }, []);

  const handleChange = (field: keyof Settings, value: string) => setSettings({ ...settings, [field]: value });
  const handleCommunityChange = (field: keyof CommunityStructure, value: string) => setCommunity({ ...community, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await updateSettingsAdmin(settings);
      setMessage('Settings berhasil diupdate!');
    } catch { setError('Gagal update settings'); }
  };

  const handleResetDB = async () => {
    if (confirmText !== 'KONFIRMASI HAPUS DATA') { setError('Teks konfirmasi tidak sesuai!'); return; }
    setDeleting(true); setError(''); setMessage('');
    try {
      const res = await resetDatabaseAdmin();
      if (res.data.status === 'success') {
        setMessage('Database berhasil direset!');
        setConfirmText('');
      } else {
        setError('Gagal reset: ' + res.data.message);
      }
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { message?: string; detail?:string } } };
      const errorMsg = error.response?.data?.message || error.response?.data?.detail || error.message;
      setError('Gagal reset: ' + errorMsg);
      console.error('[Settings] Reset error:', errorMsg);
    } finally { setDeleting(false); }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="min-h-screen bg-slate-50/50 p-3 sm:p-4 pb-20">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">⚙️ Settings</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola pengaturan koperasi</p>
        </div>

        {/* Message/Error Alerts */}
        {message && (
          <div className="mb-4 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <p className="text-xs sm:text-sm text-emerald-700">✅ {message}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-xs sm:text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
          {/* Tab Bar - Scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide border-b border-slate-100">
            <SettingsTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {activeTab === 'branding' && (
              <BrandingTab settings={settings} handleChange={handleChange} handleSubmit={handleSubmit} />
            )}
            {activeTab === 'database' && (
              <DatabaseTab 
                confirmText={confirmText} 
                setConfirmText={setConfirmText} 
                handleResetDB={handleResetDB} 
                deleting={deleting} 
              />
            )}
            {activeTab === 'community' && (
              <CommunityTab community={community} handleCommunityChange={handleCommunityChange} />
            )}
            {activeTab === 'margin' && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">📊</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Pengaturan Margin Syariah</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
                  Atur besaran margin syariah untuk pengajuan pinjaman. 
                  Margin ini akan otomatis digunakan untuk semua pengajuan dari anggota.
                </p>
                <button
                  onClick={() => navigate('/settings/margin')}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-2xl transition-colors active:scale-95"
                >
                  Buka Pengaturan Margin →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsManage;
