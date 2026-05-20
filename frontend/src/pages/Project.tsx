import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../features/DashboardLayout';
import Button from '../components/atoms/Button';
import { Plus } from 'lucide-react';

export default function Project() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout
      title="Dana Patungan"

      showBackButton={true}
      onBack={() => navigate(-1)}
    >
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-slate-800">Dana Patungan</h1>
          <Button 
            variant="silhouette" 
            size="md" 
            onClick={() => alert('Fitur buat project baru coming soon!')}
          >
            <Plus className="w-4 h-4" />
            Buat Project Baru
          </Button>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-sm hover:scale-[1.02] transition-transform duration-200 text-center">
          <p className="text-slate-500">Belum ada project dana patungan.</p>
          <p className="text-sm text-slate-400 mt-2">Klik "Buat Project Baru" untuk memulai.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
