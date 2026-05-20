import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import NavPopup from '../features/NavPopup';
import SaldoPopup from '../features/SaldoPopup';
import DashboardTransactions from '../features/DashboardTransactions';
import StatCard from '../components/molecules/StatCard';
import { playWhooshSound } from '../utils/sound';
import Footer from '../features/Footer';

interface Transaction {
  nama: string;
  jenis: string;
  tanggal: string;
  jumlah: number;
}

const dummyTransactions: Transaction[] = [
  { nama: 'Budi Santoso', jenis: 'Simpanan Sukarela', tanggal: '02 Mei 2026', jumlah: 500000 },
  { nama: 'Siti Aminah', jenis: 'Angsuran Pinjaman', tanggal: '01 Mei 2026', jumlah: 1200000 },
];

export default function DashboardTest() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [showSaldoPopup, setShowSaldoPopup] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const handleNavOpen = () => { playWhooshSound(); setNavOpen(true); };
  const handleSaldoOpen = () => { playWhooshSound(); setShowSaldoPopup(true); };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <NavPopup isOpen={navOpen} onClose={() => setNavOpen(false)} userRole="admin" />
      <SaldoPopup isOpen={showSaldoPopup} onClose={() => setShowSaldoPopup(false)} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-12 bg-white/75 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <button
              ref={hamburgerRef}
              onClick={handleNavOpen}
              className="mr-3 text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Administrator</p>
              <p className="text-xs text-green-600 font-semibold">Online</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-2 space-y-2">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <StatCard title="Total Anggota" value="1,234" variant="blue" onClick={() => navigate('/anggota')} />
            <StatCard title="Saldo" value="Rp 125,000,000" variant="emerald" onClick={handleSaldoOpen} />
            <StatCard title="Pinjaman Aktif" value="Rp 45,500,000" variant="amber" onClick={() => navigate('/pinjaman/approval')} />
          </div>

          {/* Transaction Table */}
          <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between bg-white/30">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Transaksi Terbaru</h2>
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Lihat Semua</a>
            </div>
            <DashboardTransactions transactions={dummyTransactions} />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
