import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../api';
import { Button } from '../atoms/Button';
import { AlertCircle, LogIn } from 'lucide-react';

// Normalize phone number to 628xxx format
const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    return '62' + cleaned;
  }
  return cleaned;
};

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
  onError: (msg: string) => void;
}

export default function LoginForm({ onLoginSuccess, onError }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('[Login] Submitting login form...', { identifier: identifier.substring(0, 3) + '***' });
    
    if (!identifier || !password) {
      const msg = 'Email/Nomor HP dan password wajib diisi';
      setError(msg);
      onError(msg);
      return;
    }
    
    setLoading(true);
    try {
      // Detect if identifier is email or phone
      const isEmail = identifier.includes('@');
      let payload: { password: string; email?: string; phone_number?: string } = { password };
      
      if (isEmail) {
        payload.email = identifier;
      } else {
        // Normalize phone number to 628xxx
        const normalizedPhone = normalizePhone(identifier);
        payload.phone_number = normalizedPhone;
        console.log('[Login] Normalized phone:', normalizedPhone);
      }
      
      console.log('[Login] Calling API login...', { type: isEmail ? 'email' : 'phone' });
      const res = await login(payload);
      console.log('[Login] Success! Token received');
      onLoginSuccess(res.data.access_token);
    } catch (err: unknown) {
      console.error('[Login] Error:', err);
      let msg = 'Email/Nomor HP atau password salah';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        if (response?.data?.detail) {
          msg = response.data.detail;
          console.log('[Login] Server error message:', msg);
        }
      }
      setError(msg);
      onError(msg);
    } finally {
      setLoading(false);
      console.log('[Login] Login attempt finished. loading=false');
    }
  };

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-8 mx-auto float-animation">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <LogIn className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Login</h3>
          <p className="text-sm text-slate-500">Masuk ke akun Anda</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Email / Nomor HP</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="email@contoh.com / 081234567890"
            className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>
        <Button
          type="submit"
          variant="glass-gold"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
          className="rounded-2xl py-3 text-base font-semibold"
        >
          {loading ? 'Memproses...' : 'Login'}
        </Button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-6">
        Belum punya akun?{' '}
        <Link to="/register" className="text-indigo-600 font-medium hover:underline">
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
}
