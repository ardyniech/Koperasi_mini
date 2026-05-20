import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && handleDismiss()}
    >
      <div className="glass-card w-11/12 max-w-sm rounded-3xl p-6 float-animation">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Download className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Pasang App</h3>
              <p className="text-xs text-slate-500">Koperasi Mini</p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-slate-600 mb-6">
          Pasang ke Home Screen untuk akses lebih cepat dan pengalaman layaknya app native.
        </p>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 text-sm font-medium text-slate-600 bg-slate-100/80 hover:bg-slate-200/80 rounded-2xl transition"
          >
            Nanti Saja
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-3 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
        </div>
      </div>
    </div>
  );
}
