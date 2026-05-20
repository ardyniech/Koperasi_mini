import React from 'react';
import { X, Heart, Building2, BookOpen } from 'lucide-react';

interface DetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    {
      title: 'Creator Info & Donasi',
      description: 'Tentang pembuat dan dukungan pengembangan',
      icon: Heart,
      path: '/creator-info',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      title: 'Struktur Organisasi',
      description: 'Susunan pengurus koperasi (bisa diedit via Settings)',
      icon: Building2,
      path: '/organization-structure',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Story Behind',
      description: 'Cerita personal di balik aplikasi ini',
      icon: BookOpen,
      path: '/story-behind',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300 float-animation">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">More Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-3">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.path}
              className={`block p-4 ${link.bgColor} ${link.borderColor} border rounded-2xl hover:shadow-md transition-all group`}
              onClick={onClose}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 bg-gradient-to-br ${link.color} rounded-xl shadow-sm flex-shrink-0`}>
                  <link.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {link.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;
