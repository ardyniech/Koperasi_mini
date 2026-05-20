import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Sparkles, AlertCircle, Monitor, Code } from 'lucide-react';

const StoryBehind: React.FC = () => {
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Story Behind
            </h1>
          </div>
          <p className="text-sm italic text-gray-500 ml-12 mb-6">
            "Bukan basa-basi seperti kebanyakan apps dan cerita visi misi yang membosankan. Ini adalah cerita ku sendiri."
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <h2 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Monumen Bertahan Hidup: Di Balik Koperasi Mini
              </h2>
              <p className="mb-4">
                Sistem ini lahir dari mesin yang hampir dibuang: sebuah Sony Vaio tua dengan layar bergaris parah. Di saat saya memaksa jantung mesin itu berdetak lagi sebagai server 24/7, dunia saya sendiri sebenarnya sedang runtuh.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100">
              <h2 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Bertahan di Titik Nadir
              </h2>
              <p className="mb-3">
                Empat bulan terakhir adalah badai. Perceraian, tekanan sosial, hingga rasa lapar yang nyata karena kondisi keuangan jatuh ke titik minus. Seringkali, saya harus bekerja serabutan hanya untuk mencari sesuap nasi, sebelum kembali bergelut dengan barisan kode.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <h2 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Mengetik di Layar Sempit
              </h2>
              <p className="mb-3">
                Karena layar laptop sudah hancur tak terbaca, arsitektur sistem ini saya bangun baris demi baris hanya bermodalkan layar HP kecil sebagai remote access. Di tengah malam yang dingin, saya mengetik logika sistem dalam senyap, sambil memakai topeng "semua baik-baik saja" di hadapan keluarga.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <h2 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Lebih dari Sekadar Kode
              </h2>
              <p className="mb-3">
                Hari ini, Koperasi Mini berdiri dengan stabil. Bagi saya, ini bukan sekadar pencapaian teknologi, melainkan bukti nyata bahwa saya menolak untuk hancur. Ia adalah saksi bisu bahwa karya hebat bisa lahir dari hati yang patah, perut yang lapar, dan tekad yang menolak menyerah pada keadaan.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 text-center">
              <Heart className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="font-medium text-amber-800 mb-4">
                "Jika anda ingin mengapresiasi hasil karya ini, dan dukung pengembangan apps ini, Donasi anda sangat berarti"
              </p>
              
              {/* QRIS Image */}
              <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mb-4">
                <img 
                  src="/qris-image.jpg" 
                  alt="QRIS Donasi" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <p className="text-emerald-800 font-medium italic">
                "Terimakasih and god bless u all."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryBehind;
