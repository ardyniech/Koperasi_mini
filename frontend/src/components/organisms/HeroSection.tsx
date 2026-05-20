import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Bolt, Eye, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface Settings {
  community_name: string;
  logo_url?: string;
  primary_color: string;
  footer_text: string;
  landing_headline: string;
  landing_description: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_website?: string;
}

interface HeroSectionProps {
  settings: Settings | null;
  setShowLoginPopup: (show: boolean) => void;
  setShowPopup: (show: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ settings, setShowLoginPopup, setShowPopup }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 font-sans">
      {/* Logo - Spacing atas minimal */}
      <header className="pt-1 pb-2 px-4">
        <div className="max-w-xl mx-auto text-center">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-12 mx-auto mb-2" />
          ) : (
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg">KS</span>
            </div>
          )}
          <h1 className="text-xl font-extrabold text-emerald-700">
            {settings?.community_name || 'Koperasi Mini Syariah'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-xl mx-auto">
          {/* Mosque Illustration - LOCKED SPEC: w-48 h-48 left-[-8px] top-[-16px] */}
          <div className="relative mb-6">
            <div className="w-48 h-48 bg-emerald-100 rounded-full mx-auto relative left-[-8px] top-[-16px] flex items-center justify-center">
              <div className="text-6xl">🕌</div>
              {/* HijabCartoon - LOCKED SPEC: w-16 h-16 */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👩🦰</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {settings?.landing_headline || 'Transaksi Syariah Modern'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {settings?.landing_description || 'Koperasi simpan pinjam syariah dengan sistem bagi hasil (mudharabah) dan jasa layanan (jual beli).'}
            </p>
          </div>

          {/* Features - Simplified Icons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Aman</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Bolt className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Cepat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Transparan</p>
            </div>
          </div>

          {/* Action Buttons - LOCKED SPEC: tombol 20px (padding?) */}
          <div className="space-y-3">
            <button
              onClick={() => setShowLoginPopup(true)}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            <Link
              to="/register"
              className="block w-full py-3 bg-white border border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition text-center"
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Daftar Anggota
            </Link>
            <button
              onClick={() => setShowPopup(true)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Struktur Organisasi
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-snug">Transaksi berkah untuk semuanya.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
