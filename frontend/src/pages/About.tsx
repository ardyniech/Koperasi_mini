import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../features/DashboardLayout';
import Button from '../components/atoms/Button';
import { useEffect, useState } from 'react';
import api from '../api';

interface UserProfile {
  id: number;
  nama: string;
  email: string;
  no_wa?: string;
  role: string;
  status: string;
}

export default function About() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <div className="p-4 text-center">Gagal memuat profil</div>;

  return (
    <DashboardLayout
      title="Profil Saya"
      showBackButton={true}
      onBack={() => navigate(-1)}
    >
      <div className="p-2 space-y-2">
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-emerald-800">
                {user.nama.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{user.nama}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {user.role === 'admin' ? 'Administrator' : 'Anggota'}
            </span>
          </div>

          <div className="bg-white/50 rounded-2xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-slate-700">Biodata</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Anggota</span>
                <span className="font-medium text-slate-800">KMS{user.id.toString().padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-medium text-slate-800">{user.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
              {user.no_wa && (
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp</span>
                  <span className="font-medium text-slate-800">{user.no_wa}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium ${user.status === 'Aktif' ? 'text-green-600' : 'text-red-600'}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="silhouette" 
          size="lg" 
          fullWidth 
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </Button>
      </div>
    </DashboardLayout>
  );
}
