import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

const CreatorInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100/50 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Creator & Donasi
            </h1>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <h2 className="font-semibold text-emerald-800 mb-2">Tentang Pembuat</h2>
              <p>
                Aplikasi Koperasi Mini Syariah ini dikembangkan dengan fokus pada kemudahan, 
                transparansi, dan prinsip syariah. Dibangun menggunakan teknologi modern 
                (React + FastAPI) dengan arsitektur yang bersih dan scalable.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <h2 className="font-semibold text-amber-800 mb-2">Dukung Pengembangan</h2>
              <p className="mb-4">
                Jika Anda merasa aplikasi ini bermanfaat, dukungan Anda sangat berarti 
                untuk pengembangan fitur baru dan pemeliharaan sistem.
              </p>
              <div className="flex justify-center p-4 bg-white rounded-xl border border-amber-200">
                <img 
                  src="/qris-image.jpg" 
                  alt="QRIS Donation" 
                  className="w-48 h-auto rounded-lg"
                />
              </div>
              <p className="text-center text-sm text-amber-700 mt-2">
                Scan QRIS untuk berdonasi
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <h2 className="font-semibold text-blue-800 mb-2">Kontak</h2>
              <p>Email: admin@koperasiminislamic.com</p>
              <p>WhatsApp: +62 812-3456-7890</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-sm text-amber-800 italic">
                *Konten ini dapat diperbarui melalui menu Settings oleh administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorInfo;
