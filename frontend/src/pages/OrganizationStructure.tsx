import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Settings } from 'lucide-react';

const OrganizationStructure: React.FC = () => {
  const structure = [
    { role: 'Ketua', name: 'Ahmad Fauzi, S.E.' },
    { role: 'Sekretaris', name: 'Siti Nurhaliza, S.Kom.' },
    { role: 'Bendahara', name: 'Muhammad Rasyid, A.Md.' },
    { role: 'Pengawas', name: 'Dr. H. Budi Santoso, M.M.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100/50 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Struktur Organisasi
            </h1>
          </div>

          <div className="space-y-4">
            {structure.map((person, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{person.role}</p>
                  <p className="text-sm text-gray-600">{person.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm text-amber-800 flex items-start gap-2">
              <Settings className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Struktur ini dapat diperbarui melalui menu <strong className="ml-1">Settings → Organization</strong> oleh administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStructure;
