import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../api';
import Footer from '../features/LandingFooter';
import { Button } from '../components/atoms/Button';
import { ShieldCheck, Bolt, Eye, Heart, UserPlus, LogIn, X, Info } from 'lucide-react';
import api from '../api';
import DetailsPopup from '../features/DetailsPopup';

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

function LandingPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  useEffect(() => {
    getSettings().then(res => setSettings(res.data)).catch(() => console.error('Failed to load settings'));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await api.post('/auth/login', {
        identifier: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem('token', response.data.access_token);
      setShowLoginPopup(false);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      let errorMessage = 'Login gagal. Cek email/password.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; detail?: string } } };
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.detail || errorMessage;
      }
      setLoginError(errorMessage);
      console.error('[Login] Error:', errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 font-sans">
        {/* Logo - Spacing atas minimal */}
        <header className="pt-1 pb-2 px-4">
          <div className="max-w-xl mx-auto text-center">
            {settings?.logo_url && (
              <img 
                src={settings.logo_url} 
                alt="Logo" 
                className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover shadow-lg border-2 border-white"
              />
            )}
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 pb-2 text-center">
          {/* Headline - Ideal HP font size */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-snug tracking-tight">
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent">
              {settings?.landing_headline || 'Koperasi Mini Syariah'}
            </span>
            <span className="block text-xl md:text-2xl font-semibold text-gray-700 mt-1">
              Transparansi Modern
            </span>
          </h1>

          {/* Description - Readable for HP */}
          <p className="text-base text-gray-600 mb-5 leading-normal">
            {settings?.landing_description || 'Kelola simpan pinjam tanpa riba, tanpa denda. Sistem transparan yang membawa berkah untuk semua anggota.'}
          </p>

          {/* Woman Hijab + Guide Note */}
          <div className="relative mb-2" style={{ minHeight: '180px' }}>
            <img src="/mosque-icon.png" alt="Hijab Woman Salam" className="absolute left-[-8px] top-[-16px] w-48 h-48 object-contain" />
            <div className="ml-44 md:ml-52 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-3 md:p-4 shadow-sm relative max-w-[calc(100%-1rem)] md:max-w-full break-words">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200/60"></div>
              <p className="text-sm md:text-base text-amber-900 leading-relaxed">
                <span className="font-semibold">Assalamualaikum!</span><br />
                Saya Deina, Silakan bergabung dan nikmati kemudahannya utk komunitas anda
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3 justify-center items-center mb-0">
            <Button 
              label="Login" 
              icon={<LogIn className="w-5 h-5" />}
              variant="glass-gold"
              floating={true}
              className="flex-1 group w-full text-[20px] py-1.5 px-3"
              onClick={() => setShowLoginPopup(true)}
            />
            <Link to="/register" className="flex-1 group">
              <Button 
                label="Daftar" 
                icon={<UserPlus className="w-5 h-5" />}
                variant="silhouette"
                floating={true}
                className="w-full text-[20px] py-1.5 px-3"
              />
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">100% Syariah</h3>
              <p className="text-xs text-gray-500 leading-snug">Tanpa bunga riba, tanpa denda.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-blue-100/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Bolt className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">Cepat & Digital</h3>
              <p className="text-xs text-gray-500 leading-snug">Input instan, akses real-time.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-amber-100/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">Transparan</h3>
              <p className="text-xs text-gray-500 leading-snug">Pantau saldo & SHU real-time.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">Penuh Berkah</h3>
              <p className="text-xs text-gray-500 leading-snug">Transaksi berkah untuk semuanya.</p>
            </div>
          </div>

          {/* See more details button */}
          <div className="flex justify-center mt-2">
            <button 
              className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors group"
              onClick={() => setShowDetailsPopup(true)}
            >
              <span className="relative inline-flex items-center justify-center">
                <img 
                  src="/hijab-cartoon.png" 
                  alt="Hijab Cartoon" 
                  className="w-16 h-16 relative z-10 object-contain"
                />
                <span className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-50"></span>
              </span>
              <span>See more details</span>
              <Info className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>

        <Footer 
          footer_text={settings?.footer_text || 'Powered by Ardyniech'} 
          social_instagram={settings?.social_instagram} 
          social_linkedin={settings?.social_linkedin} 
          social_website={settings?.social_website} 
        />
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
          onClick={() => setShowLoginPopup(false)}
        >
          <div 
            className="glass-card w-80 rounded-3xl p-6 float-animation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Login</h3>
                  <p className="text-xs text-slate-500">Masuk ke akun Anda</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginPopup(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
                  <span className="text-red-700 text-sm">{loginError}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email / Nomor HP</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login Sekarang
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-4">
              Belum punya akun? <a href="/register" className="text-indigo-600 font-medium">Daftar</a>
            </p>
          </div>
        </div>
      )}

      {/* Details Popup */}
      {showDetailsPopup && (
        <DetailsPopup isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} />
      )}
    </>
  );
}

export default LandingPage;
