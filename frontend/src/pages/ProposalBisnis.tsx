import { FileText, Target, Lightbulb, Users, TrendingUp, Shield } from 'lucide-react';
import DashboardLayout from '../features/DashboardLayout';

export default function ProposalBisnis() {
  return (
    <DashboardLayout 
      title="Proposal Bisnis"
    >
      <div className="p-2 space-y-2">
        {/* Header Card */}
        <div className="glass-card rounded-3xl p-3 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Proposal Bisnis</h1>
          <p className="text-sm text-slate-500">Koperasi Mini Syariah - Modern & Syariah</p>
        </div>

        {/* Vision & Mission */}
        <div className="glass-card rounded-3xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-800">Visi & Misi</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Visi</h3>
              <p className="leading-relaxed">
                Menjadi koperasi digital terdepan yang menggabungkan prinsip syariah 
                dengan teknologi modern untuk memberdayakan ekonomi umat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Misi</h3>
              <ul className="list-disc list-inside space-y-1 leading-relaxed">
                <li>Menyediakan layanan keuangan syariah yang mudah diakses</li>
                <li>Mengimplementasikan teknologi AI untuk otomasi administrasi</li>
                <li>Membangun ekosistem ekonomi yang transparan dan adil</li>
                <li>Mendorong inklusi keuangan digital bagi seluruh lapisan masyarakat</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="glass-card rounded-3xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-800">Fitur Utama</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { icon: Users, title: 'Manajemen Anggota', desc: 'Sistem registrasi & profil anggota terpusat' },
              { icon: TrendingUp, title: 'Simpan & Pinjam', desc: 'Transaksi syariah dengan perhitungan otomatis' },
              { icon: Shield, title: 'Keamanan Data', desc: 'Enkripsi JWT & validasi ketat' },
              { icon: FileText, title: 'Laporan Real-time', desc: 'Dashboard analytics & riwayat transaksi' },
            ].map((feature, idx) => (
              <div key={idx} className="p-3 bg-white/30 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <feature.icon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-slate-700 text-sm">{feature.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="glass-card rounded-3xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h2 className="text-lg font-semibold text-slate-800">Teknologi</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React + Vite', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'PWA Ready', 'Playwright Testing', 'Docker Ready'].map((tech, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Business Model */}
        <div className="glass-card rounded-3xl p-3">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Model Bisnis</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="leading-relaxed">
              Koperasi Mini Syariah menganut prinsip bagi hasil (mudharabah) dan jual beli 
              (murabahah) yang sesuai dengan syariah Islam. Margin keuntungan transparan 
              dan dikelola secara profesional.
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <p className="text-emerald-800 font-medium text-xs">
                ✅ NO RIBA • NO DENDA • 100% SYARIAH COMPLIANT
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="glass-card rounded-3xl p-3 text-center">
          <h3 className="text-base font-semibold text-slate-800 mb-2">Tertarik untuk Bergabung?</h3>
          <p className="text-sm text-slate-500 mb-3">
            Hubungi kami untuk diskusi lebih lanjut tentang partnership
          </p>
          <button 
            onClick={() => window.location.href = '/about'}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Hubungi Kami
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
