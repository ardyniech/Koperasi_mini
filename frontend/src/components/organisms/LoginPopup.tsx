import React from 'react';
import { LogIn, X, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginPopupProps {
  showLoginPopup: boolean;
  setShowLoginPopup: (show: boolean) => void;
  identifier: string;
  setIdentifier: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
  success: string;
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const LoginPopup: React.FC<LoginPopupProps> = ({
  showLoginPopup,
  setShowLoginPopup,
  identifier,
  setIdentifier,
  password,
  setPassword,
  error,
  success,
  handleLoginSubmit,
}) => {
  if (!showLoginPopup) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={() => setShowLoginPopup(false)}
    >
      <div 
        className="glass-card w-80 rounded-3xl p-6 float-animation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-xs text-green-700">{success}</p>
          </div>
        )}
        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email / Nomor HP</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email@contoh.com / 081234567890"
              className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition shadow-sm"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center mt-4">
          Belum punya akun? <a href="/register" className="text-indigo-600 font-medium">Daftar</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
